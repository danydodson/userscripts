// ==UserScript==
// @name              CB: Theater Clean
// @namespace         chaturbate_theater_goes_ladroop
// @version           1.21
// @description       profile clean up and video settings
// @license	          MIT
// @match             https://*.chaturbate.com/*
// @exclude           https://*.chaturbate.com/accounts/*
// @noframes
// @grant             none
// @run-at            document-end
// @icon              https://www.google.com/s2/favicons?sz=64&domain=chaturbate.org
// ==/UserScript==


(function () {
    'use strict'

    //prevents the script from throwing errors to CB's own error logger and maybe some part of the script keeps working if they make changes again
    window.onerror = function () { return true }

    if (document.location.href.split('/')[3] == "fullvideo") { return }// for future use maybe

    // this cookie removes most add's
    if (!readCookie("noads")) { createCookie("noads", "1", 30); window.location.reload(true) }

    var vareaid = "xmovie" // default id of the video area
    var vfilter = "brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)"
    var vmirror = "none"
    var container = ""// bio area- test()
    var tadd = "" // top area- main()
    var topbar = "" // menu top bar- main()
    var buttons = "" // buttons area- main()
    var followbutt = "" //follow button main()
    var vsel = ""//video mode choice area- main()
    var loggedin = true // login status- cleanoptions()
    var observer = new MutationObserver(refreshed) // to be called if page is refreshed
    var observerConfig = { characterData: true, childList: true, subtree: true } // changes if pages is refreshed
    var observenode = ""// node to observe if page is refreshed (will be title)- main()
    var observer3 = new MutationObserver(varea) // reset the filters if video area is changed
    var observerConfig3 = { childList: true, subtree: true } // changes if video area is changed
    var observenode3 = ""// node to observe if video tag is changed (the video parent area)- getvid()
    var roomname = ""//broadcasters name- getroomname()
    var cblogo = ""// logo in video- main()
    var p = 0// running promises- info(), also used in cleaninit()
    var cimg = new Image() // for jpg players
    var fapbr = "" // moving image
    var thisfap = "" // moving elem.
    var ctitle = "" // roomtitle to detect if it's changed

    // temporary used in multiple functions
    var n = 0
    var i = 0
    var url = ""
    var br = ""
    var ofils = []
    var tags = []

    // used by drag slider window
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, x = 0, y = 0

    // things to remember from the broadcaster all set by info()
    var allow_private_shows = false
    var room_status = ""
    var hls_source = ""
    // for pm
    var pmobserver = new MutationObserver(tabpm) // to be called if pm is recieved classic mode
    var pmobserver2 = new MutationObserver(tabpm) // to be called if pm is recieved theatre mode
    var pmobserverConfig = { childList: true } // changes if pm
    var pmobservenode = ""// node to observe if pm is recieved classic mode
    var pmobservenode2 = ""// node to observe if pm is recieved theatre mode
    var tabblink = false

    test()
    // wait till container is created
    function test() {
        if (document.getElementsByClassName("photovideos-container")[0]) {
            container = document.getElementsByClassName("photovideos-container")[0].parentNode.children[1]
            n = 0
            setTimeout(function () { test2() }, 100)
        } else {
            n++
            if (n == 100) {
                window.addEventListener('visibilitychange', test, { capture: true, once: true }) // on request
                return
            }
            setTimeout(function () { test() }, 100)
        }
    }
    // wait till loading is gone
    function test2() {
        if (n == 100) { return }
        if (container.innerHTML.indexOf("Loading…") != -1) {
            n++
            setTimeout(function () { test2() }, 100)
        } else {
            n = 0
            test3()
        }
    }

    // wait till bio is ready and not changing
    function test3() {
        n++
        if (n == 100) { return }
        var biocont = container.innerHTML
        setTimeout(function () {
            if (biocont == container.innerHTML) {
                main()
            } else {
                test3()
            }
        }, 100)
    }

    function main() {
        //first get some locations
        tadd = document.getElementsByTagName("div")[0]
        topbar = document.getElementById("nav")
        observenode = document.getElementsByTagName("head")[0]
        ctitle = document.title
        tags = document.getElementsByTagName("span")
        buttons = document.getElementById("roomTabs").firstChild
        tags = document.getElementsByTagName("a")
        for (n = 0; n < tags.length; n++) {
            if (tags[n].href.indexOf("/followed-cams/") != -1) {
                if (followbutt === "") {
                    followbutt = tags[n].parentNode
                    break
                }
            }
        }
        vsel = document.getElementById("video-mode").parentNode.parentNode

        getvid()
        getroomname()

        tags = varea().parentNode.parentNode.getElementsByTagName("img")
        for (n = 0; n < tags.length; n++) {
            if (tags[n].src.indexOf("/logo") != -1) {
                cblogo = tags[n]
                break
            }
        }

        // do some actions
        removeadds()
        cleanoptions()
        makebutton()
        linkfix()
        imgfix()
        fullvid()
        cleaninit()
        makefollowmove()
        info()
        pmlistner()
        observer.observe(observenode, observerConfig)
    }

    //-----------------functions in random order
    function pmlistner() {
        setTimeout(function () {
            pmobservenode = document.getElementById('pm-tab-default')//split mode
            pmobservenode2 = document.getElementById('pm-tab-fvm')// full video mode
            pmobserver.observe(pmobservenode, pmobserverConfig)
            pmobserver2.observe(pmobservenode2, pmobserverConfig)
        }, 2000)
    }

    //PM in tab
    function tabpm() {
        if (document.visibilityState == "visible") { return }//tab is in focus, do nothing
        if ((pmobservenode.innerHTML == "PM") || (pmobservenode2.innerHTML == "PM")) { return }// if 1 of 2 is only "PM" then pm tab is open
        if (tabblink == true) { return }// already blinking
        tabblink = true
        tabblinker()
    }

    function tabblinker() {
        if (document.title == "PM !! PM") {
            document.title = "!! PM !!"
        } else {
            document.title = "PM !! PM"
        }
        if (document.visibilityState != "visible") { // tab out focus
            setTimeout(tabblinker, 500)
        } else {// tab became in focus
            document.title = ctitle
            tabblink = false
        }
    }

    // to make followed thumbs move
    function makefollowmove() {
        followbutt.addEventListener("mouseup", followmove)
    }

    function followmove() {
        tags = followbutt.getElementsByTagName("img")
        for (n = 0; n < tags.length; n++) {
            tags[n].addEventListener("mouseenter", moveimg)
            tags[n].addEventListener("mouseleave", moveimgstop)
        }
    }

    //get the name of thumb and set load event
    function moveimg() {
        fapbr = this.src.split("/")[4].split("?")[0]
        thisfap = this
        i = 0
        cimg.addEventListener("load", regetimg)
        cimg.src = "https://cbjpeg.stream.highwebmedia.com/minifwap/" + fapbr + "?" + new Date().getTime()
    }

    function regetimg() {
        i++
        if (i > 500) { moveimgstop() }// ~125 seconds max for followed
        thisfap.src = cimg.src
        setTimeout(function () { cimg.src = "https://cbjpeg.stream.highwebmedia.com/minifwap/" + fapbr + "?" + new Date().getTime() }, 150)
    }

    //stop refreshing the thumb
    function moveimgstop() {
        cimg.removeEventListener("load", regetimg)
    }

    // link to fullvideo mode
    function fullvid() {
        if (vsel !== "") {
            var newelem = document.createElement('span')
            newelem.innerHTML = '<span style="color: rgb(73, 73, 73); margin: 0px 4px;">|</span><a href="/fullvideo/?b=' + roomname + '" style="color: rgb(10, 90, 131);">Full Video Mode</a>'
            newelem.id = "vsel"
            vsel.appendChild(newelem)
        }
    }

    // set version and remove logo
    function removeadds() {
        var newelem = document.createElement('div')
        newelem.style.position = "absolute"
        newelem.style.top = "10px"
        newelem.style.left = "255px"
        newelem.style.fontSize = "12px"
        newelem.style.color = "#0b5d81"
        newelem.style.fontWeight = "bold"
        newelem.id = "update"
        newelem.innerHTML = "Chaturbate Theater Mode Clean V" + GM_info.script.version + " Made By Ladroop"
        tadd.appendChild(newelem)

        if (cblogo !== "") {
            cblogo.style.display = "none"
        }
    }

    // get the name of the broadcaster
    function getroomname() {
        roomname = document.location.href.split("/")[3]
        if (roomname == "theatermode") {
            roomname = document.location.href.split("?b=")[1]
        }
        // a weird bug that appears if you go from theatermode userlist to a no access room
        if (roomname.indexOf("/") != -1) {
            roomname = roomname.split("/")[0]
        }
    }

    // get the video area id , default xmovie
    function getvid() {
        if (!document.getElementById("xmovie")) {
            vareaid = document.getElementsByTagName("video")[0].id
            //start observer in html5 video
            observenode3 = document.getElementsByTagName("video")[0].parentNode
            observer3.observe(observenode3, observerConfig3)
        } else {
            vareaid = "xmovie"
            //start observer in flash video
            observenode3 = document.getElementById("xmovie").parentNode
            observer3.observe(observenode3, observerConfig3)
        }
    }

    // called by mutationobserver if page is refreshed
    function refreshed() {
        if (ctitle == document.title) { return } // even set by ??
        if (document.title.indexOf("PM") != -1) { return } // event fired by PM
        ctitle = document.title
        observer.disconnect()
        getroomname()
        n = 0
        document.getElementById("clean").style.display = "none"
        document.getElementById("controls").style.display = "none"
        document.getElementById("controls").style.marginTop = "30px"
        document.getElementById("controls").style.right = "320px"
        if (vsel !== "") {
            document.getElementById("vsel").parentNode.removeChild(document.getElementById("vsel"))
        }
        // here check if bio is ready again
        retest2()
    }

    // recheck till loading is gone
    function retest2() {
        if (n == 100) { return }
        if (container.innerHTML.indexOf("Loading…") != -1) {
            n++
            setTimeout(function () { retest2() }, 100)
        } else {
            retest3()
        }
    }

    // wait if bio is ready - part of refreshed()
    function retest3() {
        var biocont = container.innerHTML
        setTimeout(function () {
            if (biocont == container.innerHTML) {
                reclean()
            } else {
                retest3()
            }
        }, 100)
    }

    // clean only bio again after refesh - part of refreshed()
    function reclean() {
        vreset()
        linkfix()
        imgfix()
        fullvid()
        cleaninit()
        info()
        observer.observe(observenode, observerConfig)
    }

    // clean the option bar and see if you're logged in make back button if cookie is set
    function cleanoptions() {
        tags = topbar.getElementsByTagName("a")
        for (n = 1; n < tags.length; n++) {
            tags[n].style.display = "none"
            if (tags[n].href.indexOf('/login') != -1) {
                loggedin = false
                tags[n].style.display = "block"
            }
            if (tags[n].href.split("/")[3] == "b") {
                tags[n].target = "_blank"
                tags[n].style.display = "block"
            }
            if (tags[n].href.split("/")[3] == "tipping") {
                if (readCookie("selected")) {
                    tags[n].href = readCookie("selected")
                    tags[n].innerHTML = "BACK"
                    tags[n].addEventListener('click', function () { eraseCookie("selected") })
                    tags[n].style.display = "block"
                }
            }
        }
    }

    // make all new buttons and sliders and set the video filter
    function makebutton() {
        var slistyle = "text-align: left; width: 310px;margin-right: 4px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative; top: 0px; right: 1px; float: right; border-radius: 4px; display: inline;"
        var butstyle = "margin-right: 5px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative;right: 1px;top:-4px; float: right; border-radius: 4px; cursor: pointer; display: inline;"
        var cbutstyle = "margin-right: 5px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative;right: 1px; float: right; border-radius: 4px; cursor: pointer; display: inline;"

        container.parentNode.style.overflow = "visible"

        var newelem = document.createElement('span')
        newelem.setAttribute("style", butstyle)
        newelem.innerHTML = "CLEAN PROFILE = ON"
        newelem.style.width = "125px"
        newelem.style.display = "none"
        newelem.id = "clean"
        newelem.addEventListener("click", cleancookie)
        buttons.appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", butstyle)
        newelem.innerHTML = "VIDEO CONTROLS ON/OFF"
        newelem.addEventListener("click", vcontrol)
        newelem.id = "vcontr"
        buttons.appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", butstyle)
        newelem.innerHTML = "RELOAD INFO"
        newelem.addEventListener("click", newinfo)
        newelem.id = "infore"
        buttons.appendChild(newelem)

        newelem = document.createElement('div')
        newelem.id = "controls"
        newelem.style.display = "none"
        newelem.style.position = "absolute"
        newelem.style.backgroundColor = "rgb(255, 255, 211)"
        newelem.style.border = "2px solid rgb(244, 115, 33)"
        newelem.style.borderRadius = "6px"
        newelem.style.width = "340px"
        newelem.style.padding = "12px"
        newelem.style.marginTop = "30px"
        newelem.style.right = "320px"
        newelem.style.zIndex = "999"
        buttons.appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", cbutstyle)
        newelem.innerHTML = "MIRROR VIDEO"
        newelem.addEventListener("click", mirror)
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", cbutstyle)
        newelem.innerHTML = "INVERT VIDEO"
        newelem.addEventListener("click", invert)
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", cbutstyle)
        newelem.innerHTML = "DRAG"
        newelem.style.cursor = "move"
        newelem.addEventListener("mousedown", dragMouseDown)
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)
        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", slistyle)
        newelem.innerHTML = "BRIGHTNESS : <input type='range' id='myRange' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>"
        document.getElementById("controls").appendChild(newelem)
        document.getElementById("myRange").addEventListener("input", badjust)

        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)
        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", slistyle)
        newelem.innerHTML = "CONTRAST : <input type='range' id='myRange1' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>"
        document.getElementById("controls").appendChild(newelem)
        document.getElementById("myRange1").addEventListener("input", cadjust)

        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)
        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", slistyle)
        newelem.innerHTML = "SATURATION : <input type='range' id='myRange2' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>"
        document.getElementById("controls").appendChild(newelem)
        document.getElementById("myRange2").addEventListener("input", sadjust)

        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)
        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", slistyle)
        newelem.innerHTML = "HUE : <input type='range' id='myRange3' min=180 max=540 value=360 style='width: 200px;height:11px;cursor: pointer;float: right;'>"
        document.getElementById("controls").appendChild(newelem)
        document.getElementById("myRange3").addEventListener("input", hadjust)

        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)
        newelem = document.createElement('br')
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", cbutstyle)
        newelem.innerHTML = "HIDE CONTROL PANEL"
        newelem.addEventListener("click", vcontrol)
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('span')
        newelem.setAttribute("style", cbutstyle)
        newelem.innerHTML = "RESET ALL"
        newelem.addEventListener("click", vreset)
        document.getElementById("controls").appendChild(newelem)

        newelem = document.createElement('input')
        newelem.id = "copytext"
        newelem.type = "text"
        newelem.style.display = "none"
        buttons.appendChild(newelem)

        vreset() // --
    }

    // fix the redirection links in the profile
    function linkfix() {
        tags = container.getElementsByTagName('a')
        for (i = 0; i < tags.length; i++) {
            if (tags[i].href.indexOf('?url=') != -1) {
                tags[i].href = decodeURIComponent(tags[i].href).split("?url=")[1]
            }
        }
    }

    // hide the lock on paid profile pictures
    function imgfix() {
        tags = container.getElementsByTagName('img')
        for (i = 0; i < tags.length; i++) {
            if (tags[i].src.indexOf('/locked_rectangle') != -1) {
                tags[i].style.display = "none"
            }
        }
    }

    // get basic info, hide video controls in an offline room
    function info() {
        url = "https://" + location.hostname + "/api/chatvideocontext/" + roomname + "/"
        p++
        fetch(url, { credentials: "same-origin" }).then(
            function (response) {
                if (response.status !== 200) {
                    p--
                    return
                }
                response.json().then(function (data) {
                    allow_private_shows = data.allow_private_shows
                    if ((room_status === "") && (data.room_status == "offline")) {
                        document.getElementById("vcontr").style.display = "none"
                    }
                    room_status = data.room_status
                    hls_source = data.hls_source.split("?")[0] // if you know why you can change this
                    //                   hls_source=data.hls_source;
                    if (data.low_satisfaction_score) {
                        wprof("Satisfaction score:", "<font color=#CC0000>LOW !!!</font>")
                    }
                    if (data.is_moderator) {
                        wprof("Moderator", "Yes, don't silence me")
                    }
                    if (room_status == "offline") {
                        wprof("Last room topic:", data.room_title)
                        wprof("Video:", "Offline")
                    }
                    if (data.tips_in_past_24_hours !== 0) {
                        wprof("You tipped:", data.tips_in_past_24_hours + " Tk/24h")
                    }
                    if (!data.is_age_verified) {
                        wprof("Status:", "Exhibitionist")
                        p--
                        getnotes()
                        return
                    }
                    if (allow_private_shows) {
                        if (data.spy_private_show_price !== 0) {
                            wprof("Spy on private:", data.spy_private_show_price + " Tk/min")
                        } else {
                            wprof("Spy on private:", "Disabled")
                        }
                    }
                    if (!loggedin) {
                        if (allow_private_shows) {
                            wprof("Privateshow:", data.private_show_price + " Tk/min")
                        } else {
                            wprof("Privateshow:", "Disabled")
                        }
                    }
                    p--
                    // you can only get time and recording and notes if logged in
                    if (loggedin) {
                        getpvt()
                    }
                })
            })
    }

    // get private costs and info - part of info()
    function getpvt() {
        if (allow_private_shows) {
            url = "https://" + location.hostname + "/tipping/private_show_tokens_per_minute/" + roomname + "/"
            p++
            fetch(url, { credentials: "same-origin" }).then(
                function (response) {
                    if (response.status !== 200) {
                        p--
                        return
                    }
                    response.json().then(function (data) {
                        wprof("Minimum private:", data.private_show_minimum_minutes + " Minutes")
                        wprof("Private recording:", data.recordings_allowed ? "Yes" : "No")
                        wprof("Privateshow:", data.price + " Tk/min")
                        p--
                        getnotes()
                    })
                })
        } else {
            wprof("Privateshow:", "Disabled")
            getnotes()
        }
    }

    // get notes
    function getnotes() {
        url = "https://" + location.hostname + "/api/notes/for_user/" + roomname + "/"
        p++
        fetch(url, { credentials: "same-origin" }).then(
            function (response) {
                if (response.status !== 200) {
                    p--
                    return
                }
                response.json().then(function (data) {
                    if (data.text != null) {
                        wprof("Personal notes:", "<textarea readonly style='width: 400px; height: 30px; line-height: 14px; border-width: 1px; border-style: solid; border-color: rgb(172, 172, 172); border-radius: 4px; resize: none; padding: 7px 8px; overflow: auto;background-color: rgb(221, 233, 245);'>" + data.text + "</textarea>")
                    }
                    p--
                })
            })
    }

    //mark elements that can be hidden in the profile and call cleanup()
    function cleaninit() {
        var taglist = ["a", "p", "i", "strong", "b", "u", "ul", "ol", "li", "h1", "h2", "h3", "img", "font", "br", "span"]
        for (i = 0; i < taglist.length; i++) {
            tags = container.getElementsByTagName(taglist[i])
            for (n = 0; n < tags.length; n++) {
                if (tags[n].style.position) {
                    if ((tags[n].style.position == "absolute") || (tags[n].style.position == "fixed")) {
                        if (tags[n].getAttribute("rel")) {
                            tags[n].setAttribute("name", "clean")
                            p++
                        }
                    }
                }
            }
        }
        if (p !== 0) {
            document.getElementById("clean").style.display = "block"
            cleanup()
            p = 0
        }
    }

    //-------------- later called functions

    //-- in html5 player they keep add/removing the video node so i need a dynamic reference
    function varea() {
        var vnode = document.getElementById(vareaid)
        vnode.style.filter = vfilter
        vnode.style.transform = vmirror
        return vnode
    }

    // brightness adjust
    function badjust() {
        br = document.getElementById("myRange").value
        ofils = varea().style.filter.split(" ")
        vfilter = "brightness(" + br + "%) " + ofils[1] + " " + ofils[2] + " " + ofils[3] + " " + ofils[4]
        varea()
    }

    // contrast adjust
    function cadjust() {
        br = document.getElementById("myRange1").value
        ofils = varea().style.filter.split(" ")
        vfilter = ofils[0] + " contrast(" + br + "%) " + ofils[2] + " " + ofils[3] + " " + ofils[4]
        varea()
    }

    // saturation adjust
    function sadjust() {
        br = document.getElementById("myRange2").value
        ofils = varea().style.filter.split(" ")
        vfilter = ofils[0] + " " + ofils[1] + " " + ofils[2] + " saturate(" + br + "%) " + ofils[4]
        varea()
    }

    // hue adjust
    function hadjust() {
        br = document.getElementById("myRange3").value
        if (br > 359) { br = br - 360 }
        ofils = varea().style.filter.split(" ")
        vfilter = ofils[0] + " " + ofils[1] + " " + ofils[2] + " " + ofils[3] + " hue-rotate(" + br + "deg)"
        varea()
    }

    // invert video
    function invert() {
        ofils = varea().style.filter.split(" ")
        br = " invert(100%) "
        if (ofils[2] == "invert(100%)") { br = " invert(0%) " }
        vfilter = ofils[0] + " " + ofils[1] + br + ofils[3] + " " + ofils[4]
        varea()
    }

    // mirror video
    function mirror() {
        if (varea().style.transform == "none") {
            vmirror = "matrix(-1, 0, 0, 1, 0, 0)"
            varea()

        } else {
            vmirror = "none"
            varea()
        }
    }

    // reset all video adjustments
    function vreset() {
        vfilter = "brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)"
        vmirror = "none"
        varea()
        document.getElementById("myRange").value = 100
        document.getElementById("myRange1").value = 100
        document.getElementById("myRange2").value = 100
        document.getElementById("myRange3").value = 360
    }

    // video controls on/off
    function vcontrol() {
        if (document.getElementById("controls").style.display == "block") {
            document.getElementById("controls").style.display = "none"
        } else {
            document.getElementById("controls").style.display = "block"
        }
    }

    // pull and drag functions
    // when clicked
    function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
    }

    // when moved while clicked- part of dragMouseDown()
    function elementDrag(e) {
        e = e || window.event
        e.preventDefault()
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        x = parseInt(document.getElementById("controls").style.right)
        y = parseInt(document.getElementById("controls").style.marginTop)
        if ((pos3 >= 110) && (pos3 <= window.innerWidth - 324)) {
            document.getElementById("controls").style.right = (x + pos1) + "px"
        }
        if ((pos4 >= 20) && (pos4 <= window.innerHeight - 20)) {
            document.getElementById("controls").style.marginTop = (y - pos2) + "px"
        }
    }

    // stop moving when mouse button is released- part of dragMouseDown()
    function closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
    }

    // swap profile cleanup cookie and call cleanup()
    function cleancookie() {
        if (readCookie("pclean")) {
            eraseCookie("pclean")
        } else {
            createCookie("pclean", 1, 30)
        }
        cleanup()
    }

    // hide or unhide marked elements in profile according to cookie
    function cleanup() {
        var claction = !readCookie("pclean")
        if (claction) {
            document.getElementById("clean").innerHTML = "CLEAN PROFILE = ON"
        } else {
            document.getElementById("clean").innerHTML = "CLEAN PROFILE = OFF"
        }
        tags = document.getElementsByName("clean")
        for (i = 0; i < tags.length; i++) {
            if (claction) {
                tags[i].style.display = "none"
            } else {
                tags[i].style.display = "block"
            }
        }
    }

    // write a line in the profile at the top
    function wprof(col1, col2) {
        var newdiv = document.createElement('div')
        newdiv.style.fontWeight = "normal"
        newdiv.style.margin = "9px 0px"
        newdiv.setAttribute("name", "info")
        var newspan = document.createElement('span')
        newspan.style.display = "inline-block"
        newspan.style.color = "rgb(0, 0, 139)"
        newspan.style.fontFamily = "UbuntuMedium, Helvetica, Arial, sans-serif"
        newspan.style.fontSize = "14px"
        newspan.style.width = "150px"
        newspan.innerHTML = col1
        newdiv.appendChild(newspan)
        newspan = document.createElement('span')
        newspan.style.color = "rgb(51, 51, 51)"
        newspan.style.fontSize = "14px"
        newspan.style.width = "87.5%"
        newspan.innerHTML = col2
        newdiv.appendChild(newspan)
        var referenceNode = container.getElementsByTagName("h1")[0]
        referenceNode.parentNode.insertBefore(newdiv, referenceNode.nextSibling)
    }

    // removes the extra info in the profile and gets it again , copy hls to clipboard
    function newinfo() {
        if (p !== 0) { alert("Slow down !"); return }
        copyclipboard(hls_source)
        tags = document.getElementsByName("info")
        for (i = tags.length - 1; i >= 0; i--) {
            tags[i].parentNode.removeChild(tags[i])
        }
        info()
    }

    // copy cdata to clipboard (only works after user interaction)
    function copyclipboard(cdata) {
        document.getElementById("copytext").value = cdata
        document.getElementById("copytext").style.display = "block"
        document.getElementById("copytext").select()
        document.execCommand("copy")
        document.getElementById("copytext").style.display = "none"
    }

    // cookie functions
    function createCookie(name, value, days, domain) {
        var expires = ""
        if (domain) {
            domain = ";domain=." + domain
        } else {
            domain = ""
        }
        if (days) {
            var date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            expires = "; expires=" + date.toGMTString()
        }
        document.cookie = name + "=" + value + expires + "; path=/" + domain
    }

    function readCookie(name) {
        var nameEQ = name + "="
        var ca = document.cookie.split(';')
        for (i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length)
            }
        }
        return null
    }

    function eraseCookie(name, domain) {
        createCookie(name, "", -1, domain)
    }

})()