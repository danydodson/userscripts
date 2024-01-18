// ==UserScript==
// @name         TamperMonkey: New Userscript
// @description  try to take over the world!
// @author       You
// @version      0.1
// @namespace    Nonce Scripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/tampermonkey/Tampermonkey-New-Userscript.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/tampermonkey/Tampermonkey-New-Userscript.user.js
// @icon         https://www.tampermonkey.net/favicon.ico
// @match        https://www.tampermonkey.net/index.php?version=4.9&ext=dhdg&updated=true
// @match        https://connect.garmin.com/modern/badges
// @grant        GM_log
// @grant        GM_addStyle
// ==/UserScript==

(function () {
	'use strict'

	GM_log('garmin cleaning waiting')

	var intervalId = setInterval(function () {
		var divs = document.getElementsByClassName('badge-available')
		//GM_log(divs);
		divs = Array.from(divs)

		divs.forEach(function (div) {
			var div2 = div.getElementsByClassName('badge-name')
			if (div2[0].innerHTML.startsWith('<span>Noble Warrior Hero')) {
				GM_log('garmin cleaning started')
				div.remove()
			}
			if (div2[0].innerHTML.startsWith('<span>Light. Darkness. A Balance.')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>Impressive. Most Impressive.')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>No, You Move')) div.remove()//
			if (div2[0].innerHTML.startsWith('<span>Higher. Further. Faster.')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>I Can Do This All Day')) div.remove()
			if (div2[0].innerHTML.startsWith(`<span>Nothing's Impossible`)) div.remove()
			if (div2[0].innerHTML.startsWith('<span>Rule the Galaxy')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>High Ground')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>On Your Left')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>Try to Keep Up')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>First Avenger')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>Hone Your Strength')) div.remove()
			if (div2[0].innerHTML.startsWith('<span>Feel the Force Flow')) {
				div.remove()
				GM_log('garmin cleaning done')
				clearInterval(intervalId)
			}
		})

	}, 500)

})();

