---
name: job-auto-apply
description: Automated job search and application system for Clawdbot.
homepage: https://github.com/openclaw/skills/tree/main/skills/veeky-kumar/job-auto-apply/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# job-auto-apply

Automated job search and application system for Clawdbot.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [job-auto-apply](https://github.com/openclaw/skills/tree/main/skills/veeky-kumar/job-auto-apply/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Job Auto-Apply Skill

Automate job searching and application submission across multiple job platforms using Clawdbot.

## Overview

This skill enables automated job search and application workflows. It searches for jobs matching user criteria, analyzes compatibility, generates tailored cover letters, and submits applications automatically or with user confirmation.

**Supported Platforms:**
- LinkedIn (including Easy Apply)
- Indeed
- Glassdoor
- ZipRecruiter
- Wellfound (AngelList)

## Quick Start

### 1. Set Up User Profile

First, create a user profile using the template:

```bash
# Copy the profile template
cp profile_template.json ~/job_profile.json

# Edit with user's information
# Fill in: name, email, phone, resume path, skills, preferences
```

### 2. Run Job Search and Apply

```bash
# Basic usage - search and apply (dry run)
python job_search_apply.py \
  --title "Software Engineer" \
  --location "San Francisco, CA" \
  --remote \
  --max-applications 10 \
  --dry-run

# With profile file
python job_search_apply.py \
  --profile ~/job_profile.json \
  --title "Backend Engineer" \
  --platforms linkedin,indeed \
  --auto-apply

# Production mode (actual applications)
python job_search_apply.py \
  --profile ~/job_profile.json \
  --title "Senior Developer" \
  --no-dry-run \
  --require-confirmation
```

## Workflow Steps

### Step 1: Profile Configuration

Load the user's profile from the template or create programmatically:

```python
from job_search_apply import ApplicantProfile

profile = ApplicantProfile(
    full_name="Jane Doe",
    email="jane@example.com",
    phone="+1234567890",
    resume_path="~/Documents/resume.pdf",
    linkedin_url="https://linkedin.com/in/janedoe",
    years_experience=5,
    authorized_to_work=True,
    requires_sponsorship=False
)
```

### Step 2: Define Search Parameters

```python
from job_search_apply import JobSearchParams, JobPlatform

search_params = JobSearchParams(
    title="Software Engineer",
    location="
