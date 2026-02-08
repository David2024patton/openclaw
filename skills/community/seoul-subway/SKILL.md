---
name: seoul-subway
description: Seoul Subway assistant for real-time arrivals, route planning, and service alerts (Korean/English)
homepage: https://github.com/openclaw/skills/tree/main/skills/dukbong/seoul-subway/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# seoul-subway

Seoul Subway assistant for real-time arrivals, route planning, and service alerts (Korean/English)

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [seoul-subway](https://github.com/openclaw/skills/tree/main/skills/dukbong/seoul-subway/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Seoul Subway Skill

Query real-time Seoul Subway information. **No API key required** - uses proxy server.

## Features

| Feature | Description | Trigger Example (KO) | Trigger Example (EN) |
|---------|-------------|----------------------|----------------------|
| Real-time Arrival | Train arrival times by station | "강남역 도착정보" | "Gangnam station arrivals" |
| Station Search | Line and station code lookup | "강남역 몇호선?" | "What line is Gangnam?" |
| Route Search | Shortest path with time/fare | "신도림에서 서울역" | "Sindorim to Seoul Station" |
| Service Alerts | Delays, incidents, non-stops | "지하철 지연 있어?" | "Any subway delays?" |
| **Last Train** | Last train times by station | "홍대 막차 몇 시야?" | "Last train to Hongdae?" |
| **Exit Info** | Exit numbers for landmarks | "코엑스 몇 번 출구?" | "Which exit for COEX?" |
| **Accessibility** | Elevators, escalators, wheelchair lifts | "강남역 엘리베이터" | "Gangnam elevators" |
| **Quick Exit** | Best car for facilities | "강남역 빠른하차" | "Gangnam quick exit" |
| **Restrooms** | Restroom locations | "강남역 화장실" | "Gangnam restrooms" |

### Natural Language Triggers / 자연어 트리거

다양한 자연어 표현을 인식합니다:

#### Real-time Arrival / 실시간 도착
| English | 한국어 |
|---------|--------|
| "When's the next train at Gangnam?" | "강남 몇 분 남았어?" |
| "Trains at Gangnam" | "강남 열차" |
| "Gangnam arrivals" | "강남 언제 와?" |
| "Next train to Gangnam" | "다음 열차 강남" |

#### Route Search / 경로 검색
| English | 한국어 |
|---------|--------|
| "How do I get to Seoul Station from Gangnam?" | "강남에서 서울역 어떻게 가?" |
| "Gangnam → Seoul Station" | "강남 → 서울역" |
| "Gangnam to Seoul Station" | "강남에서 서울역 가는 길" |
| "Route from Gangnam to Hongdae" | "강남부터 홍대까지" |

#### Service Alerts / 운행 알림
| English | 한국어 |
|---------|--------|
| "Is Line 2 running normally?" | "2호선 정상 운행해?" |
| "Any delays on Line 1?" | "1호선 지연 있어?" |
| "Subway status" | "지하철 상황" |
| "Line 3 alerts" | "3호선 알림" |

#### Last Train / 막차 시간
| English | 한국어 |
|---------|--------|
| "Last train to Gangnam?" | "강남 막차 몇 시야?" |
| "When is the last tra
