// ==UserScript==
// @name         DND Beyond Sidebar Fix
// @namespace    dndbeyond-fixed-sidebar
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @description  This script opens the sidebar, sets the sidebar to be fixed, locks its position, opens the profile, and scrolls to the bottom of the page.
// @version      1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @include      https://*dndbeyond.com/profile/*
// @include      https://*dndbeyond.com/characters/*
// @downloadURL  https://update.greasyfork.org/scripts/498700/DD%20Beyond%20Character%20Sheet%20Fixed%20Sidebar.user.js
// @updateURL    https://update.greasyfork.org/scripts/498700/DD%20Beyond%20Character%20Sheet%20Fixed%20Sidebar.meta.js
// ==/UserScript==

// Enforce ES8
/* jshint esversion: 8 */

const clickElement = (query) => {
  let element = document.querySelector(query);
  console.log(`Querying element: ${query}`);
  if (element) {
    console.log(`Clicking element: ${query}`);
    element.click();
  } else {
    console.log(`Element not found: ${query}`);
  }
  return element;
};

function setContentOpacity() {
  const el = document.querySelector('.styles_content__3knKz.styles_dark__6-qrS');
  if (el) {
    el.style.opacity = '0.9';
    console.log("Set opacity of content to 0.9");
  } else {
    console.log("Element .styles_content__3knKz.styles_dark__6-qrS not found");
  }
}

function hideHeader() {
  const hel = document.querySelector('[role="banner"].header-wrapper');
  if (hel) {
    hel.style.display = 'none';
    console.log("Set display for banner to none");
  } else {
    console.log('Element [role="banner"].header-wrapper not found');
  }
}

function newStyles() {
  const hel = document.querySelector('.ct-character-header-desktop');
  if (hel) {
    hel.style.padding = '50px 10px 107px';
    console.log("Set padding for header el to '50px 10px 107px'");
  } else {
    console.log('Element .ct-character-header-desktop not found');
  }
}

// Function to modify sidebar styles
function modifySidebarStyles() {
  // Select elements with the specified class
  const sidebarEl = document.getElementsByClassName('ct-sidebar styles_sidebar__RrEHr styles_right__e4y1G styles_visible__6s+G- ct-sidebar--is-dark-mode');

  // Iterate through found elements
  for (let element of sidebarEl) {
    // Add your style modifications here
    // element.style.top = '2.5rem';
    element.style.height = '56.76rem';
    element.style.top = '145px !imporntant';
  }
}

// Function to hide sync blocker
function hideSyncBlocker() {
  // Add CSS rule using GM_addStyle
  GM_addStyle(`
    .ct-character-sheet.sync-blocker,
    .ct-character-sheet.sync-blocker:before {
      display: none !important;
    }
  `);
}

function fixHeaderColor() {
  GM_addStyle(`
    .ct-character-sheet:before {
      background-color: #12181c !imporntant;
      opacity: 0.9 !imporntant;
    }
  `);
}

// Function to set body background
function setBodyBackground() {

  let darkBack = 'https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg';
  let subPerkBack1 = 'https://www.dndbeyond.com/avatars/49562/222/638844727449821353.jpeg';
  let subPerkBack2 = 'https://www.dndbeyond.com/avatars/49562/196/638844726374881506.jpeg';

  GM_addStyle(`
    html body.body-rpgcharacter-sheet {
      background: url(${subPerkBack1}) no-repeat center !important;
      background-size: cover !important;
      background-attachment: fixed !important;
      background-position: center center !important;
    }
  `);
}

// Function to handle media queries
function handleMediaQueries() {
  let darkBack = 'https://www.dndbeyond.com/avatars/21914/774/637734501597334637.jpeg';
  let subPerkBack1 = 'https://www.dndbeyond.com/avatars/49562/222/638844727449821353.jpeg';
  let subPerkBack2 = 'https://www.dndbeyond.com/avatars/49562/196/638844726374881506.jpeg';

  GM_addStyle(`
    @media (min-width: 768px) {
      html body.body-rpgcharacter-sheet {
        background: url(${subPerkBack1}) no-repeat center !important;
      }
    }
    @media (min-width: 1024px) {
      html body.body-rpgcharacter-sheet {
        background: url(${subPerkBack1}) no-repeat center !important;
      }
    }
    @media (min-width: 1200px) {
      html body.body-rpgcharacter-sheet {
        background: url(${subPerkBack1}) no-repeat center !important;
      }
    }
    @media (min-width: 1921px) {
      html body.body-rpgcharacter-sheet {
        background: url(${subPerkBack1}) no-repeat center !important;
      }
    }
    @media (min-width: 2561px) {
      html body.body-rpgcharacter-sheet {
        background: url(${subPerkBack1}) no-repeat center !important;
      }
    }
  `);
}

const keepTrying = (
  fn, {
    checkEvery = 500,
    stopAfter = 3000, // Timeout set to 3 seconds
    delayBy = 0
  } = {}
) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const timeout = setTimeout(() => {
      clearInterval(interval);
      return reject(new Error(`Timeout after ${stopAfter}ms.`));
    }, stopAfter);

    const interval = setInterval(() => {
      const result = fn();
      if (!result) return;
      clearInterval(interval);
      clearTimeout(timeout);
      return resolve(result);
    }, checkEvery);
  }, delayBy);
});

const expandPromise = async (promise) => {
  let data = null;
  let error = null;
  try {
    data = await promise;
  } catch (err) {
    error = err;
  }
  return [error, data];
};


const logError = (error, message) => {
  if (!error) return;
  console.error(message, error);
};

const pageClickOptions = { delayBy: 2000 };

const onLoad = async () => {
  console.log('Optimizing D&D Beyond...');

  const setSidebar = async () => {
    console.log("Trying to expand sidebar");
    await keepTrying(() => clickElement('[aria-label="Show sidebar"]'), pageClickOptions);

    console.log("Trying to set sidebar to fixed");
    clickElement('[aria-label="Set to fixed position"]');

    console.log("Trying to lock sidebar");
    clickElement('[aria-label="Unlocked"]');
  };

  console.log("Expanding sidebar");
  const willSetSidebar = setSidebar();

  const tryToClickProfile = () => clickElement('.ddbc-character-avatar__portrait');
  const willKeepClickingProfile = keepTrying(tryToClickProfile, pageClickOptions);

  const [sidebarTimeout] = await expandPromise(willSetSidebar);
  const [profileTimeout] = await expandPromise(willKeepClickingProfile);

  logError(sidebarTimeout, 'Timed out while waiting on sidebar controls');
  logError(profileTimeout, 'Timed out while waiting on portrait');

  if (!sidebarTimeout && !profileTimeout) {
    console.log("Sidebar setup and profile click were successful");
  }

  // Scroll to the bottom of the page
  window.scrollTo(0, document.body.scrollHeight);

  // Set sidebar content opacity
  setContentOpacity();

  // Fix sidebar styles when hiding the header
  modifySidebarStyles();

  // Hide  sync blocker
  hideSyncBlocker();

  // Hide header
  hideHeader();

  // Set sheet bg
  setBodyBackground();

  // Fix styles
  newStyles();

  //
  fixHeaderColor();

  // Set sheet bg for queries
  handleMediaQueries();
};

window.addEventListener('load', async () => {
  try {
    await onLoad();
  } catch (error) {
    console.error(error);
  }
}, false);