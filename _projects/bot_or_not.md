---
layout: project
is_project: true
title: "Bot or Not"
description: "Social media bot detector — 5th overall, 3rd in French at the Bot-or-Not Hackathon."
importance: 3
category: fun
github: https://github.com/ruixucs/Bot-or-Not
related_publications: false
---

## The Challenge

Given a dataset of social media users and their posts, figure out who's a bot and who's a human. Sounds easy? The scoring says otherwise:

| Outcome                       | Points |
| ----------------------------- | ------ |
| Correctly identified bot (TP) | **+4** |
| Missed a bot (FN)             | **-1** |
| Accused a human (FP)          | **-2** |

False accusations hurt. This isn't just accuracy — it's a game of precision under pressure.

**Result: 5th place overall, 3rd in French.**

---

## How We Catch Bots

### Feature Engineering — 147 Features

We extract signals from every angle:

| Layer | Feature Group       | Count | What It Captures                                     |
| ----- | ------------------- | ----- | ---------------------------------------------------- |
| 1     | User Profile        | ~15   | Username patterns, bio anomalies, location signals   |
| 1     | Posting Behavior    | ~20   | Frequency, intervals, hour entropy, burst detection  |
| 1     | Content             | ~20   | Vocabulary size, hashtag abuse, duplicate ratio      |
| 1     | Advanced Temporal   | ~20   | Time DNA, session patterns, second-level periodicity |
| 1     | Text Stylometry     | ~14   | N-gram repetition, Zipf deviation, compression ratio |
| 1     | Mention Network     | ~5    | Mention entropy, concentration, reciprocity          |
| 2     | Sentence Embeddings | ~5    | Semantic similarity via multilingual MiniLM          |
| 2     | Perplexity          | ~7    | GPT-2 (EN) / BLOOM-560m (FR) language model scores   |
| 2     | Topic Coherence     | ~8    | Topic diversity, switch rate, sequential coherence   |
| 2     | Sentiment           | ~9    | Polarity, volatility, extremity                      |
| 3     | Cross-user          | ~4    | Cross-user embedding similarity                      |
| 3     | HDBSCAN Clustering  | ~8    | Behavioral and temporal pattern clusters             |

### Model Architecture — Stacking Ensemble

```
                    ┌──────────┐
                    │ Features │
                    │  (147)   │
                    └────┬─────┘
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      ┌─────────┐  ┌──────────┐  ┌──────────┐
      │ XGBoost │  │ LightGBM │  │ CatBoost │
      └────┬────┘  └────┬─────┘  └────┬─────┘
           └─────────────┼─────────────┘
                         ▼
                 ┌───────────────┐
                 │   Logistic    │
                 │  Regression   │
                 │ (Meta-Learner)│
                 └───────┬───────┘
                         ▼
                  ┌─────────────┐
                  │  Threshold  │
                  │ Optimization│
                  └───────┬─────┘
                          ▼
                  ┌──────────────┐
                  │ Rule-Based   │
                  │ Post-Process │
                  └──────────────┘
```

- **Base models** use asymmetric loss functions (W_POS=5.0, W_NEG=2.0) that directly encode the competition's scoring
- **Hyperparameters** optimized via Optuna (200 trials, 3-fold CV)
- **Threshold** found by two-pass coarse-to-fine search on competition score

### Rule-Based Rescue

Even after the model, we scan for patterns it might miss:

| Rule                   | Catches                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| **Confused Persona**   | Accounts where 80%+ posts are questions with high streak patterns       |
| **Batch Posting**      | 4+ posts at the exact same second — humans don't do that                |
| **Engagement Farming** | High "like and retweet" solicitation frequency                          |
| **Hex Encoding Leaks** | LLM-generated text with encoding artifacts (e.g., `cine9ma` → `cinéma`) |
| **JSON Format Leaks**  | Pipeline artifacts where raw JSON wasn't unpacked                       |

---

## Multilingual Support

Separate pipelines for English and French datasets. French bots have different behavioral signatures — our system adapts thresholds and language models accordingly (GPT-2 for EN, BLOOM-560m for FR).

---

## Team

**Bot_killer_RX** — because someone had to kill the bots.
