---
sidebar_position: 1
---

# Fungi Documentation

Fungi turns your devices into a personal app platform. Run apps on any device, and access them securely from anywhere.

Fungi connects your trusted devices and runs apps as sandboxed services. Access those services locally from another device without opening public ports.

The core model is small:

- **Devices** are machines you save by name.
- **Services** are sandboxed apps or existing endpoints that run on a device.
- **Local access** lets you use `service@device` from your current device.

Start with [Install Fungi](/docs/install), then connect two devices and open a service from one device on another.

## Start Here

- [Connect Two Devices](/docs/quick-start/connect-devices): save another device, trust it, and verify the link.
- [Use A Service From Another Device](/docs/quick-start/use-service): apply a service and open it locally.

## Core Concepts

- `fungi daemon` runs networking, discovery, relays, service state, and local service listeners.
- `fungi device` saves devices and manages trust.
- `fungi service` lists, applies, starts, stops, inspects, and connects services.
- Remote service snapshots are lightweight caches. They help offline display and startup restore, but live device refresh is the source of truth.
- The CLI, GUI, and custom integrations talk to the same local daemon API.

## Documentation Map

- [Install Fungi](/docs/install)
- [Connect Two Devices](/docs/quick-start/connect-devices)
- [Use A Service From Another Device](/docs/quick-start/use-service)
- [Devices And Trust](/docs/devices-and-trust)
- [Services And Recipes](/docs/services-and-recipes)
- [Service Files](/docs/service-files)
- [Connection Diagnostics](/docs/connection-diagnostics)
- [Self-hosted Relay](/docs/self-hosted-relay)
- [gRPC API](/docs/grpc-guide)
- [Upgrade To 0.7](/docs/upgrade-0.7)
