// ==UserScript==
// @name         Twitch Sidebar Previews
// @name:de      Twitch Seitenleiste Vorschaubild
// @version      1.0.2
// @description  Hover over Channel in the Sidebar to see a Thumbnail Preview of the Stream on Twitch
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @author       TalkLounge (https://github.com/TalkLounge)
// @namespace    https://github.com/TalkLounge/twitch-sidebar-preview
// @license      MIT
// @match        https://www.twitch.tv/*
// @downloadURL  https://update.greasyfork.org/scripts/475701/Twitch%20Sidebar%20Thumbnail%20Preview.user.js
// @updateURL    https://update.greasyfork.org/scripts/475701/Twitch%20Sidebar%20Thumbnail%20Preview.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Cache stores last thumbnail fetch timestamp per channel (for 30s cache)
  let cache = {};
  // eventCount increments on mouseenter, to manage concurrency and ensure only the latest event acts
  let eventCount = 0;
  // 
  // let interval;

  /**
   * Utility: Creates an HTML element with optionally specified attributes and content
   * @param {string} tagName - HTML tag name
   * @param {Object} [attributes] - Element attributes as key-value pairs
   * @param {string} [content] - Inner HTML content
   * @returns {Element}
   */
  function newElement(tagName, attributes, content) {
    var tag = document.createElement(tagName);
    for (var key in attributes || {}) {
      if (attributes[key] !== undefined && attributes[key] !== null) {
        tag.setAttribute(key, attributes[key]);
      }
    }
    tag.innerHTML = content || "";
    return tag;
  }

  /**
   * Adds a preview thumbnail to the Twitch sidebar user's popup dialog.
   * Waits asynchronously for the dialog to appear, aborts if it takes too long or if a newer mouseenter event happens first.
   * Uses a cache to avoid unnecessary reloads within 30 seconds.
   * @param {Element} element - Sidebar channel entry element
   * @param {number} eventCountLocal - Event index when mouseenter fired
   */
  async function addThumbnail(element, eventCountLocal) {
    // Skip if channel is offline (sidebar avatar has this class)
    if (element.querySelector(".side-nav-card__avatar--offline")) {
      return;
    }

    let dialog, timeoutCount = 0;

    // Wait for Twitch's dialog popup to be added to DOM after hover
    do {
      await new Promise(r => setTimeout(r, 10));
      timeoutCount++;

      // Timeout after 0.5s or if a newer mouseenter event has been processed
      if (timeoutCount > 50 || eventCountLocal != eventCount) {
        return;
      }

      // Selects the dialog containing the user popout
      dialog = document.querySelector(".tw-dialog-layer:has(.hidden-focusable-elem) p");
    } while (!dialog);

    // Expand dialog width to fit the preview & remove old thumbnails
    dialog.parentNode.style.width = "440px";
    dialog.parentNode.querySelector("img")?.remove();

    // Infer channel name (username) in lowercase from sidebar element
    const channel = element.querySelector("[title]").textContent.toLowerCase();

    // Cache thumbnail URLs for 30 seconds seconds per channel
    if (!cache[channel] || Date.now() - cache[channel] >= 30 * 1000) {
      cache[channel] = Date.now();
      // console.log(`Twitch Sidebar Preview cache[channel]: ${cache[channel]}`);
    }

    // Add live thumbnail preview for this channel, bust cache via timestamp query param
    const img = newElement(
      "img",
      { src: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-440x248.jpg?t=${cache[channel]}` }
    );
    // console.info(`Twitch Sidebar Preview img: ${img.src}`)
    dialog.parentNode.append(img);
  }

  /**
   * Attach mouseenter event handler for showing thumbnails, once per element.
   * @param {Element} element - Sidebar channel element
   */
  function addHoverEvent(element) {
    // Prevent duplicate listeners (uses 'tsp' as marker)
    if ([...element.classList].includes("tsp")) {
      return;
    }

    element.classList.add("tsp");
    element.addEventListener("mouseenter", () => {
      eventCount++; // Invalidate previous hover events
      addThumbnail(element, eventCount);
    });
  }

  /**
   * Main initialization routine. Searches for sidebar channel lists and attaches
   * event listeners. Handles dynamic DOM updates using MutationObserver.
   * Ensures it's not re-run unnecessarily.
   */
  function init() {
    // Find all elements that represent the Twitch sidebar user/channel transition groups
    const uls = document.querySelectorAll("nav .tw-transition-group");
    // Wait until the DOM and sidebar channel list are ready
    if (!uls.length || !uls[0].children.length) {
      return;
    }

    // Only run once; after first success, reduce interval to slower periodic check
    if (interval) {
      console.info(`Twitch Sidebar Preview Interval: ${interval}`)
      clearInterval(interval);
      interval = undefined;
      // Re-run init every 5 minutes to handle page navigation or sidebar changes
      window.setInterval(init, 300000);
    }

    for (let i = 0; i < uls.length; i++) {
      if ([...uls[i].classList].includes("tsp")) { // Already processed this list
        continue;
      }
      uls[i].classList.add("tsp");

      // Attach hover event to each direct child (sidebar channel element)
      for (let j = 0; j < uls[i].children.length; j++) {
        addHoverEvent(uls[i].children[j]);
      }

      // Use MutationObserver: listens for added nodes ("Show more" reveals or changes list)
      const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          for (let j = 0; j < mutation.addedNodes.length; j++) {
            addHoverEvent(mutation.addedNodes[j]);
          }
        }
      });
      observer.observe(uls[i], { childList: true });
    }
  }

  // Initial poll to wait for Twitch's dynamic SPA interface to load
  let interval = window.setInterval(init, 500);

})();