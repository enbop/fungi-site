---
title: Fungi CLI Guide
description: Detailed guide to the Fungi CLI commands, daemon workflow, peer context, and service basics.
sidebar_position: 2
---

# Fungi CLI Guide

If you are new to Fungi, start with the quick starts first:

- [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network)
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)

```bash
$ ./fungi help
A platform built for seamless multi-device integration

Usage: fungi [OPTIONS] <COMMAND>

Commands:
  init          Initialize a Fungi configuration, and generate a keypair
  daemon        Start a Fungi daemon
  relay         Start a simple Fungi relay server
  info          Show daemon information
  security      Manage runtime safety boundary settings and incoming peer allowlists [aliases: sec]
  ft-service    Manage file transfer service [aliases: fs]
  ft-client     Manage file transfer client config and FTP and WebDAV proxies [aliases: fc]
  tunnel        Manage TCP tunneling [aliases: tn]
  service       Manage local runtime services from manifests or service handles [aliases: svc]
  catalog       Browse published remote services
  access        Manage local access entries for remote services
  peer          Query and administer remote peers
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
| **Daemon Management Commands** | `info`, `security` (`sec`), `tunnel` (`tn`), `service` (`svc`), `catalog`, `access`, `peer`, `device` | Communicate with running daemon via gRPC. **Require `fungi daemon` to be running first.** |
| **Connection Diagnostics Commands** | `connection` (`conn`), `ping` | Observe active connections/streams and continuously measure peer RTT. **Require `fungi daemon` to be running first.** |

## Prerequisites

1. Install Fungi CLI first from [Install Fungi](/docs/install)
2. Keep one terminal available for `fungi daemon`
3. Know the PeerIDs of the devices you want to connect

## Step 1: Initialize Configuration

First, initialize the configuration file (use `-f` to specify a custom path if needed; global options should be placed before the command):

```bash
./fungi init
# custom config dir
./fungi -f /path/to/fungi init
# rewrite an existing config.toml using the current schema/default sections
./fungi init --upgrade-config
```

This will create a configuration file at `~/.fungi/config.toml` and display the path in the output.

## Step 2: Start the Daemon

Start the Fungi daemon (use `-f` to specify a custom config path if needed; place it before `daemon`):

```bash
./fungi daemon
# custom config dir
./fungi -f /path/to/fungi daemon
```

Keep the daemon running in this terminal.

## Step 3: Get Your PeerID

Open a new terminal and get your device's PeerID:

```bash
./fungi info id
```

This will display your device's PeerID, which you can share with other devices that need to connect to you.

## Step 3.5: Name Remote Peers In The Address Book

New user-facing peer workflows are alias-first. Before adding a peer to security policy or targeting it with remote commands, register it with a unique alias:

```bash
./fungi device add 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --alias macbook
./fungi device list
./fungi peer use macbook
./fungi peer current
```

After `peer use`, later `catalog`, `access`, and `peer admin` commands can omit `--peer`. The CLI prints the resolved target peer before each remote operation so you can see exactly which node it is using.

## Step 4: Configure Trust And Start A Local Service

Now you can configure your Fungi services while the daemon is running.

### Add Allowed Peers

> **⚠️ Security Notice:** Only add peers you trust. Devices in the allowed peers list will have access to your device through Fungi services (file sharing, port forwarding).

Add a named peer to the incoming allowlist:

```bash
./fungi security allowed-peers add macbook
```

Or use the short top-level alias:

```bash
./fungi sec allowed-peers add macbook
```

To view the current list of allowed peers:

```bash
./fungi sec allowed-peers list
```

Pull and start a local service:

```bash
./fungi service pull ./examples/service-manifests/filebrowser.service.yaml
./fungi service start filebrowser
./fungi service inspect filebrowser
```

For a remote-node workflow built on `peer`, `catalog`, and `access`, continue with [Remote Service Control](remote-service-control).

## Optional: Check Connection Health

Use diagnostics when you want to verify active links and stream state:

```bash
./fungi conn overview
./fungi conn streams
./fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --interval-ms 2000
```

Add `--verbose` when you need full peer IDs and detailed addresses.

## Next Reading

- [Remote Service Control](remote-service-control): use `peer`, `catalog`, and `access` to manage a remote node and open its web app locally.
- [Services And Runtimes](service-manifests): service manifest structure and runtime details.
- [Built-in WASI Support](wasi): run or serve WASI workloads.
- [Deprecated File Transfer](deprecated-file-transfer): old FTP/WebDAV-based file sharing path.

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

> **⚠️ Security Notice:** Only add trusted peers here. Devices in the allowed peers list will have access to your device through Fungi services (file sharing, port forwarding).

You can also manage this list using `./fungi security allowed-peers add` and `./fungi security allowed-peers list`.

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

> **Note:** After editing the configuration file, you need to restart the daemon for changes to take effect. CLI commands like `./fungi sec allowed-peers add macbook` take effect immediately without restarting.

## Related Guides

- [Connection Diagnostics](connection-diagnostics)
- [gRPC Guide](grpc-guide)
- [Self-hosted Relay](self-hosted-relay)
- [Built-in WASI Support](wasi)