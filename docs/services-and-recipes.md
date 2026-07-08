---
title: Services And Recipes
description: List, apply, start, stop, inspect, and connect services.
sidebar_position: 6
slug: /services-and-recipes
---

# Services And Recipes

A Fungi service is something named on a device. It may be backed by Docker, Wasmtime, or an existing TCP service.

## List Services

```bash
fungi service list
```

Refresh saved devices before listing:

```bash
fungi service list --refresh
```

Target one saved device:

```bash
fungi service list --device my-mac
```

Plain listing can use the cached service snapshot. `--refresh` asks saved devices for current service state and updates the snapshot when the device is reachable.

## Recipes

Recipes are official service definitions known to the local daemon.

```bash
fungi service recipe list --refresh
fungi service recipe show <recipe-id>
```

Apply a recipe locally:

```bash
fungi service apply files --recipe <recipe-id> --start
```

Apply it on another saved device:

```bash
fungi service apply files@my-mac --recipe <recipe-id> --start
```

## Local Service Files

Apply a local `.fungi.md` or YAML service file:

```bash
fungi service apply files ./files.fungi.md --start
fungi service apply files@my-mac ./files.fungi.md --start
```

Preview without changing state:

```bash
fungi service apply files ./files.fungi.md --dry-run
```

## Lifecycle

```bash
fungi service start files
fungi service stop files
fungi service inspect files
fungi service logs files
fungi service remove files
```

Use `--device my-mac` or `files@my-mac` where the command supports a remote service target.

## Connect

Create or reuse a local address for a service:

```bash
fungi service connect files@my-mac
```

Pin the local port:

```bash
fungi service connect files@my-mac --local-port 18080
```

Disconnect the local listener while keeping the saved port:

```bash
fungi service disconnect files@my-mac
```

The shortcut uses the same connection flow:

```bash
fungi files@my-mac
```

## Startup Restore

When the daemon starts, it reads saved local preferences and tries to restore local listeners for services you used before. It uses the cached service snapshot as a fallback and refreshes live device state when possible.

If a device is offline, the saved preference is kept. The local listener may still be restored from cache, and the actual connection will succeed later when the device is reachable and the service entry has not changed.
