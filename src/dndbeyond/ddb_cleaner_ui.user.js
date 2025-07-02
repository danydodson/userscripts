// ==UserScript==
// @name          D&DBeyond Cleaner UI
// @version       0.0.1
// @author        spatch
// @license       MIT
// @description   Clean up the dndbeyond character sheet.
// @namespace     dumpsterbaby.lol
// @homepage      https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_cleaner_ui.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_cleaner_ui.user.js
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_cleaner_ui.user.js
// @icon          https://icons.duckduckgo.com/ip2/dndbeyond.com.ico
// @match         *://*.dndbeyond.com/characters/*
// @run-at        document-body
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_registerMenuCommand
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @resource      jui https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// ==/UserScript==

(function () {
  'use strict';

  // Function to modify sidebar styles
  function modifySidebarStyles() {
    // Select elements with the specified class
    const sidebarElements = document.getElementsByClassName('ct-sidebar styles_sidebar__RrEHr styles_right__e4y1G styles_visible__6s+G- ct-sidebar--is-dark-mode');

    // Iterate through found elements
    for (let element of sidebarElements) {
      // Add your style modifications here
      element.style.top = '2.5rem';
      element.style.height = '58.26rem';
    }
  }

  // Function to hide header
  function hideHeader() {
    // Select header element using attributes
    const headerElement = document.querySelector('[role="banner"].header-wrapper');
    if (headerElement) {
      headerElement.style.display = 'none';
    }
  }

  // Function to hide sync blocker
  function hideSyncBlocker() {
    // Add CSS rule using GM_addStyle
    GM_addStyle(`
          .ct-character-sheet.sync-blocker:before {
              display: none !important;
          }
          .ct-character-sheet.sync-blocker {
              display: none !important;
          }
      `);
  }

  // Function to set body background
  // function setBodyBackground() {
  //   GM_addStyle(`
  //         html body.body-rpgcharacter-sheet {
  //             background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
  //             background-size: cover !important;
  //             background-attachment: fixed !important;
  //             background-position: center center !important;
  //         }
  //     `);
  // }

  // Function to handle media queries
  function handleMediaQueries() {
    GM_addStyle(`
        @media (min-width: 768px) {
          html body.body-rpgcharacter-sheet {
            background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
          }
        }
        @media (min-width: 1024px) {
          html body.body-rpgcharacter-sheet {
            background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
          }
        }
        @media (min-width: 1200px) {
          html body.body-rpgcharacter-sheet {
            background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
          }
        }
        @media (min-width: 1921px) {
          html body.body-rpgcharacter-sheet {
            background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
          }
        }
        @media (min-width: 2561px) {
          html body.body-rpgcharacter-sheet {
            background: url(https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg) no-repeat center !important;
          }
        }
      `);
  }

  // Function to handle dynamic content loading
  function initObserver() {
    const observer = new MutationObserver((mutations) => {
      modifySidebarStyles();
      hideHeader();
      hideSyncBlocker();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initial run
  window.addEventListener('load', () => {
    modifySidebarStyles();
    hideHeader();
    hideSyncBlocker();
    // setBodyBackground();
    handleMediaQueries();
    initObserver();
  });

  // Run immediately in case the content is already loaded
  modifySidebarStyles();
  hideHeader();
  hideSyncBlocker();
  // setBodyBackground();
  handleMediaQueries();
})();

