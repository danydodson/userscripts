// ==UserScript==
// @name          YouTube: Polymer Disable
// @version       2.1
// @namespace     https://greasyfork.org/users/175036
// @description   Suhh dude
// @match         *://www.youtube.com/*
// @exclude       *://www.youtube.com/embed/*
// @grant         none
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?domain=youtube.com
// ==/UserScript==

var url = window.location.href

if (url.indexOf('disable_polymer') === -1) {
	if (url.indexOf('?') > 0) {
		url += '&'
	} else {
		url += '?'
	}
	url += 'disable_polymer=1'
	window.location.href = url
}