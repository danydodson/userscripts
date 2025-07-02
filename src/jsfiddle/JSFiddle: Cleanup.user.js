// ==UserScript==
// @name         JSFiddle: Cleanup
// @version      0.1
// @author       toaster
// @description  removes unnecessary elements from fidelity ui
// @namespace    https://egore.url.lol/userscripts
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbranditechture.agency%2Fbrand-logos%2Fwp-content%2Fuploads%2Fwpdm-cache%2FJSFiddle-900x0.png&f=1&nofb=1&ipt=80194e9d045bbf5d2c314ea397a9d3b431d6f71b46a522712af8cfb3142db1da&ipo=images
// @match        https://jsfiddle.net/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	function clearFeedbackBtns() {
		try {
			let supportBtns = document.querySelector('support-jsfiddle')
			supportBtns.remove()
		} catch (exception) {
			console.error(exception)
		}
	}

	clearFeedbackBtns()

})()
