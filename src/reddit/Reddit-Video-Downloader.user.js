// ==UserScript==
// @name         Reddit: Video Downloader
// @namespace    https://lawrenzo.com/p/reddit-video-downloader
// @version      0.7.0
// @description  Adds button to direct link or download the stupidly hard to save or share directly reddit videos. Designed to work on new Reddit only. Buttons appear when viewing the specific post -- does not work on preview/expand on post listing pages.
// @author       Lawrence Sim
// @license      WTFPL (http://www.wtfpl.net)
// @grant        unsafeWindow
// @match        *://*.reddit.com/*
// @icon            https://www.google.com/s2/favicons?domain=reddit.com
// @noframes
// ==/UserScript==

'use strict';

(function () {
	var defaultStyles = {
		"margin": "0.4em",
		"font-size": "0.8em",
		"padding": "0.4em 0.6em",
		"border-radius": "4px",
		"border": "1px solid #d9d9d9",
		"background": "#fff",
		"cursor": "pointer"
	}
	function createBtn(parent, opts) {
		let btn = document.createElement("button")
		btn.innerHTML = opts.html
		for (let key in defaultStyles) {
			btn.style[key] = defaultStyles[key]
		}
		if (opts.disabled) {
			btn.disabled = true
			btn.style.background = "#bbb"
			btn.style.cursor = "wait"
		}
		if (opts.href) btn.addEventListener('click', () => window.open(opts.href))
		parent.append(btn)
		return btn
	}
	var removeWatchers = []
	function watchForRemoval(watchElem, parentElem) {
		let watcher = new MutationObserver(mutated => {
			let wasRemoved = false
			mutated.forEach(mutant => {
				wasRemoved || mutant.removedNodes.forEach(removed => {
					wasRemoved = wasRemoved || removed === watchElem
				})
			})
			if (wasRemoved) parentElem.append(watchElem)
		})
		watcher.observe(parentElem, { childList: true })
		removeWatchers.push(watcher)
	}
	function clearRemoveWatchers() {
		removeWatchers.forEach(obs => obs.disconnect())
		removeWatchers = []
	}
	function addLinks() {
		let contentDiv = document.querySelector("[data-test-id='post-content']"),
			videoElem = contentDiv && contentDiv.querySelector("video")
		if (!videoElem) {
			videoElem = contentDiv && contentDiv.querySelector("shreddit-player")
		}
		if (!videoElem) {
			removeWatchers.forEach(obs => obs.disconnect())
			removeWatchers = []
			return
		}
		if (videoElem.getAttribute("vlinked")) return
		videoElem.setAttribute("vlinked", 1)
		// gifs and mp4s in video player can be directly linked
		let source = videoElem.querySelector("source")
		if (source && source.src && (~source.src.search(".gif") || ~source.src.search(".mp4"))) {
			let buttonRow = document.createElement("div")
			contentDiv.append(buttonRow)
			let directBtn = createBtn(buttonRow, {
				href: source.src,
				html: "Download"
			})
			watchForRemoval(buttonRow, contentDiv)
			videoElem.setAttribute("vlinked", 1)
			return
		}
		// add buttons
		let buttonRow = document.createElement("div")
		contentDiv.append(buttonRow)
		let directBtn = createBtn(buttonRow, {
			html: "Sourcing video...",
			disabled: true
		})
		createBtn(buttonRow, {
			href: window.location.href.replace(/reddit.com\//, "redditsave.com/info?url="),
			html: "Download via RedditSave"
		})
		createBtn(buttonRow, {
			href: window.location.href.replace(/reddit.com/, "reddit.tube"),
			html: "Download via Reddit.Tube"
		})
		watchForRemoval(buttonRow, contentDiv)
		let i = 0,
			animateBtn = setInterval(() => {
				i = ++i > 3 ? 1 : i
				directBtn.innerHTML = "Sourcing video" + (".".repeat(i)) + "&nbsp;".repeat(3 - i)
			}, 750)
		// fetch post info JSON for direct video link
		fetch(window.location.href.split("?")[0].replace(/\/$/, "") + ".json")
			.then(res => {
				if (!res || !res.ok) throw Error((res && res.statusText) || "Fetch error")
				return res.json()
			})
			.then(json => {
				let postData, vidData
				try {
					postData = json[0].data.children[0].data
					if (!postData.secure_media && postData.crosspost_parent_list && postData.crosspost_parent_list.length) {
						postData = postData.crosspost_parent_list[0]
					}
					vidData = postData.secure_media.reddit_video
				} catch (e) { }
				clearInterval(animateBtn)
				if (!vidData) {
					directBtn.innerHTML = "Error pulling source"
					directBtn.style.cursor = "default"
					console.log(postData || json)
				} else {
					console.log(vidData)
					directBtn.innerHTML = "Direct Video Link (no sound)"
					directBtn.addEventListener('click', () => window.open(vidData.fallback_url))
					directBtn.disabled = false
					directBtn.style.background = defaultStyles.background
					directBtn.style.cursor = defaultStyles.cursor
				}
			})
			.catch(err => {
				clearInterval(animateBtn)
				console.log(err)
			})
	}
	addLinks()
	let redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher)
	if (redditWatcher) {
		redditWatcher.body.onUpdate(addLinks)
		redditWatcher.feed.onChange(clearRemoveWatchers)
	}
	let lastFirstPost = null;
	(new MutationObserver(() => {
		addLinks()
		let listing = document.querySelector(".ListingLayout-outerContainer"),
			firstPost = listing && listing.querySelector("div[data-testid='post-container']")
		if (firstPost !== lastFirstPost) {
			lastFirstPost = firstPost
			clearRemoveWatchers()
		}
	}))
		.observe(document.body, { childList: true, subtree: true })
})()