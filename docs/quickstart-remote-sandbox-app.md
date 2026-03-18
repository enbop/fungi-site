---
title: "3-Minute Quick Start: Run a Remote Sandbox App Locally"
description: "Start a sandboxed app on one device and open it locally from another device through Fungi."
slug: /quick-start/remote-sandbox-app
---

# 3-Minute Quick Start: Run a Remote Sandbox App Locally

This guide shows how to start a sandboxed app on one device and open it locally from another device.

The app runs on the remote machine. Fungi gives you a local entry point to it.

In this example:

- Device A: `laptop-A`
- Device B: `pc-B`
- Demo app: `filebrowser-lite-wasi`

This guide assumes you already finished [3-Minute Quick Start: Build Your Private P2P Network](/docs/quick-start/private-p2p-network), so:

- both devices already run `fungi daemon`
- `laptop-A` already has `pc-B` in its address book
- `pc-B` already allows inbound access from `laptop-A`

If you want the detailed explanation of the `service`, `catalog`, and `access` workflow, see [Remote Service Control](/docs/remote-service-control).

## Before You Start

Download the example manifest on the machine that will control the remote peer.

- [Download filebrowser-lite-wasi.service.yaml](/downloads/manifests/filebrowser-lite-wasi.service.yaml)

You can save it anywhere convenient. In the examples below, it is saved in the current directory.

## Step 1: Confirm `Device B` In The Address Book

On `Device A` (`laptop-A`), make sure the remote device is already saved as `pc-B`:

```bash
./fungi device list
```

If it is not there yet, add it first:

```bash
./fungi device add --alias pc-B <peer-id-of-pc-B>
```

## Step 2: Pull The Sandbox App To `Device B`

From `Device A` (`laptop-A`), ask `Device B` (`pc-B`) to pull the service manifest:

```bash
./fungi peer admin service pull --peer pc-B ./filebrowser-lite-wasi.service.yaml
```

What this does:

- sends the manifest to the remote device
- tells the remote device how to fetch the WASI app
- prepares a named service instance called `filebrowser-lite-wasi`

If you want to inspect what the remote node can run before you start it, use:

```bash
./fungi peer capability --peer pc-B
```

## Step 3: Start The App On `Device B`

Still on `Device A` (`laptop-A`), start the service on `Device B` (`pc-B`):

```bash
./fungi peer admin service start --peer pc-B filebrowser-lite-wasi
```

At this point, the app is running on the remote machine, not on your local machine.

If you want to confirm its state:

```bash
./fungi peer admin service list --peer pc-B
./fungi peer admin service inspect --peer pc-B filebrowser-lite-wasi
```

## Step 4: Check What `Device B` Publishes

Now check the published service catalog:

```bash
./fungi catalog list --peer pc-B
./fungi catalog inspect --peer pc-B filebrowser-lite-wasi
```

This tells you whether the remote service is exposed for consumption.

## Step 5: Open The Remote App On `Device A`

Create or reuse a local access entry and open the app:

```bash
./fungi access open --peer pc-B filebrowser-lite-wasi
```

Fungi will create a local URL for the remote app and open it in your browser.

Conceptually, the flow looks like this:

1. the app runs on `Device B` (`pc-B`)
2. `Device B` publishes it through Fungi
3. `Device A` (`laptop-A`) creates a local entry point
4. your browser opens that local address

## Minimal End-To-End Flow

If you just want the shortest command sequence:

```bash
./fungi peer admin service pull --peer pc-B ./filebrowser-lite-wasi.service.yaml
./fungi peer admin service start --peer pc-B filebrowser-lite-wasi
./fungi catalog list --peer pc-B
./fungi access open --peer pc-B filebrowser-lite-wasi
```

## If Something Does Not Work

Check the connection first:

```bash
./fungi ping pc-B
./fungi conn overview
```

Check whether the remote service is running:

```bash
./fungi peer admin service list --peer pc-B
./fungi peer admin service inspect --peer pc-B filebrowser-lite-wasi
```

Check whether the service is published:

```bash
./fungi catalog list --peer pc-B
```

For deeper troubleshooting, see [Connection Diagnostics](/docs/connection-diagnostics) and [Remote Service Control](/docs/remote-service-control).

## What To Read Next

- [Remote Service Control](/docs/remote-service-control) for the full mental model
- [Services And Runtimes](/docs/service-manifests) for manifest structure and runtime policy
- [Runtime Examples](/docs/runtime-examples) for Docker and WASI examples side by side