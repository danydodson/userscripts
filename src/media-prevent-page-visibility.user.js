// ==UserScript==
// @name        Prevent Page Visibility
// @namespace   https://github.com/IceWreck
// @icon        https://raw.githubusercontent.com/goawaylovestrike/Userscripts/refs/heads/main/quick-porn-search/quick-porn-search.png
// @match       *://*/*
// @run-at      document-start
// @grant       none
// @version     1.1
// @author      IceWreck
// @description Block websites from knowing if you switched tabs/windows

// ==/UserScript==

// This userscript blocks the page visibility API and to some extent the old blur/focus APIs.

let events_to_block = [
  "visibilitychange",
  "webkitvisibilitychange",
  "mozvisibilitychange",
  "hasFocus",
  "blur",
  "focus",
  "mouseleave"
];

for (event_name of events_to_block) {
  document.addEventListener(event_name, function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true);
}

for (event_name of events_to_block) {
  window.addEventListener(event_name, function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true);
}


document.hasFocus = function () { return true; };
document.onvisibilitychange = null;
Object.defineProperty(document, "visibilityState", { value: "visible" });
Object.defineProperty(document, "hidden", { value: false });
Object.defineProperty(document, "mozHidden", { value: false });
Object.defineProperty(document, "webkitHidden", { value: false });
Object.defineProperty(document, "webkitVisibilityState", { value: "visible" });

/* eslint no-undef:0 */
/* eslint no-implicit-globals:0 */
