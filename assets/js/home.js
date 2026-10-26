// Homepage interactions: research views, news toggle, video autoplay.
(function () {
  "use strict";

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  // Research views: Selected / All by date / All by topic. "All by topic" shows a row of
  // topic tabs; the list is filtered to the active topic, with selected entries first.
  toArray(document.querySelectorAll("[data-research]")).forEach(function (section) {
    var viewButtons = toArray(section.querySelectorAll(".pub-toggle button"));
    var topicBar = section.querySelector(".topic-tabs");
    var topicButtons = topicBar ? toArray(topicBar.querySelectorAll("button")) : [];
    var list = section.querySelector(".pub-list");
    var items = toArray(section.querySelectorAll(".pub")); // in date order
    var currentTopic = topicButtons.length ? topicButtons[0].getAttribute("data-topic") : null;

    function topicsOf(item) {
      return (item.getAttribute("data-topics") || "").split(/\s+/).filter(Boolean);
    }

    function isSelected(item) {
      return item.getAttribute("data-selected") === "true";
    }

    function press(buttons, isOn) {
      buttons.forEach(function (button) {
        var on = isOn(button);
        button.classList.toggle("active", on);
        button.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    // Reorder the DOM (not just the visual order) so keyboard focus follows what is shown.
    function arrange(ordered) {
      ordered.forEach(function (item) {
        list.appendChild(item);
      });
    }

    function renderTopic() {
      press(topicButtons, function (button) {
        return button.getAttribute("data-topic") === currentTopic;
      });
      var first = [];
      var rest = [];
      items.forEach(function (item) {
        var match = topicsOf(item).indexOf(currentTopic) !== -1;
        item.hidden = !match;
        (match && isSelected(item) ? first : rest).push(item);
      });
      arrange(first.concat(rest));
    }

    function setView(view) {
      press(viewButtons, function (button) {
        return button.getAttribute("data-view") === view;
      });
      if (topicBar) {
        topicBar.hidden = view !== "topic";
      }
      if (view === "topic" && currentTopic) {
        renderTopic();
        return;
      }
      arrange(items);
      items.forEach(function (item) {
        item.hidden = view === "selected" && !isSelected(item);
      });
    }

    viewButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.getAttribute("data-view"));
      });
    });
    topicButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentTopic = button.getAttribute("data-topic");
        renderTopic();
      });
    });

    var initial = viewButtons.filter(function (button) {
      return button.classList.contains("active");
    })[0];
    setView(initial ? initial.getAttribute("data-view") : "date");
  });

  // News: only the first few entries show until "Show more..." is clicked.
  toArray(document.querySelectorAll("[data-news]")).forEach(function (section) {
    var list = section.querySelector(".news-list");
    var button = section.querySelector(".show-btn");
    if (!list || !button) {
      return;
    }
    var limit = parseInt(list.getAttribute("data-visible"), 10) || 5;
    var extra = toArray(list.children).slice(limit);
    if (!extra.length) {
      return;
    }
    var expanded = false;

    function render() {
      extra.forEach(function (entry) {
        entry.hidden = !expanded;
      });
      button.textContent = expanded ? "Show less..." : "Show more...";
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    button.hidden = false;
    button.addEventListener("click", function () {
      expanded = !expanded;
      render();
    });
    render();
  });

  // Thumbnail videos play only while on screen (and not at all with reduced motion).
  var videos = toArray(document.querySelectorAll("video[data-autoplay]"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (videos.length && !reduceMotion && "IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            var playing = video.play();
            if (playing && typeof playing.catch === "function") {
              playing.catch(function () {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    videos.forEach(function (video) {
      videoObserver.observe(video);
    });
  }
})();
