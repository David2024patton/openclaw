---
name: chirp
description: X/Twitter CLI using OpenClaw browser tool.
homepage: https://github.com/openclaw/skills/tree/main/skills/zizi-cat/chirp/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# chirp

X/Twitter CLI using OpenClaw browser tool.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [chirp](https://github.com/openclaw/skills/tree/main/skills/zizi-cat/chirp/SKILL.md)
- **Security Status**: SAFE

## Instructions

# chirp

OpenClaw browser 도구로 X/Twitter 조작하기. bird CLI의 browser 기반 대안.

## Prerequisites

### 환경 요구사항
- OpenClaw with browser tool enabled
- `openclaw` browser profile
- X/Twitter 계정 로그인 완료

### Headless 서버인 경우

Xvfb 가상 디스플레이 필요 (spool 스킬의 Prerequisites 참고)

### 로그인 (처음 한 번만)

```
browser action=start profile=openclaw
browser action=open profile=openclaw targetUrl="https://x.com/login"
# 사용자에게 수동 로그인 요청
```

---

## 사용법

### 1. 타임라인 읽기

```
browser action=open profile=openclaw targetUrl="https://x.com/home"
browser action=snapshot profile=openclaw compact=true
```

각 article에서 작성자, 내용, 좋아요/리트윗/답글 수 확인 가능.

### 2. 트윗 작성

**Step 1: 홈에서 텍스트박스 찾기**
```
browser action=open profile=openclaw targetUrl="https://x.com/home"
browser action=snapshot profile=openclaw compact=true
```
→ `textbox "Post text"` ref 찾기

**Step 2: 내용 입력**
```
browser action=act profile=openclaw request={"kind":"click","ref":"<textbox-ref>"}
browser action=act profile=openclaw request={"kind":"type","ref":"<textbox-ref>","text":"트윗 내용"}
```

**Step 3: Post 버튼 클릭**
```
browser action=snapshot profile=openclaw compact=true
```
→ `button "Post"` ref 찾기 (disabled 아닌 것)
```
browser action=act profile=openclaw request={"kind":"click","ref":"<post-ref>"}
```

### 3. 좋아요 누르기

타임라인에서 article 내 `button "Like"` 또는 `button "X Likes. Like"` ref 찾아서:
```
browser action=act profile=openclaw request={"kind":"click","ref":"<like-ref>"}
```

### 4. 리트윗

`button "Repost"` 또는 `button "X reposts. Repost"` ref 찾아서:
```
browser action=act profile=openclaw request={"kind":"click","ref":"<repost-ref>"}
browser action=snapshot profile=openclaw compact=true
# "Repost" 옵션 선택
browser action=act profile=openclaw request={"kind":"click","ref":"<repost-option-ref>"}
```

### 5. 답글 달기

**방법 1: 타임라인에서**
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-button-ref>"}
browser action=snapshot profile=openclaw compact=true
# 답글 입력창에 텍스트 입력 후 Reply 버튼 클릭
```

**방법 2: 트윗 페이지에서**
```
browser action=open profile=op
