---
title: "3-Minute Quick Start: Build Your Private P2P Network"
description: "Connect two of your own devices with Fungi, trust them safely, and verify the link with ping."
slug: /quick-start/private-p2p-network
---

# 3-Minute Quick Start: Build Your Private P2P Network

This guide shows the shortest beginner-friendly path to connect two of your own devices with Fungi.

You will:

- start the Fungi daemon on both devices
- add each device to the other device's address book
- allow inbound access only for your own device
- verify the connection with `fungi ping`

In this example:

- Device A: `laptop-A`
- Device B: `pc-B`

If you want the longer CLI walkthrough, see [Fungi CLI Quick Start](/docs/cli-service-quick-start). If you want to run an app after the devices can talk to each other, continue with [3-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app).

## Before You Start

1. Download Fungi CLI on both devices from [GitHub Releases](https://github.com/enbop/fungi/releases/latest).
2. Open two terminals on each device if possible:
   - one terminal for `fungi daemon`
   - one terminal for the commands in this guide
3. Make sure both devices can reach the internet, or at least the same local network.

## Step 1: Start The Daemon On Both Devices

Run this command on both devices:

```bash
./fungi daemon
```

You will see startup logs similar to this:

```text
Configuration file already exists at $HOME/.fungi/config.toml
INFO [fungi::commands::fungi_daemon] Starting Fungi daemon...
Fungi directory: "$HOME/.fungi"
Loading Fungi config from: "$HOME/.fungi/config.toml"
...
INFO [libp2p_swarm] local_peer_id=...
...
```

Keep `fungi daemon` running on both devices.

In another terminal, you can print the current device's PeerID:

```bash
./fungi info id
```


## Step 2: Add `Device A` To `Device B`'s Address Book

On `pc-B`, try local discovery first:

```bash
./fungi device mdns
```

If both devices are on the same LAN, you may see output like this:

```text
16Uiu2H........Co7Cw9 -  (laptop-A)
```

If mDNS does not find the other device, copy the PeerID manually from `./fungi info id` on `laptop-A`.

Now save that PeerID in the address book on `pc-B`:

```bash
./fungi device add --alias laptop-A 16Uiu2H........Co7Cw9
```

You can use any `alias` you want. The `alias` is only a local nickname.

To verify the saved entry:

```bash
./fungi device list
```

## Step 3: Allow `Device A` To Access `Device B`

On `pc-B`, allow inbound access from `laptop-A`:

```bash
./fungi security allowed-peers add laptop-A
```

Fungi will show a confirmation screen before it updates the allowlist.

```text
================ SECURITY CONFIRMATION ================
You are about to trust this peer for incoming access:
  Peer: laptop-A
  Peer ID: 16Uiu2H........Co7Cw9

This peer will be able to:
  1. Access these allowed host paths:
    - $HOME/.fungi/services
  2. Manage services on this device
  3. Use these explicitly allowed host ports:
    - none configured
  4. Use these allowed host port ranges:
    - 18080-18199
=======================================================
Proceed? [Y/n]:
```

Important:

- **only allow your own devices**
- **never add an unknown PeerID**

> The `alias` can be used here, but a raw `PeerID` also works. For example, both of these are valid:

```bash
./fungi security allowed-peers add laptop-A
./fungi security allowed-peers add 16Uiu2H........Co7Cw9
```

## Step 4: Add `Device B` To `Device A`'s Address Book

Go back to `laptop-A`.

Find `pc-B` with mDNS:

```bash
./fungi device mdns
```

Example output:

```text
16Uiu2H........ZC3bdZ -  (pc-B)
```

Then save it locally:

```bash
./fungi device add --alias pc-B 16Uiu2H........ZC3bdZ
```

## Step 5: Ping `Device B` From `Device A`

On `laptop-A`, run:

```bash
./fungi ping pc-B
```

Expected output looks like this:

```text
Target peer: pc-B(16Uiu2H........ZC3bdZ)
Ping stream peer=16Uiu2H........ZC3bdZ interval=2000ms (Ctrl+C to stop)
TICK   CONN   DIR      RLY   RTT        ADDR/MSG
0      -      -        -     -          connecting
1      6      outbound no    5ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
2      6      outbound no    6ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
```

If you see round-trip time values such as `5ms` or `6ms`, the secure P2P link is working.

## What Just Happened?

You created a one-way trust relationship:

- `pc-B` allows inbound access from `laptop-A`
- `laptop-A` can now open a connection to `pc-B`
- `pc-B` still cannot control `laptop-A` unless you explicitly allow it too

That is why the reverse direction may still fail:

```bash
./fungi ping laptop-A
```

Possible output on `pc-B`:

```text
TICK   CONN   DIR      RLY   RTT        ADDR/MSG
0      -      -        -     -          connecting
1      -      -        -     -          no active connections
2      -      -        -     -          no active connections
```

This is expected. Fungi does not automatically create mutual trust.

## Next Step

Now that the two devices can talk to each other, continue with [3-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app).

If you want more detail before that, see:

- [Connection Diagnostics](/docs/connection-diagnostics)
- [Remote Service Control](/docs/remote-service-control)
- [Services And Runtimes](/docs/service-manifests)