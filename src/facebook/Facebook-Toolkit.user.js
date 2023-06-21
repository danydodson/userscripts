// ==UserScript==
// @name         Facebook: Toolkit
// @version      0.3
// @author       RootDev4 (Chris)
// @description  JavaScript Userscript for Facebook automation
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/raw/main/src/facebook/Facebook-Toolkit.user.js
// @updateURL    https://github.com/danydodson/userscripts/raw/main/src/facebook/Facebook-Toolkit.user.js
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @match        https://www.facebook.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Facebook loading image
const fbLoaderImg = 'https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/GsNJNwuI-UM.gif'

/**
 * Show/hide Facebook image loader next to toolkit menu item
 */
function toggleLoaderImg() {
	try {
		const img = document.querySelector('img#fbToolkitImg')
		if (img.classList.contains('hidden_elem')) {
			img.classList.remove('hidden_elem')
		} else {
			img.classList.add('hidden_elem')
		}
	} catch (exception) {
		console.error(exception)
	}
}

/**
 * Get numeric Facebook user ID
 */
function getUserId() {
	try {
		const pagelet = document.getElementById('pagelet_timeline_main_column')
		return JSON.parse(pagelet.getAttribute('data-gt')).profile_owner
	} catch (exception) {
		console.error(exception)
		alert('Getting Facebook user ID failed.\nSee console log for details.')
	}
	return 0
}

/**
 * Show numeric Facebook user ID on timeline cover
 */
function showUserId() {
	try {
		const userIdNode = document.createElement('span')
		userIdNode.innerHTML = `<span style="color:#fff; font-size:120%;">Facebook ID: ${getUserId()}</span>`
		document.getElementById('fb-timeline-cover-name').parentNode.parentNode.append(userIdNode)
	} catch (exception) {
		console.error(exception)
		alert('Showing Facebook user ID on timeline cover failed.\nSee console log for details.')
	}
}

/**
 * Get user's name
 */
function getUsername() {
	try {
		return document.querySelector('span#fb-timeline-cover-name a').innerText
	} catch (exception) {
		console.error(exception)
	}

	return null
}

/**
 * Extract Facebook vanity username out of user's profile URL
 * @param {*} userUrl User's profile URL
 */
function getVanityName(userUrl) {
	try {
		const name = /facebook.com\/(.*?)\?/g.exec(userUrl)[1] || null
		if (name !== null && !name.contains('profile.php')) return name
	} catch (exception) {
		console.error(exception)
	}

	return null
}

/**
 * Scroll user timeline
 */
function scrollTimeline() {
	try {
		if (document.getElementById('timeline_tab_content')) {
			toggleLoaderImg()

			let task = setInterval(() => {
				window.scrollBy(0, document.body.scrollHeight)

				if (document.querySelector('div[id^="timeline_pager_container_"] div i.img')) {
					clearInterval(task)
					window.scrollBy(0, document.body.scrollHeight)
					window.scrollTo(0, 0)

					toggleLoaderImg()
					alert('Auto scrolling finished')
				}
			}, 100)
		} else {
			throw 'Scrolling timeline failed. Cannot find selectors.'
		}
	} catch (exception) {
		console.error(exception)
		alert('Please open the timeline of this user.\nSee console log for details.')
	}
}

/**
 * Expand hidden content like comments etc.
 */
function expandTimeline() {
	try {
		if (document.getElementById('timeline_tab_content')) {
			toggleLoaderImg()

			let expand = setInterval(() => {
				document.querySelectorAll('a._4sxc._42ft, a._5v47.fss, a.see_more_link').forEach(node => node.click())

				if (!document.querySelectorAll('a._4sxc._42ft').length) {
					clearInterval(expand)
					window.scrollTo(0, 0)

					toggleLoaderImg()
					alert('All content expanded')
				}
			}, 100)
		} else {
			throw 'Expanding hidden content on user\'s timeline failed. Cannot find selectors.'
		}
	} catch (exception) {
		console.error(exception)
		alert('Expanding hidden content failed.\nSee console log for details.')
	}
}

/**
 * Scrape friends/followers of an user
 */
function friendScraper() {
	return new Promise((resolve, reject) => {
		try {
			let scrollContent = setInterval(() => {
				window.scrollBy(0, document.body.scrollHeight)

				const followers = document.querySelector('div#pagelet_collections_followers') ? true : false
				const moreMedleys = document.querySelectorAll('div[id^="pagelet_timeline_medley"]:not(#pagelet_timeline_medley_friends)')

				if ((!followers && moreMedleys.length) || (followers && document.querySelector('div.morePager') === null)) {
					clearInterval(scrollContent)
					window.scrollBy(0, document.body.scrollHeight)
					window.scrollTo(0, 0)

					// Fetch friends/followers
					const collection = (followers) ? document.querySelector('div#pagelet_collections_followers') : document.querySelector('div#pagelet_timeline_medley_friends')
					const friends = (followers) ? collection.querySelectorAll('li.fbProfileBrowserListItem > div') : collection.querySelectorAll('div[data-testid="friend_list_item"]')
					let counter = 0
					let friendsList = []

					if (!friends.length) resolve({ type: null, list: friendsList })

					friends.forEach(friend => {
						const userData = friend.querySelector('a[data-hovercard^="/ajax/hovercard/"]')
						const userID = /\/ajax\/hovercard\/user.php\?id=(.*?)\&/g.exec(userData.getAttribute('data-hovercard'))[1] || ''
						const vanityName = (userData.href.includes('profile.php')) ? '' : /facebook.com\/(.*?)\?/g.exec(userData.href)[1] || ''
						const userName = userData.querySelector('img[aria-label]').getAttribute('aria-label') || ''

						friendsList.push({ id: userID, vanity: vanityName, name: userName })
						counter += 1
						const enumType = (followers) ? 'Followers' : 'Friends'

						if (counter >= friendsList.length) resolve({ listtype: enumType, list: friendsList })
					})
				}
			}, 100)
		} catch (exception) {
			reject(exception)
		}
	})
}

/**
 * Extract friend/follower list of an user
 */
function extractFriends() {
	try {
		if (document.getElementById('medley_header_friends')) {
			toggleLoaderImg()

			friendScraper()
				.then(friends => {
					toggleLoaderImg()
					if (!friends.list.length) return alert('No visible friends to extract.')

					let csv = 'UserID,VanityName,UserName'
					friends.list.forEach(friend => csv += `<br>${friend.id},${friend.vanity},${friend.name}`)
					document.write(csv)

					console.log(`Extracted ${friends.list.length} friends.`)
				})
				.catch(error => {
					throw error
				})
		} else {
			throw 'Friendlist extraction failed. Cannot find selectors.'
		}
	} catch (exception) {
		console.error(exception)
		alert('Please open the friends section of this user.\nSee console log for details.')
	}
}

/**
 * Scrape photos of an user
 */
function photoScraper() {
	return new Promise((resolve, reject) => {
		try {
			let scrollContent = setInterval(() => {
				window.scrollBy(0, document.body.scrollHeight)

				if (document.querySelectorAll('div[id^="pagelet_timeline_medley"]:not(#pagelet_timeline_medley_photos').length) {
					clearInterval(scrollContent)
					window.scrollBy(0, document.body.scrollHeight)
					window.scrollTo(0, 0)

					// Fetch URL of all photos
					const collection = document.querySelector('div#pagelet_timeline_medley_photos')
					const photos = collection.querySelectorAll('li.fbPhotoStarGridElement')
					let counter = 0
					let album = []

					if (!photos.length) resolve(album)

					photos.forEach(photo => {
						album.push(photo.getAttribute('data-starred-src'))
						counter += 1

						if (counter >= photos.length) resolve(album)
					})
				}
			}, 100)
		} catch (exception) {
			reject(exception)
		}
	})

}

/**
 * Expand hidden content like comments etc.
 */
function downloadPhotos() {
	try {
		if (document.getElementById('pagelet_timeline_medley_photos')) {
			toggleLoaderImg()

			photoScraper()
				.then(photos => {
					toggleLoaderImg()
					if (!photos.length) return alert('No visible photos to download.')

					let album = `<h1>Photos of ${getUsername()}</h1>`
					album += `<h3>Please save website to your computer (Ctrl+S) to download all photos.</h3>`
					photos.forEach(photo => album += `<img src="${photo}" style="max-width: 400px">`)
					document.write(album)
				})
				.catch(error => {
					throw error
				})
		} else {
			throw 'Photo extraction failed. Cannot find selectors.'
		}
	} catch (exception) {
		console.error(exception)
		alert('Please open the photos section of this user.\nSee console log for details.')
	}
}

/**
 * Hide an element from DOM
 * @param {*} cssSelector DOM node identified by CSS selector
 */
function hide(cssSelector) {
	try {
		let selector = cssSelector
		let pNode = false

		if (selector.includes(':parent')) {
			pNode = true
			selector = selector.replace(':parent', '')
		}

		document.querySelectorAll(selector).forEach(element => {
			if (element != null) {
				if (pNode) element = element.parentNode
				element.style.display = 'none'
			}
		})
	} catch (exception) {
		console.error(exception)
	}
}

/**
 * Clear/anonymize timeline
 */
function clearTimeline() {
	hide('form.commentable_item div._1dnh') // Like/Share buttons
	hide('form.commentable_item div:last-child > div.clearfix') // Comment input field
	hide('button.PageLikeButton:parent') // "Like Page" button
	hide('a[data-testid="post_chevron_button"]:parent') // Post options menu
	hide('div#pagelet_bluebar') // Facebook top bluebar
	hide('div#pagelet_timeline_profile_actions')
	hide('div#profile_timeline_overview_switcher_pagelet')
	hide('div#timeline_sticky_header_container')
	hide('ul[data-referrer="timeline_light_nav_top"]')
	hide('div#pagelet_escape_hatch') // Follow profile
	hide('a[href="/subscriptions/suggestions/"]') // "Find People to Follow" link
	hide('a[ajaxify*="/ajax/follow/follow_profile.php"]') // Follow button in followers list
	hide('a[href="/find-friends/browser/"]:parent') // "Friend Requests / Find Friends" buttons
	hide('button[aria-label="Manage"]:parent') // Manage sections button
	hide('div#pagelet_pymk_timeline')
	hide('div#pagelet_timeline_composer')
	// Add more elements here...
}

/**
 * Insert toolkit menu item and flyout into Facebook bluebar
 */
function init() {
	return new Promise((resolve, reject) => {
		try {
			const menuItem = document.querySelector('div[role="navigation"] > div')
			const newItem = document.createElement('div')

			newItem.classList.add('_4kny', '_2s24')
			newItem.innerHTML = `<!--Facebook Toolkit by RootDev4-->
                <div class="uiToggle _cy7 _3nzl">
                    <a class="_2s25" rel="toggle" href="#" role="button" data-target="fbToolkitFlyout">
                        <img src="${fbLoaderImg}" class="hidden_elem" style="margin-right: 8px;" id="fbToolkitImg">
                        <span>Toolkit</span>
                    </a>
                    <div class="__tw toggleTargetClosed _3nzk" role="dialog" id="fbToolkitFlyout" style="margin: 5px 10px 0 0; width: 160px">
                        <div class="beeperNub"></div>
                        <ul style="padding: 10px">
                            <li style="padding: 3px"><a href="#" id="fbToolkitUserId">Get numeric user ID</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitIdCover">Show user ID on cover</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitScroll">Scroll user timeline</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitExpand">Expand hidden content</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitFriends">Extract user's friendlist</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitPhotos">Download user's photos</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitClear">Clear user profile</a></li>
                            <hr>
                            <li style="padding: 3px"><a href="#" id="fbToolkitBottom" onclick="window.scrollTo(0, body.scrollHeight)">Jump to page bottom</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitTop" onclick="window.scrollTo(0, 0)">Jump to page top</a></li>
                            <li style="padding: 3px"><a href="#" id="fbToolkitReload" onclick="location.reload(true)">Force page reload</a></li>
                            <hr>
                            <li style="padding: 3px"><a href="https://github.com/RootDev4/Facebook-Toolkit" id="fbToolkitHelp" target="_blank">About & Help</a></li>
                        </ul>
                    </div>
                </div>`

			resolve(menuItem.appendChild(newItem))
		} catch (exception) {
			reject(exception)
		}
	})
}

/**
 * Run Facebook toolkit and add click listeners after initialization
 */
window.onload = () => {
	try {
		if (document.getElementById('pagelet_timeline_main_column')) {
			init()
				.then(() => {
					// Close flyout menu on menu item click
					const flyout = document.querySelector('a[data-target="fbToolkitFlyout"]')
					const menuItems = document.querySelectorAll('a[id^="fbToolkit"]')
					menuItems.forEach(item => item.addEventListener('click', () => flyout.click()))

					// Add click event listener to every menu item
					document.querySelector('a#fbToolkitUserId').addEventListener('click', () => alert(getUserId()))
					document.querySelector('a#fbToolkitIdCover').addEventListener('click', () => showUserId())
					document.querySelector('a#fbToolkitScroll').addEventListener('click', () => scrollTimeline())
					document.querySelector('a#fbToolkitExpand').addEventListener('click', () => expandTimeline())
					document.querySelector('a#fbToolkitFriends').addEventListener('click', () => extractFriends())
					document.querySelector('a#fbToolkitPhotos').addEventListener('click', () => downloadPhotos())
					document.querySelector('a#fbToolkitClear').addEventListener('click', () => clearTimeline())
				}).catch(exception => {
					throw exception
				})
		}
	} catch (exception) {
		console.error(exception)
		alert('Facebook Toolkit failed, please reload page.\nSee console log for details.')
	}
}
