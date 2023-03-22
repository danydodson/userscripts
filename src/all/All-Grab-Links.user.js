// ==UserScript==
// @name            All: Grab Links
// @version         2.02.002
// @namespace       https://github.com/danydodson/userscripts/
// @description     Lists all links from one webpage, so you can copy them easily.
// @author          notme 
// @match           https://www.youtube.com/*
// @match           https://www.pinterest.com/*
// @match           https://www.tiktok.com/*
// @match           https://www.flickr.com/*
// @match           https://www.instagram.com/*
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_addStyle
// @grant           GM.addStyle
// @grant           GM_getResourceText
// @grant           GM.getResourceText
// @homepageURL     http://github.com/danydodson/userscripts/
// @downloadURL     https://github.com/danydodson/userscripts/raw/main/src/all/All-Grab-Links.user.js
// @updateURL       https://github.com/danydodson/userscripts/raw/main/src/all/All-Grab-Links.user.js
// @source          https://github.com/danydodson/userscripts/raw/main/src/all/All-Grab-Links.user.js
// @require         https://greasyfork.org/scripts/428507-gm-base/code/GM%20Base.user.js
// @icon            https://raw.githubusercontent.com/ollily/gm-scripting/master/grab_links/resource/gl_logo.png
// ==/UserScript==

// @match http://gmonkey.*.*/test/*
// @match http://devzone.*.*/test/gm/*

/* 
  This helper script bridges compatibility between the Greasemonkey 4 APIs and
  existing/legacy APIs.  Say for example your user script includes

    // @grant GM_getValue

  And you'd like to be compatible with both Greasemonkey 3 and Greasemonkey 4
  (and for that matter all versions of Violentmonkey, Tampermonkey, and any other
  user script engine).  Add:

	  // @grant GM.getValue
	  // @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

  And switch to the new (GM-dot) APIs, which return promises.  If your script
  is running in an engine that does not provide the new asynchronous APIs, this
  helper will add them, based on the old APIs.

  If you use `await` at the top level, you'll need to wrap your script in an
  `async` function to be compatible with any user script engine besides
  Greasemonkey 4.

	  (async () => {
	    let x = await GM.getValue('x')
	  })()
*/

if (typeof GM == 'undefined') {
	this.GM = {}
}


if (typeof GM_addStyle == 'undefined') {
	this.GM_addStyle = (aCss) => {
		'use strict'
		let head = document.getElementsByTagName('head')[0]
		if (head) {
			let style = document.createElement('style')
			style.setAttribute('type', 'text/css')
			style.textContent = aCss
			head.appendChild(style)
			return style
		}
		return null
	}
}


if (typeof GM_registerMenuCommand == 'undefined') {
	this.GM_registerMenuCommand = (caption, commandFunc, accessKey) => {
		if (!document.body) {
			if (document.readyState === 'loading'
				&& document.documentElement && document.documentElement.localName === 'html') {
				new MutationObserver((mutations, observer) => {
					if (document.body) {
						observer.disconnect()
						GM_registerMenuCommand(caption, commandFunc, accessKey)
					}
				}).observe(document.documentElement, { childList: true })
			} else {
				console.error('GM_registerMenuCommand got no body.')
			}
			return
		}
		let contextMenu = document.body.getAttribute('contextmenu')
		let menu = (contextMenu ? document.querySelector('menu#' + contextMenu) : null)
		if (!menu) {
			menu = document.createElement('menu')
			menu.setAttribute('id', 'gm-registered-menu')
			menu.setAttribute('type', 'context')
			document.body.appendChild(menu)
			document.body.setAttribute('contextmenu', 'gm-registered-menu')
		}
		let menuItem = document.createElement('menuitem')
		menuItem.textContent = caption
		menuItem.addEventListener('click', commandFunc, true)
		menu.appendChild(menuItem)
	}
}


if (typeof GM_getResourceText == 'undefined') {
	this.GM_getResourceText = (aRes) => {
		'use strict'
		return GM.getResourceUrl(aRes)
			.then(url => fetch(url))
			.then(resp => resp.text())
			.catch(function (error) {
				GM.log('Request failed', error)
				return null
			})
	}
}


Object.entries({
	'log': console.log.bind(console),  // Pale Moon compatibility.  See #13.
	'info': GM_info,
}).forEach(([newKey, old]) => {
	if (old && (typeof GM[newKey] == 'undefined')) {
		GM[newKey] = old
	}
})


Object.entries({
	'GM_addStyle': 'addStyle',
	'GM_deleteValue': 'deleteValue',
	'GM_getResourceURL': 'getResourceUrl',
	'GM_getValue': 'getValue',
	'GM_listValues': 'listValues',
	'GM_notification': 'notification',
	'GM_openInTab': 'openInTab',
	'GM_registerMenuCommand': 'registerMenuCommand',
	'GM_setClipboard': 'setClipboard',
	'GM_setValue': 'setValue',
	'GM_xmlhttpRequest': 'xmlHttpRequest',
	'GM_getResourceText': 'getResourceText',
}).forEach(([oldKey, newKey]) => {
	let old = this[oldKey]
	if (old && (typeof GM[newKey] == 'undefined')) {
		GM[newKey] = function (...args) {
			return new Promise((resolve, reject) => {
				try {
					resolve(old.apply(this, args))
				} catch (e) {
					reject(e)
				}
			})
		}
	}
})

//
//GM-Script specific code - START
//

/**
 * Define the global variables used for this script.
 */
const scriptID = "GM-GL"

let glContainer
let glSearchDiv
let glResultDiv
let glActionDiv
let glFormTag
let initFilter

const glBtnShowResultText = "SR"
const glBtnShowResultTextDesc = "show result"
const glBtnHideResultText = "HR"
const glBtnHideResultTextDesc = "hide result"

const glContainerHeightMin = "20px"
const glContainerHeightMax = "99%"
const glContainerHeightMaxAuto = "auto"
const RESULT_SHOW = -1
const RESULT_HIDE = -2

const glBtnSearchModeAText = "D"
const glBtnSearchModeADesc = "search in link & description"
const glBtnSearchModeAValue = "1"
const glBtnSearchModeLText = "L"
const glBtnSearchModeLDesc = "search in link ONLY"
const glBtnSearchModeLValue = "0"

const contWidthWide = "50%"
const contWidthSmall = "225px"
const resWidthWide = "100%"
const resWidthSmall = "225px"
const divWidthWide = "99%"
const divWidthSmall = "225px"
const descWidthWide = "Wide"
const descWidthSmall = "Small"

const searchText_Desc = "enter your search\nSimple Wildcards = (?, *)\nRegular Expression = /searchtext/"

/**
 * Add the DOM-Objects used in this script.
 */
function lgmAddControlsGrabLinks() {
	gmAddClipboardSupport()
	// base layout
	glContainer = gmCreateObj(null, "div", "gl-container")
	glSearchDiv = gmCreateObj(glContainer, "div", "gl-searchbox")
	glActionDiv = gmCreateObj(glContainer, "div", "gl-actionbox")
	glResultDiv = gmCreateObj(glContainer, "div", "gl-resultbox")
	glFormTag = gmCreateObj(glSearchDiv, "form", "gl-searchform")
	gmSetAtI(glFormTag, "accept-charset", "utf-8")
	// search fields
	initFilter = gmFoundFilter(currSite, currPath)
	gmCreateInput(glFormTag, "text", "gl-searchtext", initFilter, searchText_Desc, null, null, function () {
		return gmSelectInput(this)
	})
	gmCreateButton(glFormTag, "submit", "gl-sstart", "S", "start search", null, function () {
		return lgmSearchLinks("gl-searchtext", "gl-sdesc")
	})
	gmCreateButton(glFormTag, "button", "gl-sreset", "R", "clear search", null, function () {
		return lgmResetSearch("gl-searchtext")
	})
	gmCreateButton(glFormTag, "button", "gl-sshow", glBtnShowResultText, glBtnShowResultTextDesc, null, function () {
		return lgmShowHideResult()
	})
	gmCreateButton(glFormTag, "button", "gl-sdesc", glBtnSearchModeAText, glBtnSearchModeADesc, glBtnSearchModeAValue, function () {
		return lgmToggleSearchDesc("gl-sdesc")
	})
	gmCreateInput(glFormTag, "text", "gl-scount", "", "number of hits", 1, null, null, null)
	// copy fields
	let selCap = "SA"
	let selTit = "De-/Select All"
	if (gmIsClipboardSupported()) {
		selCap = "CA"
		selTit = "Select & Copy All"
	}
	gmCreateButton(glActionDiv, "button", "gl-aselect", selCap, selTit, null, function () {
		return lgmSelectall("gl-resultplain", "gl-resultlink")
	})
	gmCreateButton(glActionDiv, "button", "gl-ashowplain", "PR", "Show Plain Results", null, function () {
		lgmSwitchResultDisplay("gl-resultplain", "gl-resultlink")
	})
	gmCreateButton(glActionDiv, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function () {
		lgmSwitchResultDisplay("gl-resultlink", "gl-resultplain")
	})
	gmCreateButton(glActionDiv, "button", "gl-awide", "W", descWidthWide, null, function () {
		lgmToggleContainer("gl-container", "gl-resultbox", "gl-resultplain", "gl-resultlink", "gl-awide")
	})
	// result fields
	gmCreateObj(glResultDiv, "div", "gl-resultplain")
	gmCreateObj(glResultDiv, "div", "gl-resultlink")
	// init
	gmAddObj(glContainer, gmGetBody())
	lgmShowHideResult(RESULT_HIDE)
	//alert(glFormTag.outerHTML);
}

/**
 * Shows the layer in param frontLayer and hides the layer in param behindLayer.
 *
 * @param {string|HTMLDivElement} frontLayer  the layer to put in front
 * @param {string|HTMLDivElement} behindLayer the layer to put in the bakc
 */
function lgmSwitchResultDisplay(frontLayer, behindLayer) {
	const oFrontLayer = gmGetStyle(frontLayer)
	const oBehindLayer = gmGetStyle(behindLayer)
	if (oFrontLayer && oBehindLayer) {
		let idxFront = gmGetAtI(oFrontLayer, "index")
		let idxBehind = gmGetAtI(oBehindLayer, "index")

		if (!idxFront || isNaN(idxFront) || idxFront === "") {
			idxFront = 910
		}
		if (!idxBehind || isNaN(idxBehind) || idxBehind === "") {
			idxBehind = idxFront - 1
		}
		if (idxFront < idxBehind) {
			const i = idxFront
			idxFront = idxBehind
			idxBehind = i
		}
		gmSetAtI(oFrontLayer, "index", idxFront)
		gmSetAtI(oFrontLayer, "visibility", "visible")
		gmSetAtI(oFrontLayer, "left", 0)
		gmSetAtI(oBehindLayer, "index", idxBehind)
		gmSetAtI(oBehindLayer, "visibility", "hidden")
		gmSetAtI(oBehindLayer, "left", 2000)
	}
}

/**
 * Switch the search mode.
 *
 * @param {string|HTMLButtonElement} btnSearch - the button to read the current state from
 */
function lgmToggleSearchDesc(btnSearch) {
	const oBtnSearch = gmGetElI(btnSearch)
	if (oBtnSearch) {
		const curValue = gmGetAtI(oBtnSearch, "value")
		if (curValue === glBtnSearchModeLValue) {
			gmSetCoI(oBtnSearch, glBtnSearchModeAText)
			gmSetAtI(oBtnSearch, "value", glBtnSearchModeAValue)
			gmSetAtI(oBtnSearch, "title", glBtnSearchModeADesc)
		} else {
			gmSetCoI(oBtnSearch, glBtnSearchModeLText)
			gmSetAtI(oBtnSearch, "value", glBtnSearchModeLValue)
			gmSetAtI(oBtnSearch, "title", glBtnSearchModeLDesc)
		}
	}
}

/**
 *
 * @param {string|HTMLDivElement} contDiv
 * @param {string|HTMLDivElement} resultDiv
 * @param {string|HTMLDivElement} resultPlainDiv
 * @param {string|HTMLDivElement} resultLinkDiv
 * @param {string|HTMLButtonElement} btnAction
 */
function lgmToggleContainer(contDiv, resultDiv, resultPlainDiv, resultLinkDiv, btnAction) {
	const oContDiv = gmGetElI(contDiv)
	const oResultDiv = gmGetElI(resultDiv)
	const oBtnAction = gmGetElI(btnAction)
	if (oContDiv && oResultDiv) {
		const oContDivStyle = gmGetStyle(oContDiv)
		const oResultDivStyle = gmGetStyle(oResultDiv)
		const oResultPlainDivStyle = gmGetStyle(resultPlainDiv)
		const oResultLinkDivStyle = gmGetStyle(resultLinkDiv)
		let newContWidth = contWidthWide
		let newResultWidth = resWidthWide
		let newResultDivWidth = divWidthWide
		let newDescWidth = descWidthSmall
		let newBtnActionText = "S"
		const curValue = gmGetAtI(oContDivStyle, "width")
		if (curValue === contWidthWide) {
			newContWidth = contWidthSmall
			newResultWidth = resWidthSmall
			newResultDivWidth = divWidthSmall
			newDescWidth = descWidthWide
			newBtnActionText = "W"
		}
		gmSetAtI(oContDivStyle, "width", newContWidth)
		gmSetAtI(oContDivStyle, "max-width", newContWidth)
		gmSetAtI(oResultDivStyle, "width", newResultWidth)
		gmSetAtI(oResultDivStyle, "max-width", newResultWidth)
		gmSetAtI(oResultPlainDivStyle, "width", newResultDivWidth)
		gmSetAtI(oResultPlainDivStyle, "max-width", newResultDivWidth)
		gmSetAtI(oResultLinkDivStyle, "width", newResultDivWidth)
		gmSetAtI(oResultLinkDivStyle, "max-width", newResultDivWidth)
		if (oBtnAction) {
			gmSetCoI(oBtnAction, newBtnActionText)
			gmSetAtI(oBtnAction, "title", newDescWidth)
		}
	}
}

/**
 * Shows the complete layer with a default size or special size.
 *
 * @param {boolean|number} [bOnOff=] bOnOff - a numeric height, on, off or null
 * @returns {boolean} always false
 *
 * @see #RESULT_HIDE
 * @see #RESULT_HIDE
 * @see #glContainerHeightMin
 * @see #glContainerHeightMax
 * @see #glContainerHeightMaxAuto
 */
function lgmShowHideResult(bOnOff) {
	const oCont = gmGetElI("gl-container")
	const oContStyle = gmGetStyle(oCont)
	const oCont1 = gmGetElI("gl-resultbox")
	const oContStyle1 = gmGetStyle(oCont1)
	const oBtnShow = gmGetElI("gl-sshow")
	const oSearchCount = gmGetElI("gl-scount")
	let currHeight
	if (bOnOff) {
		currHeight = bOnOff
	} else {
		currHeight = parseFloat(gmGetAtI(oContStyle, "height"))
	}
	if (currHeight === RESULT_SHOW || currHeight === parseFloat(glContainerHeightMin)) {
		// if container should be shown or currently is at min size
		currHeight = glContainerHeightMax
		const searchCnt = gmGetAtI(oSearchCount, "value")
		//alert(searchCnt);
		if (isNaN(searchCnt)) {
			currHeight = glContainerHeightMaxAuto
		}
	} else {
		currHeight = glContainerHeightMin
	}
	let buttonText = glBtnShowResultText
	let buttonTextDesc = glBtnShowResultTextDesc
	if (currHeight !== glContainerHeightMin) {
		buttonText = glBtnHideResultText
		buttonTextDesc = glBtnHideResultTextDesc
	}
	gmSetAtI(oContStyle, "height", currHeight)
	gmSetAtI(oContStyle1, "height", currHeight)
	gmSetCoI(oBtnShow, buttonText)
	gmSetAtI(oBtnShow, "title", buttonTextDesc)
	return false
}

/**
 * Clears any filter text and searchs again.
 *
 * @param {string|HTMLInputElement} searchField - the search input containing the text-filter
 * @returns {boolean} always false
 */
function lgmResetSearch(searchField) {
	const oSearchField = gmGetElI(searchField)
	if (oSearchField) {
		gmSetAtI(oSearchField, "value", "")
		lgmSearchLinks(oSearchField)
		oSearchField.focus()
	}
	return false
}

/**
 * Selects the content of element A or B.
 *
 * @param {string|HTMLElement} selElementA - the first container element
 * @param {string|HTMLElement} selElementB - the second container element
 * @returns {boolean} always false
 */
function lgmSelectall(selElementA, selElementB) {
	let selectedElem = null
	const oSelElemA = gmGetElI(selElementA)
	const oSelElemAStyle = gmGetStyle(oSelElemA)
	if (oSelElemA != null && gmGetAtI(oSelElemAStyle, "visibility") === "visible") {
		selectedElem = oSelElemA
	} else {
		const oSelElemB = gmGetElI(selElementB)
		const oSelElemBStyle = gmGetStyle(oSelElemB)
		if (oSelElemB != null && gmGetAtI(oSelElemBStyle, "visibility") === "visible") {
			selectedElem = oSelElemB
		}
	}
	if (selectedElem != null) {
		let bForce = false
		if (gmIsClipboardSupported()) {
			bForce = true
		}
		const selText = gmSelectText(selectedElem, bForce)
		if (selText) {
			try {
				if (unsafeWindow) {
					unsafeWindow.copyPostToClipboard(selText)
				}
			} catch (ignored) {
				// ignored
			}
		}
	}
	return false
}

/**
 * Search for all matching URLs and shows them the result.
 *
 * @param {string|HTMLInputElement} searchFieldAttr - the search input containing the text-filter
 * @param {string|HTMLInputElement} [searchModeAttr=] searchModeAttr - the searchMode input
 * @returns {boolean} always false
 */
function lgmSearchLinks(searchFieldAttr, searchModeAttr) {
	try {
		const searchText = gmGetAtI(searchFieldAttr, "value")
		const searchMode = gmGetAtI(searchModeAttr, "value")
		const arrFoundInPage = gmFindLinksInPage(searchText, searchMode)
		lgmLinksInResult(arrFoundInPage)
		lgmSwitchResultDisplay("gl-resultplain", "gl-resultlink")
		lgmShowHideResult(RESULT_SHOW)
	} catch (ex) {
		alert(ex)
	}
	return false
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 *
 * @param {PagelinksClazz[]} arrLinks - array with found links
 * @returns {boolean} always false
 */
function lgmLinksInResult(arrLinks) {
	const arrLinksPlain = []
	let arrLinksLink = []
	try {
		const oResultPlainDiv = gmGetElI("gl-resultplain")
		const oResultLinkDiv = gmGetElI("gl-resultlink")
		const oResultCount = gmGetElI("gl-scount")
		const arrFoundInPage = gmSortArray(arrLinks)
		for (let i = 0; i < arrFoundInPage.length; i++) {
			const currLink = arrFoundInPage[i].link
			const currCaption = lgmCleanArrayCaption(arrFoundInPage[i].linkText)
			//alert(currCaption);
			arrLinksPlain.push(lgmPrepareLinkAsPlain(currLink, currCaption, i))
			arrLinksLink.push(lgmPrepareLinkAsLink(currLink, currCaption, i))
		}
		if (oResultCount) {
			gmSetAtI(oResultCount, "value", arrFoundInPage.length)
		}
		if (oResultPlainDiv) {
			lgmPrepareLinksInContainer(oResultPlainDiv, arrLinksPlain)
			gmCreateObj(oResultPlainDiv, "br", null)
		}
		if (oResultLinkDiv) {
			arrLinksLink = gmSortObject(arrLinksLink, "data-title")
			lgmPrepareLinksInContainer(oResultLinkDiv, arrLinksLink)
			gmCreateObj(oResultLinkDiv, "br", null)
		}
	} catch (ex) {
		alert(ex)
	}
	return false
}

/**
 * Removes unallowed chars from a text.
 *
 * @param {string} dirtyCaption - a text with unallowed chars
 * @returns {string} the cleaned text
 */
function lgmCleanCaption(dirtyCaption) {
	dirtyCaption = trim(dirtyCaption)
	if (dirtyCaption != null) {
		dirtyCaption = dirtyCaption.replace(/[\n\r]/g, "")
		if (dirtyCaption.indexOf("<") >= 0) {
			dirtyCaption = dirtyCaption.replace(/<(?:.|\n)*?>/gm, "").replace(/\s{2,}/gm, " ")
		}
	}
	return dirtyCaption
}

/**
 * Removes unallowed chars from an array or a single text.
 *
 * @param {string|string[]} arrCaption - an array or a text with unallowed chars
 * @returns {string} the cleaned array or text
 */
function lgmCleanArrayCaption(arrCaption) {
	let cleanCaption
	if (gmIsArray(arrCaption)) {
		let arrCleanCaption = []
		for (let currElem of arrCaption) {
			arrCleanCaption.push(lgmCleanCaption(currElem))
		}
		arrCleanCaption = gmOnlyUnique(arrCleanCaption)
		arrCleanCaption = gmSortArray(arrCleanCaption, SORT_NUM)
		cleanCaption = "[" + arrCleanCaption.join("][") + "]"
	} else {
		cleanCaption = lgmCleanCaption(arrCaption)
	}
	return cleanCaption
}

/**
 * Creates a span element containing an url as plain text.
 *
 * @param {string} currLink    - the url
 * @param {string} currCaption - the text for the url
 * @param {number} curId       - the id for the span
 * @returns {HTMLSpanElement} the newly span element
 */
function lgmPrepareLinkAsPlain(currLink, currCaption, curId) {
	// row for plain text
	const curPId = scriptID + "P" + curId
	let plainLink = gmCreateObj(null, "span", curPId)
	gmSetAtI(plainLink, "data-href", currLink)
	plainLink = gmCreateObjCommon(plainLink, currLink, currCaption, null,
		function () {
			lgmSelectEntry(this)
			return false
		},
		null, null, null,
		function () {
			gmOpenInTab(this["data-href"])
			return true
		}
	)
	return plainLink
}

/**
 * Creates a a element containing an url as plain text.
 *
 * @param {string} currLink    - the url
 * @param {string} currCaption - the text for the url
 * @param {number} curId       - the id for the span
 * @return {HTMLAnchorElement} the newly a element
 */
function lgmPrepareLinkAsLink(currLink, currCaption, curId) {
	// row for htmllink
	const curLId = scriptID + "L" + curId
	const plainCaption = "[" + currLink + "]"
	const alink = gmCreateLink(null, curLId, currLink, currCaption, plainCaption, "_blank",
		function () {
			lgmSelectEntry(this)
			return false
		},
		function () {
			gmOpenInTab(this.href)
			return true
		}
	)
	gmSetAtI(alink, "data-title", currCaption)
	gmSetAtI(alink, FL_TAG, FL_ID)
	return alink
}

/**
 * Fills the container element with the result object.
 *
 * @param {string|HTMLDivElement} oResultLinkDiv - the container element
 * @param {HTMLAnchorElement[]} arrLinksLink - array with the result objects
 */
function lgmPrepareLinksInContainer(oResultLinkDiv, arrLinksLink) {
	gmEmptyObj(oResultLinkDiv)
	for (let idxLinks = 0; idxLinks < arrLinksLink.length; idxLinks++) {
		gmAddObj(arrLinksLink[idxLinks], oResultLinkDiv)
		gmCreateObj(oResultLinkDiv, "br", null)
	}
}

/**
 * Select a result entry.
 *
 * @param {HTMLElement} oEntry - a page element
 */
function lgmSelectEntry(oEntry) {
	try {
		gmSelectText(oEntry, false)
	} catch (ex) {
		alert(ex)
	}
}
const MAIN_FONT_TYPE = "Consolas" //"Arial, Courier New";
const MAIN_FONT_SIZE = "10pt !important"
const MAIN_CLR_TEXT = "#000000"
const MAIN_CLR_BG = "#e0e0e0" //"#CED8F6";
const MAIN_FORMS_CLR_BORDER = "#808080" //"#819FF7";
const MAIN_FORMS_CLR_TEXT = MAIN_CLR_TEXT
const MAIN_FORMS_CLR_BG = "#ffffff"
const MAIN_FORMS_HEIGHT = "20px !important"
const MAIN_FORMS_LINE_HEIGHT = "15px"
const HOVER1_CLR_TEXT = "#e0e0e0"
const HOVER1_CLR_BG = "#a80000"
const HOVER2_CLR_TEXT = "#ffffff"
const HOVER2_CLR_BG = "#a80000"
const FOCUS_CLR_BG = "#ffffcc"
const SCROLLBAR_CLR_RULER = "#a00000" //"#e0e0e0";
const SCROLLBAR_CLR_BG = MAIN_FORMS_CLR_BORDER

const CSS_STYLE = `
#gl-container
{
    -moz-text-size-adjust: none;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: ` + MAIN_CLR_BG + `;
    background-image: none;
    background-origin: padding-box;
    background-position: 0%;
    background-repeat: repeat;
    background-size: auto;
    color: ` + MAIN_CLR_TEXT + `;
    display: block;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    line-height: 15px;
    max-height: 99%;
    max-width: 50%;
    margin: 0;
    min-height: 1%;
    min-width: 225px;
    padding: 0 2px;
    overflow: hidden;
    position: fixed !important;
    right: 1px !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    text-align: left;
    top: 0 !important;
    vertical-align: top;
    width: 225px;
    white-space: nowrap;
    z-index: 2147483647;
}
/* General Styles */
#gl-container, #gl-container input, #gl-container button, #gl-container div, #gl-container a:hover
{
    -moz-border-radius: 5px;
    border: 0 none ` + MAIN_FORMS_CLR_BORDER + `;
    border-image-outset: 0;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 0;
    border-radius: 5px;
}
#gl-container input, #gl-container button
{
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: 2px solid ` + MAIN_FORMS_CLR_BORDER + `;
    box-sizing: border-box;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    font-weight: bold;
    height: ` + MAIN_FORMS_HEIGHT + `;
    line-height: ` + MAIN_FORMS_LINE_HEIGHT + `;
    margin: 0;
    margin-right: 1px;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0;
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
}
#gl-container button
{
    padding: 0 3px;
}
#gl-container input:hover, #gl-container input:focus
{
    background-color: ` + FOCUS_CLR_BG + `;
}
#gl-container button:hover, #gl-container button:focus
{
    border-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
}
#gl-container a
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    text-decoration: underline dotted ` + MAIN_FORMS_CLR_TEXT + `;
    white-space: nowrap;
}
#gl-container a:hover
{
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
    text-decoration: none transparent;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox, #gl-container #gl-resultbox
{
    border: transparent none 0;
    display: block;
    left: 0 !important;
    margin: 0;
    padding: 0;
    position: relative !important;
    top: 0 !important;
    white-space: nowrap;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
}
/* Search Box */
#gl-container #gl-searchform input
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0 3px;
    text-align: left;
}
#gl-container #gl-searchform #gl-searchtext
{
    max-width: 115px;
    min-width: 50px;
}
#gl-container #gl-searchbox #gl-scount
{
    background-color: ` + MAIN_CLR_BG + `;
    font-size: smaller !important;
    max-width: 28px;
    min-width: 5px;
    text-align: center;
}
/* Action Box */
#gl-container #gl-actionbox #gl-awide
{
    margin-left: 6px;
}
/* Result Box */
#gl-container #gl-resultbox
{
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    overflow: auto;
    width: 225px;
}
#gl-container #gl-resultbox #gl-resultplain, #gl-container #gl-resultbox #gl-resultlink
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: transparent none 0;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    display: block;
    left: 0 !important;
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    height: 96%;
    overflow-y: auto;
    overflow-x: auto;
    padding: 2px;
    position: absolute !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    top: 1px !important;
    width: 225px;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain
{
    visibility: visible;
    z-index: 910;
}
#gl-container #gl-resultbox #gl-resultlink
{
    visibility:hidden;
    z-index: 909;
}
#gl-container #gl-resultbox table, #gl-container #gl-resultbox tr, #gl-container #gl-resultbox td, #gl-container #gl-resultbox span
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    margin: 0;
    padding: 0;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain td, #gl-container #gl-resultbox #gl-resultplain span
{
    font-size: 9pt;
    line-height: 10pt;
}
#gl-container #gl-resultbox #gl-resultplain td:hover, #gl-container #gl-resultbox #gl-resultplain span:hover
{
    background-color: ` + HOVER2_CLR_BG + `;
    color: ` + HOVER2_CLR_TEXT + `;
}
#gl-container #gl-resultbox #gl-resultlink a
{
    font-size: 10pt;
    line-height:11pt;
}
`

//
//GM-Script specific code - END
//

// noinspection JSUnusedGlobalSymbols

/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
	gmAddSite("watch?", "(|.+?\.)youtube\..+?", ".*")
	gmAddSite("watch", "(|.+?\.)myvideo\..+?", ".*")
	gmAddSite("video", "(|.+?\.)dailymotion\..+?", ".*")
	gmAddSite("watch", "(|.+?\.)metacafe\..+?", ".*")
	gmAddSite("10", "devzone\\..+?\\.(net|eu)", "/test/gmonkey/.*")
}

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 *
 * @return {boolean} always true
 */
function lgm_addStyles() {
	GM_addStyle(CSS_STYLE)
	return true
}

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
	lgmAddControlsGrabLinks()
}

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 *
 * @return {boolean} always true
 */
function lgm_addInitAction() {
	return true
}

gmInitEventHandler()

//
//GM-Script - END
//

