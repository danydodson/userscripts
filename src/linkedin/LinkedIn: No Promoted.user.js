// ==UserScript==
// @name         LinkedIn: No Promoted
// @namespace   https://egore.url.lol/userscripts
// @version      1.12
// @description  Removes promoted posts on LinkedIn
// @author       Wim Godden <wim@cu.be>
// @match        https://linkedin.com/*
// @match        https://www.linkedin.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=linkedin.com
// ==/UserScript==

/*eslint no-undef: 0*/
/*eslint no-multi-spaces: 0*/

function removeSponsored() {
	$('div.ember-view a div span div span span.ember-view span:contains("Promoted")').parent().parent().parent().parent().parent().parent().parent().parent().hide()
	$('span:contains("Promoted")').parent().parent().parent().parent().parent().parent().remove()
	setTimeout(function () {
		removeSponsored()
	}, 2000) //Two seconds will elapse and Code will execute.
}

function removeSponsoredTimer($) {
	setTimeout(function () {
		removeSponsored()
	}, 2000) //Two seconds will elapse and Code will execute.
}

if (typeof jQuery === 'function') {
	$(function () {
		removeSponsoredTimer(jQuery)
	})
}
else {
	add_jQuery(removeSponsoredTimer, '1.7.2')
}

function add_jQuery(callbackFn, jqVersion) {
	jqVersion = jqVersion || '1.7.2'
	var D = document
	var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement
	var scriptNode = D.createElement('script')
	scriptNode.src = 'http://ajax.googleapis.com/ajax/libs/jquery/'
		+ jqVersion
		+ '/jquery.min.js'

	scriptNode.addEventListener('load', function () {
		var scriptNode = D.createElement('script')
		scriptNode.textContent =
			'var gm_jQuery  = jQuery.noConflict (true);\n'
			+ '(' + callbackFn.toString() + ')(gm_jQuery);'

		targ.appendChild(scriptNode)
	}, false)
	targ.appendChild(scriptNode)
}
