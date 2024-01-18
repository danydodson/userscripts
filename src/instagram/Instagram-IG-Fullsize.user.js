// ==UserScript==
// @name         Instagram: IG Fullsize
// @version      0.6
// @namespace    Nonce Scripts
// @description  View full resolution images on Instagram
// @match        https://www.instagram.com/*
// @icon         https://instagram.com/favicon.ico
// @require      https://gist.githubusercontent.com/realies/2fece0cd3e197cf6b31ca1316431a2a4/raw/debc0e6d4d537ac228d1d71f44b1162979a5278c/waitForKeyElements.js
// @author       realies
// ==/UserScript==
(() => {
	waitForKeyElements("div._aagu", clickBox => {
			clickBox.style.cursor = "zoom-in";
			clickBox.onclick = () => window.open(clickBox.querySelector("img").src);
	}, false);
})();
