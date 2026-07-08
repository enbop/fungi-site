---
title: Connection Diagnostics
description: Inspect active connections, streams, relay status, and ping behavior.
sidebar_position: 8
slug: /connection-diagnostics
---

# Connection Diagnostics

Use these commands when a device or service should be reachable but is not behaving as expected.

The daemon must be running.

## Overview

```bash
fungi connection overview
fungi conn overview
```

Filter by low-level device identity:

```bash
fungi conn overview --peer-id 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Filter by protocol:

```bash
fungi conn overview --protocol-name /fungi/service/web/main/0.2.0
```

Verbose output includes policy and per-protocol stream details:

```bash
fungi conn overview --verbose
```

## Streams

```bash
fungi conn streams
fungi conn streams --peer-id 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
fungi conn streams --protocol-name /fungi/service/web/main/0.2.0
fungi conn streams --verbose
```

## Relay Status

```bash
fungi conn relay-status
fungi conn relay-status --verbose
```

Relay candidates are grouped by relay device. Fungi tries UDP/QUIC first and falls back to TCP for the same relay when needed. A ready relay endpoint has both a registered circuit listener and a direct connection to the relay.

## Learned Addresses

```bash
fungi conn addr-candidates
fungi conn peer-addresses
```

These are advanced diagnostics for observed local addresses and device addresses learned by Fungi-owned state.

## Ping

Ping a saved device name:

```bash
fungi ping my-mac
```

Or ping by raw identity:

```bash
fungi ping 16Uiu2HAmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Set an interval:

```bash
fungi ping my-mac --interval-ms 1000
```

Stop with `Ctrl+C`.

## Troubleshooting Flow

1. Run `fungi device list` to confirm the device name is saved.
2. Run `fungi device trusted` on the target side to confirm trust.
3. Run `fungi ping <device>` to test stream creation.
4. Run `fungi conn relay-status --verbose` if the device needs relay fallback.
5. Run `fungi conn overview --verbose` while opening `service@device` to see service streams.
