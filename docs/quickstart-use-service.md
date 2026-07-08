---
title: Use A Service From Another Device
description: Start from a saved device and open a remote service locally.
sidebar_position: 4
slug: /quick-start/use-service
---

# Use A Service From Another Device

Fungi's main workflow is:

1. Choose a device.
2. Run or find a service on that device.
3. Open that service from here.

This page uses placeholders for the service recipe because the exact recipe list can change between releases.

## 1. Make Sure The Device Is Saved

If you have not connected two devices yet, start with [Connect Two Devices](/docs/quick-start/connect-devices).

You should have a saved device name:

```bash
fungi device list
```

## 2. See Available Recipes

Official recipes are managed by the local daemon:

```bash
fungi service recipe list --refresh
```

Inspect one recipe before applying it:

```bash
fungi service recipe show <recipe-id>
```

## 3. Apply The Service On A Device

Use `name@device` as the target:

```bash
fungi service apply files@my-mac --recipe <recipe-id> --start
```

This creates or updates a service named `files` on `my-mac`, then starts it.

## 4. Open It From Here

Use the shortcut:

```bash
fungi files@my-mac
```

Or use the explicit command:

```bash
fungi service connect files@my-mac
```

Fungi creates or reuses a local listener and prints the local address. The saved local preference lets the daemon restore the listener on the next start when a cached service snapshot is available.

![Fungi opens a file browser service from another device on localhost](/img/fungi-filebrowser-dark.gif)

## 5. Refresh Service State

List local services and cached remote services:

```bash
fungi service list
```

Refresh saved devices:

```bash
fungi service list --refresh
```

## Next

- [Services And Recipes](/docs/services-and-recipes)
- [Service Files](/docs/service-files)
- [Connection Diagnostics](/docs/connection-diagnostics)
