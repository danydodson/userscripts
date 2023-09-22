// ==UserScript==
// @name         Tiktok: Remove Distractions
// @description  Remove distractions on TikTok
// @author       You
// @version      1.1
// @license      GPL v3
// @namespace    Nonce Scripts
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/tiktok/Tiktok-Remove-Distractions.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/tiktok/Tiktok-Lower-Remove-Distractions.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @match	     *://tiktok.com/*
// @match	     *://*.tiktok.com/*
// @grant        none
// ==/UserScript==

const selectors = [
	'[data-e2e="nav-live"]', // Live tab
	'[data-e2e="nav-foryou"]', // For you tab
	'[class*="-DivDiscoverContainer"]', // Discover section
	'[class*="-DivUserContainer"]:has([data-e2e="suggest-accounts"])', // Suggested accounts in sidebar (needs about:config layout.css.has-selector.enabled for now)
	'[data-e2e="recharge-entrance"]', // Get coins in profile menu
	'[data-e2e="live-studio-entrance"]', // Live Studio in profile menu
	'[class*="-StyledShareIcon"]', // Share icon on profile page
	'[data-e2e="upload-icon"]', // Upload button
]

const hide = (selector) => {
	const node = document.querySelector(selector)
	if (node) {
		node.style.display = 'none'
	}
}

const redirectClickEvent = (event) => {
	event.preventDefault()
	event.stopImmediatePropagation()
	const followingButton = document.querySelector('[data-e2e="nav-following"]')
	if (followingButton) {
		followingButton.click()
	} else {
		window.location.pathname = '/following'
	}
}

const listeners = []
const redirect = () => {
	// replace home links click to following button
	const links = document.querySelectorAll('[href="/"]')
	links.forEach(link => {
		if (!listeners.includes(link)) {
			listeners.push(link)
			link.addEventListener('click', redirectClickEvent, true)
		}
	})
}

window.setTimeout(
	function check() {
		selectors.forEach(hide)
		redirect()
		window.setTimeout(check, 250)
	}, 250
)

// redirect from home live or home with country code
const { pathname } = window.location
if (pathname === '/' || pathname === '/live' || pathname.match(/\/[a-z]{2}$/)) {
	window.location.replace('/following')
}