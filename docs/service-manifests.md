---
sidebar_position: 3
---

# Services And Runtimes

This page starts where [2-Minute Quick Start: Run a Remote Sandbox App Locally](/docs/quick-start/remote-sandbox-app) ends.

You already saw how to run someone else's manifest. This guide shows the next step: write your own manifest, understand the fields while you write it, and run it with either the Docker-compatible runtime path or the built-in Wasmtime path.

The goal is practical:

- create one Docker manifest by hand
- create one Wasmtime manifest by hand
- understand which fields matter and which ones you can ignore at first
- keep the whole flow simple enough that you can finish it in a few minutes

If you only want direct downloads of the built-in examples, use [Runtime Examples](runtime-examples).

## What A Manifest Does

Every Fungi service manifest answers four questions:

- what runtime should execute the service
- where the service artifact comes from
- which ports and host paths the service needs
- how the service should be published through `spec.expose`

Today Fungi ships two runtime paths:

- `runtime: docker` for OCI-style container images
- `runtime: wasmtime` for `wasi-http` style WebAssembly components

The control flow stays almost the same for both runtimes:

```bash
fungi service pull ./my-service.yaml
fungi service start my-service
fungi service inspect my-service
```

Or on a remote peer:

```bash
fungi peer admin service pull --peer <peer-id> ./my-service.yaml
fungi peer admin service start --peer <peer-id> my-service
fungi access open --peer <peer-id> my-service
```

## Start From A Blank Template

Create a new YAML file locally and paste this skeleton first:

```yaml
apiVersion: fungi.dev/v1alpha1
kind: ServiceManifest

metadata:
  # Service instance name inside Fungi.
  name: your-service-name

spec:
  # Allowed values: docker, wasmtime.
  runtime: docker

  expose:
    # Set enabled: true when you want catalog/access workflows.
    enabled: true
    # Usually keep this aligned with metadata.name at first.
    serviceId: your-service-name
    displayName: Your Service
    transport:
      # Allowed values: tcp, raw.
      kind: tcp
    usage:
      # Allowed values: web, ssh, raw.
      kind: web
      path: /

  source:
    # Docker uses image.
    image: nginx:stable-alpine
    # Wasmtime uses exactly one of file or url instead.
    # file: ./your-component.wasm
    # url: https://example.com/your-component.wasm

  ports:
    - # Allowed values for hostPort: auto or a fixed port number.
      hostPort: auto
      # Required for expose.enabled=true with tcp transport.
      name: http
      servicePort: 80
      # Allowed values: tcp, udp.
      protocol: tcp

  # Optional host mounts.
  mounts: []

  # Optional environment variables.
  env: {}

  # Optional overrides. Leave empty at first.
  command: []
  entrypoint: []
  workingDir: null
```

You do not need every field on day one. For a minimal first service, focus on:

- `metadata.name`
- `spec.runtime`
- `spec.source`
- `spec.ports`
- `spec.expose`

## Example 1: Write A Docker Manifest For Nginx

Before writing the Docker example, confirm the target node actually has Docker support available:

```bash
fungi info runtime
# or, for a remote node
fungi peer capability --peer <peer-id>
```

If Docker is not available on that node, install Docker first and restart `fungi daemon`, or skip this example. 

Create `my-nginx.service.yaml` and paste this:

```yaml
apiVersion: fungi.dev/v1alpha1
kind: ServiceManifest

metadata:
  name: my-nginx

spec:
  # Allowed values: docker, wasmtime.
  runtime: docker

  expose:
    enabled: true
    serviceId: my-nginx
    displayName: My Nginx
    transport:
      # Allowed values: tcp, raw.
      kind: tcp
    usage:
      # Allowed values: web, ssh, raw.
      kind: web
      path: /

  source:
    image: nginx:stable-alpine

  ports:
    - # Allowed values for hostPort: auto or a fixed port number.
      hostPort: auto
      name: http
      servicePort: 80
      # Allowed values: tcp, udp.
      protocol: tcp

  mounts: []
  env: {}
```

What each important field means here:

- `runtime: docker` tells Fungi to use the Docker-compatible container runtime path
- `source.image` is the image reference Fungi should pull if it is missing
- `hostPort: auto` asks the target node to allocate a permitted host port for you
- `name: http` is important because exposed TCP services need at least one named TCP port
- `usage.kind: web` plus `path: /` tells Fungi this endpoint should be treated like a web app

Run it locally:

```bash
fungi service pull ./my-nginx.service.yaml
fungi service start my-nginx
fungi service inspect my-nginx
```

Copy the `local_endpoints.local_address` address in your browser and you should see the default Nginx welcome page.

If you want to see logs:

```bash
fungi service logs my-nginx --tail 50
```

## Example 2: Write A Wasmtime Manifest For A Local `.wasm`

Fungi's Wasmtime path supports both of these source forms:

- `spec.source.file` for a local `.wasm` file
- `spec.source.url` for a direct HTTP or HTTPS URL to a single `.wasm` file

We use the `sample-wasi-http-rust` project in this example. 
Get a `sample-wasi-http-rust.wasm` file from [bytecodealliance/sample-wasi-http-rust](https://github.com/bytecodealliance/sample-wasi-http-rust), then put that `.wasm` file in the same directory as this YAML file.

Create `sample-wasi-http.service.yaml`:

```yaml
apiVersion: fungi.dev/v1alpha1
kind: ServiceManifest

metadata:
  name: sample-wasi-http

spec:
  # Allowed values: docker, wasmtime.
  runtime: wasmtime

  expose:
    enabled: true
    serviceId: sample-wasi-http
    displayName: Sample WASI HTTP
    transport:
      # Allowed values: tcp, raw.
      kind: tcp
    usage:
      # Allowed values: web, ssh, raw.
      kind: web
      path: /

  source:
    file: ./sample-wasi-http-rust.wasm

  ports:
    - # Allowed values for hostPort: auto or a fixed port number.
      hostPort: auto
      name: http
      servicePort: 8080
      # Allowed values: tcp, udp.
      protocol: tcp

  mounts: []
  env: {}
```

Run it locally:

```bash
fungi service pull ./sample-wasi-http.service.yaml
fungi service start sample-wasi-http
fungi service inspect sample-wasi-http
```

Copy the `local_endpoints.local_address` address in your browser and you should see the `Hello, wasi:http/proxy world!` page.

For this local example, keep the `.wasm` file next to the YAML file and use a relative path like `./sample-wasi-http-rust.wasm`.

For remote deployment, do not start with `spec.source.file`. Prefer `spec.source.url` first.

## Mounts, `${APP_HOME}`, And Working Directories

Mounts are optional. When you do need one, start with `${APP_HOME}`.

Example:

```yaml
mounts:
  - hostPath: ${APP_HOME}/data
    runtimePath: data
```

That means:

- `${APP_HOME}` resolves on the target node to `fungi_home/services/<service-name>`
- Fungi creates the mount directory automatically before launch
- for Wasmtime, `runtimePath: data` becomes a guest directory exposed as `data`

Use this pattern when you want a service-specific persistent directory without hard-coding host paths.

`workingDir` is optional. If you do not set it, Fungi uses the runtime service directory it prepared for that service.

## The Fields You Will Use Most Often

`metadata.name`

- the Fungi service instance name
- used by `fungi service start <name>` and related commands
- also affects `${APP_HOME}`

`spec.runtime`

- `docker` or `wasmtime`
- this decides which source fields are valid

`spec.source`

- Docker: `image`
- Wasmtime: exactly one of `file` or `url`
- `file` should point to a single local `.wasm` file
- `url` should be a direct HTTP or HTTPS URL to a single `.wasm` file

`spec.ports`

- `servicePort` is the port the app listens on inside its runtime
- `hostPort: auto` is usually the easiest starting point
- `name` should be present for exposed TCP services

`spec.expose`

- tells Fungi how to publish the service to catalog/access workflows
- keep `serviceId` stable once other nodes depend on it
- `usage.kind: web` is the common case for browser-facing apps

`spec.mounts`

- maps host paths into the workload
- host paths still have to pass the target node's runtime safety policy

## Local Flow Vs Remote Flow

Use the local flow when you are still designing the manifest itself:

```bash
fungi service pull ./my-service.yaml
fungi service start my-service
fungi service inspect my-service
fungi service logs my-service --tail 50
```

Use the remote flow once the manifest already works locally:

```bash
fungi peer capability --peer <peer-id>
fungi peer admin service pull --peer <peer-id> ./my-service.yaml
fungi peer admin service start --peer <peer-id> my-service
fungi access open --peer <peer-id> my-service
```

## Runtime Notes

- The Docker-compatible runtime path targets host Docker endpoints on Windows, macOS, and Linux.
- On Windows, the common endpoint is `\\.\pipe\docker_engine`; on macOS it is often `$HOME/.docker/run/docker.sock`; on Linux it is often `/var/run/docker.sock`.
- The container path automatically pulls the referenced image if it is missing locally.
- The Wasmtime path supports a local `.wasm` file or a direct HTTP/HTTPS URL to a single `.wasm` file.
- Wasmtime mount directories are created automatically before launch.
- The Wasmtime path is not available on Android yet.
- `spec.expose.enabled=true` with TCP transport requires at least one named TCP port in `spec.ports[].name`.

## Current Limits

- Archive packages and hash verification are not implemented yet.
- The Wasmtime path currently targets single-component `.wasm` payloads rather than richer package formats.
- Container image pull progress is not yet streamed through the CLI.

## Continue Reading

- [Runtime Examples](runtime-examples): direct downloads of the built-in example manifests.
- [Remote Service Control](remote-service-control): the user-facing `peer`, `catalog`, and `access` flow.
- [2-Minute Quick Start: Forward A TCP Port](/docs/quick-start/tcp-tunnel): the shortest path for raw TCP forwarding after your devices are already connected.