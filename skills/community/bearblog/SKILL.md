---
name: bearblog
description: Create and manage blog posts on Bear Blog (bearblog.dev).
homepage: https://github.com/openclaw/skills/tree/main/skills/azade-c/bearblog/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# bearblog

Create and manage blog posts on Bear Blog (bearblog.dev).

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [bearblog](https://github.com/openclaw/skills/tree/main/skills/azade-c/bearblog/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Bear Blog Skill

Create, edit, and manage posts on [Bear Blog](https://bearblog.dev) — a minimal, fast blogging platform.

## Authentication

Bear Blog requires browser-based authentication. Log in once via the browser tool, and cookies will persist.

```
browser action:navigate url:https://bearblog.dev/accounts/login/
```

## Creating a Post

### Step 1: Navigate to the post editor

```
browser action:navigate url:https://bearblog.dev/<subdomain>/dashboard/posts/new/
```


### Step 2: Fill the editor

Bear Blog uses a **plain text header format**.

The editor fields are:
- `div#header_content` (contenteditable): attributes (one per line)
- `textarea#body_content`: Markdown body

**Verified:** use `fill`/`type` on those two fields, then click **Publish** (or **Save as draft**). No `evaluate` needed.

**Header format:**
```
title: Your Post Title
link: custom-slug
published_date: 2026-01-05 14:00
tags: tag1, tag2, tag3
make_discoverable: true
is_page: false
class_name: custom-css-class
meta_description: SEO description for the post
meta_image: https://example.com/image.jpg
lang: en
canonical_url: https://original-source.com/post
alias: alternative-url
```

**Body format:** Standard Markdown with extensions (see below).

The separator `___` (three underscores) is used in templates to separate header from body.

### Step 3: Publish

Click the publish button or submit the form with `publish: true`.

## Post Attributes Reference

| Attribute | Description | Example |
|-----------|-------------|---------|
| `title` | Post title (required) | `title: My Post` |
| `link` | Custom URL slug | `link: my-custom-url` |
| `published_date` | Publication date/time | `published_date: 2026-01-05 14:30` |
| `tags` | Comma-separated tags | `tags: tech, ai, coding` |
| `make_discoverable` | Show in discovery feed | `make_discoverable: true` |
| `is_page` | Static page vs blog post | `is_page: false` |
| `class_name` | Custom CSS class (slugified) | `class_name: featured` |
| `meta_desc
