// ==UserScript==
// @name          eBay: Show Option Prices
// @namespace     https://egore.url.lol/userscripts
// @description   Inserts prices for all the extra options that may be included in the eBay page.
// @icon          https://www.ebay.com/favicon.ico
// @match       http://*.ebay.tld/*sch/*
// @match       http://*.ebay.tld/*i.html?*
// @match       http://*.ebay.tld/itm/*
// @version       0.0.4
// ==/UserScript==

/* jshint esnext: true */

process();

function process() {
    var currency = '\$';
    var price = /\$([\d\,]*\.\d\d)/; // regexp to test for currency
    var tld = location.host.split('.').reverse()[0];
    switch (tld) {
        case 'uk':
            currency = '£';
            price = /£([\d\,]*.\d\d)/;
            break;
    }

    var itemPage = /^\/itm\//.test(location.pathname);

    if (itemPage) {
        var chosenVariation = document.querySelector('span#sel-msku-variation');
        
        if (chosenVariation === null) {
            return;
        }
        
        var shippingCost = document.querySelector('span#fshippingCost');
        var shippingCostConverted = document.querySelector('span#convetedPriceId');

        var shippingCostText = null;
        if (shippingCostConverted !== null) {
            shippingCostText = shippingCostConverted.textContent;
        } else if (shippingCost !== null) {
            shippingCostText = shippingCost.textContent;
        }
        var shippingPrice = -1;
        if (/Free/i.test (shippingCostText) || (/Digital delivery/.test(shippingCostText))) {
            shippingPrice = 0;
        } else if (/Not specified/.test(shippingCostText)) {
            shippingPrice = -1;
        } else if (price.test(shippingCostText)){
            shippingPrice = shippingCostText.match(price)[1].replace(',','');
        }

        var variationsPanel = chosenVariation.parentNode;

        var request = new XMLHttpRequest();
        request.open("GET", location.href);
        request.onloadend = function(){
            var rdata = request.responseText;

            var varipoint = rdata.indexOf('"itmVarModel":{');
            if (varipoint == -1){
                return;
            }
            var varidata = rdata.substring(varipoint);
            varidata = '{' + varidata.substring(0, varidata.indexOf('"unavailableVariationIds"')-1) + '}}';
            var itmVarModel = JSON.parse(varidata).itmVarModel;

            var menuModels = itmVarModel.menuModels;
            var menuItemMap = itmVarModel.menuItemMap;

            var itemVariations = Object.keys(itmVarModel.itemVariationsMap).map(k => itmVarModel.itemVariationsMap[k]);

            itemVariations = itemVariations
                .map(itemVariation => {
                var buyItNowPrice = itemVariation.convertedPrice || itemVariation.price;
                buyItNowPrice = buyItNowPrice.match(price)[1].replace(',','');
                return [buyItNowPrice, itemVariation];
            })
                .sort((a,b) => a[0] - b[0])
                .map(i => i[1]);

            var finaldata = "<table><thead><tr>";
            menuModels.forEach(menuModel => {
                finaldata += "<th>" + menuModel.displayName + "</th>";
            });
            finaldata += "<th>Price</th></tr></thead><tbody>";
            itemVariations.forEach(itemVariation => {
                finaldata += "<tr>";
                var traitValuesMap = itemVariation.traitValuesMap;
                menuModels.forEach(menuModel => {
                    finaldata += "<td>" + menuItemMap[traitValuesMap[menuModel.name]].displayName + "</td>";
                });
                var buyItNowPrice = itemVariation.convertedPrice || itemVariation.price;
                var priceCurrency = buyItNowPrice.substring(0, buyItNowPrice.indexOf(currency) + 1);
                buyItNowPrice = buyItNowPrice.substring(buyItNowPrice.indexOf(currency) + 1);
                finaldata += "<td>" + priceCurrency;
                if (shippingPrice == -1) {
                    finaldata += buyItNowPrice + " + ?";
                } else {
                    buyItNowPrice = (parseFloat(buyItNowPrice) + parseFloat(shippingPrice)).toFixed(2);
                    finaldata += buyItNowPrice;
                }
                finaldata += "</td></tr>";
            });
            finaldata += "</tbody></table>";
            
            var el = document.createElement('div');
            el.class = "vi-msku-cntr";
            el.innerHTML = finaldata;
            variationsPanel.appendChild(el);
        };

        request.send();
    } else {
        Array.prototype.forEach.call(document.querySelectorAll('li[listingid]'),rowElement => {
            var shippingPrice = -1;
            
            var lvprices = rowElement.querySelector('ul.lvprices');

            var shipping = lvprices.querySelector('span.fee') || lvprices.querySelector("span.bfsp");

            if (shipping !== null) {
                var tc = shipping.textContent;
                if (/Free/i.test (tc) || (/Digital delivery/.test(tc))) {
                    shippingPrice = 0;
                } else if (/Not specified/.test(tc)) {
                    shippingPrice = -1;
                } else if (price.test(tc)){
                    shippingPrice = tc.match(price)[1].replace(',','');
                }
            }

            var buyItNow = lvprices.querySelector('li.lvprice span.bold') || lvprices.querySelector('li.lvprice');

            if (buyItNow === null) {
                return;
            }

            if (buyItNow.textContent.indexOf(" to ") == -1) {
                // doesn't have variations
                return;
            }

            var lvdetails = rowElement.querySelector('ul.lvdetails');

            if (lvdetails === null) {
                // couldn't find element to stick table into
                return;
            }

            var request = new XMLHttpRequest();
            var productUrl = rowElement.getElementsByTagName('a')[0].href;
            request.open("GET", productUrl);
            request.onloadend = function(){
                var rdata = request.responseText;

                var varipoint = rdata.indexOf('"itmVarModel":{');
                if (varipoint == -1){
                    return;
                }
                var varidata = rdata.substring(varipoint);
                varidata = '{' + varidata.substring(0, varidata.indexOf('"unavailableVariationIds"')-1) + '}}';
                var itmVarModel = JSON.parse(varidata).itmVarModel;

                var menuModels = itmVarModel.menuModels;
                var menuItemMap = itmVarModel.menuItemMap;

                var itemVariations = Object.keys(itmVarModel.itemVariationsMap).map(k => itmVarModel.itemVariationsMap[k]);

                itemVariations = itemVariations
                    .filter(i => i.quantityAvailable >= 1)
                    .map(itemVariation => {
                    var convertedPrice = itemVariation.convertedPrice || itemVariation.price;
                    convertedPrice = convertedPrice.match(price)[1].replace(',','');
                    return [convertedPrice, itemVariation];
                })
                    .sort((a,b) => a[0] - b[0])
                    .map(i => i[1]);

                var truncated = false;
                if (itemVariations.length > 10) {
                    itemVariations.length = 10;
                    truncated = true;
                }

                var finaldata = "<table><thead><tr>";
                menuModels.forEach(menuModel => {
                    finaldata += "<th>" + menuModel.displayName + "</th>";
                });
                finaldata += "<th>Price</th></tr></thead><tbody>";
                itemVariations.forEach(itemVariation => {
                    finaldata += "<tr>";
                    var traitValuesMap = itemVariation.traitValuesMap;
                    menuModels.forEach(menuModel => {
                        finaldata += "<td>" + menuItemMap[traitValuesMap[menuModel.name]].displayName + "</td>";
                    });
                    var convertedPrice = itemVariation.convertedPrice || itemVariation.price;
                    var priceCurrency = convertedPrice.substring(0, convertedPrice.indexOf(currency) + 1);
                    convertedPrice = convertedPrice.substring(convertedPrice.indexOf(currency) + 1);
                    var buyItNowPrice = convertedPrice;
                    finaldata += "<td>" + priceCurrency;
                    if (shippingPrice == -1) {
                        finaldata += buyItNowPrice + " + ?";
                    } else {
                        buyItNowPrice = (parseFloat(buyItNowPrice) + parseFloat(shippingPrice)).toFixed(2);
                        finaldata += buyItNowPrice;
                    }
                    finaldata += "</td></tr>";
                });
                if (truncated) {
                    finaldata += '<tr><td colspan="' + (menuModels.length + 1) + '">...</td></tr>';
                }
                finaldata += "</tbody></table>";

                var el = document.createElement('li');
                el.innerHTML = finaldata;
                lvdetails.appendChild(el);
            };

            request.send();
        });
    }
}
