// ==UserScript==
// @name         All: Ethical Alternatives
// @description  Redirects you from proprietary web-services to ethical alternatives(front-end).
// @author       NotYou
// @version      9.0.0
// @namespace    Nonce Scripts
// @icon         https://i.ibb.co/8gKMGvZ/monkey.png
// @match        *youtube.com/*
// @match        *google.*
// @match        *yahoo.com/*
// @match        *bing.com/*
// @match        *reddit.com/*
// @match        *twitter.com/*
// @match        *instagram.com/*
// @match        *wikipedia.org/*
// @match        *medium.com/*
// @match        *towardsdatascience.com/*
// @match        *i.imgur.com/*
// @match        *i.stack.imgur.com/*
// @match        *odysee.com/*
// @match        *tiktok.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var url = new URL(location.href),

	// INSTANCES //
	invidious = 'yewtu.be',
	searx = 'search.mdosch.de',
	libreddit = 'reddit.invak.id',
	nitter = 'nitter.snopyta.org',
	bibliogram = 'bibliogram.pussthecat.org',
	wikiless = 'wikiless.org',
	lingva = 'lingva.ml',
	scribe = 'scribe.rip',
	rimgo = 'rimgo.pussthecat.org',
	librarian = 'librarian.pussthecat.org',
	proxitok = 'proxitok.pussthecat.org'

// YouTube | Invidious //
if (location.host.indexOf('youtube.com') != -1) {
	location.replace('https://' + invidious + location.pathname + location.search)
}

if (location.host.includes('google.')) {
	// Google Translate | Lingva Translate //
	if (location.hostname.match(/translate.google.+/)) {
		if (location.search === '') {
			location.replace('https://' + lingva)
		} else {
			let
				base = location.search.split('&'),
				lang1 = base[0].split('=')[1],
				lang2 = base[1].split('=')[1],
				text = base[2].split('=')[1]
			location.replace('https://' + lingva + '/' + lang1 + '/' + lang2 + '/' + text)
		}
		// Google | SearX //
		//} else if(location.href.match(/(www\.)?google\.com(\/search)?(?!\/\w)/)) {
	} else if (location.host.match(/www.google.+/) && location.href.match(/google+\..*(\/search)/)) {
		location.replace('https://' + searx + location.pathname + location.search)
	}
}

// Yahoo | SearX //
if (location.host.indexOf('yahoo.com') != -1) {
	let search = location.search.replace('?p', '?q')
	location.replace('https://' + searx + location.pathname + search)
}

// Bing | SearX //
if (location.host.indexOf('bing.com') != -1) {
	location.replace('https://' + searx + location.pathname + location.search)
}

// Reddit | Libreddit //
if (location.host.indexOf('reddit.com') != -1) {
	location.replace('https://' + libreddit + location.pathname + location.search)
}

// Twitter | Nitter //
if (location.host.indexOf('twitter.com') != -1) {
	location.replace('https://' + nitter + location.pathname + location.search)
}

// Instagram | Bibliogram //
if (location.host.indexOf('instagram.com') != -1) {
	if (location.pathname === '/accounts/login/') {
		let path = '/u' + location.search.split('?next=').at(1)
		location.replace('https://' + bibliogram + path)
	} else {
		location.replace('https://' + bibliogram + location.pathname + location.search)
	}
}

// Wikipedia | Wikiless //
if (location.host.indexOf('wikipedia.org') != -1) {
	location.replace('https://' + wikiless + location.pathname + '?lang=' + url.hostname.split('.')[0])
}

// Medium | Scribe //
if (location.host.indexOf('medium.com') != -1 || location.host.indexOf('towardsdatascience.com') != -1) {
	location.replace('https://' + scribe + location.pathname + location.search)
}

// i.Imgur | Rimgo //
if (location.host.indexOf('i.imgur.com') != -1) {
	location.replace('https://' + rimgo + location.pathname + location.search)
}

// Odysee | Librarinan //
if (location.host.indexOf('odysee.com') != -1) {
	location.replace('https://' + librarian + location.pathname + location.search)
}

// TikTok | ProxiTok //
if (location.host.indexOf('tiktok.com') != -1 || location.host.indexOf('www.tiktok.com') != -1) {
	location.replace('https://' + proxitok + location.pathname + location.search)
}