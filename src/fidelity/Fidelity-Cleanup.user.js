// ==UserScript==
// @name         Fidelity: Cleanup
// @namespace    https://github.com/danydodson/userscripts/blob/main/src/fidelity/Fidelity-Cleanup.user.js
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/fidelity/Fidelity-Cleanup.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/fidelity/Fidelity-Cleanup.user.js
// @version      0.1
// @description  removes unnecessary elements from fidelity ui
// @author       toaster
// @match        https://digital.fidelity.com/*
// @icon         https://digital.fidelity.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	function clearFeedbackBtn() {
		try {
			let feedbackBtn = document.getElementsByClassName('QSIFeedBackLink SI_0AsPpi6JZXIjgMZ_FeedBackLinkContainer')
			if (feedbackBtn) feedbackBtn.style.display = 'none'
		} catch (exception) {
			console.error(exception)
		}
	}

	clearFeedbackBtn()

})()
