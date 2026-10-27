---
layout: project
is_project: true
title: "Ataxx Agent"
description: Classical game-playing AI with bitboard wizardry — McGill COMP424 Final Project.
importance: 1
category: fun
github: https://github.com/ruixucs/ataxx-agent
related_publications: false
---

## What is Ataxx?

Ataxx is a two-player strategy board game played on a 7×7 grid. Each turn, you either **clone** (duplicate to an adjacent cell) or **jump** (leap two tiles, losing the original). When you land, all neighboring enemy pieces flip to your color — like Go meets checkers on steroids.

The goal? Have the most pieces when the board is full.

---

## Our Agent

Built for the **McGill COMP424 (Fall 2025) Final Project**, our agent is a pure-algorithm AI — no neural networks, no pretrained weights, just bit-level speed and classical game theory.

### Core Techniques

| Technique                   | What It Does                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Bitboard Representation** | Encodes the entire board state in 64-bit integers. Move generation becomes blazing-fast bitwise operations. |
| **Minimax Search**          | Explores the game tree by simulating all possible moves for both players, assuming optimal play.            |
| **Alpha-Beta Pruning**      | Cuts off branches that can't possibly affect the final decision — typically prunes 50%+ of the tree.        |
| **Iterative Deepening**     | Starts shallow, goes deeper as time allows. Two-phase search: quick ordering pass, then full-depth pass.    |
| **Precomputed Move Tables** | Lookup tables for all possible 1-step and 2-step moves — zero runtime computation for move generation.      |

### Performance

- **Time budget**: 2 seconds per move (agent uses ≤ 1.95s with safety buffer)
- **Search depth**: Adaptive, up to depth 20 depending on board complexity
- **Evaluation**: Material count heuristic (piece difference)

---

## Team

| Member            | Contact                                        |
| ----------------- | ---------------------------------------------- |
| **Rui Xu**        | [ruixucs.github.io](https://ruixucs.github.io) |
| **Wenbo Bi**      | wenbo.bi@mail.mcgill.ca                        |
| **Hancheng Song** | hancheng.song@mail.mcgill.ca                   |

> ⚠️ The public repo is a not-fully-optimized version — our competition submission stays under wraps.
