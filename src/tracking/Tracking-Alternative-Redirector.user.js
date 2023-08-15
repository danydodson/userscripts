// ==UserScript==
// @name              Tracking: Alternative Redirector
// @namespace         https://github.com/danydodson/userscripts
// @downloadURL       https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Alternative-Redirector.user.js
// @updateURL         https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Alternative-Redirector.user.js
// @version           11.2.0
// @description       Redirects you from proprietary web-services to ethical alternatives(front-end).
// @author            NotYou
// @icon              https://cdn0.iconfinder.com/data/icons/interface-editing-and-time/64/arrow-redirect-interface-512.png
// @license           GPL-3.0-or-later
// @run-at            document-start
// @include           *youtube.com/*
// @include           *google.com/*
// @include           *google.*
// @include           *yahoo.com/*
// @include           *bing.com/*
// @include           *reddit.com/*
// @include           *twitter.com/*
// @include           *instagram.com/*
// @include           *wikipedia.org/*
// @include           *medium.com/*
// @include           *towardsdatascience.com/*
// @include           *i.imgur.com/*
// @include           *i.stack.imgur.com/*
// @include           *odysee.com/*
// @include           *tiktok.com/*
// @include           *quora.com/*
// @grant             none
// ==/UserScript==

(function () {
	const DEBUG_MODE = false
	
	let { host, href, search } = location,
	
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
		proxitok = 'proxitok.pussthecat.org',
		quetre = 'qr.vern.cc',
		hyperpipe = 'hyperpipe.surge.sh',

		data = [
			[['music.youtube.com'], youtubeMusicRedirect],
			[['youtube.com'], youtubeRedirect],
			[['google.'], googleRedirect],
			[['search.yahoo.com'], yahooRedirect],
			[['bing.com'], bingRedirect],
			[['reddit.com'], redditRedirect],
			[['twitter.com'], twitterRedirect],
			[['wikipedia.org'], wikipediaRedirect],
			[['medium.com', 'towardsdatascience.com'], mediumRedirect],
			[['i.imgur.com'], imgurRedirect],
			[['odysee.com'], odyseeRedirect],
			[['tiktok.com'], tiktokRedirect],
			[['quora.com'], quoraRedirect],
		]

	const LOGS_TITLE = 'REDIRECTOR LOGS\n'
	const HTTPS = 'https://'
	const DEFAULT_CATEGORY = 'general'
	const CATEGORIES = {
		IMAGES: 'images',
		VIDEOS: 'videos',
		NEWS: 'news',
		MAP: 'map',
		SCIENCE: 'science',
	}

	mainRedirect(location, data)

	function mainRedirect(loc, cases) {
		for (let i = 0; i < cases.length; i++) {
			let currentCase = cases[i]
			let domains = currentCase[0]
			let redirectFn = currentCase[1]

			for (let j = 0; j < domains.length; j++) {
				let domain = domains[j]
				let hostHasDomain = hostHas(domain)

				if (DEBUG_MODE) {
					console.log(LOGS_TITLE, 'DOMAIN:', domain, 'REDIRECT FN:', redirectFn, 'HOST HAS DOMAIN:', hostHasDomain)
				}

				if (hostHasDomain) {
					return redirectFn()
				}
			}
		}
	}

	function youtubeMusicRedirect() {
		return redirect(hyperpipe)
	}

	function quoraRedirect() {
		return redirect(quetre)
	}

	function tiktokRedirect() {
		return redirect(proxitok)
	}

	function odyseeRedirect() {
		return redirect(librarian)
	}

	function imgurRedirect() {
		return redirect(rimgo)
	}

	function mediumRedirect() {
		if (!/^\/$/.test(location.pathname)) {
			return redirect(scribe)
		} else {
			let perfObs = PerformanceObserver

			if (perfObs) {
				let obs = new PerformanceObserver((list) => {
					let entries = list.getEntries()

					for (let i = 0; i < entries.length; i++) {
						let entry = entries[i]

						if (entry.name.endsWith('graphql')) {
							mainRedirect(location, data)
						}
					}
				})

				obs.observe({
					entryTypes: ['resource']
				})
			} else {
				return redirect(scribe)
			}
		}

		function getPerformanceObserver() {
		}
	}

	function wikipediaRedirect() {
		let _host = host.split('.')
		let lang = 'en'

		if (_host.length > 2 && _host[0] !== 'www') {
			lang = _host[0]
		}

		return redirect(wikiless, '?lang=' + lang)
	}

	function twitterRedirect() {
		return redirect(nitter)
	}

	function redditRedirect() {
		return redirect(libreddit)
	}

	function youtubeRedirect() {
		return redirect(invidious)
	}

	function bingRedirect() {
		if (createSearchExp('bing', 'com').test(href)) {
			let searchParams = new URLSearchParams(search)
			let searchQuery = searchParams.get('q')
			let category

			category = chooseCase(location.pathname, {
				images: CATEGORIES.IMAGES,
				videos: CATEGORIES.VIDEOS,
				news: CATEGORIES.NEWS,
				maps: CATEGORIES.MAP,
			}, DEFAULT_CATEGORY, false)

			let _search = createSearch(searchQuery, category)

			return redirectSearx(_search)
		}
	}

	function yahooRedirect() {
		if (createSearchExp('yahoo', 'com').test(href)) {
			let searchParams = new URLSearchParams(search)
			let searchQuery = searchParams.get('p')
			let category

			category = chooseCase(location.host, {
				images: CATEGORIES.IMAGES,
				video: CATEGORIES.VIDEOS,
				news: CATEGORIES.NEWS,
			}, DEFAULT_CATEGORY, false)

			let _search = createSearch(searchQuery, category)

			return redirectSearx(_search)
		}
	}

	function googleRedirect() {
		if (host.match(/translate\.google\..{2,3}/)) {
			if (search === '') {
				location.replace('https://' + lingva)
			} else {
				let _search = new URLSearchParams(search),
					sourceLang = _search.get('sl'),
					targetLang = _search.get('tl'),
					text = _search.get('text')

				location.replace(HTTPS + lingva + '/' + sourceLang + '/' + targetLang + '/' + text)
			}
		} else if (/www.google.+/.test(href) && createSearchExp('google').test(href)) {
			let searchParams = new URLSearchParams(search)
			let searchQuery = searchParams.get('q')
			let searchCategory = searchParams.get('tbm')
			let category

			category = chooseCase(searchCategory, {
				isch: CATEGORIES.IMAGES,
				vid: CATEGORIES.VIDEOS,
				bks: CATEGORIES.SCIENCE,
				nws: CATEGORIES.NEWS,
			}, DEFAULT_CATEGORY)

			let _search = createSearch(searchQuery, category)

			return redirectSearx(_search)
		}
	}

	function redirectSearx(_search) {
		return redirect(searx, _search, '/search')
	}

	function createSearchExp(secondLevelDomain, topLevelDomain = '') {
		return new RegExp(secondLevelDomain + '\\.' + topLevelDomain + '.*\\/search')
	}

	function createSearch(searchQuery, category = DEFAULT_CATEGORY) {
		return `?q=${searchQuery}&categories=${category}`
	}

	function chooseCase(x, obj, defaultValue, isEqualsTo = true) {
		let cases = Object.keys(obj)

		for (let i = 0; i < cases.length; i++) {
			let currentCase = cases[i]
			let currentValue = obj[currentCase]

			if (isEqualsTo) {
				if (x === currentCase) {
					return currentValue
				}
			} else {
				if (x.indexOf(currentCase) > -1) {
					return currentCase
				}
			}
		}

		return defaultValue
	}

	function redirect(domain, _search = search, pathname = location.pathname) {
		if (!_search.startsWith('?')) {
			_search = '?' + _search
		}

		let redirectUrl = HTTPS + domain + pathname + _search

		if (DEBUG_MODE) {
			return console.log(LOGS_TITLE, 'URL:', redirectUrl, 'DOMAIN:', domain, 'SEARCH:', _search, 'PATHNAME:', pathname)
		} else {
			return location.replace(redirectUrl)
		}
	}

	function hostHas(str) {
		return location.host.indexOf(str) != -1
	}
})()