---
sidebar_position: 4
---

# Runtime Examples

This page gives you one Docker example and one Wasmtime/WASI example, with direct manifest downloads.

If you want the conceptual model first, read [Services And Runtimes](service-manifests) before this page.

I am keeping both runtimes on the same page because most of the setup and mental model is shared. Splitting them into two pages would duplicate the important parts: what `fungi daemon` provides, how runtime detection works, and how service manifests are consumed.

## Download The Example Manifests

- [Download Docker manifest](/downloads/manifests/filebrowser.service.yaml)
- [Download Wasmtime manifest](/downloads/manifests/filebrowser-lite-wasi.service.yaml)

If you want version-locked artifacts in the future, GitHub Releases is the better long-term place. That would need CI changes so each release publishes the matching manifests as release assets. For now, site-hosted static downloads are the simplest stable path.

## How The Runtime Model Works

Fungi is centered around `fungi daemon`.

At a high level:

- `fungi daemon` always provides the core networking, service state, peer discovery, and control surface.
- The daemon ships with a built-in Wasmtime-based runtime path, so WASI workloads do not depend on an external container engine.
- The daemon also detects available Docker-compatible runtimes on the host, such as Docker Desktop or a local Docker Engine.
- For container-backed services, Fungi uses `docker-agent` as a constrained boundary instead of letting the daemon hold broad Docker control directly.

That means the two runtimes feel similar from the CLI, but their execution model is different:

- `runtime: wasmtime` runs a WebAssembly service through the built-in Wasmtime service path.
- `runtime: docker` runs a container-backed service through the Docker-compatible runtime path plus the limited-permission `docker-agent` boundary.

In both cases, the manifest declares:

- where the artifact comes from
- which ports should be exposed
- which mounts are needed
- how the service should appear to remote consumers through `spec.expose`

## Shared Remote Flow

Both examples fit the same remote control model:

```bash
fungi peer admin service pull --peer <peer-id> <manifest.yaml>
fungi peer admin service start --peer <peer-id> <service-name>
fungi catalog list --peer <peer-id>
fungi access open --peer <peer-id> <service-id>
```

That shared flow is why one page works better than two. The runtime changes, but the user-facing control path stays almost the same.

## Example 1: Docker Runtime

Use this when the target machine has a Docker-compatible runtime available.

Manifest download:

- [filebrowser.service.yaml](/downloads/manifests/filebrowser.service.yaml)

What it demonstrates:

- `runtime: docker`
- pulling an OCI image
- a host mount mapped into the container
- exposing a web service through `spec.expose`

Pull and start it on a remote peer:

```bash
fungi peer admin service pull --peer <peer-id> ./filebrowser.service.yaml
fungi peer admin service start --peer <peer-id> filebrowser
fungi catalog inspect --peer <peer-id> filebrowser
fungi access open --peer <peer-id> filebrowser
```

Key point:

The daemon does not simply become a full Docker client with broad privileges. The Docker path is intentionally mediated through `docker-agent`, so the runtime boundary is narrower and more explicit.

## Example 2: Wasmtime / WASI Runtime

Use this when you want a service delivered as a WebAssembly module.

Manifest download:

- [filebrowser-lite-wasi.service.yaml](/downloads/manifests/filebrowser-lite-wasi.service.yaml)

What it demonstrates:

- `runtime: wasmtime`
- downloading a `.wasm` artifact from a release URL at pull time
- using the built-in Wasmtime service path that ships with Fungi
- exposing a web service the same way as the Docker example

Pull and start it on a remote peer:

```bash
fungi peer admin service pull --peer <peer-id> ./filebrowser-lite-wasi.service.yaml
fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi
fungi catalog inspect --peer <peer-id> filebrowser-lite-wasi
fungi access open --peer <peer-id> filebrowser-lite-wasi
```

Key point:

This runtime path is built into the daemon. Users do not need an external Docker engine just to run a service. That makes Wasmtime the simpler baseline runtime story, while Docker remains the path for existing container workloads.

## Which Example Should Users Start With?

Use Wasmtime first when:

- you want the smallest dependency surface
- you want the runtime that ships with Fungi itself
- you are demonstrating the capability-first service model from scratch

Use Docker first when:

- you already have a containerized workload
- your audience is more familiar with OCI images than with WASI modules
- you want to show migration of an existing service into Fungi

## Related Reading

- [Services And Runtimes](service-manifests)
- [Remote Service Control](remote-service-control)
- [Built-in WASI Support](wasi)