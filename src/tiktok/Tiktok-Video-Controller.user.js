// ==UserScript==
// @name            Tiktok: Video Controller
// @namespace       https://www.tiktok.com/*
// @version         1.1
// @author          danydodson
// @description     Turn down the volume & loop video
// @match           https://www.tiktok.com/*
// @grant           none
// @icon            https://www.google.com/s2/favicons?domain=tiktok.com
// ==/UserScript==

let modifyVideo = (player) => {
	let classesToRemove = ["event-delegate-mask", "style-layer-mask", "mute-icon", "toggle-icon"]

	let videoCard = player.parentElement

	for (let cls of classesToRemove) {
		for (let element of videoCard.getElementsByClassName(cls)) {
			element.remove()
		}
	}

	// console.log(player)

	var videoParent = document.querySelector('div[class*="-DivVideoPlayerContainer"]')
	console.log(videoParent)

	var cssClassVideoControl = document.querySelector('div[class*="-DivVideoControlContainer"]')
	//cssClassVideoControl.innerHTML = ''

	var cssClassControlTop = document.querySelector('div[class*="-DivVideoControlTop"]')
	cssClassControlTop.innerHTML = ''

	var cssClassControlBottom = document.querySelector('div[class*="-DivVideoControlBottom"]')
	cssClassControlBottom.innerHTML = ''

	var cssClassVoiceControl = document.querySelector('div[class*="-DivVoiceControlContainer"]')
	cssClassVoiceControl.innerHTML = ''

	player.setAttribute("volume", 0.09)
	player.setAttribute("controls", null)
	player.setAttribute("loop", true)

}

var observer = new MutationObserver((mutations) => {
	for (let mutation of mutations) {
		for (let node of mutation.addedNodes) {
			if (node.nodeName == "VIDEO") modifyVideo(node)
		}
	}
})

observer.observe(document, {
	childList: true,
	subtree: true
})