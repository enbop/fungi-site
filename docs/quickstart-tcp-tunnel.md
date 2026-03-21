---
title: "2-Minute Quick Start: Forward A TCP Port"
description: "After two devices are already connected, expose one TCP port on the target device and forward it locally in a few commands."
slug: /quick-start/tcp-tunnel
sidebar_position: 3
---

# 2-Minute Quick Start: Forward A TCP Port

This guide starts where [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network) ends.

Use it when your devices are already connected and you want the shortest possible path to forward one TCP port.

This capability is only for raw TCP forwarding.

If the remote app is already managed by a Fungi service manifest, you usually do not need to create tunnel rules by hand. In that case, prefer the `service`, `catalog`, and `access` workflow instead.

In this example:

- `home-pc` already allows inbound access from `my-laptop`
- some app is already listening on `home-pc` at `127.0.0.1:8080`
- you want to reach it from `my-laptop` as `127.0.0.1:18080`

If your target app is not on `127.0.0.1:8080`, just replace the host and ports in the commands below.

## Before You Start

Verify the devices are already connected from `my-laptop`:

```bash
fungi ping home-pc
```

Also note one current limitation:

- `fungi tunnel add-forward` currently expects a raw peer ID, not a local alias

So first look up `home-pc` in your address book on `my-laptop`:

```bash
fungi device list
```

Copy the peer ID for `home-pc` from that output.

## Step 1: Expose The Port On `home-pc`

Run this on `home-pc`:

```bash
fungi tunnel add-listen 127.0.0.1:8080
```

What this does:

- it tells Fungi on `home-pc` to accept tunneled traffic for that local TCP endpoint
- it is just raw TCP forwarding

You can verify it:

```bash
fungi tunnel show
```

## Step 2: Create A Local Forward On `my-laptop`

Run this on `my-laptop` and replace `<home-pc-peer-id>` with the real peer ID you copied earlier:

```bash
fungi tunnel add-forward 127.0.0.1:18080 <home-pc-peer-id> 8080
```

What this does:

- binds a local TCP port on `my-laptop`
- sends traffic over the encrypted Fungi connection

Now you can use `127.0.0.1:18080` on `my-laptop` to access the remote service.


## Step 3: Show The Current Rules

On either machine, `fungi tunnel show` prints the active config.

On `my-laptop` you should see a forwarding rule similar to:

```text
127.0.0.1:18080 -> <home-pc-peer-id>:8080
```

On `home-pc` you should see a listening rule similar to:

```text
127.0.0.1:8080
```

## Step 4: Remove The Rules When You Are Done

On `my-laptop`:

```bash
fungi tunnel remove-forward 127.0.0.1:18080 <home-pc-peer-id> 8080
```

On `home-pc`:

```bash
fungi tunnel remove-listen 127.0.0.1:8080
```

## Related Reading

- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app): open a remote app through Fungi service workflows instead of raw TCP rules.
- [Remote Service Control](/docs/remote-service-control): the full `peer`, `catalog`, and `access` model.
- [Connection Diagnostics](/docs/connection-diagnostics): inspect active connections and tunnel protocols when something behaves unexpectedly.