---
title: gRPC API
description: Integrate with the local Fungi daemon over gRPC.
sidebar_position: 10
slug: /grpc-guide
---

# gRPC API

Fungi CLI and Fungi App both control the local daemon through gRPC. Custom tools can use the same API.

## Server Address

By default, the daemon listens on:

```text
127.0.0.1:5405
```

Print the active address:

```bash
fungi info rpc-address
```

If you edit the daemon config directly, restart the daemon afterwards.

## Proto File

The service definition lives in the Fungi repository:

[fungi_daemon.proto](https://github.com/enbop/fungi/blob/master/crates/daemon-grpc/proto/fungi_daemon.proto)

Release builds may also publish a copy with release assets.

## Explore With grpcurl

Start the daemon:

```bash
fungi daemon
```

List methods:

```bash
grpcurl -plaintext -proto fungi_daemon.proto 127.0.0.1:5405 list fungi_daemon.FungiDaemon
```

Call a simple method:

```bash
grpcurl -plaintext -proto fungi_daemon.proto 127.0.0.1:5405 fungi_daemon.FungiDaemon/Version
```

## Current API Shape

The user-facing API follows the same device and service model as the CLI:

- device discovery and saved devices
- trusted devices
- local and remote services
- service recipes
- device service snapshots
- service access listeners
- relay configuration and connection diagnostics

Low-level protobuf field names may still use `peer_id` where the underlying libp2p identity is exposed.
