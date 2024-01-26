// ==UserScript==
// @name        Cleaner: General URL Cleaner
// @run-at      document-start
// @namespace   https://egore.url.lol/userscripts
// @description Cleans URL's from various popular sites.
// @include     https://www.newegg.com/*
// @include     https://www.newegg.ca/*
// @include     https://www.bing.com/*
// @include     https://www.youtube.com/*
// @include     https://www.imdb.com/*
// @include     https://www.facebook.com/*
// @include     https://disqus.com/embed/comments/*
// @include     /^https://(www|smile)\.amazon(\.com?)?\.\w{2,3}/.*$/
// @include     /^https?://\w+\.google(\.com?)?\.\w{2,3}/.*$/
// @include     /^https://[\w.]+\.ebay(desc)?(\.com?)?\.\w{2,3}/.*$/
// @include     /^https://[\w\d.]*twitter.com/.*$/
// @include     /^https?://(www\.)?staticice\.com\.au/.*$/
// @exclude     https://apis.google.com/*
// @exclude     https://accounts.google.com/*
// @exclude     https://support.google.com/*
// @exclude     https://www.google.com/recaptcha/*
// @exclude     https://hangouts.google.com/webchat/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
// @version     3.3
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/10096/General%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/10096/General%20URL%20Cleaner.meta.js
// ==/UserScript==

/*
 * Vars
 */

var ebay = /\.ebay(desc)?(\.com?)?\.\w{2,3}$/;
var google = /\.google\.com?(\.\w{2,3})?$/;
var amazon = /^(www|smile)\.amazon?\.com?(\.\w{2,3})?$/;
var amazonAd = /\.amazon-adsystem\.com?(\.\w{2,3})?$/;

var utmParams = /&utm_[^&]+/g;
var neweggParams = /&(cm_sp|icid|ignorebbr)=[^&#]*/g;
var imdbParams = /&(p\w_rd_\w+|ref_)=[^&#]*/g;
var bingParams = /&(go|qs|form|FORM|filt|pq|s[cpk]|qpvt|cvid)=[^&#]*/g;
var youtubeParams = /&(feature|src_vid|annotation_id|[gh]l)=[^&#]*/g;
var ebayParams = /&(_(o?sacat|odkw|from|trksid|trkparms)|frcectupt|rt|epid|amp;[^=]+)=[^&#]*/g;
var amazonParams = /&(url|ie|th|psc|p\w_rd_\w\w?|bbn|rw_html_to_wsrp|ref_?|_encoding|refRID)=[^&#]*/g;
var googleParams = /&(sa(fe)?|ved|source(id)?|s?ei|tab|tbo|h[ls]|authuser|n?um|ie|aqs|as_qdr|bav|bi[wh]|bs|bvm|cad|channel|complete|cp|s?client|d[pc]r|e(ch|msg|s_sm)|g(fe|ws)_rd|gpsrc|noj|btnG|o[eq]|p(si|bx|f|q)|rct|rlz|site|spell|tbas|usg|xhr|gs_\w+)=[^&#]*/g;

var youtubeRedir = /[?&]q=([^&]+)/;
var genericRedir1 = /[?&](new|img)?u(rl)?=([^&]+)/i;
var genericRedir2 = /[?&]\w*url=([^&]+)/i;

let currHost = location.host;
let currPath = location.pathname;
let currSearch = location.search;

/*
 * Main
 */

if (currHost === 'www.bing.com') {
    cleanCurrParams(bingParams);
    cleanLinks(parserAll);
    return;
}

if (currHost === 'www.youtube.com') {
    if (currPath === '/redirect')
        cleanRedir(location, youtureRedir);

    if (currPath === '/watch')
        cleanCurrParams(youtubeParams);

    cleanLinks(parserYoutube);
    return;
}

if (currHost.endsWith('.newegg.com') || currHost.endsWith('.newegg.ca')) {
    cleanCurrParams(neweggParams);
    cleanLinks(parserNewegg);
    return;
}

if (currHost === 'www.imdb.com') {
    cleanCurrParams(imdbParams);
    cleanLinks(parserIMDB);
    onhashchange = deleteHash();
    return;
}

if (google.test(currHost)) {
    if (currPath === '/url' || currPath === '/imgres')
        cleanRedir(location, googleParams);

    if (!currSearch && !/[&#]q=/.test(location.hash))
        return;

    cleanCurrParams(googleParams);
    changeState(googleInstant);

    if (currSearch.includes('tbm=isch'))
        cleanLinksAlways(parserGoogleImages);
    else
        cleanLinks(parserGoogle);

    return;
}

if (ebay.test(currHost)) {
    if (currPath.includes('/itm/')) {
        let item = currPath.match(/\/\d{12}/);
        let origList = currSearch.replace(/\?.*&?(orig_cvip=[^&]+).*/, '?$1');
        setCurrUrl('/itm' + item + origList + location.hash);
    }
    else if (currPath.startsWith('/p/')) {
        if (currSearch.includes('iid='))
            setCurrUrl('/itm/' + currSearch.match(/[?&]iid=(\d{12})/).pop());

        else
            setCurrUrl(currPath);
    }

    cleanCurrParams(ebayParams);
    cleanLinks(parserEbay);
    onhashchange = deleteHash;
    return;
}

if (amazon.test(currHost)) {
    let item = location.pathname.match(/\/[A-Z\d]{10}(?=\/|$)/);
    if (currPath.includes('/dp/'))
        setCurrUrl('/dp' + item);

    else if (currPath.includes('/gp/product'))
        setCurrUrl('/gp/product' + item);

    else if (currSearch)
        cleanCurrParams(amazonParams);;

    cleanLinks(parserAmazon);
    onhashchange = deleteHash;
    return;
}

if (currHost.endsWith('staticice.com.au')) {
    cleanLinks(parserStaticice);
    return;
}

if (currHost=='twitter.com') {
    cleanLinks(parserTwitter);
    return;
}

if(currHost=='www.facebook.com') {
    cleanLinks(parserFacebook);
    return;
}

if (currHost=='disqus.com') {
    cleanLinks(parserDisqus);
    return;
}

/*
 * Boilerplate functions
 */

function setCurrUrl(url) {
    history.replaceState(null, null, url);
}

function cleanCurrParams(params) {
    let search = location.search.replace('?','?&').replace(params,'').replace('&','').replace(/\?$/,'');
    if (search.length<2)
        setCurrUrl(location.pathname);
    else
        setCurrUrl(search);
}

function deleteHash() {
    history.replaceState(null, null, ' ');
}

function observe(func) {
    new MutationObserver(func).observe(document, {childList:true, subtree:true});
}

// Clean links once, mark as cleaned, then ignore them
function cleanLinks(linkParser) {
    observe(function() {
        for (let a of document.links) {
            if (a.cleaned) 
                continue;

            if (a.protocol && a.protocol.startsWith('http'))
                linkParser(a);

            a.cleaned = 1;
        }
    });
}

// Always clean links
function cleanLinksAlways(linkParser) {
    observe(function() {
        for (let a of document.links)
            if (a.protocol && a.protocol.startsWith('http'))
                linkParser(a);
    });
}

function googleInstant(url) {
    let parts = url.split('#');
    if (parts.length !== 2)
        return url;

    let hash = parts[1];
    if (hash === 'imgrc=_')
        return ' ';

    if (/(^|&)q=/.test(hash))
        return '?' + hash;

    return '#' + hash;
}

// Intercept & modify url passed into history.replaceState/pushState
function changeState(mod) {
    history.realPushState = history.pushState;
    history.realReplaceState = history.replaceState;

    history.pushState = function() {
        history.realPushState(null, null, mod(arguments[2]));
    };

    history.replaceState = function() {
        history.realReplaceState(null, null, mod(arguments[2]));
    };
}

/*
 * Link parsing functions
 */

function parserAll(a) {
    let host = a.host;
    let path = a.pathname;

    if (google.test(host)) {
        if (path === '/imgres' || path === '/url')
            cleanRedir(a,genericRedir1);

        else
            cleanParams(a,googleParams);

        return;
    }

    if (host === 'www.youtube.com') {
        if (path === '/watch')
            cleanParams(a,youtubeParams);

        else if (path === '/redirect')
            cleanRedir(a,youtubeRedir);
    }

    if (a.host.endsWith('.bing.com'))
        cleanParams(a,bingParams);

    parserAmazon(a);
    parserEbay(a);
    parserNewegg(a);
    parserIMDB(a);
    cleanParams(a,utmParams);
}

function parserGoogle(a) {
    a.removeAttribute('onmousedown');
    parserAll(a);
}

function parserGoogleImages(a) {
    let jsaction = a.getAttribute('jsaction');
    if (jsaction && jsaction.includes('down:irc.rl'))
        a.removeAttribute('jsaction');

    a.removeAttribute('onmousedown');
    parserAll(a);
}

function parserYoutube(a) {
    parserAll(a);
    let text = a.innerText;
    let href = a.href;
    if (text === href || text.endsWith('...') && href.startsWith(text.slice(0,-3)))
        a.innerText = href;
}

function parserAmazon(a) {
    if (amazonAd.test(a.host))
        a.href = 'https:' + a.pathname.split('/https:').pop() + a.search;

    if (!amazon.test(a.host)) 
        return;

    if (a.pathname.includes('/picassoRedirect'))
        cleanRedir(a,genericRedir1);

    if (a.pathname.includes('/dp/')) {
        a.pathname = '/dp' + a.pathname.match(/\/[A-Z\d]{10}(?=\/|$)/);
        a.search = '';
    }

    else if (a.pathname.includes('/gp/product')) {
        a.pathname = '/gp/product' + a.pathname.match(/\/[A-Z\d]{10}(?=\/|$)/);
        a.search = '';
    }

    else if (a.pathname.includes('/ref='))
        a.pathname = a.pathname.replace(/\/ref=[^\/]+/,'');

    cleanParams(a,amazonParams);
}

function parserEbay(a) {
    if (!ebay.test(a.host))
        return;

    if (a.pathname.includes('/itm/')) {
        a.pathname = '/itm' + a.pathname.match(/\/\d{12}/);
        a.search = '';
    }

    else if (a.pathname.startsWith('/p/') && a.search.includes('iid=')) {
        a.pathname = '/itm/' + a.search.match(/[?&]iid=(\d{12})/).pop();
        a.search = '';
    }

    else if (a.host.startsWith('pulsar.')) {
        a.pathname = '/itm/' + a.search.match(/%7B%22mecs%22%3A%22(\d{12})/).pop();
        a.host = location.host;
        a.search = '';
    }

    cleanParams(a,ebayParams);
    a.removeAttribute('data-navsrc-tracking');
    if (a.hash && a.pathname===location.pathname)
        a.href = a.hash;
}

function parserNewegg(a) {
    if (!a.host.endsWith('.newegg.com') && !a.host.endsWith('.newegg.ca'))
        return;

    if (!a.pathname.includes('/marketplace/'))
        cleanParams(a,neweggParams);
}

function parserIMDB(a) {
    if (a.host === 'www.imdb.com')
        cleanParams(a,imdbParams);
}

function parserTwitter(a) {
    if (a.host !== 't.co')
        return;

    let fake = 't.co' + a.pathname;
    let real = a.getAttribute('data-expanded-url');
    if (real) {
        a.href = real;
        a.removeAttribute('data-expanded-url');
        sessionStorage.setItem(fake, real);
        return;
    }

    if (!a.classList.contains('TwitterCard-container'))
        return;

    real = sessionStorage.getItem(fake);
    if (real)
        a.href = real;
}

function parserFacebook(a) {
    let onclick = a.getAttribute('onclick');
    if (!onclick || !onclick.startsWith('LinkshimAsyncLink'))
        return;

    if (a.host !== 'l.facebook.com')
        return;

    cleanRedir(a,genericRedir1);
    a.removeAttribute('onclick');
    a.removeAttribute('onmouseover');
}

function parserDisqus(a) {
    if (a.host === 'disq.us' && a.pathname === '/url')
        cleanRedir(a,genericRedir1);

    parserAll(a);
}

function parserStaticice(a) {
    if (a.host.endsWith('staticice.com.au')) {
        if (a.pathname.startsWith('/cgi-bin/www.'))
            a.href = 'http://'+a.pathname.slice(9);

        else if (a.pathname !== '/cgi-bin/redirect.cgi')
            return;

        cleanRedir(a,genericRedir1);
    }

    if (a.host === 'www.clixgalore.com' && a.pathname === '/PSale.aspx')
        cleanRedir(a,genericRedir2);

    if (a.host === 't.dgm-au.com' || a.host === 'www.kqzyfj.com')
        cleanRedir(a,genericRedir1);

    if (a.host === 't.cfjump.com')
        parserStaticiceTCF(a);

    cleanParams(a,utmParams);
}

function parserStaticiceTCF(a) {
    if (a.search) {
        cleanRedir(a, genericRedir1);
        return;
    }

    if (a.innerText.startsWith('$'))
        return;

    let siteText = a.parentNode;
    let itemLink = siteText.parentNode.parentNode.firstChild.firstChild;
    if (itemLink.host !== 't.cfjump.com') {
        a.href = itemLink.origin;
        return;
    }

    let origin = 'https://' + siteText.innerText.split(/ +\| +/)[1];
    let itemPath = itemLink.pathname.match(/^\/t\/\d+\/\d+(\/.+)/).pop()
    a.href = origin;
    itemLink.href = origin + itemPath;
}

/*
 * URL string functions
 */

function cleanRedir(a, param) {
    a.href = decodeURIComponent(a.search.match(param).pop());
}

function cleanParams(a, params) {
    if (a.search)
        a.search = a.search.replace('?','?&').replace(params,'').replace('&','').replace(/\?$/,'');

    if (a.hash)
        a.hash = a.hash.replace('#','#&').replace(params,'').replace('&','').replace(/#$/,'');
}
