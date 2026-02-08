---
name: aws-solution-architect
description: Design AWS architectures for startups using serverless patterns and IaC templates.
homepage: https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/aws-solution-architect/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# aws-solution-architect

Design AWS architectures for startups using serverless patterns and IaC templates.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [aws-solution-architect](https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/aws-solution-architect/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AWS Solution Architect

Design scalable, cost-effective AWS architectures for startups with infrastructure-as-code templates.

---

## Table of Contents

- [Trigger Terms](#trigger-terms)
- [Workflow](#workflow)
- [Tools](#tools)
- [Quick Start](#quick-start)
- [Input Requirements](#input-requirements)
- [Output Formats](#output-formats)

---

## Trigger Terms

Use this skill when you encounter:

| Category | Terms |
|----------|-------|
| **Architecture Design** | serverless architecture, AWS architecture, cloud design, microservices, three-tier |
| **IaC Generation** | CloudFormation, CDK, Terraform, infrastructure as code, deploy template |
| **Serverless** | Lambda, API Gateway, DynamoDB, Step Functions, EventBridge, AppSync |
| **Containers** | ECS, Fargate, EKS, container orchestration, Docker on AWS |
| **Cost Optimization** | reduce AWS costs, optimize spending, right-sizing, Savings Plans |
| **Database** | Aurora, RDS, DynamoDB design, database migration, data modeling |
| **Security** | IAM policies, VPC design, encryption, Cognito, WAF |
| **CI/CD** | CodePipeline, CodeBuild, CodeDeploy, GitHub Actions AWS |
| **Monitoring** | CloudWatch, X-Ray, observability, alarms, dashboards |
| **Migration** | migrate to AWS, lift and shift, replatform, DMS |

---

## Workflow

### Step 1: Gather Requirements

Collect application specifications:

```
- Application type (web app, mobile backend, data pipeline, SaaS)
- Expected users and requests per second
- Budget constraints (monthly spend limit)
- Team size and AWS experience level
- Compliance requirements (GDPR, HIPAA, SOC 2)
- Availability requirements (SLA, RPO/RTO)
```

### Step 2: Design Architecture

Run the architecture designer to get pattern recommendations:

```bash
python scripts/architecture_designer.py --input requirements.json
```

Select from recommended patterns:
- **Serverless Web**: S3 + CloudFront + API Gateway + Lambda + DynamoDB
- **Event-Driven Microservices**: EventBridge + Lambda + SQS +
