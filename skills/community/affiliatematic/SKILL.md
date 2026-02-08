---
name: affiliatematic
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/dowands/affiliatematic/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# affiliatematic



## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [affiliatematic](https://github.com/openclaw/skills/tree/main/skills/dowands/affiliatematic/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Affiliatematic - Amazon Affiliate Automation

AI-powered system that automatically analyzes webpage content and displays relevant Amazon product recommendations. Zero manual product selection required.

## How It Works

```
Visitor lands on page
       ↓
AI analyzes page content (title, meta, text)
       ↓
Extracts keywords & identifies product categories
       ↓
Matches relevant Amazon products
       ↓
Displays widget with affiliate links
       ↓
You earn commission on purchases
```

## Quick Integration (5 minutes)

### Step 1: Get Amazon Affiliate Tag
Sign up at https://affiliate-program.amazon.com if you don't have one.
Your tag looks like: `yoursite-20`

### Step 2: Whitelist Your Domain
1. Sign up at https://affiliatematic.com
2. Go to Dashboard → Add domain
3. Add both `example.com` AND `www.example.com` (they're treated separately)

### Step 3: Add Widget HTML
Place this where you want recommendations to appear:

```html
<div class="amazon-widget-container" data-tag="your-affiliate-tag"></div>
```

### Step 4: Include Script
Add before closing `</body>`:

```html
<script src="https://affiliatematic.com/amazon-widget.iife.js" async></script>
```

## Configuration Options

| Attribute | Description | Required |
|-----------|-------------|----------|
| `data-tag` | Your Amazon affiliate tag (e.g., "yoursite-20") | ✅ Yes |

## Performance Benchmarks (Real Data)

| Metric | Improvement |
|--------|-------------|
| Click-Through Rate | +150-300% (2.5x average) |
| Conversion Rate | +40-60% (1.5x average) |
| Commission Value | +25% (higher-value products) |
| Response Time | <100ms |
| Uptime | 99.9% |

## Best Placement Strategies

**High-converting positions:**
- End of blog posts (after main content)
- Sidebar on product review pages
- Within "recommended products" sections
- After comparison tables

**Content types that work best:**
- Product reviews & comparisons
- How-to guides with equipment needs
- "Best X for Y" articles
- Tutorial content requiring
