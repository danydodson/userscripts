// ==UserScript==
// @name         Cleaner: Adblock Blocker
// @namespace   https://egore.url.lol/userscripts
// @version      2.73
// @description  You know those annoying content blockers that demand you remove your AdBlock so you can read the content? This script removes them by force. Please note, this is not automatically universal like AdBlock Plus. It operates on a per-site basis that the author must add.
// @author       Kxmode
// @run-at       document-idle
// @license		   Creative Commons, Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
// @match        *://*.businessinsider.com/*
// @match        *://*.cnbc.com/*
// @match        *://*.cnn.com/*
// @match        *://*.commonsensemedia.org/*
// @match        *://*.curbed.com/*
// @match        *://*.dailymail.co.uk/*
// @match        *://*.eurogamer.net/*
// @match        *://*.fastcompany.com/*
// @match        *://*.forbes.com/*
// @match        *://*.fortune.com/*
// @match        *://*.foxbusiness.com/*
// @match        *://*.foxnews.com/*
// @match        *://freecoursesonline.me/*
// @match        *://*.gamesradar.com/*
// @match        *://gamerant.com/*
// @match        *://*.theguardian.com/*
// @match        *://*.houstonchronicle.com/*
// @match        *://*.inc.com/*
// @match        *://*.inquirer.com/*
// @match        *://*.insider.com/*
// @match        *://*.kbb.com/*
// @match        *://*.latimes.com/*
// @match        *://*.makeuseof.com/*
// @match        *://markets.businessinsider.com/*
// @match        *://www.medpagetoday.com/*
// @match        *://www.mercurynews.com/*
// @match        *://metro.co.uk/*
// @match        *://www.miamiherald.com/*
// @match        *://*.nationalgeographic.com/*
// @match        *://*.nbcnews.com/*
// @match        *://*.nymag.com/*
// @match        *://*.nytimes.com/*
// @match        *://*.reuters.com/*
// @match        *://*.rottentomatoes.com/*
// @match        *://*.sfchronicle.com/*
// @match        *://*.sfgate.com/*
// @match        *://*.thecut.com/*
// @match        *://*.thedailybeast.com/*
// @match        *://*.vg247.com/*
// @match        *://*.vulture.com/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.wired.com/*
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint-disable */

DocumentReady(ExecuteScript)

function DocumentReady(func) {
	if (document.readyState !== 'loading') ExecuteScript()
	else document.addEventListener('DOMContentLoaded', func)
}

// The main script
function ExecuteScript() {

	// 1. INITIALIZERS
	let currentStatus1, currentStatus2, currentStatus3, currentStatus4,
		currentStatus5, currentStatus6, currentStatus7, currentStatus8,
		currentStatus9, currentStatus10
	let okayToProcess = true, isLooped = false, deleteIframes = true

	const URL_HOSTNAME = window.location.hostname

	const BLOCKER_DOMAINS = [
		{
			// For domains that uses a specific service blocking AdBlockers
			domains: ['www.cnn.com',
				'www.gamesradar.com',
				'www.vg247.com']
		},
		{
			// For domains that follow a nonstandard or custom way of blocking AdBlockers
			domains: ['www.businessinsider.com',
				'www.cnbc.com',
				'www.commonsensemedia.org',
				'cooking.nytimes.com',
				'www.curbed.com',
				'www.dailymail.co.uk',
				'editorial.rottentomatoes.com',
				'www.eurogamer.net',
				'www.fastcompany.com',
				'www.forbes.com',
				'fortune.com',
				'www.foxbusiness.com',
				'www.foxnews.com',
				'freecoursesonline.me',
				'www.fresnobee.com',
				'gamerant.com',
				'www.houstonchronicle.com',
				'www.inc.com',
				'www.inquirer.com',
				'www.insider.com',
				'www.kbb.com',
				'www.latimes.com',
				'www.makeuseof.com',
				'markets.businessinsider.com',
				'www.medpagetoday.com',
				'www.mercurynews.com',
				'metro.co.uk',
				'www.miamiherald.com',
				'www.nationalgeographic.com',
				'www.nbcnews.com',
				'www.newyorker.com',
				'nymag.com',
				'www.nytimes.com',
				'www.reuters.com',
				'www.rottentomatoes.com',
				'www.seekingalpha.com',
				'www.sfchronicle.com',
				'www.sfgate.com',
				'www.thecut.com',
				'www.thedailybeast.com',
				'www.theguardian.com',
				'www.usatoday.com',
				'www.vulture.com',
				'www.washingtonpost.com',
				'www.wired.com']
		},
		{
			// For domains that typically launch third-party modals for random stuff like sign-ups
			domains: ['www.gamesradar.com']
		}
	]
	const [STANDARD_DOMAINS, ABNORMAL_DOMAINS, AUXILIARY_DOMAINS] = BLOCKER_DOMAINS.map(({ domains }) => domains)

	const DOMAIN = {
		BusinessInsider: ABNORMAL_DOMAINS[0],
		CNBC: ABNORMAL_DOMAINS[1],
		CNN: STANDARD_DOMAINS[0],
		CommonSenseMedia: ABNORMAL_DOMAINS[2],
		NewYorkTimesCooking: ABNORMAL_DOMAINS[3],
		Curbed: ABNORMAL_DOMAINS[4],
		DailyMail: ABNORMAL_DOMAINS[5],
		RottenTomatoesEditorial: ABNORMAL_DOMAINS[6],
		EuroGamer: ABNORMAL_DOMAINS[7],
		FastCompany: ABNORMAL_DOMAINS[8],
		Forbes: ABNORMAL_DOMAINS[9],
		Fortune: ABNORMAL_DOMAINS[10],
		FoxBusiness: ABNORMAL_DOMAINS[11],
		FoxNews: ABNORMAL_DOMAINS[12],
		FreeCoursesOnline: ABNORMAL_DOMAINS[13],
		FresnoBee: ABNORMAL_DOMAINS[14],
		GameRant: ABNORMAL_DOMAINS[15],
		GamesRadar: STANDARD_DOMAINS[1],
		GamesRadarAuxiliary: AUXILIARY_DOMAINS[0],
		HoustonChronicle: ABNORMAL_DOMAINS[16],
		Inc: ABNORMAL_DOMAINS[17],
		Inquirer: ABNORMAL_DOMAINS[18],
		Insider: ABNORMAL_DOMAINS[19],
		KelleyBlueBook: ABNORMAL_DOMAINS[20],
		LATimes: ABNORMAL_DOMAINS[21],
		MakeUseOf: ABNORMAL_DOMAINS[22],
		BusinessInsiderMarkets: ABNORMAL_DOMAINS[23],
		MedPageToday: ABNORMAL_DOMAINS[24],
		MercuryNews: ABNORMAL_DOMAINS[25],
		MetroUK: ABNORMAL_DOMAINS[26],
		MiamiHerald: ABNORMAL_DOMAINS[27],
		NationalGeographic: ABNORMAL_DOMAINS[28],
		NBCNews: ABNORMAL_DOMAINS[29],
		NewYorker: ABNORMAL_DOMAINS[30],
		NYMag: ABNORMAL_DOMAINS[31],
		NewYorkTimes: ABNORMAL_DOMAINS[32],
		Reuters: ABNORMAL_DOMAINS[33],
		RottenTomatoes: ABNORMAL_DOMAINS[34],
		SeekingAlpha: ABNORMAL_DOMAINS[35],
		SFChronicle: ABNORMAL_DOMAINS[36],
		SFGate: ABNORMAL_DOMAINS[37],
		TheCut: ABNORMAL_DOMAINS[38],
		TheDailyBeast: ABNORMAL_DOMAINS[39],
		TheGuardian: ABNORMAL_DOMAINS[40],
		USAToday: ABNORMAL_DOMAINS[41],
		VG247: STANDARD_DOMAINS[2],
		Vulture: ABNORMAL_DOMAINS[42],
		WashingtonPost: ABNORMAL_DOMAINS[43],
		Wired: ABNORMAL_DOMAINS[44],
	}

	// 2. GENERAL FUNCTIONS
	function SpecialNinjaJavaScriptKiller() {
		const CAN_PROCEED = URL_HOSTNAME === DOMAIN.TheCut || URL_HOSTNAME === DOMAIN.Forbes || URL_HOSTNAME === DOMAIN.FreeCoursesOnline ||
			URL_HOSTNAME === DOMAIN.TheGuardian || URL_HOSTNAME === DOMAIN.Inquirer || URL_HOSTNAME === DOMAIN.MedPageToday ||
			URL_HOSTNAME === DOMAIN.MercuryNews || URL_HOSTNAME === DOMAIN.Reuters || URL_HOSTNAME === DOMAIN.SFChronicle ||
			URL_HOSTNAME === DOMAIN.WashingtonPost || URL_HOSTNAME === DOMAIN.Vulture

		if (!CAN_PROCEED) return false

		switch (URL_HOSTNAME) {
			case DOMAIN.TheCut: TheCut(); break
			case DOMAIN.Forbes: Forbes(); break
			case DOMAIN.FreeCoursesOnline: FreeCoursesOnline(); break
			case DOMAIN.TheGuardian: TheGuardian(isLooped); deleteIframes = false; break
			case DOMAIN.Inquirer: Inquirer(isLooped); break
			case DOMAIN.MedPageToday: MedPageToday(); break
			case DOMAIN.MercuryNews: MercuryNews(isLooped); break
			case DOMAIN.Reuters: Reuters(); break
			case DOMAIN.SFChronicle: SFChronicle(); break
			case DOMAIN.WashingtonPost: WashingtonPost(isLooped); break
			case DOMAIN.Vulture: Vulture(); break
		}

		const PROCESSING_MESSAGE = 'The Assassinate Ad Block Blockers script is doing its jobs. Please wait a few seconds. 🚦'
		if (URL_HOSTNAME === DOMAIN.TheGuardian)
			StartingRemovalMessage(PROCESSING_MESSAGE, 300)
		else
			StartingRemovalMessage(PROCESSING_MESSAGE)

		CommonRemovalItems(deleteIframes)
		RemoveHtmlComments()
		document.querySelector('#Injected-By-Assassinate-Ad-Block-Blockers').remove()
		document.querySelectorAll('.fancybox-overlay').forEach(function (element) { element.remove() })

		if (URL_HOSTNAME === DOMAIN.TheGuardian)
			SuccessRemovalMessage(300)
		else
			SuccessRemovalMessage()
	}
	SpecialNinjaJavaScriptKiller() // run this asap
	function BreakJavaScript() {
		console.log('%c 👍 Assassinate Ad Block Blockers — The following is not an error. Simply a way to abort JavaScript execution on this webpage.', 'background: #0b801d; color: #fff;')
		throw new Error('JavaScript purposely broken by Assassinate Ad Block Blockers')
	}
	function ClearCookies() {
		document.cookie.split(';').forEach(cookie => {
			const NAME = cookie.split('=')[0].trim()
			const DOMAIN = location.hostname.split(/\.(?=[^\.]+\.)/).slice(1).join('.')
			document.cookie = `${NAME}=;max-age=0;path=/;domain=${DOMAIN}`
		})
	}
	function CommonRemovalItems(removeIframe = true) {
		//primary
		document.querySelectorAll('script').forEach(function (element) { element.remove() })
		document.querySelectorAll('noscript').forEach(function (element) { element.remove() })
		if (removeIframe) document.querySelectorAll('iframe').forEach(function (element) { element.remove() })
		document.querySelectorAll('[as="script"]').forEach(function (element) { element.remove() })

		//secondary
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')
	}
	function OkayToUseSledgeHammerRemoval() {
		return (URL_HOSTNAME === DOMAIN.TheDailyBeast ||
			URL_HOSTNAME === DOMAIN.Forbes ||
			URL_HOSTNAME === DOMAIN.HoustonChronicle ||
			URL_HOSTNAME === DOMAIN.Inquirer ||
			URL_HOSTNAME === DOMAIN.KelleyBlueBook ||
			URL_HOSTNAME === DOMAIN.MedPageToday ||
			URL_HOSTNAME === DOMAIN.NationalGeographic ||
			URL_HOSTNAME === DOMAIN.SFChronicle) ? true : false
	}
	function RemoveHtmlComments() {
		let children = document.body.childNodes
		for (let child in children) {
			if (children[child].nodeType === Node.COMMENT_NODE) children[child].remove()
		}
	}
	function StandardRemoval() {
		const IS_HTML_BLOCKED = document.querySelector('html').getAttribute('style')
		const IS_BODY_BLOCKED = document.body.getAttribute('style')
		const IS_HTML_CLASS_BLOCKED = document.querySelector('html').classList.contains('sp-message-open')

		if (IS_HTML_BLOCKED !== undefined || IS_BODY_BLOCKED !== undefined || IS_HTML_CLASS_BLOCKED) {
			clearInterval(currentStatus1)

			document.querySelector('html').removeAttribute('style')
			document.body.removeAttribute('style')
			document.querySelector('html').classList.remove('sp-message-open')

			switch (URL_HOSTNAME) {
				case DOMAIN.VG247:
					document.querySelectorAll('[class*="sp_veil"]').forEach(function (element) { element.remove() })
					document.querySelectorAll('[id*="sp_message_id"]').forEach(function (element) { element.remove() })
					break
			}
		}

		console.clear()
	}
	function StartingRemovalMessage(message, top = 220) {
		document.body.prepend(Object.assign(document.createElement('div'), {
			id: "Injected-By-Assassinate-Ad-Block-Blockers",
			style: `background-color: #D8070E; font-weight: bold; color: white; text-align: center; margin: auto; padding: 10px; position: relative; z-index: 9999999999 !important; top: ${top}px;`
		}))

		const INJECTOR_DIV = document.querySelector('#Injected-By-Assassinate-Ad-Block-Blockers')

		const STYLE = document.createElement('style')
		STYLE.innerText = '#Injected-By-Assassinate-Ad-Block-Blockers img { width: unset; }'
		INJECTOR_DIV.appendChild(STYLE)

		INJECTOR_DIV.append(Object.assign(document.createElement('img'), {
			src: "https://i.imgur.com/velCxDX.gif",
			style: "display: inline-block; vertical-align: middle; padding-right: 10px;"
		}))

		const SPAN = document.createElement('span')
		SPAN.innerText = message
		INJECTOR_DIV.appendChild(SPAN)
	}
	function SuccessRemovalMessage(top = 220) {
		if (document.querySelector('#Injected-By-Assassinate-Ad-Block-Blockers') !== null) {
			const INJECTOR_DIV = document.querySelector('#Injected-By-Assassinate-Ad-Block-Blockers')
			INJECTOR_DIV.querySelector('img').src = 'https://i.imgur.com/i5e5xp0.gif'
			INJECTOR_DIV.querySelector('span').innerText = 'Success 😎. Enjoy! You can start scrolling now...'
			INJECTOR_DIV.style = `background-color: green; font-weight: bold; color: white; text-align: center; margin: auto; padding: 10px; position: relative; z-index: 9999999999 !important; transition: .5s; top: ${top}px;`
		}
	}
	function TPRemoval() {
		// a common blocker on a few sites
		document.body.classList.remove('js-dialog-open')
		document.body.classList.remove('tp-modal-open')

		document.querySelectorAll('.tp-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop').forEach(function (element) { element.remove() })
		document.querySelectorAll('.dialog-base').forEach(function (element) { element.remove() })
		document.querySelectorAll('#view-offer').forEach(function (element) { element.remove() })
	}


	// 3. SITE SPECIFIC DIRECTIVES
	function BusinessInsider() {
		TPRemoval()
	}
	function CNBC(isLooped) {
		CommonRemovalItems(deleteIframes)

		document.querySelectorAll('#checkout-container').forEach(function (element) { element.remove() })
		document.querySelectorAll('.ArticleGate-proGate').forEach(function (element) { element.remove() })

		const SELECTOR = [...document.querySelectorAll('h3')].filter(element => element.textContent.includes('using an adblocker'))
		if (SELECTOR.length > 0) SELECTOR[0].parentNode.parentNode.parentNode.parentNode.remove()

		if (typeof isLooped !== 'undefined') {
			if (!isLooped && document.querySelector('.ArticleBody-extraData') !== null) {
				let element = document.querySelector('.ArticleBody-extraData')
				element = element.querySelector('[class*="-data"]')
				const CONTENT_ARRAY = element.textContent.split(' ')
				const PARAGRAPH_WORD_COUNT = 100

				const PARENT_ELEMENT = []
				while ((element = element.parentNode) && element !== document) {
					if (element.matches('.ArticleBody-articleBody')) {
						PARENT_ELEMENT.push(element)
						break
					}
				}

				let articleContent = '', index = 0

				for (let word of CONTENT_ARRAY) {
					articleContent += `${word} `
					if (index === PARAGRAPH_WORD_COUNT) {
						articleContent += '<br/><br/>'
						index = 0
					}
					index++
				}

				const CONTENT_ELEMENT = document.createElement('div')
				CONTENT_ELEMENT.setAttribute('style', 'line-height: 1.6em;')
				CONTENT_ELEMENT.innerHTML = articleContent
				PARENT_ELEMENT[0].appendChild(CONTENT_ELEMENT)

				document.querySelectorAll('.group').forEach(function (element) { element.remove() })
			}
		}
	}
	function CNN() {
		document.querySelectorAll('.ad-slot-header').forEach(function (element) { element.remove() })
		document.querySelectorAll('#ad-feedback__modal-overlay').forEach(function (element) { element.remove() })
	}
	function CommonSenseMedia() {
		document.querySelector('body').classList.remove('csm-premium-gated')
		const MEMBER_GATE = document.querySelector('#user-plus-gate')
		if (MEMBER_GATE !== null) document.querySelector('#user-plus-gate').remove()
	}
	function Curbed() {
		document.querySelector('html').setAttribute('style', 'overflow-y: unset;')
		document.body.setAttribute('style', 'position: unset; width: 1100px; margin: 0 auto;')
		document.querySelectorAll('.article .article-header, .article .article-header.inline').forEach(function (element) { element.setAttribute('style', 'margin: unset;') })
		document.querySelectorAll('.article .lede-image-wrapper.inline.horizontal').forEach(function (element) { element.setAttribute('style', 'margin: unset;') })
		document.querySelectorAll('#paywall-reader-interface').forEach(function (element) { element.remove() })
		document.querySelectorAll('#cliff-takeover').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tertiary').forEach(function (element) { element.removeAttribute('style') })
	}
	function TheCut() {
		CommonRemovalItems(deleteIframes)
		document.querySelectorAll('#paywall-reader-interface').forEach(function (element) { element.remove() })
		document.querySelectorAll('#cliff-takeover').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tertiary').forEach(function (element) { element.removeAttribute('style') })
	}
	function TheDailyBeast() {
		document.querySelectorAll('.DEPRECATEDAdSlot').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop').forEach(function (element) { element.remove() })
		document.body.classList.remove('tp-modal-open')
		document.querySelectorAll('[id*="offer-0-"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[displayname*="PianoTag"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[src*="tinypass.min.js"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('#piano_bottom_ribbon_wrapper').forEach(function (element) { element.remove() })
		document.querySelectorAll('iframe').forEach(function (element) { element.remove() })
		document.body.removeAttribute('style')
		document.querySelectorAll('#bottom_ribbon_modal_wrapper').forEach(function (element) { element.remove() })
		document.querySelectorAll('.StoryPage.is-locked').forEach(function (element) { element.classList.remove('is-locked') })
		document.querySelectorAll('#bottom_ribbon_modal_expand_wrapper').forEach(function (element) { element.remove() })
		document.querySelectorAll('.PageTopAd').forEach(function (element) { element.remove() })
		document.querySelectorAll('.FooterAd').forEach(function (element) { element.remove() })
		document.querySelectorAll('#Injected-By-Assassinate-Ad-Block-Blockers').forEach(function (element) { element.remove() })
		document.querySelectorAll('.ExtraSidebarAd').forEach(function (element) { element.remove() })
		document.querySelectorAll('.AdSlot').forEach(function (element) { element.remove() })
		document.querySelectorAll('.SimpleAd').forEach(function (element) { element.remove() })
		document.querySelectorAll('[style="margin:40px 0;min-height:200px"]').forEach(function (element) { element.remove() })

		console.clear()
		console.log('%c 😎 Assassinate Ad Block Blockers — Blocker code removed', 'background: #0b801d; color: #fff;')
	}
	function DailyMail() {
		CommonRemovalItems(deleteIframes)
		document.querySelectorAll('#chromelessPlayer').forEach(function (element) { element.remove() })
		document.querySelectorAll('.billboard-container.watermark').forEach(function (element) { element.remove() })
		document.querySelectorAll('#chromelessPlayer').forEach(function (element) { element.remove() })
		document.querySelectorAll('.adHolder.watermark').forEach(function (element) { element.remove() })
		document.querySelectorAll('.mpu_puff_wrapper.watermark').forEach(function (element) { element.remove() })
	}
	function EuroGamer() {
		document.querySelectorAll('html').forEach(function (element) { element.removeAttribute('style'); element.classList.remove('sp-message-open') })
		document.body.removeAttribute('style')
		document.querySelectorAll('[class*="sp_veil"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[id*="sp_message_id"]').forEach(function (element) { element.remove() })
	}
	function FastCompany() {
		if (document.location.pathname !== '/') document.querySelectorAll('#checkout-container').forEach(function (element) { element.remove() })
	}
	function Forbes() {
		document.querySelectorAll('.top-ad-container').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop.tp-active').forEach(function (element) { element.remove() })
		document.body.removeAttribute('class')
		document.querySelectorAll('.page-loaded').forEach(function (element) { element.remove() })
		document.querySelectorAll('.article-fixed[_nghost-c11]').forEach(function (element) { element.setAttribute('style', 'position: unset;') })

		// abnormal situation. these appear on certain pages.
		document.querySelectorAll('#lightboxjs-lightboxlib').forEach(function (element) { element.remove() })
		document.querySelectorAll('#aax_prefetch_frame').forEach(function (element) { element.remove() })
		document.querySelectorAll('#cok_aax').forEach(function (element) { element.remove() })
		document.querySelectorAll('iframe').forEach(function (element) { element.remove() })
		document.querySelectorAll('.fbs-auth__container').forEach(function (element) { element.remove() })
		document.querySelectorAll('.fbs-ad--ntv-contentd-wrapper').forEach(function (element) { element.remove() })
		document.querySelectorAll('.body--no-scroll').forEach(function (element) { element.remove() })
		document.querySelectorAll('.checkout-container').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop').forEach(function (element) { element.remove() })
		document.querySelectorAll('fbs-ad').forEach(function (element) { element.remove() })
		document.querySelectorAll('#view-offer').forEach(function (element) { element.remove() })
		document.querySelectorAll('.vestpocket').forEach(function (element) { element.remove() })
		document.querySelectorAll('script').forEach(function (element) {
			let selector = element.getAttribute('src')
			if (selector !== null) // ignore inline scripts
				if (String(selector).match(/(paywall)+.(unlock-protocol)+./g) !== null) element.remove()  // the script is found and removed so that it can't re-inject itself
		})
		document.querySelectorAll('#article-container-0').forEach(function (element) { element.setAttribute('style', 'position: unset;') })
	}
	function Fortune() {
		if (document.querySelector('[id*="Leaderboard"]') !== null) document.querySelector('[id*="Leaderboard"]').parentNode.remove()
		document.querySelectorAll('.paywall-selector').forEach(function (element) { element.remove() })
		document.querySelectorAll('[class*="paywall"]').forEach(function (element) { element.setAttribute('style', '') })

		document.querySelectorAll('[class*="articleBody__wrapper-"]').forEach(function (element) {
			element.querySelectorAll('div').forEach(function (innerElement) {
				const ATTR = innerElement.getAttribute('style')
				if (typeof ATTR != 'undefined' && ATTR !== false && ATTR.includes('grayscale(0.5) blur'))
					innerElement.setAttribute('style', '')
			})
		})

		document.querySelectorAll('.paywall.paywallActive').forEach(function (element) { element.setAttribute('style', 'filter: unset; z-index: unset; pointer-events: unset; user-select: unset;') })
	}
	function FoxBusiness() {
		document.body.removeAttribute('style')
		document.querySelectorAll('.fc-ab-root').forEach(function (element) { element.remove() })

		const ELEMENTS = document.querySelectorAll('div')
		const ELEMENTS_TO_REMOVE = [...ELEMENTS].filter(element => element.textContent.includes('Disable any ad or script blocking software'))

		for (const element of ELEMENTS_TO_REMOVE) element.remove()
	}
	function FoxNews() {
		document.body.removeAttribute('style')
		document.querySelectorAll('.fc-ab-root').forEach(function (element) { element.remove() })
	}
	function FreeCoursesOnline() {
		document.querySelectorAll('img').forEach(function (element) {
			if (element.getAttribute('src').includes('data:image/png;base64,')) {
				element.parentNode.parentNode.remove()
				element.remove()
			}
		})
		document.querySelectorAll('kbd').forEach(function (element) { element.remove() })
		document.querySelectorAll('div').forEach(function (element) { if (element.textContent.includes('Blocked because of Ad Blocker')) element.remove() })
		document.querySelectorAll('.obfuscator').forEach(function (element) { element.remove() })
		document.querySelectorAll('[style*="cursor: no-drop;"]').forEach(function (element) { element.remove() })
	}
	function GamesRadar(interval) {
		if (document.querySelector('.fc-ab-root') !== null)
			if (document.querySelector('.fc-ab-root').style.visibility === 'visible')
				document.querySelectorAll('.raleigh-optin-visible').forEach(function (element) { element.remove() })

		if (typeof interval !== 'undefined')
			clearInterval(interval)
		else
			clearAllIntervals()
	}
	function GameRant() {
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')

		const SELECTOR = [...document.querySelectorAll('h3')].filter(element => element.textContent.includes('using an adblocker'))
		if (SELECTOR.length > 0) SELECTOR[0].parentNode.parentNode.parentNode.parentNode.remove()

		document.querySelectorAll('.adsninja-ad-zone').forEach(function (element) { element.remove() })
	}
	function TheGuardian(isLooped) {
		CommonRemovalItems(deleteIframes)

		document.body.setAttribute('class', '')
		document.querySelectorAll('.modal-scrollable').forEach(function (element) { element.remove() })
		document.querySelectorAll('.connext-modal-backdrop.fade').forEach(function (element) { element.remove() })
		document.querySelectorAll('#sign-in-gate').forEach(function (element) { element.remove() })
		const BANNER_HEADER = document.querySelector('.top-banner-ad-container'); if (BANNER_HEADER !== null) BANNER_HEADER.parentNode.parentNode.parentNode.parentNode.parentNode.remove()

		const ARTICLE = document.querySelector('[data-layout="StandardLayout"] article') || document.querySelector('[data-layout="ImmersiveLayout"] article') || document.querySelector('[data-layout="ShowcaseLayout"] article')

		if (typeof isLooped !== 'undefined') {
			if (!isLooped && ARTICLE !== null && document.querySelector('#article-cloned') === null) {
				// clone the article
				const CLONED_CONTENT = ARTICLE.cloneNode(true)
				CLONED_CONTENT.id = 'article-cloned'
				document.querySelector('main').prepend(CLONED_CONTENT)

				// remove duplicate
				document.querySelectorAll('article').forEach(function (element) { if (element.getAttribute('id') === null) element.remove() })

				// clean up
				document.querySelectorAll('.top-banner-ad-container').forEach(function (element) {
					while ((element = element.parentNode) && element !== document) {
						if (element.matches('[class*="dcr-"]')) {
							element.remove()
						}
					}
				})

				// video fix
				const ELEMENT = document.querySelector('button[data-testid]')
				if (ELEMENT !== null) {
					const YOUTUBE_ID = ELEMENT.getAttribute('data-cy').split('-')[2]
					const YOUTUBE_LABEL = ELEMENT.getAttribute('aria-label')

					document.querySelector('[data-gu-name="media"] > div').remove()

					const MEDIA_WRAPPER = document.querySelector('[data-gu-name="media"]')
					MEDIA_WRAPPER.setAttribute('style', 'padding-bottom: 20px;')

					const YOUTUBE_WRAPPER = document.createElement('div')

					const YOUTUBE_IFRAME = document.createElement('iframe')
					YOUTUBE_IFRAME.setAttribute('width', '620')
					YOUTUBE_IFRAME.setAttribute('height', '349')
					YOUTUBE_IFRAME.setAttribute('src', `https://www.youtube.com/embed/${YOUTUBE_ID}`)
					YOUTUBE_IFRAME.setAttribute('title', YOUTUBE_LABEL)
					YOUTUBE_IFRAME.setAttribute('frameborder', 0)
					YOUTUBE_IFRAME.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
					YOUTUBE_IFRAME.setAttribute('allowfullscreen', '')

					YOUTUBE_WRAPPER.append(YOUTUBE_IFRAME)
					MEDIA_WRAPPER.append(YOUTUBE_WRAPPER)
				}

			}
		}
	}
	function HoustonChronicle() {
		CommonRemovalItems(deleteIframes)
		document.querySelectorAll('.fancybox-overlay').forEach(function (element) { element.remove() })
		document.querySelectorAll('.fancybox-lock').forEach(function (element) { element.classList.remove('fancybox-lock') })
		document.querySelectorAll('.bc_header').forEach(function (element) { element.remove() })
		document.querySelectorAll('style:last-child').forEach(function (element) { if (!element.hasAttribute('id')) element.remove() })
	}
	function Inc() {
		TPRemoval()
	}
	function Inquirer(isLooped) {
		// standard stuff
		CommonRemovalItems(deleteIframes)
		document.querySelectorAll('.tp-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop').forEach(function (element) { element.remove() })
		document.body.setAttribute('class', '')
		document.querySelectorAll('.bx-base').forEach(function (element) { element.remove() })

		if (typeof isLooped !== 'undefined') {
			if (!isLooped) {
				let hasHeader = false, hasContent = false, hasFooter = false
				// clone the article
				if (document.querySelector('.layout-ad-wrapper header') !== null) {
					const CLONED_HEADER = document.querySelector('.layout-ad-wrapper header').cloneNode(true)
					CLONED_HEADER.id = 'cloned-header'
					document.querySelector('#fusion-app').append(CLONED_HEADER)
					hasHeader = true
				}

				if (document.querySelector('[id="main"]') !== null) {
					const CLONED_CONTENT = document.querySelector('[id="main"]').cloneNode(true)
					document.querySelector('#fusion-app').append(CLONED_CONTENT)
					hasContent = true
				}

				if (document.querySelector('.layout-ad-wrapper footer') !== null) {
					const CLONED_FOOTER = document.querySelector('.layout-ad-wrapper footer').cloneNode(true)
					CLONED_FOOTER.id = 'cloned-footer'
					document.querySelector('#fusion-app').append(CLONED_FOOTER)
					hasFooter = true
				}

				if (hasHeader || hasContent || hasFooter) {
					// rename classes and ids to escape site's removal logic
					document.querySelector('#fusion-app div:first-of-type').remove()
					document.querySelectorAll('.inq-story').forEach(function (element) { element.classList.remove(inq - story); element.classList.add('inq-story-cloned') })
					document.querySelectorAll('#article-body').forEach(function (element) { element.removeAttribute('id'); element.setAttribute('id', 'article-body-cloned') })
					document.querySelectorAll('.inq-p').forEach(function (element) { element.classList.remove('inq-p'); element.classList.add('inq-cloned') })

					// polish and clean-up
					const CSS_STYLE = document.createElement('style')
					CSS_STYLE.innerHTML = `#article-body-cloned			{ font: 500 1.25rem/2rem Inquirer Text WEB,Times,serif; }
											.inq-image.hidden-inq-image 	{ visibility: visible; }
											.type-interstitial.inq-cloned	{ margin: 40px 0; }
											.inq-image--wrapper				{ margin-top: 20px; }
											.inq-cloned						{ padding: 0 0 15px 0; }`
					document.querySelector('#fusion-app').appendChild(CSS_STYLE)
				}
			}
		}
	}
	function Insider() {
		document.querySelectorAll('.tp-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tp-backdrop.tp-active').forEach(function (element) { element.remove() })
		document.body.removeAttribute('class')
	}
	function KelleyBlueBook() {
		document.querySelector('#WhitelistOverlayModalBackground').remove()
		document.querySelector('html').removeAttribute('class')
	}
	function LATimes() {
		document.querySelector('html').setAttribute('style', 'overflow: unset;')
		document.body.removeAttribute('style')
		document.querySelectorAll('.Page-body').forEach(function (element) { element.removeAttribute('style') })
		document.querySelectorAll('.fc-ab-root').forEach(function (element) { element.remove() })
		document.querySelectorAll('.meter-modal').forEach(function (element) { element.parentNode.remove() })
		document.querySelectorAll('metering-modal').forEach(function (element) { element.remove() })
		document.querySelectorAll('modality-custom-element').forEach(function (element) { element.remove() })
		const MESSAGE_BLOCK = document.querySelector('iframe[name="googlefcPresent"]')
		if (MESSAGE_BLOCK !== null) MESSAGE_BLOCK.nextElementSibling.nextElementSibling.remove()
	}
	function MakeUseOf() {
		document.querySelectorAll('[class*="unblockplease-overlay"]').forEach(function (element) { element.removeAttribute('style') })
		document.querySelectorAll('.unblockplease').forEach(function (element) { element.removeAttribute('style') })
		document.querySelectorAll('.adsninja-ad-zone').forEach(function (element) { element.remove() })
	}
	function MedPageToday() {
		CommonRemovalItems(deleteIframes)
		document.body.setAttribute('class', '')
		document.querySelectorAll('.mpt-registration-html').forEach(function (element) { element.remove() })
		const SITE_WRAPPER = document.querySelector('#siteWrapper')
		SITE_WRAPPER.removeAttribute('style')
		SITE_WRAPPER.setAttribute('style', 'margin-top: 40px;')
		document.querySelectorAll('.recirc-item__img-container').forEach(function (element) { element.setAttribute('style', 'margin-right: 20px;') })
		document.querySelectorAll('.leaderboard-region').forEach(function (element) { element.remove() })
	}
	function MercuryNews(isLooped) {
		CommonRemovalItems(deleteIframes)

		document.body.setAttribute('class', '')
		document.querySelectorAll('.modal-scrollable').forEach(function (element) { element.remove() })
		document.querySelectorAll('.connext-modal-backdrop.fade').forEach(function (element) { element.remove() })

		if (typeof isLooped !== 'undefined') {
			if (!isLooped && document.querySelector('[id="main"]') !== null) {
				// clone the article
				const CLONED_CONTENT = document.querySelector('[id="main"]').cloneNode(true)
				CLONED_CONTENT.id = 'main-cloned'
				document.querySelector('#primary').append(CLONED_CONTENT)

				// rename classes and ids to escape site's removal logic
				const MAIN_ELEMENT = document.querySelector('#primary > main'); if (MAIN_ELEMENT !== null) MAIN_ELEMENT.remove()
				const MAIN_CLONE_ELEMENT = document.querySelector('#main-cloned'); MAIN_CLONE_ELEMENT.removeAttribute('class'); MAIN_CLONE_ELEMENT.removeAttribute('role')
				const POST_ELEMENT = document.querySelector('[id*="post-"]'); POST_ELEMENT.setAttribute('id', 'coned-post'); POST_ELEMENT.setAttribute('class', 'full-view')
				const ARTICLE_CONTENT = document.querySelector('.article-content'); ARTICLE_CONTENT.setAttribute('class', 'cloned-a-content')
				const ARTICLE_FOOTER = document.querySelector('.article-footer'); ARTICLE_FOOTER.setAttribute('class', 'cloned-a-footer')
				const ARTICLE_CONTENT_WRAPPER = document.querySelector('.article-content-wrapper'); ARTICLE_CONTENT_WRAPPER.setAttribute('class', 'cloned-a-content-wrapper')
				const HEADER_FEATURES = document.querySelector('.header-features.hide'); if (HEADER_FEATURES !== null) HEADER_FEATURES.setAttribute('class', 'cloned-h-features')
				const ARTICLE_BODY = document.querySelector('.article-body'); ARTICLE_BODY.setAttribute('class', 'cloned-a-body')
				const BODY_COPY = document.querySelector('.body-copy'); BODY_COPY.setAttribute('class', 'cloned-b-copy')

				// polish and clean-up
				const CONTENT_ELEMENT = document.createElement('style')
				CONTENT_ELEMENT.innerHTML = `.cloned-e-header			{ border-bottom: 3px solid transparent; display: -webkit-box; display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; float: none; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; margin: 2em 0em -2.25em; padding: 0; position: relative; }
											.cloned-a-content			{ display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; column-gap: 20px; }
											.cloned-a-content-wrapper,
											.cloned-a-body				{ width: 95%; text-align: justify; }
											.cloned-h-features			{ width: 95%; padding: 3em 0em 2em; }
											.cloned-b-body				{ margin-bottom: 0; font: normal 400 1.03125em/1.6363636364 "Droid Sans",Helvetica,sans-serif; letter-spacing: -0.01em; }
											.cloned-b-copy				{ font: normal 400 1em/1.7142857143 Droid Sans,Helvetica,sans-serif; }
											.cloned-b-copy > * 			{ margin-bottom: 1em; }
											.related.left				{ width: 33%; }
											div.dfm-trust-indicators-footer-links { clear: both; }`
				document.querySelector('#primary').prepend(CONTENT_ELEMENT)
			}
		}
	}
	function MetroUK() {
		CommonRemovalItems(deleteIframes)
		document.body.classList.remove('mol-fe-ab-dialog')
		document.querySelectorAll('[class*="mol-ads-"]').forEach(function (element) { element.remove() })
		if (document.querySelector('[id*="mol-ads-"]') !== null) document.querySelector('[id*="mol-ads-"]').remove()
		const BLOCKER_MODAL = document.querySelector('[class*="overlay-34_Kj"]')
		if (BLOCKER_MODAL !== null) BLOCKER_MODAL.parentNode.parentNode.remove()
	}
	function MiamiHerald() {
		CommonRemovalItems()
		const SELECTOR = [...document.querySelectorAll('div')].filter(element => element.textContent.includes('turn off your ad blocking software'))
		if (SELECTOR.length > 0) SELECTOR[0].remove()

		document.querySelectorAll('[id*=VideoAd]').forEach(function (element) { element.remove() })
	}
	function NationalGeographic() {
		document.querySelectorAll('.fancybox-overlay').forEach(function (element) { element.remove() })
		const PAYWALL_METER = document.querySelector('#paywall-meter')
		if (PAYWALL_METER !== null) PAYWALL_METER.remove()
		document.querySelector('html').classList.remove('fancybox-lock')
		document.body.removeAttribute('style')
		document.querySelectorAll('.Modal.PaywallModal').forEach(function (element) { element.remove() })

		const STICKY_FOOTER = document.querySelector('.EmailStickyFooter__Modal')
		if (STICKY_FOOTER !== null) STICKY_FOOTER.parentNode.parentNode.remove()

		const INJECT_MESSAGE = document.querySelector('#Injected-By-Assassinate-Ad-Block-Blockers')
		if (INJECT_MESSAGE !== null) INJECT_MESSAGE.remove()

		console.clear()
		console.log('%c 😎 Assassinate Ad Block Blockers — Blocker code removed', 'background: #0b801d; color: #fff;')
	}
	function NBCNews() {
		document.querySelector('html').setAttribute('style', '')
		document.body.setAttribute('style', '')

		const SELECTOR = [...document.querySelectorAll('h3')].filter(element => element.textContent.includes('Please support our journalism'))
		if (SELECTOR.length > 0) SELECTOR[0].parentNode.parentNode.parentNode.parentNode.remove()
	}
	function NewYorkTimes() {
		// nytimes
		if (window.location.pathname.includes('/slideshow/')) {
			if (okayToProcess) {
				document.querySelectorAll('#gateway-content').forEach(function (element) { element.remove() })
				document.querySelectorAll('div#app > div > div > [class*="css-"]:last-child').forEach(function (element) { element.remove() })
				okayToProcess = false
			}
		} else {
			document.querySelectorAll('#standalone-footer').forEach(function (element) { element.remove() })
			document.querySelectorAll('#gateway-content').forEach(function (element) { element.remove() })
			document.body.setAttribute('style', 'overflow: unset;')
			document.querySelectorAll('#site-content').forEach(function (element) { element.setAttribute('style', 'position: unset;') })
			document.querySelectorAll('[id*="lire-ui-"]').forEach(function (element) { element.remove() })
			document.querySelectorAll('[id*="story-ad-"]').forEach(function (element) { element.remove() })

			// nytimes' cooking
			document.querySelectorAll('[class*="modal_modal-window-container"]').forEach(function (element) { element.parentNode.remove() })
			document.body.setAttribute('class', '')
			document.body.setAttribute('style', '')
			document.querySelectorAll('[class*="mask_no-scroll"]').forEach(function (element) { element.setAttribute('class', '') })
			if (document.querySelector('.nytc---modal-window---windowContainer') !== null) document.querySelector('.nytc---modal-window---windowContainer').parentNode.parentNode.remove() // a modal with no close button? 😕
			document.querySelectorAll('#container').forEach(function (element) { element.setAttribute('style', 'overflow: unset;') })
			document.querySelectorAll('.nytc---modal-window---noScroll').forEach(function (element) { element.setAttribute('style', 'overflow: unset;') })
			document.querySelectorAll('#site-content').forEach(function (element) { element.setAttribute('style', 'overflow: unset;') })
			document.querySelectorAll('[class*="ad-unit"]').forEach(function (element) { element.remove() })

			// nytimes' magazine and site-wide
			document.querySelectorAll('[class*="css-mcm"]').forEach(function (element) { element.setAttribute('style', 'position: unset;') })

			if (window.location.pathname !== '/')
				document.querySelectorAll('div#app > div > div > [class*="css-"]:last-child').forEach(function (element) { element.remove() })
		}
	}
	function NYMag() {
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')
		document.querySelectorAll('#paywall-reader-interface').forEach(function (element) { element.remove() })
		document.querySelectorAll('#cliff-takeover').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tertiary').forEach(function (element) { element.setAttribute('style', '') })
		BreakJavaScript()
	}
	function Reuters() {
		CommonRemovalItems()
		document.querySelectorAll('[data-testid="Leaderboard"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[class*="ad-slot"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[testid*="ResponsiveAdSlot"]').forEach(function (element) { element.remove() })

		// clone the article
		const CLONED_CONTENT = document.querySelector('main#main-content').cloneNode(true)
		CLONED_CONTENT.id = 'm-content'
		document.querySelector('[class*="regular-article-layout__content"]').prepend(CLONED_CONTENT)

		// remove original element wrapper
		const MAIN_ELEMENT = document.querySelector('#main-content'); if (MAIN_ELEMENT !== null) MAIN_ELEMENT.remove()

		// restore article image
		let articleImage = document.querySelector('[property="og:image"]').getAttribute('content')
		articleImage = `//${articleImage.slice(articleImage.indexOf('cloudfront-us-east'))}`

		document.querySelector('[class*="image__cover___"]').append(Object.assign(document.createElement('img'), {
			src: articleImage,
			style: 'max-width: 100%; height: auto;'
		}))

		document.querySelector('[class*="stateful-image"]').removeAttribute('class')
		document.querySelector('[class*="image__cover___"]').removeAttribute('style')
		document.querySelectorAll('[data-testid="Spinner"]').forEach(function (element) { element.remove() })

		// broken image galleries removed as a compromise for reading the article's content
		document.querySelectorAll('[data-testid*="primary-gallery"]').forEach(function (element) { element.remove() })
		const CAROUSEL_ELEMENT = document.querySelector('[data-testid="Carousel"]')
		if (CAROUSEL_ELEMENT !== null) CAROUSEL_ELEMENT.parentNode.parentNode.remove()
	}
	function RottenTomatoes() {
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')
		const SELECTOR = [...document.querySelectorAll('h3')].filter(element => element.textContent.includes('Welcome to Rotten Tomatoes! Please support us by allowing ads'))
		if (SELECTOR.length > 0) SELECTOR[0].parentNode.parentNode.parentNode.parentNode.remove()
	}
	function SFChronicle() {
		HDN = {}
		COMSCORE = {}
		document.querySelectorAll('script').forEach(function (element) { element.remove() })
		document.querySelectorAll('iframe').forEach(function (element) { element.remove() })
		document.querySelectorAll('.fancybox-overlay').forEach(function (element) { element.remove() })
		document.querySelector('html').removeAttribute('class')
		document.querySelector('html').setAttribute('style', 'overflow: unset;')
		document.querySelectorAll('.bcSlideOut').forEach(function (element) { element.remove() })
		document.body.setAttribute('style', 'overflow: unset !important; position: unset;')
		document.querySelectorAll('.fancybox-lock').forEach(function (element) { element.classList.remove('fancybox-lock') })
		document.querySelectorAll('.bc_header').forEach(function (element) { element.remove() })
		document.querySelectorAll('style:last-child').forEach(function (element) { if (element.getAttribute('id') !== null) element.remove() })
	}
	function SFGate() {
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')
		const SELECTOR = [...document.querySelectorAll('h3')].filter(element => element.textContent.includes('Whitelist SFGATE to keep reading'))
		if (SELECTOR.length > 0) SELECTOR[0].parentNode.parentNode.parentNode.parentNode.remove()
	}
	function Vulture() {
		CommonRemovalItems(deleteIframes)
		document.querySelectorAll('.paywall-reader-interface').forEach(function (element) { element.remove() })
		document.querySelectorAll('#cliff-takeover').forEach(function (element) { element.remove() })
		document.querySelectorAll('.tertiary').forEach(function (element) { element.setAttribute('style', '') })
	}
	function WashingtonPost(isLooped) {
		document.querySelector('html').removeAttribute('style')
		document.body.removeAttribute('style')
		document.querySelectorAll('[as="script"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('#wall-bottom-drawer').forEach(function (element) { element.remove() })
		document.querySelectorAll('[id*="regwall-"]').forEach(function (element) { element.remove() })

		document.querySelectorAll('[data-qa*="paywall"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[rel*="apple-touch-icon"]').forEach(function (element) { element.remove() })

		document.querySelectorAll('.teaser-content').forEach(function (element) { element.classList.remove('teaser-content') })
		document.querySelectorAll('.article-body').forEach(function (element) {
			element.classList.remove('article-body')
			element.classList.add('a-body-cloned')
			element.classList.remove('grid-body')
			element.removeAttribute('data-qa')
		})
		document.querySelectorAll('p[data-qa]').forEach(function (element) {
			element.removeAttribute('data-qa')
			element.removeAttribute('data-el')
			element.removeAttribute('class')
		})

		document.querySelectorAll('.a-body-cloned').forEach(function (element) { element.removeAttribute('style') })

		if (typeof isLooped !== 'undefined') {
			if (!isLooped) {
				const CONTENT_ELEMENT = document.createElement('style')
				CONTENT_ELEMENT.innerHTML = `.grid-body			{ max-width: unset; font-family: var(--wpds-fonts-body); color: var(--wpds-colors-gray40); margin: 0; padding-bottom: var(--wpds-space-150); line-height: var(--wpds-lineHeights-160); }
											.a-body-cloned p	{ font-size: 1.25rem; margin-bottom: 15px; }`
				document.querySelector('.grid-body').prepend(CONTENT_ELEMENT)
			}
		}
	}
	function Wired() {
		ClearCookies()
		document.querySelectorAll('.paywall-bar-reg-gate').forEach(function (element) { element.remove() })
		document.querySelectorAll('[class*="PersistentBottomWrapper"]').forEach(function (element) { element.remove() })
		document.querySelectorAll('[class*="StickyHeroAdWrapper-"]').forEach(function (element) { element.remove() })
	}


	// 4. PROCESSING AND WRAP-UP
	function domStatusCheck() {
		if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME))
			StandardRemoval()

		if (AUXILIARY_DOMAINS.find(url => url === URL_HOSTNAME)) {
			switch (URL_HOSTNAME) {
				case DOMAIN.GamesRadarAuxiliary:
					if (typeof currentStatus2 !== 'undefined')
						GamesRadar(currentStatus2)
					else
						GamesRadar()

					break
			}
		}

		if (ABNORMAL_DOMAINS.find(url => url === URL_HOSTNAME)) {
			switch (URL_HOSTNAME) {
				case DOMAIN.BusinessInsider: BusinessInsider(); break
				case DOMAIN.BusinessInsiderMarkets: BusinessInsider(); break
				case DOMAIN.CNBC: CNBC(isLooped); break
				case DOMAIN.CommonSenseMedia: CommonSenseMedia(); break
				case DOMAIN.Curbed: Curbed(); false
				case DOMAIN.DailyMail: DailyMail(); break
				case DOMAIN.EuroGamer: EuroGamer(); break
				case DOMAIN.FastCompany: FastCompany(); break
				case DOMAIN.Fortune: Fortune(); break
				case DOMAIN.FoxBusiness: FoxBusiness(); break
				case DOMAIN.FoxNews: FoxNews(); break
				case DOMAIN.FreeCoursesOnline: FreeCoursesOnline(); break
				case DOMAIN.GameRant: GameRant(); break
				case DOMAIN.Inc: Inc(); break
				case DOMAIN.Insider: Insider(); break
				case DOMAIN.LATimes: LATimes(); break
				case DOMAIN.MakeUseOf: MakeUseOf(); break
				case DOMAIN.MercuryNews: MercuryNews(isLooped); break
				case DOMAIN.MetroUK: MetroUK(); break
				case DOMAIN.MiamiHerald: MiamiHerald(); break
				case DOMAIN.NBCNews: NBCNews(); break
				case DOMAIN.NewYorkTimes: NewYorkTimes(); break
				case DOMAIN.NewYorkTimesCooking: NewYorkTimes(); break
				case DOMAIN.NYMag: NYMag(); break
				case DOMAIN.Reuters: Reuters(); break
				case DOMAIN.RottenTomatoes: RottenTomatoes(); break
				case DOMAIN.SFGate: SFGate(); break
				case DOMAIN.TheCut: TheCut(); break
				case DOMAIN.TheGuardian: TheGuardian(isLooped); break
				case DOMAIN.Vulture: Vulture(); break
				case DOMAIN.WashingtonPost: WashingtonPost(isLooped); break
				case DOMAIN.Wired: Wired(); break
			}
			isLooped = true
		}

		RemoveHtmlComments()
	}

	function sledgeHammerRemoval() {
		const REPEAT_INTERVAL = 1500 // 1.5 seconds
		switch (URL_HOSTNAME) {
			case DOMAIN.TheDailyBeast: SuccessRemovalMessage(); setTimeout(function () { TheDailyBeast() }, REPEAT_INTERVAL); break
			case DOMAIN.Forbes: SuccessRemovalMessage(); setTimeout(function () { Forbes() }, REPEAT_INTERVAL); break
			case DOMAIN.HoustonChronicle: SuccessRemovalMessage(); setTimeout(function () { HoustonChronicle() }, REPEAT_INTERVAL); break
			case DOMAIN.Inquirer: SuccessRemovalMessage(); setTimeout(function () { Inquirer(isLooped) }, REPEAT_INTERVAL); break
			case DOMAIN.KelleyBlueBook: SuccessRemovalMessage(); setTimeout(function () { KelleyBlueBook() }, REPEAT_INTERVAL); break
			case DOMAIN.MedPageToday: SuccessRemovalMessage(); setTimeout(function () { MedPageToday() }, REPEAT_INTERVAL); break
			case DOMAIN.NationalGeographic: SuccessRemovalMessage(); setTimeout(function () { NationalGeographic() }, REPEAT_INTERVAL); break
			case DOMAIN.SFChronicle: SuccessRemovalMessage(); setTimeout(function () { SFChronicle() }, REPEAT_INTERVAL); break
		}
		isLooped = true
	}

	if (OkayToUseSledgeHammerRemoval()) sledgeHammerRemoval()

	function displayMessage(domain) {
		return console.log(`%c 🚦 Assassinate Ad Block Blockers — Clear interval pass for ${domain} then pause for a few seconds...`, 'background: #FFBF01; color: #222;')
	}

	// Periodicially clear everything and pause for a few seconds, then start again. Not as agreesive as Sledgehammer function
	function clearAllIntervals() {
		if (URL_HOSTNAME === DOMAIN.TheGuardian)
			SuccessRemovalMessage(300)
		else
			SuccessRemovalMessage()

		setTimeout(function () {
			console.clear()

			if (URL_HOSTNAME != DOMAIN.TheDailyBeast) {
				switch (URL_HOSTNAME) {
					case DOMAIN.BusinessInsider: displayMessage(DOMAIN.BusinessInsider); BusinessInsider(); break
					case DOMAIN.BusinessInsiderMarkets: displayMessage(DOMAIN.BusinessInsiderMarkets); BusinessInsider(); break
					case DOMAIN.CNBC: displayMessage(DOMAIN.CNBC); CNBC(); break
					case DOMAIN.CommonSenseMedia: displayMessage(DOMAIN.CommonSenseMedia); CommonSenseMedia(); break
					case DOMAIN.Curbed: displayMessage(DOMAIN.Curbed); Curbed(); break
					case DOMAIN.CNN: displayMessage(DOMAIN.CNN); CNN(); break
					case DOMAIN.TheCut: displayMessage(DOMAIN.TheCut); TheCut(); break
					case DOMAIN.DailyMail: displayMessage(DOMAIN.DailyMail); DailyMail(); break
					case DOMAIN.EuroGamer: displayMessage(DOMAIN.EuroGamer); EuroGamer(); break
					case DOMAIN.FastCompany: displayMessage(DOMAIN.FastCompany); FastCompany(); break
					case DOMAIN.FoxBusiness: displayMessage(DOMAIN.FoxBusiness); FoxBusiness(); break
					case DOMAIN.FoxNews: displayMessage(DOMAIN.FoxNews); FoxNews(); break
					case DOMAIN.FreeCoursesOnline: displayMessage(DOMAIN.FreeCoursesOnline); FreeCoursesOnline(); break
					case DOMAIN.Fortune: displayMessage(DOMAIN.Fortune); Fortune(); break
					case DOMAIN.GameRant: displayMessage(DOMAIN.GameRant); GameRant(); break
					case DOMAIN.TheGuardian: displayMessage(DOMAIN.TheGuardian); TheGuardian(isLooped); break
					case DOMAIN.Inc: displayMessage(DOMAIN.Inc); Inc(); break
					case DOMAIN.Insider: displayMessage(DOMAIN.Insider); Insider(); break
					case DOMAIN.LATimes: displayMessage(DOMAIN.LATimes); LATimes(); break
					case DOMAIN.MakeUseOf: displayMessage(DOMAIN.MakeUseOf); MakeUseOf(); break
					case DOMAIN.MercuryNews: displayMessage(DOMAIN.MercuryNews); MercuryNews(isLooped); break
					case DOMAIN.MetroUK: displayMessage(DOMAIN.MetroUK); MetroUK(); break
					case DOMAIN.MiamiHerald: displayMessage(DOMAIN.MiamiHerald); MiamiHerald(); break
					case DOMAIN.NBCNews: displayMessage(DOMAIN.NBCNews); NBCNews(); break
					case DOMAIN.NewYorkTimes: displayMessage(DOMAIN.NewYorkTimes); NewYorkTimes(); break
					case DOMAIN.NewYorkTimesCooking: displayMessage(DOMAIN.NewYorkTimesCooking); NewYorkTimes(); break
					case DOMAIN.NYMag: displayMessage(DOMAIN.NYMag); NYMag(); break
					case DOMAIN.Reuters: displayMessage(DOMAIN.Reuters); Reuters(); break
					case DOMAIN.RottenTomatoes:
					case DOMAIN.RottenTomatoesEditorial: displayMessage(DOMAIN.RottenTomatoes); RottenTomatoes(); break
					case DOMAIN.SFGate: displayMessage(DOMAIN.SFGate); SFGate(); break
					case DOMAIN.Vulture: displayMessage(DOMAIN.Vulture); Vulture(); break
					case DOMAIN.WashingtonPost: displayMessage(DOMAIN.WashingtonPost); WashingtonPost(isLooped); break
					case DOMAIN.Wired: displayMessage(DOMAIN.Wired); Wired(); break
				}

				clearInterval('SledgehammerRemoval')
				console.log('%c 👍 Assassinate Ad Block Blockers — Sledgehammer interval cleared', 'background: #0b801d; color: #fff;')
			}

			currentStatus1 = currentStatus1 === undefined ? undefined : currentStatus1
			currentStatus2 = currentStatus2 === undefined ? undefined : currentStatus2
			currentStatus3 = currentStatus3 === undefined ? undefined : currentStatus3
			currentStatus4 = currentStatus4 === undefined ? undefined : currentStatus4
			currentStatus5 = currentStatus5 === undefined ? undefined : currentStatus5
			currentStatus6 = currentStatus6 === undefined ? undefined : currentStatus6
			currentStatus7 = currentStatus7 === undefined ? undefined : currentStatus7
			currentStatus8 = currentStatus8 === undefined ? undefined : currentStatus8
			currentStatus9 = currentStatus9 === undefined ? undefined : currentStatus9
			currentStatus10 = currentStatus10 === undefined ? undefined : currentStatus10
			CI = CI === undefined ? undefined : CI

			console.log('%c 😎 Assassinate Ad Block Blockers — All intervals cleared', 'background: #0b801d; color: #fff;')

			document.querySelectorAll('#Injected-By-Assassinate-Ad-Block-Blockers').forEach(function (element) { element.remove() })
		}, 1500) // Wait 1.5 seconds for the success animation to finish
	}

	const PROCESSING_MESSAGE = 'The Assassinate Ad Block Blockers script is doing its jobs. Please wait a few seconds. 🚦'

	if (URL_HOSTNAME === DOMAIN.TheGuardian)
		StartingRemovalMessage(PROCESSING_MESSAGE, 300)
	else
		StartingRemovalMessage(PROCESSING_MESSAGE)

	// Sets up listeners to supercede any blocker shenanigans
	if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus1 = setTimeout(domStatusCheck, 50) 	// deepscan-disable-line
	if (AUXILIARY_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus2 = setTimeout(domStatusCheck, 50)	// deepscan-disable-line

	// Second pass after 1.5 seconds
	if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus3 = setTimeout(domStatusCheck, 1500)	// deepscan-disable-line
	if (ABNORMAL_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus4 = setTimeout(domStatusCheck, 1500)	// deepscan-disable-line

	// Third pass after 2.5 seconds
	if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus5 = setTimeout(domStatusCheck, 2500)	// deepscan-disable-line
	if (ABNORMAL_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus6 = setTimeout(domStatusCheck, 2500)	// deepscan-disable-line

	// Fourth pass after 5.5 seconds
	if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus7 = setTimeout(domStatusCheck, 5500)	// deepscan-disable-line
	if (ABNORMAL_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus8 = setTimeout(domStatusCheck, 5500)	// deepscan-disable-line

	// Fifth pass after 7 seconds
	if (STANDARD_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus9 = setTimeout(domStatusCheck, 7000)	// deepscan-disable-line
	if (ABNORMAL_DOMAINS.find(url => url === URL_HOSTNAME)) currentStatus10 = setTimeout(domStatusCheck, 7000)	// deepscan-disable-line

	// Last-pass guarantee after 7.05 seconds (We want this to fire immediately after the fifth pass)
	let CI = setTimeout(clearAllIntervals, 7050)

	// Perpetual check and removal every 2.5 seconds - The Peter Gabriel Sledgehammer Special
	if (OkayToUseSledgeHammerRemoval()) setInterval(sledgeHammerRemoval, 2500)

	console.clear()
}
