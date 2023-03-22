// ==UserScript==
// @name         eBay: Price Range Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide items with price range from Ebay search results!
// @author       Dampmaskin
// @match        www.ebay.com/*
// @icon            https://www.google.com/s2/favicons?domain=ebay.com
// ==/UserScript==

$('head').append('<style>.hiddenRangeItem {background-color:#eee;} .showHiddenRangeItem {cursor:pointer; background-color:#eee; border: 1px solid #ddd; margin: 1em; padding:0.25em; } .showHiddenRangeItem.showing { color:white;background-color:black; } .showHiddenRangeItem.hiding .hideIt, .showHiddenRangeItem.showing .showIt { display:none;}</style>')
function hideRangeItem($el) {
    $el.addClass('hiddenRangeItem').hide().before('<div class="showHiddenRangeItem hiding"><span class="showIt">Show</span><span class="hideIt">Hide</span> price range item</div>')
    $el.prev('.showHiddenRangeItem').click(function () {
        $(this).toggleClass('showing hiding').next('.hiddenRangeItem').slideToggle()
    })
}
function hideRangeItems($els) {
    $els.each(function () {
        if (!$(this).hasClass('hiddenRangeItem')) {
            hideRangeItem($(this))
        }
    })
}
setInterval(function () {
    hideRangeItems($('#Results .prRange').parents('.sresult'))
    hideRangeItems($('.DEFAULT:contains( to )').parents('.s-item'))
}, 1000)