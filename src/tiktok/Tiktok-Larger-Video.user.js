// ==UserScript==
// @name            Tiktok: Larger Video
// @version         1.2
// @namespace       https://greasyfork.org/en/users/807108-jeremy-r
// @description     Makes the TikTok video take up more of the screen
// @author          JRem
// @match           https://www.tiktok.com/*/video/*
// @match           https://www.tiktok.com/*
// @grant           GM_addStyle
// @license         MIT
// @require         https://cdn.jsdelivr.net/gh/mlcheng/js-toast@ebd3c889a1abaad615712485ce864d92aab4c7c0/toast.min.js
// @icon            https://www.google.com/s2/favicons?domain=tiktok.com
// ==/UserScript==

(function () {
	// Set to 0, if you want to keep the blur
	const removeBlur = "1"
	// Set to 0, to disable toast msg's
	const enableToasts = "1"

	// Toast Vars
	const options = { settings: { duration: 500, }, style: { main: { background: "black", color: "white", width: "auto", 'max-width': '10%', } } }

	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector))
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector))
					observer.disconnect()
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true
			})
		})
	}

	waitForElm('div[class*="-DivVideoContainer"]').then((elm) => {
		console.log('Element Found, Starting Fullscreen')

		var vid = document.querySelector('video')
		console.log(vid)
		vid.volume = 0.9
		vid.loop = true
		vid.controls = null
		if (enableToasts == 1) { iqwerty.toast.toast(Math.floor(100 * vid.volume) + "%", options) }

		var cssClass = document.querySelector('div[class*="-DivVideoContainer"]').className.split(" ")
		var css = "." + cssClass[0] + ", ." + cssClass[1] + " { height: 80vh !important; }"
		GM_addStyle(css)
		if (enableToasts == 1) { iqwerty.toast.toast('Fullscreen added', options) }

		if (removeBlur == 1) {
			var cssClass1 = document.querySelector('div[class*="-DivBlurBackground"]').className.split(" ")
			var css1 = "." + cssClass1[0] + ", ." + cssClass1[1] + " { opacity: 0 !important; }"
			GM_addStyle(css1)
			if (enableToasts == 1) { iqwerty.toast.toast('Blur Removed', options) }
		}
	})
})()