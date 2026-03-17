---
sidebar_position: 5
---

# Remote Service Control

This guide shows how to use a few CLI commands to control a remote node, manage its services, and finally open a remote web app locally.

If you are not yet comfortable with manifests or runtime selection, read [Services And Runtimes](service-manifests) first, then come back here. If you want ready-to-download examples, use [Runtime Examples](runtime-examples).

Before starting, make sure the target peer already has a stable alias in your address book:

```bash
./fungi device add <peer-id> --alias node-b
./fungi peer use node-b
./fungi peer current
```

Once `peer use` is set, later remote commands can omit `--peer`. Fungi prints the resolved target peer before each remote operation, so current-peer fallback stays visible.

## Group 1: `service` Through `peer admin`

Use `peer admin service` when you want to manage service instances on the remote node itself.

Typical lifecycle:

```bash
./fungi peer admin service pull --peer <peer-id> ./examples/service-manifests/filebrowser-lite-wasi.service.yaml
./fungi peer admin service list --peer <peer-id>
./fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi
```

Useful checks:

```bash
./fungi peer capability --peer <peer-id>
./fungi peer admin service stop --peer <peer-id> filebrowser-lite-wasi
./fungi peer admin service remove --peer <peer-id> filebrowser-lite-wasi
```

Think of this group as the remote administrator view: pull, start, stop, and remove actual service instances on the other machine.

## Group 2: `catalog`

Use `catalog` when you want to browse what the remote node is publishing for consumption.

```bash
./fungi catalog list --peer <peer-id>
./fungi catalog inspect --peer <peer-id> filebrowser-lite-wasi
```

This is the consumer view, not the administrator view. It shows only services that the remote node has exposed for access.

Typical questions answered by `catalog`:

- What services is the remote peer publishing?
- What `service_id` should I use locally?
- Is this service meant to be used as a web app or another kind of endpoint?

## Group 3: `access`

Use `access` when you want to create or reuse a local entry point for a published remote service.

Create a reusable local access entry:

```bash
./fungi access attach --peer <peer-id> filebrowser-lite-wasi
./fungi access list --peer <peer-id>
```

Open the remote web app locally in one step:

```bash
./fungi access open --peer <peer-id> filebrowser-lite-wasi
```

`access open` reuses an existing local access entry when possible. If none exists, it creates one first and then opens the resulting local URL in your browser.

Remove the local entry point when you no longer need it:

```bash
./fungi access detach --peer <peer-id> filebrowser-lite-wasi
```

## Recommended Minimal Flow

If you want the shortest end-to-end path, use this sequence:

```bash
./fungi device add <peer-id> --alias node-b
./fungi peer admin service pull --peer <peer-id> ./examples/service-manifests/filebrowser-lite-wasi.service.yaml
./fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi
./fungi catalog list --peer <peer-id>
./fungi access open --peer <peer-id> filebrowser-lite-wasi
```

That gives you four layers of visibility:

- `peer` confirms which node you are targeting
- `service` manages the remote runtime instance
- `catalog` shows what the remote node has exposed
- `access` creates and opens the local entry point

## Related Reading

- [CLI Service Quick Start](cli-service-quick-start)
- [Runtime Examples](runtime-examples)
- [Services And Runtimes](service-manifests)
- [Built-in WASI Support](wasi)