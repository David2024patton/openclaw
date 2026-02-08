---
name: google-ads
description: Query, audit, and optimize Google Ads campaigns.
homepage: https://github.com/openclaw/skills/tree/main/skills/jdrhyne/google-ads/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# google-ads

Query, audit, and optimize Google Ads campaigns.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [google-ads](https://github.com/openclaw/skills/tree/main/skills/jdrhyne/google-ads/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Google Ads Skill

Manage Google Ads accounts via API or browser automation.

## Mode Selection

**Check which mode to use:**

1. **API Mode** - If user has `google-ads.yaml` configured or `GOOGLE_ADS_*` env vars
2. **Browser Mode** - If user says "I don't have API access" or just wants quick checks

```bash
# Check for API config
ls ~/.google-ads.yaml 2>/dev/null || ls google-ads.yaml 2>/dev/null
```

If no config found, ask: "Do you have Google Ads API credentials, or should I use browser automation?"

---

## Browser Automation Mode (Universal)

**Requirements:** User logged into ads.google.com in browser

### Setup
1. User opens ads.google.com and logs in
2. User clicks Clawdbot Browser Relay toolbar icon (badge ON)
3. Use `browser` tool with `profile="chrome"`

### Common Workflows

#### Get Campaign Performance
```
1. Navigate to: ads.google.com/aw/campaigns
2. Set date range (top right date picker)
3. Snapshot the campaigns table
4. Parse: Campaign, Status, Budget, Cost, Conversions, Cost/Conv
```

#### Find Zero-Conversion Keywords (Wasted Spend)
```
1. Navigate to: ads.google.com/aw/keywords
2. Click "Add filter" → Conversions → Less than → 1
3. Click "Add filter" → Cost → Greater than → [threshold, e.g., $500]
4. Sort by Cost descending
5. Snapshot table for analysis
```

#### Pause Keywords/Campaigns
```
1. Navigate to keywords or campaigns view
2. Check boxes for items to pause
3. Click "Edit" dropdown → "Pause"
4. Confirm action
```

#### Download Reports
```
1. Navigate to desired view (campaigns, keywords, etc.)
2. Click "Download" icon (top right of table)
3. Select format (CSV recommended)
4. File downloads to user's Downloads folder
```

**For detailed browser selectors:** See `references/browser-workflows.md`

---

## API Mode (Power Users)

**Requirements:** Google Ads API developer token + OAuth credentials

### Setup Check
```bash
# Verify google-ads SDK
python -c "from google.ads.googleads.client import GoogleAdsClient; print('OK')"

# Check 
