---
title: Service Files
description: Current fungi service/v1 service file format.
sidebar_position: 7
slug: /service-files
---

# Service Files

Service files describe what runs on a device and which named entries Fungi can connect to.

The current format starts with:

```yaml
fungi: service/v1
id: files
```

It can be plain YAML or front matter in a `.fungi.md` file.

## Docker Service

```yaml
fungi: service/v1
id: code
run:
  provider: docker
  source:
    image: ghcr.io/coder/code-server:4.117.0
  args:
    - --bind-addr
    - 0.0.0.0:8080
  mounts:
    - from: $fungi.workspace
      to: /home/coder/project
publish:
  http:
    tcp:
      port: 8080
    client:
      kind: web
      path: /
```

For Docker services, `publish.<entry>.tcp.port` is the workload port inside the container. Fungi chooses the local host port it needs on the device.

## Wasmtime HTTP Service

```yaml
fungi: service/v1
id: web-component
run:
  provider: wasmtime
  mode: http
  source:
    url: https://example.com/web-component.wasm
publish:
  http:
    tcp:
      port: 8080
    client:
      kind: web
      path: /
```

`mode: http` tells Fungi to serve a wasi-http component.

## Existing TCP Service

If there is no `run` section, the service points at an existing TCP listener on the target device.

```yaml
fungi: service/v1
id: home-ssh
publish:
  ssh:
    tcp:
      host: 127.0.0.1
      port: 22
    client:
      kind: ssh
```

Use this for services already running on the target device.

## Fields

- `id`: the service definition ID.
- `instance`: optional instance name; `fungi service apply <name>` can set this for managed services.
- `run.provider`: `docker` or `wasmtime`.
- `run.source.image`: Docker image.
- `run.source.url` or `run.source.file`: Wasmtime component source.
- `run.args`: command arguments for the runtime.
- `run.env`: environment variables.
- `run.mounts`: host paths mounted into the runtime.
- `publish`: named entries such as `http`, `ssh`, or `main`.
- `publish.<entry>.client`: optional client metadata such as `kind`, `path`, and `iconUrl`.

Useful path roots:

- `$fungi.workspace`: user-facing workspace directory for service data.
- `$fungi.service.data`: private data directory for this service instance.
- `$fungi.service.artifacts`: cached artifacts for this service instance.
- `$fungi.root`: root of the Fungi directory.

## Apply

```bash
fungi service apply files ./files.fungi.md --start
fungi service apply files@my-mac ./files.fungi.md --start
fungi service apply files ./files.fungi.md --dry-run
```

## Notes

- Use the current `fungi: service/v1` format for new files.
- Remote service snapshots store the entries needed to connect to a service, not the original service file.
