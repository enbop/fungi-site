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

In this example, assume your two devices are named `my-laptop` and `home-pc`.

## Before You Start

1. Install Fungi CLI on both devices from [Install Fungi](/docs/install).
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


## Step 2: Add `my-laptop` To `home-pc`'s Address Book

On `home-pc`, try local discovery first:

```bash
./fungi device mdns
```

If both devices are on the same LAN, you may see output like this:

```text
16Uiu2H........Co7Cw9 -  (macbook-pro)
```

If mDNS does not find the other device, copy the PeerID manually from `./fungi info id` on `my-laptop`.

>The name in parentheses [`(macbook-pro)`] is the discovered device hostname, not your local Fungi alias.

Now save that PeerID in the address book on `home-pc`:

```bash
./fungi device add --alias my-laptop 16Uiu2H........Co7Cw9
```

>`alias` and hostname are different:
>- the hostname comes from the remote device and usually looks like a system name such as `macbook-pro`
>- the `alias` is the name you choose locally for that peer, such as `my-laptop`
>- different devices can show similar or changing hostnames, but your `alias` is the stable name you use in Fungi commands
>- in this guide, you will mainly use the `alias`

To verify the saved entry:

```bash
./fungi device list
```

## Step 3: Allow `my-laptop` To Access `home-pc`

On `home-pc`, allow inbound access from `my-laptop`:

```bash
./fungi security allowed-peers add my-laptop
```

Fungi will show a confirmation screen before it updates the allowlist.

```text
================ SECURITY CONFIRMATION ================
You are about to trust this peer for incoming access:
  Peer: my-laptop
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
>```bash
>./fungi security allowed-peers add my-laptop
>./fungi security allowed-peers add 16Uiu2H........Co7Cw9
>```

## Step 4: Add `home-pc` To `my-laptop`'s Address Book

Go back to `my-laptop`.

Find `home-pc` with mDNS:

```bash
./fungi device mdns
```

Example output:

```text
16Uiu2H........ZC3bdZ -  (workstation-b)
```

Then save it locally:

```bash
./fungi device add --alias home-pc 16Uiu2H........ZC3bdZ
```

## Step 5: Ping `home-pc` From `my-laptop`

On `my-laptop`, run:

```bash
./fungi ping home-pc
```

Expected output looks like this:

```text
Target peer: home-pc(16Uiu2H........ZC3bdZ)
Ping stream peer=16Uiu2H........ZC3bdZ interval=2000ms (Ctrl+C to stop)
TICK   CONN   DIR      RLY   RTT        ADDR/MSG
0      -      -        -     -          connecting
1      6      outbound no    5ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
2      6      outbound no    6ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
```

If you see round-trip time values such as `5ms` or `6ms`, the secure P2P link is working.

## What Just Happened?

You created a one-way trust relationship:

- `home-pc` allows inbound access from `my-laptop`
- `my-laptop` can now open a connection to `home-pc`
- `home-pc` still cannot control `my-laptop` unless you explicitly allow it too

That is why the reverse direction will fail:

on `home-pc`:
```bash
./fungi ping my-laptop
```
```text
TICK   CONN   DIR      RLY   RTT        ADDR/MSG
0      -      -        -     -          connecting
1      -      -        -     -          no active connections
2      -      -        -     -          no active connections
```

This is expected. Fungi does not automatically create mutual trust.

## Next Step

Continue with [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app).

If you want more detail before that, see:

- [Fungi CLI Guide](/docs/cli-service-quick-start)
- [Connection Diagnostics](/docs/connection-diagnostics)
- [Remote Service Control](/docs/remote-service-control)
- [Services And Runtimes](/docs/service-manifests)