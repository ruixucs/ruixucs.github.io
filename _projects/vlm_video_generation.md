---
layout: page
is_project: true
title: VLM-Enhanced Stylized Video Generation
description: Contributed to UniWorld-OSP2.0 — a 14B+ Image-to-Video framework built on the Fourier-Guided Latent Shifting (FlashI2V) paradigm. Integrated a frozen 7B Qwen2.5-VL for lossless semantic conditioning and built a 600K-image stylized dataset covering 12 artistic styles.
img: assets/img/style_example.png
importance: 1
category: work
related_publications: false
---

## Overview

During my AI Research Internship at **Peking University**, I contributed to [**UniWorld-OSP2.0**](https://github.com/PKU-YuanGroup/UniWorld) — a unified conditional video generation framework built on the **Fourier-Guided Latent Shifting (FlashI2V)** paradigm. Compared with conventional I2V/T2V systems that concatenate the conditioning image into the noise, FlashI2V injects it as a **latent offset**, which prevents conditional image leakage and restores natural motion dynamics.

My two deliverables on this project:

1. **VLM-enhanced semantic conditioning** — plugged a frozen 7B Qwen2.5-VL into the I2V pipeline as a drop-in replacement for shallow text encoders, inheriting rich scene understanding without any retraining.
2. **600K-image stylized dataset (12 styles)** — the data backbone that turned I2V into unified Image-to-Stylized-Video (I2SV).

---

## 🎯 Highlights

### FlashI2V — Stabilized Motion

- **Latent Shifting**: injects the conditioning image as an additive offset in latent space rather than noisy concatenation → no conditional image leakage.
- **Fourier Guidance**: high-frequency residual path recovers sharp edges and textures that the base denoiser would otherwise wash out.
- **Outcome**: continuous motion with preserved structure, no muted dynamics or color drift.

### VLM-Enhanced Semantic Conditioning

- Integrates a **frozen 7B Qwen2.5-VL** in place of a shallow text encoder.
- **Lossless semantic inheritance** — scene, subject, and spatial relations are grounded by a real VLM, not a 77-token CLIP projection.
- Zero added training cost: the VLM stays frozen; only the umT5 control branch is trainable.

### Unified Image-to-Stylized-Video (I2SV)

- A single input image → a video rendered in any of **12 artistic styles**.
- Style is conditioned end-to-end, so subject identity and motion coherence survive the transfer.

---

## 🧱 Architecture

<div class="row mt-3">
  <div class="col-12">
    {% include figure.liquid loading="eager" path="assets/img/style_flow.png" title="UniWorld-OSP2.0 Architecture" class="img-fluid rounded z-depth-1" %}
    <div class="caption text-center">
      Frozen Qwen2.5-VL (semantics) + trainable umT5 (control) + frozen CLIP (visual) → DiT backbone with Cross-Attention and AdaLN modulation, denoising in the latent space of a Causal VAE.
    </div>
  </div>
</div>

| Component              | Role                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Causal VAE**         | Pixel ↔ latent mapping with 4× temporal / 8× spatial downsampling; keeps the transformer tractable.        |
| **Multimodal Encoder** | Three branches — **frozen Qwen2.5-VL** (semantics), **trainable umT5** (control), **frozen CLIP** (visual). |
| **DiT Denoiser**       | Diffusion Transformer with Cross-Attention to the encoder stack and AdaLN modulation on the timestep.       |

---

## 🎨 Stylized Dataset — 600K Images, 12 Styles

<div class="row mt-3">
  <div class="col-12">
    {% include figure.liquid loading="eager" path="assets/img/style_example.png" title="Stylized Video Examples" class="img-fluid rounded z-depth-1" %}
    <div class="caption text-center">
      One frame per style from the 12-style gallery.
    </div>
  </div>
</div>

### Pipeline

1. **Source curation** — short clips (5–20 s, ≥720 p) filtered for subject clarity and motion.
2. **Keyframe extraction** — middle-frame strategy for representative content.
3. **Stylization** — [Step1X-Edit](https://github.com/stepfun-ai/Step1X-Edit) renders each keyframe in the target style.
4. **Animation** — [Wan2.1-I2V-14B](https://github.com/Wan-Video/Wan2.1) animates the stylized frame while the training pipeline supervises on the (real-video, stylized-frame) pair.

### Style Coverage

| Category        | Styles                                   |
| --------------- | ---------------------------------------- |
| **Animation**   | Ghibli, Disney, Chibi, Fairy Tale        |
| **Traditional** | Oil Painting, Ink Painting               |
| **Digital**     | 3D Rendering, Pixel Art, Lego, Vaporwave |
| **Thematic**    | Cyberpunk, Gotham Noir                   |

**Scale**: ~600,000 styled images — Ghibli and 3D Rendering dominate (~200K each); the remaining 10 styles carry ~20K each to anchor the long tail.

---

## 📊 Outcomes

- **Anti-leakage I2V** — the FlashI2V objective removes the shortcut on which prior inpainting/concatenation baselines rely.
- **VLM conditioning pays off out-of-domain** — stylized prompts with heavy semantic load (multi-subject scenes, unusual compositions) are preserved through the full pipeline.
- **Unified I2SV works at scale** — one model, one input image, 12 stylization targets, consistent subject and motion.

> Full technical report and model weights: see the [UniWorld-OSP2.0 release](https://github.com/PKU-YuanGroup/UniWorld).
