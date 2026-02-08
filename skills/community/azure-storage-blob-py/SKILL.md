---
name: azure-storage-blob-py
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-storage-blob-py/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# azure-storage-blob-py



## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [azure-storage-blob-py](https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-storage-blob-py/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Azure Blob Storage SDK for Python

Client library for Azure Blob Storage — object storage for unstructured data.

## Installation

```bash
pip install azure-storage-blob azure-identity
```

## Environment Variables

```bash
AZURE_STORAGE_ACCOUNT_NAME=<your-storage-account>
# Or use full URL
AZURE_STORAGE_ACCOUNT_URL=https://<account>.blob.core.windows.net
```

## Authentication

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

credential = DefaultAzureCredential()
account_url = "https://<account>.blob.core.windows.net"

blob_service_client = BlobServiceClient(account_url, credential=credential)
```

## Client Hierarchy

| Client | Purpose | Get From |
|--------|---------|----------|
| `BlobServiceClient` | Account-level operations | Direct instantiation |
| `ContainerClient` | Container operations | `blob_service_client.get_container_client()` |
| `BlobClient` | Single blob operations | `container_client.get_blob_client()` |

## Core Workflow

### Create Container

```python
container_client = blob_service_client.get_container_client("mycontainer")
container_client.create_container()
```

### Upload Blob

```python
# From file path
blob_client = blob_service_client.get_blob_client(
    container="mycontainer",
    blob="sample.txt"
)

with open("./local-file.txt", "rb") as data:
    blob_client.upload_blob(data, overwrite=True)

# From bytes/string
blob_client.upload_blob(b"Hello, World!", overwrite=True)

# From stream
import io
stream = io.BytesIO(b"Stream content")
blob_client.upload_blob(stream, overwrite=True)
```

### Download Blob

```python
blob_client = blob_service_client.get_blob_client(
    container="mycontainer",
    blob="sample.txt"
)

# To file
with open("./downloaded.txt", "wb") as file:
    download_stream = blob_client.download_blob()
    file.write(download_stream.readall())

# To memory
download_stream = blob_client.download_blob()
content = download_stream.readall()  # bytes

# Rea
