---
name: feishu-doc-reader
description: Read and extract content from Feishu (Lark) documents using the official Feishu Open API
homepage: https://github.com/openclaw/skills/tree/main/skills/snowshadow/feishu-doc-reader/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# feishu-doc-reader

Read and extract content from Feishu (Lark) documents using the official Feishu Open API

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [feishu-doc-reader](https://github.com/openclaw/skills/tree/main/skills/snowshadow/feishu-doc-reader/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Feishu Document Reader

This skill enables reading and extracting content from Feishu (Lark) documents using the official Feishu Open API.

## Configuration

### Set Up the Skill

1. Create the configuration file at `./reference/feishu_config.json` with your Feishu app credentials:

```json
{
  "app_id": "your_feishu_app_id_here",
  "app_secret": "your_feishu_app_secret_here"
}
```

2. Make sure the scripts are executable:
```bash
chmod +x scripts/read_doc.sh
chmod +x scripts/get_blocks.sh
```

**Security Note**: The configuration file should be kept secure and not committed to version control. Consider using proper file permissions (`chmod 600 ./reference/feishu_config.json`).

## Usage

### Basic Document Reading

To read a Feishu document, you need the document token (found in the URL: `https://example.feishu.cn/docx/DOC_TOKEN`).

**Using the shell script (recommended):**
```bash
# Make sure environment variables are set first
./scripts/read_doc.sh "your_doc_token_here"

# Or specify document type explicitly
./scripts/read_doc.sh "docx_token" "doc"
./scripts/read_doc.sh "sheet_token" "sheet"
```

### Get Detailed Document Blocks (NEW)

For complete document structure with all blocks, use the dedicated blocks script:

```bash
# Get full document blocks structure
./scripts/get_blocks.sh "docx_AbCdEfGhIjKlMnOpQrStUv"

# Get specific block by ID
./scripts/get_blocks.sh "docx_token" "block_id"

# Get blocks with children
./scripts/get_blocks.sh "docx_token" "" "true"
```

**Using Python directly for blocks:**
```bash
python scripts/get_feishu_doc_blocks.py --doc-token "your_doc_token_here"
python scripts/get_feishu_doc_blocks.py --doc-token "docx_token" --block-id "block_id"
python scripts/get_feishu_doc_blocks.py --doc-token "docx_token" --include-children
```

### Supported Document Types

- **Docx documents** (new Feishu docs): Full content extraction with blocks, metadata, and structure
- **Doc documents** (legacy): Basic metadata and limited content  
- **Sheet
