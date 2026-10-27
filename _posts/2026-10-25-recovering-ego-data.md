---
layout: blog_post
title: "Recovering Usable Keyframes from Egocentric Video"
date: 2026-10-25 00:00:00 -0400
description: "Using reference-guided image editing to clarify action outcomes, constrain changes, and catch failures in egocentric video data."
tags: egocentric-video image-editing robotics data
categories: research-notes
lang: en
published: true
thumbnail: assets/img/ego-recovery/unstack-last-frame-light-poster.jpg
related_posts: false
disqus_comments: false
giscus_comments: false
_styles: |
  .ego-video { margin: 1.8rem 0; }
  .ego-video video { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; background: #f3f7fb; border: 1px solid #d5dee8; border-radius: 12px; }
  .ego-caption { margin: .75rem 0 0; font-size: .9rem; line-height: 1.75; color: var(--global-text-color-light, #566575); }
  .ego-flow { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .6rem; padding: 1.2rem; margin: 1.5rem 0; border: 1px solid #d5dee8; border-radius: 12px; background: #f3f7fb; color: #14293d; }
  .ego-flow span { padding: .45rem .65rem; background: #fff; border: 1px solid #d5dee8; border-radius: 7px; }
  .ego-flow b { color: #007f85; }
  .ego-supplement { margin: 1.5rem 0; padding: 1rem 1.1rem; border: 1px solid var(--global-divider-color, #d5dee8); border-radius: 10px; }
  .ego-supplement > summary { cursor: pointer; font-weight: 600; line-height: 1.6; }
  .ego-supplement > p { margin-top: 1rem; }
  .ego-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 1rem 0; }
  .ego-gallery.ego-pair { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ego-gallery figure { margin: 0; min-width: 0; }
  .ego-gallery img { display: block; width: 100%; height: auto; border-radius: 6px; border: 1px solid #d5dee8; }
  .ego-gallery a:focus-visible { outline: 3px solid #007f85; outline-offset: 3px; }
  .ego-gallery figcaption { margin-top: .4rem; font-size: .85rem; text-align: center; line-height: 1.5; }
  .ego-example { margin: 1.5rem 0 2rem; }
  .ego-example .ego-caption { text-align: left; }
  .ego-supplement[open] > summary { margin-bottom: 1rem; }
  #markdown-content { line-height: 1.85; }
  .ego-downloads { margin: 1.3rem 0; line-height: 1.9; }
  @media (max-width: 600px) {
    .ego-gallery, .ego-gallery.ego-pair { grid-template-columns: 1fr; }
    .ego-supplement { padding: .85rem; }
    .ego-flow { justify-content: flex-start; font-size: .9rem; }
  }
---

**A video can capture an action without leaving a clear frame of its outcome.**

I kept running into this while working with egocentric videos of human manipulation. Hands move quickly, cameras sample at a limited frame rate, and the frames around an action boundary may be blurred, occluded, or already include the next action. For some tasks, such as learning whether an object is held, on a table, or stacked on another object, this makes it difficult to obtain useful before-and-after image pairs.

Could we use the footage we already have, together with a few clear reference examples, to construct more readable outcome frames and reduce the need to record everything again? Consider this clip: a hand removes a white block from a green block, then places it on the table. **Which is the last frame of Unstack?**

<figure class="ego-video">
  <video controls playsinline preload="metadata" poster="{{ '/assets/img/ego-recovery/unstack-last-frame-light-poster.jpg' | relative_url }}" aria-label="Unstack frame-selection demo: original speed, quarter-speed replay, and four candidate frames with state labels">
    <source src="{{ '/assets/video/ego-recovery/unstack-last-frame-light.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. <a href="{{ '/assets/video/ego-recovery/unstack-last-frame-light.mp4' | relative_url }}">Download the demo</a>.
  </video>
  <figcaption class="ego-caption">The excerpt covers 0.80–2.80 seconds of a seven-second recording captured at 30 fps. It plays at original speed, then at 0.25× speed. The progress bar shows the source timestamp. Slow motion repeats existing frames without interpolation.</figcaption>
</figure>

At about 1.90 seconds, a visible gap has opened between the white and green blocks, but the white block is still moving. Look further ahead and the video enters PutOnTable. **The moment an action finishes and the moment its outcome is easiest to recognize do not always coincide.** Moving the selected frame later can bring the next action's effects into the image.

There are other approaches to try, including optical flow and methods based on visual feature similarity. In my project, however, I found these of limited practical use for this problem.

To walk through the editing process, we will use a separate PutOnTable clip. The Unstack video illustrates the selection problem; the mug example below shows how an outcome frame can be edited and checked.

**Start with what the edit changes.** In the original frame, the mug is on the table, but the hand remains close to its handle. In the generated frame, the hand has moved into the foreground, leaving a visible gap.

<div class="ego-example" role="group" aria-label="Before and after editing the PutOnTable mug example">
  <div class="ego-gallery ego-pair">
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-edit.png' | relative_url }}" alt="Original outcome frame: the mug is on the table and the hand is close to its handle" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Original frame: hand close to the handle</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/after-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/after-edit.png' | relative_url }}" alt="Generated outcome frame: the hand is in the foreground, clearly separated from the mug" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Generated frame: hand clearly separated</figcaption></figure>
  </div>
  <p class="ego-caption">The target is to preserve the mug's position while changing the hand's position and pose to make release easier to see. The edited image is derived from the original frame. <a href="#ego-cup-originals">The full image set, including the before-action frame, is in the supplementary material</a>.</p>
</div>

Here, recovery means making an outcome state easier to recognize. The observations constrain what must remain, and the reference example supplies the relations that indicate completion. The editor uses both to construct a clearer state image. Generated frames should be stored separately from the originals: they do not establish what an unobserved instant actually looked like.

**Each step should answer a specific question.** For the mug example, the workflow has five steps:

<div class="ego-flow" aria-label="Editing workflow: cache the reference change, identify the object and target, generate candidates, check the outcome and preservation, then select or fall back">
  <span>Cache reference change</span><b aria-hidden="true">→</b>
  <span>Identify object and target</span><b aria-hidden="true">→</b>
  <span>Generate candidates</span><b aria-hidden="true">→</b>
  <span>Check outcome and preservation</span><b aria-hidden="true">→</b>
  <span>Select or fall back</span>
</div>

First, extract what the reference demonstrates. The PutOnTable reference consists of before-and-after images of a red block. The useful change is relational: an object held by a hand is placed on a supporting surface and released. The block's color and the reference table's appearance are outside the mug scene's editing target. This description is cached and reused for other examples of the same action.

Second, identify the corresponding object in the current scene. The target mapper reads the mug's before-action frame, its rough outcome frame, and the cached description. It maps the reference role of “the held object” to the blue mug. Because the rough outcome frame already supplies the mug's position on the table, the target can be narrow: **keep the mug and other objects in place, and adjust the hand to make release clear.**

The target has three fields. Here is a simplified version of the saved specification:

```json
{
  "description": "The blue mug stays on the table. The hand moves away so that release is clearly visible.",
  "preserve": ["The mug's position in the original observation", "The bowl, plate, red cube, laptop, and scene layout"],
  "allowed_changes": ["The hand's position and pose to show separation from the mug"]
}
```

These fields define the desired state, the content that must remain, and the changes that are allowed. They turn “complete PutOnTable” into requirements that can be checked individually.

Third, establish which image the editor should use as its source of truth. The inputs, in order, are the current scene's before-action frame and rough outcome frame. **The second image is the only output canvas.** The first helps preserve object identity and explain the earlier state. The reference photographs are not supplied directly to the editor.

This excerpt from the actual prompt assigns those roles and limits the edit:

```text
Image 2 is the QUERY ROUGH AFTER image and is the only output canvas.
Image 2 is authoritative for all reliable visible query content.
Use Image 1 only to preserve identity and understand the query before-state.

Change only what the inferred transformation requires.
Preserve everything else.
Do not copy content from any other scene.
Make the smallest necessary edit.
```

The structured target is supplied alongside these instructions. The complete mug prompt also includes the editing mode and output requirements; a download is provided below. An edit can still fail, so the workflow supports generating multiple candidates for a verifier to assess.

Fourth, check both completion and preservation. One check asks whether the mug has been placed and released. The other checks object identity, surrounding objects, and scene layout. The verifier belongs to a different model family from the image editor. The saved record passes both sets of checks for this example; the <a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/verdicts.json' | relative_url }}">original verdict</a> is available to compare against the images.

Fifth, use the checks to choose the final frame. The program ranks candidates and uses the selected edit if it meets the acceptance conditions; otherwise, it keeps the original frame. Falling back preserves the observed image, but the decision is only useful when the verifier actually detects the error.

**An edit that passed verification still picked up the wrong object.** In another clip, the action parameter specifies the mug. The original outcome frame already shows the hand holding it. After editing, the mug is back on the table and the hand holds a patterned bowl.

<div class="ego-example" role="group" aria-label="Failure case: the action specifies picking up the mug, but the edit replaces it with the bowl">
  <div class="ego-gallery ego-pair">
    <figure><a href="{{ '/assets/img/ego-recovery/object-mismatch/before-edit.jpg' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/object-mismatch/before-edit.jpg' | relative_url }}" alt="Original frame: the hand holds the mug specified by the action parameter" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Original: holding the intended mug</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/object-mismatch/after-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/object-mismatch/after-edit.png' | relative_url }}" alt="Incorrect edit: the hand holds the patterned bowl and the mug is back on the table" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Incorrect edit: holding the bowl, yet accepted</figcaption></figure>
  </div>
  <p class="ego-caption">A separate PickFromTable failure. The recorded action argument is <code>mug</code>, the edit targets the patterned bowl, and the result has <code>accepted=true</code>. <a href="{{ '/assets/img/ego-recovery/object-mismatch/meta.json' | relative_url }}">Inspect the case record</a>.</p>
</div>

The verifier still observed an object being lifted from the table and judged the transformation correct. Looking at the information passed between stages revealed the gap: neither target mapping nor verification received the object specified in the action arguments. They lacked an explicit constraint on which object this action was supposed to manipulate.

The lesson is concrete: **the action must be correct, and it must act on the correct object.** In the PutOnTable example, the released object must be the mug, while the bowl and other objects remain unchanged. Generating more candidates from the same mistaken target cannot resolve the object mismatch.

One improvement is to pass the action arguments into target mapping and require the verifier to check object identity against them. Selection should also reject candidates that fail necessary conditions before ranking the remaining candidates. The current implementation does not fully enforce these stricter rules; the implementation notes below explain the differences.

**Try the mug example first.** You can start with the editing step using the saved target specification:

1. Download the <a href="{{ '/assets/downloads/reference-transfer-original-images.zip' | relative_url }}">original images and editing records</a> and locate the <code>tableware</code> folder.
2. Supply <code>before-action.png</code> first and <code>before-edit.png</code> second. The second image is the editing canvas.
3. Use the complete contents of <code>edit_prompt.txt</code>, including the target JSON, <code>COMPLETION</code> mode, and output requirements. You can also <a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/edit_prompt.txt' | relative_url }}">open the full prompt directly</a>.
4. Compare the new output with both inputs: is the hand separated from the mug, is the mug still in place, and are the surrounding objects preserved? The included <code>after-edit.png</code> and <code>verdicts.json</code> contain an existing result and its assessment for comparison.

For a new video, identify the action's object and infer a new editing target. First check whether a usable observed frame already exists. Where editing is needed, specify the regions and relations that may change. Keep the original frames, generated candidates, prompts, and verification records so each edit can be traced.

<details class="ego-supplement">
  <summary>Implementation notes: models, candidate counts, and acceptance conditions</summary>
  <p>The configuration in the code snapshot uses <code>gemini-robotics-er-1.6-preview</code> for reference analysis and target mapping, <code>gemini-3-pro-image</code> for editing, and <code>gpt-4o</code> for verification. These are the repository's recorded settings. The selected image archive does not retain complete model-version metadata or every candidate for each example.</p>
  <p>The stages are implemented in <code>reference_library.py</code>, <code>query_mapper.py</code>, <code>candidate_edit.py</code>, and <code>verify_select.py</code>. The generator defaults to three candidates, with a configurable count. The mug verdict records <code>04_candidate_0.png</code>; that file alone does not establish how many candidates the run generated.</p>
  <p>The current selector first chooses the highest-scoring candidate, then checks whether the transformation is analogous, its direction is correct, and there is no global recomposition. Correct role correspondence, completion, and content preservation are not all mandatory acceptance conditions. Filtering on all necessary conditions before ranking is the improvement proposed above.</p>
  <p>Target mapping can return <code>identity</code>, <code>repair</code>, <code>completion</code>, or <code>abstain</code>. The generator currently converts <code>identity</code> to <code>COMPLETION</code> by default and does not fully implement a branch that skips generation on <code>abstain</code>. Check the execution records to see what a particular run actually did.</p>
</details>

**Supplementary material: applying one reference across scenes.** These are the 11 original images used in the reference-transfer figure. Each query scene includes its before-action frame, editing input, and existing generated result. Click an image to open the original file.

<details class="ego-supplement">
  <summary>Reference action: before and after PutOnTable</summary>
  <p>The reference demonstrates placing a held object on a supporting surface and releasing it. Applying this relation to a new scene requires preserving that scene's object identities and layout.</p>
  <div class="ego-gallery ego-pair">
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/reference/before-action.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/reference/before-action.png' | relative_url }}" alt="Reference before the action: a hand holds a red block" width="640" height="432" loading="lazy" decoding="async"></a><figcaption>Reference: before action</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/reference/after-action.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/reference/after-action.png' | relative_url }}" alt="Reference after the action: the red block is on the table and the hand has released it" width="640" height="432" loading="lazy" decoding="async"></a><figcaption>Reference: after action</figcaption></figure>
  </div>
</details>

<details class="ego-supplement">
  <summary>A different number of objects: four blocks</summary>
  <p>The target mapper originally assigned <code>identity</code>, judging the observation complete, but this run still edited it in <code>completion</code> mode. The pair shows what the editor changes; the existence of an edited image does not establish that the original needed repair.</p>
  <div class="ego-gallery">
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/before-action.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/before-action.png' | relative_url }}" alt="Four-block scene before the action" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before action</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/before-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/before-edit.png' | relative_url }}" alt="Original editing input for the four-block scene" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before editing</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/after-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/blocks/after-edit.png' | relative_url }}" alt="Existing generated result for the four-block scene" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>After editing</figcaption></figure>
  </div>
</details>

<details class="ego-supplement" id="ego-cup-originals">
  <summary>A different object category: the blue mug</summary>
  <p>Before editing, the hand remains close to the mug's handle, making release less apparent. The target preserves the mug's observed position and changes the hand's position and pose to make the separation visible.</p>
  <div class="ego-gallery">
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-action.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-action.png' | relative_url }}" alt="Mug scene before the action, with the hand holding the mug" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before action</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/before-edit.png' | relative_url }}" alt="Before editing: the mug is on the table and the hand is close to its handle" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before editing</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/after-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/tableware/after-edit.png' | relative_url }}" alt="After editing: the hand has withdrawn, leaving a clear gap from the mug" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>After editing</figcaption></figure>
  </div>
</details>

<details class="ego-supplement">
  <summary>A different scene: a patterned bowl on a kitchen counter</summary>
  <p>The same reference relation is applied in a kitchen scene. The target makes release after placement clearer while preserving the bowl, other objects, and background.</p>
  <div class="ego-gallery">
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/before-action.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/before-action.png' | relative_url }}" alt="Kitchen scene before the action, with the hand holding a patterned bowl" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before action</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/before-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/before-edit.png' | relative_url }}" alt="Before editing: the bowl is on the counter and the hand remains nearby" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>Before editing</figcaption></figure>
    <figure><a href="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/after-edit.png' | relative_url }}"><img src="{{ '/assets/img/ego-recovery/reference-transfer-originals/kitchen/after-edit.png' | relative_url }}" alt="After editing: the hand is at the front of the counter and the bowl is clearly visible" width="640" height="360" loading="lazy" decoding="async"></a><figcaption>After editing</figcaption></figure>
  </div>
</details>

<p class="ego-downloads">
  <a href="{{ '/assets/downloads/reference-transfer-original-images.zip' | relative_url }}" download>Download the 11 original images, editing targets, prompts, and verification records</a><br>
  <a href="{{ '/assets/img/ego-recovery/curated/figure2.png' | relative_url }}">Original reference-transfer figure</a> ·
  <a href="{{ '/assets/video/ego-recovery/random_recording_20260704_220940.mp4' | relative_url }}">Full seven-second source video</a>
</p>
