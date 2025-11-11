// ==UserScript==
// @name         Discord Toggle Servers
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      1.1
// @description  Removes the servers sidebar for more screen space.
// @author       Dragosarus
// @match        http://discord.com/*
// @match        https://discord.com/*
// @icon         https://discord.com/assets/favicon.ico
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function () {
	'use strict';
	var serverSelector = "nav[class*='guilds']";
	var baseSelector = "div[class*='base']";

	var baseOffset;
	var sidebarsHidden = false;

	const styles = `
	  .servers-toggle-btn {
      position: fixed;
      top: 5px;
      left: 70%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 8px 16px;
      color: #b0abab;
	  	background: none;
      cursor: pointer;
      font-size: 16px;
	  	font-weight: 500;
	  	line-height: 1.25;
      transition: background 0.2s, left 0.2s;
	  }
    .servers-toggle-btn:hover {
      color: #c8c4c4;
    }
    .servers-toggle-btn.sidebars-hidden {
      left: 13%;
    }
  `;

	function createToggleButton() {
		const button = document.createElement('button');
		button.innerHTML = 'toggle servers';
		button.classList.add('servers-toggle-btn');

		button.addEventListener('click', onToggleClick);
		document.body.appendChild(button);
	}

	function onToggleClick() {
		var node = $(serverSelector)[0];
		var base = $(baseSelector);

		if (sidebarsHidden) {
			node.style.removeProperty("display");
			base.css("left", baseOffset);
		} else {
			node.style.display = "none";
			baseOffset = base[0].style.left;
			base.css("left", "0px");
		}

		sidebarsHidden ^= true;
	}

	function init() {
		const styleSheet = document.createElement('style');
		styleSheet.textContent = styles;
		document.head.appendChild(styleSheet);

		setTimeout(() => {
			createToggleButton();
		}, 3000); // Wait 3 seconds before appearing
	}

	init();
})();

/*eslint-env jquery*/
