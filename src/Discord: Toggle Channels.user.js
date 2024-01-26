// ==UserScript==
// @name         Discord: Toggle Channels
// @description  Adds show/hide channels sidebar button to Discord Web App
// @author       Github mindovermiles262
// @version      1.12.1
// @namespace    Nounce Scripts
// @iconURL      https://i.ibb.co/7znt13j/30162036.png
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	// Classes of DIVs you want to be able to toggle sidebar
	const toggleButtons = ['toggleChannelsBtn']
	// Sidebar column that will be hidden
	const columnToHide = 'sidebar-1tnWFu'
	// Small sidebar with all your Discords
	const showHideSidebarButtonParentClass = 'children-3xh0VB'
	// Unread messages are assigned a class, used in chevron colorization
	const unreadClass = 'unread-36eUEm'
	const channelsWidth = '240px'

	function sleep(ms) {
		// Sets timeout for inital page elements to load
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	async function pageload() {
		// Wait 5 seconds for page to load
		await sleep(5000)
		main()
	}

	const toggleVisibility = function () {
		// Changes the width of the rooms sidebar
		let sidebar = document.getElementsByClassName(columnToHide)[0]
		if (sidebar.style.width == '0px') {
			sidebar.style.width = channelsWidth
		} else {
			sidebar.style.width = '0px'
		}
	}

	let cheveronDirection = function () {
		const sidebar = document.getElementsByClassName(columnToHide)[0]
		const btn = document.getElementById('dtcb-cheverons')
		if (sidebar.style.width == '1px') {
			btn.innerText = '>'
		} else {
			btn.innerText = '<'
		}
	}

	const createSidebarButton = function () {
		let btnDiv = document.createElement('div')
		btnDiv.setAttribute('class', 'toggleChannelsBtn')
		btnDiv.setAttribute('id', 'toggleChannelsBtn')
		btnDiv.style.width = '24px'
		btnDiv.style.textAlign = 'center'
		btnDiv.style.color = '#4e5058e1'
		let btn = document.createElement('p')
		btn.setAttribute('id', 'dtcb-cheverons')
		btn.innerText = '<'
		btn.style.fontWeight = '600'
		btn.style.fontSize = '140%'
		btn.style.margin = '0 10px'
		btnDiv.appendChild(btn)
		return btnDiv
	}

	const addListenersToToggleButtons = function () {
		toggleButtons.forEach(function (elem) {
			document.getElementsByClassName(elem)[0].addEventListener('click', function () {
				toggleVisibility()
				cheveronDirection()
			})
		})
	}

	const colorizeButtonIfUnread = function () {
		const btn = document.getElementById('toggleChannelsBtn')
		const interval = setInterval(function () {
			const unreads = document.getElementsByClassName(unreadClass).length
			if (unreads > 0) {
				btn.style.color = '#f04747'
			} else {
				btn.style.color = '#43b581'
			}
		}, 1000)
	}

	const main = function () {
		console.log('[*] Loading Discord Toggle Channenels Bar Userscript')
		const newBtn = createSidebarButton()
		const cotainer = document.getElementsByClassName(showHideSidebarButtonParentClass)[0]
		cotainer.insertBefore(newBtn, cotainer.firstChild)
		addListenersToToggleButtons()
		colorizeButtonIfUnread()
	}

	pageload()
})()
