---
title: Fungi CLI Guide
description: Command-oriented guide to what the Fungi CLI commands do and when to use each group.
sidebar_position: 2
---

# Fungi CLI Guide

This page is a command guide, not a step-by-step onboarding flow.

If you want the shortest hands-on setup path first, start with the quick starts:

- [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network)
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)
- [2-Minute Quick Start: Forward A TCP Port](/docs/quick-start/tcp-tunnel)

```bash
$ fungi help
A platform built for seamless multi-device integration

Usage: fungi [OPTIONS] <COMMAND>

Commands:
  init          Initialize a Fungi configuration, and generate a keypair
  daemon        Start a Fungi daemon or relay-server
  relay         Manage relay configuration for the local daemon
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

Fungi CLI commands fall into four broad groups:

| Category | Commands | Notes |
|----------|----------|-------|
| **Core Daemon Commands** | `init`, `daemon` | Initialize Fungi, start the daemon, and manage relay settings |
| **WASI Runtime Commands** | `run`, `serve` | Re-exported wasmtime commands for WebAssembly modules |
| **Daemon Management Commands** | `info`, `security` (`sec`), `tunnel` (`tn`), `service` (`svc`), `catalog`, `access`, `peer`, `device` | Communicate with running daemon via gRPC. **Require `fungi daemon` to be running first.** |
| **Connection Diagnostics Commands** | `connection` (`conn`), `ping` | Observe active connections/streams and continuously measure peer RTT. **Require `fungi daemon` to be running first.** |

## Common Pattern

For almost everything except `init`, `daemon`, `run`, and `serve`, the CLI is talking to a running local daemon.

That means this is the normal baseline:

```bash
fungi daemon
```

Then open another terminal for the commands below.

If you need installation instructions, go to [Install Fungi](/docs/install).

## Core Commands

`init`

- creates the local Fungi config directory and key material
- use `fungi init --upgrade-config` when you want to rewrite an older config with current sections

Examples:

```bash
fungi init
fungi -f /path/to/fungi init
fungi init --upgrade-config
```

`daemon`

- starts the local daemon
- this is the main process behind most CLI commands
- also exposes `fungi daemon relay-server` for running a dedicated relay server process

Examples:

```bash
fungi daemon
fungi -f /path/to/fungi daemon
fungi daemon relay-server -p ${SERVER_PUBLIC_IP}
```

The relay-server command also accepts `--tcp-listen-port`, `--udp-listen-port`, `--max-circuit-duration-secs`, and `--max-circuit-bytes` when you need to tune self-hosted relay behavior.

`relay`

- manages which relay addresses this node uses for outbound connectivity
- works both before and after the daemon is already running

Examples:

```bash
fungi relay show
fungi relay use-community off
fungi relay add "/ip4/${SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx"
```

If you want to self-host a relay server or disable the community relay before first startup, see [Self-hosted Relay](/docs/self-hosted-relay).

## Info And Local Runtime Status

Use `info` when you want to inspect the local node itself.

Common commands:

```bash
fungi info id
fungi info runtime
```

What they are for:

- `info id` prints the current node's PeerID
- `info runtime` shows whether Docker and Wasmtime are configured, detected, and active

## Address Book And Peer Targeting

Use `device` to manage the local address book.

Common commands:

```bash
fungi device mdns
fungi device add <peer-id> --alias home-pc
fungi device list
```

Use `peer use` when you want later remote commands to default to one target peer:

```bash
fungi peer use home-pc
fungi peer current
```

This is the alias-first remote workflow Fungi is moving toward.

## Security Commands

Use `security` when you want to manage what remote peers are allowed to do against this node.

Common commands:

```bash
fungi security allowed-peers add home-pc
fungi security allowed-peers list
fungi sec allowed-peers add home-pc
```

Use this group for:

- incoming peer allowlists
- runtime safety boundaries such as host paths and ports
- checking what you are exposing to trusted peers

## Service Commands

Use `service` for local service lifecycle management from service manifests.

Common commands:

```bash
fungi service pull ./my-service.yaml
fungi service list
fungi service start my-service
fungi service inspect my-service
fungi service logs my-service --tail 50
fungi service stop my-service
fungi service remove my-service
```

Use this group when:

- the service runs on the current node
- you are testing a manifest locally before using it on another peer
- you want logs and inspect output for one named service instance

If you want to write your own manifest, continue with [Services And Runtimes](service-manifests).

## Remote Peer Commands

Use `peer admin service` when you want to control services on another node.

Typical commands:

```bash
fungi peer capability --peer <peer-id>
fungi peer admin service pull --peer <peer-id> ./my-service.yaml
fungi peer admin service list --peer <peer-id>
fungi peer admin service start --peer <peer-id> my-service
fungi peer admin service inspect --peer <peer-id> my-service
```

Use this group when:

- the service should run on a remote node
- you want to inspect that node's runtime capabilities first
- you want a controller machine to manage another device

## Catalog And Access Commands

Use `catalog` and `access` after a remote service is already running and exposed.

Typical commands:

```bash
fungi catalog list --peer <peer-id>
fungi catalog inspect --peer <peer-id> my-service
fungi access open --peer <peer-id> my-service
fungi access list --peer <peer-id>
fungi access detach --peer <peer-id> my-service
```

Use `catalog` for discovery and `access` for creating the local entry point to a remote service.

This is the right workflow when the remote app is managed by a service manifest.

## Tunnel Commands

Use `tunnel` for raw TCP forwarding rules.

Common commands:

```bash
fungi tunnel show
fungi tunnel add-listen 127.0.0.1:8080
fungi tunnel add-forward 127.0.0.1:18080 <peer-id> 8080
fungi tunnel remove-forward 127.0.0.1:18080 <peer-id> 8080
fungi tunnel remove-listen 127.0.0.1:8080
```

Use this group when:

- you already know the raw TCP port you want
- the target app is not managed by a Fungi service manifest
- you want a quick point-to-point forward

If the app is already managed as a Fungi service, you usually do not need to create tunnel rules by hand. Prefer `service`, `catalog`, and `access` instead.

For the shortest tunnel walkthrough, use [2-Minute Quick Start: Forward A TCP Port](/docs/quick-start/tcp-tunnel).

## Connection Diagnostics

Use `connection` and `ping` when you want to observe active connectivity instead of changing configuration.

Typical commands:

```bash
fungi conn overview
fungi conn streams
fungi ping <peer-id>
fungi ping <peer-id> --interval-ms 2000 --verbose
```

Use them when:

- a peer should already be reachable but is not behaving as expected
- you want to see active streams and protocols
- you want continuous RTT information

## WASI Runtime Commands

`run` and `serve` are direct Wasmtime command re-exports.

Examples:

```bash
fungi run ./component.wasm
fungi serve ./component.wasm
```

Use them when you want to run a Wasm component directly, outside the higher-level service-manifest workflow.

## Global Options

The most important global option is `--fungi-dir`.

Use it before the command name:

```bash
fungi -f /path/to/fungi info id
fungi -f /path/to/fungi daemon
```

## Configuration File Sections

If you prefer editing config directly instead of using CLI commands, these are the sections you will care about most.

### Network Settings

```toml
[network]
listen_tcp_port = 0  # 0 means auto-assign
listen_udp_port = 0  # 0 means auto-assign
incoming_allowed_peers = [
  "16Uiu2****"
]
```

### Port Forwarding

```toml
[tcp_tunneling.listening]
enabled = true
rules = [
  { host = "127.0.0.1", port = 22 }
  { host = "127.0.0.1", port = 8080 }
]
```

### File Sharing

```toml
[file_transfer.server]
enabled = true
shared_root_dir = "/tmp"
```

After editing the config file directly, restart the daemon for those changes to take effect. CLI commands such as `fungi sec allowed-peers add home-pc` apply immediately without a restart.

## Related Guides

- [Remote Service Control](remote-service-control)
- [Services And Runtimes](service-manifests)
- [2-Minute Quick Start: Forward A TCP Port](/docs/quick-start/tcp-tunnel)
- [Connection Diagnostics](connection-diagnostics)
- [gRPC Guide](grpc-guide)
- [Self-hosted Relay](self-hosted-relay)
- [Built-in WASI Support](wasi)