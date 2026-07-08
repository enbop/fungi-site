---
title: Self-hosted Relay
description: Run and configure your own Fungi relay.
sidebar_position: 9
slug: /self-hosted-relay
---

# Self-hosted Relay

A relay helps devices connect when direct paths are blocked by NAT or firewalls.

## Start A Relay

On a public server:

```bash
fungi daemon relay-server -p ${SERVER_PUBLIC_IP}
```

The relay listens on TCP and UDP port `30001` by default.

Useful options:

```bash
fungi daemon relay-server \
  -p ${SERVER_PUBLIC_IP} \
  --tcp-listen-port 30001 \
  --udp-listen-port 30001 \
  --max-circuit-duration-secs 86400
```

## Copy Relay Addresses

The relay prints addresses like:

```text
/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx
/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx
```

Keep both when possible. Fungi groups candidates by relay device and tries UDP/QUIC first, then TCP fallback.

## Configure Clients

If you want to use only your relay:

```bash
fungi relay use-community off
fungi relay add "/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx"
fungi relay add "/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx"
```

Inspect relay configuration:

```bash
fungi relay show
```

Re-enable community relays:

```bash
fungi relay use-community on
```

Remove a custom relay:

```bash
fungi relay remove "/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx"
```

## Check Runtime Status

```bash
fungi conn relay-status --verbose
```

A ready endpoint has a relay listener and a direct connection to the relay. If UDP cannot be established in the current attempt, Fungi falls back to TCP for that relay device.

## Notes

- Open your firewall for both TCP and UDP on the configured relay ports.
- Adding custom relay addresses does not automatically disable community relays. Use `fungi relay use-community off` when you want only your relay.
- If relay config changes while daemons are running, restart them to make the runtime state easy to reason about.
