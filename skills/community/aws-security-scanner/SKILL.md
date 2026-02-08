---
name: aws-security-scanner
description: Scan AWS accounts for security misconfigurations and vulnerabilities.
homepage: https://github.com/openclaw/skills/tree/main/skills/spclaudehome/aws-security-scanner/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# aws-security-scanner

Scan AWS accounts for security misconfigurations and vulnerabilities.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [aws-security-scanner](https://github.com/openclaw/skills/tree/main/skills/spclaudehome/aws-security-scanner/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AWS Security Scanner

Audit AWS infrastructure for security issues using AWS CLI.

## Prerequisites

- AWS CLI configured (`aws configure` or IAM role)
- Read permissions for resources being scanned

## Quick Scans

### S3 Bucket Security
```bash
# Find public buckets
aws s3api list-buckets --query 'Buckets[].Name' --output text | tr '\t' '\n' | while read bucket; do
  acl=$(aws s3api get-bucket-acl --bucket "$bucket" 2>/dev/null)
  policy=$(aws s3api get-bucket-policy --bucket "$bucket" 2>/dev/null)
  public_access=$(aws s3api get-public-access-block --bucket "$bucket" 2>/dev/null)
  echo "=== $bucket ==="
  echo "$acl" | grep -q "AllUsers\|AuthenticatedUsers" && echo "⚠️ PUBLIC ACL"
  echo "$policy" | grep -q '"Principal":"\*"' && echo "⚠️ PUBLIC POLICY"
  echo "$public_access" | grep -q "false" && echo "⚠️ Public access not fully blocked"
done
```

### IAM Security Issues
```bash
# Users without MFA
aws iam generate-credential-report && sleep 5
aws iam get-credential-report --query 'Content' --output text | base64 -d | grep -E "^[^,]+,.*,false" | cut -d',' -f1

# Overly permissive policies (Admin access)
aws iam list-policies --scope Local --query 'Policies[].Arn' --output text | tr '\t' '\n' | while read arn; do
  version=$(aws iam get-policy --policy-arn "$arn" --query 'Policy.DefaultVersionId' --output text)
  aws iam get-policy-version --policy-arn "$arn" --version-id "$version" --query 'PolicyVersion.Document' | grep -q '"Action":"\*".*"Resource":"\*"' && echo "⚠️ Admin policy: $arn"
done

# Access keys older than 90 days
aws iam list-users --query 'Users[].UserName' --output text | tr '\t' '\n' | while read user; do
  aws iam list-access-keys --user-name "$user" --query "AccessKeyMetadata[?CreateDate<='$(date -d '-90 days' +%Y-%m-%d)'].{User:UserName,KeyId:AccessKeyId,Created:CreateDate}" --output table
done
```

### Security Groups
```bash
# Open to world (0.0.0.0/0)
aws ec2 describe-security-groups --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrI
