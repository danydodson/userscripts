// ==UserScript==
// @name           Hide ScrollBars
// @namespace      https://egore.url.lol/userscripts
// @description	   Hides all Scrollbars.
// @match          *
// @version        1.0.0
// @icon           https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
// ==/UserScript==

function hideScrollBars() {
	if (document.body) {
		var style = document.createElement('style');

		style.innerHTML = "::-webkit-scrollbar {display: none;}";

		document.body.appendChild(style);
	} else {
		setTimeout(hideScrollBars, 100);
	}
}

hideScrollBars();