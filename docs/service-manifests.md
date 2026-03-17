---
sidebar_position: 3
---

# Services And Runtimes

`v0.6.0-preview` introduces a new service workflow built around a capabilities-first `RuntimeProvider` abstraction.

If this page feels too abstract, start with [Runtime Examples](runtime-examples) for one Docker example and one Wasmtime example with direct manifest downloads.

Today Fungi ships two runtime-provider implementations:

- a Docker-compatible container runtime path for OCI-style container images
- a Wasmtime path for `wasi-http` style WebAssembly components

If you want direct manifest downloads plus one Docker example and one Wasmtime example, start with [Runtime Examples](runtime-examples).

The goal is simple: pull a service to one node, start it, discover what it exposes, and then forward it locally from another node with as little ceremony as possible.

You can now use fungi plus capabilities-first services to build your own private network system.

## Core Ideas

Fungi service manifests describe:

- which runtime-provider should run the service
- where the artifact comes from
- which ports and mounts the service needs
- how the service should appear in discovery through `spec.expose`

The runtime identifier in manifests is still `docker` or `wasmtime`, but the user-facing concept is broader than a specific engine implementation. In particular, the `docker` path should be understood as the Docker-compatible container runtime path.

For container-backed services, Fungi also uses a dedicated safety layer in `crates/docker-agent`, so the daemon does not need broad direct Docker control to manage the service lifecycle.

## Quick Local Flow

Assuming the daemon is already running:

```bash
fungi service pull ./examples/service-manifests/filebrowser.service.yaml
fungi service list
fungi service start filebrowser
fungi service inspect filebrowser
fungi service logs filebrowser --tail 50
```

The official examples are available both as direct site downloads and in the repository:

- [Download Docker manifest](/downloads/manifests/filebrowser.service.yaml)
- [Download Wasmtime manifest](/downloads/manifests/filebrowser-lite-wasi.service.yaml)
- [examples/service-manifests/filebrowser.service.yaml](https://github.com/enbop/fungi/blob/main/examples/service-manifests/filebrowser.service.yaml)
- [examples/service-manifests/filebrowser-lite-wasi.service.yaml](https://github.com/enbop/fungi/blob/main/examples/service-manifests/filebrowser-lite-wasi.service.yaml)

## Minimal Manifest Shape

Container example:

```yaml
apiVersion: fungi.dev/v1alpha1
kind: ServiceManifest

metadata:
  name: filebrowser

spec:
  runtime: docker

  expose:
    enabled: true
    serviceId: filebrowser
    displayName: File Browser
    transport:
      kind: tcp
    usage:
      kind: web
      path: /

  source:
    image: filebrowser/filebrowser:latest

  ports:
    - hostPort: auto
      name: http
      servicePort: 80
      protocol: tcp
```

Wasmtime example:

```yaml
apiVersion: fungi.dev/v1alpha1
kind: ServiceManifest

metadata:
  name: filebrowser-lite-wasi

spec:
  runtime: wasmtime

  expose:
    enabled: true
    serviceId: filebrowser-lite-wasi
    displayName: File Browser Lite
    transport:
      kind: tcp
    usage:
      kind: web
      path: /

  source:
    url: https://github.com/enbop/filebrowser-lite/releases/latest/download/filebrowser-lite-wasi.wasm

  ports:
    - hostPort: auto
      name: http
      protocol: tcp
```

## Remote Flow

The current remote workflow is split across `peer`, `catalog`, and `access`.

If you want the shortest step-by-step user path for this flow, go to [Remote Service Control](remote-service-control).

Before operating on another node, register it in the address book with a stable alias:

```bash
fungi device add <peer-id> --alias node-b
fungi peer use <peer-id>
```

From a controller node, you can inspect the peer's capabilities, administer services there, inspect its published catalog, and create a local access entry:

```bash
fungi peer capability --peer <peer-id>
fungi peer admin service pull --peer <peer-id> ./examples/service-manifests/filebrowser-lite-wasi.service.yaml
fungi peer admin service list --peer <peer-id>
fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi
fungi catalog list --peer <peer-id>
fungi access attach --peer <peer-id> filebrowser-lite-wasi
fungi access list --peer <peer-id>
```

Once `peer use` has been set, you can omit `--peer` on later remote commands. The CLI prints the resolved target peer before execution so that current-peer fallback stays visible instead of becoming hidden state.

After `access attach`, Fungi allocates a local port on the controller node. You can then access the remote service through the local address shown by `fungi access list --peer <peer-id>` as if it were local.

This remains the main user experience target for this release: deploy and start a service on one node, then access it from another node through Fungi's internal access workflow.

## Runtime Notes

- The Docker-compatible container runtime path targets host Docker endpoints on Windows, macOS, and Linux.
- On Windows, the default Docker host endpoint is the named pipe `\\.\pipe\docker_engine`; on macOS the common Docker Desktop endpoint is `$HOME/.docker/run/docker.sock`; on Linux the common endpoint is `/var/run/docker.sock`.
- The container path automatically pulls the referenced image if it is missing locally.
- The Wasmtime path currently supports a local `.wasm` file or a direct HTTP/HTTPS URL to a single `.wasm` file.
- Wasmtime mount directories are created automatically before launch.
- The Wasmtime path is not available on Android yet. Android support is coming soon.
- `spec.expose.enabled=true` with TCP transport requires at least one named TCP port in `spec.ports[].name`.

## Current Limits

- Archive packages and hash verification are not implemented yet.
- The Wasmtime path currently targets single-component `.wasm` payloads rather than richer package formats.
- Container image pull progress is not yet streamed through the CLI.

## Continue Reading

- [Runtime Examples](runtime-examples): direct downloads plus one Docker and one Wasmtime walkthrough.
- [Remote Service Control](remote-service-control): the user-facing `peer`, `catalog`, and `access` flow.
- [Built-in WASI Support](wasi): compatibility note for the old standalone WASI guide.