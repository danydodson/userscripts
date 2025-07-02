// ==UserScript==
// @name         Discord Toggle Channels Button
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      2.4
// @description  Give the chat more screen space
// @author       egore
// @match        http://discord.com/*
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @icon         https://discord.com/assets/favicon.ico
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://update.greasyfork.org/scripts/419227/Hide%20Discord%20sidebars.user.js
// @updateURL    https://update.greasyfork.org/scripts/419227/Hide%20Discord%20sidebars.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var hide = {
		channelSidebar: true,
		memberSidebar: false
	};

	// var memberIconPath = "M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z";

	// var serverSelector = "nav[class*='guilds']";
	var channelSelector = "div[class*='sidebarList']";
	// var channelSelector = "div[id='channels']";
	var memberSelector = "div[class*='membersWrap']";
	// var memberIconSelector = "div[class*='clickable']:has(svg > path[d='" + memberIconPath + "'])";
	// var baseSelector = "div[class*='base']";
	var sidebarsHidden = false;
	var selectors = {
		// serverSidebar: serverSelector,
		channelSidebar: channelSelector,
		memberSidebar: memberSelector
	};

	const styles = `
        .sidebar-toggle-btn {
            position: fixed;
            top: 5px;
            left: 63%;
            transform: translateX(-50%);
            z-index: 9999;
            padding: 8px 16px;
            color: #b0abab;
			background: none;
            cursor: pointer;
            font-size: 15px;
            transition: background 0.2s;
	}
        .sidebar-toggle-btn:hover {
            color: #c8c4c4;
        }
    `;

	function init() {
		const styleSheet = document.createElement('style');
		styleSheet.textContent = styles;
		document.head.appendChild(styleSheet);

		const toggleButton = document.createElement('button');
		toggleButton.className = 'sidebar-toggle-btn';
		toggleButton.textContent = 'toggle sidebar';
		toggleButton.addEventListener('click', onToggleClick);
		document.body.appendChild(toggleButton);
	}

	function onToggleClick() {
		for (var sidebar in selectors) {

			if (hide.hasOwnProperty(sidebar) && hide[sidebar]) {
				setSidebar(selectors[sidebar], sidebarsHidden);
			}
		}
		sidebarsHidden ^= true;
	}

	function setSidebar(selector, boolValue) {
		if (boolValue) {
			showSidebar(selector);
		} else {
			hideSidebar(selector);
		}
	}

	function hideSidebar(selector) {
		var node = $(selector)[0];
		node.style.display = "none";
	}

	function showSidebar(selector) {
		var node = $(selector)[0];
		node.style.removeProperty("display");
	}

	init();
})();

/*eslint-env jquery*/
