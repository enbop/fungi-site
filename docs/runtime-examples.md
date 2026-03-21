---
sidebar_position: 4
---

# Runtime Examples

This page is now the lightweight companion to [Services And Runtimes](service-manifests).

Use it when you want the built-in example manifests immediately, without the step-by-step tutorial.

If you want to write your own manifest from scratch, including a commented template plus one Docker and one Wasmtime walkthrough, go to [Services And Runtimes](service-manifests).

## Download The Built-In Examples

- [Download Docker manifest](/downloads/manifests/filebrowser.service.yaml)
- [Download Wasmtime manifest](/downloads/manifests/filebrowser-lite-wasi.service.yaml)

Repository sources:

- [examples/service-manifests/filebrowser.service.yaml](https://github.com/enbop/fungi/blob/main/examples/service-manifests/filebrowser.service.yaml)
- [examples/service-manifests/filebrowser-lite-wasi.service.yaml](https://github.com/enbop/fungi/blob/main/examples/service-manifests/filebrowser-lite-wasi.service.yaml)

## What Each Example Is For

Docker example:

- uses `runtime: docker`
- pulls an OCI image
- is the easiest path when you already have a containerized workload

Wasmtime example:

- uses `runtime: wasmtime`
- pulls a single `.wasm` artifact from a URL
- is the easiest path when you want the runtime built directly into Fungi

## Fastest Commands

Docker example:

```bash
fungi service pull ./filebrowser.service.yaml
fungi service start filebrowser
fungi service inspect filebrowser
```

Wasmtime example:

```bash
fungi service pull ./filebrowser-lite-wasi.service.yaml
fungi service start filebrowser-lite-wasi
fungi service inspect filebrowser-lite-wasi
```

Remote peer flow:

```bash
fungi peer admin service pull --peer <peer-id> ./filebrowser-lite-wasi.service.yaml
fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi
fungi access open --peer <peer-id> filebrowser-lite-wasi
```

## Related Reading

- [Services And Runtimes](service-manifests): write your own manifest with a commented template.
- [Remote Service Control](remote-service-control): use `peer`, `catalog`, and `access` in the full remote workflow.
- [Built-in WASI Support](wasi): compatibility note for the old standalone WASI guide.