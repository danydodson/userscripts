// ==UserScript==
// @name         Discord: Bypass Nsfw
// @description  discord bypass nsfw
// @author       chirag-droid<chirag.singla.pi@gmail.com>
// @version      1.0.0
// @namespace    Nounce Scripts
// @iconURL      https://i.ibb.co/7znt13j/30162036.png
// @match        https://discord.com/*
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @run-at       document-start
// @grant        none
// ==/UserScript==

VM.observe(document.body, () => {
	if (window.webpackChunkdiscord_app) {
		var findModule = (item) => window.webpackChunkdiscord_app.push([[Math.random()], {}, (req) => { for (const m of Object.keys(req.c).map((x) => req.c[x].exports).filter((x) => x)) { if (m.default && m.default[item] !== undefined) return m.default } }])
		findModule('getCurrentUser').getCurrentUser().nsfwAllowed = true
		return true
	}
})