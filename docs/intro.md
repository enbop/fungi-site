---
sidebar_position: 1
---

# Fungi Documentation

Fungi helps you build a private encrypted P2P device network, then run and consume capability-first services across that network.

Install Fungi from the one-line installer, GitHub Releases, or source build: [Install Fungi](/docs/install).

## Start Here First

- [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network): connect two of your own devices and verify the link with `fungi ping`.
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app): start a sandboxed app on one device and open it locally from another device.

## Core Concepts

- **Daemon architecture**: `fungi daemon` runs networking, discovery, relay fallback, and service state.
- **Multiple control clients**: Fungi CLI, Fungi App, and any gRPC client all control the same daemon API.
- **PeerID-based trust**: inbound access is controlled by allowed peers.
- **Capability-first services**: publish container or WASI workloads according to explicit runtime and network policy.

## What You Can Do Today

- **Build a private device mesh** for your own machines without depending on a public control plane.
- **Run capability-first container and WASI services** under explicit runtime policy.
- **Control remote nodes from the CLI** and open published web apps locally through `access open`.
- **Check connection health** with built-in tools for active links, streams, and latency.

## Documentation Map

- [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network): the shortest newcomer path to connect two devices.
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app): the shortest newcomer path to run a remote app and open it locally.
- [Install Fungi](/docs/install): quick install, releases, Windows entry point, source build, and Linux `systemd --user` notes.
- [Fungi CLI Guide](/docs/cli-service-quick-start): detailed CLI setup flow for local init, trust, peer context, and service basics.
- [Services And Runtimes](/docs/service-manifests): service manifests, runtime model, and publish/access flow.
- [Runtime Examples](/docs/runtime-examples): direct Docker and Wasmtime manifest downloads plus side-by-side runtime examples.
- [Remote Service Control](/docs/remote-service-control): control a remote node, manage its services, and open its web app locally.
- [Connection Diagnostics](/docs/connection-diagnostics): inspect active streams and continuously ping peers.
- [gRPC Guide](/docs/grpc-guide): integrate your own scripts/tools with daemon APIs.
- [Self-hosted Relay](/docs/self-hosted-relay): run your own relay infrastructure.
- [Built-in WASI Support](/docs/wasi): run or serve WASI modules through Fungi CLI.
- [Deprecated File Transfer](/docs/deprecated-file-transfer): legacy FTP/WebDAV workflow kept only for compatibility.

## Recommended Reading Paths

### For CLI Users

1. [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network)
2. [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)
3. [Fungi CLI Guide](/docs/cli-service-quick-start)
4. [Services And Runtimes](/docs/service-manifests)
5. [Remote Service Control](/docs/remote-service-control)
6. [Connection Diagnostics](/docs/connection-diagnostics)
7. [Self-hosted Relay](/docs/self-hosted-relay)

### For Integrators

1. [gRPC Guide](grpc-guide)
2. [Services And Runtimes](service-manifests)
3. [Remote Service Control](remote-service-control)
4. [Fungi CLI Guide](cli-service-quick-start)

### For Experimental WASI Workloads

1. [Fungi CLI Guide](cli-service-quick-start)
2. [Services And Runtimes](service-manifests)
3. [Runtime Examples](runtime-examples)
4. [Built-in WASI Support](wasi)