---
name: azure-cli
description: Comprehensive Azure Cloud Platform management via command-line interface.
homepage: https://github.com/openclaw/skills/tree/main/skills/ddevaal/azure-cli/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# Azure CLI

Comprehensive Azure Cloud Platform management via command-line interface.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [Azure CLI](https://github.com/openclaw/skills/tree/main/skills/ddevaal/azure-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Azure CLI Skill

**Master the Azure command-line interface for cloud infrastructure management, automation, and DevOps workflows.**

Azure CLI is Microsoft's powerful cross-platform command-line tool for managing Azure resources. This skill provides comprehensive knowledge of Azure CLI commands, authentication, resource management, and automation patterns.

## What You'll Learn

### Core Concepts
- Azure subscription and resource group architecture
- Authentication methods and credential management
- Resource Provider organization and registration
- Global parameters, output formatting, and query syntax
- Automation scripting and error handling

### Major Service Areas (66 command modules)
- **Compute:** Virtual Machines, Scale Sets, Kubernetes (AKS), Containers
- **Networking:** Virtual Networks, Load Balancers, CDN, Traffic Manager
- **Storage & Data:** Storage Accounts, Data Lake, Cosmos DB, Databases
- **Application Services:** App Service, Functions, Container Apps
- **Databases:** SQL Server, MySQL, PostgreSQL, CosmosDB
- **Integration & Messaging:** Event Hubs, Service Bus, Logic Apps
- **Monitoring & Management:** Azure Monitor, Policy, RBAC, Cost Management
- **AI & Machine Learning:** Cognitive Services, Machine Learning
- **DevOps:** Azure DevOps, Pipelines, Extensions

## Quick Start

### Installation

**macOS:**
```bash
brew install azure-cli
```

**Linux (Ubuntu/Debian):**
```bash
curl -sL https://aka.ms/InstallAzureCliLinux | bash
```

**Windows:**
```powershell
choco install azure-cli
# Or download MSI from https://aka.ms/InstallAzureCliWindowsMSI
```

**Verify Installation:**
```bash
az --version          # Show version
az --help             # Show general help
```

### First Steps

```bash
# 1. Login to Azure (opens browser for authentication)
az login

# 2. View your subscriptions
az account list

# 3. Set default subscription (optional)
az account set --subscription "My Subscription"

# 4. Create a resource group
az group create -g myResourceGr
