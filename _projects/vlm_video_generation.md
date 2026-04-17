---
layout: page
is_project: true
title: Stylized Image-to-Video Dataset (600K / 12 Styles)
description: Built the 600K-image multi-style dataset powering UniWorld-OSP2.0 — 12 artistic styles, automated keyframe-to-video pipeline, quality gates for subject identity and motion coherence.
img: assets/img/style_example.png
importance: 1
category: work
related_publications: false
---

## Overview

During my AI Research Internship at **Peking University**, I led the **stylized-video data effort** behind [**UniWorld-OSP2.0**](https://github.com/PKU-YuanGroup/UniWorld) — the lab's next-generation Image-to-Video (I2V) framework. Training a unified Image-to-Stylized-Video (I2SV) model needs paired data at scale: real-world clips to supervise motion, plus the **same content re-rendered in each target style** to supervise stylization without distorting subject or dynamics. Off-the-shelf datasets do not exist at this coverage, so I designed and built one end-to-end.

**My contribution.** End-to-end ownership of the stylized dataset:

- **~600,000 styled images** across **12 artistic styles**, built from curated source video.
- A four-stage automated pipeline (**curate → keyframe → stylize → animate**) with quality gates between each stage.
- A long-tail composition strategy — two anchor styles at scale plus ten diverse styles — that stabilized downstream I2SV training across domains.

---

## 🎯 Dataset Highlights

### Scale & Coverage

- **~600K styled images** across **12 styles** spanning animation, traditional painting, digital, and thematic aesthetics.
- Every image paired with a **source clip and a stylized keyframe** so the downstream model can jointly supervise motion and style.
- Balanced long tail: two anchor styles carry depth; ten diverse styles carry breadth.

### Automated, Repeatable Pipeline

- Curation → keyframe → stylize → animate, each stage a standalone step that can be re-run on new sources without re-processing earlier ones.
- Per-stage **quality gates** (resolution, subject clarity, motion, stylization fidelity) so that downstream training never sees silently broken samples.
- Designed so adding a **new style** costs only a style-specific stylization pass, not a full rebuild.

### Style-Aware Balance

- **Ghibli** and **3D Rendering** as anchor distributions (~200K each) — enough depth to fully condition on the style.
- Ten remaining styles (~20K each) cover the rest, preventing the model from collapsing onto the anchors.

---

## 🛠️ How the Dataset Is Built

<div class="row mt-3">
  <div class="col-12">
    {% include figure.liquid loading="eager" path="assets/img/style_flow.png" title="Stylized Dataset Pipeline" class="img-fluid rounded z-depth-1" %}
    <div class="caption text-center">
      Four-stage pipeline: curated source clips → middle-frame keyframes → style transfer → image-to-video animation, with quality gates between each stage.
    </div>
  </div>
</div>

| Stage                  | What happens                                                                                                     | Quality gate                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **1. Source curation** | Collect short clips (5–20 s, ≥720 p) with clear subjects and meaningful motion.                                  | Resolution, shot length, subject clarity, motion score |
| **2. Keyframe**        | Extract the middle frame as the representative content anchor for the clip.                                      | Blur / exposure / composition check                    |
| **3. Stylization**     | [Step1X-Edit](https://github.com/stepfun-ai/Step1X-Edit) re-renders the keyframe into the target artistic style. | Subject preservation, style fidelity                   |
| **4. Animation**       | [Wan2.1-I2V-14B](https://github.com/Wan-Video/Wan2.1) animates the stylized keyframe back into video.            | Temporal coherence, motion sanity                      |

The dataset is the (source clip, stylized keyframe, stylized video) triple — enough to teach an I2V model to stylize an input image while keeping the real-video motion distribution.

---

## 🎨 Style Coverage (12 Styles)

<div class="row mt-3">
  <div class="col-12">
    {% include figure.liquid loading="eager" path="assets/img/style_example.png" title="Style Gallery" class="img-fluid rounded z-depth-1" %}
    <div class="caption text-center">
      One frame per style from the 12-style gallery.
    </div>
  </div>
</div>

| Category        | Styles                                   | Per-style size |
| --------------- | ---------------------------------------- | -------------- |
| **Animation**   | Ghibli, Disney, Chibi, Fairy Tale        | ~200K / ~20K   |
| **Traditional** | Oil Painting, Ink Painting               | ~20K           |
| **Digital**     | 3D Rendering, Pixel Art, Lego, Vaporwave | ~200K / ~20K   |
| **Thematic**    | Cyberpunk, Gotham Noir                   | ~20K           |

**Anchors**: Ghibli and 3D Rendering, ~200K each. **Long tail**: 10 styles at ~20K each. **Total**: ~600K styled images.

---

## 📦 Where the Dataset Plugs In

The dataset is the supervision backbone for UniWorld-OSP2.0's unified **Image-to-Stylized-Video (I2SV)** training:

- A single input image → a video rendered in any of the 12 styles, with subject identity and motion coherence preserved.
- The dataset's per-style balance is what lets one model generalize across styles instead of fragmenting into 12 specialists.
- Training pipeline, model architecture, and results are described in the [UniWorld-OSP2.0 release](https://github.com/PKU-YuanGroup/UniWorld).
