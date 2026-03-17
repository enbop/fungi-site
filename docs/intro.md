---
sidebar_position: 1
---

# Fungi Documentation

Fungi helps you build a private encrypted P2P device network, then run and consume capability-first services across that network.

If you're new here, start with [CLI Service Quick Start](cli-service-quick-start).

Download the latest binaries from [GitHub Releases](https://github.com/enbop/fungi/releases/latest).

## Core Concepts

- **Daemon-first architecture**: `fungi daemon` runs networking, discovery, relay fallback, and service state.
- **Multiple control clients**: Fungi CLI, Fungi App, and any gRPC client all control the same daemon API.
- **PeerID-based trust**: inbound access is controlled by allowed peers.
- **Capability-first services**: publish container or WASI workloads according to explicit runtime and network policy.

## What You Can Do Today

- **Build a private device mesh** for your own machines without depending on a public control plane.
- **Run capability-first container and WASI services** under explicit runtime policy.
- **Control remote nodes from the CLI** and open published web apps locally through `access open`.
- **Check connection health** with built-in tools for active links, streams, and latency.

## Documentation Map

- [CLI Service Quick Start](cli-service-quick-start): shortest path to init, trust, and start a local service.
- [Services And Runtimes](service-manifests): service manifests, runtime model, and publish/access flow.
- [Runtime Examples](runtime-examples): direct Docker and Wasmtime manifest downloads plus side-by-side runtime examples.
- [Remote Service Control](remote-service-control): control a remote node, manage its services, and open its web app locally.
- [Connection Diagnostics](connection-diagnostics): inspect active streams and continuously ping peers.
- [gRPC Guide](grpc-guide): integrate your own scripts/tools with daemon APIs.
- [Self-hosted Relay](self-hosted-relay): run your own relay infrastructure.
- [Built-in WASI Support](wasi): run or serve WASI modules through Fungi CLI.
- [Deprecated File Transfer](deprecated-file-transfer): legacy FTP/WebDAV workflow kept only for compatibility.

## Recommended Reading Paths

### For CLI Users

1. [CLI Service Quick Start](cli-service-quick-start)
2. [Services And Runtimes](service-manifests)
3. [Runtime Examples](runtime-examples)
4. [Remote Service Control](remote-service-control)
5. [Connection Diagnostics](connection-diagnostics)
6. [Self-hosted Relay](self-hosted-relay)

### For Integrators

1. [gRPC Guide](grpc-guide)
2. [Services And Runtimes](service-manifests)
3. [Remote Service Control](remote-service-control)
4. [CLI Service Quick Start](cli-service-quick-start)

### For Experimental WASI Workloads

1. [CLI Service Quick Start](cli-service-quick-start)
2. [Services And Runtimes](service-manifests)
3. [Runtime Examples](runtime-examples)
4. [Built-in WASI Support](wasi)