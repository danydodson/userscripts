// ==UserScript==
// @name         Amazon Country of Origin
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @icon         https://www.amazon.com/favicon.ico
// @description  userscript to fetch and display the country of origin for amazon products. initially developed to make boycotting the CCP more easy.
// @author       Sidem, calne_ca
// @license      GPL-3.0-only
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.be/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL  https://update.greasyfork.org/scripts/416635/Country%20of%20origin%20for%20Amazon%20products.user.js
// @updateURL    https://update.greasyfork.org/scripts/416635/Country%20of%20origin%20for%20Amazon%20products.meta.js
// @contributionURL https://cointr.ee/sidem
// ==/UserScript==

/* jshint esversion: 6 */

GM_registerMenuCommand('Tip Developer', () => {
  GM_openInTab('https://cointr.ee/sidem', {
    active: true,
    insert: true,
    setParent: true
  });
});

(function () {
  'use strict';

  let countryCodes = {
    "AF": "Afghanistan", "AL": "Albania", "DZ": "Algeria", "AS": "American Samoa", "AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarctica", "AG": "Antigua and Barbuda", "AR": "Argentina", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan", "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin", "BM": "Bermuda", "BT": "Bhutan", "BO": "Bolivia", "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BV": "Bouvet Island", "BR": "Brazil", "IO": "British Indian Ocean Territory", "BN": "Brunei Darussalam", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "CV": "Cape Verde", "KY": "Cayman Islands", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile", "CN": "China", "CX": "Christmas Island", "CC": "Cocos (Keeling) Islands", "CO": "Colombia", "KM": "Comoros", "CG": "Congo", "CD": "Congo, the Democratic Republic of the", "CK": "Cook Islands", "CR": "Costa Rica", "CI": "Cote D'Ivoire", "HR": "Croatia", "CU": "Cuba", "CY": "Cyprus", "CZ": "Czech Republic", "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador", "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia", "ET": "Ethiopia", "FK": "Falkland Islands (Malvinas)", "FO": "Faroe Islands", "FJ": "Fiji", "FI": "Finland", "FR": "France", "GF": "French Guiana", "PF": "French Polynesia", "TF": "French Southern Territories", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany", "GH": "Ghana", "GI": "Gibraltar", "GR": "Greece", "GL": "Greenland", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", "GT": "Guatemala", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti", "HM": "Heard Island and McDonald Islands", "VA": "Holy See (Vatican City State)", "HN": "Honduras", "HK": "Hong Kong", "HU": "Hungary", "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran, Islamic Republic of", "IQ": "Iraq", "IE": "Ireland", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan", "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "North Korea", "KR": "South Korea", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Lao People's Democratic Republic", "LV": "Latvia", "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MO": "Macao", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia", "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands", "MQ": "Martinique", "MR": "Mauritania", "MU": "Mauritius", "YT": "Mayotte", "MX": "Mexico", "FM": "Micronesia, Federated States of", "MD": "Moldova, Republic of", "MC": "Monaco", "MN": "Mongolia", "MS": "Montserrat", "MA": "Morocco", "MZ": "Mozambique", "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NC": "New Caledonia", "NZ": "New Zealand", "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "NU": "Niue", "NF": "Norfolk Island", "MK": "North Macedonia, Republic of", "MP": "Northern Mariana Islands", "NO": "Norway", "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestinian Territory, Occupied", "PA": "Panama", "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PT": "Portugal", "PR": "Puerto Rico", "QA": "Qatar", "RE": "Reunion", "RO": "Romania", "RU": "Russia", "RW": "Rwanda", "SH": "Saint Helena", "KN": "Saint Kitts and Nevis", "LC": "Saint Lucia", "PM": "Saint Pierre and Miquelon", "VC": "Saint Vincent and the Grenadines", "WS": "Samoa", "SM": "San Marino", "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal", "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia", "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa", "GS": "South Georgia and the South Sandwich Islands", "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname", "SJ": "Svalbard and Jan Mayen", "SZ": "Eswatini", "SE": "Sweden", "CH": "Switzerland", "SY": "Syrian Arab Republic", "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania, United Republic of", "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan", "TC": "Turks and Caicos Islands", "TV": "Tuvalu", "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "UK", "US": "USA", "UM": "United States Minor Outlying Islands", "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Vietnam", "VG": "Virgin Islands, British", "VI": "Virgin Islands, U.S.", "WF": "Wallis and Futuna", "EH": "Western Sahara", "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe", "AX": "Åland Islands", "BQ": "Bonaire, Sint Eustatius and Saba", "CW": "Curaçao", "GG": "Guernsey", "IM": "Isle of Man", "JE": "Jersey", "ME": "Montenegro", "BL": "Saint Barthélemy", "MF": "Saint Martin (French part)", "RS": "Serbia", "SX": "Sint Maarten (Dutch part)", "SS": "South Sudan", "XK": "Kosovo"
  };

  var codeToFlag = function (isoCode, countryName, sellerName) {
    console.log("C");
    if (isoCode == "" && countryName != "") {
      console.log("D");
      for (let code in countryCodes) {
        if (countryCodes[code] === countryName) {
          isoCode = code;
          console.log(code);
          console.log(isoCode);
        }
      }
    }
    if (sellerName.includes("Amazon") && isoCode == "") {
      return "<img class='countryOfOriginFlag' id='amazonOriginalProduct' src='https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIIcon-beacon_light_1x-2767b239bb9543c0a4af44c843ab017f27080532._V2_.png' style='object-fit: none; object-position: -2px -71px; width: 55px; height: 28px;' alt='" + sellerName + "' title='" + sellerName + "'>";
    } else if (isoCode != "") {
      return "<img class='countryOfOriginFlag' src='https://flagcdn.com/w40/" + isoCode.toLowerCase() + ".png' alt='" + countryName + ", " + sellerName + "' title='" + countryName + ", " + sellerName + "'>";
    } else {
      return "";
    }

  };
  var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc;
  };

  // Function to fetch and extract the country name
  function getCountryOfOrigin() {
    // Get the element with the ID 'detailBullets_feature_div'
    const detailDiv = document.getElementById('detailBullets_feature_div');

    // Check if the element exists
    if (detailDiv) {
      // Query all list items inside the detailDiv
      const listItems = detailDiv.querySelectorAll('li');

      // Iterate through each list item to find the correct one
      for (let item of listItems) {
        // Find the bold text inside the list item
        const boldText = item.querySelector('.a-text-bold');

        // Check if the bold text matches 'Country of Origin'
        if (boldText && boldText.textContent.includes('Country of Origin')) {
          // Get the text content of the second span (country name)
          const countryName = boldText.nextElementSibling.textContent.trim();

          // Save the country name
          console.log('Country of Origin:', countryName);
          return countryName;
        }
      }
    }
    // If the element or country name is not found
    console.log('Country of Origin not found');
    return null;
  }

  function runCountryFetch() {
    document.getElementById("productTitle").innerHTML = "<img src='https://images-eu.ssl-images-amazon.com/images/G/03/javascripts/lib/popover/images/snake._CB485935607_.gif' width='25' height='25'> " + document.getElementById("productTitle").innerText;

    let thirdPartySeller = document.getElementById('sellerProfileTriggerId');
    if (thirdPartySeller == null) {
      let siteLinks = document.getElementsByClassName("a-link-normal");
      for (let link of siteLinks) {
        if (link.href.includes("=dp_merchant_link")) {
          thirdPartySeller = link;
        }
      }
    }

    if (thirdPartySeller != null) {
      let sellerPage = thirdPartySeller.href;

      // First check if seller info is stored in localStorage
      let sellerDataArray = JSON.parse(localStorage.getItem("SellerCountryOfOrigin")) || [];
      let sellerData = sellerDataArray.find(data => data.sellerPage === sellerPage);

      let currentDate = new Date();
      if (sellerData) {
        // Calculate the difference between the current date and the stored date
        let lastUpdated = new Date(sellerData.date);
        let diffTime = Math.abs(currentDate - lastUpdated);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If the difference is less than 90 days, use the stored data
        if (diffDays < 90) {
          document.getElementById("productTitle").innerHTML = codeToFlag(sellerData.originCountryCode, sellerData.originCountry, sellerData.sellerName) + " " + document.getElementById("productTitle").innerText;
          return;
        }
      }

      // Seller info not found in localStorage or is outdated, fetch it
      fetch(sellerPage)
        .then(function (response) {
          switch (response.status) {
            case 200:
              return response.text();
            case 404:
              throw response;
          }
        })
        .then(function (template) {
          let sellerPageDOM = stringToHTML(template);
          let sellerName = sellerPageDOM.getElementById("sellerName-rd");
          let newSellerPage = true;
          if (sellerName != null) {
            sellerName = sellerName.innerText;
          } else {
            sellerName = sellerPageDOM.getElementById("sellerName");
            sellerName = (sellerName != null) ? sellerName.innerText : sellerPageDOM.getElementById('seller-name').innerText;
            newSellerPage = false;
          }
          let sellerInfo = [];
          let items = [];
          newSellerPage = (sellerPageDOM.getElementById('seller-name') != null);
          if (newSellerPage) {
            sellerInfo = sellerPageDOM.getElementById('page-section-detail-seller-info');
            items = sellerInfo.getElementsByClassName("indent-left");
          } else {
            items = sellerPageDOM.getElementsByClassName("a-list-item");
          }


          let originCountry = "";
          let originCountryCode = "";
          for (let i of items) {
            if (countryCodes.hasOwnProperty(i.innerText)) {
              originCountryCode = i.innerText;
              originCountry = countryCodes[i.innerText];
            }
          }

          // Save seller info in localStorage with the current date
          let sellerObj = {
            sellerPage: sellerPage,
            sellerName: sellerName,
            originCountry: originCountry,
            originCountryCode: originCountryCode,
            date: currentDate.toJSON()
          };
          sellerDataArray = sellerDataArray.filter(data => data.sellerPage !== sellerPage);
          sellerDataArray.push(sellerObj);
          localStorage.setItem("SellerCountryOfOrigin", JSON.stringify(sellerDataArray));

          document.getElementById("productTitle").innerHTML = codeToFlag(originCountryCode, originCountry, sellerName) + " " + document.getElementById("productTitle").innerText;
        })
        .catch(function (response) {
          console.log(response);
        });
    } else {
      let country = getCountryOfOrigin();
      if (country != null) {
        console.log("A");
        document.getElementById("productTitle").innerHTML = codeToFlag("", country, "Amazon") + " " + document.getElementById("productTitle").innerText;
      } else {
        document.getElementById("productTitle").innerHTML = codeToFlag("", "", "Amazon") + " " + document.getElementById("productTitle").innerText;
        console.log("B");
      }
    }
  }
  let priceBox = document.getElementById('apex_desktop');
  if (priceBox == null) priceBox = document.getElementById('corePriceDisplay_desktop_feature_div');
  if (priceBox == null) priceBox = document.getElementById('corePrice_desktop');
  if (priceBox == null) priceBox = document.getElementsByClassName('a-price')[0];
  if (priceBox == null) priceBox = document.getElementsByClassName('priceSizeOverride')[0];
  const observer = new MutationObserver(function (mutation) {
    if (!mutation[0].target.id.includes('deal_expiry_timer')) {
      runCountryFetch();
    }
  });
  observer.observe(priceBox, { subtree: true, childList: true });
  runCountryFetch();

})();