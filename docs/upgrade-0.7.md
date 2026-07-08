---
title: Upgrade To 0.7
description: Important migration notes for the 0.7 configuration and service model.
sidebar_position: 11
slug: /upgrade-0.7
---

# Upgrade To 0.7

Fungi 0.7 simplifies the user model around devices and services. It also includes a breaking configuration migration.

## Back Up First

Before upgrading, make your own backup of the Fungi directory if existing service data or old forwarding configuration matters.

The migration also creates a snapshot under `bk/` before changing the live directory, but keeping an external backup is safer.

## Run Migration

Most commands migrate the directory before they run. You can also run migration explicitly:

```bash
fungi migrate
```

If you use a custom Fungi directory:

```bash
fungi -f /path/to/fungi migrate
```

## What Changes

- Managed service state moves into the current `services/<local_service_id>/` layout.
- Existing managed service data moves into per-service `appdata/services/<local_service_id>/` directories.
- Legacy service access records migrate into `local_preferences`.
- Old remote service caches are backed up and removed.
- Old forwarding and file transfer config sections are removed instead of kept as runtime compatibility paths.

## Commands To Relearn

Use device commands:

```bash
fungi device add my-mac <device-id>
fungi device trust my-mac
fungi device list
```

Use service commands:

```bash
fungi service list --refresh
fungi service apply files@my-mac --recipe <recipe-id> --start
fungi service connect files@my-mac
fungi files@my-mac
```

The older remote command split has been removed from the active user model. Use the unified `device` and `service` commands for new workflows.

## After Upgrade

Restart daemons after updating binaries. Then refresh service state:

```bash
fungi service list --refresh
```

If a previous raw forwarding rule does not come back, recreate it as a service file or apply a recipe that represents the service you want to use.
