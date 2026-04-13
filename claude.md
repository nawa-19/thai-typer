# Thai Typing Tutor

## Behavior rules
- Before writing any code, ask clarifying questions if anything is ambiguous
- Flag before doing anything that will use a large number of tokens (e.g. building
  the full app in one go) and wait for confirmation
- Build incrementally — propose a plan first, then wait for approval before executing
- Do not proceed with multi-step tasks autonomously

## What this is
A web app that teaches Thai typing using an English (QWERTY) keyboard.
The English-to-Thai key mapping follows the standard Thai Kedmanee layout.
Goal: build muscle memory through short, progressive daily sessions (max 10 min/day).
The user is already fluent in Thai — no English translations needed anywhere in the app.

## Architecture
- Node.js Express backend that proxies all Anthropic API calls
- API key lives only on the server in a .env file, never exposed to the frontend
- Frontend is a single index.html served by the Express server
- No user login needed — progress saved to localStorage on each visitor's browser

## Core features

### Typing interface
- User types on English keyboard; app maps keys to Thai characters in real time
- Display target Thai text above an input field
- Highlight correct characters green, wrong characters red, current position underlined
- No physical Thai keyboard needed — all mapping handled in JS

### Feedback
- Real-time per-character color feedback
- End of exercise: show accuracy % and time taken
- Wrong characters show the correct key hint
- Progress saved to localStorage between sessions

### Lesson progression
- Start with 4 high-frequency consonants per lesson
- Build from single characters → syllables → words → short phrases → sentences
- Each lesson introduces ~4 new characters max
- Session length: 3-5 min per sitting, max 10 min/day
- Unlock next lesson after 80%+ accuracy on current

### Spaced repetition (SM-2 algorithm)
- Track accuracy per character across all sessions
- Characters with lower accuracy surface more frequently
- Each character has an interval and ease factor
- After each session update intervals based on performance
- New characters start with short intervals; well-known ones appear less often

### AI-generated curriculum (Anthropic API)
- Frontend calls /api/generate endpoint on the Express server
- Server calls Anthropic API using the key stored in .env
- Returns words and phrases using ONLY the user's unlocked characters
- No English meanings anywhere — user is already fluent in Thai
- One API call per session start

## Lesson sequence

### Lessons 1-7 (character introduction)
| Lesson | New characters | Example words |
|--------|---------------|---------------|
| 1 | ก ด น ม | กด นก |
| 2 | า ส ว ร | กาว นาม สาร |
| 3 | ี ห ต ล | ดีล หมาก ตาล |
| 4 | ่ ้ ง อ | น้อง ของ งาน |
| 5 | เ ย ข ป | เงิน ขาย ปาก |
| 6 | ็ ุ ู ไ | ไม้ กุน |
| 7 | พ บ ช ท ค | พบ ชาย ทำได้ คนดี |

### Lessons 8+ (common chat phrases)
Focus shifts to real phrases used in everyday Thai texting:
- สวัสดี ขอบคุณ ไม่เป็นไร
- เป็นยังไงบ้าง กินข้าวหรือยัง
- โอเค ได้เลย ไม่ได้
- ไปด้วยกันไหม เจอกันที่ไหน
- แล้วเจอกัน ฝากบอกด้วยนะ บายๆ

## Key mapping
Implement the full standard Thai Kedmanee keyboard layout.
Reference: https://en.wikipedia.org/wiki/Thai_keyboard_layout (Kedmanee)

## Tech stack
- Node.js + Express backend
- Single index.html frontend served by Express
- Anthropic API called server-side only, key stored in .env
- localStorage for progress persistence on the client
- No other dependencies beyond express and @anthropic-ai/sdk

## Deployment
- Deploy to Vercel
- .env variables set in Vercel dashboard, never in code
- Final product is a public URL, no install needed for anyone visiting

## What NOT to do
- Never expose the API key to the frontend
- No English translations or romanization anywhere in the UI
- No audio
- Do not build the entire app in one response — propose structure first
