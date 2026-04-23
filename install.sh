#!/bin/sh

set -eu

REPO="enbop/fungi"
INSTALL_DIR="${FUNGI_INSTALL_DIR:-$HOME/.local/bin}"
VERSION="${FUNGI_VERSION:-}"

usage() {
  cat <<'EOF'
Usage: install.sh [--version <tag>] [--install-dir <dir>]

Options:
  --version <tag>      Install a specific release tag, for example v0.6.0-preview or nightly.
  --install-dir <dir>  Install directory for the fungi binary.
  --help               Show this help text.

Environment:
  FUNGI_VERSION        Same as --version. Use nightly for the nightly channel.
  FUNGI_INSTALL_DIR    Same as --install-dir.
EOF
}

say() {
  printf '%s\n' "$*"
}

fail() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "required command not found: $1"
}

download() {
  url="$1"
  output="$2"
  curl -fsSL --proto '=https' --tlsv1.2 --retry 3 --output "$output" "$url"
}

sha256_file() {
  file="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
    return
  fi

  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
    return
  fi

  fail "need sha256sum or shasum to verify the downloaded archive"
}

detect_platform() {
  os_name=$(uname -s)
  arch_name=$(uname -m)

  case "$os_name" in
    Darwin)
      case "$arch_name" in
        arm64|aarch64)
          PLATFORM="macos-aarch64"
          ;;
        *)
          fail "unsupported macOS architecture: $arch_name. Please use GitHub Releases, build from source, or open an issue: https://github.com/$REPO/issues"
          ;;
      esac
      ;;
    Linux)
      case "$arch_name" in
        x86_64|amd64)
          PLATFORM="linux-x86_64"
          ;;
        arm64|aarch64)
          PLATFORM="linux-aarch64"
          ;;
        *)
          fail "unsupported Linux architecture: $arch_name. Please use GitHub Releases, build from source, or open an issue: https://github.com/$REPO/issues"
          ;;
      esac
      ;;
    *)
      fail "unsupported operating system: $os_name. Please use GitHub Releases, build from source, or open an issue: https://github.com/$REPO/issues"
      ;;
  esac
}

release_base_url() {
  if [ -n "$VERSION" ]; then
    printf 'https://github.com/%s/releases/download/%s' "$REPO" "$VERSION"
  else
    printf 'https://github.com/%s/releases/latest/download' "$REPO"
  fi
}

validate_version() {
  case "$VERSION" in
    ""|*[!A-Za-z0-9._+-]*)
      if [ -n "$VERSION" ]; then
        fail "--version may only contain letters, numbers, dots, underscores, plus signs, and hyphens"
      fi
      ;;
  esac
}

validate_install_dir() {
  [ -n "$INSTALL_DIR" ] || fail "--install-dir must not be empty"

  case "$INSTALL_DIR" in
    *'
'*)
      fail "--install-dir must not contain newlines"
      ;;
  esac

  cr=$(printf '\r')
  case "$INSTALL_DIR" in
    *"$cr"*)
      fail "--install-dir must not contain carriage returns"
      ;;
  esac
}

is_nightly() {
  [ "$VERSION" = "nightly" ]
}

install_names() {
  if is_nightly; then
    BINARY_NAME="fungi-nightly"
    SERVICE_NAME="fungi-nightly"
    SERVICE_DESCRIPTION="Fungi nightly daemon"
  else
    BINARY_NAME="fungi"
    SERVICE_NAME="fungi"
    SERVICE_DESCRIPTION="Fungi daemon"
  fi
}

systemd_quote_exec_path() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/%/%%/g'
}

install_systemd_user_service() {
  case "$PLATFORM" in
    linux-x86_64|linux-aarch64) ;;
    *) return 0 ;;
  esac

  if ! command -v systemctl >/dev/null 2>&1; then
    return 0
  fi

  unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
  unit_path="$unit_dir/$SERVICE_NAME.service"
  mkdir -p "$unit_dir"
  exec_path=$(systemd_quote_exec_path "$TARGET_PATH")

  cat > "$unit_path" <<EOF
[Unit]
Description=$SERVICE_DESCRIPTION
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart="$exec_path" daemon
Restart=on-failure
RestartSec=5
WorkingDirectory=%h

[Install]
WantedBy=default.target
EOF

  systemctl --user daemon-reload >/dev/null 2>&1 || true
}

print_path_hint() {
  case ":$PATH:" in
    *:"$INSTALL_DIR":*)
      ;;
    *)
      say "Add this line to your shell profile, then restart the shell:"
      say "  export PATH=\"$INSTALL_DIR:\$PATH\""
      ;;
  esac
}

print_linux_service_hint() {
  case "$PLATFORM" in
    linux-x86_64|linux-aarch64) ;;
    *) return 0 ;;
  esac

  say ""
  say "Linux service commands:"
  say "  The installer writes the service unit but does not start or enable it automatically."
  say "  Start the daemon in the background now:"
  say "    systemctl --user start $SERVICE_NAME.service"
  say "  Start it automatically when your user logs in:"
  say "    systemctl --user enable $SERVICE_NAME.service"
  say "  Keep it available after a real reboot before login:"
  say "    sudo loginctl enable-linger \"$USER\""
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --version)
      shift
      [ "$#" -gt 0 ] || fail "--version requires a value"
      VERSION="$1"
      ;;
    --install-dir)
      shift
      [ "$#" -gt 0 ] || fail "--install-dir requires a value"
      INSTALL_DIR="$1"
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      fail "unknown argument: $1"
      ;;
  esac
  shift
done

validate_version
validate_install_dir

need_cmd curl
need_cmd tar
need_cmd mktemp

detect_platform
install_names

ARTIFACT="fungi-$PLATFORM.tar.gz"
BASE_URL=$(release_base_url)
ARCHIVE_URL="$BASE_URL/$ARTIFACT"
CHECKSUM_URL="$ARCHIVE_URL.sha256"

TMP_DIR=$(mktemp -d)
TMP_TARGET=""
cleanup() {
  if [ -n "$TMP_TARGET" ] && [ -e "$TMP_TARGET" ]; then
    rm -f "$TMP_TARGET"
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

download "$ARCHIVE_URL" "$TMP_DIR/$ARTIFACT"
download "$CHECKSUM_URL" "$TMP_DIR/$ARTIFACT.sha256"

EXPECTED_SHA=$(awk '{print $1}' "$TMP_DIR/$ARTIFACT.sha256")
[ -n "$EXPECTED_SHA" ] || fail "failed to read checksum from $CHECKSUM_URL"

ACTUAL_SHA=$(sha256_file "$TMP_DIR/$ARTIFACT")
[ "$EXPECTED_SHA" = "$ACTUAL_SHA" ] || fail "checksum mismatch for $ARTIFACT"

tar -xzf "$TMP_DIR/$ARTIFACT" -C "$TMP_DIR" fungi
[ -f "$TMP_DIR/fungi" ] || fail "archive did not contain the fungi binary"

mkdir -p "$INSTALL_DIR"
TARGET_PATH="$INSTALL_DIR/$BINARY_NAME"
TMP_TARGET=$(mktemp "$INSTALL_DIR/.$BINARY_NAME.tmp.XXXXXX")

cp "$TMP_DIR/fungi" "$TMP_TARGET"
chmod 755 "$TMP_TARGET"
mv -f "$TMP_TARGET" "$TARGET_PATH"
TMP_TARGET=""

if [ "$(uname -s)" = "Darwin" ] && command -v xattr >/dev/null 2>&1; then
  xattr -d com.apple.quarantine "$TARGET_PATH" >/dev/null 2>&1 || true
fi

install_systemd_user_service

INSTALLED_VERSION=$($TARGET_PATH --version 2>/dev/null || printf '%s <unknown version>' "$BINARY_NAME")
say "Installed Fungi successfully."
say "  Binary: $TARGET_PATH"
say "  Version: $INSTALLED_VERSION"
say ""
say "If your current shell does not find '$BINARY_NAME' immediately, run 'hash -r' or restart the shell."
print_path_hint
print_linux_service_hint
