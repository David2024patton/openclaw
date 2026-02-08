---
name: spool
description: Threads CLI - Read, post, reply, and search on Meta's Threads using OpenClaw browser tool.
homepage: https://github.com/openclaw/skills/tree/main/skills/zizi-cat/spool/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# spool

Threads CLI - Read, post, reply, and search on Meta's Threads using OpenClaw browser tool.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [spool](https://github.com/openclaw/skills/tree/main/skills/zizi-cat/spool/SKILL.md)
- **Security Status**: SAFE

## Instructions

# spool

OpenClaw browser 도구로 Threads (threads.net) 조작하기.

## Prerequisites

### 환경 요구사항
- OpenClaw with browser tool enabled
- `openclaw` browser profile
- Threads 계정 로그인 완료

### Headless 서버인 경우 (GUI 없음)

Xvfb 가상 디스플레이 필요:

```bash
# 1. Xvfb 설치 및 서비스 등록
sudo apt install -y xvfb
sudo tee /etc/systemd/system/xvfb.service << 'EOF'
[Unit]
Description=X Virtual Frame Buffer
After=network.target
[Service]
Type=simple
ExecStart=/usr/bin/Xvfb :99 -screen 0 1920x1080x24
Restart=always
[Install]
WantedBy=multi-user.target
EOF
sudo systemctl enable --now xvfb

# 2. OpenClaw Gateway에 DISPLAY 환경변수 추가
mkdir -p ~/.config/systemd/user/openclaw-gateway.service.d
echo -e '[Service]\nEnvironment=DISPLAY=:99' > ~/.config/systemd/user/openclaw-gateway.service.d/display.conf
systemctl --user daemon-reload
systemctl --user restart openclaw-gateway
```

### 로그인 (처음 한 번만)

```
browser action=start profile=openclaw
browser action=open profile=openclaw targetUrl="https://www.threads.net/login"
# 사용자에게 수동 로그인 요청
```

---

## 사용법

### 1. 타임라인 읽기

```
browser action=open profile=openclaw targetUrl="https://www.threads.net"
browser action=snapshot profile=openclaw compact=true
```

결과에서 각 게시물의 작성자, 내용, 좋아요/댓글 수 확인 가능.

### 2. 포스팅 (전체 플로우)

**Step 1: 홈으로 이동**
```
browser action=open profile=openclaw targetUrl="https://www.threads.net"
browser action=snapshot profile=openclaw compact=true
```

**Step 2: "What's new?" 버튼 찾아서 클릭**
snapshot에서 `"What's new?"` 또는 `"Empty text field"` 포함된 button의 ref 찾기
```
browser action=act profile=openclaw request={"kind":"click","ref":"e14"}
```
(ref는 snapshot마다 다름! 반드시 snapshot에서 확인)

**Step 3: 다이얼로그에서 텍스트 입력**
```
browser action=snapshot profile=openclaw compact=true
```
`textbox` ref 찾아서:
```
browser action=act profile=openclaw request={"kind":"type","ref":"e14","text":"포스팅 내용"}
```

**Step 4: Post 버튼 클릭**
```
browser action=act profile=openclaw request={"kind":"click","ref":"e22"}
```
(Post 버튼 ref도 snapshot에서 확인)

**Step 5: 확인**
```
browser action=snapshot profi
