// ==UserScript==
// @name         Tiktok: Lower Initial Volume
// @version      0.1
// @author       kmcgurty
// @description  Stop your ears from getting blown out by every tiktok video
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/tiktok/Tiktok-Lower-Initial-Volume.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/tiktok/Tiktok-Lower-Initial-Volume.user.js
// @icon         https://www.google.com/s2/favicons?domain=tiktok.com
// @match        https://m.tiktok.com/v/*
// @grant        none
// ==/UserScript==

var player = document.querySelector("#jp_video_0")
player.setAttribute("controls", "")
player.volume = 0.15;

