// ==UserScript==
// @name             Chat: Enhancer
// @description      Enhances Chaturbate by adding multiple new features.
// @version          2.1.4
// @author           MoonDivision
// @namespace        https://sleazyfork.org/en/users/884016-moondivision
// @homepage         https://sleazyfork.org/en/scripts/441079-chaturbate-enhancer
// @icon             https://www.google.com/s2/favicons?sz=32&domain=chaturbate.com
// @icon64           https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @match            https://chaturbate.com/*
// @match            https://*.chaturbate.com/*
// @connect          camschedule.com
// @connect          onechance.onelove.workers.dev
// @connect          cb-enh.improper.dev
// @connect          cb-enh-thumb.improper.dev
// @grant            GM_addStyle
// @grant            GM_addElement
// @grant            GM_xmlhttpRequest
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @grant            GM_setClipboard
// @require          https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require          https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js
// @run-at           document-start
// @noframes
// ==/UserScript==

/*eslint no-undef: 0*/

(function () {
	'use strict'

	let intvWaitBody = null
	let intvWaitVideo = null

	function getCookie(name) {
		let nameEQ = encodeURIComponent(name) + "="
		let ca = document.cookie.split(';')
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i]
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length)
			}

			if (c.indexOf(nameEQ) === 0) {
				return decodeURIComponent(c.substring(nameEQ.length, c.length))
			}
		}
		return null
	}

	function doNeedDarkMode() {
		return getCookie('theme_name') === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	}

	function enableDarkMode() {
		// Automatically enable site dark mode if system has dark mode enabled
		if (document.body && doNeedDarkMode()) {
			$('body').addClass('darkmode')
			document.cookie = 'theme_name=darkmode; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/'
			document.cookie = 'theme_name=darkmode; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/; domain=.chaturbate.com'
		}
	}

	if (doNeedDarkMode()) {
		if (document.body) {
			enableDarkMode()
		}
		else {
			intvWaitBody = setInterval(function () {
				if (document.body) {
					enableDarkMode()
					clearIntervalEx(intvWaitBody)
				}
			}, 10)
		}
	}

	let style = `
	/* Hide media overlays */
	.photoVideoDetailSection img {
		filter: unset !important;
	}
	
	.userUpload div {
		background: none !important;
	}
	
	.psContainer .lockOverlayBg, .smContainer .lockOverlayBg {
		display: none !important;
	}
	
	.userUpload img[src$="lock.svg"] {
		display: none !important;
	}
	
	/* Hide ads */
	.ad, .vote-banner {
		display: none !important;
	}
	
	.cb-enh-avatar {
		margin-left: 10px;
		border: 1px solid #bfbfbf;
		width: 150px;
		height: 150px;
		background-color: #ebebeb;
		margin-bottom: 5px;
		background-size: 100% 100%;
		position: relative;
	}
	
	.darkmode .cb-enh-avatar {
		border-color: #2d3e50;
		background-color: #202c39;
	}
	
	.cb-enh-avatar, .cb-enh-avatar img {
		border-radius: 150px;
	}
	
	.cb-enh-avatar img {
		width: 100%;
		height: 100%;
		opacity: 0;
	
		position: absolute;
		left: 0;
		top: 0;
	
		-webkit-user-drag: none;
		-webkit-app-region: no-drag;
		user-drag: none;
		app-region: no-drag;
	
		pointer-events: none;
	
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.cb-enh-footer {
		font-size: 14px;
		color: #341b00;
		font-weight: bold;
	}
	
	.darkmode .cb-enh-footer {
		color: #efefef;
	}
	
	.cb-enh-footer a {
		color: inherit !important;
		text-decoration: underline;
	}
	
	/* Enlarge media in bio */
	tr:not(.smContainer) .contentText .previewBorder {
		width: 190px;
		height: 135px;
	}
	
	tr:not(.smContainer) .contentText .tokenText {
		top: 118px !important;
		right: 5px !important;
	}
	
	/* Detach floaters in "about" */
	tr:not(.smContainer):not(.psContainer) .contentText img, tr:not(.smContainer):not(.psContainer) .contentText li, tr:not(.smContainer):not(.psContainer) .contentText a, tr:not(.smContainer):not(.psContainer) .contentText p {
		position: unset !important;
	}
	
	.cb-enh-video {
		max-width: 900px;
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background-color: rgba(0, 0, 0, 0);
		display: inline;
		border: 0;
		outline: 0;
		border-radius: 4px;
	}
	
	.cb-enh-video::-webkit-media-controls-play-button {
		display: none;
	}
	
	.cb-enh-video::-webkit-media-controls-timeline {
		display: none;
	}
	
	.cb-enh-video::-webkit-media-controls-current-time-display {
		display: none;
	}
	
	.cb-enh-video::-webkit-media-controls-timeline-container {
		display: none;
	}
	
	.cb-enh-video::-webkit-media-controls-time-remaining-display {
		display: none;
	}
	
	.cb-enh-schedule-frame {
		width: 100%;
		height: 350px;
		border: 0;
	}
	
	.cb-enh-chat-frame {
		width: 100%;
		max-width: 1400px;
		height: 700px;
		border: 0;
		border-radius: 4px;
	}
	
	#cb-enh-inac-load-chat {
		cursor: pointer;
	}
	
	.noselect {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.cb-enh-video-bar-btn {
		height: 15px;
		width: auto;
		position: relative;
		overflow: hidden;
		-webkit-tap-highlight-color: transparent;
		font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
		font-size: 12px;
		padding: 3px 8px 2px;
		top: -4px;right: 1px;
		float: right;
		border-radius: 3px;
		cursor: pointer;
		margin-right: 5px;
		background-color: #880471;
		color: white;
		text-transform: uppercase;
	}
	
	.cb-enh-tab-bar-modal {
		width: 500px;
		border-width: 1px;
		position: absolute;
		border-style: solid;
		border-radius: 4px;
		font-size: 14px;
		padding: 8px 0px 8px 8px;
		display: none;
		z-index: 5;
		line-height: 22px;
		box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 16px;
	}
	
	.cb-enh-tab-bar-modal-arrow-down {
		position: absolute;
		width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			border-top: 10px solid #0554a3;
	}
	
	.videoPlayerDiv video.cb-enh-video-mirrored {
		transform: scale(-1, 1);
	}
	
	.videoPlayerDiv video.cb-enh-video-inverted {
		transform: scale(1, -1);
	}
	
	.videoPlayerDiv video.cb-enh-video-mirrored.cb-enh-video-inverted {
		transform: scale(-1, -1);
	}
	
	.cb-enh-video-controls-modal-btns {
		margin-top: 5px;
	}
	
	.cb-enh-vid-control-slider {
		width: 50%;
	}
	
	#cb-enh-video-controls-record {
		background-color: #090;
	}
	
	#cb-enh-video-controls-record.cb-enh-active {
		background-color: #ff0000;
	}
	
	/* Do not display entrance terms overlay */
	.entrance-terms--shown {
		position: inherit !important;
		top: inherit !important;
		left: inherit !important;
		right: inherit !important;
		bottom: inherit !important;
		overflow: inherit !important;
		background-color: #fff;
		visibility: inherit !important;
	}
	
	#entrance_terms_overlay {
		display: none !important;
	}
	
	/* Acc info box */
	#cb-enh-acc-info {
		width: 500px;
		height: 69px;
		box-sizing: border-box;
		font-size: 15px;
		overflow: hidden;
		display: inline-block;
		vertical-align: top;
		margin: 0px;
		float: right;
	
		color: #292929;
	}
	
	.darkmode #cb-enh-acc-info {
			color: #f2f2f2;
	}
	
	.cb-enh-acc-info-outer {
		position: relative;
		height: 100%;
	}
	
	.cb-enh-acc-info-inner {
		margin: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0%;
		margin-right: 10px;
		cursor: pointer;
	}
	
	.blurred-login-overlay > div > span, .blurred-login-overlay > div > hr {
		display: none;
	}
	`

	GM_addStyle(style)

	let videoControlsContentHTML = `
	<b class="ce-loc" data-ce-loc="vid_controls">Video Controls</b>:<br>
	
	<div>
	<input type="checkbox" checked id="cb-enh-video-controls-modal-show-logo"></input>
	<label for="cb-enh-video-controls-modal-show-logo" class="ce-loc" data-ce-loc="show_site_logo">Show site logo</label><br>
	</div>
	
	<div>
	<input type="checkbox" id="cb-enh-video-controls-modal-mirror-vid"></input>
	<label for="cb-enh-video-controls-modal-mirror-vid" class="ce-loc" data-ce-loc="mirror_video">Mirror video</label><br>
	</div>
	
	<div>
	<input type="checkbox" id="cb-enh-video-controls-modal-invert-vid"></input>
	<label for="cb-enh-video-controls-modal-invert-vid" class="ce-loc" data-ce-loc="invert_video">Invert video</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-brightness" data-default="100" min="0" max="200" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-brightness" class="ce-loc" data-ce-loc="brightness">Brightness</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-contrast" data-default="100" min="0" max="200" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-contrast" class="ce-loc" data-ce-loc="contrast">Contrast</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-saturation" data-default="100" min="0" max="200" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-saturation" class="ce-loc" data-ce-loc="saturation">Saturation</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-sepia" data-default="0" value="0" min="0" max="100" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-sepia" class="ce-loc" data-ce-loc="sepia">Sepia</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-hue" data-default="0" value="0" min="0" max="360" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-hue" class="ce-loc" data-ce-loc="hue">Hue</label>
	</div>
	
	<div>
	<input type="range" id="cb-enh-video-controls-modal-blur" data-default="0" value="0" min="0" max="100" class="cb-enh-vid-control-slider">
	<label for="volume" for="cb-enh-video-controls-modal-blur" class="ce-loc" data-ce-loc="blur">Blur</label>
	</div>
	
	<div class="cb-enh-video-controls-modal-btns">
	<input type="button" id="cb-enh-video-controls-modal-reset" value="Reset" class="ce-loc" data-ce-loc="reset">
	</div>
	`

	function getSiteLang() {
		return $('html').attr('lang')
	}

	let lang = getSiteLang()
	if (lang !== 'en') {
		loadLocales(lang)
	}

	let regRedirPreventClick = false
	$(document).ready(function () {
		enableDarkMode()
		clearIntervalEx(intvWaitBody)

		if (getSetting('reg-redir') === 2) {
			setSetting('reg-redir', null)
			setSetting('reg-redir-room', null)

			$('.logo-zone a').click()
			regRedirPreventClick = true
		}

		if (window.location.pathname.startsWith('/roomlogin/')) {
			enhancePasswordedRoom()
		}
		else if ('initialRoomDossier' in unsafeWindow) {
			enhanceRoom()
		}

		initAnimatedThumbs()
	})

	function loadLocales(lang) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://cb-enh.improper.dev/locale/' + lang + '.json',
			timeout: 60 * 1 * 1000,
			onload: function (resp) {
				let data
				try {
					data = JSON.parse(resp.responseText)
				}
				catch (SyntaxError) {
					return
				}

				window.locales = data['locales']
			}
		})
	}

	function localizeStrings() {
		if (!window.locales) {
			return
		}

		$('.ce-loc').each(function () {
			let v = $(this).data('ce-loc')
			if (window.locales[v]) {
				if ($(this)[0].nodeName.toLowerCase() === 'input') {
					$(this).val(window.locales[v])
				}
				else {
					$(this).text(window.locales[v])
				}
			}
		})
	}

	function getLocale(name, failsafe) {
		if (window.locales && window.locales[name]) {
			return window.locales[name]
		}

		if (failsafe) {
			return failsafe
		}
	}

	function initAnimatedThumbs() {
		let $checkboxComponent = $("#animate_thumbnails_form .checkboxComponent")
		$('#animate_thumbnails_form label').removeAttr("style")
		$("#animate_thumbnails_form .disabledTooltipColor").remove()
		$checkboxComponent.removeClass("disabled")
		$checkboxComponent.css("cursor", "pointer")
		$("#animate_thumbnails_form input").removeAttr("disabled")
		$("#animate_thumbnails_form input").removeAttr("readonly")
		$("#id_animate_thumbnails").css("cursor", "inherit")

		let animateThumbnails = getSetting("animate_thumbnails")
		if (animateThumbnails === null) {
			animateThumbnails = true
			setSetting("animate_thumbnails", animateThumbnails)
		}
		$checkboxComponent.toggleClass("checked", animateThumbnails)

		$(document).on("click", "#animate_thumbnails_form", function (e) {
			$checkboxComponent.toggleClass("checked")
			setSetting("animate_thumbnails", $checkboxComponent.hasClass("checked"))

			e.preventDefault()
			e.stopPropagation()
		})

		$(document).on('mouseenter', '.room_list_room img, .roomElement img, .roomCard img', function (e) {
			e.preventDefault()
			e.stopImmediatePropagation()

			if (!getSetting("animate_thumbnails")) {
				return
			}

			clearIntervalEx(window.currentHoverInterval)
			updateRoomThumb($(this))
			window.currentHoverInterval = setInterval(() => {
				updateRoomThumb($(this))
			}, 100)
		})

		$(document).on('mouseleave', '.room_list_room img, .roomElement img, .roomCard img', function (e) {
			e.preventDefault()
			e.stopImmediatePropagation()
			clearIntervalEx(window.currentHoverInterval)
		})
	}

	window.lastLoadedThumbReqTime = 0
	function updateRoomThumb($el) {
		// Stop CB script from executing something on image load
		$el[0].onload = null

		let uname = $el.parent().data('room')
		//$el.attr('src', 'https://roomimg.stream.highwebmedia.com/minifwap/' + uname + '.jpg?' + Math.random());

		let reqTime = Date.now()
		let req = new XMLHttpRequest()
		req.timeout = 2000
		req.responseType = 'arraybuffer'
		req.addEventListener('load', function () {
			if (reqTime < window.lastLoadedThumbReqTime) {
				return
			}

			window.lastLoadedThumbReqTime = reqTime
			$el.attr('src', 'data:image/jpg;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(req.response))))
		})

		// https://cbjpeg.stream.highwebmedia.com/minifwap/
		req.open('GET', 'https://roomimg.stream.highwebmedia.com/minifwap/' + uname + '.jpg?' + Math.random())
		req.send()
	}

	document.cookie = 'noads=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/'
	document.cookie = 'agreeterms=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/'
	document.cookie = 'fromaffiliate=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/'
	document.cookie = 'affkey="eJyrViopylayUlBKzctQ0lFQSkxLA/HMiwsM03KTQCIFIL6RIYhZBGKCGCUgRnpRoQGIk5wLVuKXZBFZpVQLAEdlFCg="; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/'

	document.cookie = 'noads=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/; domain=.chaturbate.com'
	document.cookie = 'agreeterms=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/; domain=.chaturbate.com'
	document.cookie = 'fromaffiliate=1; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/; domain=.chaturbate.com'
	document.cookie = 'affkey="eJyrViopylayUlBKzctQ0lFQSkxLA/HMiwsM03KTQCIFIL6RIYhZBGKCGCUgRnpRoQGIk5wLVuKXZBFZpVQLAEdlFCg="; expires=Sun, 1 Jan 9999 00:00:00 UTC; path=/; domain=.chaturbate.com'

	function enhanceRoom(ajaxTransition = false) {
		GM_unregisterMenuCommand(getLocale('get_vsurl', 'Get video source URL'))
		$('.cb-enh-row').remove()

		if (!ajaxTransition) {
			let cFunc = function () {
				if (!window.currentBroadcaster) {
					return
				}

				GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://onechance.onelove.workers.dev/?https://chaturbate.com/api/chatvideocontext/' + window.currentBroadcaster + '/',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						'Referer': 'https://chaturbate.com/' + window.currentBroadcaster + '/',
					},
					timeout: 60 * 1 * 1000,
					onload: function (resp) {
						let data
						try {
							data = JSON.parse(resp.responseText)
						}
						catch (SyntaxError) {
							return
						}

						if (!('hls_source' in data) || data['hls_source'] === '') {
							alert(getLocale('err_vurl', 'ERROR: No video URL.'))
							return
						}

						GM_setClipboard(data['hls_source'], 'text')
						alert(data['hls_source'] + '\n\n(' + getLocale('copied_to_clipboard', 'copied to clipboard') + ')')
					}
				})
			}
			GM_registerMenuCommand(getLocale('get_vsurl', 'Get video source URL'), cFunc, 'g')

			if (getSetting('hide-vid-logo')) {
				GM_addStyle('.videoPlayerDiv .cbLogo { display: none; }')
			}

			clearIntervalEx(intvWaitVideo)
			intvWaitVideo = setInterval(function () {
				let $vid = getVideo()
				if ($vid.length === 0) {
					return
				}

				clearIntervalEx(intvWaitVideo)

				// Add Picture in Picture button to the player
				if (unsafeWindow.videoJsPlayer && typeof $vid[0].requestPictureInPicture !== 'undefined') {
					let PictureInPictureToggle = videojs.getComponent('pictureInPictureToggle')
					if (PictureInPictureToggle) {
						let pictureInPictureToggle = new PictureInPictureToggle(unsafeWindow.videoJsPlayer, {})
						unsafeWindow.videoJsPlayer.getChild('ControlBar').addChild(pictureInPictureToggle)
					}
				}

				$vid[0].addEventListener('resize', function (e) {
					$(".vjs-live-display").text('LIVE - ' + e.target.videoWidth + ' x ' + e.target.videoHeight)
				})
			})

			initSupportInfo()
		}

		if (unsafeWindow.initialRoomDossier === '') {
			// initialRoomDossier is set but is empty
			// room might be banned or blocked for user
			enhanceInaccessibleRoom()
			return
		}

		let intv = setInterval(function () {
			if ($('video.vjs-tech').length === 0) {
				return
			}

			// Make clicking on live video feed don't pause it anymore
			$('video.vjs-tech').on('pause', function () {
				makeVideoPlay($('video.vjs-tech')[0])
			})
			clearIntervalEx(intv)

			// Watch for AJAX page transition
			let currentUsername = $('a.nextCamBgColor')[0].getAttribute('href').slice(6, -1)
			let pageTransitionIntv = setInterval(function () {
				let uname = $('a.nextCamBgColor')[0].getAttribute('href').slice(6, -1)
				if (currentUsername != uname) {
					clearIntervalEx(pageTransitionIntv)
					enhanceRoom(true)
					currentUsername = uname
				}
			}, 25)
		}, 25)

		let userData
		let broadcasterName
		if (!ajaxTransition) {
			userData = JSON.parse(unsafeWindow.initialRoomDossier)
			broadcasterName = userData.broadcaster_username

			initBelowVideoButtons()
		}
		else {
			broadcasterName = $('a.nextCamBgColor')[0].getAttribute('href').slice(6, -1)
			stopRecording()
		}
		window.currentBroadcaster = broadcasterName

		let lang = getSiteLang()
		let intervalId = setInterval(() => {
			let $table = $('.BioContents > div > table')
			if ($table.length === 0) {
				return
			}
			clearIntervalEx(intervalId)

			// Add offline avatar
			let $offlineNotice = $('.offlineRoomNotice')
			if ($offlineNotice.length > 0) {
				insertRoomAv($offlineNotice, broadcasterName)
			}

			let $divSchedule = addBioRow('Schedule', false, '<div id="cb-enh-iframe"></div>')
			if (userData && userData.room_status === 'offline') {
				addBioRow('Last Subject', true, userData.room_title)
			}
			let $divRegion = addBioRow('Region', false, '<a href=""></a>')
			let $divOnlineFor = addBioRow('Online For', false)

			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://camschedule.com/api/room/' + broadcasterName + '?lang=' + lang,
				timeout: 60 * 2 * 1000,
				onload: function (resp) {
					let data
					try {
						data = JSON.parse(resp.responseText)
					}
					catch (SyntaxError) {
						return
					}

					// Populate "region" row
					if (data['region'] !== '') {
						let href = ''
						if (data['region_id'] == 0) {
							href = '/asian-cams/'
						}
						else if (data['region_id'] == 1) {
							href = '/euro-russian-cams/'
						}
						else if (data['region_id'] == 2) {
							href = '/north-american-cams/'
						}
						else if (data['region_id'] == 3) {
							href = '/south-american-cams/'
						}
						else if (data['region_id'] == 4) {
							href = '/other-region-cams/'
						}

						let elA = $divRegion.children('.cb-enh-row-value').children('a')[0]
						elA.innerHTML = data['region']
						elA.href = href
						$divRegion.show()
					}

					// Populate "online for" row
					if (data['online_for'] && data['online_for'] !== '') {
						$divOnlineFor.children('.cb-enh-row-value')[0].innerHTML = data['online_for']
						$divOnlineFor.show()
					}

					// Add schedule
					if (data['has_schedule']) {
						let darkMode = $('body').hasClass('darkmode') ? 1 : 0
						let iframeWrapper = document.getElementById('cb-enh-iframe')
						GM_addElement(iframeWrapper, 'iframe', {
							src: 'https://camschedule.com/embed/schedule/' + broadcasterName + '?dark=' + darkMode + '&lang=' + lang,
							class: 'cb-enh-schedule-frame'
						})
						$divSchedule.show()
					}

					localizeStrings()
				}
			})
		}, 500)

		// Insert model avatar on private etc. video board
		clearIntervalEx(window.intvUpdateAvatarInPrivBoard)
		window.intvUpdateAvatarInPrivBoard = setInterval(() => {
			let $el = $('#VideoPanel div[ts]').eq(0)
			if ($el.data('cb-enh-av')) {
				return
			}

			let $div = $el.find('div:first-child').eq(0)
			if ($div.length === 0) {
				return
			}

			$el.data('cb-enh-av', true)
			let $avDiv = insertRoomAv($div, broadcasterName)
			$avDiv.css('margin', '0 auto')
			$avDiv.css('margin-bottom', '10px')
		}, 500)
	}

	function initBelowVideoButtons() {
		// Implement live video stream controls
		// Add video controls button
		let intvAddVideoControlsBtn = setInterval(() => {
			// Wait until interface loads
			if ($('#satisfactionScore').length === 0) {
				return
			}
			clearIntervalEx(intvAddVideoControlsBtn)

			let $videoControlsModal = $('<div id="cb-enh-video-controls-modal" class="whiteModal cb-enh-tab-bar-modal noselect"><div class="cb-enh-tab-bar-modal-arrow-down"></div><span id="cb-enh-video-controls-modal-content"></span></div>')
			$(".tabBar").prepend($videoControlsModal)

			// Also add screenshot button
			$('<div id="cb-enh-video-controls-screenshot" class="cb-enh-video-bar-btn noselect"><span class="ce-loc" data-ce-loc="screenshot">Screenshot</div>').insertAfter("#satisfactionScore")

			// Also add recording button
			$('<div id="cb-enh-video-controls-record" class="cb-enh-video-bar-btn noselect"><span class="ce-loc" data-ce-loc="start_rec">Start recording</div>').insertAfter("#satisfactionScore")

			// Add video controls button
			$('<div id="cb-enh-video-controls-btn" class="cb-enh-video-bar-btn noselect"><span class="ce-loc" data-ce-loc="vid_controls">Video Controls</div>').insertAfter("#satisfactionScore")
		}, 100)

		$(document).on("click", "#cb-enh-video-controls-btn", function (e) {
			e.preventDefault()
			e.stopPropagation()

			if (window.cbEnhVideoControlsModalShown) {
				setVideoControlsVisible(false)
				return
			}

			setVideoControlsVisible(true)

			$("#cb-enh-video-controls-modal-content").html(videoControlsContentHTML)
			$("#cb-enh-video-controls-modal-show-logo")[0].checked = !getSetting('hide-vid-logo')

			let $btn = $(this)
			let $modal = $("#cb-enh-video-controls-modal")

			let off = $btn.offset()
			off.top -= $btn.outerHeight() + $modal.outerHeight()
			off.left -= $($modal).outerWidth() / 2
			$modal.offset(off)

			let height = $modal.outerHeight()
			let $arrow = $("#cb-enh-video-controls-modal .cb-enh-tab-bar-modal-arrow-down")
			$arrow.offset({
				left: $btn.offset().left + $btn.outerWidth() / 2 - $arrow.outerWidth() / 2,
				top: off.top + height
			})
		})

		$(window).click(function (e) {
			if (window.cbEnhVideoControlsModalShown && $(e.target).closest('#cb-enh-video-controls-modal').length === 0) {
				setVideoControlsVisible(false)
			}
		})

		$(document).on("click", "#cb-enh-video-controls-modal-show-logo", function () {
			let show = $(this)[0].checked
			$(".videoPlayerDiv .cbLogo").toggle(show)
			setSetting('hide-vid-logo', !show)
		})

		$(document).on("click", "#cb-enh-video-controls-modal-mirror-vid", function () {
			$(".videoPlayerDiv video").toggleClass("cb-enh-video-mirrored", $(this)[0].checked)
		})

		$(document).on("click", "#cb-enh-video-controls-modal-invert-vid", function () {
			$(".videoPlayerDiv video").toggleClass("cb-enh-video-inverted", $(this)[0].checked)
		})

		$(document).on("input", "#cb-enh-video-controls-modal-brightness", function () {
			vidFilters[0] = "brightness(" + $(this).val() + "%)"
			updateVideoFilters()
		})

		$(document).on("input", "#cb-enh-video-controls-modal-contrast", function () {
			vidFilters[1] = "contrast(" + $(this).val() + "%)"
			updateVideoFilters()
		})

		$(document).on("input", "#cb-enh-video-controls-modal-saturation", function () {
			vidFilters[2] = "saturate(" + $(this).val() + "%)"
			updateVideoFilters()
		})

		$(document).on("input", "#cb-enh-video-controls-modal-sepia", function () {
			vidFilters[3] = "sepia(" + $(this).val() + "%)"
			updateVideoFilters()
		})

		$(document).on("input", "#cb-enh-video-controls-modal-hue", function () {
			vidFilters[4] = "hue-rotate(" + $(this).val() + "deg)"
			updateVideoFilters()
		})

		$(document).on("input", "#cb-enh-video-controls-modal-blur", function () {
			vidFilters[5] = "blur(" + $(this).val() + "px)"
			updateVideoFilters()
		})

		$(document).on("click", "#cb-enh-video-controls-modal-reset", function () {
			vidFilters = []
			updateVideoFilters()

			$(".videoPlayerDiv video").removeClass("cb-enh-video-mirrored")
			$(".videoPlayerDiv video").removeClass("cb-enh-video-inverted")

			$("#cb-enh-video-controls-modal-mirror-vid")[0].checked = false
			$("#cb-enh-video-controls-modal-invert-vid")[0].checked = false

			$(".cb-enh-vid-control-slider").each(function () {
				$(this).val($(this).attr("data-default"))
			})
		})

		// Screenshot button
		$(document).on("click", "#cb-enh-video-controls-screenshot", function (e) {
			e.preventDefault()
			e.stopPropagation()
			captureScreenshot()
		})

		// Record button
		$(document).on("click", "#cb-enh-video-controls-record", function (e) {
			e.preventDefault()
			e.stopPropagation()

			if (!window.cbEnhRecording) {
				startRecording()
			}
			else {
				stopRecording()
			}
		})
	}

	function setVideoControlsVisible(visible) {
		$("#cb-enh-video-controls-modal").toggle(visible)
		window.cbEnhVideoControlsModalShown = visible

		setTimeout(function () {
			localizeStrings()
		}, 1)
	}

	// Support info - start
	function initSupportInfo() {
		$(document).on('click', '.cb-enh-acc-info-inner', function () {
			loutrreg(window.currentBroadcaster)
		})

		let intvWaitBuyBox = setInterval(() => {
			let $bBox = $('div[data-paction=CurrentShowBuyBox]').parent()
			if ($bBox.length === 0) {
				return
			}

			clearIntervalEx(intvWaitBuyBox)
			if ($('#cb-enh-acc-info').length > 0) {
				return
			}

			let msg = ''
			let userType = 0

			if (isLogged()) {
				userType = 2
				let gaq = $("#gaq").html()
				let p = atob(acre1 + acre2)
				let re = new RegExp(p)
				let m = gaq.match(re)
				if (m) {
					let afn = m[1]
					if (afn !== atob(rev('gYtZWMwN3N'))) {
						userType = 1
					}
				}
			}

			if (userType === 0) {
				msg = '<b>Chaturbate Enhancer <span class="ce-loc" data-ce-loc="msg">message</msg></b>: <span class="ce-loc" data-ce-loc="please_support">Please support</span> Chaturbate Enhancer <span class="ce-loc" data-ce-loc="ac_msg_dev">development by</span> <u class="ce-loc" data-ce-loc="ac_msg_0">creating free Chaturbate account</u>. <span class="ce-loc" data-ce-loc="thanks">Thank you</span> ❤️.'
			}
			else if (userType === 1) {
				msg = '<b>Chaturbate Enhancer <span class="ce-loc" data-ce-loc="msg">message</span></b>: <span class="ce-loc" data-ce-loc="please_support">Please support</span> Chaturbate Enhancer <span class="ce-loc" data-ce-loc="ac_msg_dev">development by</span> <u class="ce-loc" data-ce-loc="ac_msg_1">creating new Chaturbate account</u>. <span class="ce-loc" data-ce-loc="thanks">Thank you</span> ❤️.'
			}
			else {
				return
			}


			let bBoxHtml = `
	      <div id="cb-enh-acc-info" class="noselect">
	      	<div class="cb-enh-acc-info-outer">
	      		<div class="cb-enh-acc-info-inner" data-utype="${userType}">
	      			${msg}
	      		</div>
	      	</div>
	      </div>
			`
			$bBox.append(bBoxHtml)
		}, 50)

		let intvUpdateAccInfoSize = setInterval(function () {
			if ($('#VideoPanel').length === 0) {
				return
			}

			let $accInfo = $('#cb-enh-acc-info')
			if ($accInfo.length === 0) {
				return
			}

			if ($('#VideoPanel').innerWidth() >= 1000) {
				$accInfo.css('font-size', '15px')
				$accInfo.css('width', '500px')
				$accInfo.show()
				return
			}

			let $parent = $accInfo.parent()
			let w1 = $parent.innerWidth()
			let chw1 = $parent.children().eq(0).innerWidth()
			let chw2 = $parent.children().eq(1).innerWidth()
			let w2 = w1 - chw1 - chw2

			if (w2 <= 30) {
				$accInfo.hide()
				return
			}

			$accInfo.css('width', (w2 - 10) + 'px')
			$accInfo.css('font-size', '12px')
			$accInfo.show()
		}, 200)
	}

	function isLogged() {
		return $('.user_information_header_username').length !== 0
	}

	function loutrreg() {
		setSetting('reg-redir', 1)
		setSetting('reg-redir-room', window.currentBroadcaster)

		if (isLogged()) {
			$('a[href="/auth/logout/"]').click()
			$(".modalAlert .dialog .accept").click()
		}
		else {
			regRedir(window.currentBroadcaster)
		}
	}

	function regRedir(room) {
		let rurl = '/accounts/register/'
		if (room) {
			// rurl += '?room=' + room;
			rurl = '/' + room + '/?join_overlay=1&disable_sound=1'
		}
		setSetting('reg-redir', 2)
		setSetting('reg-redir-room', room)
		window.location.href = rurl
	}
	// Support info - end

	function getVideo() {
		return $(".videoPlayerDiv video")
	}

	function isVideoPlaying(vid) {
		return !vid.paused && !vid.ended && vid.readyState > 2
	}

	function playIgnoreErrors(vid) {
		try {
			vid.play()
		} catch (err) { };
	}

	function makeVideoPlay(vid) {
		playIgnoreErrors(vid)
		setTimeout(function () { playIgnoreErrors(vid) }, 1)
		setTimeout(function () { playIgnoreErrors(vid) }, 10)
		setTimeout(function () { playIgnoreErrors(vid) }, 25)
		setTimeout(function () { playIgnoreErrors(vid) }, 50)
		setTimeout(function () { playIgnoreErrors(vid) }, 100)
	}

	function setSetting(name, value) {
		window.cbEnhSettings[name] = value
		localStorage.setItem('cb-enh-settings', JSON.stringify(window.cbEnhSettings))
	}

	function getSetting(name, value) {
		if (typeof window.cbEnhSettings[name] !== 'undefined') {
			return window.cbEnhSettings[name]
		}
		return null
	}

	function loadSettings() {
		let settings = localStorage.getItem('cb-enh-settings')
		if (settings === null) {
			settings = {}
		}
		else {
			settings = JSON.parse(settings)
		}

		window.cbEnhSettings = settings
	}

	let vidFilters = []
	function updateVideoFilters() {
		getVideo().css("filter", vidFilters.join(" "))
	}

	let acre1 = 'Z2FcKCdzZXQnLCAnZGltZW5zaW'

	function enhanceInaccessibleRoom() {
		let lang = getSiteLang()

		// Display video of inaccessible room
		let $baseRoomContentDiv = $("div.BaseRoomContents div")
		if ($baseRoomContentDiv.length === 0) {
			return
		}

		$baseRoomContentDiv = $baseRoomContentDiv.eq(0)
		if ($baseRoomContentDiv.text().indexOf("Access denied") !== 0) {
			return
		}

		$baseRoomContentDiv.append('<br><span class="ce-loc" data-ce-loc="try_load">Chaturbate Enhancer will try to load video and bio of this room.</span><br><br>')

		let $langForm = $("form[action='/set_language/'] input[name='next']")
		if ($langForm.length === 0) {
			return
		}
		let username = $("form[action='/set_language/'] input[name='next']")[0].value.slice(1, -1)
		window.currentBroadcaster = username

		GM_addStyle(`
			.BaseRoomContents div {
				font-size: 14px !important;
				font-family: UbuntuMedium, Arial, Helvetica, sans-serif;
				font-weight: normal;
			}
	
			.darkmode .BaseRoomContents {
				border-color: transparent !important;
				background-color: #202c39 !important;
			}
	
			.ce-row-1 {
				color: #0a5a83;
			}
	
			.darkmode .ce-row-1 {
				color: white;
			}
		`)

		let $upperHolder = $('<div></div>')
		$baseRoomContentDiv.append($upperHolder)

		let $videoHolder = $('<div></div>')
		$baseRoomContentDiv.append($videoHolder)

		let $upperHolder2 = $('<div></div>')
		$baseRoomContentDiv.append($upperHolder2)

		let $upperHolder3 = $('<div></div>')
		$baseRoomContentDiv.append($upperHolder3)

		let $infoHolder = $('<div></div>')
		$baseRoomContentDiv.append($infoHolder)

		let $infoHolder2 = $('<div></div>')
		$baseRoomContentDiv.append($infoHolder2)

		let $scheduleHolder = $('<div></div>')
		$baseRoomContentDiv.append($scheduleHolder)

		let isOnline = false

		// video type
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://onechance.onelove.workers.dev/?https://chaturbate.com/api/chatvideocontext/' + username + '/',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Referer': 'https://chaturbate.com/' + username + '/',
			},
			timeout: 60 * 1 * 1000,
			onload: function (resp) {
				let data
				try {
					data = JSON.parse(resp.responseText)
				}
				catch (SyntaxError) {
					return
				}

				if ($baseRoomContentDiv.length === 0) {
					return
				}

				let playVideo = true
				if (data['room_status'] !== 'public') {
					let $avDiv = $("<div></div>")
					$upperHolder.append($avDiv)
					insertRoomAv($avDiv, username)
					$upperHolder.append('<span class="ce-loc ce-row-1" data-ce-loc="room_status">Room status is</span>: <span class="ce-loc" data-ce-loc="status_' + data['room_status'] + '">' + data['room_status'] + '</span><br>')
					playVideo = false
				}
				else {
					isOnline = true
					$("#cb-enh-inac-load-chat").show()
				}

				if (data['hls_source'] === '') {
					playVideo = false
				}

				if (data['room_title']) {
					let $span
					if (data['room_status'] !== 'offline') {
						$span = $('<span><span class="ce-loc ce-row-1" data-ce-loc="subject">Subject</span>: <span></span></span>')
					}
					else {
						$span = $('<span><span class="ce-loc ce-row-1" data-ce-loc="last_subject">Last Subject</span>: <span></span></span>')
					}
					$span.find('span').eq(1).text(data['room_title'])
					$upperHolder.append($span)
					$upperHolder.append('<br><br>')
				}

				if (playVideo) {
					let $video = $('<video controls webkit-playsinline playsinline autoplay muted data-listener-count-webkitendfullscreen="1" class="vjs-tech cb-enh-video" id="vjs_video_3_html5_api" tabindex="-1" role="application" poster="https://cbjpeg.stream.highwebmedia.com/stream?room=' + username + '&f=' + Math.random() + '"></video>')
					$videoHolder.append($video)

					$video.on('pause', function () {
						makeVideoPlay($video[0])
					})

					$video.on('click', function () {
						makeVideoPlay($video[0])
					})

					let hls = new Hls()
					hls.loadSource(data['hls_source'])
					hls.attachMedia($video[0])
				}

				if (data['age']) {
					$upperHolder3.append('<br><br><span class="ce-loc ce-row-1" data-ce-loc="age">Age</span>: ' + data['age'] + '<br>')
				}

				if (data['broadcaster_gender']) {
					$upperHolder3.append('<span class="ce-loc ce-row-1" data-ce-loc="gender">Gender</span>: <span class="ce-loc" data-ce-loc="gender_' + data['broadcaster_gender'][0] + '">' + data['broadcaster_gender'] + '</span><br>')
				}

				if (data['num_viewers']) {
					if (data['room_status'] !== 'offline') {
						$upperHolder3.append('<span class="ce-loc ce-row-1" data-ce-loc="viewers">Viewers</span>: ' + data['num_viewers'] + '<br>')
					}
					else {
						$upperHolder3.append('<span class="ce-loc ce-row-1" data-ce-loc="last_viewers">Last Viewers</span>: ' + data['num_viewers'] + '<br>')
					}
				}

				if (data['performer_has_fanclub']) {
					$infoHolder2.append('<span class="ce-loc ce-row-1" data-ce-loc="has_fanclub">Has Fanclub</span>: <span class="ce-loc" data-ce-loc="yes">Yes</span><br>')
				}
				else {
					$infoHolder2.append('<span class="ce-loc ce-row-1" data-ce-loc="has_fanclub">Has Fanclub</span>: <span class="ce-loc" data-ce-loc="no">No</span><br>')
				}

				if ('satisfaction_score' in data) {
					let sc = data['satisfaction_score']
					if ('percent' in sc && 'up_votes' in sc && 'down_votes' in sc) {
						$infoHolder2.append('<span class="ce-loc ce-row-1" data-ce-loc="satisfaction_score">Satisfaction Score</span>: ' + sc['percent'] + '% (' + sc['up_votes'] + ' <span class="ce-loc" data-ce-loc="up">up</span>, ' + sc['down_votes'] + ' <span class="ce-loc" data-ce-loc="down">down</span>)<br>')
					}
				}

				localizeStrings()
			},
			onerror: function () {
				$upperHolder.append('<br>' + getLocale('err_vid', 'ERROR: Unable to load video.'))
			}
		})

		// Fetch info about room
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://camschedule.com/api/room/' + username + '?lang=' + lang,
			timeout: 60 * 2 * 1000,
			onload: function (resp) {
				let data
				try {
					data = JSON.parse(resp.responseText)
				}
				catch (SyntaxError) {
					return
				}

				let $loadChatHref = $('<a id="cb-enh-inac-load-chat" style="display:none;" class="ce-loc" data-ce-loc="try_load_chat">Click here to try to load chat.</a><br>')
				$upperHolder2.append($loadChatHref)
				if (isOnline) {
					$loadChatHref.show()
				}

				$loadChatHref.on('click', function (e) {
					$loadChatHref.hide()

					e.preventDefault()
					e.stopPropagation()

					$videoHolder.empty()
					GM_addElement($videoHolder[0], 'iframe', {
						src: 'https://onechance.onelove.workers.dev/?https://chaturbate.com/embed/' + username + '/',
						class: 'cb-enh-chat-frame'
					})
				})

				// Populate "region" row
				if (data['region'] !== '') {
					let href = ''
					if (data['region_id'] == 0) {
						href = '/asian-cams/'
					}
					else if (data['region_id'] == 1) {
						href = '/euro-russian-cams/'
					}
					else if (data['region_id'] == 2) {
						href = '/north-american-cams/'
					}
					else if (data['region_id'] == 3) {
						href = '/south-american-cams/'
					}
					else if (data['region_id'] == 4) {
						href = '/other-region-cams/'
					}
					$infoHolder.append('<span class="ce-loc ce-row-1" data-ce-loc="region">Region</span>: <a href="' + href + '">' + data['region'] + '</a><br>')
				}

				// Populate "online for" row
				if (data['online_for'] && data['online_for'] !== '') {
					$infoHolder.append('<span class="ce-loc ce-row-1" data-ce-loc="online_for">Online For</span>: ' + data['online_for'] + '<br>')
				}
				else if (data['last_online_f'] && data['last_online_f'] !== '') {
					$infoHolder.append('<span class="ce-loc ce-row-1" data-ce-loc="last_online">Last Online</span>: ' + data['last_online_f'] + '<br>')
				}

				let info = {
					'real_name': 'Real Name',
					'birthday': 'Birthday',
					'followers_f': 'Followers',
					'location': 'Location',
					'languages': 'Languages',
					'smoke_drink': 'Smoke / Drink',
					'body_type': 'Body Type',
					'body_decorations': 'Body Decorations',
				}

				Object.keys(info).forEach(function (k) {
					let v = info[k]
					if (data[k]) {
						let $span = $('<span><span class="ce-loc ce-row-1" data-ce-loc="' + k + '">' + v + '</span>: <span></span></span>')
						$span.find('span').eq(1).text(data[k])
						$infoHolder.append($span)
						$infoHolder.append('<br>')
					}
				})

				// Add schedule
				if (data['has_schedule']) {
					$scheduleHolder.append('<span class="ce-loc ce-row-1" data-ce-loc="schedule">Schedule</span>: <br>')
					let darkMode = $('body').hasClass('darkmode') ? 1 : 0
					GM_addElement($scheduleHolder[0], 'iframe', {
						src: 'https://camschedule.com/embed/schedule/' + username + '?dark=' + darkMode + '&lang=' + lang,
						class: 'cb-enh-schedule-frame'
					})
				}

				localizeStrings()
			}
		})
	}

	function enhancePasswordedRoom() {
		// @todo
	}

	function addBioRow(name, visible = true, value = '') {
		let loc = name.replace(' ', '_').toLowerCase()
		let $el = $('<tr class="cb-enh-row" style="' + (visible ? '' : 'display: none; ') + 'font-size: 14px; font-weight: normal; line-height: 15px; vertical-align: top; text-align: left;"><td class="label" style="padding-bottom: 9px; font-family: UbuntuMedium, Arial, Helvetica, sans-serif; height: 16px;"><span><span class="ce-loc" data-ce-loc="' + loc + '">' + name + '</span>:</span></td><td class="contentText cb-enh-row-value" style="font-size: 14px; line-height: 16px; font-family: UbuntuRegular, Arial, Helvetica, sans-serif;">' + value + '</td></tr>')

		let $psContainers = $('.BioContents > div > table > .psContainer')
		let $smContainers = $('.BioContents > div > table > .smContainer')

		if ($psContainers.length > 0) {
			$psContainers.last().after($el)
		}
		else if ($smContainers.length > 0) {
			$smContainers.last().after($el)
		}
		else {
			$('.BioContents > div > table > tr').slice(-2).first().after($el)
		}

		return $el
	}

	let acre2 = '9uNCcsICcoW2EtekEtWjAtOS1dKyknXCk7'

	function insertRoomAv($div, username) {
		let $avDiv = $('<div class="cb-enh-avatar"></div>')
		$div.prepend($avDiv)
		GM_addElement($('.cb-enh-avatar')[0], 'img', {
			src: 'https://camschedule.com/assets/img/avatar.png',
			alt: '',
			onload: 'this.style.opacity=1'
		})

		GM_addElement($('.cb-enh-avatar')[0], 'img', {
			src: 'https://cb-enh-thumb.improper.dev/av/' + username + '.jpg',
			alt: '',
			onload: 'this.style.opacity=1'
		})
		return $avDiv
	}

	document.addEventListener("keydown",
		function (e) {
			if (`${e.code}` === 'KeyX' && e.ctrlKey) {
				if (document.activeElement) {
					if (document.activeElement.type === 'input' || document.activeElement.type === 'textarea' || document.activeElement.hasAttribute('contenteditable')) {
						return
					}
				}

				captureScreenshot()
			}
		}
	)

	// Screenshoting start
	function captureScreenshot() {
		if (window.cbEnhCapturingScreenshot) {
			return
		}

		let $vid = getVideo()
		if ($vid.length === 0) {
			return
		}

		window.cbEnhCapturingScreenshot = true
		let canvas = captureVideoFrame($vid[0])
		window.cbEnhCapturingScreenshot = false
		if (!canvas) {
			alert(getLocale('err_ss', 'ERROR: Failed to capture screenshot!'))
			return
		}

		let username = window.currentBroadcaster ? window.currentBroadcaster : 'unknown'
		let link = document.createElement('a')
		let date = new Date()
		link.download = getFileName(username, '.png', date)
		link.href = canvas.toDataURL()
		link.click()
	}

	function captureVideoFrame(video) {
		let canvas = document.createElement("canvas")
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
		return canvas
	}
	// Screenshoting end

	// Recording start
	window.cbEnhRecording = false
	window.cbEnhVidRecorder_stream = null
	window.cbEnhRecordingCanceledByUser = false
	function startRecording() {
		if (window.cbEnhRecording) {
			return
		}

		let $vid = getVideo()
		if ($vid.length === 0) {
			alert(getLocale('err_no_rec_video', 'ERROR: There is no video to record!'))
			return
		}

		$("#cb-enh-video-controls-record").find("span").text(getLocale("stop_rec", "Stop recording"))
		$("#cb-enh-video-controls-record").find("span").data("ce-loc", "stop_rec")
		$("#cb-enh-video-controls-record").addClass("cb-enh-active")
		window.cbEnhRecording = true
		window.cbEnhRecordingCanceledByUser = false

		let lengthInMS = 1000 * 60 * 10
		let username = window.currentBroadcaster ? window.currentBroadcaster : 'unknown'
		console.log('Starting recording', username)

		let stream = captureStream($vid[0])
		if (stream === 'err-no-func') {
			window.cbEnhRecording = false
			alert(getLocale('err_no_rec_support', 'ERROR: Your browser does not seem to support recording. Please install latest version of modern browser. If you think that\'s mistake, please fill an issue report. Thank you!'))
			return
		}

		$vid[0].play()

		if ($vid[0].muted) {
			stream.getAudioTracks().forEach(t => stream.removeTrack(t))
		}

		let date = new Date()
		startRecordingStream(stream, lengthInMS).then((recordedChunks) => {
			let recordedBlob = new Blob(recordedChunks, { type: "video/webm" })
			console.log(
				`Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`
			)

			let link = document.createElement('a')
			link.download = getFileName(username, '.webm', date)
			link.href = URL.createObjectURL(recordedBlob)
			link.click()

			window.cbEnhVidRecorder_stream = null
			window.cbEnhRecording = false

			if (!window.cbEnhRecordingCanceledByUser) {
				// Start next recording
				startRecording()
				return
			}

			window.cbEnhRecordingCanceledByUser = false

			// UI
			$("#cb-enh-video-controls-record").find("span").text(getLocale("start_rec", "Start recording"))
			$("#cb-enh-video-controls-record").find("span").data("ce-loc", "start_rec")
			$("#cb-enh-video-controls-record").removeClass("cb-enh-active")
		})
	}

	function wait(delayInMS) {
		return new Promise((resolve) => setTimeout(resolve, delayInMS))
	}

	function startRecordingStream(stream, lengthInMS) {
		let options = {
			mimeType: 'video/webm'
		}

		let recorder = new MediaRecorder(stream, options)
		let data = []

		recorder.ondataavailable = (event) => { data.push(event.data) }
		recorder.start(250)
		window.cbEnhVidRecorder_stream = stream

		let stopped = new Promise((resolve, reject) => {
			recorder.onstop = (event) => { resolve(event.name) }
			recorder.onerror = (event) => { reject(event.name) }
		})

		let recorded = wait(lengthInMS).then(() => {
			if (recorder.state === "recording") {
				recorder.stop()
			}
		})

		return Promise.any([stopped, recorded]).then(() => data)
	}

	function stopRecordingStream(stream) {
		stream.getTracks().forEach((track) => track.stop())
	}

	function stopRecording() {
		if (!window.cbEnhRecording || !window.cbEnhVidRecorder_stream) {
			return
		}

		window.cbEnhRecordingCanceledByUser = true
		stopRecordingStream(window.cbEnhVidRecorder_stream)
	}
	// Recording end

	function getFileName(fname, ext, date) {
		let d = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
		let t = ('0' + date.getHours()).slice(-2) + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2)
		return fname + '_' + d + '_' + t + ext
	}

	function captureStream(el) {
		if (el.captureStream) {
			return el.captureStream()
		}

		if (el.mozCaptureStream) {
			return el.mozCaptureStream()
		}

		return 'err-no-func'
	}

	// Clear interval and null it
	function clearIntervalEx(intv) {
		if (intv) {
			clearInterval(intv)
			intv = null
		}
	}

	function rev(str) {
		let rv = ''
		for (let i = str.length - 1; i >= 0; i--) {
			rv += str[i]
		}
		return rv
	}

	// Start
	loadSettings()

	if (getSetting('reg-redir') === 1) {
		regRedir(getSetting('reg-redir-room'))
	}

	// Disable pausing on video click
	document.addEventListener('click', function (e) {
		if (regRedirPreventClick && e.target !== $('.logo-zone a')[0]) {
			e.stopImmediatePropagation()
			e.preventDefault()
			return
		}

		let vid = getVideo()
		if (vid && e.target === vid[0] && isVideoPlaying(vid[0])) {
			e.stopImmediatePropagation()
			setVideoControlsVisible(false)
		}
	}, true)

})()
