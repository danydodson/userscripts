// ==UserScript==
// @name         Discord No Title Bar
// @namespace    discord-no-title-bar
// @version      1.0.2
// @description  A simple userstyle that removes Discord's new title bar.
// @author       Coxxs
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://discord.com/assets/favicon.ico
// @match        https://discord.com/*
// @downloadURL  https://update.greasyfork.org/scripts/532904/Discord%20No%20Title%20Bar.user.js
// @updateURL    https://update.greasyfork.org/scripts/532904/Discord%20No%20Title%20Bar.meta.js
// ==/UserScript==

(function () {
	let css = `
	/* Remove top bar */
	.visual-refresh { --custom-app-top-bar-height: 0px }
	.visual-refresh .title__85643 { visibility: hidden }
	
	/* Preserve inbox button */
	.visual-refresh .trailing_c38106 { position: absolute; top: 8px; right: 10px; z-index: 101 }
	.visual-refresh.density-compact .trailing_c38106 { top: 6px }
	.visual-refresh.density-cozy .trailing_c38106 { top: 9px }
	
	/* Provide some space for the inbox */
	.visual-refresh .toolbar__9293f { padding-right: 40px }
	.visual-refresh .searchBar__1ac1c { margin-right: 35px }
	
	/* Padding above the Discord icon (top left) */
	.visual-refresh .tutorialContainer__1f388 { padding-top: 8px }
	
	/* Remove help button */
	.visual-refresh .trailing_c38106 > a.anchorUnderlineOnHover_edefb8 { display: none }
	
	/* Remove rounded corner and top border */
	.visual-refresh .sidebarListRounded_c48ade { border-top-left-radius: 0 !important; border-top: none !important }
	.visual-refresh .chat_f75fb0[data-has-border=true] { border-top: none !important }
	.visual-refresh .container__133bf, /* Friends */
	.visual-refresh .container_f391e3, /* Message Requests */
	.visual-refresh .container__01ae2,  /* Message Requests - Messages */
	.visual-refresh .homeWrapper__0920e, /* Nitro */
	.visual-refresh .shop__6db1d, /* Shop */
	.visual-refresh .container_a592e1 /* Discover */
		{ border-top: none !important }
	`;
	if (typeof GM_addStyle !== "undefined") {
		GM_addStyle(css);
	} else {
		const styleNode = document.createElement("style");
		styleNode.appendChild(document.createTextNode(css));
		(document.querySelector("head") || document.documentElement).appendChild(styleNode);
	}
})();
