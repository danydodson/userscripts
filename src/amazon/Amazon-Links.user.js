// ==UserScript==
// @name             Amazon: Links
// @namespace        https://greasyfork.org/users/115271
// @version          1.0
// @description      Adds eBay markup price, direct link to Amazon product page, eBay search by title, ThePriceGeek search by first 10 words of title, Amabay search by title.  However over price to see minimum eBay price to profit $2 by dropshipping with Prime.
// @match            https://www.amazon.com/*
// @match            https://www.amazon.co.jp/*
// @match            https://www.amazon.co.uk/*
// @match            https://www.amazon.es/*
// @match            https://www.amazon.fr/*
// @match            https://www.amazon.de/*
// @match            https://www.amazon.it/*
// @match            https://www.amazon.*
// @match            https://*.amazon-*.com/*
// @match            https://*.*-amazon.com/*
// @run-at           document-end
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js
// @icon             https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// ==/UserScript==

/**
 * This script adds a few links to each Amazon product page:
 * 1. A direct (clean) link to the product page which can be used e.g. to share (copy & paste)
 *    a product page without session information etc.:
 *      http://amazon.[TLD]/dp/[ASIN]
 * 2. A link to the current product on eBay
 *      http://www.ebay.com/sch/i.html?_sacat=0&_nkw=[title]&LH_BIN=1&LH_FS=1&_sop=15
 * 3. A link to the current product on ThePriceGeek
 *      http://www.thepricegeek.com/results/[first ten words of title]?country=us
 * 4. A link to the current product on Amabay
 *      http://amabay.linked8.com/?p=search&c=ALL&q=[title]&sourceid=srch_rslt_logo&region=us
 **/

(function () {
	/**
	 * Decimal adjustment of a number.
	 *
	 * @param {String}  type  The type of adjustment.
	 * @param {Number}  value The number.
	 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number} The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
		// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value)
		}
		value = +value
		exp = +exp
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN
		}
		// Shift
		value = value.toString().split('e')
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
		// Shift back
		value = value.toString().split('e')
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function (value, exp) {
			return decimalAdjust('round', value, exp)
		}
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function (value, exp) {
			return decimalAdjust('floor', value, exp)
		}
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function (value, exp) {
			return decimalAdjust('ceil', value, exp)
		}
	}
})();

(function () {

	// config
	var SHOW_LINK_ICON = 1 // toggle link fav icons
	var LINK_STYLE = "font-weight: bold; font-style: italic;"

	// not all pages have fav icons so the following currently makes no sense
	var SHOW_LINK_TEXT = 1 // toggle link text

	if (!$('input#ASIN:first').length) {
		return // this doesn't seem to be a product page
	}

	// get the ASIN (product id)
	var asin = $('input#ASIN:first').val()

	// get the product title
	var title = document.getElementById("productTitle").innerHTML.replace(/"/g, '').trim()

	// get the price
	try {
		var price = document.getElementById("priceblock_ourprice").innerHTML.trim().substr(1)
	}
	catch (err) {
		var price = document.getElementById("priceblock_saleprice").innerHTML.trim().substr(1)
	}

	// define the eBay sale price

	var markup = Math.round10(price * 1.09 * 1.0319 + 3.70, -2)

	try {
		document.getElementById("priceblock_ourprice").innerHTML = "<abbr title=" + markup + ">$" + price + "</abbr>"
	}
	catch (err) {
		document.getElementById("priceblock_saleprice").innerHTML = "<abbr title=" + markup + ">$" + price + "</abbr>"
	}

	// alert("Must sell above $" + markup);

	// get top level domain (the simple way)
	var tld = document.domain.split('.').pop()
	if (['au', 'br', 'mx'].indexOf(tld) > -1) { // add .com to some domains
		tld = 'com.' + tld
	} else if (['uk', 'jp'].indexOf(tld) > -1) { // add .co to others
		tld = 'co.' + tld
	}


	// create all new links

	// direct link
	var link1url = ''
	var link1 = ''
	if (tld != undefined) { // add only if TLD was identified
		var tooltip = (tld == 'de' ? 'Direkter und sauberer Produktlink.' : 'Direct and clean product link.')
		link1url = 'http://amazon.' + tld + '/dp/' + asin
		link1 = (SHOW_LINK_ICON ? '<img src="http://www.amazon.' + tld + '/favicon.ico" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
			+ '<a target="_blank" href="http://amazon.' + tld + '/dp/' + asin + '" style="color: #e47911;' + LINK_STYLE + '" title="' + tooltip + '">'
			+ (SHOW_LINK_TEXT ? (tld == 'de' ? 'Direkter Link' : 'Direct link') : '')
			+ '</a> / '
	}


	// eBay.com
	var link2url = 'http://www.ebay.com/sch/i.html?_sacat=0&_nkw=' + title + '&LH_BIN=1' + '&LH_FS=1' + '&_sop=15' + '&_udlo=' + price
	var link2 = (SHOW_LINK_ICON ? '<img src="http://i.imgur.com/1TYirv3.png" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
		+ '<a target="_blank" href="' + link2url + '" style="color: #039;' + LINK_STYLE + '">'
		+ (SHOW_LINK_TEXT ? 'eBay' : '') + '</a> / '
	// ThePriceGeek.com
	var link3url = 'http://www.thepricegeek.com/results/' + title.replace(/(([^\s]+\s\s*){10})(.*)/, "$1") + '?country=us'
	//var link3 = (SHOW_LINK_ICON ? '<img src="http://www.snip-me.de/favicon.ico" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
	var link3 = '<a target="_blank" href="' + link3url + '" style="color:  #106bcc;' + LINK_STYLE + '">'
		+ (SHOW_LINK_TEXT ? 'ThePriceGeek' : '') + '</a> / '
	// Amabay
	var link4url = 'http://amabay.linked8.com/?p=search&c=ALL&q=' + title + '&sourceid=srch_rslt_logo&region=us'
	var link4 = (SHOW_LINK_ICON ? '<img src="http://theimagehost.net/upload/0b12529fc536c7c8a832957c19becfc5.png" border="0" align="absmiddle" width="16" height="16" />&nbsp;' : '')
		+ '<a target="_blank" href="' + link4url + '" style="color:  #900;' + LINK_STYLE + '">'
		+ (SHOW_LINK_TEXT ? 'Amabay' : '') + '</a>'


	// add the links as new table row below the price information
	$('table.product > tbody:last > tr:last, table.a-lineitem > tbody:last > tr:last').after('<tr><td></td><td>' + link1 + link2 + link3 + link4 + '</td></tr>')

})()