# Self-hosted Relay

This guide shows you how to set up your own relay server using Fungi CLI for improved network connectivity.

Need Fungi CLI first? Start at [Install Fungi](/docs/install).

## What is a Relay?

Fungi CLI includes a built-in relay server functionality. A relay helps establish connections between peers that are behind NAT or firewalls, acting as an intermediary to facilitate peer-to-peer communication.

## Step 1: Start the Relay Server

On your server, start the relay using the following command:

```bash
fungi daemon relay-server -p ${SERVER_PUBLIC_IP}
```

- Replace `${SERVER_PUBLIC_IP}` with your server's actual public IP address
- The relay defaults to listening on TCP and UDP port 30001
- You can specify a different port using the `--tcp-listen-port` and `--udp-listen-port` flags if needed

## Step 2: Get Relay Addresses

After starting the relay, you'll see the relay addresses in the terminal output:

```
/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx
/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx
```

Copy these addresses - you'll need them for client configuration.

## Step 3: Configure Fungi Clients

On each client node, configure relay usage with the Fungi CLI. These commands work before or after the daemon is running.

If you want to use only your own relay and disable the built-in community relay:

```bash
fungi relay use-community off
fungi relay add "/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx"
fungi relay add "/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx"
```

You can inspect the final effective relay list with:

```bash
fungi relay show
```

If you still prefer to inspect the config file directly, the persisted settings now look like this:

```toml
[network]
listen_tcp_port = 0
listen_udp_port = 0
incoming_allowed_peers = [...]
relay_enabled = true
use_community_relays = false
custom_relay_addresses = [
    "/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx",
    "/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx",
]
```

## Step 4: Apply Changes

Restart any already-running Fungi daemon after changing relay settings so new connections use the updated relay list.

## Important Notes

- Adding custom relay addresses no longer implicitly replaces the community relay set. Use `fungi relay use-community off` when you want only your own relays.
- To re-enable the built-in community relay, run `fungi relay use-community on`.
- To remove a custom relay, run `fungi relay remove <multiaddr>`.
- Ensure your server's firewall allows traffic on port 30001 (or your custom port) for both TCP and UDP