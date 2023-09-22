// ==UserScript==
// @name         Bumble: Enhanced
<<<<<<< HEAD
// @version      2.6
=======
// @description  https://habs.sdf.org/ show votes, show online status, and change location on bumble
>>>>>>> 1b6abbc (:sparkles: updates)
// @author       habs
// @version      2.6
// @license      AGPLv3
// @namespace    Nonce Scripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/bumble/Bumble-Enhanced.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/bumble/Bumble-Enhanced.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bumble.com
// @match        https://*.bumble.com/*
// @grant        GM.getValue
// @grant        GM.setValue
<<<<<<< HEAD
// @match        https://*.bumble.com/*
=======
>>>>>>> 1b6abbc (:sparkles: updates)
// ==/UserScript==

/* jshint esversion: 8 */

const encs = []
let user
let hasVoted
let shownMeThisSession = false
let numEncountersCalls = 0
const queue = []
const convos = []
let quota = 0

GM.getValue('voted2', false).then(voted => { hasVoted = voted })

if (!unsafeWindow.XMLHttpRequest.prototype.getResponseText) {
	unsafeWindow.XMLHttpRequest.prototype.getResponseText = Object.getOwnPropertyDescriptor(unsafeWindow.XMLHttpRequest.prototype, 'responseText').get
}

Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, 'responseText', {
	/* eslint-disable-next-line no-undef */
	get: exportFunction(function () {
		let responseText = unsafeWindow.XMLHttpRequest.prototype.getResponseText.call(this)
		try {
			if (this.responseURL.endsWith("bumble.com/mwebapi.phtml?SERVER_APP_STARTUP")) {
				const resp = JSON.parse(responseText)
				user = (resp.body.find(o => o.user) || {}).user
			}
			if (this.responseURL.endsWith("bumble.com/mwebapi.phtml?SERVER_ENCOUNTERS_VOTE")) {
				if (shownMeThisSession && numEncountersCalls === 1) {
					GM.setValue('voted2', true)
					hasVoted = true
				}
				const body = JSON.stringify({
					"$gpb": "badoo.bma.BadooMessage",
					body: [{
						message_type: 81,
						server_get_encounters: {
							number: 0,
							context: 1,
							user_field_filter: {
								projection: [200],
								request_albums: [],
								game_mode: 0,
								request_music_services: {}
							}
						}
					}],
					message_id: 1,
					message_type: 81,
					version: 1,
					is_background: false,
				})
				try {
					window.fetch('/mwebapi.phtml?SERVER_GET_ENCOUNTERS', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-Message-type': '81',
							'x-use-session-cookie': '1',
							'X-Pingback': calculateBumbleChecksum(body),
						},
						body,
					}).then(resp => resp.json().then(data => {
						quota = (data.body[0].client_encounters.quota || {}).yes_votes_quota || 0;
						(document.querySelector('#voteQuota') || {}).innerHTML = quota
					}))
				} catch (err) { console.log(err) }
			}
			if (this.responseURL.endsWith("bumble.com/mwebapi.phtml?SERVER_GET_ENCOUNTERS")) {
				numEncountersCalls++
				const resp = JSON.parse(responseText)
				encs.push(...resp.body[0].client_encounters.results)
				quota = (resp.body[0].client_encounters.quota || {}).yes_votes_quota || 0
				// if (user && user.gender === 2 && user.age >= 20 && user.age <= 30) {
				//   if (!hasVoted) {
				//     shownMeThisSession = true;
				//     resp.body[0].client_encounters.results.unshift(
				//       {"$gpb":"badoo.bma.SearchResult","has_user_voted":false,"user":{"$gpb":"badoo.bma.User","user_id":"zAhMACjE3Mjk3MDM0NTgAIAHjjZ8J9bO_y9_HqD3dpSJV4E4uRAskvT8DUFdElzE_","projection":[370,1150,890,200,210,230,490,1140,1161,380,100,231,10,1160,1161,540,530,291,493],"client_source":1,"access_level":10,"name":"Harry","age":25,"gender":1,"verification_status":4,"albums":[{"$gpb":"badoo.bma.Album","uid":"me:zAhMACjE3Mjk3MDM0NTgAIAHjjZ8J9bO_y9_HqD3dpSJV4E4uRAskvT8DUFdElzE_","name":"Photos of Harry","owner_id":"zAhMACjE3Mjk3MDM0NTgAIAHjjZ8J9bO_y9_HqD3dpSJV4E4uRAskvT8DUFdElzE_","access_type":0,"accessable":true,"adult":false,"requires_moderation":false,"count_of_photos":5,"instruction":"Photos of only you, which easily identify you and show your face clearly.","is_upload_forbidden":false,"photos":[{"$gpb":"badoo.bma.Photo","id":"1373921214","preview_url":"//i.imgur.com/8ypTSle.png","large_url":"//i.imgur.com/8ypTSle.png","large_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":945,"height":1680},"face_top_left":{"$gpb":"badoo.bma.Point","x":421,"y":757},"face_bottom_right":{"$gpb":"badoo.bma.Point","x":509,"y":845},"can_set_as_profile_photo":true,"is_pending_moderation":false,"preview_url_expiration_ts":1647653212,"large_url_expiration_ts":1647653212},{"$gpb":"badoo.bma.Photo","id":"1373939960","preview_url":"//i.imgur.com/6Tve6cr.png","large_url":"//i.imgur.com/6Tve6cr.png","large_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":1024,"height":784},"face_top_left":{"$gpb":"badoo.bma.Point","x":363,"y":296},"face_bottom_right":{"$gpb":"badoo.bma.Point","x":534,"y":467},"can_set_as_profile_photo":true,"is_pending_moderation":false,"preview_url_expiration_ts":1647653212,"large_url_expiration_ts":1647653212},{"$gpb":"badoo.bma.Photo","id":"1373921707","preview_url":"//i.imgur.com/7DADI9k.png","large_url":"//i.imgur.com/7DADI9k.png","large_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":424,"height":566},"face_top_left":{"$gpb":"badoo.bma.Point","x":77,"y":70},"face_bottom_right":{"$gpb":"badoo.bma.Point","x":169,"y":162},"can_set_as_profile_photo":true,"is_pending_moderation":false,"preview_url_expiration_ts":1647653212,"large_url_expiration_ts":1647653212},{"$gpb":"badoo.bma.Photo","id":"1373923083","preview_url":"//i.imgur.com/4Tj4mbR.png","large_url":"//i.imgur.com/4Tj4mbR.png","large_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":1050,"height":1495},"face_top_left":{"$gpb":"badoo.bma.Point","x":429,"y":605},"face_bottom_right":{"$gpb":"badoo.bma.Point","x":675,"y":851},"can_set_as_profile_photo":true,"is_pending_moderation":false,"preview_url_expiration_ts":1647653212,"large_url_expiration_ts":1647653212},{"$gpb":"badoo.bma.Photo","id":"1373927670","preview_url":"//i.imgur.com/WRwx5NA.png","large_url":"//i.imgur.com/WRwx5NA.png","large_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":433,"height":625},"face_top_left":{"$gpb":"badoo.bma.Point","x":0,"y":0},"face_bottom_right":{"$gpb":"badoo.bma.Point","x":318,"y":318},"can_set_as_profile_photo":true,"is_pending_moderation":false,"preview_url_expiration_ts":1647653212,"large_url_expiration_ts":1647653212}],"album_type":7,"game_mode":0},{"$gpb":"badoo.bma.Album","uid":"external_feed:zAhMACjE3Mjk3MDM0NTgAIAHjjZ8J9bO_y9_HqD3dpSJV4E4uRAskvT8DUFdElzE_","name":"Instagram","owner_id":"zAhMACjE3Mjk3MDM0NTgAIAHjjZ8J9bO_y9_HqD3dpSJV4E4uRAskvT8DUFdElzE_","accessable":false,"adult":false,"requires_moderation":false,"count_of_photos":0,"instruction":"","is_upload_forbidden":false,"album_type":12,"access_level":6,"caption":"Harry’s Instagram","album_blocker":{"$gpb":"badoo.bma.PromoBlock","mssg":"Connecting your Instagram will add your latest posts to your profile. Your username won’t be visible.","promo_block_type":111,"promo_block_position":13,"buttons":[{"$gpb":"badoo.bma.CallToAction","text":"Connect Your Instagram","action":13,"type":1,"external_provider_type":12}],"context":8,"stats_variation_id":3},"external_provider":12}],"profile_fields":[{"$gpb":"badoo.bma.ProfileField","id":"work","type":12,"name":"Occupation","display_value":"Software Developer, Finance"},{"$gpb":"badoo.bma.ProfileField","id":"location","type":1,"name":"Location","display_value":"Union City, NJ, USA"},{"$gpb":"badoo.bma.ProfileField","id":"aboutme_text","type":2,"name":"About me","display_value":"I wrote Bumble Enhanced! programmer, nerdy & active person looking to meet someone!"},{"$gpb":"badoo.bma.ProfileField","id":"headline_text","type":23,"name":"Headline","display_value":""},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_height","type":25,"name":"What is your height?","display_value":"6' 2''","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_heightv2.png","hp_element":490},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_exercise","type":25,"name":"Do you work out?","display_value":"Active","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_exercisev2.png","hp_element":904},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_education","type":25,"name":"What’s your education?","display_value":"","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_educationv2.png","hp_element":912},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_drinking","type":25,"name":"Do you drink?","display_value":"Socially","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_drinkingv2.png","hp_element":140},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_smoking","type":25,"name":"Do you smoke?","display_value":"Never","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_smokingv2.png","hp_element":144},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_dating_intentions","type":25,"name":"What do you want from your dates?","display_value":"","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_intentionsv2.png","hp_element":899},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_family_plans","type":25,"name":"What are your ideal plans for children?","display_value":"","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_familyPlansv2.png","hp_element":900},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_zodiak","type":25,"name":"What’s your zodiac sign?","display_value":"","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_starSignv2.png","hp_element":905},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_politics","type":25,"name":"What are your political leanings?","display_value":"Liberal","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_Politicsv2.png","hp_element":903},{"$gpb":"badoo.bma.ProfileField","id":"lifestyle_religion","type":25,"name":"Do you identify with a religion?","display_value":"","required_action":3,"icon_url":"//pd1us.bumbcdn.com/i/big/assets/bumble_lifestyle_badges/normal/mobile_web/standard/sz___size__/ic_badge_profileChips_dating_religionv2.png","hp_element":914},{"$gpb":"badoo.bma.ProfileField","id":"127","type":26,"name":"I’m a real nerd about...","display_value":"programming & linux 🐧","other_display_value":"","icon_url":"","hp_element":0,"is_featured":false},{"$gpb":"badoo.bma.ProfileField","id":"116","type":26,"name":"I will never shut up about...","display_value":"running & runners 🏃","other_display_value":"","icon_url":"","hp_element":0,"is_featured":false}],"profile_summary":{"$gpb":"badoo.bma.ProfileSummary","primary_text":"Writer of Bumble Enhanced! Software Developer, Finance"},"distance_long":"Union City, NJ, USA","game_mode":0,"jobs":[{"$gpb":"badoo.bma.Experience","id":"1373921330","type":1,"name":"Software Developer, Finance","organization_name":"","selected":true,"source":1,"moderation_failed":false}],"hometown":{"$gpb":"badoo.bma.Location"},"residence":{"$gpb":"badoo.bma.Location"},"is_in_private_mode":false,"context_info":"🇺🇸 Works in New York, NY","their_vote":1}}
				//     );
				//     resp.body[0].client_encounters.results.pop();
				//   }
				// }
				responseText = JSON.stringify(resp)
			}
			if (this.responseURL.endsWith("bumble.com/mwebapi.phtml?SERVER_GET_USER_LIST")) {
				const resp = JSON.parse(responseText)
				queue.push(...resp.body[0].client_user_list.section[0].users || [])
				convos.push(...resp.body[0].client_user_list.section[1].users || [])
			}
		} catch (err) {
			console.log(err)
		}
		return responseText
	}, unsafeWindow),
	enumerable: true,
	configurable: true
})

const userIds = []
window.setInterval(() => {
	const hdr = document.querySelector('.encounters-story-profile__header')
	if (!hdr) return
	if (hdr.parentElement.querySelector('.showBumbleVotes')) return
	const name = (document.querySelector('.encounters-story-profile__name') || {}).innerText
	const age = +(document.querySelector('.encounters-story-profile__age') || { innerText: '' }).innerText.replace(',', '').trim()
	const enc = encs.find(enc => enc.user.name === name && enc.user.age === age)
	if (!enc) return
	userIds.push({ name, id: enc.user.user_id })
	console.log(userIds)
	const div = document.createElement('div')
	div.classList.add('showBumbleVotes')
	const vote = enc.user.their_vote
	div.innerHTML = `${vote === 1 ? 'Not voted!' : vote === 2 ? 'Swiped right!' : vote === 3 ? 'Swiped left!' : 'Unknown!'}<br />
  (<span id="voteQuota">${quota}</span> yes votes remaining)`
	hdr.after(div)
}, 1000)

function makeDiv(className, onlineStatus) {
	const div = document.createElement('div')
	div.classList.add(className)
	div.innerHTML = onlineStatus
	div.style.backgroundColor = onlineStatus === 1 ? 'white' : onlineStatus === 2 ? 'yellow' : onlineStatus === 3 ? 'red' : 'grey'
	div.style.position = "absolute"
	div.style.zIndex = "666"
	div.style.borderRadius = "10px"
	div.style.opacity = ".7"
	return div
}

window.setInterval(() => {
	try {
		const carousel = (document.querySelector('.scrollable-carousel__scroll') || { children: [] }).children
		carousel.forEach(car => {
			if (car.querySelector('.showBumbleCarouselOnline')) return
			const match = queue.find(match => match.user_id === car.firstChild.getAttribute('data-qa-uid'))
			if (!match) return
			const div = makeDiv('showBumbleCarouselOnline', match.online_status)
			car.firstChild.append(div)
		})
	} catch (err) { console.log(err) }
	try {
		const msgs = (document.querySelector('.scroll__inner') || { children: [] }).children
		msgs.forEach(msg => {
			if (msg.querySelector('.showBumbleMsgsOnline')) return
			const match = convos.find(match => match.user_id === msg.getAttribute('data-qa-uid'))
			if (!match) return
			const div = makeDiv('showBumbleMsgsOnline', match.online_status)
			msg.prepend(div)
		})
	} catch (err) { console.error(err) }
}, 3000)

window.setInterval(() => {
	const filters = document.querySelector('.encounters-filter__content')
	if (!filters) return
	if (filters.querySelector('.locationSpoofer')) return
	const div = document.createElement('div')
	div.classList.add('encounters-filter__entry')
	div.classList.add('locationSpoofer')
	div.innerHTML = `
    <div class="encounters-filter__content">
      <section class="settings-fieldset">
        <header class="settings-fieldset__header">
          <div class="settings-fieldset__title">
            <h2 class="p-1 text-color-gray-dark"><span>Change Location</span></h2>
          </div>
        </header>
        <div class="form__control form__control--vertical">
          <div class="form__field">
            <div class="text-field text-field--full-rounded" data-qa-role="dialog-add-job-title-field">
              <input type="text" id="spoofLatitude" placeholder="Latitude (Decimal Format)" class="text-field__input" maxlength="40" size="5" dir="auto" value="" />
            </div>
          </div>
        </div>
        <div class="form__control form__control--vertical">
          <div class="form__field">
            <div class="text-field text-field--full-rounded" data-qa-role="dialog-add-job-title-field">
              <input type="text" id="spoofLongitude" placeholder="Longitude (Decimal Format)" class="text-field__input" maxlength="40" size="5" dir="auto" value="" />
            </div>
          </div>
        </div>
      </section>
      <div class="encounters-filter__actions">
        <div class="encounters-filter__action">
          <div class="button button--narrow button--size-m color-primary button--filled" role="button" id="applyLocationSpoofer">
            <span class="button__content">
              <span class="button__text"><span class="action text-break-words"><span id="applySpoofLocation">Apply Location</span></span></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `
	filters.prepend(div)
	document.querySelector('#applyLocationSpoofer').addEventListener('click', async () => {
		const body = JSON.stringify({
			"$gpb": "badoo.bma.BadooMessage",
			"body": [{
				"message_type": 4,
				"server_update_location": {
					"location": [{
						"latitude": +document.querySelector('#spoofLatitude').value,
						"longitude": +document.querySelector('#spoofLongitude').value,
					}]
				}
			}],
			"message_id": 1,
			"message_type": 4,
			"version": 1,
			"is_background": false,
		})
		try {
			const resp = await window.fetch('/mwebapi.phtml?SERVER_UPDATE_LOCATION', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Message-type': '4',
					'x-use-session-cookie': '1',
					'X-Pingback': calculateBumbleChecksum(body),
				},
				body,
			})
			document.querySelector('#applySpoofLocation').innerText = 'Location Set!'
			filters.querySelector('.color-primary[data-qa-role=button]').click()
		} catch (e) {
			window.alert(`Error setting location: ${e}`)
		}
	})
}, 1000)

function calculateBumbleChecksum(inputString) {
	inputString += 'whitetelevisionbulbelectionroofhorseflying'
	const hc = "0123456789abcdef"
	function rh(n) { let j, s = ""; for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0F) + hc.charAt((n >> (j * 8)) & 0x0F); return s }
	function ad(x, y) { let l = (x & 0xFFFF) + (y & 0xFFFF); let m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF) }
	function rl(n, c) { return (n << c) | (n >>> (32 - c)) }
	function cm(q, a, b, x, s, t) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b) }
	function ff(a, b, c, d, x, s, t) { return cm((b & c) | ((~b) & d), a, b, x, s, t) }
	function gg(a, b, c, d, x, s, t) { return cm((b & d) | (c & (~d)), a, b, x, s, t) }
	function hh(a, b, c, d, x, s, t) { return cm(b ^ c ^ d, a, b, x, s, t) }
	function ii(a, b, c, d, x, s, t) { return cm(c ^ (b | (~d)), a, b, x, s, t) }
	function sb(x) {
		let i; let nblk = ((x.length + 8) >> 6) + 1; let blks = new Array(nblk * 16); for (i = 0; i < nblk * 16; i++) blks[i] = 0
		for (i = 0; i < x.length; i++) blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8)
		blks[i >> 2] |= 0x80 << ((i % 4) * 8); blks[nblk * 16 - 2] = x.length * 8; return blks
	}
	let i, x = sb(inputString), a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, olda, oldb, oldc, oldd
	for (i = 0; i < x.length; i += 16) {
		olda = a; oldb = b; oldc = c; oldd = d
		a = ff(a, b, c, d, x[i + 0], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586); c = ff(c, d, a, b, x[i + 2], 17, 606105819)
		b = ff(b, c, d, a, x[i + 3], 22, -1044525330); a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
		c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983); a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
		d = ff(d, a, b, c, x[i + 9], 12, -1958414417); c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
		a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101); c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
		b = ff(b, c, d, a, x[i + 15], 22, 1236535329); a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
		c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i + 0], 20, -373897302); a = gg(a, b, c, d, x[i + 5], 5, -701558691)
		d = gg(d, a, b, c, x[i + 10], 9, 38016083); c = gg(c, d, a, b, x[i + 15], 14, -660478335); b = gg(b, c, d, a, x[i + 4], 20, -405537848)
		a = gg(a, b, c, d, x[i + 9], 5, 568446438); d = gg(d, a, b, c, x[i + 14], 9, -1019803690); c = gg(c, d, a, b, x[i + 3], 14, -187363961)
		b = gg(b, c, d, a, x[i + 8], 20, 1163531501); a = gg(a, b, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, b, c, x[i + 2], 9, -51403784)
		c = gg(c, d, a, b, x[i + 7], 14, 1735328473); b = gg(b, c, d, a, x[i + 12], 20, -1926607734); a = hh(a, b, c, d, x[i + 5], 4, -378558)
		d = hh(d, a, b, c, x[i + 8], 11, -2022574463); c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556)
		a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353); c = hh(c, d, a, b, x[i + 7], 16, -155497632)
		b = hh(b, c, d, a, x[i + 10], 23, -1094730640); a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i + 0], 11, -358537222)
		c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189); a = hh(a, b, c, d, x[i + 9], 4, -640364487)
		d = hh(d, a, b, c, x[i + 12], 11, -421815835); c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651)
		a = ii(a, b, c, d, x[i + 0], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415); c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
		b = ii(b, c, d, a, x[i + 5], 21, -57434055); a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
		c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799); a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
		d = ii(d, a, b, c, x[i + 15], 10, -30611744); c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
		a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379); c = ii(c, d, a, b, x[i + 2], 15, 718787259)
		b = ii(b, c, d, a, x[i + 9], 21, -343485551); a = ad(a, olda); b = ad(b, oldb); c = ad(c, oldc); d = ad(d, oldd)
	}
	return rh(a) + rh(b) + rh(c) + rh(d)
}