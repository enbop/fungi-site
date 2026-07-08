---
title: Connect Two Devices
description: Save another device, trust it, and verify the link with ping.
sidebar_position: 3
slug: /quick-start/connect-devices
---

# Connect Two Devices

This quick start connects two devices you own.

You will:

- start `fungi daemon` on both devices
- save one device by name on the other
- trust the saved device for incoming Fungi service requests
- verify the link with `fungi ping`

## 1. Start The Daemon

Run this on both devices:

```bash
fungi daemon
```

Leave the daemon running while you use Fungi from another terminal or from the GUI.

## 2. Find The Device ID

On the device you want to save, print its ID:

```bash
fungi info id
```

Copy the value. It is the stable device identity used by Fungi.

If both devices are on the same local network, you can also try:

```bash
fungi device mdns
```

## 3. Save The Device

On your local device, save the other device with a name:

```bash
fungi device add my-mac <device-id>
```

The name is local to this Fungi directory. Use names that are easy to type, such as `my-mac`, `nas`, `vm`, or `laptop`.

List saved devices:

```bash
fungi device list
```

## 4. Trust The Device

Trust controls which saved devices may initiate incoming Fungi service requests.

On each side that should accept requests from the other side, run:

```bash
fungi device trust my-mac
```

List trusted devices:

```bash
fungi device trusted
```

## 5. Ping It

From your local device:

```bash
fungi ping my-mac
```

![Fungi ping connects to a saved device](/img/fungi-ping-dark.gif)

Stop with `Ctrl+C`.

If the devices are behind NAT, Fungi will try direct addresses and relay paths according to your relay settings.

## Next

- [Use A Service From Another Device](/docs/quick-start/use-service)
- [Devices And Trust](/docs/devices-and-trust)
- [Connection Diagnostics](/docs/connection-diagnostics)
