// ==UserScript==
// @name         Twitter: Flipnote Hatena Favorites
// @namespace   https://egore.url.lol/userscripts
// @version      0.1.2
// @description  try to take over twitter!
// @author       You
// @match        https://twitter.com/**
// @icon          https://cdn.cdnlogo.com/logos/t/96/twitter-icon.svg
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Vukky123/userscripts/main/flipnotefavsounds.user.js
// @downloadURL  https://raw.githubusercontent.com/Vukky123/userscripts/main/flipnotefavsounds.user.js
// @sandbox      JavaScript
// ==/UserScript==

(function() {
    'use strict';

    function handleFolpnote(star) { // intentional typo i was bored lol
        star = star.target;
        let folpnoteColors = { // one day i'll make these have weighted probabilities
            "yellow": "#f6b64a",
            "green": "#2ba516",
            "red": "#f14b60",
            "blue": "#21bdfe",
            "purple": "#bb2ad0"
        }
        if(star.classList.contains("tweet-interact-favorited")) {
            let randomFolpnote = Object.keys(folpnoteColors)[Math.floor(Math.random()*Object.keys(folpnoteColors).length)];
            new Audio(`https://github.com/Vukkyy/userscripts/releases/download/skribblplus-music/star${randomFolpnote}.mp3`).play()
            star.style.setProperty("--favorite-icon-color", folpnoteColors[randomFolpnote])
        } else if (star.classList.contains("tweet-interact-favorite")) {
            star.style.setProperty("--favorite-icon-color", "")
        }
    }

    window.addEventListener("click", handleFolpnote)
})();
