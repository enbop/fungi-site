---
sidebar_position: 7
---

# Deprecated File Transfer

This file transfer workflow will be gradually deprecated over the next few releases. Please prefer the service workflow instead, and start with [Remote Service Control](remote-service-control).

This page remains only as a basic reference for existing FTP and WebDAV users.

## Start The File Transfer Service

Expose a local directory:

```bash
./fungi ft-service start --root-dir /path/to/share
./fungi ft-service status
```

Short alias form:

```bash
./fungi fs start --root-dir /path/to/share
./fungi fs status
```

Stop the service:

```bash
./fungi fs stop
```

## Allow Trusted Peers

The remote device still needs to be added to your allowlist:

```bash
./fungi device add <peer-id> --alias laptop
./fungi security allowed-peers add laptop
./fungi security allowed-peers list
```

## Configuration Notes

Relevant config sections are still:

```toml
[file_transfer.server]
enabled = true
shared_root_dir = "/tmp"

[file_transfer.proxy_ftp]
enabled = false
host = "127.0.0.1"
port = 2121

[file_transfer.proxy_webdav]
enabled = false
host = "127.0.0.1"
port = 8181
```

If you are adopting Fungi today, do not build new flows around this feature. Prefer services exposed through `service`, `catalog`, and `access`.