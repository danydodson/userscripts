// ==UserScript==
// @name     Reddit: Hide Promoted Posts
// @namespace HideRedditsPromotedPosts
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @description Hide Reddit's promoted links so they don't bother you.
// @include  https://www.reddit.com/
// @include  https://www.reddit.com/r/*
// @version  1.01
// @grant    none
// ==/UserScript==

function hide_ads() {
    let promos = document.getElementsByClassName("promotedlink")
    for (let promo of promos) {
        promo.style.display = "none"
    }
}

hide_ads()
//Also rerun the code each time document change (i.e new posts are added when user scroll down)
document.addEventListener("DOMNodeInserted", hide_ads)
