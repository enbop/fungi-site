---
sidebar_position: 4
---

# Runtime Examples

This page points at the current official service recipes.

If you want to understand the manifest format itself, read [Services And Runtimes](service-manifests).

## Fastest Path: Use Official Recipes

List the recipes that your local daemon knows about:

```bash
fungi service recipe list
```

Apply one locally:

```bash
fungi service add --recipe code-server
fungi service open code-server
```

Apply one to a remote node:

```bash
fungi service add --recipe filebrowser-lite filebrowser-lite@node-b
fungi access open --peer node-b filebrowser-lite
```

`service add --recipe` resolves the official recipe, applies it, and starts it for you.

This is the default recommendation. Prefer it over manually downloading YAML unless you are auditing or forking a recipe.

## If You Need The Raw Manifest

When you really do want the manifest file itself, use one of these instead of a site-hosted static YAML copy:

- download the release asset from <a href="https://github.com/enbop/fungi-service-recipes/releases/latest">fungi-service-recipes releases</a>
- or clone <a href="https://github.com/enbop/fungi-service-recipes">fungi-service-recipes</a> and work from `recipes/<id>/manifest.yaml`

## Current Official Recipes

### `code-server`

- Runtime: Docker
- Best for: browser-accessible remote editing on `${USER_HOME}`
- Release asset: <a href="https://github.com/enbop/fungi-service-recipes/releases/latest/download/code-server.manifest.yaml">code-server.manifest.yaml</a>
- Source: <a href="https://github.com/enbop/fungi-service-recipes/blob/main/recipes/code-server/manifest.yaml">recipes/code-server/manifest.yaml</a>

### `filebrowser-lite`

- Runtime: Wasmtime
- Best for: browser-accessible file browsing on `${USER_HOME}`
- Release asset: <a href="https://github.com/enbop/fungi-service-recipes/releases/latest/download/filebrowser-lite.manifest.yaml">filebrowser-lite.manifest.yaml</a>
- Source: <a href="https://github.com/enbop/fungi-service-recipes/blob/main/recipes/filebrowser-lite/manifest.yaml">recipes/filebrowser-lite/manifest.yaml</a>

### `webdav`

- Runtime: Wasmtime
- Best for: WebDAV clients that should connect to a remote `${USER_HOME}` export
- Release asset: <a href="https://github.com/enbop/fungi-service-recipes/releases/latest/download/webdav.manifest.yaml">webdav.manifest.yaml</a>
- Source: <a href="https://github.com/enbop/fungi-service-recipes/blob/main/recipes/webdav/manifest.yaml">recipes/webdav/manifest.yaml</a>

### `ssh-tunnel`

- Runtime: Link / TCP tunnel
- Best for: exposing an already-running SSH daemon on the target device
- Release asset: <a href="https://github.com/enbop/fungi-service-recipes/releases/latest/download/ssh-tunnel.manifest.yaml">ssh-tunnel.manifest.yaml</a>
- Source: <a href="https://github.com/enbop/fungi-service-recipes/blob/main/recipes/ssh-tunnel/manifest.yaml">recipes/ssh-tunnel/manifest.yaml</a>

## When To Download A Manifest Instead Of Using `--recipe`

Use a release asset or a local checkout when you want to:

- audit the manifest before applying it
- fork the manifest into your own project
- test small edits to one recipe without publishing a new official recipe release

A downloaded or checked-out manifest uses the same local flow as any custom manifest:

```bash
fungi service add ./code-server.manifest.yaml
fungi service start code-server
fungi service inspect code-server
```

## Related Reading

- [Services And Runtimes](service-manifests)
- [Remote Service Control](remote-service-control)
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)
