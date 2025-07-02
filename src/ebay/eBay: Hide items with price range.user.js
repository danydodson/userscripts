// ==UserScript==
// @name         eBay: Hide items with price range
// @namespace    https://egore.url.lol/userscripts
// @version      0.4
// @description  Hide items with a price range from the eBay search results
// @icon          https://www.ebay.com/favicon.ico
// @author       Steve Chambers
// @match        https://www.ebay.com/*
// @match        https://www.ebay.co.uk/*
// ==/UserScript==

// $("h3:contains('Show only')").parent().parent().next().prepend('<div class="cbx"><a class="cbx"><input style="margin: 0 3px 0 4px;" tabindex="-1" type="checkbox" name="LH_NoPriceRanges"><span class="cbx">No price ranges</span></input></a></div>');
$("h3:contains('Show only')").parent().parent().next().prepend('<li class="x-refine__main__list"><div><h3 class="x-refine__item"><input style="margin: 0 3px 0 4px;" tabindex="-1" type="checkbox" name="LH_NoPriceRanges"><span class="cbx">No price ranges</span></input></h3></div></li>');
$("h3:contains('Show only')").parent().parent().find('ul:first').append('<li class="x-refine__main__list"><input style="margin: 6px 6px 0 1px;" tabindex="-1" type="checkbox" name="LH_NoPriceRanges"/>No price ranges</li>');

$("input[name='LH_NoPriceRanges']").change(function() {
    $("span.prRange").closest('li.sresult').toggle(!this.checked);
    $("span.DEFAULT:contains(' to ')").closest('li.s-item').toggle(!this.checked);
});

$("input[name='LH_NoPriceRanges']").prop("checked", false).change();