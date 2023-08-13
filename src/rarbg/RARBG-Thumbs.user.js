// ==UserScript==
// @name          RARBG: Thumbs
// @namespace     https://rarbg.to/
// @version       0.2
// @description   rarbg list thumb
// @namespace     https://github.com/danydodson/userscripts
// @icon          https://rargb.to/favicon.ico
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Thumbs.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Thumbs.user.js
// @match         http*://*rarbg*/*
// @match         https://rarbg.how/*
// @grant         none
// @copyright     2012+, You
// ==/UserScript==

$(function () {
	$("table.lista2t tr.lista2").each(function () {
		var getTd = $(this).find("td:eq(1)")
		var getImgsrc = getTd.find("a").attr("onmouseover")
		getTd.find("a").off("onmouseover").removeAttr("onmouseover")
		if (getImgsrc && getImgsrc != "") {
			var imgsrc = getImgsrc.split("http")[1].split("\\")[0]
			if (imgsrc && imgsrc != "") {
				getTd.prepend('<img src="http' + imgsrc + '" alt="" style="margi-right:5x;width:150px">')
			}
		}
	})
})