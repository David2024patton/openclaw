---
name: 2captcha
description: Solve CAPTCHAs using 2Captcha service.
homepage: https://github.com/openclaw/skills/tree/main/skills/adinvadim/2captcha/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# 2captcha

Solve CAPTCHAs using 2Captcha service.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [2captcha](https://github.com/openclaw/skills/tree/main/skills/adinvadim/2captcha/SKILL.md)
- **Security Status**: SAFE

## Instructions

# 2Captcha Skill

Solve CAPTCHAs programmatically using the 2Captcha human-powered service.

## Installation

```bash
# One-line install
curl -fsSL https://raw.githubusercontent.com/adinvadim/2captcha-cli/main/solve-captcha \
  -o /usr/local/bin/solve-captcha && chmod +x /usr/local/bin/solve-captcha

# Verify
solve-captcha --version
```

## Configuration

```bash
# Save your 2Captcha API key
mkdir -p ~/.config/2captcha
echo "YOUR_API_KEY" > ~/.config/2captcha/api-key

# Or use environment variable
export TWOCAPTCHA_API_KEY="your-key"
```

Get your API key at https://2captcha.com/enterpage

## Quick Reference

### Check Balance First
```bash
./solve-captcha balance
```

### Image CAPTCHA
```bash
# From file
./solve-captcha image /path/to/captcha.png

# From URL  
./solve-captcha image "https://site.com/captcha.jpg"

# With options
./solve-captcha image captcha.png --numeric 1 --math
./solve-captcha image captcha.png --comment "Enter red letters only"
```

### reCAPTCHA v2
```bash
./solve-captcha recaptcha2 --sitekey "6Le-wvk..." --url "https://example.com"
```

### reCAPTCHA v3
```bash
./solve-captcha recaptcha3 --sitekey "KEY" --url "URL" --action "submit" --min-score 0.7
```

### hCaptcha
```bash
./solve-captcha hcaptcha --sitekey "KEY" --url "URL"
```

### Cloudflare Turnstile
```bash
./solve-captcha turnstile --sitekey "0x4AAA..." --url "URL"
```

### FunCaptcha (Arkose)
```bash
./solve-captcha funcaptcha --public-key "KEY" --url "URL"
```

### GeeTest
```bash
# v3
./solve-captcha geetest --gt "GT" --challenge "CHALLENGE" --url "URL"

# v4
./solve-captcha geetest4 --captcha-id "ID" --url "URL"
```

### Text Question
```bash
./solve-captcha text "What color is the sky?" --lang en
```

## Finding CAPTCHA Parameters

### reCAPTCHA sitekey
Look for:
- `data-sitekey` attribute in HTML
- `k=` parameter in reCAPTCHA iframe URL
- Network request to `google.com/recaptcha/api2/anchor`

### hCaptcha sitekey
Look for:
- `data-sitekey` in hCaptcha div
- Network requests to `h
