// ==UserScript==
// @name         Media Always New Window
// @namespace    http://www.github.com/4ndr0666/userscripts
// @description  Force every single link, including dynamically loaded ones, to open in a new window/tab.
// @version      0.3
// @author       4ndr0666
// @downloadURL  https://github.com/4ndr0666/userscripts/raw/refs/heads/main/4ndr0tools-AlwaysNewWindow.user.js
// @updateURL    https://github.com/4ndr0666/userscripts/raw/refs/heads/main/4ndr0tools-AlwaysNewWindow.user.js
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/4ndr0666/4ndr0site/refs/heads/main/static/cyanglassarch.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Applies the necessary attributes to a single anchor element to force it
   * to open in a new tab with security best practices.
   * @param {HTMLAnchorElement} anchor - The anchor element to process.
   */
  const processAnchor = (anchor) => {
    // Use strict equality to ensure we are only modifying anchor elements.
    if (anchor && anchor.tagName === 'A') {
      // Set target to _blank to open in a new window/tab.
      anchor.target = '_blank';

      // Add rel="noopener noreferrer" for security.
      // noopener prevents the new page from accessing window.opener.
      // noreferrer prevents sending the referrer header.
      anchor.rel = 'noopener noreferrer';
    }
  };

  /**
   * Processes a node to find and modify all anchor tags within it.
   * It also checks if the node itself is an anchor tag.
   * @param {Node} node - The DOM node to process.
   */
  const processNode = (node) => {
    // Ensure the node is an element node before querying it.
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Process the node itself if it's an anchor tag.
      processAnchor(node);

      // Find and process all descendant anchor tags.
      const childAnchors = node.querySelectorAll('a');
      childAnchors.forEach(processAnchor);
    }
  };

  // --- Initial Execution ---
  // Process all links that are present on the page when the script initially runs.
  // This ensures coverage for static content.
  try {
    const initialElements = document.querySelectorAll("a");
    initialElements.forEach(processAnchor);
  } catch (error) {
    console.error("Always New Window Script (Initial Scan) Error:", error);
  }


  // --- Dynamic Content Handling ---
  // Use MutationObserver to watch for new elements being added to the DOM.
  // This is the modern, performant way to handle dynamically loaded content.
  const observer = new MutationObserver((mutationsList) => {
    // A mutation record represents a single DOM change.
    for (const mutation of mutationsList) {
      // We only care about nodes that have been added to the DOM.
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Iterate over each node that was added.
        mutation.addedNodes.forEach(processNode);
      }
    }
  });

  // Configuration for the observer:
  // childList: true - observe additions and removals of child nodes.
  // subtree: true - extend observations to the entire subtree of the target.
  const observerConfig = {
    childList: true,
    subtree: true
  };

  // Start observing the entire document body for changes.
  // Using document.body is a robust target that exists early in the page lifecycle.
  observer.observe(document.body, observerConfig);

})();

