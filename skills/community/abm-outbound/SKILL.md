---
name: abm-outbound
description: Multi-channel ABM automation that turns LinkedIn URLs into coordinated outbound campaigns.
homepage: https://github.com/openclaw/skills/tree/main/skills/dru-ca/abm-outbound/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# abm-outbound

Multi-channel ABM automation that turns LinkedIn URLs into coordinated outbound campaigns.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [abm-outbound](https://github.com/openclaw/skills/tree/main/skills/dru-ca/abm-outbound/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ABM Outbound

Turn LinkedIn prospect lists into multi-channel outbound: email sequences, LinkedIn touches, and handwritten letters.

## Prerequisites

| Service | Purpose | Sign Up |
|---------|---------|---------|
| **Apify** | LinkedIn scraping, Skip Trace | [apify.com](https://apify.com) |
| **Apollo** | Email & phone enrichment | [apollo.io](https://apollo.io) |
| **Scribeless** | Handwritten letters | [platform.scribeless.co](https://platform.scribeless.co) |
| **Instantly** *(optional)* | Dedicated cold email | [instantly.ai](https://instantly.ai) |

```bash
export APIFY_API_KEY="your_key"
export APOLLO_API_KEY="your_key"
export SCRIBELESS_API_KEY="your_key"
```

## Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. INPUT   │───▶│  2. SCRAPE  │───▶│  3. ENRICH  │───▶│  4. ADDRESS │───▶│ 5. OUTREACH │
│  LinkedIn   │    │  Profiles   │    │ Email/Phone │    │ Skip Trace  │    │             │
│    URLs     │    │             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
   Your list          Apify             Apollo            Apify PFI        Email +
                                                                          LinkedIn +
                                                                          Scribeless
```

## Step 1: Gather LinkedIn URLs

Provide a list of LinkedIn profile URLs from:
- LinkedIn Sales Navigator exports
- LinkedIn search scrapers
- CRM exports
- Manual prospecting

```csv
linkedin_url
https://linkedin.com/in/johndoe
https://linkedin.com/in/janesmith
```

## Step 2: Scrape LinkedIn Profiles

```bash
curl -X POST "https://api.apify.com/v2/acts/harvestapi~linkedin-profile-scraper/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "profileUrls": [
      "https://linkedin.com/in/johndoe",
      
