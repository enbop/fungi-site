# Fungi CLI

Fungi CLI is a powerful command-line tool for managing the Fungi daemon and multi-device integration platform.

```bash
$ ./fungi help
A platform built for seamless multi-device integration

Usage: fungi [OPTIONS] <COMMAND>

Commands:
  init          Initialize a Fungi configuration, and generate a keypair
  daemon        Start a Fungi daemon
  relay         Start a simple Fungi relay server
  info          Show daemon information
  allowed-peers Manage incoming allowed peers [aliases: ap]
  ft-service    Manage file transfer service [aliases: fs]
  ft-client     Manage file transfer client config and FTP and WebDAV proxies [aliases: fc]
  tunnel        Manage TCP tunneling [aliases: tn]
  device        Device discovery and address book
  connection    Connection observability and diagnostics [aliases: conn]
  ping          Continuously ping all active connections to a peer
  run           [WASI runtime] Run a WebAssembly module (re-exported wasmtime command)
  serve         [WASI runtime] Serve wasi-http requests (re-exported wasmtime command)
  help          Print this message or the help of the given subcommand(s)

Options:
  -f, --fungi-dir <FUNGI_DIR>  Path to the Fungi config directory, defaults to ~/.fungi
  -h, --help                   Print help
  -V, --version                Print version
```

## Command Overview

Fungi CLI commands can be divided into four main categories:

| Category | Commands | Notes |
|----------|----------|-------|
| **Core Daemon Commands** | `init`, `daemon`, `relay` | Initialize and start Fungi services |
| **WASI Runtime Commands** | `run`, `serve` | Re-exported wasmtime commands for WebAssembly modules |
| **Daemon Management Commands** | `info`, `allowed-peers` (`ap`), `ft-service` (`fs`), `ft-client` (`fc`), `tunnel` (`tn`), `device` | Communicate with running daemon via gRPC. **Require `fungi daemon` to be running first.** |
| **Connection Diagnostics Commands** | `connection` (`conn`), `ping` | Observe active connections/streams and continuously measure peer RTT. **Require `fungi daemon` to be running first.** |


# Fungi Service Quick Start

This guide shows you how to quickly set up Fungi CLI for file sharing and port forwarding.

## Prerequisites

1. Download and have Fungi CLI binary ready from [GitHub Releases](https://github.com/enbop/fungi/releases/latest)
2. Know the PeerIDs of other devices that will connect to this device (you'll add these as allowed peers)

## Step 1: Initialize Configuration

First, initialize the configuration file (use `-f` to specify a custom path if needed):

```bash
./fungi init
```

This will create a configuration file at `~/.fungi/config.toml` and display the path in the output.

## Step 2: Start the Daemon

Start the Fungi daemon (use `-f` to specify a custom config path if needed):

```bash
./fungi daemon
```

Keep the daemon running in this terminal.

## Step 3: Get Your PeerID

Open a new terminal and get your device's PeerID:

```bash
./fungi info id
```

This will display your device's PeerID, which you can share with other devices that need to connect to you.

## Step 4: Configure Services

Now you can configure your Fungi services while the daemon is running.

### Add Allowed Peers

> **⚠️ Security Notice:** Only add PeerIDs of devices you trust. Devices in the allowed peers list will have access to your device through Fungi services (file sharing, port forwarding).

Add the PeerID of devices you want to allow access to your current device:

```bash
./fungi allowed-peers add 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Or use the short alias:

```bash
./fungi ap add 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

To view the current list of allowed peers:

```bash
./fungi ap list
```

### Enable File Sharing

> File Transfer and Port Forwarding are independent features. You can configure and use either one without the other based on your needs.


If you want to share files, start the file transfer service with a shared directory:

```bash
./fungi ft-service start --root-dir /path/to/share
```

Or use the short alias:

```bash
./fungi fs start --root-dir /path/to/share
```

To check the file transfer service status:

```bash
./fungi fs status
```

To stop the file transfer service:

```bash
./fungi fs stop
```

### Enable Port Listening

If you want to expose ports to remote devices, add TCP listening rules:

```bash
# Add a port to expose (e.g., SSH on port 22)
./fungi tunnel add-listen 127.0.0.1:22
```

Or use the short alias:

```bash
./fungi tn add-listen 127.0.0.1:22
```

You can add multiple ports:

```bash
./fungi tn add-listen 127.0.0.1:8080  # Expose HTTP server
```

To view current tunneling configuration:

```bash
./fungi tn show
```

To remove a listening rule:

```bash
./fungi tn remove-listen 127.0.0.1:22
```

### Check Connection Health (Optional)

Use connection diagnostics commands to inspect active links and stream activity:

```bash
./fungi conn overview
./fungi conn streams
```

Continuously ping all active connections to a peer:

```bash
./fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --interval-ms 2000
```

Add `--verbose` to either command when you need full peer IDs and detailed addresses.

## Configuration File Reference

While the CLI commands above provide a convenient way to manage your Fungi daemon, you can also directly edit the configuration file at `~/.fungi/config.toml` for more advanced settings.

### Configuration File Structure

```toml
[rpc]
listen_address = "127.0.0.1:5405"

[network]
listen_tcp_port = 0
listen_udp_port = 0
incoming_allowed_peers = [
	"16Uiu2****" # Add allowed PeerID
]
disable_relay = false # Set to true to disable relay, the daemon will run in your local network only [Default is false]
custom_relay_addresses = []

[tcp_tunneling.forwarding]
enabled = false # Enable if you want to forward remote ports to this device
rules = []

[tcp_tunneling.listening]
enabled = true
rules = [
	{ host = "127.0.0.1", port = 22 } # Port to expose to remote devices (e.g., SSH)
]

[file_transfer.server]
enabled = true # Set to enable file server
shared_root_dir = "/tmp" # Change to the directory you want to share

# Below are optional configurations for file transfer client mode
[file_transfer.proxy_ftp]
enabled = false # Enable if you want to access files on remote devices via FTP
host = "127.0.0.1"
port = 2121

[file_transfer.proxy_webdav]
enabled = false # Enable if you want to access files on remote devices via WebDAV
host = "127.0.0.1"
port = 8181

[file_transfer]
client = [] # Add client config if you want to access files on remote devices
```

### Key Configuration Sections

#### Network Settings

```toml
[network]
listen_tcp_port = 0  # 0 means auto-assign
listen_udp_port = 0  # 0 means auto-assign
incoming_allowed_peers = [
	"16Uiu2****"  # PeerIDs that can connect to this device
]
```

> **⚠️ Security Notice:** Only add PeerIDs of devices you trust. Devices in the allowed peers list will have access to your device through Fungi services (file sharing, port forwarding).


You can also manage this list using the `./fungi ap add` and `./fungi ap list` commands.

#### Port Forwarding

```toml
[tcp_tunneling.listening]
enabled = true
rules = [
	{ host = "127.0.0.1", port = 22 }  # Expose SSH to remote devices
	{ host = "127.0.0.1", port = 8080 }  # Expose HTTP server
]
```

These ports will be accessible to allowed peers on your device.

#### File Sharing

```toml
[file_transfer.server]
enabled = true
shared_root_dir = "/tmp"  # Directory to share with remote devices
```

Remote devices will be able to browse and access files in this directory.

> **Note:** After editing the configuration file, you need to restart the daemon for changes to take effect. CLI commands like `./fungi ap add` take effect immediately without restarting.

## Related Guides

- [Connection Diagnostics](connection-diagnostics)
- [gRPC Guide](grpc-guide)
- [Self-hosted Relay](self-hosted-relay)
- [Built-in WASI Support](wasi)