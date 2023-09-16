// ==UserScript==
// @name         Cleaner: Remove Web Limits
// @description  Pass to kill most of the site, you can lift the restrictions prohibited to copy, cut, select the text, right-click menu.revised version
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/cleaner/Cleaner-Remove-Web-Limits.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/cleaner/Cleaner-Remove-Web-Limits.user.js
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
// @version      4.4.8
// @license      LGPLv3
// @connect      eemm.me
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @match        *://*/*
// @exclude      *www.bilibili.com/video*
// @exclude      *www.bilibili.com/v*
// @exclude      *www.bilibili.com/s/*
// @exclude      *www.bilibili.com/bangumi*
// @exclude      https://www.bilibili.com/medialist/play/*
// @exclude      *www.youtube.com/watch*
// @exclude      *www.panda.tv*
// @exclude      *www.github.com*
// @exclude      https://lanhuapp.com/*
// @exclude      https://www.douyu.com/*
// @exclude      https://www.zhihu.com/signin?*
// @exclude      https://tieba.baidu.com/*
// @exclude      https://v.qq.com/*
// @exclude      *.taobao.com/*
// @exclude      *tmall.com*
// @exclude      *signin*

// ==/UserScript==

// @--homepageURL  https://cat7373.github.io/remove-web-limits/
// @--supportURL   https://greasyfork.org/zh-CN/scripts/28497

(function () {
	'use strict'

	// List of domain name rules
	var rules = {
		black_rule: {
			name: "black",
			hook_eventNames: "",
			unhook_eventNames: ""
		},
		default_rule: {
			name: "default",
			hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
			unhook_eventNames: "mousedown|mouseup|keydown|keyup",
			dom0: true,
			hook_addEventListener: true,
			hook_preventDefault: true,
			hook_set_returnValue: true,
			add_css: true
		}
	}
	// Domain name list
	var lists = {
		// blacklist
		black_list: [
			/.*\.youtube\.com.*/,
			/.*\.wikipedia\.org.*/,
			/mail\.qq\.com.*/,
			/translate\.google\..*/
		]
	}

	// To event List
	var hook_eventNames, unhook_eventNames, eventNames
	// Storage name
	var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() * 12 + 8))
	// Storage Hook The function
	var EventTarget_addEventListener = EventTarget.prototype.addEventListener
	var document_addEventListener = document.addEventListener
	var Event_preventDefault = Event.prototype.preventDefault

	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener
		if (hook_eventNames.indexOf(type) >= 0) {
			_addEventListener.apply(this, [type, returnTrue, useCapture])
		} else if (this && unhook_eventNames.indexOf(type) >= 0) {
			var funcsName = storageName + type + (useCapture ? 't' : 'f')

			if (this[funcsName] === undefined) {
				this[funcsName] = []
				_addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture])
			}

			this[funcsName].push(func)
		} else {
			_addEventListener.apply(this, arguments)
		}
	}

	// Cleaning the cycle
	function clearLoop() {
		var elements = getElements()

		for (var i in elements) {
			for (var j in eventNames) {
				var name = 'on' + eventNames[j]
				if (elements[i][name] !== null && elements[i][name] !== onxxx) {
					if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
						elements[i][storageName + name] = elements[i][name]
						elements[i][name] = onxxx
					} else {
						elements[i][name] = null
					}
				}
			}
		}
	}

	// Return to True function
	function returnTrue(e) {
		return true
	}
	function unhook_t(e) {
		return unhook(e, this, storageName + e.type + 't')
	}
	function unhook_f(e) {
		return unhook(e, this, storageName + e.type + 'f')
	}
	function unhook(e, self, funcsName) {
		var list = self[funcsName]
		for (var i in list) {
			list[i](e)
		}

		e.returnValue = true
		return true
	}
	function onxxx(e) {
		var name = storageName + 'on' + e.type
		this[name](e)

		e.returnValue = true
		return true
	}

	// Get random string
	function getRandStr(chs, len) {
		var str = ''

		while (len--) {
			str += chs[parseInt(Math.random() * chs.length)]
		}

		return str
	}

	// Get all elements Including document
	function getElements() {
		var elements = Array.prototype.slice.call(document.getElementsByTagName('*'))
		elements.push(document)

		return elements
	}

	// Add CSS
	function addStyle(css) {
		var style = document.createElement('style')
		style.innerHTML = css
		document.head.appendChild(style)
	}

	// The rules that should be used in the target domain name
	function getRule(url) {
		function testUrl(list, url) {
			for (var i in list) {
				if (list[i].test(url)) {
					return true
				}
			}

			return false
		}

		if (testUrl(lists.black_list, url)) {
			return rules.black_rule
		}

		return rules.default_rule
	}

	// initialization
	function init() {
		// Rules for obtaining the current domain name
		var url = window.location.host + window.location.pathname
		var rule = getRule(url)

		// set up event List
		hook_eventNames = rule.hook_eventNames.split("|")
		// TODO Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|")
		eventNames = hook_eventNames.concat(unhook_eventNames)

		// Call DOM0 event Method cycle
		if (rule.dom0) {
			setInterval(clearLoop, 30 * 1000)
			setTimeout(clearLoop, 2500)
			window.addEventListener('load', clearLoop, true)
			clearLoop()
		}

		// hook addEventListener
		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener
			document.addEventListener = addEventListener
		}

		// hook preventDefault
		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function () {
				if (eventNames.indexOf(this.type) < 0) {
					Event_preventDefault.apply(this, arguments)
				}
			}
		}

		// Hook set returnValue
		if (rule.hook_set_returnValue) {
			Event.prototype.__defineSetter__('returnValue', function () {
				if (this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
					this.returnValue = true
				}
			})
		}

		console.debug('url: ' + url, 'storageName: ' + storageName, 'rule: ' + rule.name)

		// Add CSS
		if (rule.add_css) {
			addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important; user-select:text!important; -ms-user-select:text!important; -khtml-user-select:text!important;}')
		}
	}

	init()
})()