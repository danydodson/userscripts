// ==UserScript==
// @name         eBay: Trending Price
// @namespace   https://egore.url.lol/userscripts
// @version      0.1
// @description  Get the trending price of an eBay item. Search for your item on eBay and filter by "Sold Items". Click the "GET TRENDING PRICE" button below the eBay logo.
// @author       Jin You
// @match        https://www.ebay.com/*
// @icon          https://www.ebay.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// ==/UserScript==

const logTrendingPrice = () => {
    let getSum = (numbers) => numbers.reduce((x,y) => parseFloat(x) + parseFloat(y), 0)
    let getAverage = (numbers) => getSum(numbers) / numbers.length
    let filterOutliers = (numbers) => {
       let average = getAverage(numbers)
       let min = average * .5
       let max = average * 1.75
       return numbers.filter(num => (num > min) && (num < max))
    }

    let rawPrices = [...document.getElementsByClassName("s-item__price")].map(x => x.innerText.match(/\d+.\d+/)[0])
    let prices = filterOutliers(rawPrices)
    let average = getAverage(prices)
    let max = Math.max(...prices)
    let min = Math.min(...prices)

    alert(`
       Average price: ${average.toFixed(2)}
       Max price: ${max}
       Min price: ${min}
    `)
}

(function() {
    'use strict';

    //--- Create a button
    var btn = document.createElement ('div');
    btn.innerHTML = '<a id="myButton" type="button" class="rainbow-button" alt="Get Trending Price"></a>'
    btn.setAttribute ('id', 'myContainer');
    let header = document.getElementsByClassName('x-header')[0]
    header.append(btn)

    //--- Activate the button.
    document.getElementById ("myButton").addEventListener (
        "click", logTrendingPrice, false
    );

    //--- Style the button
    GM_addStyle ( `
    .rainbow-button {
        text-decoration: none !important ;
        color: #fff;
        font-family:Helvetica,Sans-serif;
        width:calc(12vw + 6px);
        height:calc(2vw + 6px);
        background-image: linear-gradient(90deg, #00C0FF 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);
        border-radius:5px;
        display:flex;
        align-items:center;
        justify-content:center;
        text-transform:uppercase;
        font-size:1vw;
        font-weight:bold;
    }
    .rainbow-button:after {
        content:attr(alt);
        width:12vw;
        height:2vw;
        background-color:#191919;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .rainbow-button:hover {
        color: #fff;
        animation:slidebg 2s linear infinite;
    }
    @keyframes slidebg {
        to {
            background-position:20vw;
        }
    }
   ` );
})();