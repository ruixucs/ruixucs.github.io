---
layout: page
is_project: true
title: Real-World to Stylized Video Generation
description: Built a comprehensive pipeline and trained a multimodal large model that transforms real-world videos into stylized videos with various artistic styles. Developed high-quality custom datasets and achieved superior model performance across 15+ distinct visual styles.
img: assets/img/style_example.png
importance: 1
category: work
related_publications: false
---

## Project Overview

During my AI Research Internship at Peking University, I built a complete pipeline and trained a multimodal large model capable of transforming real-world videos into stylized videos with diverse artistic effects. This project combines computer vision, generative AI, and video synthesis to create high-quality artistic video content.

## Technical Pipeline

<div class="row mt-3">
    <div class="col-12">
        {% include figure.liquid loading="eager" path="assets/img/style_flow.png" title="Pipeline Architecture" class="img-fluid rounded z-depth-1" %}
        <div class="caption text-center">
            Complete pipeline for video-to-stylized-video generation: frame extraction → image stylization → video generation.
        </div>
    </div>
</div>

The pipeline consists of four main stages:
1. **Frame Extraction**: Extract keyframes from the source video
2. **Caption Extraction**: Generate descriptive captions from the source video content
3. **Image Stylization**: Transform keyframes into target artistic styles (e.g., Ghibli, Cyberpunk, Anime)
4. **Video Generation**: Synthesize stylized video sequences from stylized images and captions

## Style Examples

<div class="row mt-3">
    <div class="col-12">
        {% include figure.liquid loading="eager" path="assets/img/style_example.png" title="Style Examples" class="img-fluid rounded z-depth-1" %}
        <div class="caption text-center">
            Demonstration of 15+ artistic styles: Original → Cyberpunk → Sketch → Pixel Art → Minecraft → 3D Animation → Anime → LEGO and more.
        </div>
    </div>
</div>

## Key Achievements

### 🎨 Multimodal Pipeline Development
- Built a comprehensive end-to-end pipeline for video-to-video style transfer
- Integrated frame extraction, caption generation, and video synthesis
- Developed robust data processing workflows for multimodal inputs

### 🎬 Advanced Video Generation Model
- Trained a multimodal large model capable of generating high-quality stylized videos
- Achieved seamless transformation from real-world videos to artistic videos
- Implemented 15+ distinct artistic styles with consistent quality across all variations

### 📊 High-Quality Dataset Creation
- Curated and developed custom high-quality datasets for training
- Ensured superior model performance through carefully selected training data
- Prepared datasets for future open-source release to benefit the research community

## Supported Artistic Styles

| Style Category | Examples |
|---------------|----------|
| **Digital Art** | Cyberpunk/Neon, Pixel Art, Vaporwave |
| **Traditional Art** | Sketch/Pencil, Oil Painting, Watercolor |
| **3D/Animation** | Pixar/Disney 3D, Japanese Anime, Ghibli |
| **Creative** | LEGO, Minecraft, Low-poly |

## Technical Innovation

### 🎯 Style Transfer Excellence
- Developed 15+ distinct artistic styles with consistent high quality
- Implemented advanced neural style transfer techniques for video generation
- Achieved smooth temporal consistency across video frames

### 🔄 Pipeline Optimization
- Built efficient preprocessing pipelines for video inputs
- Optimized inference speed for style transfer applications
- Integrated multiple model components into a seamless workflow

### 📈 Model Performance
- Achieved superior visual quality through custom dataset curation
- Maintained temporal coherence in generated video sequences
- Optimized model architecture for both quality and efficiency

