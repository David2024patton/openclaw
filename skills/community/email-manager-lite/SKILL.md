---
name: email-manager-lite
description: Send and read emails via any IMAP/SMTP provider (Zoho, Outlook, Gmail, etc.).
homepage: https://github.com/openclaw/skills/tree/main/skills/jorgermp/email-manager-lite/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# email-manager-lite

Send and read emails via any IMAP/SMTP provider (Zoho, Outlook, Gmail, etc.).

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [email-manager-lite](https://github.com/openclaw/skills/tree/main/skills/jorgermp/email-manager-lite/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Email Manager Lite v0.2

A fully self-contained email management skill for OpenClaw. Uses standard IMAP and SMTP protocols with zero external dependencies.

## ✨ What's New in v0.2

### 🔍 Advanced Search & Filters
- Search by sender (`--from`)
- Search by subject keywords (`--subject`)
- Filter by date range (`--since`, `--before`)
- Filter by read/unread status (`--seen`, `--unseen`)
- Search in email body (`--body`, warning: can be slow)

### 📁 Folder Management
- List all IMAP folders with `folders` command
- Move emails between folders with `move` command
- Automatic validation of folder existence

### 📎 Attachment Information
- Automatic detection of attachments
- Display attachment details:
  - Filename
  - MIME type
  - File size (formatted KB/MB)
- Shown in both `read` and `search` results

## 🔧 Installation

```bash
cd skills/portable-email-manager
npm install
```

Dependencies are bundled in `package.json`:
- `nodemailer` - SMTP email sending
- `imap-simple` - IMAP operations
- `mailparser` - Email parsing and attachment detection

## 🔐 Credentials

Set these environment variables:

```bash
export EMAIL_USER="your.email@domain.com"
export EMAIL_PASS="your-app-password"
```

**Recommended:** Use App Passwords for Gmail, Outlook, Zoho instead of main password.

### Provider Setup

**Zoho Mail (default):**
- Already configured for `smtp.zoho.eu` and `imap.zoho.eu`
- Generate App Password: https://accounts.zoho.eu/home#security/apppasswords

**Gmail:**
- Edit `scripts/email.js` and change:
  ```javascript
  host: 'smtp.gmail.com'  // SMTP
  host: 'imap.gmail.com'  // IMAP
  ```
- Enable 2FA and create App Password: https://myaccount.google.com/apppasswords

**Outlook/Hotmail:**
- Edit to use `smtp.office365.com` / `outlook.office365.com`
- Port 587 for SMTP (TLS)

## 📖 Usage

### Send Email

```bash
./scripts/email.js send "recipient@example.com" "Subject" "Email body text"
```

**Example:**
```bash
./scripts/email.js send "boss@company.com" "Weekly Report" 
