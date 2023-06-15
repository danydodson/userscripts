// ==UserScript==
// @name          Reddit: Better Previews
// @namespace     https://lawrenzo.com/p/better-reddit-image-previews
// @version       0.6.4
// @description   Fixes issues with reddit image previews. Specifically, clicking image preview now links directly to image (instead of thread) and fits height of image previews in carousel so they don't get clipped out.
// @author        Lawrence Sim
// @license       WTFPL (http://www.wtfpl.net)
// @grant         unsafeWindow
// @match         *://*.reddit.com/*
// @icon          https://www.google.com/s2/favicons?domain=reddit.com
// @noframes
// ==/UserScript==

'use strict';

(function () {
	function fixImage(img, fixHeight, useSrc) {
		if (!img || img.getAttribute("ifix")) return
		if (fixHeight) {
			img.style.height = "100%"
			img.parentElement.style.height = "100%"
		}
		useSrc = useSrc || img.src.replace("preview.redd.it", "i.redd.it")
		img.addEventListener("click", evt => {
			window.open(useSrc)
			evt.stopPropagation()
			evt.preventDefault()
		})
		img.addEventListener("auxclick", evt => {
			if (evt.button === 1) {
				window.open(useSrc)
				evt.stopPropagation()
				evt.preventDefault()
			}
		})
		img.setAttribute("ifix", 1)
	}
	function fixPost(container) {
		container.querySelectorAll("img[alt='Post image']")
			.forEach(img => {
				let post = img.closest("[data-testid='post-container']"),
					link = post && post.querySelector("a[data-testid='outbound-link']")
				fixImage(img, false, link && link.href)
			})
		let gallery = container.querySelector("ul")
		if (gallery) {
			galleryWatcher.observe(gallery, { childList: true, subtree: true })
			gallery.querySelectorAll("li figure img")
				.forEach(img => fixImage(img, true))
		}
	}
	//-------------------------------------------------------------------------------------
	// post and gallery watchers
	//-------------------------------------------------------------------------------------
	var postWatcher = new MutationObserver(mutated => {
		mutated.forEach(mutant => {
			mutant.addedNodes.forEach(node => node.querySelectorAll && fixPost(node))
		})
	})
	var galleryWatcher = new MutationObserver(mutated => {
		mutated.forEach(mutant => {
			mutant.addedNodes.forEach(node => node.nodeName == "IMG" && fixImage(node, true))
		})
	})
	//-------------------------------------------------------------------------------------
	// processing and reset
	//-------------------------------------------------------------------------------------
	var lastNow = Date.now()
	function processNodes(nodes) {
		if (!nodes) return
		nodes.forEach(node => {
			if (!node || !node.querySelectorAll) return
			node.querySelectorAll("div[data-testid='post-container']")
				.forEach(post => {
					let ifixNow = post.getAttribute("ifix")
					if (ifixNow && parseInt(ifixNow) === lastNow) return
					let postbg = post.querySelector("[data-click-id='background']")
					if (postbg) {
						fixPost(postbg)
						postWatcher.observe(postbg, { childList: true })
					}
					post.setAttribute("ifix", lastNow)
				})
		})
	}
	function reset(feed) {
		galleryWatcher.disconnect()
		postWatcher.disconnect()
		lastNow = Date.now()
		if (feed) processNodes([feed])
	}
	//-------------------------------------------------------------------------------------
	// if using reddit watcher
	//-------------------------------------------------------------------------------------
	let redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher)
	if (redditWatcher) {
		processNodes([document.querySelector(".ListingLayout-outerContainer")])
		redditWatcher.feed.onChange(feed => reset(feed))
		redditWatcher.feed.onUpdate((feed, mutated) => {
			mutated && mutated.forEach(mutant => processNodes(mutant.addedNodes))
		})
		return
	}
	//-------------------------------------------------------------------------------------
	// if not using reddit watcher, have to create feed watchers
	//-------------------------------------------------------------------------------------
	function getFeedWrapper() {
		let listingLayout = document.querySelector(".ListingLayout-outerContainer"),
			firstPost = listingLayout && listingLayout.querySelector("div[data-testid='post-container']"),
			feedWrapper = firstPost && firstPost.parentNode
		while (feedWrapper && !feedWrapper.nextSibling) {
			if (feedWrapper == listingLayout) return null
			feedWrapper = feedWrapper.parentNode || null
		}
		return feedWrapper && feedWrapper.parentNode
	}
	processNodes([getFeedWrapper()])
	var feedWatcher = new MutationObserver(mutated => mutated.forEach(mutant => processNodes(mutant.addedNodes))),
		lastFirstPost = null;
	(new MutationObserver(() => {
		let feedWrapper = getFeedWrapper(),
			firstPost = feedWrapper && feedWrapper.children[0]
		if (firstPost !== lastFirstPost) {
			reset(feedWrapper)
			feedWatcher.disconnect()
			feedWatcher.observe(feedWrapper, { childList: true })
			lastFirstPost = firstPost
		}
	})).observe(document.body, { childList: true, subtree: true })
})()