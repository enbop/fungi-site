# Connection Diagnostics

This guide explains how to observe active connections and verify peer connectivity using Fungi CLI.

> Prerequisite: `fungi daemon` must be running.
>
> Need binaries first? Download Fungi CLI from [GitHub Releases](https://github.com/enbop/fungi/releases/latest).

## Why This Matters

When file transfer or tunneling behaves unexpectedly, these commands help you quickly answer:

- Is the peer currently connected?
- Are streams being created on expected protocols?
- Is latency stable across active links?

## Commands

Fungi provides two diagnostics entry points:

- `fungi connection` (alias: `fungi conn`) for connection and stream snapshots
- `fungi ping <peer_id>` for continuous RTT checks on active links

## Inspect Active Connections

Show an overview of active connections:

```bash
fungi conn overview
```

Filter by peer:

```bash
fungi conn overview --peer-id 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Filter by protocol:

```bash
fungi conn overview --protocol-name /fungi/tunnel/8080/1.0.0
```

Use verbose output:

```bash
fungi conn overview --verbose
```

## Inspect Active Streams

List active streams:

```bash
fungi conn streams
```

Filter options are the same as `overview`:

```bash
fungi conn streams --peer-id 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
fungi conn streams --protocol-name /fungi/tunnel/8080/1.0.0
fungi conn streams --verbose
```

## Continuous Peer Ping

Run continuous ping on all active connections to a peer:

```bash
fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Set custom interval (milliseconds):

```bash
fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --interval-ms 1000
```

Show detailed output:

```bash
fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --verbose
```

Stop with `Ctrl+C`.

## Practical Troubleshooting Flow

1. Run `fungi conn overview` to confirm the peer has active connections.
2. Run `fungi conn streams` to verify stream activity on expected protocols.
3. Run `fungi ping <peer_id>` to monitor RTT and check for intermittent instability.
4. If there are no active connections, verify allowed peers and relay/network settings in your config.

## Related Docs

- [CLI Service Quick Start](cli-service-quick-start)
- [gRPC Guide](grpc-guide)
- [Self-hosted Relay](self-hosted-relay)
