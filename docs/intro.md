---
sidebar_position: 1
---

# Fungi Documentation

Fungi helps you connect multiple devices through encrypted P2P networking, then expose services and files safely across your own device mesh.

If you're new here, start with [CLI Service Quick Start](cli-service-quick-start).

Download the latest binaries from [GitHub Releases](https://github.com/enbop/fungi/releases/latest).

## Core Concepts

- **Daemon-first architecture**: `fungi daemon` runs networking, discovery, relay fallback, and service state.
- **Multiple control clients**: Fungi CLI, Fungi App, and any gRPC client all control the same daemon API.
- **PeerID-based trust**: inbound access is controlled by allowed peers.
- **Service gateway model**: expose local TCP services, transfer files, and forward traffic across devices.

## What You Can Do Today

- **Share files between devices** by exposing a local folder and accessing it remotely.
- **Access remote services securely** by forwarding ports through your private P2P network.
- **Check connection health** with built-in tools for active links, streams, and latency.
- **Run WebAssembly workloads (experimental)** for lightweight cross-device app scenarios.

## Documentation Map

- [CLI Service Quick Start](cli-service-quick-start): setup, daemon control, file sharing, tunneling.
- [Connection Diagnostics](connection-diagnostics): inspect active streams and continuously ping peers.
- [gRPC Guide](grpc-guide): integrate your own scripts/tools with daemon APIs.
- [Self-hosted Relay](self-hosted-relay): run your own relay infrastructure.
- [Built-in WASI Support](wasi): run or serve WASI modules through Fungi CLI.

## Recommended Reading Paths

### For CLI Users

1. [CLI Service Quick Start](cli-service-quick-start)
2. [Connection Diagnostics](connection-diagnostics)
3. [Self-hosted Relay](self-hosted-relay)

### For Integrators

1. [gRPC Guide](grpc-guide)
2. [CLI Service Quick Start](cli-service-quick-start) (for config and operational baseline)

### For Experimental WASI Workloads

1. [CLI Service Quick Start](cli-service-quick-start)
2. [Built-in WASI Support](wasi)