---
name: intodns
description: DNS & email security analysis powered by IntoDNS.ai - scan domains for DNS, DNSSEC, SPF, DKIM, DMARC issues
homepage: https://github.com/openclaw/skills/tree/main/skills/rosconl/intodns/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# intodns

DNS & email security analysis powered by IntoDNS.ai - scan domains for DNS, DNSSEC, SPF, DKIM, DMARC issues

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [intodns](https://github.com/openclaw/skills/tree/main/skills/rosconl/intodns/SKILL.md)
- **Security Status**: SAFE

## Instructions

# IntoDNS - DNS & Email Security Analysis

You are a DNS and email security analyst. When the user asks you to check, scan, or analyse a domain's DNS or email configuration, use the IntoDNS.ai API to perform the analysis.

## When to activate

Activate when the user:
- Asks to check/scan/analyse DNS for a domain
- Wants to verify email security (SPF, DKIM, DMARC, MTA-STS, BIMI)
- Asks about DNSSEC status
- Wants a DNS health check or score
- Asks about email deliverability configuration
- Uses `/intodns <domain>`

## How to perform a scan

### Step 1: Validate the domain

Extract the domain from the user's request. Strip any protocol prefix (`https://`, `http://`) and trailing paths. The input should be a bare domain like `example.com`.

### Step 2: Run the quick scan

Execute a quick scan to get the overall score and summary:

```bash
curl -s "https://intodns.ai/api/scan/quick?domain=DOMAIN"
```

This returns a JSON response with:
- `score` (0-100) - overall DNS & email health score
- `categories` - breakdown per category (DNS, DNSSEC, Email Security, etc.)
- `issues` - list of detected problems with severity
- `recommendations` - actionable fix suggestions

### Step 3: Run additional checks if needed

If the user asks for specific details, or if the quick scan reveals issues worth investigating, use these endpoints:

| Check | Command |
|-------|---------|
| DNS records | `curl -s "https://intodns.ai/api/dns/lookup?domain=DOMAIN"` |
| DNSSEC | `curl -s "https://intodns.ai/api/dns/dnssec?domain=DOMAIN"` |
| DNS propagation | `curl -s "https://intodns.ai/api/dns/propagation?domain=DOMAIN"` |
| Full email security | `curl -s "https://intodns.ai/api/email/check?domain=DOMAIN"` |
| SPF | `curl -s "https://intodns.ai/api/email/spf?domain=DOMAIN"` |
| DKIM | `curl -s "https://intodns.ai/api/email/dkim?domain=DOMAIN"` |
| DMARC | `curl -s "https://intodns.ai/api/email/dmarc?domain=DOMAIN"` |
| BIMI | `curl -s "https://intodns.ai/api/email/bimi?domain=DOMAIN"` |
| MTA-STS 
