// ==UserScript==
// @name         CodeWars: Helper
// @description  Removes unlock solution buttons and AD under the kata description
// @author       Murka
// @version      0.1
// @license      MIT
// @namespace    Nonce Scripts
// @icon         https://i.imgur.com/LKAcLYO.png
// @match        *://www.codewars.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

/* jshint esversion:6 */

/*
		Author: Murka
		Github: https://github.com/Murka007
		Discord: https://discord.gg/sG9cyfGPj5
		Greasyfork: https://greasyfork.org/en/users/919633
*/

(function () {
	"use strict"

	// Removes unlock solution button, right under sample tests
	const HIDE_SOLUTION_TRAIN = true

	// Removes unlock solution button in the kata preview
	const HIDE_SOLUTION_PREVIEW = false

	// Removes AD banner under kata description
	const HIDE_DESCRIPTION_BANNER = true

	const styles = []

	if (HIDE_SOLUTION_TRAIN) {
		styles.push(`
					#view_solutions, #surrender_btn {
							display: none!important;
					}
			`)
	}

	if (HIDE_SOLUTION_PREVIEW) {
		styles.push(`
					.w-full.mt-2:not(.clear-both) > * > ul.flex.flex-row.justify-center.items-center.space-x-2.px-0.border-0.h-10 > li:nth-child(2) {
							display: none!important;
					}
			`)
	}

	if (HIDE_DESCRIPTION_BANNER) {
		styles.push(`
					.description.h-full {
							height: auto!important;
					}

					.description.h-full > .description-footer {
							display: none!important;
					}
			`)
	}

	const style = document.createElement("style")
	style.innerHTML = styles.join("\n")
	document.head.appendChild(style)

})()