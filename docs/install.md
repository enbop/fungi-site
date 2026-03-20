---
title: Install Fungi
description: Install Fungi with the one-line script, GitHub Releases, or from source.
sidebar_position: 2
slug: /install
---

# Install Fungi

## Quick Install

For macOS arm64, Linux x86_64, and Linux arm64:

```bash
curl -fsSL https://fungi.rs/install.sh | sh
```

This installs `fungi` into `~/.local/bin` by default.

You can inspect the script first at [https://fungi.rs/install.sh](https://fungi.rs/install.sh).

## GitHub Releases

If your platform is not covered by the quick installer, or you prefer manual installation, use [GitHub Releases](https://github.com/enbop/fungi/releases/latest).

Release assets currently include:

- macOS arm64
- Linux x86_64
- Linux arm64
- Windows x86_64

## Source Build

### Prerequisites

All platforms require:

- Rust toolchain
- Protocol Buffers compiler (`protoc`)

Ubuntu / Debian:

```bash
sudo apt-get install -y protobuf-compiler clang cmake ninja-build pkg-config
```

macOS:

```bash
brew install protobuf
```

Windows:

- Install aws-lc-rs build dependencies: https://aws.github.io/aws-lc-rs/requirements/windows.html
- Install `protoc`: `choco install protoc`

Build:

```bash
cargo build --release --bin fungi
```

Binary path:

```text
./target/release/fungi
```

## Linux systemd --user

On Linux, the install script also tries to write a user service to:

```text
~/.config/systemd/user/fungi.service
```

It also tries to run:

```bash
systemctl --user daemon-reload
systemctl --user enable fungi.service
```

Common commands:

```bash
systemctl --user start fungi.service
systemctl --user enable fungi.service
sudo loginctl enable-linger <user>
```

Meaning:

- `systemctl --user start fungi.service`: start the daemon in the background now
- `systemctl --user enable fungi.service`: start it automatically when your user logs in
- `sudo loginctl enable-linger <user>`: keep the user service available after a real reboot, even before login

More useful commands:

```bash
systemctl --user status fungi.service
systemctl --user restart fungi.service
journalctl --user -u fungi.service -f
```

For boot-time startup on headless Linux, a system administrator may also need to enable linger:

```bash
sudo loginctl enable-linger <user>
```

## Updating

For now, update by running the installer again:

```bash
curl -fsSL https://fungi.rs/install.sh | sh
```

If `fungi daemon` is already running, restart the daemon after updating so the running process picks up the new binary.

## Other

Install a specific version:

```bash
curl -fsSL https://fungi.rs/install.sh | sh -s -- --version v0.6.0-preview
```

Install to a custom directory:

```bash
curl -fsSL https://fungi.rs/install.sh | sh -s -- --install-dir "$HOME/.local/bin"
```