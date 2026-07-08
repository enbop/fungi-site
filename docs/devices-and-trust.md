---
title: Devices And Trust
description: Device names, Device IDs, saved addresses, and incoming trust.
sidebar_position: 5
slug: /devices-and-trust
---

# Devices And Trust

Fungi keeps device handling explicit:

- a **Device ID** is the cryptographic identity of a daemon
- a **device name** is your local nickname for that ID
- **trust** controls which saved devices may initiate incoming Fungi service requests

## Find This Device ID

```bash
fungi info id
```

## Discover Local Devices

```bash
fungi device mdns
```

mDNS discovery is useful on a local network. For remote machines, copy the Device ID manually and optionally add a direct multiaddr.

## Save Devices

```bash
fungi device add my-mac <device-id>
```

Add a user-managed direct address:

```bash
fungi device add my-mac <device-id> --addr /ip4/203.0.113.10/tcp/4001/p2p/<device-id>
```

Manage saved devices:

```bash
fungi device list
fungi device get my-mac
fungi device rename my-mac desktop
fungi device remove desktop
```

Manage saved direct addresses:

```bash
fungi device address list my-mac
fungi device address add my-mac /ip4/203.0.113.10/tcp/4001/p2p/<device-id>
fungi device address remove my-mac /ip4/203.0.113.10/tcp/4001/p2p/<device-id>
```

## Trust Devices

Trust is separate from saving a device. Save first, then trust:

```bash
fungi device trust my-mac
fungi device trusted
fungi device untrust my-mac
```

Run `fungi device trust` on the device that should accept incoming Fungi service requests.

## Device Names In Service Commands

Most service commands accept `-d, --device`:

```bash
fungi service list --device my-mac
```

The most common remote service target can also be written inline:

```bash
fungi service apply files@my-mac --recipe <recipe-id> --start
fungi service connect files@my-mac
fungi files@my-mac
```
