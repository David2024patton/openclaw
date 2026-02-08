---
name: azure-identity-py
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-identity-py/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# azure-identity-py



## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [azure-identity-py](https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-identity-py/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Azure Identity SDK for Python

Authentication library for Azure SDK clients using Microsoft Entra ID (formerly Azure AD).

## Installation

```bash
pip install azure-identity
```

## Environment Variables

```bash
# Service Principal (for production/CI)
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_ID=<your-client-id>
AZURE_CLIENT_SECRET=<your-client-secret>

# User-assigned Managed Identity (optional)
AZURE_CLIENT_ID=<managed-identity-client-id>
```

## DefaultAzureCredential

The recommended credential for most scenarios. Tries multiple authentication methods in order:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Works in local dev AND production without code changes
credential = DefaultAzureCredential()

client = BlobServiceClient(
    account_url="https://<account>.blob.core.windows.net",
    credential=credential
)
```

### Credential Chain Order

| Order | Credential | Environment |
|-------|-----------|-------------|
| 1 | EnvironmentCredential | CI/CD, containers |
| 2 | WorkloadIdentityCredential | Kubernetes |
| 3 | ManagedIdentityCredential | Azure VMs, App Service, Functions |
| 4 | SharedTokenCacheCredential | Windows only |
| 5 | VisualStudioCodeCredential | VS Code with Azure extension |
| 6 | AzureCliCredential | `az login` |
| 7 | AzurePowerShellCredential | `Connect-AzAccount` |
| 8 | AzureDeveloperCliCredential | `azd auth login` |

### Customizing DefaultAzureCredential

```python
# Exclude credentials you don't need
credential = DefaultAzureCredential(
    exclude_environment_credential=True,
    exclude_shared_token_cache_credential=True,
    managed_identity_client_id="<user-assigned-mi-client-id>"  # For user-assigned MI
)

# Enable interactive browser (disabled by default)
credential = DefaultAzureCredential(
    exclude_interactive_browser_credential=False
)
```

## Specific Credential Types

### ManagedIdentityCredential

For Azure-hosted resources (VMs, App Service, Fun
