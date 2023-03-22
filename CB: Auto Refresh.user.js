// ==UserScript==
// @name         CB: Auto Refresh
// @namespace    https://tesomayn.com
// @version      1.0
// @description  Refreshes Chatubate profiles to check if the user if online, useful when streams drop.
// @author       TesoMayn
// @match        https://chaturbate.com/*
// @match        http://chaturbate.com/*
// @grant        none
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaturbate.org
// ==/UserScript==

$(document).ready(function () {
    var checkTime = 5 // This is all you need to change, to time in seconds

    /* No need to change below this, unless you know what you are doing */
    if ($('#defchat > p:contains("Room is currently offline")').length > 0) {
        setInterval(function () {
            window.location.reload(1)
        }, checkTime * 1000)
        $('#defchat p').append('<p class="recheckCountown">Rechecking in <b id="check-time">' + checkTime + '</b> seconds</p>')
    }
    var settimmer = 0
    $(function () {
        window.setInterval(function () {
            var timeCounter = $("b#check-time").html()
            var updateTime = eval(timeCounter) - eval(1)
            $("b#check-time").html(updateTime)
        }, 1000)

    })
})
