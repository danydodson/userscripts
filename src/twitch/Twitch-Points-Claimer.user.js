// ==UserScript==
// @name           Twitch: Points Claimer
// @namespace      https://github.com/danydodson/userscripts
// @downloadURL    https://github.com/danydodson/userscripts/raw/main/src/twitch/Twitch-Points-Claimer.user.js
// @updateURL      https://github.com/danydodson/userscripts/raw/main/src/twitch/Twitch-Points-Claimer.user.js
// @version        1.6
// @author         PartMent
// @description    Automatically claim channel points.
// @match          https://www.twitch.tv/*
// @match          https://dashboard.twitch.tv/*
// @license        MIT
// @grant          none
// @icon           https://www.google.com/s2/favicons?domain=twitch.tv
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

let claiming = false

if (MutationObserver) {
	console.log('Twitch: Auto claimer is enabled.')
}

let observer = new MutationObserver(e => {
	let bonus = document.querySelector('.claimable-bonus__icon')
	if (bonus && !claiming) {
		bonus.click()
		let date = new Date()
		claiming = true
		setTimeout(() => {
			console.log('Claimed at ' + date)
			claiming = false
		}, Math.random() * 1000 + 2000)
	}
})

observer.observe(document.body, { childList: true, subtree: true })