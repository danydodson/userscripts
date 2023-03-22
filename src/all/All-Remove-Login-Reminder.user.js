// ==UserScript==
// @name              All: Remove Login Reminder
// @namespace         StephenP
// @description       Removes the nagging login popups and banners from mobile and desktop versions of Facebook, Instagram, Reddit, Twitter, Quora, Ask.fm, VK, Pinterest, Tumblr, Twitch and from the mobile versions of Youtube and TikTok.
// @match             https://*.facebook.com/*
// @exclude           https://developers.facebook.com/*
// @exclude           https://www.instagram.com/privacy/checks/*
// @exclude           https://twitter.com/intent/tweet?*
// @exclude           https://mobile.twitter.com/intent/tweet?*
// @match             https://www.instagram.com/*
// @match             https://m.youtube.com/*
// @match             https://www.youtube.com/*
// @match             https://www.reddit.com/*
// @match             https://twitter.com/*
// @match             https://mobile.twitter.com/*
// @match             https://*.quora.com/*
// @match             https://ask.fm/*
// @match             https://vk.com/*
// @match             https://m.vk.com/*
// @match             https://*.tumblr.com/*
// @match             https://www.twitch.tv/*
// @match             https://www.tiktok.com/*/video/*
// @include           https://www.pinterest.tld/*
// @version           2.7.13
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.registerMenuCommand
// @contributionURL   https://nowpayments.io/donation/stephenpgreasyfork
// @icon              data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAG1BMVEXTrvFOWZTEN4aXQ6vcRGPsbUH2sVjlt7/////5Q3C9AAAAAXRSTlMAQObYZgAAANJJREFUKM+9z7EKwjAQgOFIqbPFpXMUmlHMoKsQsKtgsC9g3WMkWS2V3GN7SZrQwdl/68fdlRBCFtWac74jqYLHsvBUHjiA75lGCm6dMca6BPzg9hSzajPBcQjfbKAJFLXgTJOBqQYMqAx7pnCaDRko060W5xGhwlZk20Y4R6iIaHU3inYG3euGR3UG2b0k/lYg1AABPhLDTQoRbs7D1SYoJcTHCQZvf6PsH+H5GiEcJb0Pd0Q9wdLDXV5PdVyZRF7CYgDMz/6E9xyqdPR/sMiw+gKZRGTvTIJM4gAAAABJRU5ErkJggg==
// ==/UserScript==

var interval_0
var interval_1
var interval_2
var interval_3
var interval_4
var mutationObserver_0
var url
var disabledSites = []
var l
const jsonLocalization = JSON.parse(`
{
    "en": {
        "disableFor": "Disable for ",
        "enableFor": "Enable again for ",
				"disabledSites": "Disabled sites: ",
				"isDisabled": " is currently disabled.",
				"isNotDisabled": " isn't currently disabled.",
        "igBanNote": "If the page doesn't load anymore, your IP may have been temporarily limited from anonymous Instagram browsing. If you still need to view the page, you can try using one of the external services listed below:"
	},
    "it": {
        "disableFor": "Disabilita per ",
        "enableFor": "Abilita nuovamente per ",
				"disabledSites": "Siti disabilitati: ",
				"isDisabled": " è attualmente disabilitato.",
				"isNotDisabled": " non è attualmente disabilitato.",
        "igBanNote": "Se la pagina non carica oltre, il tuo indirizzo IP potrebbe essere stato temporaneamente limitato dalla navigazione anonima su Instagram. Se hai comunque bisogno di vedere la pagina, puoi provare usando uno dei servizi esterni elencati qui sotto:"
    }
}
`);
(async function () {
	let lang = getLang()
	if (lang.startsWith("it")) {
		l = jsonLocalization.it
	}
	else {
		l = jsonLocalization.en
	}
	disabledSites = await getDisabledSites()
	if (!disabledSites.includes(document.location.hostname)) {
		GM.registerMenuCommand(l.disableFor + document.location.hostname, changeForThisSite, "D")
		applyUserCss()
		setInterval(checkPageChanged, 1000)
	}
	else {
		GM.registerMenuCommand(l.enableFor + document.location.hostname, changeForThisSite, "E")
	}
})()
async function getDisabledSites() {
	var dS = await GM.getValue("disabledSites")
	console.log(l.disabledSites + dS)
	if (dS) {
		return dS.split(',')
	}
	else {
		return []
	}
}
function getLang() {
	try {
		if (navigator.languages != undefined)
			return navigator.languages[0]
		return navigator.language
	}
	catch (e) {
		return "en"
	}
}
function changeForThisSite() {
	let tS = document.location.hostname
	if (disabledSites.includes(tS)) {
		console.log(tS + l.isDisabled)
		var filtered = disabledSites.filter(function (value) {
			return value !== document.location.hostname
		})
		console.log(filtered)
		disabledSites = filtered
		GM.setValue("disabledSites", filtered.join(","))
		document.location.reload()
	}
	else if (!disabledSites.includes(tS)) {
		console.log(tS + l.isNotDisabled)
		disabledSites.push(tS)
		GM.setValue("disabledSites", disabledSites.join(","))
		document.location.reload()
	}
}
function checkPageChanged() {
	if (document.location != url) {
		console.log("Changed url from " + url + " to " + document.location.toString())
		interval_4 = setInterval(checkPageReady, 500)
		url = document.location.toString()
	}
}
function applyUserCss() {//this function adds the css styling for removing popups to the head of the document, as soon as possible when the page is loaded. Other popups that can't be removed just with css selectors are removed later with the check() function
	let st = document.createElement("STYLE")
	st.id = "LPRStyle"
	if (document.location.href.includes("instagram.com")) {
		st.textContent = ".u7YqG{z-index: 1} .xUdfV{z-index: 2} ._3sb-{z-index: 3} .G_hoz.LcKDX, ._7zNgw.GLdVF{z-index: 2} .FFVAD{z-index: 1} .tWeCl{z-index: 1} .v5DqJ, .RnEpo.Yx5HN, .RnEpo._Yhr4, .xZ2Xk, .tHaIX, nav.kqZqN.e6AxN.JIFNi, .mray0b6k, ._aa9j, ._ab8q._ab8w, .h4m39qi9, [class=x1uhb9sk]{display: none !important} body{overflow-y: scroll !important} .CzVzU>div{z-index: 4} #scrollview{scrollbar-width: unset} html{scrollbar-width: none}"
	}
	else if (document.location.href.includes("twitter.com")) {
		//IF EDITING THIS LIST OF POPUPS, KEEP IT IN SYNC WITH THE POPUPS LISTED blockBannerTw
		st.textContent = "#layers>.css-1dbjc4n.r-aqfbo4.r-1p0dtai.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj>.css-1dbjc4n.r-12vffkv>.css-1dbjc4n.r-12vffkv>.css-1dbjc4n.r-l5o3uw, .css-1dbjc4n.r-1awozwy.r-14lw9ot.r-1dgieki.r-1efd50x.r-5kkj8d.r-18u37iz.r-16y2uox.r-1a1dyw.r-1swwhx3.r-1j3t67a.r-1qxgc49, .css-1dbjc4n.r-1awozwy.r-1kihuf0.r-18u37iz.r-1pi2tsx.r-1777fci.r-1pjcn9w.r-1xcajam.r-ipm5af.r-g6jmlv, .css-1dbjc4n.r-aqfbo4.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj.r-ipm5af{display: none !important}"
	}
	else if (document.location.href.includes("reddit.com")) {
		st.textContent = ".m-blurred, #blocking-modal-blur-container, .control {filter: none !important;} .XPromoNSFWBlocking__warning, .XPromoNSFWBlockingModal, .xPromoChoiceBanner, .XPromoPill, .XPromoPopup, .GetAppFooter, .XPromoInFeed, .XPromoBlockingModal, .PreviewDrawer, [data-testid=bottom-cell-wrapper], shreddit-experience-tree, shreddit-comments-page-ad, xpromo-untagged-content-blocking-modal, xpromo-nsfw-blocking-modal, xpromo-new-nsfw-blocking-modal, xpromo-nsfw-blocking-container [slot=blurred], .XPromoBottomBar, [bundlename=bottom_bar_xpromo], .XPromoPopupRpl, .XPromoBlockingModalRpl {display: none !important} .scroll-disabled {overflow-y: scroll !important; position: static !important} .NavFrame, body,.scroll-is-blocked {overflow-y: scroll !important} body{pointer-events: inherit !important}"
	}
	else if (document.location.href.includes("quora.com/")) {
		st.textContent = "*, #page_wrapper {filter: none !important} .new_signup_dialog, .qu-zIndex--blocking_wall{display: none !important} body, .q-platform--mobile{overflow-y: scroll !important; overflow-x: hidden !important;} .q-sticky{position: inherit !important}"
	}
	else if (document.location.href.includes("https://ask.fm/")) {
		st.textContent = "body{overflow-y: scroll !important} .expired-countdown::after{display: none !important}"
	}
	else if (document.location.href.includes("vk.com/")) {
		st.textContent = "body{overflow-y: scroll !important} .PageBottomBanner--unauth{display: none !important}"
	}
	else if (document.location.href.includes("//m.youtube.com")) {
		st.textContent = ".upsell-dialog-lightbox{display: none !important} [modal-open-body]{position: inherit !important}"
	}
	else if (document.location.href.includes("//www.youtube.com")) {
		st.textContent = "ytd-guide-signin-promo-renderer{display: none !important}"
	}
	else if (document.location.href.includes("facebook.com")) {
		st.textContent = ".asf1osic.k4urcfbm.j9ispegn.poy2od1o.tw6a2znq.m7u2wfa4.d1544ag0.i3j981x3.rlt63pii.i09qtzwb.hybvsw6c, .tlfeazxf, [role=main]+[data-nosnippet], .xixxii4.xh8yej3.x1ey2m1c {display: none !important}"
		if ((!document.location.href.includes("m.facebook.com")) && (!document.location.href.includes("iphone.facebook.com")) && (!document.location.href.includes("x.facebook.com")) && (!document.location.href.includes("touch.facebook.com"))) {
			st.textContent += "#pagelet_growth_expanding_cta{display: none !important}"
		}
		if (document.location.href.includes("/posts/")) {
			st.textContent += "#headerArea{display: none !important}"
		}
		else if (document.location.href.includes("touch.facebook.com")) {
			st.textContent += "._4b-b{display: none !important}"
		}
	}
	else if (document.location.href.includes("quora.com")) {
		st.textContent = ".signup_wall_wrapper>.BaseSignupForm._DialogSignupForm{display: none !important}"
	}
	else if (document.location.href.includes("https://www.pinterest.")) {
		st.textContent = "[data-test-id=bottom-right-upsell], [data-test-id=giftWrap], [data-test-id=fullPageSignupModal], [data-test-id=floating-app-upsell], .FNs.XiG.zI7.iyn.Hsu{display: none !important} .article-row{-ms-overflow-style: auto !important;scrollbar-width: auto !important;} ::-webkit-scrollbar {display: block !important;} ::-webkit-scrollbar-thumb {background: grey;}"
	}
	else if (document.location.href.includes("tumblr.com")) {
		st.textContent = "div.xw7_H.smX3m, div.Lq1wm{display:none} body{overflow-y: scroll !important}"
	}
	else if (document.location.href.includes("twitch.tv")) {
		st.textContent = "#twilight-sticky-footer-root{display:none}"
	}
	else if (document.location.href.includes("tiktok.com")) {
		st.textContent = "[class*=DivTopBannerAB][type=bottom], div.box-border>.z-2000{display:none}"
	}
	document.getElementsByTagName("HEAD")[0].appendChild(st)
	const observer = new MutationObserver(function (mutations_list) {
		mutations_list.forEach(function (mutation) {
			mutation.removedNodes.forEach(function (removed_node) {
				if (removed_node.id == 'LPRStyle') {
					console.log('#child has been removed')
					observer.disconnect()
					applyUserCss()
				}
			})
		})
	})

	observer.observe(document.getElementsByTagName("HEAD")[0], { subtree: false, childList: true })


}
function checkPageReady() {
	if ((document.getElementsByTagName("BUTTON").length > 0) || (document.getElementsByTagName("FORM").length > 0) || (document.getElementsByClassName("signup_login_buttons").length > 0) || (document.getElementsByTagName("shreddit-post").length > 0) || (document.getElementById("layers") !== null) || (document.getElementById("mcont") !== null) || (document.getElementsByTagName("VIDEO").length > 0)) {//If buttons are there, the page should have loaded. At least that's what I see...
		console.log("Page is ready")
		clearInterval(interval_4)
		if (document.location.href.includes("facebook.com")) {
			interval_0 = setInterval(blockPopupFB, 500)
		}
		else if ((document.location.href.includes("instagram.com")) && (!document.location.href.includes("/accounts/login/?next="))) {
			clearInterval(interval_2)
			//The following observer checks if the popup is a login popup or a suggestion to use the app: if that's not the case, the popup is displayed.
			const igPopupObserverConfig = { attributes: false, childList: true, subtree: false }
			const igPopupObserverCallback = function (mutationsList, observeIgPopups) {
				for (const mutation of mutationsList) {
					if (mutation.addedNodes.length > 0) {
						//console.log(mutation);
						if (mutation.addedNodes[0].classList.contains("RnEpo")) {
							//console.log(!mutation.addedNodes[0].querySelector("[name='username']"));
							if ((!mutation.addedNodes[0].querySelector("[name='username']")) && (!mutation.addedNodes[0].querySelector("[href*='/accounts/login/']"))) {
								let style = ""
								if (mutation.addedNodes[0].hasAttribute("style")) {
									style = mutation.addedNodes[0].getAttribute("style")
								}
								mutation.addedNodes[0].setAttribute("style", "display: block !important;" + style)
							}
						}
					}
				}
			}
			const observeIgPopups = new MutationObserver(igPopupObserverCallback)
			observeIgPopups.observe(document.body, igPopupObserverConfig)
			if (!document.querySelector("[href='/direct/inbox/']")) {
				igLoadOutsideNote()
			}
			//interval_1=setInterval(blockBannerIG,200);
			if ((document.location.href.includes('instagram.com/p/')) || (document.location.href.includes('instagram.com/tv/')) || (document.location.href.includes('/reel/'))) {
				if ((document.location.href.includes('/tv/'))) {
					let igtvVideo = document.getElementsByTagName("VIDEO")[0]
					let cln = igtvVideo.cloneNode(true)
					insertAfter(cln, igtvVideo)
					igtvVideo.remove()
				}
				interval_0 = setInterval(allowVideoReplayStarterIG, 500)
			}
			else if (document.location.href.includes('/channel')) {
				if (document.getElementsByClassName("coreSpriteSearchIcon").length > 0) {//only desktop version shows login popup on igtv
					interval_2 = setInterval(removePicturePopupIGTV, 1000)
				}
			}
			else if ((document.location.href.includes('/reels/')) ||
				(document.location.href.includes('/guides/')) ||
				(document.location.href.includes('/guide/'))) {
				//do nothing;
			}
			else {//this should ideally only include the main page of the profile
				//interval_2=setInterval(blockPopupIG,200);
				let sectionLinks = document.getElementsByClassName("_9VEo1")
				for (let sectionLink of sectionLinks) {
					if (sectionLink.href.includes("%2Ffeed%2F")) {
						let tmpSectionLink = sectionLink.cloneNode(true)
						tmpSectionLink.href = document.location.href + "feed/"
						sectionLink = sectionLink.parentNode.replaceChild(tmpSectionLink, sectionLink)
						break
					}
				}
				interval_3 = setInterval(removeRelatedAccounts, 200)
				interval_2 = setInterval(removePicturePopup, 500)
			}
		}
		else if (document.location.href.includes('/accounts/login/?next=')) {
			igLoadOutsideNote()
		}
		else if (document.location.href.includes("reddit.com")) {//reddit has a wide range of different login reminders for installing the app or logging in when browsing from a phone
			if (document.getElementsByTagName("shreddit-app").length > 0) {
				redditPatch(true)//isMobile
			}
			else {
				redditPatch(false)
			}
		}
		else if (document.location.href.includes("quora.com/")) {
			quoraPatchObserver()
		}
		else if (document.location.href.includes("/twitter.com")) {
			blockBannerTW("d")
		}
		else if (document.location.href.includes("mobile.twitter.com")) {
			blockBannerTW("m")
		}
		else if (document.location.href.includes("https://ask.fm/")) {
			removeAskFmLoginPopup()
		}
		else if (document.location.href.includes("https://vk.com/")) {
			checkVKLoginPopup("d")
		}
		else if (document.location.href.includes("https://m.vk.com/")) {
			checkVKLoginPopup("m")
		}
		else if (document.location.href.includes("https://www.pinterest.")) {
			document.body.setAttribute("style", "overflow-y: auto !important")
		}
		else if (document.location.href.includes("tumblr.com")) {
			tumblrDataWallPrevention()
		}
		else if (document.location.href.includes("tiktok.com")) {
			interval_0 = setInterval(tiktok_waitReady, 500)
			interval_1 = setInterval(tiktok_clickList, 500)
		}
	}
	else {
		console.log("still non buttons")
	}
}
function blockPopupFB() {
	var popupFB
	var loc = document.location.href
	if ((loc.includes("m.facebook.com")) || (loc.includes("iphone.facebook.com")) || (loc.includes("x.facebook.com"))) {
		popupFB = document.getElementById("popup_xout").parentNode.parentNode.parentNode
	}
	if (popupFB == undefined) {
		popupFB = document.getElementsByClassName("_5hn6")[0]
		if (popupFB == undefined) {
			popupFB = document.getElementById("login_popup_cta_form").parentNode.parentNode.parentNode.parentNode
			let scrollview = document.getElementById("scrollview")
			if (scrollview) {
				let closePopupButton = document.getElementsByClassName("cypi58rs pmk7jnqg fcg2cn6m tkr6xdv7")
				if (closePopupButton.length > 0) {
					closePopupButton[0].firstChild.click()
				}
				else {
					scrollview.parentNode.lastChild.remove()
					scrollview.style.scrollbarWidth = "auto"
				}
			}
			try {
				document.getElementsByClassName("asf1osic k4urcfbm j9ispegn poy2od1o tw6a2znq m7u2wfa4 d1544ag0 i3j981x3 rlt63pii i09qtzwb hybvsw6c")[0].remove()
			}
			catch (e) { console.log("Can't remove element with CSS Selector .asf1osic.k4urcfbm.j9ispegn.poy2od1o.tw6a2znq.m7u2wfa4.d1544ag0.i3j981x3.rlt63pii.i09qtzwb.hybvsw6c") }
		}
	}
	if (popupFB !== undefined) {
		//popupFB.parentNode.removeChild(popupFB);
		clearInterval(interval_0)
	}

}
function removeRelatedAccounts() {
	let morePostsBtn = document.getElementsByClassName('tCibT qq7_A  z4xUb w5S7h')[0]
	if (morePostsBtn !== undefined) {
		morePostsBtn.click()
		clearInterval(interval_3)
	}
	else {
		if (document.querySelector("a[href*=\"/related_profiles/\"]")) {
			let relatedAccountsSection = document.querySelector("a[href*=\"/related_profiles/\"]").parentNode.parentNode
			var closeButtons = relatedAccountsSection.querySelectorAll("button[aria-label][alt]")
			if (closeButtons.length > 0) {
				for (var i = 0; i < closeButtons.length; i++) {
					closeButtons[i].click()
				}
				clearInterval(interval_3)
			}
		}
		else {
			clearInterval(interval_3)
		}
	}
}
function removePicturePopup() {
	if (!document.location.href.includes("/p/")) {
		var photoLinks = document.getElementsByClassName("_aabd _aa8k _aanf")
		for (var i = 0; i < photoLinks.length; i++) {
			if (photoLinks[i].getAttribute("class").includes("repaired") === false) {
				if (photoLinks[i].getElementsByTagName("IMG")[0].getAttribute("src") !== null) {
					var cln = photoLinks[i].children[0].cloneNode(true)
					photoLinks[i].removeChild(photoLinks[i].children[0])
					photoLinks[i].appendChild(cln)
					photoLinks[i].setAttribute("class", (photoLinks[i].getAttribute("class") + " repaired"))
					photoLinks[i].children[0].setAttribute("target", "_blank")
					photoLinks[i].children[0].setAttribute("rel", "noopener noreferrer")
					photoLinks[i].children[0].children[0].children[0].children[0].style.visibility = "visible"
				}
			}
		}
	}
}
function removePicturePopupIGTV() {
	console.log("removing picture popup from igtv")
	if (!document.location.href.includes("/tv/")) {
		var videoLinks = document.getElementsByClassName("_bz0w")
		for (var i = 0; i < videoLinks.length; i++) {
			if (videoLinks[i].getAttribute("class").includes("repaired") === false) {
				if (videoLinks[i].getElementsByClassName("lVhHa RNL1l")[0].style.backgroundSrc !== null) {
					var cln = videoLinks[i].cloneNode(true)
					cln.setAttribute("class", (videoLinks[i].getAttribute("class") + " repaired"))
					insertAfter(cln, videoLinks[i])
					videoLinks[i].remove()
				}
			}
		}
	}
}
function igLoadOutsideNote() {
	let note = document.createElement("DIV")
	note.id = "extSvcNote"
	let noteText = document.createElement("SPAN")
	let link_1 = document.createElement("A")
	let link_2 = document.createElement("A")
	noteText.textContent = l.igBanNote
	note.appendChild(noteText)
	var username = ""
	var authorId = ""
	var currentURL = window.location.toString()
	if (document.querySelector("[role=tablist]")) { //if one of the main profile pages
		if (currentURL.lastIndexOf("\/") == currentURL.length - 1) {
			currentURL = currentURL.substring(0, currentURL.length - 1)
		}
		username = currentURL.slice(currentURL.indexOf("instagram.com/") + 14)
		link_1.href = "https://www.picnob.com/profile/" + username
		link_1.textContent = link_1.href
		link_2.href = "https://imginn.com/" + username
		link_2.textContent = link_2.href
		link_2.textContent = link_2.href
	}
	else if (document.location.href.includes('/accounts/login/?next=')) { //if it's the forced login page
		link_1.href = "https://www.picnob.com/"
		link_2.href = "https://imginn.com/"
		link_1.textContent = link_1.href
		link_2.textContent = link_2.href
		currentURL = currentURL.substring(currentURL.indexOf("next=") + 5, currentURL.length)
		if (currentURL.match(/[/]/g).length == 2) {
			username = currentURL.slice(1, currentURL.length - 1)
			link_1.href = link_1.href + "u/" + username
			link_1.textContent = link_1.href
			link_2.href = link_2.href + username
			link_2.textContent = link_2.href
		}
	}
	else {
		link_1.href = "https://www.picnob.com/"
		link_1.textContent = link_1.href
		link_2.href = "https://imginn.com"
		link_2.textContent = link_2.href
	}
	note.appendChild(document.createElement("BR"))
	note.appendChild(link_1)
	note.appendChild(document.createElement("BR"))
	note.appendChild(link_2)
	console.log(note)
	const footer = document.body.getElementsByTagName("footer")[0]
	footer.insertBefore(note, footer.firstChild)
	try {
		note.setAttribute("style", "border: 4px solid #E79; border-radius: 1em; padding: 1em; margin: 2em auto 2em auto; max-width: 935px") //style doesn't apply and I don't know why
	}
	catch (e) {
		console.log(e)
	}
}
function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

/*function blockPopupIG(){ //kept for reference
	if(document.getElementsByClassName("RnEpo")[0]!==undefined){
		setScrollable();
	}
}*/
/*function setScrollable(){ //kept for reference
	document.body.style.overflow = "scroll !important";
}*/
function blockBannerTW(s) {
	/*if(s=='d'){
		document.getElementsByClassName("css-1dbjc4n r-16y2uox r-1n0xq6e")[0].parentNode.parentNode.parentNode.parentNode.remove();
	}
	else{
		var banner=document.getElementsByClassName("css-1dbjc4n r-1awozwy r-1pz39u2 r-18u37iz r-16y2uox")[0].parentNode;
		if(banner!=='undefined'){
			banner.parentNode.style.height="53px";
			banner.remove();
		}
		banner=document.getElementsByClassName("css-1dbjc4n r-urgr8i r-97e31f")[0];
		if(banner!=='undefined'){
			banner.remove();
		}
	}*/
	document.childNodes[1].style.overflow = ''
	//Thanks to Paul Wynters for the following code:
	//////////////////////////////////////////////////
	window.addEventListener('load', (event) => {
		window.setTimeout(() => { //wait a short amount of time for twitter to set overflow:hidden
			document.childNodes[1].style.overflow = '' //html element, clear style
		}, 500)
	})
	//////////////////////////////////////////////////
	if (mutationObserver_0 === undefined) {
		function callback_a(mutationList) {
			mutationList.forEach(function (mutation) {
				let largeLP
				//IF EDITING THIS LIST OF POPUPS, KEEP IT IN SYNC WITH THE POPUPS LISTED IN CUSTOM CSS
				largeLP = document.querySelector(".css-1dbjc4n.r-aqfbo4.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj.r-ipm5af")//big login popup triggered when clicking on "like" or "comment" (mobile)
				if (largeLP === null) {
					largeLP = document.querySelector(".css-1dbjc4n.r-1awozwy.r-1kihuf0.r-18u37iz.r-1pi2tsx.r-1777fci.r-1pjcn9w.r-1xcajam.r-ipm5af.r-g6jmlv")//big login popup triggered when clicking on "like" or "comment" (desktop);
				}
				if (largeLP === null) {
					largeLP = document.querySelector(".css-1dbjc4n.r-1awozwy.r-14lw9ot.r-1dgieki.r-1efd50x.r-5kkj8d.r-18u37iz.r-16y2uox.r-1a1dyw.r-1swwhx3.r-1j3t67a.r-1qxgc49")//another popup (i don't remember which one)
				}
				if (largeLP === null) {
					largeLP = document.querySelector("#layers>.css-1dbjc4n.r-aqfbo4.r-1p0dtai.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj>.css-1dbjc4n.r-12vffkv>.css-1dbjc4n.r-12vffkv>.css-1dbjc4n.r-l5o3uw")//another popup (i don't remember which one)
				}
				if (largeLP !== null) {
					if (mutation.target.style.overflow == "hidden") {//definitely not the right way to do it, but setting the style attributes with mutation.target.style doesn't work.
						let restyle = mutation.target.getAttribute("style")
						restyle = restyle.replace("overflow: hidden", "overflow: auto scroll")
						restyle = restyle.replace("margin-right: 17px", "margin-right: auto")
						restyle = restyle.replace("overscroll-behavior-y: none;", "overscroll-behavior-y: auto")
						restyle = restyle.replace("position: fixed", "position: unset")
						mutation.target.setAttribute("style", restyle)
					}
				}
			})
		}
		mutationObserver_0 = new MutationObserver(callback_a)
		mutationObserver_0.observe(document.documentElement, { attributes: true })
	}
}
function redditShadowRootPatch() {
	console.log("Patching reddit's shadowDom elements and restoring hidden content")
	let blurredContainers = document.querySelectorAll("shreddit-blurred-container")
	let containers = document.querySelectorAll("xpromo-nsfw-blocking-container")
	if (containers.length > 0) {
		for (c of containers) {
			let stl = document.createElement("STYLE")
			stl.innerHTML = ".prompt {display: none !important}"
			c.shadowRoot.appendChild(stl)
		}
	}
	if (blurredContainers.length > 0) {
		for (b of blurredContainers) {
			b.removeAttribute("blurred")
		}
	}
}
function redditPatch(isMobile) {
	const nav = document.getElementsByClassName("NavFrame__below-top-nav")[0]
	const config = { attributes: false, childList: true, subtree: true }
	var firstCheck = true
	var redditPic = document.body.getElementsByTagName("IMG")
	redditShadowRootPatch()
	const callback = function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			redditShadowRootPatch()
			if (isMobile) {
				let articles = mutation.target.getElementsByTagName("ARTICLE")
				if (articles.length > 0) {
					for (const article of articles) {
						if (!article.classList.contains("replaced")) {
							if ((article.getElementsByTagName("video").length == 0) && (article.getElementsByClassName("slideImageMainDiv").length == 0)) {
								var articleCopy = article.cloneNode(true)
								articleCopy.classList.add("replaced")
								article.replaceWith(articleCopy)
							}
						}
					}
				}
			}
			if (firstCheck == false) {
				redditPic = mutation.target.getElementsByTagName("IMG")
			}
			if (redditPic.length > 0) {
				for (var i = 0; i < redditPic.length; i++) {
					if ((redditPic[i].getAttribute("src").includes("blur=")) && (redditPic[i].getAttribute("src").includes("/preview."))) {
						redditPic[i].setAttribute("src", redditPic[i].getAttribute("src").split("?")[0].replace("preview", "i"))
					}
				}
				firstCheck = false
			}
		}
	}
	const bodyObserver = new MutationObserver(callback)
	bodyObserver.observe(nav, config)
}
function quoraPatchObserver() {
	var firstCheck = true
	var searchBox = document.createElement("DIV")
	searchBox.className = "q-flex qu-alignItems--center qu-justifyContent--center"
	searchBox.style = "box-sizing: border-box; display: flex; max-width: 100%;"
	let a = document.createElement("INPUT")
	a.id = "search"
	a.style = "height: 44px; text-align: center; border-radius: 22px; background-color:white; width: 100%; margin: 0.5em"
	a.className = "selector_input text"
	a.value = ""
	a.setAttribute("data-lpignore", "true")
	a.setAttribute("data-group", "js-editable")
	a.setAttribute("placeholder", "Search")
	a.setAttribute("w2cid", "wS7KcEIg18")
	searchBox.appendChild(a)
	searchBox.addEventListener('keypress', function (e) { searchQuora(e) })
	try {
		document.getElementsByClassName("q-sticky qu-zIndex--header")[0].appendChild(searchBox)
	}
	catch (e) {
		try {
			document.getElementsByClassName("header_main")[0].appendChild(searchBox)
			document.getElementsByClassName("query_title")[0].style.marginTop = "2em"
		} catch (err) { console.log("Info: if you are browsing from a PC, this error is expected.") }
	}
	quoraPatch(firstCheck)
	firstCheck = false
	const config = { attributes: true, childList: true, subtree: false }//this rough implementation is slower
	const callback = function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			quoraPatch(firstCheck)
		}
	}
	const bodyObserver = new MutationObserver(callback)
	bodyObserver.observe(document.body, config)
}
function quoraPatch(firstCheck) {
	var i
	var wall
	if (firstCheck == true) {
		wall = document.getElementsByClassName("q-box qu-overflow--hidden")
		if (wall.length > 1) {
			let bgColor = getComputedStyle(wall[0].parentNode.children[0]).backgroundColor
			if (bgColor == "rgba(68, 68, 68, 0.85)") {
				wall[0].parentNode.children[0].remove()
				wall[0].classList.remove("qu-overflow--hidden")
			}
		}
	}
	if (document.body.className.includes('signup_wall_prevent_scroll')) {
		document.body.classList.remove('signup_wall_prevent_scroll')
	}
	wall = document.getElementsByClassName('new_web_signup_wall_design')
	if (wall.length > 0) {
		wall[0].parentNode.parentNode.remove()//desktop
	}
	wall = document.getElementsByClassName('modal_bg new_signup_dialog')
	if (wall.length > 0) {
		wall[0].parentNode.remove()//mobile
	}
	wall = document.getElementsByClassName('q-absolute qu-full qu-bg--blue')
	if (wall.length > 0) {
		wall[0].parentNode.remove()//mobile
	}
}
function searchQuora(e) {
	if (e.key === 'Enter') {
		window.open("https://www.quora.com/search?q=" + document.getElementById("search").value, "_self")
	}
}
function removeAskFmLoginPopup() {
	try {
		const closeButton = document.createElement("DIV")
		closeButton.id = "closeButton"
		closeButton.style.padding = "1em"
		closeButton.style.right = "1em"
		closeButton.style.top = "1em"
		closeButton.style.position = "absolute"
		closeButton.textContent = "X"
		closeButton.style.borderRadius = "3px"
		closeButton.style.backgroundColor = "#666666"
		closeButton.style.color = "#FFFFFF"
		closeButton.style.cursor = "pointer"
		closeButton.addEventListener("click", function (e) { document.getElementsByClassName("lightbox_overlay")[0].remove() })
		var lightbox = document.getElementsByClassName("lightbox_overlay")
		console.log(lightbox.length)
		if (lightbox.length > 0) {
			if (lightbox[0].getElementsByClassName("lightbox_content-conversion").length > 0) {
				lightbox[0].parentNode.removeChild(lightbox[0])
			}
		}
		const callback = function (mutationsList, observer) {
			for (const mutation of mutationsList) {
				console.log("A")
				for (let newNode of mutation.addedNodes) {
					if (newNode.className.includes("lightbox_overlay")) {
						if (newNode.getElementsByClassName("lightbox_content-conversion").length > 0) {
							console.log("popup deleted")
							newNode.parentNode.removeChild(newNode)
						}
						else {
							newNode.appendChild(closeButton)
						}
					}
				}
			}
		}
		const config = { attributes: false, childList: true, subtree: true }
		const observer = new MutationObserver(callback)
		observer.observe(document.documentElement, config)
	}
	catch (err) { console.log("ERROR: " + err) }
}
function checkVKLoginPopup(mode) {
	const popups = document.getElementsByClassName("UnauthActionBoxContainer")
	if (popups.length > 0) {
		removeVKLoginPopup(popups[0])
	}
	const config = { attributes: false, childList: true, subtree: false }
	const callback = function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			for (let newNode of mutation.addedNodes) {
				if (newNode.className.includes("UnauthActionBoxContainer")) {
					removeVKLoginPopup(newNode, mode)
				}
				else if (newNode.getElementsByClassName("UnauthorizedActionModal") !== undefined) {
					removeVKLoginPopup(newNode, mode)
				}
			}
		}
	}
	const observer = new MutationObserver(callback)
	if (mode == "d") {
		observer.observe(document.getElementById("box_layer"), config)
	}
	else {
		observer.observe(document.body, config)
	}
}
function removeVKLoginPopup(popup, mode) {
	popup.remove()
	console.log("Popup removed")
	if (mode == "d") {
		document.getElementById("box_layer_bg").remove()
		document.getElementById("box_layer_wrap").remove()
	}
	else {
		document.getElementById("popup_wrap").remove()
		document.getElementById("popup_overlay").remove()
	}
}
function allowVideoReplayStarterIG() {
	var imgBox = document.getElementsByClassName("pR7Pc")
	if (imgBox.length == 0) {
		imgBox = document.getElementsByClassName("kPFhm B1JlO OAXCp")
	}
	if (imgBox.length == 0) {
		imgBox = document.getElementsByClassName("_aatk")
	}
	if (imgBox.length > 0) {
		let videoPlayer = imgBox[0].getElementsByTagName("VIDEO")
		if (videoPlayer.length > 0) {
			let moveTagCss = document.createElement("style")
			moveTagCss.textContent = ".LcKDX, ._7zNgw.GLdVF {bottom: 3em}"
			document.body.appendChild(moveTagCss)
			for (let vp of videoPlayer) {
				vp.controls = true
			}
		}
		allowVideoReplayIG(imgBox[0])
		clearInterval(interval_0)
	}
}
function allowVideoReplayIG(imgBox) {
	console.log("add video controls")
	const config = { attributes: false, childList: true, subtree: true }
	const callback = function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			for (let newNode of mutation.addedNodes) {
				let videoPlayer = newNode.getElementsByTagName("VIDEO")
				if (videoPlayer.length > 0) {
					for (var vp of videoPlayer) {
						vp.controls = true
					}
				}
			}
		}
	}
	const observer = new MutationObserver(callback)
	observer.observe(imgBox, config)
}
function tumblrDataWallPrevention() {
	console.log("removing login wall attributes")
	try {
		let lockedA = document.body.querySelectorAll("[data-login-wall-type]")
		console.log(lockedA)
		for (let e of lockedA) {
			e.removeAttribute("data-login-wall-type")
		}
		const config = { attributes: false, childList: true, subtree: true }
		const callback = function (mutationsList, observer) {
			for (const mutation of mutationsList) {
				for (let newNode of mutation.addedNodes) {
					let lockedB = newNode.querySelectorAll("[data-login-wall-type]")
					for (let f of lockedB) {
						f.removeAttribute("data-login-wall-type")
					}
				}
			}
		}
		const observer = new MutationObserver(callback)
		observer.observe(document.body, config)
	}
	catch (err) { console.log(err) }
}
function tiktok_waitReady() {
	let lockStyle = document.querySelector(".tux-base-dialog.z-2000")
	if (lockStyle !== null) {
		tiktok_removeAnnoyances(lockStyle)
		clearInterval(interval_0)
	}
}
function tiktok_clickList() {
	let list = document.getElementsByTagName("UL")
	if (list.length > 0) {
		if (list[0].getElementsByTagName("LI").length > 0) {
			tiktok_openLinksWithoutApp(list[0])
			clearInterval(interval_1)
		}
	}
}
function tiktok_removeAnnoyances(lockStyle) {
	lockStyle.remove()
	var possibleBanners = document.body.querySelectorAll("div[data-theme=light]")
	console.log(possibleBanners)
	for (let i = possibleBanners.length - 1; i >= 0; i--) {//reverse check so if one element is parent of another, the child will be removed
		let res = possibleBanners[i].querySelector("g[clip-path*=TikTok_Logo_Dark]")
		if (res !== null) {
			possibleBanners[i].remove()
			break
		}
	}
}
function tiktok_openLinksWithoutApp(list) {
	var recommended = document.body.getElementsByClassName("recommend-item")
	for (let r of recommended) {
		r.addEventListener("click", function (event) {
			event.stopPropagation()
			window.stop()
			window.open(event.target.getAttribute("href"))
			window.close()

		})
		r.setAttribute("href", r.getElementsByTagName("A")[0].href)
	}
	const targetNode = list
	const config = { attributes: false, childList: true, subtree: true }
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			console.log(mutation.target)
			if (mutation.target.classList.includes("recommend-item")) {
				mutation.target.addEventListener("click", function (event) {
					event.stopPropagation()
					document.location.replace(event.target.getAttribute("href"))
				})
				mutation.target.setAttribute("href", r.getElementsByTagName("A")[0].href)
			}
		}
	}
	const observer = new MutationObserver(callback)
	observer.observe(targetNode, config)
}