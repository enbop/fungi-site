---
title: "2-Minute Quick Start: Run a Remote Sandbox App Locally"
description: "After your device can already ping another device, start a remote sandbox app and open it locally in a few commands."
slug: /quick-start/remote-sandbox-app
---

# 2-Minute Quick Start: Run a Remote Sandbox App Locally

This guide starts where the [previous quick start](/docs/quick-start/private-p2p-network) ended.

At this point, `my-laptop` can already reach `home-pc` by alias:

```bash
fungi ping home-pc
```

In this example, `my-laptop` controls `home-pc`, and the demo app is the official `filebrowser-lite` recipe.

The goal is simple:

- add a sandboxed app to `home-pc`
- let `home-pc` start it
- open it locally in a browser on `my-laptop`

## Set The Current Peer Context

Tell the CLI that `home-pc` is your default target peer:

```bash
fungi peer use home-pc
fungi peer current
```

## Launch The Remote Sandbox App

Run these two commands on `my-laptop`:

```bash
fungi service add --recipe filebrowser-lite filebrowser-lite@home-pc
fungi access open --peer home-pc filebrowser-lite
```

What happens:

- `service add --recipe` resolves the official recipe, applies it to `home-pc`, and starts it
- `access open` creates a local access entry if needed and opens the resulting local URL

Done.

The app runs on `home-pc`, but you use it from `my-laptop` through the encrypted Fungi connection.

## What Just Ran On `home-pc`

`filebrowser-lite` uses Fungi's Wasmtime runtime path.

That means:

- the app runs in a sandboxed runtime on `home-pc`
- the recipe mounts `${USER_HOME}` from `home-pc` into the app
- the app itself is fetched from a pinned remote WebAssembly artifact URL

If you want to inspect the manifest first, use [Runtime Examples](../runtime-examples) to jump to the official recipe source or release asset.

## Optional: Check State And Capabilities

If you want to see what happened under the hood, these commands are the most useful:

```bash
fungi peer capability --peer home-pc
fungi service --device home-pc list
fungi service inspect filebrowser-lite@home-pc
fungi catalog list --peer home-pc
fungi access list --peer home-pc
```

Use them like this:

- `peer capability` shows what `home-pc` can run
- `service --device home-pc list` shows what `home-pc` is managing
- `catalog` shows what `home-pc` is publishing for consumption
- `access list` shows the local entry points on `my-laptop`

## Optional: Try The Docker Runtime

If `fungi peer capability --peer home-pc` reports Docker support, try the official `code-server` recipe:

```bash
fungi service add --recipe code-server code-server@home-pc
fungi access open --peer home-pc code-server
```

That gives you a browser-accessible code editor backed by `${USER_HOME}` on the remote node.

## Next Step

Continue with [Services And Runtimes](/docs/service-manifests) to write your own manifest.

If you want more detail, see:

- [Remote Service Control](/docs/remote-service-control)
- [Runtime Examples](/docs/runtime-examples)
- [2-Minute Quick Start: Forward A TCP Port](/docs/quick-start/tcp-tunnel)
- [Connection Diagnostics](/docs/connection-diagnostics)
