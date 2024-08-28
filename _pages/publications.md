---
layout: page
permalink: /publications/
title: Publications
nav: true
nav_order: 2
dropdown: true
children:
  - title: Journal Articles
    permalink: /publications/journal/
  - title: Conference Papers
    permalink: /publications/conference/
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->
{% include bib_search.liquid %}

<div class="publications">
<h2>Journal Articles</h2>
    {% bibliography -q @*[type=journal]* %}

<br> <br>

<h2>Conference Papers</h2>
    {% bibliography -q @*[type=conference]* %}



</div>
