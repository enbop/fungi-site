# gRPC Guide
Starting from version 0.4.0, the Fungi daemon uses gRPC for inter-process communication. 
Both fungi-cli and fungi-app (GUI) communicate with the Fungi daemon through gRPC.

You can also use any gRPC client to interact with the Fungi daemon.

### gRPC Server Address
By default, the Fungi daemon starts a gRPC server listening on `127.0.0.1:5405`.
You can change the listening address in the configuration file `~/.fungi/config.toml`:

```toml
[rpc]
listen_address = "127.0.0.1:5405"
```

(Restart the Fungi daemon to apply changes)

### gRPC Service Definition
The gRPC service definition is available in the Fungi repository: 
[fungi_daemon.proto](https://github.com/enbop/fungi/blob/master/crates/daemon-grpc/proto/fungi_daemon.proto)

You can also download it from the [latest release](https://github.com/enbop/fungi/releases/latest/download/fungi_daemon.proto).


### Using gRPC Client
You can use any gRPC client to interact with the Fungi daemon. Here is an example using the `grpcurl` command-line tool.


#### Start Fungi Daemon

Run the Fungi App GUI or use the CLI command `./fungi daemon` to start the Fungi daemon.


#### Download `fungi_daemon.proto`

```bash
wget https://github.com/enbop/fungi/releases/latest/download/fungi_daemon.proto
```

#### List Services

```bash
grpcurl -proto fungi_daemon.proto list fungi_daemon.FungiDaemon
```
output:
```
fungi_daemon.FungiDaemon.AddFileTransferClient
fungi_daemon.FungiDaemon.AddIncomingAllowedPeer
fungi_daemon.FungiDaemon.AddTcpForwardingRule
fungi_daemon.FungiDaemon.AddTcpListeningRule
fungi_daemon.FungiDaemon.ConfigFilePath
...
```

#### Call Methods
Show the peer ID of this device:
```bash
grpcurl -proto fungi_daemon.proto -plaintext 127.0.0.1:5405 fungi_daemon.FungiDaemon/PeerId
```

Output:
```json
{
  "peerId": "16Uiu2HAkuvL7awV2aph1E6W5qnw5pntTA5tJ3ohkMYLWNu49Wkgz"
}
```