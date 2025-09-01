// ==UserScript==
// @name         Greasy Fork Total Installs
// @version      0.1.1
// @description  A userscript that shows the total installs for any page on Greasy Fork
// @license      MIT
// @author       Rob Garrison
// @namespace    https://egore.url.lol/userscripts
// @icon         https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png
// @include      https://greasyfork.org/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
	"use strict";

	const wrapper = $("#browse-script-list, #user-script-list");
	if (wrapper) {
		const els = [...wrapper.querySelectorAll("dd.script-list-total-installs")];
		const nonDigits = /[^\d]/g;
		const getNum = txt => parseFloat(txt.replace(nonDigits, ""));
		const total = els.reduce((acc, el) => acc + getNum(el.textContent), 0);
		if (total) {
			const span = document.createElement("span");
			let target = $("#script-list-sort .list-option:nth-child(2)");
			span.textContent = ` (${(total).toLocaleString()})`;
			if ($("a", target)) {
				target = $("a", target);
			}
			target.appendChild(span);
		}
	}

	function $(str, el) {
		return (el || document).querySelector(str);
	}

})();
