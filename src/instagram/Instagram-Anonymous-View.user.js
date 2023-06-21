// ==UserScript==
// @name         Instagram: Anonymous View
// @version      0.1
// @author       iKaio
// @description  Anonymous Story Viwer
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/instagram/Instagram-Anonymous-View.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/instagram/Instagram-Anonymous-View.user.js
// @icon         https://www.google.com/s2/favicons?domain=instagram.com
// @license      MIT
// @match        *://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	function intercept(open, send) {
		XMLHttpRequest.prototype.open = function (_, url) {
			this._url = url
			open.apply(this, arguments)
		}

		XMLHttpRequest.prototype.send = function () {
			send.apply(this, arguments)

			if (this._url.includes("/stories/reel/seen")) {
				this.abort()
			}
		}
	}

	intercept(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)
})()