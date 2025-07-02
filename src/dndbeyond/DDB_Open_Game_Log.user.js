// ==UserScript==
// @name          DDB Open Game Log
// @namespace     https://adamw.uk
// @version       1.0
// @description   Automatically open and lock the game log on character sheets, campaigns and encounters
// @author        Adam W
// @match         https://www.dndbeyond.com/*
// @grant         none
// @downloadURL   https://update.greasyfork.org/scripts/430058/DD%20Beyond%3A%20auto-open%20and%20lock%20game%20log.user.js
// @updateURL     https://update.greasyfork.org/scripts/430058/DD%20Beyond%3A%20auto-open%20and%20lock%20game%20log.meta.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        let gameLogButtons = document.querySelectorAll('.ct-character-header__group--game-log, .gamelog-button');
        for (let i = 0; i < gameLogButtons.length; i++) {
            gameLogButtons[i].click();
        }
        setTimeout(function () {
            let lockButtons = document.querySelectorAll('.ct-sidebar__control--unlock, .sidebar__control-group--lock button');
            for (let i = 0; i < lockButtons.length; i++) {
                lockButtons[i].click();
            }
        }, 250);
    }, 2000);
})();