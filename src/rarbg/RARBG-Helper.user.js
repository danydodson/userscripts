// ==UserScript==
// @name                  RARBG: Helper
// @version               1.7.5
// @author                PeratX
// @description           Powerful Toolbox for RARBG
// @namespace             https://github.com/danydodson/userscripts
// @icon                  https://rargb.to/favicon.ico
// @downloadURL           https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Helper.user.js
// @updateURL             https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Helper.user.js
// @license               Apache License 2.0
// @connect               *
// @grant                 GM_xmlhttpRequest
// @include               https://rarbg.how/*
// @include               https://rargb.to/*
// @include               https://www2.rarbggo.to/*
// @include               https://rarbg.proxyninja.org
// @include               https://www.rarbgproxy.to/*
// @include               https://rarbgproxy.to/*


// ==/UserScript==

(async () => {
	"use strict"

	const settings = {
		downloadImg: '<img src="//dyncdn.me/static/20/img/16x16/download.png" style="height:12px;margin-bottom:-2px;" />',
		loadInfoOnHover: (typeof localStorage.getItem("loadInfoOnHover") === 'string' ? !!localStorage.getItem("loadInfoOnHover") : true),
		localStorageMaxEntries: 1000,
		magnetImg: '<img src="//dyncdn.me/static/20/img/magnet.gif" style="height:12px;margin-bottom:-2px;" />',
		modifications: [
			{
				ref: '#description img[src*="22pixx.xyz/os/"], #description img[src*="22pixx.xyz/rs/"], #description img[src*="22pixx.xyz/s/"]',
				handler(img) {
					img.src = img.src.replace(new RegExp(/\.xyz\/os\//), ".xyz/o/")
					img.src = img.src.replace(new RegExp(/\.xyz\/rs\//), ".xyz/r/")
					img.src = img.src.replace(new RegExp(/\.xyz\/s\//), ".xyz/i/")

					img.style.maxWidth = "unset"
					img.style.width = "100%"
				},
			},
			{
				ref: '#description img[src*="imagecurl.com/images/"]',
				handler(img) {
					img.src = img.src.replace(new RegExp(/_thumb\./), ".")

					img.style.maxWidth = "unset"
					img.style.width = "100%"
				},
			},
			{
				ref: '#description img[src*="freebunker.com/tn/t"], #description img[src*="imgcarry.com/tn/t"], #description img[src*="imgshots.com/tn/t"], #description img[src*="imagesnake.com/tn/t"], #description img[src*="pornbus.org/tn/t"]',
				handler(img) {
					img.src = img.src.replace(new RegExp(/\/tn\/t/), "tn/i")

					img.style.maxWidth = "unset"
					img.style.width = "100%"
				},
			},
			{
				ref: '#description img[src*="imgprime.com/uploads/"]',
				handler(img) {
					img.src = img.src.replace(new RegExp(/\/small\//), "/big/")

					img.style.maxWidth = "unset"
					img.style.width = "100%"
				},
			},
		],
		options: `<div style="align-items:center;display:flex;flex-direction:row;justify-content:center;">RARBG Helper&nbsp;<iframe src="//ghbtns.com/github-btn.html?user=PeratX&amp;repo=RARBGHelper&amp;type=star&amp;count=true" frameborder="0" style="height:20px;width:120px;"></iframe>&nbsp;<input onchange='javascript:(()=>localStorage.setItem("loadInfoOnHover",this.checked?"1":""))();' type="checkbox" />&nbsp;show more options on hover</div>`,
	}

	let headerNode
	if (document.querySelector("#searchTorrent"))
		headerNode = document.querySelector("#searchTorrent")?.closest("form")
	else if (document.querySelector('td[align="center"] > b')?.innerText?.match(/top 100? torrents/i))
		headerNode = document.querySelector('td[align="center"] > b')?.closest("table")

	if (headerNode) {
		headerNode.innerHTML = settings.options + headerNode.innerHTML
		headerNode.querySelector('input[type="checkbox"]').checked = settings.loadInfoOnHover
	} else
		for (const modification of settings.modifications)
			if (modification.handler)
				for (const ref of document.querySelectorAll(modification.ref) || [])
					modification.handler(ref)

	document.onmousemove = (e) => {
		let xoff = e.pageX + xoffset
		let yoff = e.pageY + yoffset

		if (pop.children[0]) {
			const top = document.scrollingElement.scrollTop + document.scrollingElement.clientHeight - pop.children[0].height - 10
			if (yoff > top) yoff = top
		}

		pop.style.left = xoff + "px"
		pop.style.top = yoff + "px"
	}

	const opened = JSON.parse(localStorage.getItem("opened") || "[]")
	const viewed = JSON.parse(localStorage.getItem("viewed") || "[]")

	setTimeout(() => {
		for (let node of document.querySelectorAll('.lista2 > td:nth-child(2) > a[href^="/torrent/"], .lista_related a[href^="/torrent/"]') || []) {
			const borderNode = node.closest("tr")?.firstElementChild

			if (viewed.includes(node.href)) borderNode.style.borderLeft = "2px solid yellow"
			else viewed.push(node.href)

			if (opened.includes(node.href)) borderNode.style.borderLeft = "2px solid red"

			const onMouseOver = node.attributes.onmouseover
			if (!onMouseOver) continue

			if (settings.loadInfoOnHover)
				node.addEventListener("mouseover", () => addSuffix(node))

			const parts = onMouseOver.value.split("/")
			switch (parts[3]) {
				case "static": {
					switch (parts[4]) {
						case "over": // 18+
							onMouseOver.value = onMouseOver.value.replace("static/over", "posters2/" + parts[5].substr(0, 1))
							break

						case "20": // tvdb
							onMouseOver.value = onMouseOver.value.replace("_small", "_banner_optimized")
							break
					}

					break
				}

				case "mimages": // movie
					onMouseOver.value = onMouseOver.value.replace("over_opt", "poster_opt")
					break
			}
		}
	})

	if (location.href.match(/https?:\/\/[^\/]*rarbg[^\/]*\.[a-z]{2,4}\/torrent\/[^\/\?]+/) && !opened.includes(location.href))
		opened.push(location.href)

	localStorage.setItem("opened", JSON.stringify(opened.slice(~settings.localStorageMaxEntries + 1)))
	localStorage.setItem("viewed", JSON.stringify(viewed.slice(~settings.localStorageMaxEntries + 1)))
})()
