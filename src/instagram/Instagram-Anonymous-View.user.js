// ==UserScript==
// @name         Instagram: Anonymous View
// @version      0.1
// @author       iKaio
// @description  Anonymous Story Viwer
// @namespace    Nonce Scripts
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/instagram/Instagram-Anonymous-View.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/instagram/Instagram-Anonymous-View.user.js
// @icon         https://www.google.com/s2/favicons?domain=instagram.com
// @license      MIT
// @match        *://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
	// Store a reference to the original send method of XMLHttpRequest
	var originalXMLSend = XMLHttpRequest.prototype.send
	// Override the send method
	XMLHttpRequest.prototype.send = function () {
		// Check if the request URL contains the "viewSeenAt" string
		if (typeof arguments[0] === "string" && arguments[0].includes("viewSeenAt")) {
			// Block the request by doing nothing
			// This prevents the "viewSeenAt" field from being sent
		} else {
			// If the request URL does not contain "viewSeenAt",
			// call the original send method to proceed with the request
			originalXMLSend.apply(this, arguments)
		}
	}
})()