---
sidebar_position: 3
---

# Services And Runtimes

Fungi service manifests are the current packaging format for three kinds of services:

- Docker-backed services
- Wasmtime-backed services
- TCP tunnel services that point at an already-running local port

This page is the current schema guide. It matches the manifest format that Fungi parses today and the CLI surface that ships today.

If you only want ready-made examples, use [Runtime Examples](runtime-examples). The default recommendation is still to apply official recipes directly with `fungi service add --recipe <id>`.

## Current Lifecycle

For a local manifest file, the current recommended flow is:

```bash
fungi service add ./my-service.yaml
fungi service start my-service
fungi service inspect my-service
```

For a remote node, use a service reference that includes the device:

```bash
fungi service add my-service@node-b ./my-service.yaml
fungi service start my-service@node-b
fungi access open --peer node-b my-service
```

A few important notes:

- `fungi service add ./my-service.yaml` applies the manifest and records the service, but it does not automatically start a manifest loaded from a local file.
- `fungi service add --recipe <id>` is different. Official recipes are resolved, applied, and then started for you.
- `fungi access open` is for published remote services. For a local web service, use `fungi service open my-service` when the service advertises a browser-friendly entry.

## Current Manifest Shape

A service manifest always starts with the same document header:

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service
```

After that, the meaning depends on `spec.run`:

- `spec.run.docker` means Docker runtime
- `spec.run.wasmtime` means Wasmtime runtime
- no `spec.run` means a TCP tunnel service, also called the `link` runtime in the implementation

Start from this current template:

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service

metadata:
  name: your-service-name

spec:
  run:
    docker:
      image: nginx:stable-alpine
    # wasmtime:
    #   file: ./component.wasm
    #   url: https://example.com/component.wasm

  entries:
    http:
      port: 8080
      hostPort: 18080
      usage: web
      path: /
      # iconUrl: https://example.com/icon.svg
      # catalogId: io.example.service

  env: {}

  mounts: []

  command: []

  entrypoint: []

  workingDir: null
```

For a TCP tunnel service, remove `spec.run` and use `target` instead of `port`:

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service

metadata:
  name: ssh-tunnel

spec:
  entries:
    ssh:
      target: 127.0.0.1:22
      usage: ssh
```

## Runtime Model

Fungi uses one shared manifest format, but it is not fully runtime-transparent.

That distinction matters most for `command`, `entrypoint`, and `workingDir`.

| Field                        | Docker                       | Wasmtime                          | Link / TCP tunnel |
| ---------------------------- | ---------------------------- | --------------------------------- | ----------------- |
| `spec.run`                   | `docker.image`               | `wasmtime.file` or `wasmtime.url` | omitted           |
| `spec.entries.<name>.port`   | required                     | required                          | invalid           |
| `spec.entries.<name>.target` | invalid                      | invalid                           | required          |
| `spec.env`                   | passed to container env      | passed to child process env       | rejected          |
| `spec.mounts`                | bind mounts                  | `--dir` mappings                  | rejected          |
| `spec.command`               | Docker `Cmd`                 | argv after the component path     | rejected          |
| `spec.entrypoint`            | Docker `Entrypoint` override | rejected                          | rejected          |
| `spec.workingDir`            | Docker `WorkingDir`          | child process current directory   | rejected          |

This is the practical rule set:

- `command` is a shared field name, not a shared runtime abstraction.
- `entrypoint` is Docker-only by design.
- `workingDir` is available for Docker and Wasmtime, but it still maps to different execution models.
- TCP tunnel services do not launch a process, so process-oriented fields are rejected.

## `entries` Drives Publication

`spec.entries` is the center of the current schema.

For runnable services, each entry describes:

- the runtime port with `port`
- the optional fixed host port with `hostPort`
- how Fungi should treat the endpoint with `usage`
- optional publication metadata such as `path`, `iconUrl`, and `catalogId`

Example:

```yaml
entries:
  http:
    port: 8080
    usage: web
    path: /
```

For TCP tunnel services, `entries` describes the existing local target instead:

```yaml
entries:
  ssh:
    target: 127.0.0.1:22
    usage: ssh
```

Current limits worth knowing:

- TCP tunnel manifests currently support exactly one entry.
- If you set publication metadata such as `usage`, `path`, `iconUrl`, or `catalogId` on multiple entries, they must match. Per-entry publish metadata is not supported yet.
- `protocol` currently supports only `tcp`.

## Docker Example

A minimal Docker manifest under the current schema looks like this:

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service

metadata:
  name: my-nginx

spec:
  run:
    docker:
      image: nginx:stable-alpine

  entries:
    http:
      port: 80
      usage: web
      path: /
```

Apply it locally:

```bash
fungi service add ./my-nginx.yaml
fungi service start my-nginx
fungi service open my-nginx
```

What this means:

- Fungi creates a managed Docker container
- it maps one host port to container port `80`
- it records publication metadata so `service open` and remote access workflows know this is a web app

## Wasmtime Example

A minimal Wasmtime manifest under the current schema looks like this:

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service

metadata:
  name: sample-wasi-http

spec:
  run:
    wasmtime:
      file: ./sample-wasi-http-rust.wasm

  entries:
    http:
      port: 8080
      usage: web
      path: /
```

Apply it locally:

```bash
fungi service add ./sample-wasi-http.yaml
fungi service start sample-wasi-http
fungi service open sample-wasi-http
```

For remote targets, prefer `spec.run.wasmtime.url` unless the target node already has the artifact at a stable local path.

## TCP Tunnel Example

A tunnel manifest points at an existing process on the target node. Fungi does not launch that process.

```yaml
apiVersion: fungi.rs/v1alpha1
kind: Service

metadata:
  name: ssh-tunnel

spec:
  entries:
    ssh:
      target: 127.0.0.1:22
      usage: ssh
```

Apply it locally:

```bash
fungi service add ./ssh-tunnel.yaml
fungi service start ssh-tunnel
fungi service inspect ssh-tunnel
```

A tunnel service is still managed as a named Fungi service instance, but the runtime is just a structured reference to an existing TCP endpoint.

## `command`, `entrypoint`, And `workingDir`

These three fields deserve special treatment.

`spec.command`

- Docker: mapped to Docker `Cmd`
- Wasmtime: appended after the component path when Fungi launches the Wasmtime child process
- Link: rejected

`spec.entrypoint`

- Docker only
- useful when you need to override the image entrypoint entirely
- rejected for Wasmtime and TCP tunnel services

`spec.workingDir`

- Docker: becomes Docker `WorkingDir`
- Wasmtime: becomes the current working directory of the child process Fungi launches
- Link: rejected

One concrete implication: a Docker `command` override only works if the image entrypoint and application actually accept those arguments.

If an image already bakes important arguments into its entrypoint, keep that in mind before duplicating them in `spec.command`.

## Mounts And Host Path Variables

Current recipes commonly use `${USER_HOME}` for user-facing data and `${APP_HOME}` for service-specific storage.

Example:

```yaml
mounts:
  - hostPath: ${USER_HOME}
    runtimePath: data
```

Example:

```yaml
mounts:
  - hostPath: ${APP_HOME}/data
    runtimePath: data
```

Practical rules:

- Fungi resolves these host paths on the target node
- host mount directories are created automatically before launch
- mount policy still applies on the target node
- for Wasmtime, the guest path is exposed through the launcher `--dir` mapping

## Official Recipes

Before writing from scratch, inspect the current official recipes:

- `code-server` for Docker with a command override
- `filebrowser-lite` for Wasmtime with a remote artifact URL
- `webdav` for Wasmtime with a TCP-style usage hint
- `ssh-tunnel` for a link/TCP tunnel manifest

Use:

```bash
fungi service recipe list
fungi service recipe show code-server
fungi service add --recipe code-server
```

If you need the raw manifest instead of applying the recipe directly:

- download the release asset from `fungi-service-recipes`
- or clone the `fungi-service-recipes` repository and edit `recipes/<id>/manifest.yaml` locally

## Related Reading

- [Runtime Examples](runtime-examples)
- [Remote Service Control](remote-service-control)
- [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app)
