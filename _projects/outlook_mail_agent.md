---
layout: project
is_project: true
title: "Extension Is All You Need"
description: AI-powered Chrome extension that tames the chaos of your Outlook inbox.
importance: 2
category: fun
github: https://github.com/ruixucs/Extension-Is-All-You-Need
related_publications: false
---

## The Problem

We all drown in emails. Some are urgent, some are junk, and the important ones hide somewhere in between. Manual triage is soul-crushing.

## The Solution

**Extension Is All You Need** — a Chrome extension that brings AI directly into Outlook Web. It reads, analyzes, highlights, summarizes, and even drafts replies for you.

Yes, the name is a tribute to *that* paper.

---

## Features at a Glance

### Smart Highlighting

Emails light up the moment you open Outlook:

| Condition | Visual Cue |
|-----------|-----------|
| Worth reading (4–5 score) | Gold border + star icon |
| Urgent reply needed | Red pulsing border |
| Normal reply needed | Orange border |
| School-related & involving you | Blue background |
| Low priority (score 1) | Grayed out |

Every email also gets a badge: **Reply**, **Read**, or **Ad**.

### Multi-Provider AI

Pick your favorite brain:

- **OpenAI** / **ChatGPT (Codex)**
- **Google Gemini**
- **Anthropic Claude**
- **Custom API endpoint** (BYO model)

Each email is classified by **category** (School / Work / Personal / Promotions), **action type**, **worth-reading score** (1–5), **reply urgency**, **sentiment**, and **key dates**.

### AI Email Drafting

One click to generate a contextual reply or compose a new email from instructions. The draft auto-injects into Outlook's compose area.

### Inbox Brain

Your personal email memory. It identifies your most frequent contacts through bidirectional analysis (inbox + sent), then generates AI stories for each — key topics, conversation history, and relationship insights.

### Social Space

A **Game Boy-style** interactive world where your contacts appear as characters on a pixel map. Click on anyone to read their AI-generated story. It's email management meets retro gaming.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Popup / Options │     │   Service Worker      │     │  Content Script │
│  (popup.js,      │◄───►│  (service-worker.js)  │◄───►│  (content.js)   │
│   options.js)    │     │                       │     │                 │
└─────────────────┘     │  - GraphAPIClient     │     │  - Highlighting │
                        │  - CodexClient        │     │  - Reading pane │
┌─────────────────┐     │  - EmailAnalyzer      │     │  - AI Draft UI  │
│  Social Space    │◄───►│  - ContactAnalyzer    │     └─────────────────┘
│  (social.js)     │     │  - AISummaryService   │
└─────────────────┘     └──────────┬────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼               ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────────┐
            │chrome.storage│ │ MS Graph │ │  AI APIs     │
            └──────────────┘ └──────────┘ └──────────────┘
```

Built with **Manifest V3**, all data stored locally in `chrome.storage`. Your emails are only sent to the AI provider you choose — no third-party data sharing.

---

## Tech Stack

- **Browser Extension**: Chrome Manifest V3
- **Microsoft Integration**: Graph API (OAuth2 via Azure AD)
- **AI Layer**: Multi-provider abstraction (OpenAI, Gemini, Claude, Codex)
- **Frontend**: Vanilla JS, CSS3 animations, pixel-art sprite engine
