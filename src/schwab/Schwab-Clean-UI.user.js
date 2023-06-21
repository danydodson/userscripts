// ==UserScript==
// @name         Schwab: Clean UI
// @namespace    https://github.com/danydodson/userscripts/blob/main/src/schwab/schwab-clean-ui.user.js
// @version      0.1
// @description  removes unnecessary elements from schwab ui
// @author       toaster
// @match        https://client.schwab.com/*
// @icon         https://client.schwab.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	function clearSnapTicket() {
		try {
			let SnapTicketBtn = document.getElementById('SnapContainer')
			if (SnapTicketBtn) SnapTicketBtn.style.display = 'none'
		} catch (exception) {
			console.error(exception)
		}
	}

	function clearQuickQuote() {
		try {
			let quickQuoteBtn = document.getElementById('quickQuote')
			if (quickQuoteBtn) quickQuoteBtn.style.display = 'none'
		} catch (exception) {
			console.error(exception)
		}
	}

	clearSnapTicket()
	clearQuickQuote()

})()
