// ==UserScript==
// @name         Pirate Bay: Hide Fake Torrents
// @namespace    https://egore.url.lol/userscripts
// @version      2.0
// @description  Hide Fake Torrents on The Pirate Bay with Conditional Logic
// @author       https://www.reddit.com/user/nicobelic
// @match        https://thepiratebay.org/*
// @icon         https://thepiratebay.org/favicon.ico
// @grant        none
// @locale       English
// ==/UserScript==

(function() {

    // Change the values below if you want
    maxSeedsWithoutTrust = 1000
    trustedTorrentsOnly = false
    hideUntrustedTorrentsWithoutComments = false
    hidePorn = false
    hideFrench = false
    hideTelesyncsAndCams = false
    
    dontHideJustWarn = true
    disableThisCompletely = false
    
    // Don't touch anything past this point
    function hide(badtorrent) {
		if (dontHideJustWarn) {
			badtorrent.style.background = '#fbbdbd';
		} else {
			badtorrent.style.display = "none";
		}
	}
	if (!disableThisCompletely) {
		var torrents = Array.from(document.querySelectorAll('#searchResult tbody tr'));

		if (hidePorn) {
			torrents.forEach(function(torrent) {
				if (typeof torrent != 'undefined') {
					if (torrent.querySelectorAll('td:nth-child(1)')[0].innerText.search('Porn') != -1) {
						hide(torrent);
					}
				}
			});
		}

		if (hideFrench) {
			torrents.forEach(function(torrent) {
				if (typeof torrent != 'undefined') {
					if (torrent.querySelectorAll('td .detLink')[0].innerText.toLowerCase().search('french') != -1) {
						hide(torrent);
					}
				}
			});
		}

		if (hideTelesyncsAndCams) {
			torrents.forEach(function(torrent) {
				if (typeof torrent != 'undefined') {
					torrentTitle = torrent.querySelectorAll('td .detLink')[0].innerText.toLowerCase();
					if (
						torrentTitle.search('hdcam') != -1 ||
						torrentTitle.search(' cam ') != -1 ||
						torrentTitle.search('hd-ts') != -1 ||
						torrentTitle.search('hdts') != -1 ||
						torrentTitle.search('camrip') != -1
					) {
						hide(torrent);
					}
				}
			});
		}

		torrents.forEach(function(torrent) {
			if (typeof torrent != 'undefined') {
				if (torrent.innerHTML.search(/alt="VIP"|alt="Trusted"/) == -1) {
					if (trustedTorrentsOnly) {
						hide(torrent);
					} else {
						if (hideUntrustedTorrentsWithoutComments) {
							// Max seeds exceeded AND no comments
							torrentSeeds = parseInt(torrent.querySelectorAll('td:nth-child(3)')[0].innerText);
							if ((torrentSeeds >= maxSeedsWithoutTrust) || (torrent.innerHTML.search("img[src='//thepiratebay.org/static/img/icon_comment.gif']").length == -1)) {
								hide(torrent);
							}
						} else {
							// Max seeds exceeded
							torrentSeeds = parseInt(torrent.querySelectorAll('td:nth-child(3)')[0].innerText);
							if (torrentSeeds >= maxSeedsWithoutTrust) {
								hide(torrent);
							}
						}
					}
				}
			}
		});
	}
})();