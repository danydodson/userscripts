// ==UserScript==
// @name        Mastodon: Fediverse Ticker
// @name:ja     Mastodon fediverse ティッカー
// @description Display the server to which the contributor belongs in an easily viewable manner.
// @match       https://fedibird.com/*
// @match       https://mstdn.jp/*
// @match       https://pawoo.net/*
// @match       https://mstdn.sublimer.me/*
// @match       https://social.vivaldi.net/*
// @author      hidao80
// @version     1.0.4
// @namespace   https://egore.url.lol/userscripts
// @license     MIT
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Mastodon_Logotype_%28Simple%29.svg/953px-Mastodon_Logotype_%28Simple%29.svg.png
// @run-at      document-end
// @grant       none
// ==/UserScript==

// Twitter Emoji (Twemoji)
// License
//   Copyright 2019 Twitter, Inc and other contributors
//   Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
//   https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS

const usableSheet = [...document.styleSheets].slice(-1)[0];

let completedDomainList = [];

// Monitor new status
const timer = setInterval(() => {
    // Designation of column to watch for posts
    const columns = document.querySelectorAll(".column");
    const toots = document.querySelectorAll(".status");

    if (toots.length > 0) {
        clearInterval(timer);

        for (const column of columns) {
            new MutationObserver(callback).observe(column, {
                childList: true,
            });
        }

        for (const toot of toots) {
            updateTicker(toot);
        }
    }
}, 1_000);

function callback(mutations) {
    for (const mutation of mutations) {
        updateTicker(mutation.target);
    };
}

// Style is a later winner, so send and add
function updateTicker(element) {
    const url = new URL(element.querySelector(".status__display-name").href);
    const domain = url.host;

    if (completedDomainList.find(v => v == domain) == undefined) {
        const backgroundColor = getBackgroundColor(domain);
        const tickerStyle = getTickerCss(domain, backgroundColor);
        console.log(domain, backgroundColor);

        usableSheet.insertRule(tickerStyle, usableSheet.cssRules.length);

        completedDomainList.push(domain);
        console.log({ completedDomainList });
    }
}

function getBackgroundColor(domain) {
    const CHARACTER = "abcdefghijklmnopqrstuvwxyz-_.,/?&%=[]0123456789";
    return (domain.slice(0, 3) + domain.slice(-3))
        .split("")
        .map((char) => {
            let hex = CHARACTER.indexOf(char) % 16;
            // hex %= 16;
            // hex = hex <= 4 ? hex + 4 : hex;  // Control too dark and too light.
            return hex.toString(16);
        })
        .join("");
}

function getTickerCss(domain, backgroundColor) {
    return `a[class="status__display-name"][href*="${domain}"]::before {
        content: "${domain}";
        display: inline-block;
        color: #FFF;
        font-weight: 600;
        padding: 0 0.5rem;
        margin-bottom: 0.25rem;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000;
        background-image: linear-gradient(transparent 20%, #${backgroundColor} 20%);
    }`;
}
