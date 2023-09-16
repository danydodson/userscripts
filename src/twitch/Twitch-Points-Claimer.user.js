// ==UserScript==
// @name           Twitch: Points Claimer
// @author         PartMent
// @version        1.6
// @description    Automatically claim channel points.
// @namespace      https://github.com/danydodson/userscripts
// @downloadURL    https://github.com/danydodson/userscripts/raw/main/src/twitch/Twitch-Points-Claimer.user.js
// @updateURL      https://github.com/danydodson/userscripts/raw/main/src/twitch/Twitch-Points-Claimer.user.js
// @match          https://www.twitch.tv/*
// @match          https://dashboard.twitch.tv/*
// @icon           https://www.google.com/s2/favicons?domain=twitch.tv
// @grant          none
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