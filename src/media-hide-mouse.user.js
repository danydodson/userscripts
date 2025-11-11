// ==UserScript==
// @name         Hide Mouse on Stop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://cdn3.iconfinder.com/data/icons/material-set-4-3/48/395-512.png
// @description  Hides the mouse pointer immediately after it stops moving.
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	let hideTimer = null;
	const HIDE_DELAY = 100; // milliseconds (0 = immediately)

	const css = `
			body.hide-cursor, body.hide-cursor * {
					cursor: none !important;
			}
	`;

	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);

	const hideCursor = () => {
			document.body.classList.add('hide-cursor');
			console.log('Cursor hidden');
	};

	const showCursor = () => {
			document.body.classList.remove('hide-cursor');
			console.log('Cursor shown');
	};

	document.addEventListener('mousemove', () => {
			showCursor();
			if (hideTimer) {
					clearTimeout(hideTimer);
			}
			hideTimer = setTimeout(hideCursor, HIDE_DELAY);
	});

	// In case mouse starts idle
	hideTimer = setTimeout(hideCursor, HIDE_DELAY);

})();
