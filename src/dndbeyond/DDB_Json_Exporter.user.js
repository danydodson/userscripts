// ==UserScript==
// @name        DDB json Exporter
// @license     GNU GPLv3
// @namespace   Violentmonkey Scripts
// @match       https://www.dndbeyond.com/characters*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant       GM_addStyle
// @grant       GM_download
// @version     1.1
// @author      buhbbl
// @description Export your character sheets into JSON.
// @downloadURL https://update.greasyfork.org/scripts/458178/dndbeyond-json-exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/458178/dndbeyond-json-exporter.meta.js
// ==/UserScript==

const API_URL = 'https://character-service.dndbeyond.com/character/v5/character/';

// =========== All Characters Page =============
// div config
const DDB_CHARACTER_LISTING = 'ddb-characters-listing';
const CHARACTER_CARDS_CLASS = 'ddb-campaigns-character-card-footer-links';

// "a"/link config
const LINK_TEXT = 'Export';

// ============= Character Sheet ===============
// div config
const CHARACTER_SHEET_CLASS = 'ddbc-character-tidbits__menu-callout';

// button config
const SMALL_BUTTON_CLASS = 'character-button-small';
const MEDIUM_BUTTON_CLASS = 'character-button-medium';
const CLASSES_TO_REMOVE = ["character-button", "ddbc-button"];
const BUTTON_CSS = "margin-left: 5px;"

// span config
const BUTTON_CONTENT_SPAN_CLASS = 'ct-button__content';
const EXPORT_BUTTON_TEXT = 'Export to JSON';
const SPAN_CSS = "color: #fff;"

waitForKeyElements(`div.${CHARACTER_SHEET_CLASS},div.${DDB_CHARACTER_LISTING}`, Main);

function Main () {
  if (IsCharacterCardPage()) {
    CreateCardExportButtons();
    return
  }

  if (IsCharacterSheet()) {
    EnlargeSheetManageButton();
    CreateSheetExportButton();
    return
  }

  console.error("export-character-json: Can't find any element.");
}

function IsCharacterCardPage () {
  return (document.getElementsByClassName(CHARACTER_CARDS_CLASS)[0] != null);
}

function IsCharacterSheet () {
  return (document.getElementsByClassName(CHARACTER_SHEET_CLASS)[0] != null);
}

function DownloadOnClick () {
  GM_download(API_URL + this.characterID, this.characterID + '.json')
}

function AppendExportButton (character_card) {
  let characterID = character_card.children[0].href.split("/")[4];

  let link = document.createElement("a");
  link.classList = character_card.firstElementChild.classList;
  link.innerHTML = LINK_TEXT;
  link.href = "javascript:;";
  link.onclick = DownloadOnClick;
  link.characterID = characterID;

  character_card.insertBefore(link, character_card.children[2]);
  return true;
}

function CreateCardExportButtons () {
  let containers = document.getElementsByClassName(CHARACTER_CARDS_CLASS);

  for (let container of containers) {
    AppendExportButton(container);
  }

  return true;
}

function EnlargeSheetManageButton () {
  let container = document.getElementsByClassName(CHARACTER_SHEET_CLASS)[0];
  container.firstElementChild.classList.replace("character-button-small", "character-button-medium");
  return true;
}

function CreateSheetExportButton () {
  let characterID = window.location.pathname.split("/")[2];

  let container = document.getElementsByClassName(CHARACTER_SHEET_CLASS)[0];

  let btn = document.createElement("button");
  btn.classList = container.firstElementChild.classList;
  btn.onclick = DownloadOnClick;
  btn.characterID = characterID;
  btn.style.cssText = BUTTON_CSS;

  CLASSES_TO_REMOVE.forEach(element => {btn.classList.remove(element)});

  let span = document.createElement("span");
  span.classList = [BUTTON_CONTENT_SPAN_CLASS];
  span.innerHTML = EXPORT_BUTTON_TEXT;

  btn.appendChild(span);
  container.appendChild(btn);
  return true;
}

// Author: BrockA (https://github.com/BrockA)
// Source: https://gist.github.com/BrockA/2625891
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
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
    waitForKeyElements.controlObj   = controlObj;
}
