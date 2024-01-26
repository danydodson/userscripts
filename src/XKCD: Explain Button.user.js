// ==UserScript==
// @name         XKCD: Explain Button
// @namespace    https://egore.url.lol/userscripts
// @version      0.1.0
// @description  'cause you're dumb, or something?
// @author       You
// @match        https://xkcd.com
// @match        https://xkcd.com/*
// @grant        none
// @icon         https://xkcd.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/Vukkyy/userscripts/main/explainxkcd.user.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelectorAll(".comicNav")[1].innerHTML += `<br><br><li><a href="${document.location.href.replace("xkcd", "explainxkcd") + "#Explanation"}">Huh?</a></li>`;
})();