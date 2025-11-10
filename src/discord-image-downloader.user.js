// ==UserScript==
// @name         Discord Image Downloader
// @namespace    http://tampermonkey.net/
// @description  Adds a download button to images and GIFs in Discord.
// @author       Yukiteru
// @version      1.06
// @license      MIT
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_download
// @grant        GM_log
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  GM_log('Discord Universal Image Downloader script started.');

  // --- Configuration ---
  const MESSAGE_LI_SELECTOR = 'li[id^="chat-messages-"]';
  const MESSAGE_ACCESSORIES_SELECTOR = 'div[id^="message-accessories-"]';

  // Selectors for different types of media containers within accessories
  const MOSAIC_ITEM_SELECTOR = 'div[class^="mosaicItem"]';             // Grid items (attachments, some embeds)
  const SPOILER_CONTENT_SELECTOR = 'div[class^="spoilerContent"]';     // Spoiler overlay (often inside mosaicItem)
  const INLINE_MEDIA_EMBED_SELECTOR = 'div[class^="inlineMediaEmbed"]';// Simple inline embeds (like the new example)
  // Combined selector for any top-level distinct media block
  const ANY_MEDIA_BLOCK_SELECTOR = `${MOSAIC_ITEM_SELECTOR}, ${INLINE_MEDIA_EMBED_SELECTOR}`;

  // Selectors for elements *within* a media block
  const IMAGE_WRAPPER_SELECTOR = 'div[class^="imageWrapper"]';         // Actual image container (consistent across types)
  const ORIGINAL_LINK_SELECTOR = 'a[class^="originalLink"]';          // Link with source URL (consistent)
  const HOVER_BUTTON_GROUP_SELECTOR = 'div[class^="hoverButtonGroup"]';// Target container for buttons (may need creation)
  // const IMAGE_CONTENT_SELECTOR = 'div[class^="imageContent"]';      // Common parent, less specific now

  // Markers
  const IMAGE_PROCESSED_MARKER = 'data-dl-img-processed';
  const SPOILER_LISTENER_MARKER = 'data-dl-spoiler-listener-added';
  const DOWNLOAD_BUTTON_CLASS = 'discord-native-dl-button';

  // Native Button Styling
  const NATIVE_ANCHOR_CLASSES_PREFIXES = ['anchor_', 'anchorUnderlineOnHover_', 'hoverButton_'];
  const DOWNLOAD_SVG_HTML = `<svg class="downloadHoverButtonIcon__6c706" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM3 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z" class=""></path></svg>`;

  // --- Dynamic Class Name Cache ---
  const classCache = {};

  function findActualClassName(scope, prefix) {
    if (classCache[prefix]) return classCache[prefix];
    const searchScope = scope || document.body;
    try {
      const element = searchScope.querySelector(`[class^="${prefix}"]`);
      if (element) {
        const classList = element.classList;
        for (let i = 0; i < classList.length; i++) {
          if (classList[i].startsWith(prefix)) {
            classCache[prefix] = classList[i];
            return classList[i];
          }
        }
      }
    } catch (e) { GM_log(`Error finding class with prefix ${prefix}: ${e}`); }
    return null;
  }

  function generateFilename(originalUrl, imageWrapper) {
    let dateStamp = '0000-00-00';
    let messageId = 'unknownMsgId';
    let fileIndexStr = '';

    const messageLi = imageWrapper.closest(MESSAGE_LI_SELECTOR);
    if (messageLi) {
      // Get date from message timestamp
      const timeElement = messageLi.querySelector('time[datetime]');
      if (timeElement && timeElement.dateTime) {
        try {
          const messageDate = new Date(timeElement.dateTime);
          if (!isNaN(messageDate.getTime())) {
            const year = messageDate.getFullYear();
            const month = String(messageDate.getMonth() + 1).padStart(2, '0');
            const day = String(messageDate.getDate()).padStart(2, '0');
            dateStamp = `${year}-${month}-${day}`;
          } else { GM_log(`Filename Date: Failed parse: ${timeElement.dateTime}`); }
        } catch (e) { GM_log(`Filename Date: Error parsing: ${e}`); }
      } else { GM_log(`Filename Date: No time[datetime] found in msg ${messageLi.id}`); }

      // Get Message ID
      if (messageLi.id) {
        const idParts = messageLi.id.split('-');
        if (idParts.length > 0) messageId = idParts[idParts.length - 1];
      }

      // Calculate Index - UPDATED to count diverse media blocks
      const accessoriesContainer = messageLi.querySelector(MESSAGE_ACCESSORIES_SELECTOR);
      if (accessoriesContainer) {
        // --- FIX: Count all distinct top-level media blocks ---
        const allMediaBlocks = accessoriesContainer.querySelectorAll(ANY_MEDIA_BLOCK_SELECTOR);
        const totalCount = allMediaBlocks.length;
        // GM_log(`Filename Index: Found ${totalCount} media blocks in msg ${messageId}`);

        if (totalCount > 1) {
          // --- FIX: Find the current media block (mosaic or inline embed) ---
          const currentBlock = imageWrapper.closest(ANY_MEDIA_BLOCK_SELECTOR);
          if (currentBlock) {
            const index = Array.from(allMediaBlocks).indexOf(currentBlock) + 1;
            if (index > 0) {
              fileIndexStr = `_${index}`;
              // GM_log(`Filename Index: Assigned index ${index} for msg ${messageId}`);
            } else { GM_log(`Filename Index: Could not find current block in allMediaBlocks list for msg ${messageId}.`); }
          } else { GM_log(`Filename Index: Could not find parent media block for imageWrapper in msg ${messageId}`); }
        }
      } else { GM_log(`Filename Index: Could not find accessories container in msg ${messageId}`); }

    } else { GM_log(`Filename: Could not find parent message LI.`); }


    let extension = 'dat'; // Default fallback
    try {
      const url = new URL(originalUrl);
      const pathname = url.pathname;

      // 1. Try extracting from the path
      const lastDotIndex = pathname.lastIndexOf('.');
      const lastSlashIndex = pathname.lastIndexOf('/'); // Ensure dot is in the filename part
      if (lastDotIndex > lastSlashIndex) {
        const extFromPath = pathname.substring(lastDotIndex + 1);
        // Basic validation: check if it looks like a typical extension (alphanumeric, reasonable length)
        if (/^[a-z0-9]{2,5}$/i.test(extFromPath)) {
          extension = extFromPath.toLowerCase();
          // GM_log(`Extracted extension from path: ${extension}`); // Debug log
        }
      }

      // 2. If path didn't yield a valid extension, try 'format' query parameter
      if (extension === 'dat') { // Only check format if path failed
        const formatParam = url.searchParams.get('format');
        if (formatParam && /^[a-z0-9]{2,5}$/i.test(formatParam)) {
          extension = formatParam.toLowerCase();
          // GM_log(`Extracted extension from format param: ${extension}`); // Debug log
        }
      }

    } catch (e) {
      GM_log(`Error parsing URL for extension: ${originalUrl}. Error: ${e}`);
      // Keep the default 'dat' on error
    }

    return `${dateStamp}_${messageId}${fileIndexStr}.${extension}`;
  }

  /**
     * Finds or creates the container where the download button should be placed.
     * Works for mosaic items, spoilers, and inline embeds.
     * @param {Element} imageWrapper - The image wrapper element.
     * @returns {Element|null} The container element (usually hoverButtonGroup) or null if creation fails.
     */
  function findButtonTargetContainer(imageWrapper) {
    // --- FIX: Find the parent media block (mosaic, inline embed, or spoiler) ---
    // For spoilers, we actually want the container *inside* the spoiler if possible,
    // or the spoiler itself as the fallback parent for the hover group.
    const parentSpoiler = imageWrapper.closest(SPOILER_CONTENT_SELECTOR);
    const parentMediaBlock = parentSpoiler || imageWrapper.closest(ANY_MEDIA_BLOCK_SELECTOR); // Prefer spoiler if present

    if (!parentMediaBlock) {
      GM_log('findButtonTargetContainer: Could not find parent media block (mosaic, embed, or spoiler).');
      return null;
    }
    // GM_log('findButtonTargetContainer: Found parent block:', parentMediaBlock);

    // 1. Try to find an EXISTING hoverButtonGroup within the parent block
    // Need to search carefully, could be direct child or deeper (e.g., inside imageContainer for inline)
    const existingGroup = parentMediaBlock.querySelector(HOVER_BUTTON_GROUP_SELECTOR);
    if (existingGroup) {
      // GM_log('findButtonTargetContainer: Found existing hoverButtonGroup.');
      return existingGroup;
    }

    // 2. If no existing group, CREATE one
    const newGroup = document.createElement('div');
    newGroup.classList.add('custom-dl-hover-group'); // Custom marker

    // Try to append it next to where other buttons might be, or as a direct child.
    // For inline embeds, inside the 'imageContainer__' seems appropriate if it exists.
    let appendTarget = parentMediaBlock; // Default target
    const imageContainer = imageWrapper.closest('div[class^="imageContainer"]');
    if (imageContainer && parentMediaBlock.contains(imageContainer)) {
      // If an imageContainer exists within our block, append the group there.
      // This handles the inline embed case better.
      appendTarget = imageContainer;
      // GM_log('findButtonTargetContainer: Appending new group to imageContainer.');
    } else {
      // GM_log('findButtonTargetContainer: Appending new group directly to parentMediaBlock.');
    }

    appendTarget.appendChild(newGroup);
    // GM_log('findButtonTargetContainer: Created and appended new hover group.');

    return newGroup;
  }

  /**
   * Extract correct image/video url from the anchor element.
   * @param {Element} linkElement - The image anchor element.
   */
  function getImageUrl(linkElement) {
    const href = linkElement.href;
    const dataSafeSrc = linkElement.getAttribute('data-safe-src');

    try {
      const pathname = new URL(href).pathname;
      const ext = pathname.slice((pathname.lastIndexOf(".") - 1 >>> 0) + 2);
      return ext ? href : dataSafeSrc;
    } catch (e) {
      return dataSafeSrc;
    }
  }


  /**
   * Attempts to add a download button to a given imageWrapper. Checks markers and existing buttons.
   * @param {Element} imageWrapper - The image wrapper element.
   * @param {boolean} forceCheck - If true, bypasses the IMAGE_PROCESSED_MARKER check (used after spoiler click).
   */
  function addDownloadButton(imageWrapper, forceCheck = false) {
    if (!imageWrapper || (!forceCheck && imageWrapper.hasAttribute(IMAGE_PROCESSED_MARKER))) {
      return;
    }
    imageWrapper.setAttribute(IMAGE_PROCESSED_MARKER, 'true');

    const originalLinkElement = imageWrapper.querySelector(ORIGINAL_LINK_SELECTOR);
    if (!originalLinkElement || !originalLinkElement.href) {
      return;
    }

    const imageUrl = getImageUrl(originalLinkElement);
    const targetContainer = findButtonTargetContainer(imageWrapper); // Should now find/create container

    if (!targetContainer) {
      // Log updated message
      GM_log(`AddButton: Failed to find or create a suitable hover buttons container for image: ${imageUrl}`);
      return; // Cannot proceed without a container
    }

    // Check if OUR button already exists in the found/created container
    if (targetContainer.querySelector(`.${DOWNLOAD_BUTTON_CLASS}`)) {
      // GM_log('AddButton: Download button already exists in target container.');
      return;
    }

    const filename = generateFilename(imageUrl, imageWrapper);
    // GM_log(`AddButton: Preparing button for ${filename} in`, targetContainer);

    const downloadButton = document.createElement('a');
    downloadButton.href = imageUrl;
    downloadButton.target = "_blank";
    downloadButton.rel = "noreferrer noopener";
    downloadButton.setAttribute('role', 'button');
    downloadButton.setAttribute('aria-label', 'Download Image');
    downloadButton.title = `Download ${filename}`;
    downloadButton.tabIndex = 0;

    NATIVE_ANCHOR_CLASSES_PREFIXES.forEach(prefix => {
      const actualClass = findActualClassName(document.body, prefix);
      if (actualClass) downloadButton.classList.add(actualClass);
    });

    downloadButton.classList.add(DOWNLOAD_BUTTON_CLASS);
    downloadButton.innerHTML = DOWNLOAD_SVG_HTML;

    downloadButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      GM_log(`Attempting GM_download: ${imageUrl} as ${filename}`);
      try {
        GM_download({ url: imageUrl, name: filename, onerror: (err) => GM_log(`Download error: ${JSON.stringify(err)}`) });
      } catch (e) { GM_log(`Error initiating GM_download: ${e}`); }
    });

    targetContainer.appendChild(downloadButton);
    GM_log(`AddButton: Added button for ${filename}`);
  }

  /**
   * Attaches a click listener to a spoiler element if it hasn't been done yet.
   * The listener reveals the image and then calls addDownloadButton.
   * @param {Element} spoilerElement - The spoiler content element.
   */
  function handleSpoiler(spoilerElement) {
    if (!spoilerElement || spoilerElement.hasAttribute(SPOILER_LISTENER_MARKER)) {
      return;
    }
    const imageWrapperInside = spoilerElement.querySelector(IMAGE_WRAPPER_SELECTOR);
    if (!imageWrapperInside) {
      spoilerElement.setAttribute(SPOILER_LISTENER_MARKER, 'true'); // Mark anyway
      return;
    }
    spoilerElement.setAttribute(SPOILER_LISTENER_MARKER, 'true');
    spoilerElement.addEventListener('click', () => {
      setTimeout(() => {
        const revealedImageWrapper = spoilerElement.querySelector(IMAGE_WRAPPER_SELECTOR);
        if (revealedImageWrapper) {
          addDownloadButton(revealedImageWrapper, true); // Force check after reveal
        } else { GM_log("HandleSpoiler: Could not find revealed image wrapper post-click."); }
      }, 200);
    }, { once: true });
  }

  /**
   * Processes a node to find image wrappers or spoilers containing images.
   * Handles regular images, spoiled images, and inline embeds.
   * @param {Node} node - The node to process.
   */
  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Find all image wrappers within this node that haven't been processed
      const imageWrappers = node.querySelectorAll(`${IMAGE_WRAPPER_SELECTOR}:not([${IMAGE_PROCESSED_MARKER}])`);
      imageWrappers.forEach(wrapper => {
        // If it's inside a spoiler, let the spoiler handler deal with it upon click
        if (wrapper.closest(SPOILER_CONTENT_SELECTOR)) {
          wrapper.setAttribute(IMAGE_PROCESSED_MARKER, 'true'); // Mark now, handle later
        } else {
          // Process directly (regular image or inline embed) with slight delay
          setTimeout(() => addDownloadButton(wrapper), 150);
        }
      });
      // Also check if the node itself is a non-spoiled wrapper
      if (node.matches(IMAGE_WRAPPER_SELECTOR) && !node.hasAttribute(IMAGE_PROCESSED_MARKER) && !node.closest(SPOILER_CONTENT_SELECTOR)) {
        setTimeout(() => addDownloadButton(node), 150);
      }

      // Find spoiler elements containing images that need listeners
      const spoilerElements = node.querySelectorAll(`${SPOILER_CONTENT_SELECTOR}:not([${SPOILER_LISTENER_MARKER}]):has(${IMAGE_WRAPPER_SELECTOR})`);
      spoilerElements.forEach(spoiler => {
        setTimeout(() => handleSpoiler(spoiler), 150);
      });
      // Also check if the node itself is a spoiler needing handling
      if (node.matches(`${SPOILER_CONTENT_SELECTOR}:has(${IMAGE_WRAPPER_SELECTOR})`) && !node.hasAttribute(SPOILER_LISTENER_MARKER)) {
        setTimeout(() => handleSpoiler(node), 150);
      }
    }
  }

  // --- Observer ---
  const observer = new MutationObserver((mutationsList) => {
    NATIVE_ANCHOR_CLASSES_PREFIXES.forEach(prefix => findActualClassName(document.body, prefix)); // Ensure classes cached

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(processNode);
      }
    }
  });

  // --- Initialization ---
  function initialize() {
    GM_log("Initializing Universal Downloader...");
    GM_log("Fetching initial dynamic class names...");
    NATIVE_ANCHOR_CLASSES_PREFIXES.forEach(prefix => findActualClassName(document.body, prefix));

    GM_log("Starting MutationObserver.");
    observer.observe(document.body, { childList: true, subtree: true });

    GM_log("Performing initial scan...");
    // Scan for non-spoiled images/embeds
    document.querySelectorAll(`${IMAGE_WRAPPER_SELECTOR}:not([${IMAGE_PROCESSED_MARKER}])`).forEach(wrapper => {
      if (!wrapper.closest(SPOILER_CONTENT_SELECTOR)) {
        addDownloadButton(wrapper);
      } else {
        wrapper.setAttribute(IMAGE_PROCESSED_MARKER, 'true'); // Mark spoiled ones
      }
    });
    // Scan for spoilers needing listeners
    document.querySelectorAll(`${SPOILER_CONTENT_SELECTOR}:not([${SPOILER_LISTENER_MARKER}]):has(${IMAGE_WRAPPER_SELECTOR})`).forEach(handleSpoiler);
  }

  setTimeout(initialize, 2000);

})();

/* eslint no-multi-spaces: 0 */