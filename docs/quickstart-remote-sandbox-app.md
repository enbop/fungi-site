---
title: "2-Minute Quick Start: Run a Remote Sandbox App Locally"
description: "After your device can already ping another device, start a remote sandbox app and open it locally in a few commands."
slug: /quick-start/remote-sandbox-app
---

# 2-Minute Quick Start: Run a Remote Sandbox App Locally

This guide starts where the [previous quick start](/docs/quick-start/private-p2p-network) ended.

Now you can already ping `home-pc` from `my-laptop` by alias:

```bash
./fungi ping home-pc
```

```text
Target peer: home-pc(16Uiu2H........ZC3bdZ)
Ping stream peer=16Uiu2H........ZC3bdZ interval=2000ms (Ctrl+C to stop)
TICK   CONN   DIR      RLY   RTT        ADDR/MSG
0      -      -        -     -          connecting
1      6      outbound no    5ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
2      6      outbound no    6ms        /ip4/192.168.x.x/tcp/45189/p2p/16Uiu2H........ZC3bdZ
```

> This means:
> - `my-laptop` and `home-pc` already have an encrypted connection.
> - `home-pc` already allows inbound control from `my-laptop`
> - `home-pc` is already saved in `my-laptop`'s address book that allows you directly use the `home-pc` alias in later commands.


In this example, you will control `home-pc` from `my-laptop`, and the demo app is `filebrowser-lite-wasi`.

The goal is simple:

- pull a sandboxed app to `home-pc`
- start it remotely from `my-laptop`
- open it locally in your browser on `my-laptop`

> If you want the full model behind `peer`, `service`, `catalog`, and `access`, see [Remote Service Control](/docs/remote-service-control).

## Download The Example Manifest

Download the example manifest `filebrowser-lite-wasi.service.yaml` on `my-laptop`.

- <a href="/downloads/manifests/filebrowser-lite-wasi.service.yaml" download>Direct download: filebrowser-lite-wasi.service.yaml</a>

Or download it from the terminal:

```bash
curl -L -O https://fungi.rs/downloads/manifests/filebrowser-lite-wasi.service.yaml
```

>- `filebrowser-lite` is an experimental Fungi demo app based on a fork of [filebrowser](https://github.com/filebrowser/filebrowser). 
>- `filebrowser` is a popular open-source web app that provides a file explorer interface to a specified host directory.
>- The [filebrowser-lite fork](https://github.com/enbop/filebrowser-lite/tree/master/filebrowser-lite-wasi) adds a minimal Rust backend and compiles the app into a WASI component.

## Set The Current Peer Context

Tell the CLI that the current remote target is `home-pc`:

```bash
./fungi peer use home-pc
```

Show the current peer context to verify:
```bash
./fungi peer current
```

After this, later remote commands can omit `--peer home-pc`.

## Launch The Remote Sandbox App

Run these three commands on `my-laptop`:

```bash
./fungi peer admin service pull ./filebrowser-lite-wasi.service.yaml
./fungi peer admin service start filebrowser-lite-wasi
./fungi access open filebrowser-lite-wasi
```

What happens:

- `pull` sends the manifest to `home-pc` and lets it fetch the WASI artifact
- `start` runs the app on `home-pc`
- `access open` creates a local entry point and opens the browser automatically

Done.

The app runs on `home-pc`, but you use it from `my-laptop` through the encrypted Fungi connection. 

## What Just Ran On `home-pc`

`filebrowser-lite-wasi` uses the built-in WASI runtime that ships with Fungi.

That means:

- the app runs in a sandboxed runtime on `home-pc`
- by default, one app can only access its own service directory under `~/.fungi/services/<APP_NAME>` (on `home-pc`)
- you can explicitly grant more host paths later if you need them

## Optional: Check State And Capabilities

If you want to see what is happening under the hood, these commands are the most useful:

```bash
./fungi peer capability
./fungi peer admin service list
./fungi peer admin service inspect filebrowser-lite-wasi
./fungi catalog list
./fungi catalog inspect filebrowser-lite-wasi
./fungi access list
```

Use them like this:

- `peer capability` shows what the remote node can run
- `peer admin service list` shows what is installed and running on `home-pc`
- `catalog` shows what `home-pc` publishes for consumption
- `access list` shows local entry points created on `my-laptop`

## Optional: Try The Docker Runtime

If you run `./fungi peer capability`, you may also see Docker support on the remote node.

When Docker is available on `home-pc`, Fungi detects it automatically and manages it through a dedicated agent layer.

Important limits in Docker mode:

- Fungi only allows containers to use host paths and host ports that its capability policy allows
- if a manifest asks for paths or ports outside that boundary, Fungi rejects it
- Fungi only manages containers created by Fungi itself, never touches unrelated containers that already exist on the host

>If the remote node is Linux, Docker should already be configured so it can run without `sudo`.

Download the Docker manifest:

- <a href="/downloads/manifests/filebrowser.service.yaml" download>Direct download: filebrowser.service.yaml</a>

Or download it from the terminal:

```bash
curl -L -O https://fungi.rs/downloads/manifests/filebrowser.service.yaml
```

Then use the same three-step flow:

```bash
./fungi peer admin service pull ./filebrowser.service.yaml
./fungi peer admin service start filebrowser
./fungi access open filebrowser
```

That is the Docker-backed version of the same remote app experience.

## What To Read Next

- [Remote Service Control](/docs/remote-service-control) for the full mental model
- [Services And Runtimes](/docs/service-manifests) for manifest structure and runtime policy
- [Runtime Examples](/docs/runtime-examples) for Docker and WASI examples side by side
- [Connection Diagnostics](/docs/connection-diagnostics) if something does not work