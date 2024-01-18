// ==UserScript==
// @name         Tiktok: Video Controls
// @version      3.0
// @author       VoidCrab
// @description  Web player controls and volume reduction to 15%
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @match      *tiktok.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/469070
// ==/UserScript==

// set the desired player volume here
// to disable this feature, set it to -1
const playerVolume = 0.15;


// Taken from https://gist.github.com/BrockA/2625891 and altered to not use jquery
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/

function waitForKeyElements (
selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") {
        targetNodes = document.querySelectorAll(selectorTxt);
    }
    else {
        targetNodes = document.querySelectorAll(iframeSelector).contents()
            .find(selectorTxt);
    }

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach ( (tNode) => {
            console.log("node", tNode);
            var alreadyFound = tNode.alreadyFound || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (tNode);
                if (cancelFound) {
                    btargetsFound = false;
                }
                else {
                    tNode.alreadyFound = true;
                }
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements ( selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

// wait until page loaded
waitForKeyElements ("video", addControlsToVideo);

function addControlsToVideo (player) {
    // var player = jNode.querySelector("video");
    player.setAttribute("controls", "");
    player.setAttribute("z-index", 1000);
    player.style.zIndex = 1000;
    if (playerVolume != -1) {
        player.volume = playerVolume;
    }
}



/*

part of the code to detect big video player that appears once you click a tiktok
example page: https://www.tiktok.com/music/Go-Bananas-6758968635772897281?language=en&lang=en

after altering code, not longer necessary

*/


const observeBigPlayer = (feed) => {
    //const feed = document.querySelector(".tt-feed");
    if (!feed) { return; }
    console.log(feed)

    new MutationObserver(() => {
        let big_player = feed.querySelector(".video-card-big.browse-mode").querySelector("video");
        actionFunction(big_player);
    }).observe(feed, { childList: true });
}

// after altering code, no longer necessary
// waitForKeyElements(".tt-feed", observeBigPlayer)
