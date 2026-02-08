---
name: healthcheck
description: Track water and sleep with JSON file storage
homepage: https://github.com/openclaw/skills/tree/main/skills/stellarhold170nt/healthcheck/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# healthcheck

Track water and sleep with JSON file storage

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [healthcheck](https://github.com/openclaw/skills/tree/main/skills/stellarhold170nt/healthcheck/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Health Tracker

Simple tracking for water intake and sleep using JSON file.

## Data Format

File: `{baseDir}/health-data.json`

```json
{
  "water": [{"time": "ISO8601", "cups": 2}],
  "sleep": [{"time": "ISO8601", "action": "sleep|wake"}]
}
```

## Add Water Record

When user says "uống X cốc" or "uống nước X cốc":

```bash
node -e "const fs=require('fs');const f='{baseDir}/health-data.json';let d={water:[],sleep:[]};try{d=JSON.parse(fs.readFileSync(f))}catch(e){}d.water.push({time:new Date().toISOString(),cups:CUPS});fs.writeFileSync(f,JSON.stringify(d));console.log('Da ghi: '+CUPS+' coc')"
```

Replace `CUPS` with number from user input.

## Add Sleep Record

When user says "đi ngủ":

```bash
node -e "const fs=require('fs');const f='{baseDir}/health-data.json';let d={water:[],sleep:[]};try{d=JSON.parse(fs.readFileSync(f))}catch(e){}d.sleep.push({time:new Date().toISOString(),action:'sleep'});fs.writeFileSync(f,JSON.stringify(d));console.log('Da ghi: di ngu')"
```

## Add Wake Record

When user says "thức dậy" or "dậy rồi":

```bash
node -e "const fs=require('fs');const f='{baseDir}/health-data.json';let d={water:[],sleep:[]};try{d=JSON.parse(fs.readFileSync(f))}catch(e){}const last=d.sleep.filter(s=>s.action==='sleep').pop();d.sleep.push({time:new Date().toISOString(),action:'wake'});fs.writeFileSync(f,JSON.stringify(d));if(last){const h=((new Date()-new Date(last.time))/3600000).toFixed(1);console.log('Da ngu: '+h+' gio')}else{console.log('Da ghi: thuc day')}"
```

## View Stats

When user says "thống kê" or "xem thống kê":

```bash
node -e "const fs=require('fs');const f='{baseDir}/health-data.json';let d={water:[],sleep:[]};try{d=JSON.parse(fs.readFileSync(f))}catch(e){}console.log('Water:',d.water.length,'records');console.log('Sleep:',d.sleep.length,'records');const today=d.water.filter(w=>new Date(w.time).toDateString()===new Date().toDateString());console.log('Today:',today.reduce((s,w)=>s+w.cups,0),'cups')"
```

## Update Record

To update last water e
