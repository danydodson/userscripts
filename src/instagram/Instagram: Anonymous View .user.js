// ==UserScript==
// @name Instagram: Anonymous View
// @namespace com.instagram
// @version 0.4
// @description Features as: Anonymous Story Viwer and etc...
// @description:pt Recursos como: Veja stories sem ser notado e etc...
// @author iKaio
// @license MIT
// @match *://*.instagram.com/*
// @icon https://www.google.com/s2/favicons?domain=instagram.com
// @grant none
// ==/UserScript==

(function () {
    'use strict'

    function intercept(open, send) {
        XMLHttpRequest.prototype.open = function (_, url) {
            this._url = url
            open.apply(this, arguments)
        }

        XMLHttpRequest.prototype.send = function () {
            send.apply(this, arguments)

            if (this._url.includes("/stories/reel/seen")) {
                this.abort()
            }
        }
    }

    intercept(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)
})()