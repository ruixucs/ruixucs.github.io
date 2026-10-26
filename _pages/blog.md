---
layout: blog_post
permalink: /blog/
title: Blog
description: Notes on robot learning and egocentric data.
nav: true
nav_order: 1
---

<div class="blog-list">
  {% for post in site.posts %}
    <article class="blog-post">
      {% if post.thumbnail %}
        <a class="blog-post__thumb" href="{{ post.url | relative_url }}" tabindex="-1" aria-hidden="true">
          <img src="{{ post.thumbnail | relative_url }}" alt="" loading="lazy">
        </a>
      {% endif %}
      <div class="blog-post__info">
        <a class="blog-post__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <p>{{ post.description }}</p>
        <p><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %-d, %Y' }}</time></p>
        <a class="blog-post__more" href="{{ post.url | relative_url }}">Continue reading &rarr;</a>
      </div>
    </article>
  {% endfor %}
</div>
