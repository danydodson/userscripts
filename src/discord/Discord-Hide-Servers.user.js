// ==UserScript==
// @name         Discord: Hide Servers
// @description  Hide servers in discord to give more space, show on hovering the server list
// @author       Nonce
// @version      0.1
// @license      MIT
// @namespace    Nounce Scripts
// @iconURL      https://i.ibb.co/7znt13j/30162036.png
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict'
	window.setTimeout(function waitForLoad() {
		let sidebar = Array.from(document.querySelectorAll('*').values()).find(e => Array.from(e.classList).find(cls => cls.match(/^sidebar-.*/)))
		let nav = Array.from(document.querySelectorAll('nav')).find(n => Array.from(n.classList).find(cls => cls.match(/guilds-.*/)))
		if (!(!!nav && !!sidebar)) {
			window.setTimeout(waitForLoad, 300)
		}
		sidebar.style.position = 'absolute'
		sidebar.style.top = 0
		sidebar.style.bottom = 0
		sidebar.style.transitionProperty = 'transform'
		sidebar.style.transitionTimingFunction = 'ease'
		sidebar.style.transitionDuration = '.2s'
		sidebar.style.zIndex = 200
		sidebar.style.transform = 'translateX(-' + sidebar.clientWidth + 'px)'

		let keepopen = false
		nav.onmouseenter = function () { sidebar.style.transform = 'translateX(0)'; keepopen = true }
		nav.onmouseleave = function () { keepopen = false }
		sidebar.onmouseenter = function () { keepopen = true }

		sidebar.onmouseleave = function () {
			keepopen = false
			window.setTimeout(function () {
				if (!keepopen) sidebar.style.transform = 'translateX(-' + sidebar.clientWidth + 'px)'
			}, 300)
		}
	}, 300)
})()