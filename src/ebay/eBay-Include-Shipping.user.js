// ==UserScript==
// @name		           eBay: Include Shipping
// @namespace	         ebay_include_shipping
// @description	       Show the true total including shipping on Ebay
// @homepageURL	       https://github.com/daraeman/ebay_include_shipping
// @author		         daraeman
// @version		         1.0.4
// @include		         /https?:\/\/www\.ebay\.com\/*/
// @require		         https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require		         https://cdnjs.cloudflare.com/ajax/libs/big.js/5.0.3/big.min.js
// @icon               https://www.google.com/s2/favicons?domain=ebay.com
// ==/UserScript==

(function ($, Big) {

	const debug = true
	const debug_error = true
	let page

	log("Ebay Include Shipping")

	function getPage() {
		log("getPage")
		if ($("body.s-page").length)
			page = "search"
	}

	function doPage() {
		log("doPage")
		if (page === "search")
			doSearchPage()
	}

	function doSearchPage() {
		log("doSearchPage")

		$(".srp-results .s-item").each((i, node) => {
			let el = $(node)
			log("el", el)
			let item_text = getItemPriceEl(el).text().trim()
			log("item_text", item_text)
			let currency = item_text[0]
			log("currency", currency)
			let price_string = item_text.substr(1)
			log("price_string", price_string)
			if (/ to /.test(price_string)) {
				log("multiple prices detected [%s], skipping", price_string)
				return
			}
			let item_price
			try {
				item_price = new Big(price_string)
				log("item_price", item_price)
			} catch (error) {
				error("error while parsing number [%s]", item_price)
				return
			}
			let shipping_string = getShippingPriceEl(el).text()
			log("shipping_string", shipping_string)
			let shipping_text = (/shipping/.test(shipping_string)) ? shipping_string.trim().substr(2).replace(/shipping/, "").trim() : ""
			log("shipping_text", shipping_text)
			if (shipping_text) {
				let shipping_price = new Big(shipping_text)
				addSearchItemShippingPrice(el, item_price.plus(shipping_price), currency)
			}
		})
	}

	function getItemPriceEl(parent, post_add) {
		log("doSearchPage", parent, post_add)
		let selector = (post_add) ? ".s-item__price:not( .ebay_include_shipping )" : ".s-item__price"
		return parent.find(selector)
	}

	function getShippingPriceEl(parent) {
		log("doSearchPage", parent)
		return parent.find(".s-item__shipping")
	}

	function getShippingPriceParentEl(el) {
		log("getShippingPriceParentEl", el)
		return el.parent()
	}

	function addSearchItemShippingPrice(el, price, currency) {
		log("addSearchItemShippingPrice", el, price, currency)
		let price_parent_el = getShippingPriceParentEl(el)
		log("price_parent_el", price_parent_el)
		let item_price_el = getItemPriceEl(el, true)
		log("item_price_el", item_price_el)
		let item_price = item_price_el.text()
		log("item_price", item_price)
		item_price_el.html('<span class="ebay_include_shipping">' + currency + price.toFixed(2).toString() + ' incl. shipping</span><br>')
		item_price_el.find("span").css({
			"font-size": "20px",
		})
		let shipping_price_el = getShippingPriceEl(el)
		log("shipping_price_el", shipping_price_el)
		item_price_el.append('<span class="ebay_include_shipping">(' + item_price.trim() + shipping_price_el.text().trim().replace("+", " + ") + ")</span>")
		item_price_el.find("span").last().css({
			"display": "inline-block",
			"margin-top": "4px",
			"font-size": "13px",
			"font-weight": 400,
		})
		shipping_price_el.hide()
	}

	function log() {
		if (debug)
			console.log(...arguments)
	}

	function error() {
		if (debug_error)
			console.error(...arguments)
	}

	function init() {
		log("init")
		getPage()
		doPage()
	}

	init()

})(jQuery, Big)