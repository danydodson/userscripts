// ==UserScript==
// @name         DDB Sidebar Fix
// @namespace    dndbeyond-fixed-sidebar
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @description  This script opens the sidebar, sets the sidebar to be fixed, locks its position, opens the profile, and scrolls to the bottom of the page.
// @version      1
// @grant        none
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
};

window.addEventListener('load', async () => {
  try {
    await onLoad();
  } catch (error) {
    console.error(error);
  }
}, false);