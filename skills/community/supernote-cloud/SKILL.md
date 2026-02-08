---
name: supernote-cloud
description: Access a self-hosted Supernote Private Cloud instance to browse files and folders, upload documents (PDF, EPUB).
homepage: https://github.com/openclaw/skills/tree/main/skills/nickian/supernote-cloud/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# supernote-cloud

Access a self-hosted Supernote Private Cloud instance to browse files and folders, upload documents (PDF, EPUB).

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [supernote-cloud](https://github.com/openclaw/skills/tree/main/skills/nickian/supernote-cloud/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Supernote Private Cloud

Browse, upload, and manage files on a self-hosted Supernote Private Cloud via its reverse-engineered REST API. Includes article-to-ebook conversion for sending web content to the device.

## Setup

```bash
export SUPERNOTE_URL="http://192.168.50.168:8080"
export SUPERNOTE_USER="your@email.com"
export SUPERNOTE_PASSWORD="your_password"
```

Python dependencies (for article conversion): `readability-lxml`, `ebooklib`, `requests`, `beautifulsoup4`, `lxml`.

## Commands

### Send a web article to the device

```bash
{baseDir}/scripts/supernote.sh send-article --url "https://example.com/article" --format epub --dir-path Document
{baseDir}/scripts/supernote.sh send-article --url "https://example.com/article" --format pdf --dir-path "Document/Articles"
{baseDir}/scripts/supernote.sh send-article --url "https://example.com/article" --title "Custom Title" --dir-path Document
```

Fetches article content, extracts readable text with images, converts to clean EPUB or PDF, then uploads to the specified folder. Default format: epub. Default folder: Document.

### List directory contents

```bash
{baseDir}/scripts/supernote.sh ls
{baseDir}/scripts/supernote.sh ls --path Document
{baseDir}/scripts/supernote.sh ls --path "Note/Journal"
{baseDir}/scripts/supernote.sh ls --dir 778507258886619136
```

### Directory tree

```bash
{baseDir}/scripts/supernote.sh tree --depth 2
```

### Find directory ID by path

```bash
{baseDir}/scripts/supernote.sh find-dir --path "Document/Books"
```

### Upload a file

```bash
{baseDir}/scripts/supernote.sh upload --file /path/to/file.pdf --dir-path Document
{baseDir}/scripts/supernote.sh upload --file /path/to/book.epub --dir-path "Document/Books"
{baseDir}/scripts/supernote.sh upload --file /path/to/file.pdf --dir 778507258773372928 --name "Renamed.pdf"
```

### Check storage capacity

```bash
{baseDir}/scripts/supernote.sh capacity
```

### Login (manual)

```bash
{baseDir}/scripts/supernote.sh login
```

## Default Fold
