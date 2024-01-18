// ==UserScript==
// @name         Crypto: DYORassistant
// @namespace    https://apopheniapays.com/
// @version      ALPHA-2020.10.03s2
// @description  Adds some research tools and visual niceties to popular DeFi utilities and sites. Does not interfere with existing functionality, just adds cosmetics for user convenience.
// @author       @ApopheniaPays
// @updateURL    https://github.com/ApopheniaPays/DYORassistant/raw/master/DYORassistant.user.js
// @downloadURL  https://github.com/ApopheniaPays/DYORassistant/raw/master/DYORassistant.user.js
// @match        *://etherscan.io/*
// @match        *://www.dextools.io/app/*
// @match        *://app.astrotools.io/*
// @match        *://dapp.trendering.com/*
// @match        *://unitradebeta.com/*
// @match        *://polygonscan.com/*
// @match        *://chartex.pro/*
// @match        *://twitter.com/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      github.com
// @connect      githubusercontent.com
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAD7ElEQVQ4EY2TXUyTVxiAC5hlm3E/LmxZzK7MbsyWLO73wsvdLLvaxZYsLrucf3NTyRZ1uhD3YxB/yaYzm04HToEJgmBhCFQopbICpUBpqRaKqJSClA/o9533KzzLV8NsdS47ycn7c855zvue9z02W9oAlvgGVEe5XzjjM7TqUFJzRtEu9opWFFba0duiufpEuxQUrSYkWu010cq6hbaImnBjvJiGuqcC2X0+1dV8RagLClHAFJ3RyCjWqAY+0hVlMaEvKDjCQt2QEBpRmHqCiNJnGg1j5T2izWYDHuvvUb6GNqHRLSgdgv6/+P3kzxw7dJjiE8cIuNtoAj6eUZyOCR1BoaZPGIoZMG9way7Btbk5o1mpl1Jw4Mlgl/K1tpo42hWzAl6Pi00b12Gvs+Pt8fLjT8fI37yZ2TvTHALWInw7I5T7BO+owkBnbG6GyVmNWGJOH1DqZZs3pH6r9prU9Cs6R1JZc/BgAfZLdlwuF3a7nUgkwv7C/ZSeOkkcOOVTnA4LYzM6iWmdyrjB+bjBhbhBraZTcUcFbP6bsvpcQObPhhWDSbju7+ebPXtSkTY1NdHQ0EAoFGLv3r0Ul5xI3dzZqPC3CPNjBvWGYv2kydYpky/iJmunTI5H1e7Uc/SG1QdnugUr4EB3D+++/Q67du/C7XbT299LWXk5G9d/wnD4OiMxaPYofO1CZVD4TBfyNeG7aWHLtHB0QoozCljnTeQNKLhce4miwiMMhfxs3/o5G9ZtYueOnfT5PMSmodYhODpMupyKopiwLSHkx4U8Cx6TjgzoomFC5YU/Kig9fSaVsn94jJuRGyndTMLIOCTn79ZhQmCbJmyJC1/NJfl63IiFZ2efW2RlSCC/5NcSupxtGMAMMBWNsq+ggAsV5xExuVhdzoGCfG6FB1O97l9Y4I4ujKnkhxmwdMMCOx1OCr/fRzgYIDwYxGpzay7JWULuM8uxZd21c7JsBDyd+FucVBWftdL4NJ2VoVvgpvomqiqqeOP1V/+BWuCcnGxyn11OVnZ2hn/Z40uJRFJ9+lYGLN2wwKUlpQxfH16IjscW1qx5k2VLs1jx/BP8cvyH1OMeOVDA6pUv8EiOjdWvvYLD0WL5D6dzHtAtcGVZJV6P9zbwfjKJczSmMT2rp6CTWkoQVYqRSc1kfr7X+ogPgO53LEbc7my3aveotd4zSW37OLS4Ta42GpQMmuSBmoRV959/qG2BzxWfw9XqSgIrrI1DQ1NPlfZJsHFAGGwXCm+YnJ1KvPdQyL8tLII9Vz1WxLmLe0K31aorHcKfPUJtXG1f9P9vCWxwXG6m39c/DjydfnAwoL5sjKj6dN9/6X8D6mKWJnFSJqUAAAAASUVORK5CYII=
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require      https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js
// @require      https://piyolab.github.io/sushiether/web3.js/libs/web3.js_v1.0.0-beta.33/web3.min.js
// @resource     FONTAWESOME  https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css
// @license      MIT
// ==/UserScript==

// Follow t.me/ApopheniaProjects for announcements.
// A block of user-configurable options are further down in the script, if you want to tinker.

/*
# DYORassistant (formerly "DEXTassistant")

An independently developed userscript bringing new UI features and embedded research tools to popular DEX- &
DeFi-related websites, to give you an edge and help avoid scams. Follow
[http://t.me/ApopheniaProjects](http://t.me/ApopheniaProjects) on Telegram for announcements.

# BACKGROUND

## I. Origins

The website  [http://DEXTools.io](http://DEXTools.io) started out as the most popular info explorer
for Uniswap. However, I found that as I explored the information it gave me, I had to do far too
much clicking around to other websites to do my own research on the coins listed. I wanted a quicker
way to gather information and determine which coins might be worth investing in, and more importantly,
which look like scams and should be avoided. So I took all the research I was doing by hand, and coded
an add-on tool that set on top of DEXTools but gave quicker access to all that information, and in
some cases, embedded it right in the page without having to leave DEXTools. Once it was written, it
struck me that this was a good way to lend a hand to beginning traders and newbies, and I decided to
make it available on Github for that purpose.

Since then, script development has begun to shift focus away from DEXTools to other popular sites.
Which I believe are more in keeping with my original intent of helping the beginning traders who need
this most and may not necessarily be in profit yet... traders very much like I was, literally only weeks
ago.

## II. From DextAssistant to DYORassistant: Change of focus and rebranding

As of 1 September 2020, going forward, this script has been rebranded from "DextAssistant" to
"DYORassistant" ("Do Your Own Reasearch" Assistant) to reflect a broader emphasis on helping fledgling
DEX traders research new tokens, rather than just focusing exclusively on enhancing DEXTools. For the
next month, I will be shifting focus to helping new traders by providing information and enhancements
on sites that do not charge the subscription fees that DEXTools will be instituting by the end of September.

The transition will be gradual. But I hope to shift focus before too long completely away from DEXTools, to
whatever tools show the most promising combination of usefulness, accessibility, and value to beginning or
intermediate traders in the months to come. DEXTools is an amazing service run by a great team, and likely
to only get better as it develops; however, I cannot justify volunteering time and development skills for
free to support what now looks like an exclusive service aimed at catering to traders who are already
succesfully enough to be able to afford to pay quite a lot of money for the tools they need. I think it's
terrific that DEXTools is offering an awesome toolset to those traders, I just don't see any reason to
support that myself.

At the same time, I plan on concurrently transitioning away from using DEXTools in my own trading. But I'll
make an effort to support the existing DEXTools-related features, and even continue to add new ones that were
already in the planning stages, for as long as possible.

UPDATE, September 20 2020: Following major under-the-hood changes to DEXTools's UI that are too difficult
to be worth dealing with, some of the script functionality no longer works on that site. The above notes will
be updated shortly. The next major revision of this script will bring full functionality to other sites.

# DISCLAIMER

## TO BE READ IN A STERN, GRUFF VOICE:

Despite my efforts to give it an easy-to-understand GUI, this is an advanced tool for technically
advanced traders.

If you are trading on Uniswap or other DEXs, you need to have a certain level of general knowledge in
order to avoid the high risks, and I'm not going to enable anyone to jump in and lose money. If there's
anything in this you don't understand, then you probably shouldn't be trading on Uniswap yet, so this
tool is not for you.

What's more, as this is under active development, you may find bugs, though I try hard to avoid that.

## Support? Support is for _closers_.

As I'm sharing this for free, I won't give you any support or any guarantees, and if you choose to use
it I don't owe you anything for any reason. It's presented as-is, use it only at your own risk. What
you see is what you get. If you have questions you'll have to do your own research and figure out the
answers yourself. I'm grouchy, don't bother me.

## The murky depths from whence this came

This is an independent project that bubbled up out of a single developer's needs. It's not affiliated
with DEXTools.io or its development team in any way, please *never bother them with questions about it*.

## In not so many words:

Essentially, YOU'RE ON YOUR OWN with this.

Do you think Indiana Jones needed someone holding his hand? No, never. When you're fighting for your
life in a remote jungle or far-flung desert outpost, there's no support, no instruction manual, no second
chances... just your own ingenuity, will to live, and the rich rewards that will come if you can figure
out on your own how to succeed.

As of right now, _that is your life._

(Metaphorically speaking.)

Enjoy!

# INSTRUCTIONS

## Installation

This script *requires a browser plugin that allows you to install and manage user scripts, such as
Greasemonkey, Tampermonkey, or Violentmonkey.* I chose to go with a userscript instead of a browser plugin
because it would allow the code to remain 100% open source and cross-platform.

(Here's where you need to bring a little knowledge to the table. If you're unfamiliar with userscripts or
Tampermonkey, Greasemonkey, Violentmonkey, etc, you should educate yourself from a page like
[https://simply-how.com/enhance-and-fine-tune-any-web-page-the-complete-user-scripts-guide](https://simply-how.com/enhance-and-fine-tune-any-web-page-the-complete-user-scripts-guide)
before you try to use this. BTW I use Tampermonkey [https://www.tampermonkey.net/](https://www.tampermonkey.net/)
myself, on Firefox, Brave, and Chrome, so I know for sure that this script works with that. But you'll
need to decide for yourself which userscript manager is right for you. Consult your doctor.)

*BONUS!* For users that already have a userscript manager extension installed in their browser, you can
install DextAssistant simply by clicking this link: [https://github.com/ApopheniaPays/dextassistant/raw/master/dextAssistant.user.js](https://github.com/ApopheniaPays/dextassistant/raw/master/dextAssistant.user.js).

This script is also hosted at [https://openuserjs.org/scripts/ApopheniaPays/DextAssistant](https://openuserjs.org/scripts/ApopheniaPays/DextAssistant)
for one-click install if you prefer to get a minified version. Supposedly that will stay current as I update
it here, but I haven't checked.

## Features

Global enhancements (currently works on DEXTools.io, Astrotools.io, Trendering.com, Etherscan.io, and Unitradebeta.com):

1.) In any table that has a header row, columns are now sortable.

2.) Ethereum addresses in table columns (indicated by links to Etherscan.io address pages) can be filtered to show only
the rows for that address.

3.) Any links to Etherscan.io now also have a button added to look that address up on Zerion. Ethereum addresses
are color coded to make repeated transactions from the same address more noticeable in tables.

### NOTE: as of 2020 sep 20, not all features listed below may work on DEXTools.io anymore, due to radical
under-the-hood changes to how DEXTools displays information. Most basic functionality has been restored, but not
all. This is the last version of this script that any features are guaranteed to work on DEXTools.

DEXTools.io enhancements:

1.) The most prominent addition is a new icon under the Pool Explorer's Actions column, which opens a
"research assistant" popup that will allow you to view data from other websites pertaining to the token Name,
Contract Address, and Uniswap.info Pair Address for the token on that row. Next to the Contract addresses you
will see a little circled arrow that will show you Google search results for those contract addresses, embedded
right in the popup, when you hover your mouse over it.

2.) For tokens with a particularly low DEXT score or which are auto-generated by a lazy website token-generator
script, the distinguished monocle and handlebar mustache on the "research assistant" gear button are replaced
with a "poop" emoji.

3.) Rows in the the Pool Explorer are color-coded to indicate liquidity adds, removes, and new pools. 100%
liquidity removals are now labeled as "rugpull" instead of just "remove", to make sure you know to feel
extra-bitter.

6.) DEXTools "Dark mode" is now supported, because I was too lazy to attempt any real work tonight.

7.) Rather than rely on the various browser plugins' hinky auto-update mechanism, the script adds an unobtrusive
"update available" link to the footer of the screen after a new version has been pushed to this repo, for
convenient one-click upgrading. (Some extremely nerdy people will notice the script phones home to github on page
load. This update check is why.)

As this script makes cosmetic changes only, there's no harm you can do by poking around. Explore it.

## Usage Tips

Ok, if you need to be told how to use this, you probably aren't ready to be doing this kind of trading. But here's my
basic routine for checking out a token and deciding if it's real or a scam: Check an see any the existing search results
for the contract address, check if liquidity is locked, look at the pair explorer and see if there is website/telegram/
discord referenced and look at those to get an impression. Takes no time at all.

Oh, yeah, and, be extra skeptical if the liquidity pool is less than 1000 ETH. I've seen real coins with pools as small as
20 ETH, but I've never (yet) seen a scam with a pool over 1000 ETH.

# KNOWN ISSUES

1.) Right now the list filtering and sorting only acts on existing rows. As new transactions or pools appear, they
come in at the top, exactly as if the list wasn't filtered or sorted. I'll get around to it. Hey, it's an open
source script, you don't like it, fix it yourself.

# FUTURE PLANS
In keeping with this tool's mission of helping beginning and small traders get a leg up, in an upcoming version this userscript
may begin asking for read-only permission to connect to your wallet (exactly as all dApps currently do.) If you hold enough wealth to
qualify for the premium-level subscriptions to some popular websites, such as holding 20k DEXT for DEXTools 2nd-tier subscription
or holding enough TRND to qualify for Trendering's exclusive 300-member telegram, you may be prevented from further use of this
script. If you wish to avoid these restrictions you may wish not to upgrade the script.
*/

/* ******** USER-CONFIGURABLE OPTIONS *************/
// * Feel free to change any of the values after the equals signs in this block. Don't remove the semicolon from the end of the lines.
// * If you don't understand what they do, then you probably don't need to worry about them.
// *

var ShowAssistantOnHover = true;
//Show the Research Assistant popover immediately on hover, without needing to click the icon.

var ethplorerkey="freekey";
//NOT YET IN USE. When activatory, if you run into hourly limits on some of the EthPlorer info (not yet included) because you have looked at more than 50 tokens in an hour, you can sign up for an API key at https://ethplorer.io/wallet/#register, get an API key from https://ethplorer.io/wallet/#screen=api, and replace "freekey" with it to raise your limits.

var scamWallets= {scammer:{wallet:"0x408f2ff726aae56ea7382b8676d8db43d624df7c",
                           reason:"yfking.link scammer",
                           url:"https://www.dextools.io/app/uniswap/pair-explorer/0x9ad1c11fd75c4c29e414bbc5c8cce83765c19911"}};
//NOT YET IN USE. Would like to eventually track wallets that I've verified are involved in scams

// *
/****** END USER-CONFIGURABLE OPTIONS ***********/

/************** DEV TO-DOs *********************/
// Live coingecko prices
// show how many people in pool
// show POL score
// incorporate https://thegraph.com/explorer/subgraph/graphprotocol/uniswap
// incorporate https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API
// color-code eth addresses so can see wash trades more easily
// option to always open Pair Explorer in new tab
// "star" favorite tokens so get alerts when something happens
// make column filtering and sort order persist for new rows
// alerts for adds with over a certain amount of liquidity
// view maker contract addresses on Zerion
// show % increase in pool over initial
// Maybe gray out any row with no pool left. This requires keeping the ontimer() live, so, think about it.
// maybe provision to enter your own wellet addresses and hilight them to find your own transactions easily
// maybe switch to using mutationobservers per https://stackoverflow.com/questions/32233895/using-waitForKeyElementsWrapper-is-it-possible-to-prevent-the-key-element-from-being-d
// show when liquidity has grown by a certain amount from initial add
// make mouse pointer into finger over all clickabl elements
// expand functions to work on other frequently used sites, like etherscan, Zerion
// total columns in pair explorer
// add an identifier as TD values are evaluated and screen for it so don't keep selecting same TD's over and over again
// alert if new pool doubles in size.
// user option to open Zerion in private window

/**/
/**/
/**/
/**/
/**/
/**/

/******************************************************************************/
/****** TOUCH NOTHING BELOW THIS LINE. IF YOU BREAK IT, YOU BOUGHT IT. ********/
/******************************************************************************/

/**/
/**/
/**/
/**/
/**/
/**/

var currentVersion="ALPHA-2020.10.03s2";
var thisHistory= encodeURIComponent(`

VERSION HISTORY
===============

2020.10.03s2 - I promised that the earlier update tonight contained bugs, and I delivered! This fixes
them. Also began adding DYORassistant niceties to Etherscan.io

2020.10.03s - "Stealth update". Major improvements to integration with Astrotools, most features
previously developed for DEXTools now work with Astrotools, although there still may be bugs.
Ethplorer integration begun. Internal conversion to store all page specifications in a hash rather
than hardcoded, so can much more easily adapt & extend functionality on new sites, which is totally fun.

2020.09.25 - Beginnings of integration with Chartex. Add buy/sell row coloring to transaction
lists on Chartex.

2020.09.20 - Fixes to restore some usability to Dextools after major UI overhaul that stopped
using table tags. Remove filtering on Dextools, as it is no longer possible. Squash some minor
bugs that were polluting the consol. THIS IS THE LAST VERSION THAT WILL OFFICIALLY SUPPORT
DEXTOOLS.IO. Some functionality will work but it will no longer be considered officially supported.

2020.09.15c - Minor upgrade, fix incorrect text and broken icon or Astrotools linkage

2020.09.15b - security upgrade only. Remove wildcard @match in favor of whitelisting specific
websites.

2020.09.15 - INSECURE VERSION, DO NOT USE - Change background row coloring to use transparency
and lighten hex address coloring so also works with stupid "dark themes". Another minor change
to logo icon for maximal visual prettiness. Resize Zerion icon and table sort arrows for extra
layoutical betterness. Under-the-hood changes in preparation for pseudopluginization & increased
ease of incorporating new sites.

2020.09.14t - INSECURE VERSION, DO NOT USE - Fix regression errors introduced in 2020.09.13t
causing research assistant popover to be added multiple times on DEXTools Pool Explorer page.
Introduce object property arrays to store page codes and page-specific values. Store page codes
in attribute in body tag so can be used in selectors to create page-specific selectors in the
global scope. Prevent filtering and Zerion from appearing on Etherscan links Pool Explorer page
because DEXTools has their own filtering and Zerion is in the research assistant popover.

2020.09.13t - INSECURE VERSION, DO NOT USE - transitional version while I work on code
refactoring for greater portability. Remove page restrictions so table features appear on all
sites where there are ethereum addresses. Finally fix button for Reasearch Assistant popover
not appearing on pair page. Get Zerion links, address coloring, and table sorting working on
all sites instead of just DEXTools. Add footer popovers for credits and version history. Color
rows that contain cells labeled "buy" or "sell". Add classes and functions to remove additions
if element that triggered their creation is gone. Spiffy new icon.

2020.09.02 - add popover Research Assistant menu to Pair Explorer page, fixes to contact info
indication, preparation for moving repository and begin rebrand to DYORa, titles to DYORa and
version links, show version history when click on version link, begin prepping to show new
version history before upgrade, rename functions to avoid potential conflicts [old version]

2020.08.28 - add visual higlight and prominent indication when there's contact info on pair page,
add hover effects and pointer cursor for all clickable elements, color code pair explorer page
totals red/green for sell/buy

020.08.27 - make compatible with DEXTools dark theme, because that's more important than
working on real features. Add icon. Add functionality to display "updateavailalable" link. Update
Pair Explorer filter icon to match default Pool Explorer one.

2020.08.25 - Alpha development. Color pool rows for added liquidity or new pools, popover menu
of extra research tools, token icons from Trustwallet repo, mark 100% removes as "rugpull",
integrate custom crypto search engine results into Research Assistant popover, integrate live
CryptoCompare pricing info, soooooperfast table sorting, color-coding and filtering hex addresses
`);


this.$ = this.jQuery = jQuery.noConflict(true);
//required for compatilibilty in case they start using jQuery on Dextools
try{
    (function() {'use strict';

                 //Hey ho, let's go
                 var logErrors=false;
                 var thisPage="all";
                 var pageCodes = {pair:
                                  {url:"www.dextools.io/app/uniswap/pair-explorer",
                                   features:["noListFilter"],
                                   onlySortColumns:"",
                                   addDisclaimerAnchor:"span.copyright.ml-auto.my-auto.mr-2",
                                   researchAsstAnchor:"body[ap_dajs_pagetype=pair] h3.page-title + small",
                                   researchAsstPlacement:function(jNode) {return jNode;},
                                   theAbbreviation:function(jNode){return jNode.prev().find("strong").text().split(" ")[4];},
                                   theContract:function(jNode){var thisHREF=jNode.prev().children("a:first-of-type").attr('href');return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   thePair:function(jNode) {var thisHREF=document.location.href;return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   customWaitElements:
                                   { ".circle":addLogo}

                                  },
                                  pool:
                                  {url:"www.dextools.io/app/uniswap/pool-explorer",
                                   features:["noListFilter","noZerion"],
                                   onlySortColumns:"",
                                   addDisclaimerAnchor:"span.copyright.ml-auto.my-auto.mr-2",
                                   researchAsstAnchor:"body[ap_dajs_pagetype=pool] datatable-body-cell:nth-child(3)  a > i.fa-wpexplorer.pools-icon-warning:not(i.gAdded)",
                                   researchAsstPlacement: function(jNode) {return jNode.parent().parent();},
                                   theAbbreviation:function(jNode){return jNode.closest("TD,datatable-body-cell").siblings().first().children(0).children(0).text();},
                                   theContract:function(jNode){ var thisHREF=jNode.closest("TD,datatable-body-cell").siblings().first().children(0).children(0).attr('href');return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   thePair:function(jNode) {var thisHREF=jNode.closest("TD,datatable-body-cell").next().children(0).children(0).attr('href');return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   customWaitElements:
                                   { ".circle":addLogo,
                                    "body[ap_dajs_pagetype=pool] datatable-body-cell:nth-child(4) a.badge-danger":makeRed,
                                    "body[ap_dajs_pagetype=pool] datatable-body-cell:nth-child(4) a.badge-success":makeGreen,
                                    "body[ap_dajs_pagetype=pool] datatable-body-cell:nth-child(4) i.fa-info-circle.pools-icon-warning":poolWarning,
                                    "body[ap_dajs_pagetype=pool] datatable-body-cell:nth-child(9) a.badge.badge-danger":rugPull}

                                  },
                                  astropair:
                                  {url:"app.astrotools.io/pair-explorer",
                                   features:["noZerion","noListFilter"],
                                   onlySortColumns:"TH:nth-child(7)",
                                   addDisclaimerAnchor:"li.ant-pagination-prev", /* "div.ant-layout-sider-children", */

                                   researchAsstAnchor:"div.symbol div.icons-list",
                                   researchAsstPlacement: function(jNode) {return jNode;},
                                   theAbbreviation:function(jNode){var thisHREF= $("#chart-header section.chart-options a:first-child").attr("href");  return thisHREF.substring(thisHREF.lastIndexOf(":")+1);},
                                   theContract:function(jNode){var thisHREF= jNode.children("a:first-child").attr('href'); return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   thePair:function(jNode) {var thisHREF=document.location.href; return thisHREF.substring(thisHREF.lastIndexOf("/")+1);},
                                   customWaitElements:
                                   { ".circle":addLogo}


                                  },
                                  etherscan:
                                  {url:"etherscan.io",
                                  addDisclaimerAnchor:"footer > div.container > div:last-child",
                                   customWaitElements: {
                                   "td a[href*='0x']:not(.AP_DAJS_ethPrepared):not(.AP_DAJS_element):not(:has(i.fas.fa-chart-line)), a[href*='0x'][id^='spanTarget']:not(.AP_DAJS_ethPrepared):not(.AP_DAJS_element)": prepareEtherscanLink /*any link in a TD or id starting with "spanTarget" with an address will get parsed on etherscan*/



                                  }
                                  }

                                 };





                 var newVersionAvail="";
                 var newVersionHistory="";
                 var newVersionURL = "https://github.com/ApopheniaPays/DYORassistant/raw/master/DYORassistant.user.js";
                 GM.xmlHttpRequest({
                     method: "GET",
                     url:newVersionURL,
                     onload: function(scrptTxt) {
                         var versionMtch = scrptTxt.response.match(/\/\/\s+@version\s+(.+)/i);
                         newVersionHistory = encodeURIComponent(scrptTxt.response.match(/var thisHistory= encodeURIComponent\(\`([\s\S]+?)\`/i)[1]);
                         if (versionMtch  &&  versionMtch.length > 1) {
                             newVersionAvail = encodeURIComponent(versionMtch[1]);
                             if(newVersionAvail!=currentVersion) {waitForKeyElementsWrapper('span#newVersion',addNewVersion);}
                         };
                     }
                 });


                 function addNewVersion (jNode) {
                     jNode.html('<a title="update DYORassistant" href="'+newVersionURL+'" class="AP_DAJS_element">v '+newVersionAvail.replace(/ALPHA-/gi,'')+' available</a>');
                     //yeah, it's hinky. This runs asynchronously so there's two different places this can happen: here, or synchronously down below.
                 }

                 var IDcounter=1

                 // Hash any string into an integer value
                 // Then we'll use the int and convert to hex.
                 function hashCode(str) {
                     var hash = 0;
                     for (var i = 0; i < str.length; i++) {
                         hash = str.charCodeAt(i) + ((hash << 5) - hash);
                     }
                     return hash;
                 }

                 // Convert an int to hexadecimal with a max length
                 // of six characters.
                 function intToARGB(i) {
                     var hex = (((i>>24)&0xCC)+0x33).toString(16) +
                         (((i>>16)&0x9E)+0x33).toString(16) +
                         (((i>>8)&0x9E)+0x33).toString(16) +
                         ((i&0x9E)+0x33).toString(16);
                     // Sometimes the string returned will be too short so we
                     // add zeros to pad it out, which later get removed if
                     // the length is greater than six.
                     hex += '000000';
                     var theReturn = hex.substring(0, 6).replace("b","3").replace("c","5").replace("d","7").replace("e","9").replace("f","a"); //make a little darker

                     //   theReturn = (((theReturn & 0x7E7E7E) >> 1) | (col & 0x808080)) ;//darken it
                     return theReturn;
                 }

                 // Extend the string type to allow converting to hex for quick access.
                 String.prototype.toHexColour = function() {
                     return intToARGB(hashCode(this));
                 }

                 window.thisHistory=thisHistory;



                 function quoteFunction(funcCall){
                     //from https://coursesweb.net/javascript/replace-javascript-variable-name-from-string-with-value_cs
                     var str=funcCall.toString();

                     // JavaScript & jQuery Courses - https://coursesweb.net/javascript/
                     str = str.replace(/\$\{(.*?)\}/gi, function(a,b) {
                         // if token is an array item, else, is object property, or variable
                         if(b.match(/[a-z0-9_]+\[[a-z0-9_]+\]/i)) {
                             var arritm = b.match(/([a-z0-9_]+)\[([a-z0-9_]+)\]/i);      // gets an array with the matched items
                             return window[arritm[1]][arritm[2]];
                         }
                         else {
                             var voitm = b.split('.');
                             return (voitm.length == 2) ? window[voitm[0]][voitm[1]] : window[voitm[0]];
                         }
                     });

                     return str;
                 }


                 function addJS_Node (text, s_URL, funcToRun) {
                     var D                                   = document;
                     var scriptNode                          = D.createElement ('script');
                     scriptNode.type                         = "text/javascript";
                     if (text)       scriptNode.textContent  = text;
                     if (s_URL)      scriptNode.src          = s_URL;
                     if (funcToRun)  scriptNode.textContent  = quoteFunction(funcToRun);

                     var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
                     targ.appendChild (scriptNode);
                 }




                 /********************** Functions to include in pages **********************/
                 function AP_DAJS_displayHistory(){
                     win=window.open("", 'DYORa Version History', 'width=700, height=700, right=24, top=24, scrollbars, resizable');
                     win.document.write('<html><body><pre>'+decodeURIComponent(`${thisHistory}`)+'</pre></body></html>');return false;

                 }
                 addJS_Node(null, null, AP_DAJS_displayHistory);

                 function AP_DAJS_upgradeVersion(){
                     win=window.open("", 'DYORa Version Upgrade', 'width=700, height=700, right=24, top=24, scrollbars, resizable');
                     win.document.write('<html><body>Installed version: '+decodeURIComponent(`${currentVersion}`)+'<br>Available version: '+decodeURIComponent(`${newVersionAvail}`)+'< a href="'+decodeURIComponent(`${newVersionAvail}`)+'">click to install upgrade</a> (<a href="'+decodeURIComponent(`${newVersionAvail}.replace(/\/raw\//i,'/blob/')`)+'">source</a>)<br><small>After upgrading, please close this window and refresh the browser page you came from.</small><p><pre>'+decodeURIComponent(`${thisHistory}`)+'</pre></body></html>');return false;

                 }

                 addJS_Node(null, null, AP_DAJS_upgradeVersion);


                 function AP_DAJS_sortTable(n,tableId) {
                     var table = document.getElementById(tableId);
                     document.getElementById("AP_DAJS_th"+tableId+n).classList.toggle(".sorting");
                     window.setTimeout(AP_DAJS_sortTableMain(n,tableId), 100);
                     return;}

                 addJS_Node(null, null, AP_DAJS_sortTable);



                 function AP_DAJS_sortTableMain(n,tableId) {
                     var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
                     table = document.getElementById(tableId);
                     try { document.getElementById("AP_DAJS_th"+tableId+table.getAttribute("lastSortedBy")).textContent="⇅";
                          document.getElementById("AP_DAJS_th"+tableId+table.getAttribute("lastSortedBy")).classList.toggle("text-info");
                         } catch(e) {};
                     try {  table.setAttribute("lastSortedBy",n); } catch (e) {errorLog("line 471 failure ",e);}


                     switching = true;
                     // Set the sorting direction to ascending:
                     dir = "asc";
                     /* Make a loop that will continue until no switching has been done: */
                     while (switching) {
                         // Start by saying: no switching is done:
                         switching = false;
                         rows = table.rows;
                         /* Loop through all table rows (except the
    first, which contains table headers): */
                         for (i = 1; i < (rows.length - 1); i++) {
                             // Start by saying there should be no switching:
                             shouldSwitch = false;
                             /* Get the two elements you want to compare,
      one from current row and one from the next: */
                             x = rows[i].getElementsByTagName("TD")[n];
                             y = rows[i + 1].getElementsByTagName("TD")[n];
                             /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
                             xValue=isNaN(x.getAttribute('AP_DAJS_valueCalc'))?x.getAttribute('AP_DAJS_valueCalc') :(+x.getAttribute('AP_DAJS_valueCalc') );
                             yValue=isNaN(y.getAttribute('AP_DAJS_valueCalc'))?y.getAttribute('AP_DAJS_valueCalc') :(+y.getAttribute('AP_DAJS_valueCalc') );
                             if (dir == "asc") {
                                 if (xValue < yValue) {
                                     // If so, mark as a switch and break the loop:
                                     shouldSwitch = true;
                                     break;
                                 }
                             } else if (dir == "desc") {
                                 if (xValue > yValue) {
                                     // If so, mark as a switch and break the loop:
                                     shouldSwitch = true;
                                     break;
                                 }
                             }
                         }
                         if (shouldSwitch) {
                             /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
                             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                             switching = true;
                             // Each time a switch is done, increase this count by 1:
                             switchcount ++;
                         } else {
                             /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
                             if (switchcount == 0 && dir == "asc") {
                                 dir = "desc";
                                 switching = true;
                             }
                         }
                     }
                     document.getElementById("AP_DAJS_th"+tableId+n).textContent=(dir=="desc"?"↓":"↑");
                     document.getElementById("AP_DAJS_th"+tableId+n).classList.toggle("text-info");
                     document.getElementById("AP_DAJS_th"+tableId+n).classList.toggle(".sorting");
                 }

                 addJS_Node(null, null, AP_DAJS_sortTableMain);

                 function AP_DAJS_previewToggle (thisCounter,url,section){
                     if(document.getElementById('AP_DAJS_previewResults'+thisCounter).style.display=='block'
                        && document.getElementById('AP_DAJS_results'+thisCounter).src==decodeURIComponent(url))
                     {document.getElementById('AP_DAJS_previewResults'+thisCounter).style.display='none';
                      document.getElementById('AP_DAJS_floaterlink'+section+thisCounter).innerHTML='&gt;🔎'}
                     else
                     {document.getElementById('AP_DAJS_results'+thisCounter).src=decodeURIComponent(url);
                      document.getElementById('AP_DAJS_previewResults'+thisCounter).style.display='block';
                      document.getElementById('AP_DAJS_floaterlink'+section+thisCounter).innerHTML='&lt;🔍'}
                 }
                 addJS_Node(null, null, AP_DAJS_previewToggle);

                 function AP_DAJS_filterFunction(filterOn,tableId,theColor) {
                     var filterAddr=filterOn;//filterOn.parentNode.getAttribute("ap_dajs_valuecalc");
                     var thisIndex = Array.from(filterOn.parentNode.parentNode.children).indexOf(filterOn.parentNode);
                     if (typeof window.filterState === 'undefined') {window.filterState="";}
                     var filter= (window.filterState=="")?filterAddr:"";
                     window.filterState=filter;
                     var  table, tr, td, i, txtValue;
                     table = document.getElementById(tableId);


                     tr = table.getElementsByTagName("tr");
                     var hTD = table.getElementsByTagName("th")[thisIndex];

                     for (i = 0; i < tr.length; i++) {
                         td = tr[i].getElementsByTagName("td")[thisIndex];
                         if (td) {
                             txtValue = td.getAttribute("ap_dajs_valuecalc"); //td.textContent || td.innerText;
                             if (txtValue.indexOf(filter) > -1 || filter=="" ) {
                                 tr[i].style.display = "";
                             } else {
                                 tr[i].style.display = "none";
                             }
                         }
                     }
                     if (filter == "") {hTD.innerHTML = hTD.getAttribute("oldText");} else {
                         try {hTD.setAttribute("oldText",hTD.innerHTML);} catch (e) {errorLog("line 569 failure ",e);}
                         hTD.innerHTML = 'Maker <span style="color:#'+theColor+' !important" class="AP_DAJS_element">'+filter+' only</span>';}
                 }
                 addJS_Node(null, null, AP_DAJS_filterFunction);
                 /********************** end Functions to include in pages **********************/



                 function timeStringToSeconds (timeString) {

                     var hms = timeString.replace(/ *[hmdHMD] */g,":").replace(/ *[s] *$/g,"");   // your input string
                     var a = hms.split(':'); // split it at the colons
                     // minutes are worth 60 seconds. Hours are worth 60 minutes.
                     var seconds = (typeof a[3] !== "undefined")?(+a[0]) * 60 * 60 * 60 + (+a[1]) * 60 + (+a[2])*60+(+a[3]):(typeof a[2] !== "undefined")?(+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]):
                     (typeof a[1] !== "undefined")?(+a[0]) * 60+ (+a[1]):(+a[0]);


                     return(seconds);
                 }


                 /* general */
                 waitForKeyElementsWrapper ("body[ap_dajs_pagetype]",pageSpecificElements);
                 waitForKeyElementsWrapper ( "thead>tr>th, ngx-datatable", prepareTable);
                 waitForKeyElementsWrapper ("td,datatable-body-cell", setTDvalue);
                 errorLog(JSON.parse(JSON.stringify(thisPageOptions())));

                 waitForKeyElementsWrapper ( "a[href*='/address/0x']:not(.AP_DAJS_ethPrepared):not(.AP_DAJS_element)", prepareEtherscanLink);
                 waitForKeyElementsWrapper ( ".AP_DAJS_dependentElement:not(.AP_DAJS_dependency+.AP_DAJS_dependentElement)",removeDependency)
                 waitForKeyElementsWrapper ( "#AP_DAJS_popupframe[src='']", togglePreview);
                 errorLog("RAA");
                 errorLog(thisPageOptions());

                 function pageSpecificElements() {
                 waitForKeyElementsWrapper ( thisPageOptions().researchAsstAnchor, addGoog);
                 waitForKeyElementsWrapper ( thisPageOptions().addDisclaimerAnchor, addDisclaimer);
                 }
                 /* DT pool */

                 /* end DT pool */
                 function waitForKeyElementsWrapper(theSelector,theFunc) {
                     try {
                         if(typeof theSelector != "undefined") {
                             //  errorLog("Starting WFKE "+theSelector+theFunc.name);
                             waitForKeyElements (theSelector,theFunc);
                             errorLog("ENDINg WFKE "+theSelector+' '+theFunc.name);
                         } } catch(e) {errorLog(e);}
                 }

                 function removeDependency(jNode) {
                     jNode.remove();
                 }

                 function prepareEtherscanLink(jNode) {
jNode.addClass("AP_DAJS_ethPrepared");

                     var thisNode = jNode;
                     try { var thisHREF = thisNode.attr('href'); } catch (e) {errorLog("href not found"); return false}
                     //really stupid, but somehow waitForKeyElementsWrapper is sometimes passing empty nodes
                     /*    errorLog (JSON.parse(JSON.stringify(jNode)));
                 errorLog (typeof jNode.attr('href'));
                 errorLog("a");
                 errorLog ( jNode.attr('href'));
                 errorLog("b");
                 errorLog (thisHREF);
                 errorLog("c");
                 errorLog(/0\x[0-9a-f]+/i.exec(thisHREF));
                 errorLog("d");
                 errorLog(/0\x[0-9a-f]+/i.exec(thisHREF)[0]);
                 errorLog("e"); */
                     var theHex= /0\x[0-9a-f]+(?!.*0\x[0-9a-f]+)/i.exec(thisHREF)[0]; /* get last match with ?! negative lookahead */
                     /*                 errorLog("f");
                 errorLog(theHex); */
                     //   try {
                     var theTest=theHex.length;
                     thisNode.attr('style','color: #'+theHex.toHexColour()+' !important');
                     try {
                         if( thisNode.closest("TD,datatable-body-cell").length && !pageHasFeature("noListFilter")) {
                             var thisIndex=thisNode.closest("TD,datatable-body-cell").index();
                             var theTable=thisNode.closest("table,ngx-datatable").attr('id');
                             var theDupeCount=$("#"+theTable+" a[href='"+thisHREF+"']").length;
                             if (theDupeCount>1 )
                                 /* we're not going to do this on DEXtools pair page anymore, the dynamically generated data table rows are bogus. */
                             {
                                 thisNode.parent().prepend('<i title="filter on this address" class="AP_DAJS_element AP_DAJS_clickable filterbutton fa fa-filter pools-icon-warning" onclick="AP_DAJS_filterFunction('+thisNode.closest("table,ngx-datatable").attr("ap_dajs_valuecalc")+',\''+thisNode.closest("table,ngx-datatable").attr("id")+'\',\''+theHex.toHexColour()+'\')"><sup style="font-size:.5em;">'+theDupeCount+'</sup></i>'); }
                         }} catch (e) {console.log("ERROR - theHex",theHex);console.log(e);}
                     //style="background:#'+theHex.toHexColour()+' !important"
                     //  jNode.closest("td").next().attr('style','background: #'+theHex.toHexColsorttour()+' !important');

                     jNode.after(zerionLink (theHex));
                     jNode.addClass('AP_DAJS_dependency');
                     //   } catch(e) {errorLog("605 error fail",e);}

                 }


                 function zerionLink (theHex) {
                     var output="";
                     if (!pageHasFeature("noZerion")){
                         output=output+ ('<a title="Zerion address overview" onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_dependentElement AP_DAJS_dependency AP_DAJS_popupItem AP_DAJS_popupWin"'
                                 +' href="https://app.zerion.io/'+theHex+'/overview">'
                                 +' <div class="AP_DAJS_element backImgSmol zeriImg hide"></div></a>');
                     }
   if (!pageHasFeature("noEthplorer")){
                         output=output+ ('<a title="Ethplorer address overview" onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_dependentElement AP_DAJS_popupItem AP_DAJS_popupWin"'
                                 +' href="https://ethplorer.io/address/'+theHex+'">'
                                 +' <div class="AP_DAJS_element backImgSmol ethpImg hide"></div></a>');
                     }
                     return output;

                 }

                 function setTDvalue(jNode) {
                     var rightNow = (new Date().getTime()/1000 );

                     var thisTD=jNode.clone();
                     thisTD.find(".AP_DAJS_element").remove();

                     jNode.attr("AP_DAJS_valueCalc",
                                ( thisTD.text()!="" && thisTD.text().replace(/[ 0-9hdmsHDMS]*/g,"")=="" )?
                                timeStringToSeconds(thisTD.text()):
                                (isNaN(thisTD.text().replace(/[$,]/g,"")))?thisTD.text().toLowerCase().replace(/ /g,""):parseFloat(thisTD.text().replace(/[$,]/g,""))
                               ); /*convert relative times to epoch time so don't have to worry about cell relative value updating, as it does. */



                     /* now some special general formatting */
                     if (jNode.attr("AP_DAJS_valueCalc")=="sell") {makeRed(jNode);}
                     if (jNode.attr("AP_DAJS_valueCalc")=="buy") {makeGreen(jNode);}

                     return true;
                     /* jNode.on('DOMSubtreeModified', setTDvalue(jNode)); NOPE! Infinit loop */
                 }

                 function prepareTable (jNode) {
                     if (!jNode.closest("table,ngx-datatable").attr("id"))
                     {  jNode.closest("table,ngx-datatable").attr("id",Math.floor(Math.random() * Math.floor(Math.random() * Date.now())));}

                     if ((typeof thisPageOptions().onlySortColumns=="undefined" && jNode.prop("tagName")=="TH") || jNode.is(thisPageOptions().onlySortColumns) ) {
                         jNode.addClass("AP_DAJS_clickable");
                         jNode.attr("onclick","AP_DAJS_sortTable("+jNode.index()+","+jNode.closest("table,ngx-datatable").attr("id")+")");
                         jNode.append('<span class="AP_DAJS_element DAsorter" id="AP_DAJS_th'+jNode.closest("table,ngx-datatable").attr("id")+jNode.index()+'">⇅</span>');

                     }}


                 /* Watch for window URL change: */
                 history.pushState = ( function (f) {return function pushState(){
                     var ret = f.apply(this, arguments);
                     window.dispatchEvent(new Event('pushstate'));
                     window.dispatchEvent(new Event('locationchange'));
                     return ret;
                 }})(history.pushState);

                 history.replaceState = ( function (f) { return function replaceState(){
                     var ret = f.apply(this, arguments);
                     window.dispatchEvent(new Event('replacestate'));
                     window.dispatchEvent(new Event('locationchange'));
                     return ret;
                 }})(history.replaceState);

                 window.addEventListener('popstate',function(){ return function(){
                     window.dispatchEvent(new Event('locationchange'))
                 }});


                 window.addEventListener('locationchange', function(){
                     initPage();
                 })


                 /* End Watch for window URL change. from https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript/52809105#52809105 */


                 window.addEventListener('popstate', function (event) {
                     // back and forward buttons, etc.
                     initPage();
                 });



                 function pageHasFeature (featureCode) {
                     try {

                         var pageFeatures = pageCodes[thisPage].features.includes(featureCode);
                         return pageFeatures;}
                     catch(e) {return false;}
                 }

                 function errorLog(thisText) {
                     if(logErrors) {console.log(thisText);}

                 }

                 function thisPageOptions() {
                     errorLog("thisPage");
                     errorLog(thisPage);
                     try{
                         return pageCodes[thisPage] || {};

                     } catch(e){errorLog("Body not ready");return {};}

                 }


                 function setupPageType() {
                     for (const prop in pageCodes) {
                         errorLog("prop");
                         errorLog(prop);
errorLog("URL "+document.location.href);
                         errorLog("PROP URL "+pageCodes[prop].url);
                         if(document.location.href.match('//'+pageCodes[prop].url)) {
                             thisPage=prop;errorLog("+++");}

                     }
                     errorLog("THIS PAGE");
                     errorLog(thisPage);
                     try{  document.body.setAttribute("AP_DAJS_pageType",thisPage);
                        } catch(e) {
                            errorLog("No body");

                        }
                      pageSpecificElements();
                 }


                 function initPage(){
                     errorLog("PAGECODES");
                     errorLog(JSON.parse(JSON.stringify(pageCodes)));

                     setupPageType();
                     errorLog("hey");
                     errorLog(thisPageOptions());
                     try{
                         if(typeof thisPageOptions().customWaitElements != "undefined") {
                             errorLog("xxx");

                             errorLog(thisPageOptions().customWaitElements);
                             errorLog("yyy");
                             for (const [key, value] of Object.entries(thisPageOptions().customWaitElements)) {
                                 errorLog( `${key}`);
                                 errorLog(value);
                                 waitForKeyElementsWrapper ( `${key}`, value);
                             }
                         }    } catch (e) {console.log("e is now ",e);}

                     errorLog("2");
                     if(thisPage=="pool"){
                         /************************ pool page functions ************************/
                         $(document).ready(function(){
                             $(document.head).append(`
<script id="AP_DAJS_poolScripts">
    async function AP_DAJS_getCCPrice(symbol,identifier) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://min-api.cryptocompare.com/data/price?fsym="+symbol+"&tsyms=USD,ETH", true);
    xhr.onload = function () {
        var ret=JSON.parse(xhr.responseText);
        var result=ret.Message?(ret.Message.replace("There is no data for the symbol ","No data on ").replace("There is no data for any of the toSymbols",symbol+" not listed in")):"USD$"+(ret.USD||"unknown")+" ETHΞ"+(ret.ETH||"unknown");document.getElementById("priceSpan"+identifier).innerText=result;
    };
    xhr.send();

}


</script>
`);
                         });



                         /************************ end pool page functions ************************/
                     }
                     else
                     {
                         /************************ pair page functions ************************/
                         $(document).ready(function(){
                             $(document.head).append(
                                 `
<script id="AP_DAJS_pairScripts">
var filterState="";


</script>
`);
                         });
                         // waitForKeyElementsWrapper ( "body[ap_dajs_pagetype=pair] h3.page-title>a",hiliteExtraInfo); //nth-child(2) didn't work because 2nd child isn't 'a'!

                         /************************ end pair page functions ************************/
                     }


                 }
                 /********** end initPage ********/


                 function hiliteExtraInfo(jNode) { //visually highlight when there's extra contact info for a token
                     var thisParent=jNode.parent();
                     if (thisParent.children("a").length>1 && !(jNode.siblings("div#contactInfoFound").length)) {
                         thisParent.append(" <div id='contactInfoFound' class='badge badge-success'>&lt;- <small>has contact info</small><!-- &#x1F60A;--></div>");
                     } //let's only post it once.
                     //jNode.children("a").addClass("badge").addClass("badge-success").html(jNode.children("a").html().append("Contact info found!"));



                 }



                 function togglePreview (jNode) {$("#AP_DAJS_preview").toggle();}

                 function addLogo (jNode)
                 {jNode.addClass("gearImg").css({"background-repeat":"no-repeat","background-position":"center"})};

                 function rugPull(jNode) { if (jNode.text()=="-100%") { //var rugHTML='<span class="AP_DAJS_element text-warning badge-danger">RUGPULL</span> ';
                     jNode.addClass("badge-dark");
                     jNode.closest("td,datatable-body-cell").prevAll().eq(4).children(":first").children(":first").addClass("badge-dark");
                     jNode.closest("td,datatable-body-cell").prevAll().eq(4).children(":first").children(":first").text("RUGPULL");
                 } }

                 function addLink(jNode) { var creditHTML='<div style="float:right;font-size:1.25em;" class="AP_DAJS_element"><div class="AP_DAJS_element sirImg backImg"></div> <a href="#" class="AP_DAJS_element">DYORassistant Installed</a></div>';
                                          jNode.parent().prepend(creditHTML);
                                         }
                 function addDisclaimer(jNode) { var creditHTML='<div style="margin:auto 0 auto auto;" class="AP_DAJS_element text-muted bottomdiv">'
                 +'<a id="creditlink" data-toggle="popover" '
                 +'data-boundary="body" data-container="body" data-placement="top" type="button" data-html="true" href=""'
                 +'class="AP_DAJS_element">DYORassistant</a><div class="AP_DAJS_element sirImg backImg easterEgg" '
                 +'onclick="javascript:this.classList.toggle(\'anim\');"></div> <a id="historylink" '
                 +'data-toggle="body" data-container="body" data-boundary="body" data-placement="top"'
                 +'type="button" data-html="true" class="AP_DAJS_element" href="javascript:AP_DAJS_displayHistory()">'
                 +currentVersion+'</a> installed <span id="newVersion" class="AP_DAJS_element"></span>'
                 +'</div><!-- div id="creditPopover" class="popover"></div SEEMS LIKE WE DONT NEED THIS -->';
                                                jNode.before(creditHTML);
                                                $("div.navbar-toggler").on('click', 'div.navbar-toggler', function (e) {

                                                });

                                                /******** show credits ******/
                                                var showCreditsFunction=function() { var _this = this;
                                                                                    $("a#creditlink,a#upgradelink,a#historylink").not(this).popover('hide');
                                                                                    $(this).popover("show");//$('#frame'+thisCounter).src='https://apopheniapays.com/cryptosearch/results.html?q=%22'+theContract+'%22+OR+%22'+thePair+'%22';
                                                                                    $(".popover")
                                                                                        .on("mouseleave", function() {
                                                                                        $(_this).popover('hide');
                                                                                    });
                                                                                   }
                                                $("a#creditlink").popover({ trigger: "manual",
                                                                           html: true,
                                                                           animation: false,
                                                                            fallbackPlacement : ['right'],
                                                                           sanitize:false,
                                                                           content: function() { return '<span style="font-size:1em">Coded with the white-hot<br>intensity of a thousand<br>suns by <a href="https://twitter.com/ApopheniaPays" target="_blank">@ApopheniaPays</a>.<hr> &gt; <a href="https://github.com/ApopheniaPays/dyorassistant" target="_blank">Github repo</a><hr> &gt; <a href="mailto:DYORfeedback@apopheniapays.com">email</a><hr> &gt; <a href="https://t.me/apopheniaprojects" target="_blank">Telegram Announcements</a></span>';} /* prevent duplicate elements */
                                                                          })
                                                    .on("mouseenter",ShowAssistantOnHover?showCreditsFunction:"" )
                                                    .on("click",showCreditsFunction ).on("mouseleave", function() {
                                                    var _this = this;
                                                    setTimeout(function() { if (!$(".popover:hover").length) { $(_this).popover("hide");
                                                                                                             }
                                                                          }, 150);
                                                });
                                                /******** end credits *******/
                                                /******** begin historylink *******/
                                                $("a#historylink").popover({ trigger: "manual",
                                                                            html: true,
                                                                            animation: false,
                                                                             fallbackPlacement : ['right'],
                                                                            sanitize:false,
                                                                            content: function() { return "<div style='width:300px !important;height:400px;overflow-y:auto;font-size=1.5em !important;'>"+decodeURIComponent(thisHistory).replace(/\n\n/g,"[BREAKHERE]").replace(/\n/g," ").replace(/  /g," ").replace(/\[BREAKHERE\]/g,"<p>")+"</div>";} /* prevent duplicate elements */
                                                                           })
                                                    .on("mouseenter",ShowAssistantOnHover?showCreditsFunction:"" )
                                                    .on("click",showCreditsFunction ).on("mouseleave", function() {
                                                    var _this = this;
                                                    setTimeout(function() { if (!$(".popover:hover").length) { $(_this).popover("hide");
                                                                                                             }
                                                                          }, 150);
                                                }) ;
                                                /******** end historylink *******/
                                               }
                 function makeRed(jNode){ var theTR=jNode.closest("TR,datatable-body-row");
                                         theTR.addClass("redBkgd");
                                         theTR.children("TD,datatable-body-cell").addClass("redBkgd");
                                         theTR.children("TD,datatable-body-cell").removeClass("greenBkgd");
                                         theTR.removeClass("greenBkgd");
                                        }

                 function makeGreen(jNode){ var theTR=jNode.closest("TR,datatable-body-row");
                                           theTR.addClass("greenBkgd");
                                           theTR.children("TD,datatable-body-cell").addClass("greenBkgd");
                                           theTR.children("TD,datatable-body-cell").removeClass("redBkgd");
                                           theTR.removeClass("redBkgd");
                                          }


                 function addGoog(jNode){
                     errorLog("ABC");
                     errorLog(jNode);
                     if (!jNode.hasClass("gAdded")) { /* console.log(jNode); */
                         var googThisPage = (document.location.href.match('www.dextools.io/app/uniswap/pair-explorer'))?"pair":"pool";
                         //console.log("gAdded?", jNode.hasClass("gAdded"));
                         //console.log(googThisPage+" node ",jNode);
                         var theAbbreviation=thisPageOptions().theAbbreviation(jNode);
                         var theContract=thisPageOptions().theContract(jNode);
                         var thePair=thisPageOptions().thePair(jNode);
                         errorLog("HERE WE GO "+ theAbbreviation+" "+theContract+" "+thePair);
                         // console.log("contract 1",theContract);
                         var theIcon='';
                         try {
                             theIcon='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/'+Web3.utils.toChecksumAddress(theContract)+'/logo.png';} catch(e) {theContract="";}

                         /* console.log("ABC", jNode.html()); */
                         // console.log("contract 2",theContract);



                         var thisCounter = IDcounter.toString();
                         //let's create the row coin icon while we're here
                         //try{
                         jNode.closest("td,datatable-body-cell").siblings("td:first-child,datatable-body-cell:first-child").children(0).prepend('<img id="AP_DAJS_theCoinRow'+thisCounter+'" class="AP_DAJS_element smallImg hide" src="'+theIcon+'" onerror="document.getElementById(\'AP_DAJS_theCoinRow'+thisCounter+'\').classList.add(\'pHide\')"> ');
                         var poolFirstCell=jNode.closest("body[ap_dajs_pagetype=pool] datatable-body-cell").siblings("datatable-body-cell:first-child").children(0);
                         // poolFirstCell.attr("style","width: 80px; max-width: 130px; height: 35px;");
                         jNode.closest("td,datatable-body-cell").attr("style","width: 160px; max-width: 160px; height: 35px;");
                         //} catch(e) {}

                         var theTD = jNode.closest("TD")||{};
                         var theNextTD = theTD.next()||{};
                         function displayPreviewOpener(thisCounter,url,section){
                             var theResult = '<div style="float:right" id="AP_DAJS_floater'+section+thisCounter+'" class="AP_DAJS_element">'
                             +' <a class="AP_DAJS_element floaterlink" id="AP_DAJS_floaterlink'+section+thisCounter+'" onmouseenter="AP_DAJS_previewToggle(\''+thisCounter+'\',\''+encodeURIComponent(url)+'\',\''+section+'\')">'
                             +'&gt;&#x1F50E;</a></div>';
                             return theResult;
                         }

                         var thePreviewResults= '<div id="AP_DAJS_previewResults'+thisCounter+'" style="padding: 12px 0 0 12px;margin:0; float: right; top:0;background: white; width: 285px !important; height: 275px !important; display: block;word-break:break-word;word-wrap:break-word;" class="AP_DAJS_element"><span class="AP_DAJS_element"><b>Quick search for contract addresses:</b></span><br><iframe style="background:white;border-style:none;position:relative;top:0px;width:285px !important;height:95% !important;" id="AP_DAJS_results'+thisCounter+'" class="AP_DAJS_element"></iframe><br><span class="font-weight-normal">(Warning:<wbr> excessive<wbr> posts<wbr> only<wbr> on<wbr> social<wbr> media<wbr> sites<wbr> like<wbr> /biz/<wbr> or<wbr> Reddit <wbr>could<wbr> be <wbr>a coordinated <wbr>Pump & Dump. <wbr>Official <wbr>and <wbr>non-anonymous <wbr>sources <wbr>are <wbr>best.)</span></div>';


                         var theHTML=
                             //~popover button
                             '<div class="AP_DAJS_element '+(theNextTD.children("i.text-success,i.text-info,i.text-warning,i.text-muted,i.text-secondary")[0]?'sirImg':'sirImg') //was 'sirImg':'gearImg'
                         +' text-'+(theNextTD.children("i.text-info")[0]?'info':theNextTD.children("i.text-warning")[0]?'warning':
                                    theNextTD.children("i.text-danger")[0]?'danger':theNextTD.children("i.text-success")[0]?'success':'muted')
                         +' backImg" id="popButton'+thisCounter+'" data-toggle="popover"'
                         + ' data-container="body" data-boundary="viewport" data-placement="top" type="button" data-html="true">'
                         + (theNextTD.children("i.text-success,i.text-info,i.text-warning,i.text-muted")[0]?'':theNextTD.children("i.text-danger,i.fa-warning.text-danger")[0]?'<span class="AP_DAJS_element">&#x1f4a9;</span>':theNextTD.children("i")[0]?'N':'')
                         + '</div>'


                         + '<div id="popover-content'+thisCounter+'" class="AP_DAJS_element pHide"></div>'
                         var contractFloatOpener=displayPreviewOpener(thisCounter,"https://apopheniapays.com/cryptosearch/resultsOnly.html?q=%22"+theContract+"%22+OR+%22"+thePair+"%22",'contract');
                         var chartexFloatOpener=displayPreviewOpener(thisCounter,"https://chartex.pro/?symbol=UNISWAP:"+theAbbreviation,'chartex');
                         var thisHTML= '<table class="AP_DAJS_element"><tr style="vertical-align:top"><td><div class="AP_DAJS_element centered AP_DAJS_popupItem">'

                         //~initialize side popup
                         + '<script id="AP_DAJS_hidePreviewResults">'
                         +'document.getElementById("AP_DAJS_previewResults'+thisCounter+'").style.display="none";'
                         +'</script>'

                         //~popover headers
                         + '<img id="AP_DAJS_theCoin'+thisCounter+'" class="AP_DAJS_element smallImg hide" src="'+theIcon+'" onerror="document.getElementById(\'AP_DAJS_theCoin'+thisCounter+'\').classList.add(\'coinImg\');document.getElementById(\'AP_DAJS_warning'+thisCounter+'\').classList.remove(\'pHide\')"><span contentediable="true"  class="AP_DAJS_element abbrev" id="abbrev'+thisCounter+'">'+theAbbreviation+'</span> <div id="AP_DAJS_warning'+thisCounter+'" class="AP_DAJS_element badge badge-danger pHide">no icon!</div>'
                         + '<br />'
                         + contractFloatOpener

                         //~Uniswap etherscan addr
                         + '<a class="AP_DAJS_element AP_DAJS_popupWin"  href="https://etherscan.io/token/'+theContract+'"><div class="AP_DAJS_element smallImg addrImg hide"></div></a><span contentediable="true" class="AP_DAJS_element contract text-muted">'+ theContract.substring(0,11)+'...'+theContract.substring(theContract.length-11,theContract.length)
                         + '</span>'

                         //~Uniswap pool addr
                         + '<br />'
                         + '<a  class="AP_DAJS_element AP_DAJS_popupWin" href="https://uniswap.info/pair/'+thePair+'"><div class="AP_DAJS_element smallImg unisImg hide"></div></a><span contentediable="true" class="AP_DAJS_element contract text-muted">'+ thePair.substring(0,11)+'...'+thePair.substring(thePair.length-11,thePair.length)
                         + '</span>'
                         + '</div>'

                         //CryptoCompare Price
                         + '<hr class="AP_DAJS_element"><span class="AP_DAJS_element">Cryptocompare price:</span> <span id="priceSpanUSD'+thisCounter+'" class="AP_DAJS_element"></span> <span onclick="javascript:alert(\'CryptoCompare\\\'s free API is not reliable and returns incorrect data. Sorry, I\\\'ll reenable this when I can find a reliable free data source. Love, your developer\')" class="AP_DAJS_element"><u>disabled</u></span>'
                         + '<!-- script>AP_DAJS_getCCPrice("'+theAbbreviation+'","USD'+thisCounter+'");AP_DAJS_getCCPrice("'+theAbbreviation+'","ETH'+thisCounter+'")</script -->'
                         + '<hr class="AP_DAJS_element">'

                         //~Google Custom Seach Enging - crypto web search, include crypto news & social media, exclude block explorers
                         + '<div class="AP_DAJS_element backImg googImg hide"></div>'
                         + '<a onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin makeBold"'
                         + ' href="https://apopheniapays.com/cryptosearch/results.html?q=%22'+theContract+'%22+OR+%22'+thePair+'%22&orig='+theAbbreviation+'&icon='+encodeURIComponent(theIcon)+'">'
                         +' Ox Addresses</a> | <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://apopheniapays.com/cryptosearch/results.html?q=%22$'+theAbbreviation+'%22&orig=Token%20addr%20'+theContract+'%20and%20Uniswap%20liquidity%20pool%20address'+thePair+'&icon='+encodeURIComponent(theIcon)+'">&quot;$'+theAbbreviation+'&quot;</a> <br> Crypto Filtered Web Search'
                         +'<hr class="AP_DAJS_element"> '

                         //~whole web search
                         + '<div class="AP_DAJS_element backImg googImg hide"></div> <a '
                         +'  onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin makeBold"'
                         +' href="https://www.google.com/search?q=%22'+theContract+'%22+OR+%22'+thePair+'%22">'
                         +' Ox Addresses</a> | <a '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://www.google.com/search?q=%22$'+theAbbreviation+'%22">&quot;$'+theAbbreviation+'&quot;</a> <br> Whole Web Search'
                         +'<hr class="AP_DAJS_element"> '

                         //~zerion
                         +'<a '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://app.zerion.io/explore/asset/'+theAbbreviation+'-'+theContract+'">'
                         +' <div class="AP_DAJS_element backImg zeriImg hide"></div>Token/Portfolio Analytics</a> <br>Zerion'
                         +'<hr class="AP_DAJS_element">'

                         //~Uniswap
                         +'<div class="AP_DAJS_element backImg unisImg hide"></div> <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://uniswap.info/token/'+theContract+'">Token Analytics</a> | '
                         +' <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://uniswap.info/pair/'+thePair+'">Pool Stats</a> <br>Uniswap'
                         +'<hr class="AP_DAJS_element">'

                        //~Ethplorer
                         +'<div class="AP_DAJS_element backImg ethpImg hide"></div> <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://ethplorer.io/address/'+theContract+'">Token</a> | '
                         +' <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://ethplorer.io/address/'+thePair+'">Pair</a> <br>Ethplorer.io'
                         +'<hr class="AP_DAJS_element">'

                         //~astrotools.io
                         +'<div class="AP_DAJS_element backImg astrImg hide"></div> '
                         +' <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://app.astrotools.io/pair-explorer/'+thePair+'">Trading/Analytics</a> <br>Astrotools'
                         +'<hr class="AP_DAJS_element">'

                         //~Mooniswap
                         +'<div class="AP_DAJS_element backImg moonImg hide"></div> <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://mooniswap.info/token/'+theContract+'">Token Analytics</a> | '
                         +' <a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://mooniswap.exchange/#/swap?inputCurrency='+theContract+'">Live trading</a> <br>1inch Mooniswap'
                         +'<hr class="AP_DAJS_element">'

                         //~unicrypt
                         +'<a  '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://unicrypt.network/uniswap-browser/pair/'+thePair+'">'
                         +' <div class="AP_DAJS_element backImg crypImg hide"></div>Verify liquidity lock</a> <br>Unicrypt'
                         +'<hr class="AP_DAJS_element"> '

                         //~cerberus.saren
                         +'<a '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://cerberus.saren.io/coins/'+theContract+'">'
                         +' <div class="AP_DAJS_element backImg cerbImg hide"></div> Token analytics</a> <br> cerberus.saren'
                         +'<hr class="AP_DAJS_element"> '

                         //~Chartex
                         /*  + chartexFloatOpener No, don't the popover is really too small for Chartex */
                         +'<a '
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://chartex.pro/?symbol=UNISWAP:'+theAbbreviation+'">'
                         +' <div class="AP_DAJS_element backImg chexImg hide"></div> Candlestick chart</a> <br> ChartEX'
                         +'<hr class="AP_DAJS_element">'

                         //~Uniswap.vision
                         +'<a'
                         +'   onclick="window.open(this.href, \'windowName\', \'width=1000, height=700, right=24, top=24, scrollbars, resizable\'); return false;" class="AP_DAJS_element AP_DAJS_popupItem AP_DAJS_popupWin"'
                         +' href="https://uniswap.vision/?ticker=UniswapV2:'+theAbbreviation+'ETH">'
                         +' <div class="AP_DAJS_element backImg visiImg hide"></div> Candlestick chart</a> <br> uniswap.vision'
                         +'</td><td>'+thePreviewResults
                         +'</td></tr></table>' //end links



                         +''; // just leave this at bottom so I don't have to keep moving semicolon as I add things

                         //                 var theHTML = '<Div href="#" data-toggle="popover" title="Popover Header" data-html="true" data-content="'+theInnerHTML.replace(/"/g,'\\"')+'" class="AP_DAJS_element">Toggle popover</div>';
                         //gotta use a DIV anot an IMG, because IMG with SRC="" or missing SRC attribute causes visual glitches, unwanted borders, etc
                         thisPageOptions().researchAsstPlacement(jNode).append( theHTML);jNode.addClass("gAdded");
                         var showFunction=function() { var _this = this;
                                                      $("div.sirImg").not(this).popover('hide');
                                                      $(this).popover("show");//$('#frame'+thisCounter).src='https://apopheniapays.com/cryptosearch/results.html?q=%22'+theContract+'%22+OR+%22'+thePair+'%22';
                                                      $(".popover")
                                                          .on("mouseleave", function() {
                                                          $(_this).popover('hide');
                                                      });
                                                     }
                         $("div#popButton"+thisCounter).popover({ trigger: "manual",
                                                                 html: true,
                                                                 animation: false,
                                                                 sanitize:false,


                                                                 content: function() { return thisHTML;} /* prevent duplicate elements */
                                                                })
                             .on("mouseenter",ShowAssistantOnHover?showFunction:"" )
                             .on("click",showFunction ).on("mouseleave", function() {
                             var _this = this;
                             setTimeout(function() { if (!$(".popover:hover").length) { $(_this).popover("hide");
                                                                                      }
                                                   }, 300);
                         });
                          $("div#popButton"+thisCounter).data("bs.popover").getTipElement().addClass("AP_DAJS_popover");






                         /* didn't work, forget it     (function(){ new Clipboard('#copy-buttonContract'+thisCounter);
                     new Clipboard('#copy-buttonAbbrev'+thisCounter);
 })(); */

                         //.popover({ html: true,trigger : 'hover',	content: function() { return $('#popover-content'+thisCounter).html(); }});
                         IDcounter++;if(theContract!=""){}
                         return true;}
                 }

                 function poolWarning(jNode) { var theClasses= jNode.prop("class");

                                              var theClass = (theClasses.match(/\btext\-[^ ]*\b/g, '')||[""])[0];
                                              var thePoolLeft = jNode.closest("datatable-body-cell").siblings().last().prev()
                                              thePoolLeft.addClass(theClass).addClass("makeBold");
                                              thePoolLeft.prev().prev().addClass(theClass).addClass("makeBold");

                                             }

                 //add Styles

                 $(document).ready(

                     function () {//make sure page type is set
                         pageSpecificElements();
                            //Check if fontawesome is installed, add if not
                         let span = document.createElement('span');

                         span.className = 'fa';
                         span.style.display = 'none';
                         document.body.insertBefore(span, document.body.firstChild);

                         function css(element, property) {
                             return window.getComputedStyle(element, null).getPropertyValue(property);
                         }

                         if (css(span, 'font-family') !== 'FontAwesome') {
                             let headHTML = document.head;
                             $(headHTML).append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">');
                             s
                         }
                         document.body.removeChild(span);
                     }

                 );

                 GM_addStyle ( `


/*body {max-width: 100% ;max-height: 100% ; overflow: hidden} yes, need this to prevent scrollbars during animation, but, breaks pair explorer */

       #AP_DAJS_preview {position:fixed;display:none;top:15px;bottom:15px;right:15px;left:50%;z-index:9998;padding:12px;}
                 #AP_DAJS_closebutton {height:24px;widht:24px;position:fixed;top:5px;right:5px;border:1px solid black;content:'X';color:red;background-color:white;font-size:24px;font-weight:bold;}
#AP_DAJS_popupframe {height:100%;width:100%};

div.AP_DAJS_element.sirImg.easterEgg {will-change:transform, opacity;}


.invisible{ display:none; }

body[AP_DAJS_pagetype=astropair] div.bottomdiv {position:absolute;left:5px;bottom:-55px;}
body[AP_DAJS_pagetype=pair] h3 > a > i, body[AP_DAJS_pagetype=astropair] #header > app-token-info > div > div.icons-list > a.coingecko.ng-star-inserted {background:#FFFF00 !important;}

#header > app-token-info > div > div.icons-list > a > img

div.AP_DAJS_popupItem, a.AP_DAJS_popupItem, a.AP_DAJS_popupItem:hover{ font-size:10px;color:black;font-style:normal;
 }

.centered{ text-align:center
 }

.pHide{ display:none !important
 }

.DAsorter {font-size: .75em;}

.backImg{ -webkit-background-size: contain !important;
        -moz-background-size: contain !important;
        -o-background-size: contain !important;
        background-size: contain !important;
        background-position: center;
        background-repeat: no-repeat;
        width:21px !important;
        height:21px !important;
        display:inline-block;
        vertical-align:middle;
 }


.backImgSmol{ -webkit-background-size: contain !important;
        -moz-background-size: contain !important;
        -o-background-size: contain !important;
        background-size: contain !important;
        background-position: center;
        background-repeat: no-repeat;
        width:18px !important;
        height:18px !important;
        display:inline-block;

 }



.smallImg{ -webkit-background-size: contain !important;
        -moz-background-size: contain !important;
        -o-background-size: contain !important;
        background-size: contain !important;
        background-position: center;
        background-repeat: no-repeat;
width:12px !important;
        height:12px !important;
        display:inline-block;
        vertical-align:middle;
margin:0 1px 3px 1px;


 }

body[ap_dajs_pagetype="pool"] datatable-body-cell.text-danger ~ datatable-body-cell:nth-child(n+5):nth-child(-n+6) {color:#c4183c;}
body[ap_dajs_pagetype="pool"] datatable-body-cell.text-success ~ datatable-body-cell:nth-child(n+5):nth-child(-n+6) {color:#17c671;}

.floaterlink {display:inline-block;text-align:center;border:1px solid #00b8d8;width:1.5em;height:1.5em;margin-top:.5em;font-size:2em;font-weight:bold;-webkit-border-radius: 24px;
-moz-border-radius: 24px;
border-radius: 24px;}

.popover {max-width: none !important; background:RGBA(255,255,255,1) !important;} /*otherwise can't make them wider*/ //550
.popover-body * {font-weight:normal;}
.popover-body .backImg {float:left;margin:2px 2px !important;}

span.abbrev.badge-danger:after{content:'[no icon]'}


.filterbutton {-webkit-tap-highlight-color: rgba(0,0,0,0);
border-collapse: collapse;
box-sizing: border-box;
text-decoration: none;
display: inline-block;
line-height: 1;
text-align: center;
white-space: nowrap;
vertical-align: baseline;
padding: 0;
color:#00b8d8;
font-weight: 500;
border-radius: .375rem;

    font-size: 1.6em;}

.filterbutton::before{
content:'\\f0b0';
}

.circle {

    -webkit-animation: animate 1s linear infinite;
    animation: animate 1s linear infinite
}




@-webkit-keyframes circleanimate {
    0% {
        transform: rotate(1turn) scale(0%)
    }

    to {
        transform: rotate(0deg) scale(100%)
    }
}

@keyframes cirleanimate {
    0% {
        transform: rotate(1turn)  scale(0%)
    }

    to {
        transform: rotate(0deg)  scale(100%)
    }
}


.popover-body{ padding: .5rem .75rem .5rem .5rem !important;

 }

.popover-body a,.popover-body a:hover {line-height: 12px; !important;color:#00b8d8;font-size: 12px;z-index:99999; }
.popover-body a:not(.makeBold) {font-weight:normal;}

.popover{ box-shadow: 0 3px 15px rgba(90,97,105,.15), 0 2px 3px rgba(90,97,105,.25),0px 3px 6px 3px rgba(16,75,95,0.25) !important;
        -webkit-box-shadow: 0 3px 15px rgba(90,97,105,.15), 0 2px 3px rgba(90,97,105,.25),0px 3px 6px 3px rgba(16,75,95,0.25) !important;
        -moz-box-shadow: 0 3px 15px rgba(90,97,105,.15), 0 2px 3px rgba(90,97,105,.25),0px 3px 6px 3px rgba(16,75,95,0.25) !important;
z-index:99999;font-size:12px !important;line-height:14px !important}

.sorting {text-decoration:underline;}

.sorting:after {content:'<span class="AP_DAJS_element"><i>(sorting...)</i></span>';}

div.popover-body hr {margin:0px !important;}

div.popover-body div.backImg{ margin: 3px 4px !important;
 }

div.popover-body input {width:9px;height:9px;}

div.popover-body {font-weight:bold}

.redBkgd { background-color: RGBA(255,0,0,.03) !important;//#FFF2F2
 }



.greenBkgd { background-color:  RGBA(0,255,0,.05) !important;//#CCFFCC !important;
 }

.makeBold{ font-weight:bold;
 }

.AP_DAJS_clickable, a.AP_DAJS_element {cursor:pointer;}
.AP_DAJS_clickable:hover, a.AP_DAJS_element:hover {opacity: .5; color:#007bff;}

i.fa-warning{ background-color:#FFFF00 !important;
 }

.astrImg { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACZklEQVRIDe2UPWgUURCAt/EnJuS9eYUWVv50loqtomgvGhRFiIekCIqJBjy8fTMSFG39aVQQ0mgT08VKDQoqSiwSiX+3b6bR1h9QMCFGmb3bYy02enpX6cLydufvm3nz5kXR/6ddO9AXTS7xJtnYE80sbRcjqpiwiUCeVbp5c1sgWgVZvkZOvqOT6/rfclBsq1sR5L1CCORDbJJtLYUMRo860PFoWgXIQr2asb5ockXLQGjC7rQKkAmEcB5B7mk16LinJZChaKoTgc8Q8FkEvkhOHhPwJf3Xtz+a6fprUGyq6wjkHDp5QSDf6j3R9aVWVe5O1v8xZKgrWemBjxDwFILMp8G16blX5Qg8rXZq/9uwspkGtOEQOX5SFDwP0u8U5vipt6Gk/ovC9FgS8H0EnmsE0i0Cfk4gDzMZgiyg4ztaRWMLUxjPIfADNGF7IYgcX8gHIpCAwJfRJrs8hHKm09VD6I8N71F9za52tFWnskJI/fToRL9F4KveCqaZOR5Fyz4PQSvHyMkt1asdAV9Rv19DXDhNwCNp1iDj6OSzbh062ettGMhDvE16dU4IeJacfEGQ2zU/HkHHw4WVaNO8lS1ZRmlQkAmdBe/C8Z8hoaQzRE7u5uTv9PpZtPlHo+oyBLnRcAKe9RD2a1bo+ERDrj1xfFjlHpJ9CPy1oQO52RtNLC+sBA3vQOCP6lA7QTJ2EoJJITYMNgIpxIaSylVf603WeP4UG95ZCInNqzWaOVoh7cGpTl6VGXtX3UDp3SXzBDKuN0GmSwfXhgH1QwgHyubN2kzX9FrpeL0aLR9sarqbpvzzDj8ADg7SO+WUbmYAAAAASUVORK5CYII=)
!important;
}

  .googImg { background-image: url(data:image/png;base64,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)
!important;
}

.zeriImg { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAABsElEQVRYCWM0Mk77zzDIANMgcw/YOaOOIjZWRkNqNKSIDQFi1Q3KNMVCrOsbGhIYfH0siVWOoW758n0MPb0rMcSxCRAdUg0NCxg2bzmOzQyixPYfOE+UOpAioh0FUkyuw0ChdPbsLaIdxUhO3WdsrIbTgqgoZwYHewO4/PPnbxkio1oYPn/+BhcjxCA6TSEbhMvXamqyKA4C6alvWECSg0B6SIo+ZIehs3l5uRj6ejNRhEmNNphmskIKphmZdrDXZ3j2/C0Yg8RB0TVz1mZkJUSzyUpTRJtOpkKqRR+Z9mPVNuoorMGCRXA0pLAEClYhsooEUMXs62uFYmBxyXSSC0kUA5A4JDtKUlKYobg4jAFUWMLArFlbqOYgkJkkp6nGhgQUB92+/YTsQhLmKXSapJCKinRmQK+MN248ymBshL2CBpXwoAqZVEB0iQ6qbGfNLEIJJUKWgaqaxsaFDPsPXCCkFEWe6OgrQUtHKKbg4IDSXU9PJsktVqIdpa4ui8NqwsKgprSjA6KNRUgH0dFHyCBqyhMdUtS0lJBZo44iFEIw+dGQgoUEIXo0pAiFEEweAB/QayzTnqY4AAAAAElFTkSuQmCC)
!important;}

.sirImgOLD { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAE00lEQVRIDY2Ve0xTdxTH6wvpLVDAuZAsuswZjTO6LZrtD3WazCzRbMYN0DiX7I+5LXGmbCqgsgBmTqHlIVUqqBMxvqXisFgRLay8WloqBS4USnkMKl6LvJXah9/lXGnDxMWd5OScex6fc+7vtvcKBK8QANPk5u6o1QVG7UeXa2sAzPKVUW6zquHGyst63ZHazq2++P+yB6ptnzIKDYIUZWAUZZDXd+3yNeaYe6OY7HJ/7lxzz0Zf7rX2VGPPOnFOOZZfqEFYbjmCFRrP6muGO2uuGkpDTpS7aJgoW8MPvdXOrXotkAoABPQ/dckfPX0GkkGnG2l13VhxUde69FxVq/hEmVuk0IAhcLYGddzA8teCy4CZAArsdjvSZRmI3hyNpMQksE0snnm8f9D56ntH5sRVWCTzTmv7aOvfdbb9/wlW3O/+duX56tp73f1321rbkJCQgBpdDXQ6HaprqpGYmAhLSwvdQIwPUtz5KOKTq/ri4ON3XZFFpstrr+hTV1yoqjist+3mawDMXHhG272hsA7P3B7s2LEDBoMBGo3Gr2azGdJUKYF7aGsf3AjMWnNJX80cK4VwQiNyNMMsECDQ2B2LGfkd3O50oLK8Ej/8+D30Or0fSgO0Wi0ypZn8mQMI84HJqmzceqH8DohBKpSXoOHhwDJ6WLO+K2nMruwdcF84exESiWTKxkajERnpGQTmAMyYDAYw/cOzlazwaAmEWSXejQX6cw8Axl/jeY6/8nLzkJ+Xzz8wun3a1mQyQSqVwlRnIvBBf8MkJ6a0KVN0VI2dpQ0Zk8IvXABlZ0/mw9JsgVqtxs8xMYjbE4fYvbEoVBYSlP6BoimNAoFAbrQdZDLUuGtzLJqSB9BxIisHNms7Qcrdbvegrd0Gt8tF108BfAbgYwApAH4FMN8HOVJlORSYocLVlp61vhhva+2P51F32iEZGZJtADZ4vd7xrs4uNDexGB8f9zrHnWhsaER7mxVer5eG7QSwrvbBYPuq8xVYlHvPomrjFvDQ9tHRN9+Sqx1Ey0zJxNjoGDwezwiAJ/Hx+/DG3FCEhgkRvzce0ZFREIcGIjhkNpITk+Fyuah2jL3fhNsdHIRpRYiQ3xpgh4fDBWdMfXPnZKqe+MDFxcWI2SXBgX37IQqehmDx9BcaMgNBIRO+eDrEoQGIioxE7J49yM3OwU1rHxhZEUSyP715bGcEv/WW6/orBJb+lspvsf3rbTxEHDYDpAT/avOXWLJk8ZT4smVL4XQ6sbVQD0Z2A+vOV2j952x8MDCfwLKJMx4aHkJiQhJCQ8UQBTHYtfMn9Pf3w95rx8GkZISHh4NhArH3l93gHnJwP3+uPFPf/blEbd5/y8q96weTQ+AsaRYZsI4hqZkbwpDTxWuzY9hT2NJz8UpT16X6h4P+eOvjEXCj48n0WvgXbPIFAdMPp/Pg/PqObwJTr0OYQqoEM2EDJyzFKMekKGF2jCyezJniE5HOmERSYjodyDcTQIl3jql6Uist24/XWLe8l3275QWYBiqRa7RGT4FNDhCQfm4kl9i/Ny3IUvUyRwoQlKJ0azq49321DdzQgjBp4Rhz+Brezrppq+p99IEv90pLQHmanAcDmM2ybIDCYN100mBb/3LDqbqONbKKli9yjUb/R/blmn8ATIrJHJzMCdEAAAAASUVORK5CYII=)
!important;
 margin-left: 7px !important;}



.sirImgOLDTriangle { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAD4ElEQVRIDZ2UbUxbVRzGT1lxTgjGwG1ZjItZdE582fywOHyNX0zUDxo/GRMX50IkKkoJMspAOjZqbymyLo6ZoBZh0NHX3dvSDeyYWFihLS2UseJm0fFiSq2tE9aO18fcyshABtWb3OQ8//M8v/u/595zCEnwomSmDwU0+06C9gRtEkkSRbOgaHYgwURiNqGcFS2BkSFj3kostZGrpFlI8upBCk9p7jms79mqMIc2imw4D+AZe3i2o8gZhNjqS98mYx/jl+tA0SbxhuG1DABSFxcxYLGcw7e0FE7LGQDoi3sLGk6n0yzuk2nuXSu7bg1A1zGlEhUVRyCVSlF6qATHv6jm4IZ3da6dpKgZArlJsS5k9SSAaiNjhKigAKOjo3C73QgEAigrLcMFgw4TwLOk+PQhrusMaeuO1fk76th0bFL2uQwOlwN2ux1WqxWOXgeUSiXqak9yXX8QD5e2gJIxhjuCVk9EQpFgzr4c5Ivy4XS54Pf70T/Qj9z3c9Ft6+bAL8YzuXWVmQozMmjmpdWMNfWN6Wiw7NNSqJubUSIW48SXtSguFqOx4RQHlawIFTbNC6pMwytqawkAd4+PTUzTFTQH6R0fG9fbOrsWOQHAy2UAvHrrAQ9Usa+Tj+pBDjatv2lUvsiDLrsDalUjB6oBkDU/vwCWNcP6/fkogKkfOn7E13XfADNReMMzb9ePTI21DAciazW6XHuoxlo3PDiEE4oaOByOWQDR7Oy94Bq9K3kTdu/KQnIyP64f3bkD0ehMbLirMxb0OCGy+f/5qMu0pcHmI5pH9jb2YKjfizajCTk5B+IADnrr5vP54PF4y5qrP/3E47j+1w3sUnVHidiQvppL+BLteQ7s7nXNslojtxQL4tz9uJ9KxTZhGuqPKeILra5V4qms7chI24T9b7wMRENgrk2VE1EDhAr2+AowJWNfIWUavKZ1H/zJ4/m1TWfgIAf+AETB0HVfODI1GAXkzOS0MAR8HIvd9E4Ewj5uJ9om/9zOwZLKtSfjJ6Dc9PAynKJZf/JhPXarLg65epxzvvZWFHWOeEh+Y/tz6r7fs5ucgdRKxkby6pktEl3Hnu/sEy+0eMKZ1WcdJE91LuUz7ZWt1a2jS0drp6CKeZJQcvPzmQrzCClssuxRXRzxeTzwmBnUeIMR8t5XV3gSnZdXrhlMOWr8JbPK9Fta5ZlrPIn2EinXDmw5qr8qkJsmBDQ7SdHsIEWz7RTNXqXkzCeESC7wCQGPaz8ACH7u64O+Uc0txZvLr/RfBgCPSCRJKyIAUi5funyz3dL2/8EriLeJhYUFem5uLgLg37/Obb6Nhn8Dna1ooIakiNYAAAAASUVORK5CYII=)
!important;
 margin-left: 7px !important;}


.sirImgOLDlighterGen { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAD8UlEQVQ4EY3SfUyVVRzA8ac/dGplq5w1c/3R2z+ZFDmbzrbWRlvGyEA0tQDJF5gwmth4URMu1wsMJQiQGyjilbcrLxdNAq6Nii4ZKPiGi5dAYEmgQPf+LlyBrnzbQzDAjPFsZ+f5nd/5fc5zznMU5YEnKV8sa7NFXE/YZJ3BIR4mp7yrt8uSSpssrRfxzRLxPC2y3ijiXiCyIlUk6qJ05DH4zAPUVJhukBr/SGHzCRspTdA7Cu1dPbQ7wcUOym0rqxuFA0YhqEj4uETIsAjD94Rah/QkDT4EP2aQGp+Dwo4wG5daoe/PZuLCggjc5k1y9D66bnfxvgOUdisvNwpBeYJ7plDdIoDQZBNqZBpOd/eirJNSExAh7Am3UlELv12uZKOHGwcOHCQqOprdgQGkBO6k7VY7C/pHUBzCvE7B9bhw6uK/cK9DGHUInQ7pMQ8NLVOSjGLxjhcCkwStwcHYfTsazRdoNFpyc3JIS03DbDaz3W87lfqvyRyB58uFF68Kpj7B0S/k9gk5dwXDXaGoX0i5I4NKvFF8XfIFt0IhvQXab9QSF6vjfNl5dDod6enpGAwG/P13kHsqif422LtH+CpKoE2IGRKUG4LSJCjNE/01KR3/c6F5EvrKcSG/E65afuCN11wI+TyESnMlZwrPUGA0ssFjPfW131H2MwRrhdhIYVupoNwVlNaJ9ruwsFGuTV0HRVHWptkKtM1QnJ3JTr/PKM41sNXbCw/3D/H09ORsyWmaOmDLXjsB4cJRjbC4QVD+mEKVmzK8q23giRmwGpxu47I++QiJ8UcYBfQn8sk4ph8/d4AQ3TAlVdDdAsEXxlDarFPbvyH4tMqa/6DqABC8PywSS/lZCvvgp3sqBz9WXaC6+hJOoOlmHdXmfHpw4jMK6wYgE/jyljXwoegEfEif9g3x0dEMjo5hH4MP3nNDXXPJk4sJDdnFwgXzxuNN77wN94awDvxFV6kJGNk0GxxVbCzm00/8WOP6OqtWrhhHVPhh7aXly3nusUfRp2eoG/OfFdZGaamvqycuPm4GtvrNleRmJ/LWqpmLeXl6qWgHMH9WODYmlvKy8jtAleWXGpIPR2BIjcEmdnodcH/gb75NO8rh/RFUVFSqqMVuty/9X1RNAFEJsQmcM53rn4g3mKzQMAgnCyAkyEbY92PsA7qgAPhoVnAyqcIxh2IoyFVreFod351t2/LUUSE0Qcg/JMw3j99b02TNnHpAo9PoMBWZ1Gu8bLLIt9Sm3ZwghCcKi65LO/DIZG5OPZCgix6H1S+ecW4BKXL92Wwha9j6wpyw6ZOcTqe7pdoiVxqu9ACPT8/VWeyvZv5q3zh9bLb3fwBYLlKabrfnIAAAAABJRU5ErkJggg==)
!important;
 margin-left: 7px !important;}

.sirImg { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAD7ElEQVQ4EY2TXUyTVxiAC5hlm3E/LmxZzK7MbsyWLO73wsvdLLvaxZYsLrucf3NTyRZ1uhD3YxB/yaYzm04HToEJgmBhCFQopbICpUBpqRaKqJSClA/o9533KzzLV8NsdS47ycn7c855zvue9z02W9oAlvgGVEe5XzjjM7TqUFJzRtEu9opWFFba0duiufpEuxQUrSYkWu010cq6hbaImnBjvJiGuqcC2X0+1dV8RagLClHAFJ3RyCjWqAY+0hVlMaEvKDjCQt2QEBpRmHqCiNJnGg1j5T2izWYDHuvvUb6GNqHRLSgdgv6/+P3kzxw7dJjiE8cIuNtoAj6eUZyOCR1BoaZPGIoZMG9way7Btbk5o1mpl1Jw4Mlgl/K1tpo42hWzAl6Pi00b12Gvs+Pt8fLjT8fI37yZ2TvTHALWInw7I5T7BO+owkBnbG6GyVmNWGJOH1DqZZs3pH6r9prU9Cs6R1JZc/BgAfZLdlwuF3a7nUgkwv7C/ZSeOkkcOOVTnA4LYzM6iWmdyrjB+bjBhbhBraZTcUcFbP6bsvpcQObPhhWDSbju7+ebPXtSkTY1NdHQ0EAoFGLv3r0Ul5xI3dzZqPC3CPNjBvWGYv2kydYpky/iJmunTI5H1e7Uc/SG1QdnugUr4EB3D+++/Q67du/C7XbT299LWXk5G9d/wnD4OiMxaPYofO1CZVD4TBfyNeG7aWHLtHB0QoozCljnTeQNKLhce4miwiMMhfxs3/o5G9ZtYueOnfT5PMSmodYhODpMupyKopiwLSHkx4U8Cx6TjgzoomFC5YU/Kig9fSaVsn94jJuRGyndTMLIOCTn79ZhQmCbJmyJC1/NJfl63IiFZ2efW2RlSCC/5NcSupxtGMAMMBWNsq+ggAsV5xExuVhdzoGCfG6FB1O97l9Y4I4ujKnkhxmwdMMCOx1OCr/fRzgYIDwYxGpzay7JWULuM8uxZd21c7JsBDyd+FucVBWftdL4NJ2VoVvgpvomqiqqeOP1V/+BWuCcnGxyn11OVnZ2hn/Z40uJRFJ9+lYGLN2wwKUlpQxfH16IjscW1qx5k2VLs1jx/BP8cvyH1OMeOVDA6pUv8EiOjdWvvYLD0WL5D6dzHtAtcGVZJV6P9zbwfjKJczSmMT2rp6CTWkoQVYqRSc1kfr7X+ogPgO53LEbc7my3aveotd4zSW37OLS4Ta42GpQMmuSBmoRV959/qG2BzxWfw9XqSgIrrI1DQ1NPlfZJsHFAGGwXCm+YnJ1KvPdQyL8tLII9Vz1WxLmLe0K31aorHcKfPUJtXG1f9P9vCWxwXG6m39c/DjydfnAwoL5sjKj6dN9/6X8D6mKWJnFSJqUAAAAASUVORK5CYII=)
!important;
 margin-left: 7px !important;}

.cerbImg{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA2CAYAAADZJImDAAAFJ0lEQVRYCe2Yz28VVRTHv+fOz/fQVyhKAjH+IIit3blTNpJG3isVYwqvMSHBRBP+Axfu6lpXxpUuSHAlRRINtH0IEjfIwo1IKaKJRqIEKLSUUObNr2POnfezr30zLW9j4ixm7twf5zPn3HPuuXPBAAEA58e2s3PolJTlYpSNWrE3jwYIB/LsjjO7h87VJfcSpupCgYIJxHdB7jC7h6alnjAZ9QrWAtJIC+zFILvEbnmml7CVINFDgf0qyC72ErYKSGtmg6t+J2xirf56ULcbiTMQwIzDBbjVGwAV9GvijT7IEegMPHozmbOkfzehq7WlfaFAPFC+BJc/TAQcNVcTlFaXBpLxBhBKZFlpwrq1ZwFpRwco7iYorS0jCIhrK0iawLXaM4PWEpC1/n9QVkt19Ou96fiEAWadelppGwq+VgFtZWYDRJGuY1agZkj0TiNmUyBPBHOv77p7qaAhol3t6g2I2QJRuGfp57eqZuHCUt/mJFPTeIQa7PFBPGuDKHgunB25/GThG4of8H2jb3hbcC3J1DXY44E0ZMh/OrhWumnkpnwEUABTvBjcNzcPu+FcRVuOxqONg2qQZ8LZkWXTnlYIQTGLIyiALIoXfRj9++qwDXjddUYN0h/MluaN3BQ3INyYfAA24oUARmGfG//647o1+rLyngMa8jcFc8VHZm5aUkiiSRuk7myNZ2aQ8sAy6kjxyEMnmCtGpjMjmkCbqxPCgB+pzRaipbOeeunVdJDEuM/wX8vbAip6v4yS6czoZNgFYqkt9pZw8bxnDhZlXDooALDThn3x+E2w/8pfTuF0NwhAEautthvdO3fLGigJpMxspIJ4h2Hgt1u4cuyzd4C/z3czFyQ/Kssw+O7JeXPwDQLCMp8wJomiVK/jvFKEeb6zc/seIAeE9wIYykpmTL63dskMkuzjGTHxF1L7PP/hTtILnpRTNaKbQQj7Rdpb/uojwD+uzG0C8evyG8/Geh2B4FQc7+ronwKRUMgEegRGvwHcvu+Dnn3XDG59T2qLDO6EiU5xHAMRyHFPO+HsiISCwFI10jrPR4gHt7ryZZftoWHmhUoXmEIcRzq+jNyU413dL7B0kEi3CGrO03mGAeWpgVJ3GBtJfIlm9hnHu3IgG0jcyVV6Fn6f+lRvJFNhJLAoEDcgJ/9tZlB90nftP9XIMV1hTBGUYYnHc+SNZgbJ8p/AdhNaEloHTOstEDJkN81hUKqaL09lBgHc3ncFLOaFCsQbGcsJxASH1VLVGqxk87q6zUC14L5e00wCtJmqq2qgZEUL01A78gQFowWS3eu01eLWXNPAt8IemAP7Y//GJyoMig+1JrKXGNLx1m6O5vAVJTG8SrZRK1r0q9Ys+Rv0naEPHlqDZ8EXZFckS7K+MoKkL8tPEoDdjcUmea/daSLWG0f+ydI7H9pb65+0py6qTWHNzWCzbkWJ5E8VDS1aWzNr9J/9P2q6bqvePSgroFwz35JM3jrmbH10JWcHeojrnASMTQyWn+IOz2ouQesD1HtrbWL34AzIGQGiiFbNutqiHfC6kCxPFeTGLhLcIrNXTc4UOoZFYtE40bSjMWuFWsqFxyQrE5QDycHtlxzRuMzLZ79+6p+Pk6bP2wKxvfvab9ocnB8bRWyeTjKB3qjLuiaHTjY4qJA3qfdnjAlFmNjQwYZiHLVo+dQZGDyij5NABoOrgG0z+981IWVjo5CGngKTl9v9B8Y5V2Z2D7O/aeyHuvf16hRSA+uwxb633/fzBy/1GvIvo5s1+uLsF3wAAAAASUVORK5CYII=)
!important;
}

.chexImg{ background-image: url(data:image/png;base64,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)
!important;}

.coinImg-DISABLE{ background-image: url(data:image/png;base64,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)
!important;}


.chanImg{ background-image: url(data:image/png;base64,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)
!important;}


.moonImgOLD { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAYAAABCIB6VAAADK0lEQVRIDWXVbaifcxgH8M99/+//NiNHy1kmj40lie1/zmljHrbDjmYcjjmMN8rTC1oTonmBNxTWXkgtUfJMiUxCdChL4cVC8lAoDQl5zsOZ3br+57pPt+2q+//7XQ+/7++6rt91XX/+TwU6LdHleBqbcQYOR9jsTdXegjZftphx/IQPMYYNeAKf4hd8jx24AYN5Li7c59K24D7UeBxDeAFv4/4EuhEP4PO0C9tNLafaWBpvH0njZ7EKD+L41qH2di5Oxmd55uGWsg/e5OeWNPg68zmRhvslwE04Hd2UH5spCjYcCc/vSl2DaTH+SeU9OBEHICK4E1fg/Fyfw2EJcBmezP07eb6XfH/ZlsIfEDm8MvO5um2E8OR23J2pCnVUTTizIDGeas7MR4QfoezCHTgN7ZuvxZY8cDGewSHJRwnuwcF5SUQ+L3TLEzSA30c8SkOXZmU0FbAdN+MszEGUZdDHuBVrEmtJCONwgMb3St62Ei+m7K1c/8z1C7yOIzP/gRHpeA1Hp81wCK9KJoDfxWPZAMH/3tLFfmvyvyKqpaF4o504IvXHhSK6KkB2498W0Jf4pMX/kXUdHRfyoKiOgzLnEcXS7NhIk5E83IA260v4K3W/tS74LiNaOIPd/w1ZVNN12al9YYTUVEV4Hd7HnAjPYh/f1bg+919hCtFQQaek/FC8ilEMpK4/BwLg7zSKkvk59yFflIaRnuZRY34ExWCKilifFRNrlF6fjsocB0iTitjH9y1ORbRwlFpEF6H3lL17FYufp9+50YW3IWq+T01fxwgMoMhrFHxzQTRNlFbTxiewbNCcSzYoRzcmxgo8ijeSn51wOd32f4iFNQdOMzDNgpqB3SzZzNoA7r82G+cyFh03n8FNLPqRebs4pmmuZlq2BnR50hblilq5vFYOTSt708qhWrlsj3LkI8XwlGL4ZUXvPeVIrVxZK5buYG0D2v4H6gcQ7s+EUK0+W7Vmp866uqjOq1Xrap1zap1za9V4XVQX1EU1XuuMfaM885oMP5Z9QBtdwaom51QTo7rrt6omp4ru5Afx6U6+qXvRNp2JC2dSMuvUbPgh+Q/IJd/coHL+2QAAAABJRU5ErkJggg==)
!important;}

.moonImg { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEk0lEQVRIDX1VW0ycVRCeF0187INPmviiDzYxNcbUtGk1IcZWmkiaYELFiibVFmoKCLakocqtIGJlWWgLBdmA5VIFSguFFhAKRWC5SwnXQllAWm7L3nf//Xf3M2f+/f9CmjjJ7pkzl+/MzJk5P5mtLlhsLlgdHv5Z7G64JRkujww/nqfGtgGk5dXhUnEDhsYe7TDwBwCfLwBJkkECyOaUYHdKkOQAG0reZ5CGP9rxwtEcHIouRKquFkShICIsLK3igxMFyDc04Uh0PnoGJtnXF3Qlu0uCw+VloewPYN70RIuC6ASDEJ1E0e93MD23DLPFDr2hGf3DE2y353Md27wYlqX5yT4fyOb0wBOMkN5JYSN/IIDj50pB9D4kr48dHC43NjbNmvPSyirzjxfXsP+rfOh+a4Dd6cbo+CxGHs6AVMsH/RMIjyviqIjO42JBvar631WU5E6bEW1doyA6DdqbwvZktjqZefMzHY6eKWLe5nDj8eIKNresvBeXIsgr+0Eh6TDc+It5IduyOlh3LNHA2fYOKiUiog9BdAZ0MANns6uRdbkO+tJGdPaOwacisitgtbtAtAtEH4PeS8HahnJwWc19hJ3WI7f4WZZcCqvdHXR9fhmfMqH2TjcrjsQUgHYnY3ZuCQ0tPfi5sB6JmZU4n1MN49A4Km92sp1IkPpHpzE4OgmrXUlJhfZIMpKyq0B0AJGJJWjtHEb/6AwsNidCT+nZ7F7HIIh2w+l0gOgUmjuGWS77/KDbLUZIstJ8QtA3NIE50xMQxaKjZ4wN6a1kdnR7lLacW1hWz8fEtAnRP5SB6BDo5WRNrnXF2qYF70bm4O3IX3EyuRQOl0czmpn/F3Hp5TtkFtvODLv7RkB7UjAcnEYNmA5fDA4DYXJ2iUFdbiVC9QTRy26PxNsHxjHQ60mqCptmM+hAKhYWlf6m+rt93AWfxOi5I8SFiAkTJMk+7gx1TIsrmmBafsq6K4ZbiIi/gqiz13jv9fpA9C3z4o9o748caWvniCYUjLg8AahOHhvvSsDfxn/Y7tbdbmToKnAwKhvt3SPwiQujOA2DymvuY8tqx0QwfaHp7BmG2WJjI8krQ23n0JhCRJ0r1ZxVxulS2pVCMjBvUjKildVNVc/r7ZZe3OsYYN7l8UJ0ikr0qpLdyPicKuJ15ek6r61doyipamOeL09ttw2zDR99rWOF7Avw2IoxFiTAiMIhoiMKwy/XGjE1uwhzcOwj4q+irqkH+77MU4DdHhkCRNCFSzfQ2qXUWtRYyNUyJGRW4psLZWwn/sSb/F1mJUorG7FhtsJiteOLhDwc/74YfUNToM5e5TIE9Cvh2bDalEdJlv07y7A/DZMzixpwXXMf8g2NSMu9jp8u17J8wWTCw8l5JOX8CRJvqCBRhtfCsxF8yCCAxWdGJaIIrQ2FbOrREr/X6xvrSNdV8V7IY9Mr+ENAag3FASUVTfD7lfS9ooe3Xxy9xOmrB4mV9mWAQrJwvaYtOFzHEJtaziYk5p9B/AF4JC9HKvaif7dHnJpbDaI3kKq/uR0b7d1j+DS+GIejr8I4PK3p/gPUzFKNK6pqwAAAAABJRU5ErkJggg==)
!important;}



.unisImgx { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABSUlEQVQ4EZ1Tq04EMRQdxSfwCWj+gASJJDgEDoEkzBkQBBwagUORkCA2IQgUX4BDbhArQBD09pRNdu6UnG47O5nsAmGSpu3tPY972ymKoijCyWRN87++ULp1K7nfBYfzsNLd/7gW2MCzflI4Gq/G8RuZwV2KoC65ZeBVDb/dJ1u6V3ID3hv4YWAwuDsDvYEvDfi4yFlLNj0ebxp4auCbwMlBmBExiHhhLxTUMHBk4NRKf5H2Bwn8KQeh/Npo1bqLpBxk38D3Gm4vrVt1A6+FaR3kxawu9xoPOwoGZvVIou53RYusIIJ8oCT1oKn4lOs2+KHeRczJqrqaeYKrBGwqDqz0tzX8jsHf6LwGn6Oz7r3ric7BVHNSnX6YnaTYKIL71tUwHeg+DZw04MNMze0qrpLkIpMtnVVOvOfKH4rkzz9P7kNmFlCxfvwb8iVS2kcT9OQAAAAASUVORK5CYII=)
!important;}

.unisImg {background-image: url( https://www.dextools.io/app/assets/img/uniswap-logo-home.png) !important;}

.gearImgOLD{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAD2ElEQVRIDZWVf0wbZRjH6xa1d1dYzUQGAc3ifjjNcHPGP0zQGZIZdJlzU6fJkmmcZomGP4yJfzpjMgothZZSChFwRSAWrl3v+gMopS11FFootJVVVwaVsho4u7KSNCKSx7wnRyi5dXDJk+d9v8/z/bxv7sd7AgHPRUWZl85ZQl2HtMN3fHdThze3RJaX8452jITfMk6SumnmxOZa1rHS/2eeWOP6W9ToBELtgFMGvz0OgCPTGMCj503BdqSL1A4QN7nSY/F7T2cFckVLJJEranSwUEI9yOYX2ocjZ4wTzcc7R2/haq7mALHGuRpOpfZy3qx5NpkUox0RDYOAr0dxi5t5TjscKfjBleA0lAubh+4DwO6sQK74nWf6EtFgB5F6cOUja+AaGUkUAcAjqH4VYJf+dvzIeWqyCW8Y/BctTkcWTnHejOyYXzz2hs47UOEISz8wBVvEanv6QJs7ap5dPJbRuGVS74+V5zc57hU2O5nLttC3794Yqyj9edRq4BY6qfM5sXobcFHQ7GB+W1rav4XDO+0KL7y6R2VfwVU2wFQDLKNEe/N3ANglENX3A67kog8U4zOf81IeIH7tDF/j/JiiD1Cwr+hFy4QOV/SuCZV9kK8ZSM4CCB/A4JVDiXQxrvwfiKCvdQ1bGIbJYZu/vxn5hqi1wlm9j+R1P0R8sc0dJup64QLl13APmrXopqYey1f1JStsIelDGLzl9/U+Fy63gHueOZTRwDCQ84TCmv6iPyDLKGxz8p7eOySUm8AV/evIhgVt/WN6vBqTm+BMt0e/UdjBoKTVEcblJvjQ6FVv3IrTOo8Zl9GAYp/SuhSLAbYDpsAfTz6DyygQ1tCAySgo6/zFFgPABHtq6FVCSgG2HvLR21d2Av6qP1iFr3vZBaRGaPBOFwvOdntoXHoDCKmRjX0KcyK0sPTsduDtgbnS3BrjCudFnBMtAwH2AxmJ3T9Y1uGirljH5ee6RzR75VTqgNo61xOaezkbXDMx+05eLZ0sUpoXLhl99V9aJ+QntS6TLbp4nNd3dejXy3iVAXKqDf98YvTKtIHofnT4oGYdwO7roZmS053uVqLKsEZUGaBr6o8yXtBW0RKZLxJKSMAlesDYTEJhLZ04qDLPPCU3LgtZHdX0UFBLbf/Y/CkYLX9cQgKCIzDKzzdaJyt6/TWlbXYnJulhNaTnVhtgLJ56cuvmeOe6W9G38UpyDZf0AF5JQnmHi0JfJmpGh/pFvacVqySBQCEhV313mYx/Ii+UE69PzrzyKe2te7PdaYgk0kWcjjL6w7z+o737M9pb1xa8c3RzbfP4P3fDTpLcwaG8AAAAAElFTkSuQmCC)
!important;
 margin-left: 7px !important;
text-align:center;
font-weight:bold;
font-size:15px;
padding: 0 2px 6px 0;}

.ethpImg { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAvCAYAAABkBQNlAAAFTklEQVRYCe1Ya0hjVxCOxmjiIz6qEu3GaGrUGBEkxEd8bjYa9Ud9gDU0aAyKGvwjuuKDIJeoKL6iIMotaNEilFRZloQgUpp/UkqQ9UeKlNJIoSz9sRRkEVmQU6aQ7L0n1xizUfpDQe45586Z+eY7M3PmhsV6+nti4IkBZgb6+/sTGxoaZgiCSGGWeORVqVSawWazr1ksFoqIiHiv0+n4jwyBbo4giHg+n/8eAHn/eTze7wRBRNElH2mGEIoUCASnkZGRPkBeYNXV1d+xWKyIR4Ly0YxerzdFR0f7AQJgXC4XGQyGlo/SjzA6ODiQJCQkQAwxgoL13NxctLGx8dkjwGGxnE5nVFVV1V/eo7rtCSy+ePHiDRzzgwObnZ2d4vF4fgzFxcUh/DhTU1PR4OCg8UFBORyOZ/n5+X6AcnJyUF9fHyouLqa9Y7PZSCqVIqvVKngQYHAMer3+VzzbwPDExITL4/Fwh4eHX6elpdGAxcbGIo1Gc4oQCn82rq+v6wUCAc0gxFNFRcWH8/PzBGDCarVGNzc3vwWg1FhLSUlBc3NzX4WVLbvdnqxSqWiGIMP4fD7a3t5+TjVmsViyJRIJTTYqKgrl5+ffuN3ueKpsyGOgfWRk5Ec4Bqr3wEZHR8f3TEXSaDSOQOBT5SEJuru7fwgZCHUjSZLPCwsLaQYAUHZ29vXJyQmPKusdQ/wplcrfqKCAWcja/f19uVcupKfD4Yhpa2u7ohZJGCclJSGTyaQKpHRlZUUIsUQFBuPKysp3UOsC7Q34bnx8fA1qDVVxTEwMUiqVx8Fkk1arNeNBD7rMZrMpoOHbXh4eHooUCgUNELAkFouh7gTVN5EkyREKhf9QnYJxZmYmOjo6yrjNNuM6sNDa2vqGw+HQQCUmJqKurq57eWk2myvx2gbAOjs7XcGw7QM4NjZWzVSTysrK0NnZWZxPMIgBGC4vL/8FZwscXltb+zIIFSwWQRCRxcXFb3Hv4CqZn5+3BaUEE7LZbBKcdQApFos/kCQZi4n7T/v7+wvwrAGALS0tyOPxDPjvuHsF2KqtrfVrdQDo5ubm7p0ajEajGgcFXpWWliK73f7yTgUMAi6XKyMjI4MR1NbW1jcMW+hLLpeLU1JS4nd8cKV0dnZe3Cs4wRuEIrRa7TFTaVCr1X8GXbN2dnaEMpnMzzPwdmJiooTuRuDZzMyMCootHuhFRUVod3f388C7sbfT09M6kUhEUwbe5uXl/Q31BxNnnNpsttiCgoL/Pr+ooJKTk9HS0tLXjJsCLQLtPT09r6A2URXCR4FSqfyW6SKm6oP9TU1Nx9S9MIak6e3tfX3fMPDphrtPrVa/g9aDqhw6hu7u7oCeDg0N9eGdBegoLy+/dDqdXJ+RUAYkSX6Bdwlw3UBrsrq6KmPSubi4KBEKhTRHgCGIyb29PSnTnnuvmUymAfxiBmBZWVnX0ABSFVqtVl5ZWdkllVmQhU+y0dHRUarsJ43h/HU63RF0CFRjMG5sbLxwu93RYABug7a2tp/w9Ic4rK+v/znsn1vQ0Mnl8kvwGgc2OTl5BIAGBgZe4ukP8SiTya6dTmd4WmGcXogHSGccFBTWurq6U7yEgAOwtry8/GndJg4En09NTQ3hx4OD9M6BNb1eH744wsF45xBfKpXqldfwbU8ArtFoQq9HXoPBPuF+TE9Pv2CKLy9IhULxB8gFqzMschaLJYnL5V55QVCfIpHoamFhITEshu6rpL29/RmPx7uhAuJwODcGg0F4X11hlReLxVlsNtvHWE1NjSSsBkJV1tHRES+Xy009PT0P8+tKqMCe9v0fGPgXBV63pJavPvQAAAAASUVORK5CYII=)
!important;}

.gearImgOLDtriangle{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAA+klEQVQ4Ea1UPQ7CIBTmDAYYjKPRA7kZB2dPYRy0j/QOzo48ooOJ8QSewiuoqwYsCYW2vEabNPC+P74ylDHiw5UBXpg5UU6XCcC3fekOglIoXPpgsdNjgoUmqULPPpzmyqgE4C28AruXgKuMLU/HLeM5n9CgaAtxuMJrg4UGVcGHWC0AX5aLcdLc1tabc7zX1Va+PU6skYOe1ohgEAXue7emtqHqXB8JpqQ2kYVeWO0ATqPgY5q3vVowxkh6AfigtvW1hqXh1iMVzjyWrN/T9T0hMkBn604yE2xp51eIidQSCdgDkKDXSYZv+6/V9Qku//Jj8NP/CSWYzQe4WOyxcf17xQAAAABJRU5ErkJggg==)
!important;}

.gearImgOLDgemdarker{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAADIElEQVQ4EZWT+0tTYRjH365QEPVbf0BFIfVLBBEF/dgPYdDVLCLTaqmJlGW3VdJFpYa6zC42Td1UtLJ0nulx2cysdHkBu0dZSjd1XTxpbnOnT6xNdJRoB76c9zzv83x4zvd9XiGGPcDEfLPHHmKGXTJKlIwSbkVJKkFZ8RBl9hMU3Q2UKAuKxooSWY2y2ghnG1THJZgzDDW0BMZfK1Sbk3WQWAcH7BBfB1kyJDTC5J8ggDVvoNgCx2sg9h7IDR7Uvn4aVOePkzBriCiEN3/K9SK19UgaZGbDqZsQ/gDSzRDZAuN6QHwF0QmiD5a1wQULaK6B7bUbcPO07yfVvb3OwzD/DxyYLueprUnJcDkHcjLhUjbE18CiD74uhQrCBcLtFzDjGwQXgqlJpR8nz/t66Ohx0Ob80S/BAmGq8uRFGOGgDEctcKQCEiyQLMFaG6y7DRFWCPNrmxU2W2B5LTz+7qKn08WWLjcbO11s7XIT/cXJpk8DL0TZM/fCVRLq9kew46FPIa1wugSqk6A0HUrPBep6CpQlAs9dxA14EO0gPvmt+gArX6lH/9hRdNezYUsJRN+DPTaIuQt770CGEc6ZIC0/UKlFUKCHsAoQThAOEN0gumBBO8aAA0wrV+PWl8HuWthbDRF2SCiHTAPoTYHSmcCaAUteguj1AcUXmPYWewB08CPZrGaHVkF0DWjug7YCsgyQkj8E9v5B3kVIkP3deiflK0x6T3d9JzMHWX+9tRL2mBqItEFsLegL4HzuEFhXCJIe1tpBDIC3U9EB0mf34r9gwwOP25gZU0q315LwejgmwRUDpA3akQvmTJj31jfT4jMkdRAynDHi+sajgaWht0BTD9pKMGRBqt+O4gyItYHw+CYh5B1nRgT9ayO3TtV44TsbQFcMF67CmUKQ9RDc5APPbfsl/6t21JiuXE1ZZ4ND3q4NvhtpNMGEbyDe86zxI1NHhYyUsO8WUlQlnM+BknQIqwfxHZep3RU0Us2Y4i0tzAi9yUutBBWpMKsZwh2e1WMqHi3J0uwKOnERDhXAfod6cLT8/9qvqlLjtbVjP6zfBMsWA2DNDr0AAAAASUVORK5CYII=)
!important;}

.gearImg{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAADJElEQVQ4EZWSS28bZRSGLcQGNrDrD0BsKtiwYcGv6AYWLLqkEqIUIkIjlYugZYEQbLiITRFQJGiIm6Zx0oDThriuE8dxbNe3sWM7zo0E52KPHXu+dxQe5DpVnaZRwkiv5pvznfNo9L7H4+l6gCcTGRMeyIjhnGxfTvZQXnYgKfuXBdnfrMoOJmWPWLKH87J987Kvzolg2WxM4TzfhXp4BJ5IxE00EHQJlIR/Ufy5IKI5MbEkLrZEryuuVkTSEhNFcbMk8osGt9WkbFr1ccd57iHR4/EAT6XiJjEecpmJismUGFoQ0xkxuiw+bIgLdfFpTfQ2xQ8VEbbEcFKUKg7sOqzuNJnf2XFuG/PCfTjwjBU1icmASzgqZiNiZlb4C+LytnjrX/G2RJ8jzjui1xFnEBfroj8hYssGhxZrO3U2GzaV5k4rY8yLnlje/DQUc/Fb4nZWjGfFRFYEsqJ/vqPreTHYJa8lfiyKtXqLZq3FtarDQNVhsOrgs1t4t0zWk17RS79mtXtjSdxY6GhgpWNHPiDSUweVvCvSk2J3zWHMMZzZdHln2+W9qsvr2y7fr5sP7ttxr2heHUy5jLQDKYjRohibF9NzYmpOhGKPKCESIXHNEmdb4mNbXKqJczXx7YZ+3hdgMOP0/N4Oaw86tNixZibyCDQmgjExPy2++0f0NMVnNdHThlcU3gd98BHI6LI3J0YKwrcgblkiMivuxvfD42Hhz4kLrc6mtDfm0pYqxUbjxAPWgfd4VuH2X7fhN4siFN9vRzAuciFxZUm8a8Qntji7KVK15ssHYN2F9fXGidG0KqMlMVQWt7Ii0m3HnEhHxNcboq8pzlWFf9O81s049Jxcab7iTQlfG5zbs2MvwOS08BVEnxFvVsWVivn8UNDjLmZLesObdhleFMF7Yjoq7sRFfs+G00Z8tWHGHjd7ZO1ORl/2FzpBte0Iz4pYTHxUF+9vKb26ytNHQg5rGEsZ34jV2enslPitLE43ZKKb5uRhM8eql7Z5diAlqx2iFRJfLItB25w61vBRTfm/zcm/wuKPuPBVzfmj+v/XfS5resfLxw/rP3Pmb3dAUafDAAAAAElFTkSuQmCC)
!important;}

.crypImg{ background-image: url(data:image/png;base64,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)
!important;}

.visiImg{ background-image: url(data:image/png;base64,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)
!important;}


.addrImgOld{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAVCAYAAACkCdXRAAACw0lEQVQ4EY2Vz2sTQRTHt1KotFWqhB5EQZKDh3pRqAetWCrqRZKeihAEvcSjd88WLEKlx556qBehf0Cgh7QJNh4K0TSKldDU1FCjhTY/aprsJl/5vs2bbmNRBzYzO/Pm8977vpmNBU9zHAeWZf3XE4vF0GrvbTbdgeVhyTCXy+FvT+rDe1y/fUscRmMx1B2XxN8/YJ3wzvdypYKJh49w915YgNOv36DRBhpYq9UCn8Pmjm3bBtoJcfx9exsXL5xHZu0TmCplYc9mKaRcLqNarQpQodTQcWw4Tg227aBWq4kEBLx8Pon02kdcvXHHAAVGo2azaUB8dyPSOG2g1ZK5UrmM+xMPcPL0WVy6fAWPnz7DKd85AVoKyefzRvhisSgURmYSP8wWBOa/FVD88RPVXzW8Tb5zYdy1srKCnp4ed8Ky4A8EsL6+boAan/Yqg/asvhypra0t9Pb2oru7G8vLy0bUmyMj2N3dNUDdyL5SqYgs7PluYJlMRqgE6Qat0sbGhjHmWr1e1+CkWIQcgUWeRDB8bRg7OztSLe9iNBqFOtPyk1YqlRCJRCQIPeCS5uDgICZfTAqInhuNhqQ3OjoKv9+PZDJptFxdXQWLMjc3J3PqwKTp8/kw/WoaBwcHkgaB9BwMBtHf3w9qqmkPDQ1hYWHhCIiRGtjY2BjGx8ext7cnwu7v76NQKIBOwuEweJjZFhcXTYTz8/Myxx8Gkct9cddSqZQM0um0iEnNNDXOsdHB7Oys2AUCAfT19SGRSIg9b42BaYihUAjcTBB17OrqwubmpqQ8NTUlIKZL3UTs9p30FkwuumqiRuyXlpakKDMzMwbEKLnZa+9WM+s6kDzaIroL7vdM5/VyK4gaEZjNZhGPx6W62dxnF8aFzsbydzavXee6SmW+Zzxfxxl5oz1+/PUw7c4IFGi8/fM/4YSkODBwBr8BtTvNaFSR0nUAAAAASUVORK5CYII=)
!important;}


.addrImg{ background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAABFklEQVQoFWNgQAIPn7/VevjwuRaSECpz4YqDO7onrt2NKgrlvXz5Xr+8cdl/N9/q/w8ePDXEUDR93q4LLb3r/4fFtv8vrJh1EUXBxWuPUyqbV/5v6lr9PyapE2zKvoOX0sCKzl6875FZOPN/et7U/7FJXf8dXQv/u/mU/7dzLf5/8OAlL4ZN2057NncsXxsS2fwlNKbtv6lV5n8L2+yv+YWT186du82T4f///xx7Dl2tW7vpRFpNw4KN6dk9m6bP2py6eOn++v///3OCrXn27J1tXfvq/7sOXslevHR3pm9I4//b95/bozj01Pm7+Vml8/4bW+f937rzdCGKJIwzY96u85UNiy7B+Bj0gwevjW7ffmqELAEAqA+Llya6MIMAAAAASUVORK5CYII=)
!important;}

.iconImg{ -webkit-background-size: contain !important;
        -moz-background-size: contain !important;
        -o-background-size: contain !important;
        background-size: contain !important;
        background-position: center;
        background-repeat: no-repeat;
        width:1em !important;
        height:1em !important;
        display:inline-block;
        vertical-align:middle;
 }


.anim {opacity:0;
overflow: hidden !important;
  animation: animationFrames linear .5s;
  animation-iteration-count: 1;
  transform-origin: 50% 50%;
  -webkit-animation: animationFrames linear .5s;
  -webkit-animation-iteration-count: 1;
  -webkit-transform-origin: 50% 50%;
  -moz-animation: animationFrames linear .5s;
  -moz-animation-iteration-count: 1;
  -moz-transform-origin: 50% 50%;
  -o-animation: animationFrames linear .5s;
  -o-animation-iteration-count: 1;
  -o-transform-origin: 50% 50%;
  -ms-animation: animationFrames linear .5s;
  -ms-animation-iteration-count: 1;
  -ms-transform-origin: 50% 50%;
translateZ(0);
-webkit-backface-visibility: hidden;
-webkit-perspective: 1000;
-moz-backface-visibility: hidden;
-moz-perspective: 1000;
-o-backface-visibility: hidden;
-o-perspective: 1000;
-ms-backface-visibility: hidden;
-ms-perspective: 1000;
backface-visibility: hidden;
perspective: 1000;


}

@keyframes animationFrames{
  0% {
    opacity:1;
    transform:  translate(0px,0px)  rotate(0deg) scaleX(1.00) scaleY(1.00) ;
 overflow: hidden;
 }
  50% {
    opacity:0.5;
    transform:  translate(-56px,-260px)  rotate(360deg) scaleX(30.00) scaleY(30.00) ;
 overflow: hidden;
 }
  100% {
    opacity:0;
    transform:  translate(-56px,-720px)  rotate(720deg) scaleX(90.00) scaleY(90.00) ;
 overflow: hidden;
 }
}

@-moz-keyframes animationFrames{
  0% {
    opacity:1;
    -moz-transform:  translate(0px,0px)  rotate(0deg) scaleX(1.00) scaleY(1.00) ;
 overflow: hidden;
 }
  50% {
    opacity:0.5;
    -moz-transform:  translate(-56px,-260px)  rotate(360deg) scaleX(30.00) scaleY(30.00) ;
 overflow: hidden;
 }
  100% {
    opacity:0;
    -moz-transform:  translate(-56px,-720px)  rotate(720deg) scaleX(90.00) scaleY(90.00) ;
 overflow: hidden;
 }
}

@-webkit-keyframes animationFrames {
  0% {
    opacity:1;
    -webkit-transform:  translate(0px,0px)  rotate(0deg) scaleX(1.00) scaleY(1.00) ;
 overflow: hidden;
 }
  50% {
    opacity:0.5;
    -webkit-transform:  translate(-56px,-260px)  rotate(360deg) scaleX(30.00) scaleY(30.00) ;
 overflow: hidden;
 }
  100% {
    opacity:0;
    -webkit-transform:  translate(-56px,-720px)  rotate(720deg) scaleX(90.00) scaleY(90.00) ;
 overflow: hidden;
 }
}

@-o-keyframes animationFrames {
  0% {
    opacity:1;
    -o-transform:  translate(0px,0px)  rotate(0deg) scaleX(1.00) scaleY(1.00) ;
 overflow: hidden;
 }
  50% {
    opacity:0.5;
    -o-transform:  translate(-56px,-260px)  rotate(360deg) scaleX(30.00) scaleY(30.00) ;
 overflow: hidden;
 }
  100% {
    opacity:0;
    -o-transform:  translate(-56px,-720px)  rotate(720deg) scaleX(90.00) scaleY(90.00) ;
 overflow: hidden;
 }
}

@-ms-keyframes animationFrames {
  0% {
    opacity:1;
    -ms-transform:  translate(0px,0px)  rotate(0deg) scaleX(1.00) scaleY(1.00) ;
 overflow: hidden;
 }
  50% {
    opacity:0.5;
    -ms-transform:  translate(-56px,-260px)  rotate(360deg) scaleX(30.00) scaleY(30.00) ;
 overflow: hidden;
 }
  100% {
    opacity:0;
    -ms-transform:  translate(-56px,-720px)  rotate(720deg) scaleX(90.00) scaleY(90.00) ;
 overflow: hidden;
 }
}



.AP_DAJS_popover.popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1060;
  display: none;
  max-width: 276px;
  padding: 1px;
  text-align: left;
  white-space: normal;
  background-color: #fff;
  -webkit-background-clip: padding-box;
          background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 6px !important;
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
          box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
}
.AP_DAJS_popover.popover.top {
  margin-top: -10px;
}
.AP_DAJS_popover.popover.right {
  margin-left: 10px;
}
.AP_DAJS_popover.popover.bottom {
  margin-top: 10px;
}
.AP_DAJS_popover.popover.left {
  margin-left: -10px;
}
.AP_DAJS_popover.popover-title {
  padding: 8px 14px;
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 18px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px 5px 0 0;
}
.AP_DAJS_popover.popover-content {
  padding: 9px 14px;
}
.AP_DAJS_popover.popover > .arrow,
.AP_DAJS_popover.popover > .arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.AP_DAJS_popover.popover > .arrow {
  border-width: 11px;
}
.AP_DAJS_popover.popover > .arrow:after {
  content: "";
  border-width: 10px;
}
.AP_DAJS_popover.popover.top > .arrow {
  bottom: -11px;
  left: 50%;
  margin-left: -11px;
  border-top-color: #999;
  border-top-color: rgba(0, 0, 0, .25);
  border-bottom-width: 0;
}
.AP_DAJS_popover.popover.top > .arrow:after {
  bottom: 1px;
  margin-left: -10px;
  content: " ";
  border-top-color: #fff;
  border-bottom-width: 0;
}
.AP_DAJS_popover.popover.right > .arrow {
  top: 50%;
  left: -11px;
  margin-top: -11px;
  border-right-color: #999;
  border-right-color: rgba(0, 0, 0, .25);
  border-left-width: 0;
}
.AP_DAJS_popover.popover.right > .arrow:after {
  bottom: -10px;
  left: 1px;
  content: " ";
  border-right-color: #fff;
  border-left-width: 0;
}
.AP_DAJS_popover.popover.bottom > .arrow {
  top: -11px;
  left: 50%;
  margin-left: -11px;
  border-top-width: 0;
  border-bottom-color: #999;
  border-bottom-color: rgba(0, 0, 0, .25);
}
.AP_DAJS_popover.popover.bottom > .arrow:after {
  top: 1px;
  margin-left: -10px;
  content: " ";
  border-top-width: 0;
  border-bottom-color: #fff;
}
.AP_DAJS_popover.popover.left > .arrow {
  top: 50%;
  right: -11px;
  margin-top: -11px;
  border-right-width: 0;
  border-left-color: #999;
  border-left-color: rgba(0, 0, 0, .25);
}
.AP_DAJS_popover.popover.left > .arrow:after {
  right: 1px;
  bottom: -10px;
  content: " ";
  border-right-width: 0;
  border-left-color: #fff;
}

` );
                 /* note: translateZ(0) supposedly iproves css anim performance by forcing creation of a separate layer. */


                 //old sirImg data:image/png;base64,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
                 initPage();

                 //All finished

                })();
} catch (e) {console.log("e is ",e);}
