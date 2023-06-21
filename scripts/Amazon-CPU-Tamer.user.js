// ==UserScript==
// @name          Amazon: CPU Tamer
// @namespace     knoa.jp
// @description   It reduces CPU usage on Amazon shopping pages. Enjoy your snappy shopping.
// @version       1.4.4
// @match         https://www.amazon.com/*
// @match         https://www.amazon.co.jp/*
// @match         https://www.amazon.co.uk/*
// @match         https://www.amazon.es/*
// @match         https://www.amazon.fr/*
// @match         https://www.amazon.de/*
// @match         https://www.amazon.it/*
// @match         https://www.amazon.*
// @match         https://*.amazon.com/*
// @exclude       */cart/*
// @exclude       */buy/*
// @grant         none
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @antifeature   referral-link This script may add an associate ID to visited Amazon URLs. It doesn't replace any existed ID. Thank you.
// ==/UserScript==

/*
[update]
Update @antifeature descriptions. Minor fix.

[memo]
top:
	interval Since it is also used for interaction elements, it is forced to run in one instance and execute every 125ms for the front tab.
		While making it more loose, click or  keydown There is a way to increase the frequency only at the time, but on the front tab 1-2% Then it would be forgiven.
		Loose interval The only problem that can be grasped is the switching display of the detailed image, so there is a way to do it yourself.
	timeout  Since there is no constant interaction, it may be executed as it is.
iframe(ad):
	interval Since it is only at the time of initialization, it may be executed as it is.
	timeout  Permanent 100ms but iframe Since it is one by one, it is frequent every second.
iframe(cloudfront.net ad)
	Tampermonkey does not work because it is generated after the local source IFRAME.
	You can remove ads, but this is not the role of this script.
*/

(function () {
	const SCRIPTID = 'AmazonCpuTamer'
	console.log(SCRIPTID, location.href)
	const BUNDLEDINTERVAL = 125/* the bundled interval */
	const BACKGROUNDINTERVAL = 60 * 1000/* take even longer interval on hidden tab */
	const IFRAMETIMEOUT = 1 * 1000/* amazon uses timeouts instead of intervals on iframes */
	/*
		[interval]
		tame quick intervals
	*/
	if (window === top) {
		/* integrate each of intervals */
		const bundle = {}/* {0: {f, interval, lastExecution}} */
		let index = 0/* use it instead of interval id */
		let lastExecution = 0
		/* bundle intervals */
		const originalSetInterval = window.setInterval.bind(window)
		window.setInterval = function (f, interval, ...args) {
			//console.log(SCRIPTID, 'original interval:', interval, location.href);
			bundle[index] = {
				f: f.bind(null, ...args),
				interval: interval,
				lastExecution: 0,
			}
			return index++
		}
		window.clearInterval = function (id) {
			//console.log(SCRIPTID, 'clearInterval:', id, location.href);
			delete bundle[id]
		}
		/* execute bundled intervals */
		/* a bunch of intervals does cost so much even if the processes do nothing */
		originalSetInterval(function () {
			const now = Date.now()
			if (document.hidden && now < lastExecution + BACKGROUNDINTERVAL) return
			Object.keys(bundle).forEach(id => {
				const item = bundle[id]
				if (item === undefined) return/* it could be occur on tiny deletion chance */
				if (now < item.lastExecution + item.interval) return/* not yet */
				item.f()
				item.lastExecution = now
			})
			lastExecution = now
		}, BUNDLEDINTERVAL)
	}
	/*
		[timeout]
		tame quick timeouts on iframe ads
	*/
	if (window !== top) {
		const originalSetTimeout = window.setTimeout.bind(window)
		window.setTimeout = function (f, timeout, ...args) {
			if (document.hidden) return
			if (timeout < IFRAMETIMEOUT) {
				//console.log(SCRIPTID, 'timeout:', timeout, 'to', IFRAMETIMEOUT, location.href);
				timeout = IFRAMETIMEOUT
			}
			return originalSetTimeout(f, timeout, ...args)
		}
	}
	/*
		[associate]
		add an associate tag
	*/
	if (window === top) {
		const IDS = {
			'www.amazon.com': 'knoa-20',
			'www.amazon.co.jp': 'knoa-22',
			'www.amazon.co.uk': 'knoa01-21',
			'www.amazon.es': 'knoa0c-21',
			'www.amazon.fr': 'knoa09-21',
			'www.amazon.de': 'knoa03-21',
			'www.amazon.it': 'knoa0a-21',
		}
		if (IDS[location.host]) {
			addTag(IDS[location.host])
		}
		function addTag(tag) {
			const url = new URL(location.href)
			if (url.searchParams.get('tag') !== null) return/* do not overwrite */
			console.log(SCRIPTID, 'associate tag:', tag)
			document.documentElement.addEventListener('mousedown', function (e) {
				for (let target = e.target; target; target = target.parentNode) {
					if (target.href && target.href.startsWith(location.origin) && !target.getAttribute('href').startsWith('#')) {
						const separator = (target.href.includes('?')) ? '&' : '?'
						target.href = target.href.replace(/(?=#)|$/, separator + 'tag=' + tag)
					}
				}
			})
			const separator = (url.search === '') ? '?' : '&'
			history.replaceState(null, document.title, location.href.replace(/(?=#)|$/, separator + 'tag=' + tag))
		}
	}
})()