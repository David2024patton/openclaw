---
name: k8s-certs
description: Kubernetes certificate management with cert-manager.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-certs/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8s-certs

Kubernetes certificate management with cert-manager.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8s-certs](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-certs/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Certificate Management with cert-manager

Manage TLS certificates using kubectl-mcp-server's cert-manager tools.

## Check Installation

```python
certmanager_detect_tool()
```

## Certificates

### List Certificates

```python
# List all certificates
certmanager_certificates_list_tool(namespace="default")

# Check certificate status
# - True: Certificate ready
# - False: Certificate not ready (check events)
```

### Get Certificate Details

```python
certmanager_certificate_get_tool(
    name="my-tls",
    namespace="default"
)
# Shows:
# - Issuer reference
# - Secret name
# - DNS names
# - Expiry date
# - Renewal time
```

### Create Certificate

```python
kubectl_apply(manifest="""
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-tls
  namespace: default
spec:
  secretName: my-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - app.example.com
  - www.example.com
""")
```

## Issuers

### List Issuers

```python
# Namespace issuers
certmanager_issuers_list_tool(namespace="default")

# Cluster-wide issuers
certmanager_clusterissuers_list_tool()
```

### Get Issuer Details

```python
certmanager_issuer_get_tool(name="my-issuer", namespace="default")
certmanager_clusterissuer_get_tool(name="letsencrypt-prod")
```

### Create Let's Encrypt Issuer

```python
# Staging (for testing)
kubectl_apply(manifest="""
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - http01:
        ingress:
          class: nginx
""")

# Production
kubectl_apply(manifest="""
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-
