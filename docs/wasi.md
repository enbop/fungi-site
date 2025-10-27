# Built-in WASI Support

> **⚠️ Experimental Feature:** WASI support in Fungi CLI is experimental and may change in future releases.

Starting from version 0.4.0, Fungi CLI includes built-in support for running WebAssembly modules using the WASI (WebAssembly System Interface) standard.

It re-exports commands from the [Wasmtime](https://github.com/bytecodealliance/wasmtime) project, allowing you to run WebAssembly modules with WASI support directly from the Fungi CLI.

>**Recommended Reading:** If you're new to Fungi, we recommend reading the [CLI Service Quick Start](cli-service-quick-start) guide first to understand the basics of Fungi's networking and port forwarding.

### Available WASI Commands

`fungi run <wasm-file> [args...]` - Runs a WebAssembly module with WASI support.

`fungi serve <wasm-file> [options]` - Serves a WebAssembly module as an HTTP service with `wasi-http`.

### Example Usage

This example demonstrates how to run a WASI module on **Device A** and access it remotely from **Device B** through Fungi's port forwarding.

>**Prerequisites:**
>- Both Device A and Device B have Fungi daemon installed and running
>- Device B is added to Device A's `incoming-allowed-peers` list
>- For setup instructions, see the [CLI Service Quick Start](cli-service-quick-start) guide

We'll use [spore-box](https://github.com/enbop/spore-box), a toy WASI application that allows you to transfer files and short messages between devices.

#### On Device A: Download Pre-compiled WASI Module

```bash
wget https://github.com/enbop/spore-box/releases/download/v0.2.0/spore-box.wasm
```

(Or build from [source](https://github.com/enbop/spore-box))

#### On Device A: Start Serving the WASI Module

Create a data directory to store spore-box data:

```bash
mkdir data
```

Start the wasi-http server using Fungi CLI:
```bash
fungi serve --addr=127.0.0.1:8081 -Scli --dir data spore-box.wasm
```

(This is equivalent to running `wasmtime serve --addr=127.0.0.1:8081 --dir data spore-box.wasm` if you have Wasmtime installed)

- `--addr` - Specifies the listening address for the HTTP server
- `-Scli` - Enables the `wasi-cli` and other initialized modules
- `--dir data` - Mounts the `data` directory to the WASI module for persistent storage
  
>**Note:** The WASI runtime is a sandboxed environment and can only access files and directories explicitly mounted to it.

#### On Device A: Access the WASI Service Locally

Now you can access the spore-box service in your browser at `http://127.0.0.1:8081?device=deviceA`.

>The `?device=deviceA` parameter sets a unique identifier for this device in the spore-box application.

#### On Device A: Enable Port Forwarding

Make sure you have the Fungi daemon running. Open another terminal and add a port-listening rule to share port `8081` through Fungi:

```bash
fungi tn add-listen 127.0.0.1:8081
```

<small>*This operation can also be performed in the Fungi App GUI.*</small>

This allows Device B to access this WASI service through Fungi's network.


#### On Device B: Add Forwarding Rule

Make sure Device B has the Fungi daemon running and is connected to Device A.

Add a port-forwarding rule to access the WASI service running on Device A:

```bash
fungi tn add-forward 127.0.0.1:18081 ${PeerID-of-DeviceA} 8081
```

<small>*This operation can also be performed in the Fungi App GUI.*</small>

This command forwards local port `18081` on Device B to port `8081` on Device A. You can use any available local port instead of `18081`.

>You can get Device A's PeerID by running `fungi info id` on Device A, or checking the Fungi App GUI.

#### On Device B: Access the WASI Service Remotely

Now on Device B, open your browser and access `http://127.0.0.1:18081?device=deviceB`.

The service is now accessible as if it were running locally on Device B!


#### Use the Spore-Box Service

You can now send messages or files through the spore-box web interface on either device, and they will be transferred securely between Device A and Device B via Fungi's P2P network.

![spore-box screenshot](/img/docs/spore-box-screenshot.png)