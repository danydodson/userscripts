// ==UserScript==
// @name         Reddit Hide Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Slides out and fades right sidebar when near right screen edge
// @author       dany
// @icon         https://www.reddit.com/favicon.ico
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // CSS for transition effects
  const style = document.createElement('style');
  style.innerHTML = /*css*/`
    #right-sidebar-container {
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1);
      will-change: transform, opacity;
    }
    #right-sidebar-container.rs-hidden {
      opacity: 0;
      transform: translateX(+300px);
    }
    #main-content,
    main.main {
      max-width: 100% !important;
      margin-left: 146px !important;
    }
    .legal-links {
      display: none !important;
    }

  `;
  document.head.appendChild(style);

  const SENSITIVITY = 300; // pixels from right edge

  function setupSidebarHide() {
    const sidebar = document.getElementById('right-sidebar-container');
    if (!sidebar) return false;

    // Hide it by default
    sidebar.classList.add('rs-hidden');

    document.addEventListener('mousemove', function (e) {
      if (window.innerWidth - e.clientX < SENSITIVITY) {
        // Near right edge, show sidebar
        sidebar.classList.remove('rs-hidden');
      } else {
        // Away from edge, hide sidebar
        sidebar.classList.add('rs-hidden');
      }
    });
    return true;
  }

  // Retry finding the sidebar in case it loads late (works up to 10 seconds)
  function waitForSidebar(attempts = 0) {
    if (setupSidebarHide()) return;
    if (attempts < 40) setTimeout(() => waitForSidebar(attempts + 1), 250);
  }
  waitForSidebar();
})();