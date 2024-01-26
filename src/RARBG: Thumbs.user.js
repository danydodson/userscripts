// ==UserScript==
// @name          RARBG: Thumbs
// @version       0.2
// @description   rarbg list thumb
// @namespace     https://egore.url.lol/userscripts
// @icon          https://rargb.to/favicon.ico
// @match         *.rargb.to/*
// @include       https://rargb.to/*
// @include       https://rarbg.how/*
// @include       https://www2.rarbggo.to/*
// @include       https://rarbg.proxyninja.org
// @include       https://www.rarbgproxy.to/*
// @include       https://rarbgproxy.to/*
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