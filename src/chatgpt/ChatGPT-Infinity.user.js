// ==UserScript==
// @name                ChatGPT: Infinity ∞
// @description         Generate endless answers from all-knowing ChatGPT (in any language!)
// @author              Adam Lui
// @version             2023.8.14.1
// @license             MIT
// @namespace           https://github.com/danydodson/userscripts
// @downloadURL         https://github.com/danydodson/userscripts/raw/main/src/chatgpt/ChatGPT-Infinity.user.js
// @updateURL           https://github.com/danydodson/userscripts/raw/main/src/chatgpt/ChatGPT-Infinity.user.js
// @match               https://chat.openai.com/*
// @icon                https://raw.githubusercontent.com/madkarmaa/automatic-chatgpt-dan/master/images/icon.png
// @require             https://cdn.jsdelivr.net/gh/kudoai/chatgpt.js@315fc8e62d4d3e82276fbb641128774a0d1c5219/dist/chatgpt-2.1.0.min.js
// @connect             raw.githubusercontent.com
// @connect             greasyfork.org
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_openInTab
// @grant               GM.xmlHttpRequest
// @noframes
// ==/UserScript==

// @homepageURL       https://chatgptinfinity.com
// @supportURL        https://chatgptinfinity.com/support
// @icon                https://raw.githubusercontent.com/adamlui/chatgpt-infinity/main/media/images/icons/infinity-symbol/black/icon48.png
// @icon64              https://raw.githubusercontent.com/adamlui/chatgpt-infinity/main/media/images/icons/infinity-symbol/black/icon64.png

// NOTE: This script relies on the powerful chatgpt.js library @ https://chatgpt.js.org (c) 2023 KudoAI & contributors under the MIT license

(async () => {

	// Init config
	const config = {
		prefix: 'chatgptInfinity', appSymbol: '∞', userLanguage: chatgpt.getUserLanguage(),
		gitHubURL: 'https://github.com/adamlui/chatgpt-infinity',
		greasyForkURL: 'https://greasyfork.org/scripts/465051-chatgpt-infinity'
	}
	config.updateURL = config.greasyForkURL + '/code/chatgpt-infinity.meta.js'
	config.assetHostURL = config.gitHubURL.replace('github.com', 'raw.githubusercontent.com') + '/main/'
	loadSetting('autoScrollDisabled', 'replyInterval', 'replyLanguage', 'replyTopic', 'toggleHidden')
	if (!config.replyLanguage) saveSetting('replyLanguage', config.userLanguage) // init reply language if unset
	if (!config.replyTopic) saveSetting('replyTopic', 'ALL') // init reply topic if unset
	if (!config.replyInterval) saveSetting('replyInterval', 7) // init refresh interval to 7 secs if unset

	// Define messages
	const msgsLoaded = new Promise(resolve => {
		const msgHostDir = config.assetHostURL + 'greasemonkey/_locales/',
			msgLocaleDir = (config.userLanguage ? config.userLanguage.replace('-', '_') : 'en') + '/'
		let msgHref = msgHostDir + msgLocaleDir + 'messages.json', msgXHRtries = 0
		GM.xmlHttpRequest({ method: 'GET', url: msgHref, onload: onLoad })
		function onLoad(response) {
			try { // to return localized messages.json
				const messages = new Proxy(JSON.parse(response.responseText), {
					get(target, prop) { // remove need to ref nested keys
						if (typeof target[prop] === 'object' && target[prop] !== null && 'message' in target[prop]) {
							return target[prop].message
						}
					}
				}); resolve(messages)
			} catch (error) { // if 404
				msgXHRtries++; if (msgXHRtries == 3) return // try up to 3X (original/region-stripped/EN) only
				msgHref = config.userLanguage.includes('-') && msgXHRtries == 1 ? // if regional lang on 1st try...
					msgHref.replace(/(.*)_.*(\/.*)/, '$1$2') // ...strip region before retrying
					: (msgHostDir + 'en/messages.json') // else use default English messages
				GM.xmlHttpRequest({ method: 'GET', url: msgHref, onload: onLoad })
			}
		}
	}); const messages = await msgsLoaded

	// Create browser toolbar menu or disable script if extension installed 
	let menuIDs = []
	const state = {
		symbol: ['✔️', '❌'], word: ['ON', 'OFF'],
		separator: getUserscriptManager() === 'Tampermonkey' ? ' — ' : ': '
	}
	await chatgpt.isLoaded()
	if (document.documentElement.getAttribute('cif-extension-installed')) { // if extension installed, disable script/menu
		GM_registerMenuCommand(state.symbol[1] + ' ' + messages.menuLabel_disabled, () => { return })
		return // exit script
	} else registerMenu() // create functional menu

	// Add listener to auto-disable Infinity Mode
	if (document.hidden !== undefined) { // ...if Page Visibility API supported
		document.addEventListener('visibilitychange', () => {
			if (config.infinityMode) infinityMode.deactivate()
			for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
		})
	}

	// Stylize toggle switch
	const switchStyle = document.createElement('style')
	switchStyle.innerText = `/* Stylize switch */
			.switch { position:absolute ; left:208px ; width:34px ; height:18px }
			.switch input { opacity:0 ; width:0 ; height:0 } /* hide checkbox */
			.slider { position:absolute ; cursor:pointer ; top:0 ; left:0 ; right:0 ; bottom:0 ; background-color:#ccc ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }
			.slider:before { position:absolute ; content:"" ; height:14px ; width:14px ; left:3px; bottom:2px ; background-color:white ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }

			/* Position/color ON-state */
			input:checked { position:absolute ; right:3px }
			input:checked + .slider { background-color:#42B4BF }
			input:checked + .slider:before {
					-webkit-transform: translateX(14px) translateY(1px) ;
					-ms-transform: translateX(14px) translateY(1px) ;
					transform: translateX(14px) }`

	document.head.appendChild(switchStyle)

	// Create toggle label, add styles//classes/listener/HTML
	const toggleLabel = document.createElement('div') // create label div
	toggleLabel.style.maxHeight = '44px' // prevent flex overgrowth
	toggleLabel.style.margin = '2px 0' // add v-margins
	toggleLabel.style.userSelect = 'none' // prevent highlighting
	for (const navLink of document.querySelectorAll('nav[aria-label="Chat history"] a')) { // inspect sidebar for classes to borrow
		if (/(new|clear) chat/i.test(navLink.text)) { // focus on new/clear chat button
			toggleLabel.setAttribute('class', navLink.classList) // borrow link classes
			navLink.parentNode.style.margin = '2px 0' // add v-margins
			break // stop looping since class assignment is done
		}
	}
	toggleLabel.addEventListener('click', () => {
		const toggleInput = document.querySelector('#infToggleInput')
		toggleInput.checked = !toggleInput.checked
		setTimeout(updateToggleHTML, 200) // sync label change w/ switch movement
		config.infinityMode = toggleInput.checked
		for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
		infinityMode.toggle()
	})
	updateToggleHTML()

	// Insert full toggle on page load + during navigation // 在导航期间插入页面加载 + 的完整切换
	insertToggle()
	const nodeObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList' && mutation.addedNodes.length) {
				insertToggle()
			}
		})
	}); nodeObserver.observe(document.documentElement, { childList: true, subtree: true })

	// Define SCRIPT functions

	function loadSetting(...keys) { keys.forEach(key => { config[key] = GM_getValue(config.prefix + '_' + key, false) }) }
	function saveSetting(key, value) { GM_setValue(config.prefix + '_' + key, value); config[key] = value }
	function safeWindowOpen(url) { window.open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

	function updateCheck() {

		// Fetch latest meta
		const currentVer = GM_info.script.version
		GM.xmlHttpRequest({
			method: 'GET', url: config.updateURL + '?t=' + Date.now(),
			headers: { 'Cache-Control': 'no-cache' },
			onload: (response) => {

				// Compare versions
				const latestVer = /@version +(.*)/.exec(response.responseText)[1]
				for (let i = 0; i < 4; i++) { // loop thru subver's
					const currentSubVer = parseInt(currentVer.split('.')[i]) || 0,
						latestSubVer = parseInt(latestVer.split('.')[i]) || 0
					if (currentSubVer > latestSubVer) break // out of comparison since not outdated
					else if (latestSubVer > currentSubVer) { // if outdated

						// Alert to update
						const updateAlertID = alert(`${messages.alert_updateAvail}! 🚀`, // title
							`${messages.alert_newerVer} ${messages.appName} (v${latestVer}) ${messages.alert_isAvail}!   `
							+ '<a target="_blank" rel="noopener" style="font-size: 0.7rem" '
							+ 'href="' + config.gitHubURL + '/commits/main/greasemonkey/'
							+ config.updateURL.replace(/.*\/(.*)meta\.js/, '$1user.js') + '" '
							+ '>' + messages.link_viewChanges + '</a>',
							function update() { // button
								GM_openInTab(config.updateURL.replace('meta.js', 'user.js') + '?t=' + Date.now(),
									{ active: true, insert: true } // focus, make adjacent
								).onclose = () => location.reload()
							}
						)

						// Localize button labels if needed
						if (!config.userLanguage.startsWith('en')) {
							const updateAlert = document.querySelector(`[id="${updateAlertID}"]`)
							updateAlert.querySelectorAll('button')[1].textContent = messages.buttonLabel_update
							updateAlert.querySelectorAll('button')[0].textContent = messages.buttonLabel_dismiss
						}
						return
					}
				}

				alert(`${messages.alert_upToDate}!`, // title
					`${messages.appName} (v${currentVer}) ${messages.alert_isUpToDate}!`) // msg
			}
		})
	}

	// Define MENU functions

	function getUserscriptManager() { try { return GM_info.scriptHandler } catch (error) { return 'other' } }

	function toTitleCase(str) {
		const words = str.toLowerCase().split(' ')
		for (let i = 0; i < words.length; i++) // for each word
			words[i] = words[i][0].toUpperCase() + words[i].slice(1) // title-case it
		return words.join(' ') // join'em back together
	}

	function registerMenu() {
		menuIDs = [] // empty to store newly registered cmds for removal while preserving order

		// Add command to toggle Infinity Mode
		const imLabel = state.symbol[+!config.infinityMode] + ' ' + messages.menuLabel_infinityMode + ' ∞ '
			+ state.separator + state.word[+!config.infinityMode]
		menuIDs.push(GM_registerMenuCommand(imLabel, () => {
			document.querySelector('#infToggleLabel').click()
		}))

		// Add command to toggle visibility of toggle
		const tvLabel = state.symbol[+config.toggleHidden] + ' ' + messages.menuLabel_toggleVis
			+ state.separator + state.word[+config.toggleHidden]
		menuIDs.push(GM_registerMenuCommand(tvLabel, () => {
			saveSetting('toggleHidden', !config.toggleHidden)
			toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex' // toggle visibility
			notify(messages.menuLabel_toggleVis + ': ' + state.word[+config.toggleHidden])
			for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
		}))

		// Add command to toggle auto-scroll
		const asLabel = state.symbol[+config.autoScrollDisabled] + ' ' + messages.menuLabel_autoScroll
			+ state.separator + state.word[+config.autoScrollDisabled]
		menuIDs.push(GM_registerMenuCommand(asLabel, () => {
			saveSetting('autoScrollDisabled', !config.autoScrollDisabled)
			notify(messages.menuLabel_autoScroll + ': ' + state.word[+config.autoScrollDisabled])
			for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
		}))

		// Add command to set reply language
		const rlLabel = '🌐 ' + messages.menuLabel_replyLang + state.separator + config.replyLanguage
		menuIDs.push(GM_registerMenuCommand(rlLabel, () => {
			while (true) {
				const replyLanguage = prompt(`${messages.prompt_updateReplyLang}:`, config.replyLanguage)
				if (replyLanguage === null) break // user cancelled so do nothing
				else if (!/\d/.test(replyLanguage)) {
					saveSetting('replyLanguage', replyLanguage || config.userLanguage)
					alert(messages.alert_replyLangUpdated + '!', messages.alert_willReplyIn + ' '
						+ (replyLanguage || messages.alert_yourSysLang) + '.')
					if (config.infinityMode) restartInNewChat() // using new reply language                        
					for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
					break
				}
			}
		}))

		// Add command to set reply topic
		const re_all = new RegExp('^(' + messages.menuLabel_all + '|all|any|every)$', 'i'),
			rtLabel = '🧠 ' + messages.menuLabel_replyTopic + state.separator
				+ (re_all.test(config.replyTopic) ? messages.menuLabel_all
					: toTitleCase(config.replyTopic))
		menuIDs.push(GM_registerMenuCommand(rtLabel, () => {
			while (true) {
				const replyTopic = prompt(messages.prompt_updateReplyTopic
					+ ' (' + messages.prompt_orEnter + ' \'ALL\'):', config.replyTopic)
				if (replyTopic === null) break // user cancelled so do nothing
				else if (!/\d/.test(replyTopic)) {
					saveSetting('replyTopic', !replyTopic || re_all.test(replyTopic) ? 'ALL' : replyTopic)
					alert(messages.alert_replyTopicUpdated + '!',
						messages.appName + ' ' + messages.alert_willAnswer + ' '
						+ (!replyTopic || re_all.test(replyTopic) ? messages.alert_onAllTopics
							: messages.alert_onTopicOf + ' ' + replyTopic)
						+ '!')
					if (config.infinityMode) { // restart session using new reply topic
						chatgpt.stop(); document.querySelector('#infToggleLabel').click() // toggle off
						setTimeout(() => { document.querySelector('#infToggleLabel').click() }, 500)
					} // toggle on
					for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
					break
				}
			}
		}))

		// Add command to change reply interval
		const riLabel = '⌚ ' + messages.menuLabel_replyInt + state.separator + config.replyInterval + 's'
		menuIDs.push(GM_registerMenuCommand(riLabel, async () => {
			while (true) {
				const replyInterval = prompt(`${messages.prompt_updateReplyInt}:`, config.replyInterval)
				if (replyInterval === null) break // user cancelled so do nothing
				else if (!isNaN(parseInt(replyInterval)) && parseInt(replyInterval) > 4) { // valid int set
					saveSetting('replyInterval', parseInt(replyInterval))
					alert(messages.alert_replyIntUpdated + '!', messages.alert_willReplyEvery + ' '
						+ replyInterval + ' ' + messages.unit_seconds + '.')
					if (config.infinityMode) resetInSameChat() // using new reply interval                    
					for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
					break
				}
			}
		}))

		// Add command to launch About modal
		menuIDs.push(GM_registerMenuCommand('💡 About ' + messages.appName, async () => {

			// Get chatgpt.js version
			const scriptMeta = await new Promise(resolve => {
				GM.xmlHttpRequest({
					method: 'GET', url: config.updateURL + '?t=' + Date.now(),
					headers: { 'Cache-Control': 'no-cache' }, onload: resolve
				})
			})
			const chatgptJSver = /chatgpt-([\d.]+)\.min/.exec(scriptMeta.responseText)?.[1] || ''

			// Show alert
			const headingStyle = 'font-size: 1.15rem',
				pStyle = 'position: relative ; left: 3px',
				pBrStyle = 'position: relative ; left: 4px ',
				aStyle = 'color: #8325c4' // purple
			const aboutAlertID = alert(
				messages.appName, // title
				`<span style="${headingStyle}"><b>🏷️ <i>Version</i></b>: </span>`
				+ `<span style="${pStyle}">${GM_info.script.version}</span>\n`
				+ `<span style="${headingStyle}"><b>⚡ <i>Powered by</i></b>: </span>`
				+ `<span style="${pStyle}"><a style="${aStyle}" href="https://chatgpt.js.org" target="_blank" rel="noopener">`
				+ 'chatgpt.js</a>' + (chatgptJSver ? (' v' + chatgptJSver) : '') + '</span>\n'
				+ `<span style="${headingStyle}"><b>📜 <i>Source code</i></b>:</span>\n`
				+ `<span style="${pBrStyle}"><a href="${config.gitHubURL}" target="_blank" rel="nopener">`
				+ config.gitHubURL + '</a></span>',
				[ // buttons
					function checkForUpdates() { updateCheck() },
					function leaveAReview() { // show new modal
						const reviewAlertID = chatgpt.alert('Choose a platform:', '',
							[function greasyFork() { safeWindowOpen(config.greasyForkURL + '/feedback#post-discussion') },
							function productHunt() {
								safeWindowOpen(
									'https://www.producthunt.com/products/chatgpt-infinity/reviews/new')
							}])
						document.getElementById(reviewAlertID).querySelector('button')
							.style.display = 'none'
					} // hide Dismiss button
				]
			)

			// Re-format buttons to include emojis + re-case + hide Dismiss button
			for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
				if (/updates/i.test(button.textContent))
					button.textContent = '🚀 ' + messages.menuLabel_updateCheck
				else if (/review/i.test(button.textContent)) button.textContent = '⭐ Leave a Review'
				else if (/github/i.test(button.textContent)) button.textContent = '🖥️ GitHub source'
				else button.style.display = 'none' // hide Dismiss button
			}
		}))

	}

	// Define FEEDBACK functions

	function notify(msg, position = '', notifDuration = '', shadow = '') {
		chatgpt.notify(`${config.appSymbol} ${msg}`, position, notifDuration, shadow || chatgpt.isDarkMode() ? '' : 'shadow')
	}

	function alert(title = '', msg = '', btns = '', checkbox = '', width = '') {
		return chatgpt.alert(`${config.appSymbol} ${title}`, msg, btns, checkbox, width)
	}

	// Define TOGGLE functions

	function insertToggle() {
		const chatHistoryNav = document.querySelector('nav[aria-label="Chat history"]') || {},
			firstButton = chatHistoryNav.querySelector('a') || {}
		if (chatgpt.history.isOff()) // hide enable-history spam div
			try { firstButton.parentNode.nextElementSibling.style.display = 'none' } catch (error) { }
		if (!chatHistoryNav.contains(toggleLabel)) // insert toggle
			try { chatHistoryNav.insertBefore(toggleLabel, firstButton.parentNode) } catch (error) { }
	}

	function updateToggleHTML() {
		while (toggleLabel.firstChild) toggleLabel.firstChild.remove() // clear old content

		// Create elements
		const navicon = document.createElement('img'),
			label = document.createElement('label'),
			labelText = document.createTextNode(messages.menuLabel_infinityMode + ' '
				+ messages['state_' + (config.infinityMode ? 'enabled' : 'disabled')]),
			input = document.createElement('input'),
			span = document.createElement('span')
		navicon.src = config.assetHostURL + 'media/images/icons/infinity-symbol/white/icon64.png'; navicon.width = 18
		label.id = 'infToggleLabel'; label.className = 'switch'
		input.id = 'infToggleInput'; input.type = 'checkbox'; input.checked = config.infinityMode; input.disabled = true
		span.className = 'slider'

		// Append elements
		label.appendChild(input); label.appendChild(span)
		toggleLabel.appendChild(navicon); toggleLabel.appendChild(label); toggleLabel.appendChild(labelText)

		// Update visibility
		toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex'
	}

	const infinityMode = {

		activate: async () => {
			notify(messages.menuLabel_infinityMode + ': ON')
			try { chatgpt.startNewChat() } catch (error) { return }
			setTimeout(() => {
				chatgpt.send('Generate a single random Q&A'
					+ (config.replyLanguage ? (' in ' + config.replyLanguage) : '')
					+ (' on ' + (config.replyTopic === 'ALL' ? 'ALL topics' : 'the topic of ' + config.replyTopic))
					+ '. Don\'t type anything else.')
			}, 500)
			await chatgpt.isIdle()
			if (config.infinityMode && !infinityMode.isActive) // double-check in case de-activated before scheduled
				infinityMode.isActive = setTimeout(infinityMode.continue, parseInt(config.replyInterval) * 1000)
		},

		continue: async () => {
			chatgpt.send('Do it again.')
			if (!config.autoScrollDisabled) try { chatgpt.scrollToBottom() } catch (error) { }
			await chatgpt.isIdle() // before starting delay till next iteration
			if (infinityMode.isActive) // replace timer
				infinityMode.isActive = setTimeout(infinityMode.continue, parseInt(config.replyInterval) * 1000)
		},

		deactivate: () => {
			chatgpt.stop(); clearTimeout(infinityMode.isActive); infinityMode.isActive = null
			document.querySelector('#infToggleInput').checked = false // for window listener
			notify(messages.menuLabel_infinityMode + ': OFF')
			config.infinityMode = false // in case toggled by PV listener
		},

		toggle: () => { config.infinityMode ? infinityMode.activate() : infinityMode.deactivate() }
	}

	// Define INTERRUPT functions

	function restartInNewChat() {
		chatgpt.stop(); document.querySelector('#infToggleLabel').click() // toggle off
		setTimeout(() => { document.querySelector('#infToggleLabel').click() }, 500) // toggle on
	}

	async function resetInSameChat() {
		clearTimeout(infinityMode.isActive); infinityMode.isActive = null; await chatgpt.isIdle()
		if (config.infinityMode && !infinityMode.isActive) // double-check in case de-activated before scheduled
			infinityMode.isActive = setTimeout(infinityMode.continue, parseInt(config.replyInterval) * 1000)
	}

})()