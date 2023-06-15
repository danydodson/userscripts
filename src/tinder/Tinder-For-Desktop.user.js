// ==UserScript==
// @name         Tinder: For Desktop
// @namespace    https://greasyfork.org/en/scripts/36887/versions/new
// @version      1.7
// @description  When using Tinder on desktop there is need to manually open each new candidates profiles and browse their photos. This script automates it! Just enjoy swaping with just left and right arrows :)
// @author       https://github.com/trzye
// @match        tinder.com
// @match        tinder.com/app/recs
// @match        tinder.com/app/recs/profile
// @match        tinder.com/app/matches
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tinder.com
// @grant        none
// ==/UserScript==

let isOn = true
let slow = 750
let fast = 1750
let actualSpeed = fast
let startupInterval = window.setInterval(startup, actualSpeed)

function startup() {
	let navElement = document.getElementsByTagName("nav")[0]
	if (navElement != undefined) {
		let tinderScript = window.setInterval(tinderscript, actualSpeed)

		let onOffButton = document.createElement("button")
		onOffButton.innerHTML = "Click HERE to turn ON/OFF TinderScript"
		onOffButton.onclick = function () { isOn = !isOn }

		navElement.appendChild(onOffButton)
		navElement.insertBefore(onOffButton, navElement.firstChild)

		let speedButton = document.createElement("button")
		speedButton.innerHTML = "Click HERE to change TinderScript speed"
		speedButton.onclick = function () {
			if (actualSpeed == fast) {
				actualSpeed = slow
			} else {
				actualSpeed = fast
			}
			window.clearInterval(tinderScript)
			tinderScript = window.setInterval(tinderscript, actualSpeed)
		}

		navElement.appendChild(speedButton)
		navElement.insertBefore(speedButton, navElement.firstChild)

		window.clearInterval(startupInterval)
	}
}

function tinderscript() {
	let element = document.querySelectorAll("[class*=sendMessageForm__input]")[0]
	if (!element && isOn) {
		element = document.querySelectorAll("[class*=recCard__openProfile]")[0]
		if (element !== undefined) {
			element.click()
		}
		else {
			element = document.querySelectorAll("[class*=pageButton]")[1]
			if (element !== undefined) {
				element.click()
			}
		}
	}
}
