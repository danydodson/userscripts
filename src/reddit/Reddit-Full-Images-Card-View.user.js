// ==UserScript==
// @name         Reddit: Full Images Card View
// @namespace    eskander.github.io
// @description  Show non cropped images in Reddit feeds with Card view.
// @author       Eskander
// @license      MIT
// @include      https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @compatible   firefox
// @compatible   chrome
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict'

    // Greasemonkey compatibility
    if (typeof GM_addStyle == "undefined") {
        function GM_addStyle(css) {
            var node = document.createElement("style")
            node.type = "text/css"
            node.appendChild(document.createTextNode(css))
            var heads = document.getElementsByTagName("head")
            if (heads.length > 0) {
                heads[0].appendChild(node)
            } else {
                // no head yet, stick it whereever
                document.documentElement.appendChild(node)
            }
        }
    }

    // toolbar style
    GM_addStyle(`
        .ImageBox-image {
            height: 100%;
        }
    `)
})()