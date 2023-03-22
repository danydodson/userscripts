// ==UserScript==
// @name           Amazon: Highlight Resellers
// @namespace      graphen
// @version        1.7.1
// @description    See instantly if the product really comes from Amazon or from a reseller
// @author         Graphen
// @match          /^https?:\/\/(www|smile)\.amazon\.(cn|in|sg|se|ae|fr|de|pl|it|nl|es|ca|com(\.(mx|au|br|tr|be))?|co\.(uk|jp))\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN|product-reviews)\/.*$/
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @license        MIT
// @icon           https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @noframes
// ==/UserScript==

/* jshint esversion: 6 */

(function (doc) {
	'use strict'

	//Set and save color preference:
	//GM_setValue("pureAmazonColor", "#RRGGBB");
	//GM_setValue("resellerColor", "#RRGGBB");

	//Reset colors to default:
	//GM_deleteValue("pureAmazonColor");
	//GM_deleteValue("resellerColor");

	const amazonIsSellerByBuyBox = [
		//American English
		"Ships from Amazon US Sold by Amazon US",
		"Ships from Amazon.com Sold by Amazon.com",
		//British English .co.uk
		"Dispatches from Amazon Sold by Amazon",
		//Belgian - English .com.be
		"Dispatches from Amazon.com.be Sold by Amazon.com.be",
		//Belgian - Netherlands .com.be
		"Verzonden vanuit Amazon.com.be Verkocht door Amazon.com.be",
		//Belgian - French .com.be
		"Expédié par Amazon.com.be Vendu par Amazon.com.be",
		//Brazilian / Portuguese
		"Enviado por Amazon.com.br Vendido por Amazon.com.br",
		//Canadian
		"Ships from Amazon.ca Sold by Amazon.ca",
		//Czech
		"Odesílatel Amazon Prodejce Amazon",
		//Dutch
		"Verzonden vanuit Amazon Verkocht door Amazon",
		//French
		"Expédié par Amazon Vendu par Amazon",
		//German
		"Versand Amazon Verkäufer Amazon",
		//Italian
		"Spedizione Amazon Venditore Amazon",
		//Japanese
		"Ships from Amazon.co.jp Sold by Amazon.co.jp",
		"出荷元 Amazon.co.jp 販売元 Amazon.co.jp",
		"配送方 Amazon.co.jp 卖家 Amazon.co.jp",
		//Mexican / Spanish
		"Envío desde Amazon Estados Unidos Vendido por Amazon Estados Unidos",
		//Polish
		"Wysyłka z Amazon Sprzedane przez Amazon",
		//Portuguese
		"Enviado de Amazon Vendido por Amazon",
		//Spanish
		"Envío desde Amazon Vendido por Amazon",
		//Swedish
		"Skickas från Amazon Säljs av Amazon",
		//Turkish
		"Gönderici Amazon Satıcı Amazon",
		//UAE
		"Ships from Amazon.ae Sold by Amazon.ae"
	]

	const amazonIsSellerByMerchInfo = [
		//British English
		"Dispatched from and sold by Amazon.",
		"Dispatched from and sold by Amazon EU Sarl.",
		//Canadian English
		"Ships from and sold by Amazon.ca.",
		//American English
		"Ships from and sold by Amazon.com Services LLC.",
		//Australian English
		"Ships from and sold by Amazon US.",
		//United Arab Emirates English
		"Ships from and sold by Amazon.ae.",
		//German
		"Verkauf und Versand durch Amazon.",
		"Verkauf und Versand durch Amazon EU Sarl.",
		"Verkauf und Versand durch amazon.de.",
		//Spanish
		"Vendido y enviado por Amazon.",
		"Vendido y enviado por Amazon EU Sarl.",
		//French
		"Expédié et vendu par Amazon.",
		"Expédié et vendu par Amazon EU Sarl.",
		//Italian
		"Venduto e spedito da Amazon.",
		"Venduto e spedito da Amazon EU Sarl.",
		//Dutch
		"Verzonden en verkocht door Amazon.",
		"Verzonden en verkocht door Amazon EU Sarl.",
		//Mexican / Spanish
		"Vendido y enviado por Amazon México.",
		//Brazilian / Portuguese
		"Enviado e vendido por Amazon.com.br.",
		//Japanese
		"この商品は、Amazon.co.jp が販売、発送します。",
		//Polish
		"Wysyłka i sprzedaż przez Amazon."
	]

	const pureAmazonColor = GM_getValue("pureAmazonColor", "limegreen")
	const resellerColor = GM_getValue("resellerColor", "fuchsia")


	function highlight() {
		// Two different box designs possible: tabularBuybox and mechInfo
		var merchInfo = doc.getElementById("merchant-info")
		var tabularBuybox = doc.getElementById("tabular-buybox")
		if (tabularBuybox) {
			let shippingText = tabularBuybox.innerText.trim()
			// console.log("#AZHR Tabular Buybox: " + shippingText);
			// Remove blank lines
			shippingText = shippingText.replace(/^\s*\n/gm, "")
			// Remove details after seller / shipping info
			shippingText = shippingText.split("\n", 4)
			// Remove whitespace
			shippingText.forEach((line, index) => { shippingText[index] = line.trim() })
			shippingText = shippingText.join(" ")
			// console.log("#AZHR Tabular Buybox: " + shippingText);
			if (amazonIsSellerByBuyBox.includes(shippingText)) {
				GM_addStyle(`#tabular_feature_div > #tabular-buybox > .tabular-buybox-container *,
													 #shipsFromSoldByMessage_feature_div *
															 { color: ${pureAmazonColor} !important;
																 font-weight: bold !important; }`)
			}
			else {
				GM_addStyle(`#tabular_feature_div > #tabular-buybox > .tabular-buybox-container *,
													 #shipsFromSoldByMessage_feature_div *
															 { color: ${resellerColor} !important;
																 font-weight: bold !important; }`)
			}
		}
		else if (merchInfo) {
			let shippingText = merchInfo.innerText.trim()
			//console.log("#AZHR Merchant Info: " + shippingText);
			if (amazonIsSellerByMerchInfo.includes(shippingText)) {
				merchInfo.style.color = pureAmazonColor
			}
			else {
				merchInfo.style.color = resellerColor
			}
		}
	}

	highlight()

	// Execute again when item variation is selected
	var buyboxParent = doc.getElementById('desktop_buybox')
	if (buyboxParent) {
		var MO = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(function (nodeElement) {
					if (nodeElement.id === "buybox") {
						highlight()
					}
				})
			})
		})
		MO.observe(buyboxParent, { childList: true, subtree: true })
	}

})(document)
