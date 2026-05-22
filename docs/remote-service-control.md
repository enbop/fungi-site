---
sidebar_position: 5
---

# Remote Service Control

This guide shows the current remote workflow:

- check what a peer can run
- add or start a service on that peer
- browse what the peer publishes
- open that published service locally

If you are not yet comfortable with manifests or runtime selection, read [Services And Runtimes](service-manifests) first.

## Set A Peer Alias First

Before starting, make sure the target peer already has a stable alias:

```bash
fungi device add <peer-id> --alias node-b
fungi peer use node-b
fungi peer current
```

Once `peer use` is set, later commands can omit a repeated `--peer node-b` where the command supports peer context.

## 1. Check Runtime Capability

Before sending a manifest or recipe to another node, confirm what that node can run:

```bash
fungi peer capability --peer node-b
```

That tells you whether Docker and Wasmtime are available on the remote machine.

## 2. Manage A Remote Service Instance

Use `fungi service` to manage services on another node.

Apply a local manifest file to the remote node:

```bash
fungi service add my-service@node-b ./my-service.yaml
fungi service start my-service@node-b
fungi service inspect my-service@node-b
```

List services already managed on that node:

```bash
fungi service --device node-b list
```

Stop or remove one:

```bash
fungi service stop my-service@node-b
fungi service remove my-service@node-b
```

Apply an official recipe instead of a local manifest file:

```bash
fungi service add --recipe filebrowser-lite filebrowser-lite@node-b
```

Official recipes are resolved, applied, and started for you.

## 3. Browse What The Peer Publishes

A running service instance is not the same thing as a published service.

Use `catalog` to inspect what the remote node is publishing for consumption:

```bash
fungi catalog list --peer node-b
fungi catalog inspect --peer node-b filebrowser-lite
```

Think of this as the consumer view of the remote node.

## 4. Open The Published Service Locally

Use `access` to create or reuse a local access entry for a published remote service:

```bash
fungi access open --peer node-b filebrowser-lite
```

Inspect or clean up those local entries:

```bash
fungi access list --peer node-b
fungi access detach --peer node-b filebrowser-lite
```

`access open` creates access if needed and then opens the service in the appropriate local app when possible.

## Recommended Minimal Flow

For the shortest end-to-end remote web app flow:

```bash
fungi device add <peer-id> --alias node-b
fungi peer capability --peer node-b
fungi service add --recipe filebrowser-lite filebrowser-lite@node-b
fungi catalog list --peer node-b
fungi access open --peer node-b filebrowser-lite
```

That gives you four layers of visibility:

- `peer capability` answers what the remote node can run
- `service` manages the actual remote service instance
- `catalog` shows what the remote node publishes
- `access` creates the local entry point you actually use

## Related Reading

- [Runtime Examples](runtime-examples)
- [Services And Runtimes](service-manifests)
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)
