// ==UserScript==
// @name         Discord Toggle Channels
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      2.4
// @description  Removes the channels sidebar for more screen space.
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

	var channelSelector = "div[class*='sidebarList']";
	var memberSelector = "div[class*='membersWrap']";

	var sidebarsHidden = false;

	var selectors = {
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

		setTimeout(() => {
			const toggleButton = document.createElement('button');
			toggleButton.className = 'sidebar-toggle-btn';
			toggleButton.textContent = 'toggle sidebar';
			toggleButton.addEventListener('click', onToggleClick);
			document.body.appendChild(toggleButton);
		}, 3000);
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
