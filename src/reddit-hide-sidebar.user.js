// ==UserScript==
// @name         Reddit Hide Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Slides in and out and fades right sidebar when near right screen edge.
// @author       dany
// @icon         https://www.reddit.com/favicon.ico
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

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

  const SENSITIVITY = 290;
  function setupSidebarHide() {
    const sidebar = document.getElementById('right-sidebar-container');
    if (!sidebar) return false;

    sidebar.classList.add('rs-hidden');

    document.addEventListener('mousemove', function (e) {
      if (sidebar.dataset.processing === 'true') return;

      const delayOpen = 800;

      if (window.innerWidth - e.clientX < SENSITIVITY) {
        sidebar.dataset.processing = 'true';
        setTimeout(() => {
          if (window.innerWidth - e.clientX < SENSITIVITY) {
            sidebar.classList.remove('rs-hidden');
          }
          sidebar.dataset.processing = 'false';
        }, delayOpen);
      } else {
        sidebar.classList.add('rs-hidden');
        sidebar.dataset.processing = 'false';
      }
    });
    return true;
  }

  function waitForSidebar(attempts = 0) {
    if (setupSidebarHide()) return;
    if (attempts < 40) setTimeout(() => waitForSidebar(attempts + 1), 250);
  }
  waitForSidebar();
})();