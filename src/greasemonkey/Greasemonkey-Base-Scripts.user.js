// ==UserScript==
// @name            Greasemonkey: Base Scripts
// @description     General Library for Greasemonkey Scripts
// @author          ollily2907
// @license         Apache License, Version 2.0
// @namespace       https://github.com/danydodson/userscripts
// @downloadURL     https://github.com/danydodson/userscripts/blob/main/src/greasemonkey/Greasemonkey-Base-Scripts.user.js
// @updateURL       https://github.com/danydodson/userscripts/blob/main/src/greasemonkey/Greasemonkey-Base-Scripts.user.js
// @icon            https://wiki.greasespot.net/favicon.ico
// @run-at          document-end
// @version         0.52.001
// @include         http://gmonkey.*.*/test/6/*
// @include         http://devzone.*.*/test/gm/*
// ==/UserScript==

// @--namespace     https://github.com/ollily
// @--supportURL    https://ollily.github.io/gm-common/
// @--source        https://raw.githubusercontent.com/ollily/gm-common/master/gm_base/gm_base.user.js

//
//GM-Script specific code - START
//

// ---------------
// base-core.js - START
// ---------------
// noinspection JSUnusedGlobalSymbols

const CURR_HOST = document.location.host
let CURR_PORT = document.location.port

/**
 * The URL we are currently running on.
 */
let currSite = CURR_HOST
if (document.location.port) {
	CURR_PORT = ":" + document.location.port
	if (currSite.search(CURR_PORT) === -1) {
		currSite += ":" + document.location.port
	}
}

const currPath = document.location.href.substring(document.location.href.indexOf(currSite) + currSite.length)
const bTestMode = false
const INIT_ONLOAD = true

// - General DHTML-Lib - Start
// - modified & extended dhtml.js from selfhtml.de

let DHTML = false, DOM = false, MSIE4 = false, NS4 = false, OP = false

const SHORT_ID = "id"
const ATTR_SEP = ";"

if (document.getElementById) {
	DHTML = true
	DOM = true
} else {
	if (document.all) {
		DHTML = true
		MSIE4 = true
	} else {
		if (document.layers) {
			DHTML = true
			NS4 = true
		}
	}
}
if (window.opera) {
	OP = true
}

/**
 * Shorthand, tries to find one element represented by the identifier in the
 * page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @returns {Object} the found object or null
 */
function gmGetElI(identifier) {
	return gmGetEl(SHORT_ID, identifier, null)
}

/**
 * Tries to find one element represented by the identifier in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @returns {Object} the found object or null
 */
function gmGetEl(mode, identifier, elementNumber) {
	let element, elementList
	if (gmIsObject(identifier)) {
		return identifier
	}
	if (!elementNumber) {
		elementNumber = 0
	}
	if (!gmIsInstanceOf(mode, String)) {
		if (mode != null) {
			alert(mode.id + " " + identifier.constructor)
		} else {
			alert(null)
		}
		return null
	}
	if (DOM) {
		if (mode.toLowerCase() === "id") {
			element = document.getElementById(identifier)
			return element
		}
		if (mode.toLowerCase() === "name") {
			elementList = document.getElementsByName(identifier)
			element = elementList[elementNumber]
			if (!element || element === "undefined") {
				element = null
			}
			return element
		}
		if (mode.toLowerCase() === "tagname") {
			elementList = document.getElementsByTagName(identifier)
			element = elementList[elementNumber]
			return element
		}
		return null
	}
	if (MSIE4) {
		if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
			element = document.all(identifier)
			return element
		}
		if (mode.toLowerCase() === "tagname") {
			elementList = document.all.tags(identifier)
			element = elementList[elementNumber]
			return element
		}
		return null
	}
	if (NS4) {
		if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
			element = document[identifier]
			if (!element) {
				element = document.anchors[identifier]
			}
			return element
		}
		if (mode.toLowerCase() === "layerindex") {
			element = document.layers[identifier]
			return element
		}
		return null
	}
	return null
}

/**
 * Tries to find all elements represented by the identifier in the page.
 *
 * @param mode
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier
 *            the key (id, name, tagname) of the element
 * @returns {Object} returns the found content as array or null
 */
function gmGetElList(mode, identifier) {
	if (gmIsObject(identifier)) {
		return identifier
	}
	if (identifier == null) {
		return null
	}
	if (DOM) {
		if (mode.toLowerCase() === "name") {
			return document.getElementsByName(identifier)
		}
		if (mode.toLowerCase() === "tagname") {
			return document.getElementsByTagName(identifier)
		}
		return null
	}
	if (MSIE4) {
		if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
			return document.all(identifier)
		}
		if (mode.toLowerCase() === "tagname") {
			return document.all.tags(identifier)
		}
		return null
	}
	if (NS4) {
		return gmGetEl(mode, identifier)
	}
	return null
}

/**
 * Shorthand, tries to find an attribute of an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param attributeName -
 *            the name of the attribute
 * @returns {Object} returns the found attribute or false
 */
function gmGetAtI(identifier, attributeName) {
	return gmGetAt(SHORT_ID, identifier, null, attributeName)
}

/**
 * Tries to find an attribute of an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @param attributeName -
 *            the name of the attribute
 * @returns {Object} returns the found attribute or null
 */
function gmGetAt(mode, identifier, elementNumber, attributeName) {
	let attribute = null
	const element = gmGetEl(mode, identifier, elementNumber)
	if (element) {
		if (DOM || MSIE4) {
			try {
				attribute = element[attributeName]
			} catch (e) {
				try {
					attribute = element.getAttribute(attributeName)
				} catch (e2) {
					// ignored
				}
			}
		}
		if (NS4) {
			attribute = element[attributeName]
			if (!attribute) {
				attribute = null
			}
		}
	}
	return attribute
}

/**
 * Shorthand, tries to find the content of an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @returns {Object} returns the found content or null
 */
function gmGetCoI(identifier) {
	return gmGetCo(SHORT_ID, identifier, null)
}

/**
 * Tries to find the content of an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @returns {Object} returns the found content or null
 */
function gmGetCo(mode, identifier, elementNumber) {
	let content = null
	const element = gmGetEl(mode, identifier, elementNumber)
	if (element) {
		if (DOM && element.firstChild) {
			if (element.firstChild.nodeType === 3) {
				content = element.firstChild.nodeValue
			} else {
				content = ""
			}
			return content
		}
		if (MSIE4) {
			content = element.innerText
			return content
		}
	}
	return content
}

/**
 * Shorthand, tries to set the new content to an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param text -
 *            the new text to set to the element
 * @returns {Boolean} TRUE=if set was successfull, else FALSE
 */
function gmSetCoI(identifier, text) {
	return gmSetCo(SHORT_ID, identifier, null, text)
}

/**
 * Tries to set the new content to an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @param text -
 *            the new text to set to the element
 * @returns {Boolean} TRUE=if set was successfull, else FALSE
 */
function gmSetCo(mode, identifier, elementNumber, text) {
	const element = gmGetEl(mode, identifier, elementNumber)
	if (element) {
		if (DOM) {
			if (!element.firstChild) {
				element.appendChild(document.createTextNode(""))
			}
			element.firstChild.nodeValue = text
			return true
		}
		if (MSIE4) {
			element.innerText = text
			return true
		}
		if (NS4) {
			element.document.open()
			element.document.write(text)
			element.document.close()
			return true
		}
	}
	return false
}

// - General DHTML-Lib - End

/**
 * Shorthand: Sets a new value for an attribute to an element, any existing
 * attribute value is replaced.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmSetAtI(identifier, attributeName, attributeValue) {
	return gmSetAt(SHORT_ID, identifier, null, attributeName, attributeValue)
}

/**
 * Sets a new value for an attribute to an element, any existing attribute value
 * is replaced.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmSetAt(mode, identifier, elementNumber, attributeName, attributeValue) {
	//var attribute;
	const element = gmGetEl(mode, identifier, elementNumber)
	if (element) {
		if (DOM || MSIE4) {
			try {
				element[attributeName] = attributeValue
			} catch (e) {
				try {
					element.setAttribute(attributeName, attributeValue)
				} catch (e2) {
					// ignored
				}
			}
			return true
			// return gmGetAt(mode, identifier, elementNumber, attributeName);
		}
		if (NS4) {
			element[attributeName] = attributeValue
			return true
			// return gmGetAt(mode, identifier, elementNumber, attributeName);
		}
	}
	return false
}

/**
 * Adds an additional value for an attribute to an element, the new value is
 * appended at the end.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmAppAt(mode, identifier, attributeName, attributeValue) {
	const oldValue = gmGetAt(mode, identifier, attributeName)
	const newValue = oldValue + ATTR_SEP + attributeValue
	return gmSetAt(mode, identifier, attributeName, newValue)
}

/**
 * Shorthand: Adds an additional value for an attribute to an element, the new
 * value is appended at the end.
 *
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmAppAtI(identifier, attributeName, attributeValue) {
	return gmAppAt(SHORT_ID, identifier, attributeName, attributeValue)
}

/**
 * Verifies if an instance is an array.
 *
 * @param obj -
 *            the instance to test
 * @returns {Boolean} TRUE=if instance is an array, else FALSE
 */
function gmIsArray(obj) {
	return gmIsInstanceOf(obj, Array)
}

function gmIsFunction(obj) {
	return gmIsInstanceOf(obj, Function)
}

function gmIsUndefined(obj) {
	return (obj == null ? true : (typeof obj == "undefined"))
}

/**
 * Verifies if an instance is an object.
 *
 * @param obj -
 *            the instance to test
 * @returns {Boolean} TRUE=if instance is an object, else FALSE
 */
function gmIsObject(obj) {
	return (obj == null ? false : (typeof obj == "object"))
}

/**
 * Tests, if an instanced object is from the requested type.
 *
 * @param obj -
 *            an instance of an object (must not be null)
 * @param objType -
 *            a name of a type, if null it will be replaced by "Object"
 * @returns {Boolean} TRUE = if the object is from the tested type, else FALSE
 */
function gmIsInstanceOf(obj, objType) {
	let isType = false
	if (obj != null) {
		if (objType == null) {
			objType = "Object"
		}
		try {
			let tObjType = eval(objType)
			isType = (obj.constructor === tObjType)
		} catch (e) {
			// ignore
		}
		// isType = (typeof obj) == objType;
	}
	return isType
}

/**
 * Removes all spaces from the left.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function ltrim(a) {
	let ret = null
	if (a != null) {
		ret = String(a)
		let pos = 0
		while (a.charAt(pos) === " ") {
			pos++
		}
		ret = a.substring(pos)
	}
	return ret
}

/**
 * Removes all spaces from the right.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function rtrim(a) {
	let ret = null
	if (a != null) {
		ret = String(a)
		let pos = a.length - 1
		while (a.charAt(pos) === " ") {
			pos--
		}
		ret = a.substring(0, pos + 1)
	}
	return ret
}

/**
 * Removes all space from the left and right.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function trim(a) {
	return ltrim(rtrim(a))
}

function gmCleanText(dirtyText) {
	let cleanText = ""
	if (gmIsInstanceOf(dirtyText, String)) {
		cleanText = dirtyText.replace(/\s\s/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/#/g, "")
	}
	return cleanText
}

/**
 * Extracts a numeric value from a text. Supports only "full" numbers;
 *
 * @param a
 *            the text to parse
 * @returns {Number} the found numeric value or 0;
 */
function gmToNo(a) {
	let numFound = ""
	if (isNaN(a)) {
		if (a && a.length > 0) {
			for (let int = 0; int < a.length; int++) {
				const a_ele = a[int]
				if (!isNaN(a_ele)) {
					numFound += a_ele
				} else {
				}
			}
		}
	} else {
		numFound = a
	}
	let newNum = Number(numFound).valueOf()
	if (typeof (newNum) != "number") {
		newNum = 0
	}
	return newNum
}

const SORT_NO = 0
const SORT_DEF = 1
const SORT_REV = 2
const SORT_NUM = 3

/**
 * Sorts an array by a specific sort order (alphanumeric).
 *
 * @param unsortedArray - the aray which should be sorted
 * @param sortMode      - the sort order or leave null to ignore sorting
 * @returns {Array} the sorted array
 */
function gmSortArray(unsortedArray, sortMode) {
	const sortedArray = unsortedArray
	if (sortMode == null) {
		sortMode = false
	}
	if (sortMode === SORT_NUM) {
		sortedArray.sort(function (aE, bE) {
			return aE - bE
		})
	} else if (sortMode === SORT_REV) {
		sortedArray.reverse()
	} else if (sortMode || sortMode === SORT_DEF) {
		sortedArray.sort()
	}
	return sortedArray
}

function gmSortObject(unsortedObjects, sortField) {
	try {
		if (gmIsArray(unsortedObjects)) {
			unsortedObjects.sort(function (aElem, bElem) {
				const x = aElem[sortField].toLowerCase()
				const y = bElem[sortField].toLowerCase()
				if (x < y) {
					return -1
				}
				if (x > y) {
					return 1
				}
				return 0
			}
			)
		}

	} catch (ex) {
		alert(ex)
	}
	return unsortedObjects
}

function gmOnlyUnique(arrArray) {
	let arrUnique = []
	if (gmIsArray(arrArray)) {
		arrUnique = arrArray.filter(function (value, index, self) {
			return self.indexOf(value) === index
		})
	}
	return arrUnique
}

/**
 * The start point for all gmonkey scripts.
 *
 * @param e -
 *            the occuring event
 * @returns {Boolean} TRUE = if all handler are succesfull done, else FALSE
 */
function gmAddHandler(e) {
	let isDone
	lgm_addKnownSites()
	lgm_addStyles()
	lgm_addControls()
	lgm_addInitAction()
	isDone = true
	return isDone
}

/**
 * Now add the event handler.
 */
function gmInitEventHandler() {
	if (INIT_ONLOAD) {
		window.addEventListener("load", function (e) {
			gmAddHandler(e)
		})
	}
}

// ---------------
// base-core.js - END
// ---------------
// ---------------
// base-object.js - START
// ---------------
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedGlobalSymbols

/**
 * Creates an DOM-Object.
 *
 * @param par - the parent object to create the new object as child
 * @param objtyp - the type of the new object (HTML-Tagname)
 * @param id - the id and name of the new object
 * @returns {Object} the created object or null
 */
function gmCreateObj(par, objtyp, id) {
	// var obj = $("<" + objtyp + ">");
	let obj = null
	if (objtyp != null && objtyp !== "") {
		obj = document.createElement(objtyp)
		if (obj) {
			if (id != null) {
				// obj.attr("id", id);
				// obj.attr("name", id);
				gmSetAtI(obj, "id", id)
				gmSetAtI(obj, "name", id)
			}
			if (gmIsObject(par)) {
				// $(par).append(obj);
				par.appendChild(obj)
			}
		}
	}
	return obj
}

/**
 * Create common attributes for an DOM-Object. Leave null if not used.
 *
 * @param obj - the object to create the attributes in it
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param ro - if set != null, the DOM will be readonly
 * @param ev_click - a javascript-call for the click-event
 * @param ev_focus - a javascript-call for the focus-event
 * @param ev_mOver - a javascript-call for the mouseover-event
 * @param ev_mOut - a javascript-call for the mouseout-event
 * @param ev_dblClick - a javascript-call for the doubleclick-event
 * @returns {Object} the object with added attributes FIXME: Check
 */
function gmCreateObjCommon(obj, caption, tit, ro, ev_click, ev_focus, ev_mOver, ev_mOut, ev_dblClick) {
	if (obj) {
		// obj.attr("title", tit);
		gmSetAtI(obj, "title", tit)
		if (ro) {
			// obj.attr("readonly", "readonly");
			gmSetAtI(obj, "readonly", "readonly")
		}
		if (caption) {
			// obj.append(caption);
			gmSetCoI(obj, caption)
		}
		if (ev_click) {
			// obj.click(ev_click);
			obj.onclick = ev_click
		}

		if (ev_dblClick) {
			// obj.click(ev_dblClick);
			obj.ondblclick = ev_dblClick
		}

		if (ev_focus) {
			// obj.focus(ev_focus);
			obj.onfocus = ev_focus
		}

		if (ev_mOver) {
			// obj.hover(ev_mOver);
			obj.onmouseover = ev_mOver
		}

		if (ev_mOut) {
			// obj.hover(ev_mOut);
			obj.onmouseout = ev_mOut
		}

	}
	return obj
}

/**
 * Creates a DOM-Button.
 *
 * @param par - the parent object to create the new object as child
 * @param typ - the type of the new object (HTML-Tagname)
 * @param id - the id and name of the new object
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param initval - an initial value is set in this input
 * @param ev_click - a javascript-call for the click-event
 * @returns {Object} the created DOM-Button
 */
function gmCreateButton(par, typ, id, caption, tit, initval, ev_click) {
	let obj = gmCreateObj(par, "button", id)
	obj = gmCreateObjCommon(obj, caption, tit, null, ev_click)
	if (!typ) {
		typ = "button"
	}
	gmSetAtI(obj, "type", typ)
	if (initval) {
		gmSetAtI(obj, "value", initval)
	}
	return obj
}

/**
 * Creates a DOM-Link.
 *
 * @param par - the parent object to create the new object as child
 * @param id - the id and name of the new object
 * @param href
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param target
 * @param ev_click - a javascript-call for the click-event
 * @param ev_dblClick - a javascript-call for the doubleclick-event
 * @returns {Object} the created DOM-Link
 */
function gmCreateLink(par, id, href, caption, tit, target, ev_click, ev_dblClick) {
	let obj = gmCreateObj(par, "a", id)
	obj = gmCreateObjCommon(obj, caption, tit, null, ev_click, null, null, null, ev_dblClick)
	if (href) {
		gmSetAtI(obj, "href", href)
		gmSetAtI(obj, "data-href", href)
	}
	if (target) {
		gmSetAtI(obj, "target", target)
	}

	return obj
}

/**
 * Creates a DOM-Input-Element.
 *
 * @param par - the parent object to create the new object as child
 * @param typ - the type of the new input (Type-Attribute)
 * @param id - the id and name of the new object
 * @param initval - an initial value is set in this input
 * @param tit - a W3C-conform title for that DOM
 * @param ro - if set != null, the DOM will be readonly
 * @param ev_click - a javascript-call for the click-event
 * @param ev_focus - a javascript-call for the focus-event
 * @returns {Object} the new DOM-Input
 */
function gmCreateInput(par, typ, id, initval, tit, ro, ev_click, ev_focus) {
	let obj = gmCreateObj(par, "input", id)
	if (obj) {
		obj = gmCreateObjCommon(obj, null, tit, ro, ev_click, ev_focus)
		if (!typ) {
			typ = "text"
		}
		gmSetAtI(obj, "type", typ)
		if (initval) {
			// obj.val(initval);
			gmSetAtI(obj, "value", initval)
		} else {
			// obj.val("");
			gmSetAtI(obj, "value", "")
		}
	}
	return obj
}

/**
 * Adds an object as a child node to a parent object or the document body.
 *
 * @param obj - the object to append at the end of the child list
 * @param parent - the parent object to append to, leave null to put it to the
 *            document-body
 * @returns {Boolean} TRUE = the object could be added, else FALSE
 */
function gmAddObj(obj, parent) {
	let isSet = false
	if (gmIsObject(obj)) {
		if (!parent) {
			parent = gmGetEl("tagname", "body")
		}
		parent.appendChild(obj)
		isSet = true
	}
	return isSet
}

/**
 * Sets a new value into an object.
 *
 * @param id - the id of the object
 * @param initval - the new value for that element or empty
 * @returns {Boolean} TRUE = if the value could be set, else FALSE
 */
function gmSetInput(id, initval) {
	let isSet = false
	// var obj = document.getElementById(id);
	const obj = gmGetElI(id)
	if (obj) {
		if (initval) {
			// obj.setAttribute("value", initval);
			gmSetAtI(obj, "value", initval)
			isSet = true
		} else {
			// obj.setAttribute("value", "");
			gmSetAtI(obj, "value", "")
			isSet = true
		}
	}
	return isSet
}

/**
 * Selects the text in a input element.
 *
 * @param inputElem - the element containing the text
 * @returns {Boolean} TRUE = if the input element could be selected, else FALSE
 */
function gmSelectInput(inputElem) {
	let isSet = false
	if (gmIsObject(inputElem)) {
		try {
			inputElem.select()
			isSet = true
		} catch (e) {
		}
	}
	return isSet
}

/**
 * Constants for Selection of Text using IE.
 */
const SELECT_IE = 0
/**
 * Constants for Selection of Text using Gecko Engine.
 */
const SELECT_G = 1

/**
 * @returns {Number} which Selection of Text Modus is used
 */
function gmGetTextSelectMode() {
	if (document.selection && document.selection.createRange) {
		return SELECT_IE
	} else if (document.createRange && window.getSelection) {
		return SELECT_G
	}
	return SELECT_IE
}

/**
 * Constants Mode which is currently used for Selection of Text.
 *
 * @see {@link #gmGetTextSelectMode()}
 */
const SELECT_CURR = gmGetTextSelectMode()

/**
 * Returns the selected Text or an empty String.
 *
 * @returns {String} the text which is currently selected.
 */
function gmGetSelectedText() {
	let selectedText = ""
	if (SELECT_IE === SELECT_CURR) {
		selectedText = document.selection.createRange().text
	} else if (SELECT_G === SELECT_CURR) {
		selectedText = window.getSelection()
	}
	if (typeof selectedText == "object") {
		selectedText = selectedText.toString()
	}
	return selectedText
}

/**
 * Creates a new Range-Object for an element.
 *
 * @param elem - an element for the Range-Object or null;
 * @returns {Range} a new Range-Object or null
 */
function gmGetNewRange(elem) {
	let textRange = null
	if (SELECT_IE === SELECT_CURR) {
		textRange = document.selection.createRange()
	} else if (SELECT_G === SELECT_CURR) {
		if (gmIsObject(elem)) {
			textRange = document.createRange()
			try {
				textRange.selectNode(elem)
			} catch (e) {
				// alert(e);
			}
		}
	}
	return textRange
}

/**
 * Selects or Unselects the content inside an element (not only for input
 * elements.
 *
 * @param elem - the element to select the text in it
 * @param bForceSelect - TRUE=always select, FALSE=switch between select and unselect
 * @returns {String} the selected text or an empty string
 */
function gmSelectText(elem, bForceSelect) {
	let selection
	let currSel = gmGetSelectedText()
	if (bForceSelect == null) {
		bForceSelect = false
	}
	if (!bForceSelect && (currSel && currSel !== "")) {
		if (SELECT_IE === SELECT_CURR) {
			// noinspection BadExpressionStatementJS
			document.selection.empty
		} else if (SELECT_G === SELECT_CURR) {
			selection = window.getSelection()
			selection.removeAllRanges()
		}
	} else {
		if (gmIsObject(elem)) {
			const tRange = gmGetNewRange(elem)
			if (SELECT_IE === SELECT_CURR) {
				tRange.select()
			} else if (SELECT_G === SELECT_CURR) {
				selection = window.getSelection()
				selection.removeAllRanges()
				selection.addRange(tRange)
			}
			currSel = gmGetSelectedText()
		}
	}
	return currSel
}

/**
 * Removes an object from the DOM.
 *
 * @param obj the object to delete
 * @returns {Boolean} TRUE=the obj was deleted
 */
function gmDelObj(obj) {
	let isDel = false
	let oObj = gmGetElI(obj)
	if (gmIsObject(oObj)) {
		const parent = oObj.parentNode
		if (gmIsObject(parent)) {
			try {
				parent.removeChild(oObj)
				isDel = true
			} catch (e) {
				alert("ERR: " + e)
			}
		}
	}
	return isDel
}

/**
 * Removes (clears) the object from it's children.
 *
 * @param obj - the object to clear
 * @returns {Boolean} TRUE = always, if obj is an object, FALSE = obj is null or not an object
 */
function gmEmptyObj(obj) {
	let isEmpty = false
	let oObj = gmGetElI(obj)
	if (gmIsObject(oObj)) {
		while (oObj.firstChild) {
			oObj.removeChild(oObj.firstChild)
		}
		isEmpty = true
	}
	return isEmpty
}

// ---------------
// base-object.js - END
// ---------------
// ---------------
// base-web.js - START
// ---------------
// noinspection JSUnusedGlobalSymbols

class PagelinksClazz {
	/**
	 *
	 * @param {string} link
	 * @param {string|string[]} linkText
	 */
	constructor(link, linkText) {
		this.link = link
		if (!gmIsArray(linkText)) {
			this.linkText = [linkText]
		} else {
			this.linkText = linkText
		}
	}
}

class KnowSiteClazz {
	/**
	 * @param {string|RegExp} site
	 */
	constructor(site) {
		this.site = site
	}
}

class KnowSiteFilterClazz extends KnowSiteClazz {
	/**
	 * @param {string|RegExp} site
	 * @param {string} filter
	 * @param {string|RegExp} path
	 */
	constructor(site, filter, path) {
		super(site)
		this.filter = filter
		this.path = path
	}
}

class KnowSiteExtClazz extends KnowSiteClazz {
	/**
	 * @param {string|RegExp} site
	 * @param {string|RegExp} url
	 * @param {string|RegExp} search
	 * @param {string|RegExp} replace
	 * @param {string|RegExp} replaceLarge
	 * @param {number} withDownload
	 */
	constructor(site, url, search, replace, replaceLarge, withDownload) {
		super(site)
		this.url = url
		this.search = search
		this.replace = replace
		this.replace_large = replaceLarge
		this.withDownload = withDownload
	}
}

/**
 * List of all URLs which are known by this script.
 * @type {KnowSiteFilterClazz[]|KnowSiteExtClazz[]}
 */
let knownSite = []

/**
 * Minimum width of the preview.
 * @type {number}
 */
const minWidth = 240

/**
 * Maximum width of the preview.
 * @type {number}
 */
const maxWidth = 640

/**
 * Adds an url which should be known for the search.
 *
 * @param {string} filter - a predefined searchtext for that url
 * @param {string|RegExp} site - the hostname as regular expression
 * @param {string|RegExp} path - a path as regular expression (optional)
 */
function gmAddSite(filter, site, path) {
	if (gmIsArray(knownSite)) {
		if (site && (site.length > 0)) {
			knownSite.push(new KnowSiteFilterClazz(
				site,
				(filter != null ? filter : ".+"),
				(path != null ? path : ""))
			)
			// const len = knownSite.length;
			// knownSite[len] = {};
			// knownSite[len].site = site;
			// knownSite[len].filter = (filter != null ? filter : ".+");
			// knownSite[len].path = (path != null ? path : "");
		}
	}
}

/**
 * Adds a config for a known site.
 *
 * @param {string|RegExp} site - a site pattern
 * @param {string|RegExp} urlElem - a pattern for the html-element to search in the page
 * @param {string|RegExp} urlSearch - a pattern to search inside the url of the html-element
 * @param {string|RegExp} urlReplace - a literal which will used for replacing the urlSearch
 * @param {string|RegExp} urlReplaceLarge - a literal which will used for replacing the urlSearch with a url for large images
 * @param {number} withDownload - 1=will add a download-link beneath the picture, else 0
 */
function gmAddSite2(site, urlElem, urlSearch, urlReplace, urlReplaceLarge, withDownload) {
	if (gmIsArray(knownSite)) {
		if (site && site.length > 0) {
			knownSite.push(new KnowSiteExtClazz(
				site,
				(urlElem != null ? urlElem : ".+"),
				(urlSearch != null ? urlSearch : ""),
				(urlReplace != null ? urlReplace : ""),
				(urlReplaceLarge != null ? urlReplaceLarge : ""),
				(withDownload != null ? withDownload : 0)
			))
			// const len = knownSite.length;
			// knownSite[len] = {};
			// knownSite[len].site = site;
			// knownSite[len].url = (urlElem != null ? urlElem : ".+");
			// knownSite[len].search = (urlSearch != null ? urlSearch : "");
			// knownSite[len].replace = (urlReplace != null ? urlReplace : "");
			// knownSite[len].replace_large = (urlReplaceLarge != null ? urlReplaceLarge : "");
			// knownSite[len].withDownload = (withDownload != null ? withDownload : 0);
		}
	}
}

/**
 * Searchs in the list of known sites, if this site is found and returns the
 * predefined searchtext. If multiple sites will match, the LAST matching
 * filter will be returned.
 *
 * @param {string} site - the hostname of the site to search for
 * @param {string} path - the path of the site to search for (optional)
 * @returns {string} the predefined searchtext
 */
function gmFoundFilter(site, path) {
	let retFilter = ""
	if (gmIsArray(knownSite) && site) {
		if (!path) {
			path = ""
		}
		//for (let i = 0; i < knownSite.length; i++) {
		let init = 0
		for (let currSite of knownSite) {
			//let currSite = knownSite[i];
			if (site.search(currSite.site) >= 0) {
				if (init === 0 && currSite.path === "") {
					retFilter = currSite.filter
					init = 1
				}
				let fIdx = path.search(currSite.path)
				if (path !== "" && (fIdx >= 0)) {
					retFilter = currSite.filter
					break
				} else if (path === "" && currSite.path === "") {
					retFilter = currSite.filter
					break
				}
			}
		}
	}
	return retFilter
}

/**
 * Searchs in the list of known sites, if this site is found and returns the predefined searchtext. If multiple sites will match, the LAST matching site will be returned.
 *
 * @param {string} site - the hostname of the site to search for
 * @return {KnowSiteExtClazz} a found site configuration
 */
function gmFoundFilter2(site) {
	let retFilter = null
	if (gmIsArray(knownSite) && site) {
		for (let currSite of knownSite) {
			if (site.search(currSite.site) >= 0) {
				retFilter = currSite
			}
		}
		//for (let i = 0; i < knownSite.length; i++) {
		//  if (site.search(knownSite[i].site) >= 0) {
		// retFilter = knownSite[i];
		//}
	}
	return retFilter
}

/** @type {string} */
const FL_TAG = "result-list"
/** @type {string} */
const FL_ID = "_FL"

/**
 *
 * @param {string|HTMLElement} curlink
 * @param {number} withDesc
 * @return {string[]}
 */
function gmPrepareLinkData(curlink, withDesc) {
	const linkData = []
	linkData.push(gmGetAtI(curlink, "href"))
	if (withDesc !== 0) {
		linkData.push(gmGetAtI(curlink, "title"))
		linkData.push(gmGetAtI(curlink, "aria-label"))
		linkData.push(gmGetAtI(curlink, "alt"))
		linkData.push(gmGetAtI(curlink, "onmouseover"))
		linkData.push(gmGetAtI(curlink, "onclick"))
		linkData.push(curlink.innerHTML.replace("\\n", "").replace("#", ""))
	}
	return linkData
}

/**
 *
 * @param {string|HTMLAnchorElement} curlink
 * @param {number} withDesc
 * @return {string[]}
 */
function gmPrepareLinkTextData(curlink, withDesc) {
	let linkTextData = []
	try {
		const tmpTextData = []
		tmpTextData.push(curlink.text)
		if (withDesc !== 0) {
			tmpTextData.push(gmGetAtI(curlink, "title"))
			tmpTextData.push(gmGetAtI(curlink, "alt"))
			tmpTextData.push(gmGetAtI(curlink, "aria-label"))
			tmpTextData.push(gmGetAtI(curlink, "onmouseover"))
			tmpTextData.push(gmGetAtI(curlink, "onclick"))
			tmpTextData.push(curlink.innerHTML)
			linkTextData = tmpTextData.map(function (value) {
				if (gmIsUndefined(value)) {
					return ""
				} else if (gmIsObject(value)) {
					return value.toString()
				} else if (gmIsInstanceOf(value, String)) {
					return gmCleanText(value)
				} else {
					return value
				}
			})
		}
	} catch (ex) {
		alert(ex)
	}
	return linkTextData
}

/**
 *
 * @param {string} searchPattern
 * @return {RegExp}
 */
function gmPrepareSearchRegExp(searchPattern) {
	if (!searchPattern || searchPattern.length <= 0) {
		searchPattern = ".*"
	} else if (searchPattern.charAt(0) === "/" && searchPattern.charAt(searchPattern.length - 1) === "/") {
		searchPattern = searchPattern.substring(1, searchPattern.length)
		searchPattern = searchPattern.substring(0, searchPattern.length - 1)
	} else {
		searchPattern = searchPattern.replace(/\?/g, ".").replace(/\./g, "\.").replace(/\*/g, ".*")
	}
	//alert(searchPattern);
	return new RegExp(searchPattern, "i")
}

/**
 * Search for all matching links in the page.
 *
 * @param {string} searchPattern - the search pattern or leave "" to get all
 * @param {number} withDesc      - 0 = search only in links,
 *                        1 = search also in link description
 * @returns {PagelinksClazz[]} an array with all found links
 */
function gmFindLinksInPage(searchPattern, withDesc) {
	let pagelinks = []
	if (!withDesc) {
		withDesc = 0
	}
	if (bTestMode) {
		pagelinks = gmGenTestEntries(40)
	} else {
		//searchPattern = gmPrepareSearchRegExp(searchPattern);
		//for (let linksIdx = 0; linksIdx < document.links.length; linksIdx++) {
		for (let curLink of document.links) {
			//let curLink = document.links[linksIdx];
			const found = gmLinkMatchesPattern(curLink, searchPattern, withDesc)
			if (found && gmGetAtI(curLink.id, FL_TAG) !== FL_ID) {
				let htmlLink = gmGetAtI(curLink, "href")
				let htmlText = gmLinkGenerateLinkText(curLink, withDesc)
				let bFound = false
				for (let foundLinksIdx = 0; foundLinksIdx < pagelinks.length; foundLinksIdx++) {
					let currPageLink = pagelinks[foundLinksIdx]
					if (htmlLink === currPageLink.link) {
						bFound = true
						currPageLink.linkText.push(htmlText)
						pagelinks[foundLinksIdx].linkText = gmOnlyUnique(currPageLink.linkText)
						//alert(pagelinks[foundLinksIdx].linkText);
						break
					}
				}
				if (!bFound) {
					pagelinks.push(new PagelinksClazz(htmlLink, htmlText))
				}
			}
		}
	}
	return pagelinks
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param {string|Object} curLink
 * @param {string} searchPattern - a search text (might be a regular expression)
 * @param {number} withDesc
 * @returns {boolean} TRUE= the search text is found in the array, or FALSE
 */
function gmLinkMatchesPattern(curLink, searchPattern, withDesc) {
	let cleanSearchPattern = gmPrepareSearchRegExp(searchPattern)
	const arrText = gmPrepareLinkData(curLink, withDesc)
	let bFound = false
	if (gmIsArray(arrText)) {
		for (let i = 0; i < arrText.length; i++) {
			const searchText = arrText[i]
			try {
				bFound = searchText.search(cleanSearchPattern) !== -1
			} catch (e) {
				// ignored
			}
			if (bFound) {
				break
			}
		}
	}
	return bFound
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param {string|Object} curLink
 * @param {number} withDesc
 * @returns {string} the final link description
 */
function gmLinkGenerateLinkText(curLink, withDesc) {
	let arrText = gmPrepareLinkTextData(curLink, withDesc)
	let searchTextClean = []
	let htmlText = ""
	if (gmIsArray(arrText)) {
		for (let idxST = 0; idxST < arrText.length; idxST++) {
			searchTextClean[idxST] = trim(gmCleanText(arrText[idxST]))
		}
		htmlText = gmOnlyUnique(searchTextClean).join("")
	}
	return htmlText
}

/**
 * Adds a javascript block into the page.
 *
 * @param {Object|Function|Array|string} scc - a string, a function or an array with the javascript code or a function-list
 * @returns {boolean} TRUE = if the script block could be set, else FALSE
 */
function gmAddScriptGlobal(scc) {
	let isSet = false
	if (gmIsObject(scc) || gmIsFunction(scc) || (scc && scc.length > 0)) {
		const head = gmGetHead()
		if (head) {
			const script = gmCreateObj(head, "script")
			script.type = "text/javascript"

			let allscc = ""
			if (gmIsArray(scc)) {
				for (let i = 0; i < scc.length; i++) {
					allscc += scc[i] + " \n"
				}
			} else {
				allscc = scc
			}
			gmSetCoI(script, "\n" + allscc + "\n")
			isSet = true
		}
	}
	return isSet
}

/**
 * Adds a link to a javascript file into the page.
 *
 * @param {string|string[]} scLink - a string or an array with the url of the javascript-file
 * FIXME: Check
 */
function gmAddScriptLinkGlobal(scLink) {
	let isSet = false
	const head = gmGetHead()
	if (head && scLink && scLink.length > 0) {
		let allScLink
		if (gmIsArray(scLink)) {
			allScLink = scLink
		} else {
			allScLink = [scLink]
		}

		for (let i = 0; i < allScLink.length; i++) {
			const newScript = gmCreateObj(head, "script")
			newScript.type = "text/javascript"
			newScript.src = allScLink[i]
		}
		isSet = true
	}
	return isSet
}

/**
 * Adds a style block into the page.
 *
 * @param {string|string[]} scc - a string or an array with the css code
 * @returns {boolean} TRUE = if the style block could be set, else FALSE
 */
function gmAddStyleGlobal(scc) {
	let isSet = false
	if (gmIsObject(scc) || (scc && scc.length > 0)) {
		const head = gmGetHead()
		if (head) {
			const style = gmCreateObj(head, "style")
			style.type = "text/css"

			let allscc = ""
			if (gmIsArray(scc)) {
				for (let i = 0; i < scc.length; i++) {
					allscc += scc[i] + " \n"
				}
			} else {
				allscc = scc
			}
			gmSetCoI(style, "\n" + allscc + "\n")
			isSet = true
		}
	}
	return isSet
}

/**
 * Generates some sample entries for testing.
 *
 * @param {number} maxEntries - number of entries to generate
 * @returns {PagelinksClazz[]} array of entries
 */
function gmGenTestEntries(maxEntries) {
	if (isNaN(maxEntries)) {
		maxEntries = 1
	}
	if (maxEntries < 0) {
		maxEntries = 0
	} else if (maxEntries > 100) {
		maxEntries = 100
	}
	let testArray = []
	for (let i = 1; i <= maxEntries; i++) {
		let htmlLink = "https://" + currSite + currPath + "/link-" + i
		let htmlText = "linktext-" + i
		testArray.push(new PagelinksClazz(htmlLink, htmlText))
	}
	return testArray
}

/**
 * Calculate the offset of an element relating to the elemnt at the most top.
 *
 * @param {Object|HTMLInputElement} element - the element to check the offeset
 * @returns {number[]} an array with the leftOffset, topOffset
 *          FIXME:TEST
 */
function gmCumulativeOffset(element) {
	let valueT = 0
	let valueL = 0
	if (element) {
		valueL = element.width || 0
		do {
			valueT += element.offsetTop || 0
			valueL += element.offsetLeft || 0
			element = element.offsetParent
		} while (element)
	}
	return [valueL, valueT]
}

/**
 * Calculates the horizontal offset to the right in relation to it's parent element.
 *
 * @param {Object} parentElem - the element to calculate the offset from
 * @param {Array} iPoint - a screen point, to add an additional offset
 * @param {number} iZoom  - the zoom factor 1= Originalsize
 * @returns {number} the horizontal offset or 0 FIXME:Test
 */
function gmCalcOffsetH(parentElem, iPoint, iZoom) {
	if (isNaN(iZoom)) {
		iZoom = 1
	}
	let offsetH = 0
	if (parentElem) {
		offsetH = gmCumulativeOffset(parentElem)[1]
		if (!isNaN(offsetH) && gmIsArray(iPoint)) {
			if (!isNaN(iPoint[1])) {
				offsetH = offsetH - (iPoint[1] * iZoom) + (parentElem.height || 0)
			}
		}
	}
	return offsetH
}

/**
 * Searches the url for a pattern and replace the text.
 *
 * @param {string} searchForPattern - the pattern to search for
 * @param {string} replaceWithText  - the text what will be inserted instead
 * @param {string} oldUrl           - the URL to search in
 * @returns {string} the url with replaced text
 */
function gmGetReplaceUrl(searchForPattern, replaceWithText, oldUrl) {
	let newUrl = oldUrl
	if (oldUrl != null) {
		if (searchForPattern !== "") {
			// there is something to replace
			if (replaceWithText == null) {
				replaceWithText = ""
			}
			const patternReplace = new RegExp(searchForPattern)
			newUrl = oldUrl.replace(patternReplace, replaceWithText)
		}
	}
	return newUrl
}

/**
 * Returns the actual server of the running page.
 *
 * @returns {string} a server name
 */
function gmGetCurrentSite() {
	let currSite = document.location.host
	if (document.location.port) {
		currSite += ":" + document.location.port
	}
	return currSite
}

/**
 * Determine the metrics of that image.
 *
 * @param {Object} newImage - the image to inspect
 * @returns {number[]} the image metrics [width, height] in px
 */
function gmGetImageSize(newImage) {
	let imageObjectWidth = 0
	let imageObjectHeight = 0

	if (newImage && newImage.width && newImage.width > 0) {
		imageObjectWidth = newImage.width
		imageObjectHeight = newImage.height
	}
	if (imageObjectWidth <= 0) {
		imageObjectWidth = minWidth
	} else if (imageObjectWidth > maxWidth) {
		imageObjectWidth = maxWidth
		imageObjectHeight = 0
	}
	if (imageObjectHeight <= 0) {
		imageObjectHeight = "auto"
	}
	return [imageObjectWidth, imageObjectHeight]
}

/**
 * Add a default style to a div-element.
 *
 * @param {Object} hDiv - the div-element
 * @param {number[]} iPoint - metrics of the image [width, height] in px
 * @param {number} offsetW - an offset (number) for the width (optional), default is 5px
 * @param {number} offsetH - an offset (number) for the height (optional), default is 5px
 * @param {number} ratio - the aspect ratio of the image, only is used, if we have no image height
 * @param {number} iZoom -
 * @returns {boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom) {
	let w = "auto"
	let h = "auto"
	let oH = "5px"
	let oW = "5px"

	let isSet = false
	if (gmIsObject(hDiv)) {
		if (isNaN(iZoom)) {
			iZoom = 1
		}
		if (gmIsArray(iPoint)) {
			if (!isNaN(iPoint[0])) {
				w = iPoint[0] + 2
			}
			if (isNaN(iPoint[1])) {
				h = (gmToNo(hDiv.style.width) / ratio) + 2// + picTextHeight;
			} else {
				h = (iPoint[1] + 2) // + picTextHeight;
			}
		}
		if (!isNaN(offsetH)) {
			oH = offsetH + "px"
		}
		if (!isNaN(offsetW)) {
			oW = offsetW + "px"
		}
		// noinspection JSCheckFunctionSignatures
		if (!isNaN(w)) {
			w *= iZoom
			w = w + "px"
		}
		// noinspection JSCheckFunctionSignatures
		if (!isNaN(h)) {
			h *= iZoom
			h = h + "px"
		}
		let css = gmGetAtI(hDiv, "style")
		if (css === false) {
			css = ""
		}
		css += ";width:" + w + ";height:" + h + ";top:" + oH + ";left:" + oW
		gmSetAtI(hDiv, "style", css)
		isSet = true
	}

	return isSet
}

/**
 * Add a default style to an img-element.
 *
 * @param {Object} hDiv - the div-element
 * @param {Object} hImg - the img-element
 * @param {number[]} iPoint - metrics of the image [width, height] in px
 * @param {number} iZoom - the zoom factor (1 = Originalsize)
 * @returns {boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetImgLayout(hDiv, hImg, iPoint, iZoom) {
	let h = "auto"
	let w = "auto"

	let isSet = false
	if (gmIsObject(hDiv)) {
		if (isNaN(iZoom)) {
			iZoom = 1
		}
		if (gmIsArray(iPoint)) {
			if (!isNaN(iPoint[0])) {
				w = iPoint[0]
			}
			if (isNaN(iPoint[1])) {
				if (gmIsObject(hImg)) {
					let ratio = gmToNo(hImg.style.width) / gmToNo(hImg.style.height)
					h = (gmToNo(hDiv.style.width) / ratio)// + picTextHeight;
				}
			} else {
				h = iPoint[1] // + picTextHeight;
			}
		}
		// noinspection JSCheckFunctionSignatures
		if (!isNaN(w)) {
			w *= iZoom
			w = w + "px"
		}
		// noinspection JSCheckFunctionSignatures
		if (!isNaN(h)) {
			h *= iZoom
			h = h + "px"
		}
		let css = gmGetAtI(hDiv, "style")
		if (css === false) {
			css = ""
		}
		css += ";width:" + w + ";height:" + h
		gmSetAtI(hDiv, "style", css)
		isSet = true
	}
	return isSet
}

/**
 *
 * @returns {Object} the object for the head in the page, or null
 */
function gmGetHead() {
	return gmGetEl("tagname", "head")
}

/**
 *
 * @returns {Object} the object for the body in the page, or null
 */
function gmGetBody() {
	return gmGetEl("tagname", "body")
}

/**
 * @param {string|HTMLElement} obj - the object from which to get the css-style
 * @returns {HTMLStyleElement} the css-style-object from that object
 */
function gmGetStyle(obj) {
	let res = null
	const oObj = gmGetElI(obj)
	if (oObj) {
		try {
			res = oObj.style
		} catch (e) {
			// ignored
		}
	}
	return res
}

/**
 *
 * @param {string|HTMLElement} obj - the object to set the css-style
 * @param {string} styleName - the name of style
 * @param {*} styleValue - the new value for this style
 * @return {HTMLElement} the modified object
 */
function gmSetStyle(obj, styleName, styleValue) {
	let oStyle = gmGetStyle(obj)
	if (oStyle) {
		try {
			gmSetAtI(oStyle, styleName, styleValue)
		} catch (e) {
			// ignored
		}
	}
	return obj
}

/**
 * @returns {number} height of the document body
 */
function gmGetBodyHeight() {
	let D = gmGetBody()
	let Dh = 0
	let Eh = 0
	if (D) {
		// noinspection JSCheckFunctionSignatures
		Dh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight)
	}
	if (D.documentElement) {
		D = D.documentElement
		// noinspection JSCheckFunctionSignatures
		Eh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight)
	}
	return Math.max(Dh, Eh)
}

/**
 *
 * @param {string} url
 * @return {boolean}
 */
function gmOpenInTab(url) {
	if (url) {
		window.open(url, "_blank")
	}
	return true
}

// ---------------
// base-web.js - END
// ---------------
// ---------------
// base-clipboard.js - START
// ---------------
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedGlobalSymbols

/**
 * @returns {Object} the reference to the base window, might be the greasemonkey
 *          unsafeWindow
 */
function gmClipRef() {
	let refWindow = window
	if (!refWindow && unsafeWindow != null) {
		refWindow = unsafeWindow
	}
	return refWindow
}

/**
 * @returns {Object} the reference to the the Security Manager or null
 * @depricated since FF 16
 */
function gmPrivsManager() {
	let privsMan = null
	const wdw = gmClipRef()
	if (gmIsObject(wdw)) {
		try {
			if (gmIsObject(wdw.netscape.security.PrivilegeManager)) {
				privsMan = wdw.netscape.security.PrivilegeManager
			}
		} catch (e) {
			// ignored
		}
	}
	return privsMan
}

/**
 * Copies a text to clipboard.
 *
 * @param {string|Object} text - the text to copy to the clipboard
 * @param {boolean} bQuite - don't schow any alerts
 * @param {Object} refWindow - a reference on the page (optional)
 * @returns {string|null} text = if set to clipboard, else null
 */
function gmCopy2clipboard(text, bQuite, refWindow) {
	const resultText = text
	let wdw = gmClipRef()
	if (wdw.clipboardData) {
		wdw.clipboardData.setData("text", text)
		return resultText
	} else {
		try {
			wdw.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
		} catch (ex) {
			if (!bQuite) {
				alert("Internet Security settings do not allow copying to clipboard!")
			}
			return null
		}
		try {
			let e = wdw.Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(wdw.Components.interfaces.nsIClipboard)
			if (!e)
				return null
		} catch (ex) {
			if (!bQuite) {
				alert("1:" + ex)
			}
			return null
		}
		try {
			let b = wdw.Components.classes["@mozilla.org/widget/transferable;1"]
				.createInstance(wdw.Components.interfaces.nsITransferable)
			if (!b)
				return null
		} catch (ex) {
			if (!bQuite) {
				alert("2:" + ex)
			}
			return null
		}
		b.addDataFlavor("text/unicode")
		try {
			let o = wdw.Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(wdw.Components.interfaces.nsISupportsString)
			if (!o)
				return null
			o.data = text
		} catch (ex) {
			if (!bQuite) {
				alert("3:" + ex)
			}
			return null
		}
		b.setTransferData("text/unicode", o, (text == null ? 0 : text.length * 2))
		try {
			let t = wdw.Components.interfaces.nsIClipboard
			e.setData(b, null, t.kGlobalClipboard)
		} catch (ex) {
			if (!bQuite) {
				alert("4:" + ex)
			}
			return null
		}
		if (!bQuite) {
			alert("Copy doesn't work!")
		}
		return text
	}
}

/**
 * Same as {@link #gmCopy2clipboard(text, bQuite, refWindow)}, but customized only for use in a webpage.
 * Not usable for a greasemonkey script.
 *
 * @param {*} text - the text to copy to the clipboard
 */
function copyPostToClipboard(text) {
	let clipboard = null, transferable = null, clipboardID = null
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
	} catch (e) {
		alert(e)
	}
	try {
		clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard)
	} catch (e) {
		alert(e)
	}
	try {
		transferable = Components.classes["@mozilla.org/widget/transferable;1"]
			.createInstance(Components.interfaces.nsITransferable)
	} catch (e) {
		alert(e)
	}
	if (transferable) {
		transferable.addDataFlavor("text/unicode")
		const str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString)
		str.data = text
		transferable.setTransferData("text/unicode", str, str.data.length * 2)
		try {
			clipboardID = Components.interfaces.nsIClipboard
			if (clipboard) {
				clipboard.setData(transferable, null, clipboardID.kGlobalClipboard)
			}
		} catch (e) {
			alert(e)
		}
	}
}

/**
 * Adds the functions for using a "copy to clipboard" in a web-page.
 */
function gmAddClipboardSupport() {
	gmAddScriptGlobal([gmClipRef, gmCopy2clipboard, gmIsClipboardSupported])
}

/**
 * @returns {boolean} TRUE=using clipboard is supported, else FALSE
 */
function gmIsClipboardSupported() {
	let isOK = false
	try {
		let privsMan = gmPrivsManager()
		if (gmIsObject(privsMan)) {
			privsMan.enablePrivilege("UniversalXPConnect")
			isOK = true
		}
	} catch (ex) {
		alert("ERR: " + ex)
	}
	return isOK
}

// ---------------
// base-clipboard.js - END
// ---------------

//
//GM-Script specific code - END
//

// noinspection JSUnusedGlobalSymbols

/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
}

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 *
 * @return {boolean} always true
 */
function lgm_addStyles() {
	return true
}

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
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

//
//GM-Script - END
//

