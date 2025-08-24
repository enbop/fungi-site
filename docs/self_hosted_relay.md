# Self-hosted Relay

This guide shows you how to set up your own relay server using Fungi CLI for improved network connectivity.

## What is a Relay?

Fungi CLI includes a built-in relay server functionality. A relay helps establish connections between peers that are behind NAT or firewalls, acting as an intermediary to facilitate peer-to-peer communication.

## Step 1: Start the Relay Server

On your server, start the relay using the following command:

```bash
fungi relay -p ${SERVER_PUBLIC_IP}
```

- Replace `${SERVER_PUBLIC_IP}` with your server's actual public IP address
- The relay defaults to listening on TCP and UDP port 30001
- You can specify a different port using the `-t` (for tcp) and `-u` (for udp) flag if needed

## Step 2: Get Relay Addresses

After starting the relay, you'll see the relay addresses in the terminal output:

```
/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx
/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx
```

Copy these addresses - you'll need them for client configuration.

## Step 3: Configure Fungi Clients

Add the relay addresses to your client's `config.toml` file:

```toml
[network]
listen_tcp_port = 0
listen_udp_port = 0
incoming_allowed_peers = [...]
disable_relay = false
# Add your custom relay server addresses
custom_relay_addresses = [
    "/ip4/{SERVER_PUBLIC_IP}/tcp/30001/p2p/16Uiu2HAmxxx",
    "/ip4/{SERVER_PUBLIC_IP}/udp/30001/quic-v1/p2p/16Uiu2HAmxxx",
]
```

## Step 4: Apply Changes

Restart your Fungi clients to apply the configuration changes.

## Important Notes

- Adding custom relay addresses will replace the built-in community relay server
- To revert to the community relay server, simply remove the `custom_relay_addresses` entries from your configuration
- Ensure your server's firewall allows traffic on port 30001 (or your custom port) for both TCP and UDP