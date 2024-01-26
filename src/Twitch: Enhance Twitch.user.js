// ==UserScript==
// @name         Twitch: Enhance Twitch
// @description  Auto click claim bonus (channel points and moments), Show images/video in chat, always source quality, hide offline channels and more
// @author       Bum
// @version      3.1.3
// @namespace    https://egore.url.lol/userscripts
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.twitch.tv/*
// @match        https://clips.twitch.tv/*
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @grant        none
// ==/UserScript==

var displayImages = "true"
var displayVideos = "true"
var autoPlayClips = "false"
var hideHypeTrain = "false"
var hideBitGiftLeaderBoard = "false"
var hideUnfollowButton = "false"
var ultraWide = "true"
var hideOfflineChannels = "true"
var hideRecommendedChannels = "false"
var hideTags = "false"
var hideSubscribeText = "false"
var alwaysSourceQuality = "true"
var hideFriendsList = "false"
var hideTheseThots = "false"
var hideExtensions = "true"
var hide7Tvtooltip = "true"
var bigger7tvPanel = "true"
var changeKekheim = "true"
var changePogBones = "true"
var testFix7tv = "false"

if (localStorage.getItem("changePogBones") != null) {
    changePogBones = localStorage.getItem("changePogBones")
}
if (localStorage.getItem("changeKekheim") != null) {
    changeKekheim = localStorage.getItem("changeKekheim")
}
if (localStorage.getItem("hide7Tvtooltip") != null) {
    hide7Tvtooltip = localStorage.getItem("hide7Tvtooltip")
}
if (localStorage.getItem("bigger7tvPanel") != null) {
    bigger7tvPanel = localStorage.getItem("bigger7tvPanel")
}
if (localStorage.getItem("hideSubscribeText") != null) {
    hideSubscribeText = localStorage.getItem("hideSubscribeText")
}
if (localStorage.getItem("hideTheseThots") != null) {
    hideTheseThots = localStorage.getItem("hideTheseThots")
}
if (localStorage.getItem("alwaysSourceQuality") != null) {
    alwaysSourceQuality = localStorage.getItem("alwaysSourceQuality")
}
if (localStorage.getItem("hideRecommendedChannels") != null) {
    hideRecommendedChannels = localStorage.getItem("hideRecommendedChannels")
}
if (localStorage.getItem("hideFriendsList") != null) {
    hideFriendsList = localStorage.getItem("hideFriendsList")
}
if (localStorage.getItem("hideTags") != null) {
    hideTags = localStorage.getItem("hideTags")
}

if (localStorage.getItem("displayImages") != null) {
    displayImages = localStorage.getItem("displayImages")
}
if (localStorage.getItem("hideOfflineChannels") != null) {
    hideOfflineChannels = localStorage.getItem("hideOfflineChannels")
}
if (localStorage.getItem("displayVideos") != null) {
    displayVideos = localStorage.getItem("displayVideos")
}
if (localStorage.getItem("autoPlayClips") != null) {
    autoPlayClips = localStorage.getItem("autoPlayClips")
}
if (localStorage.getItem("hideHypeTrain") != null) {
    hideHypeTrain = localStorage.getItem("hideHypeTrain")
}
if (localStorage.getItem("hideBitGiftLeaderBoard") != null) {
    hideBitGiftLeaderBoard = localStorage.getItem("hideBitGiftLeaderBoard")
}
if (localStorage.getItem("hideUnfollowButton") != null) {
    hideUnfollowButton = localStorage.getItem("hideUnfollowButton")
}

if (localStorage.getItem("ultraWide") != null) {
    ultraWide = localStorage.getItem("ultraWide")
}
GM_addStyle(".seventv-emote{cursor: pointer !important;}")


function hide7Tvtooltipplease() {
    //seventv-emote-tooltip-wrapper
    if (hide7Tvtooltip == "false" || hide7Tvtooltip == false)
        RemoveCssRule(".seventv-emote-tooltip-wrapper")
    else
        GM_addStyle(".seventv-emote-tooltip-wrapper{display: none !important;}")
}

function bigger7tvPanelplease() {
    if (bigger7tvPanel == "false" || bigger7tvPanel == false) {
        RemoveCssRule(".seventv-emote-menu")
        RemoveCssRule(".seventv-emote-menu-header, .seventv-emote-menu-scrollable")
    }
    else {
        GM_addStyle(".seventv-emote-menu-header, .seventv-emote-menu-scrollable{width: 600px !important;}")
        GM_addStyle(".seventv-emote-menu{left: auto !important;right: 0 !important; margin-right:10px !important;}")
    }
}

if (localStorage.getItem("hide7Tvtooltip") != null) {
    hide7Tvtooltipplease()
}
if (localStorage.getItem("bigger7tvPanel") != null) {
    bigger7tvPanelplease()
}


hideExtensions = localStorage.getItem("hideExtensions")
if (hideExtensions == "false")
    RemoveCssRule(".extensions-dock__layout, .extensions-video-overlay-size-container")
else
    GM_addStyle(".extensions-dock__layout, .extensions-video-overlay-size-container{display: none !important;}")

if (ultraWide == "true") {

    GM_addStyle(".common-centered-column{    max-width: 100%;}")
}

GM_addStyle('.oHwVV::after {    content: "";    display: block;    position: absolute;    top: 0.2rem;    bottom: 0.2rem;    left: 0.2rem;    width: 1.2rem;    height: 1.2rem;    transition-property: left;    transition-timing-function: ease;    transition-duration: var(--timing-short);    border-radius: var(--border-radius-rounded);    background-color: var(--color-background-toggle-handle);}')

GM_addStyle('.ScToggleInput-sc-796zbf-1:checked + .oHwVV::after {    content: "";    left: calc((100% - 1.2rem) - 0.2rem);    background-color: var(--color-background-toggle-checked);}')
GM_addStyle('.ScToggleInput-sc-796zbf-1:checked + .oHwVV::before {    border-width: 0px 0px 2px 2px;    border-style: solid;    border-color: var(--color-text-toggle-checked-icon);    display: block;    position: absolute;    top: 0.7rem;    left: 0.8rem;    width: 0.7rem;    height: 0.3rem;    transform: translate3d(-50%, -50%, 0px) rotate(-45deg);    content: "";}')

GM_addStyle('.oHwVV {    display: inline-block;    position: relative;    order: 0;    width: 3.5rem;    height: 2rem;    content: "";    cursor: pointer;    vertical-align: bottom;    border-width: 2px;    border-style: solid;    border-radius: 1rem;    transition-property: background-color;    transition-timing-function: ease;    transition-duration: var(--timing-short);    border-color: var(--color-border-toggle);    background-color: var(--color-background-toggle);}')

GM_addStyle('.ScToggleInput-sc-796zbf-1:checked + .oHwVV {    border-color: var(--color-border-toggle-checked);}')


GM_addStyle('.xAfNg {    display: flex !important;    -webkit-box-align: center !important;    align-items: center !important;}')
GM_addStyle('.fjMXDc {    -webkit-box-flex: 1 !important;    flex-grow: 1 !important;    margin-right: 2rem !important;}')
GM_addStyle('.kCtfmS {    display: flex;    position: relative;    flex-direction: column;    line-height: 2rem;}')
GM_addStyle('.doVmsZ {    position: absolute;    opacity: 0;}')

GM_addStyle(`.Layout-sc-nxg1ff-0.chat-line__status {
    display: none;
}
`)

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyle") || (function () {
        const style = document.createElement('style')
        style.type = 'text/css'
        style.id = "GM_addStyle"
        document.head.appendChild(style)
        return style
    })()
    const sheet = style.sheet
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length)
}

function hideSubButton() {

    let btnSub = $('button[data-a-target="subscribe-button"]')
    if (btnSub.length == 0)
        btnSub = $('button[data-a-target="subscribed-button"]')
    var isReady = btnSub.length > 0
    if (!isReady) {
        setTimeout(hideSubButton, 300)
        return
    }

    btnSub.find(".tw-mg-l-05").attr("style", "display: none !important")
    btnSub.find('div[data-a-target="tw-core-button-label-text"]').attr("style", "display: none !important")
}
$(window).on("load", function () {
    if (hideTags == "true")
        $(".tw-tag").attr("style", "display:none !important")
    if (hideSubscribeText == "true") {
        hideSubButton()
    }
    AlwaysSourceQuality()
})

function AlwaysSourceQuality() {
    var hidden, state, visibilityChange
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden"
        visibilityChange = "visibilitychange"
        state = "visibilityState"
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden"
        visibilityChange = "mozvisibilitychange"
        state = "mozVisibilityState"
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden"
        visibilityChange = "msvisibilitychange"
        state = "msVisibilityState"
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden"
        visibilityChange = "webkitvisibilitychange"
        state = "webkitVisibilityState"
    }
    if (alwaysSourceQuality == "true") {
        Object.defineProperty(document, hidden, { value: false, writable: false })
        Object.defineProperty(document, state, { value: 'visible', writable: false })
        document.addEventListener(visibilityChange, function (e) {
            window.localStorage.setItem('s-qs-ts', Math.floor(Date.now()))
            window.localStorage.setItem('video-quality', '{"default":"chunked"}')
            e.stopImmediatePropagation()
        }, false)
    }
    else {
        delete document[hidden]
        delete document[state]
    }
}
function changeKekheimPlease() {
    /*$('textarea[data-a-target="chat-input"]').on('change keyup paste', function() {
        $(this).val($(this).val().replace("KEKHeim", "KEKW"));
    });*/
}
function changePogBonesPlease() {
    /*$('textarea[data-a-target="chat-input"]').on('change keyup paste', function() {
        $(this).val($(this).val().replace("PogBones", "PogChamp"));
    });*/
}

jQuery(function ($) {

    var _oldShow = $.fn.show

    $.fn.show = function (speed, oldCallback) {
        return $(this).each(function () {
            var obj = $(this),
                newCallback = function () {
                    if ($.isFunction(oldCallback)) {
                        oldCallback.apply(obj)
                    }
                    obj.trigger('afterShow')
                }


            // now use the old function to show the element passing the new callback
            _oldShow.apply(obj, [speed, newCallback])
        })
    }
})

function RemoveCssRule(css) {
    const style = document.getElementById("GM_addStyle") || (function () {
        const style = document.createElement('style')
        style.type = 'text/css'
        style.id = "GM_addStyle"
        document.head.appendChild(style)
        return style
    })()
    const sheet = style.sheet
    for (var i = 0; i < sheet.cssRules.length; i++) {
        if (sheet.cssRules[i].selectorText == css) {
            sheet.deleteRule(i)
        }
    }
}

function LoadTwitchEnhance() {
    AddTheMenu()
    $('body').click(function (evt) {
        $(".fixMenuAppended").removeClass("fixMenuAppended")
    })
    var config = { attributes: false, childList: true, subtree: true }


    var SupportedImageFormats = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    var SupportedVideoFormats = [".mp4", ".webm"]

    var maxHeight = "240"
    var maxWidth = "300"

    GM_addStyle("iframe[class^='imgur-embed']{max-width: " + maxWidth + "px !important;}")
    GM_addStyle("svg[class*='logotwitchwordmark']{display: none !important;}")
    if (hideHypeTrain == "true")
        GM_addStyle(".community-highlight-stack__scroll-area--disable{display: none !important;}")
    if (hideBitGiftLeaderBoard == "true")
        GM_addStyle(".channel-leaderboard{display: none !important;}")
    GM_addStyle(".btnRefreshEnhance button{height: 15px; width: 100%}")
    GM_addStyle(".chat-settings{    max-height: 500px !important;    overflow: hidden !important;}")

    function isSupportedImage(url) {
        var length = SupportedImageFormats.length
        while (length--) {
            if (url.indexOf(SupportedImageFormats[length]) != -1) {
                return true
            }
        }
        return false
    }
    function isSupportedVideo(url) {
        var length = SupportedVideoFormats.length
        while (length--) {
            if (url.indexOf(SupportedVideoFormats[length]) != -1) {
                return true
            }
        }
        return false
    }

    function alterNode(node) {
        var thisUrl = $(node).text()
        if ((displayImages == "true" || displayImages == true) && isSupportedImage(thisUrl)) {
            $(node).html("<br><img src='" + thisUrl + "' width='" + maxWidth + "px'/>")
            $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
        }
        else if ((displayVideos == "true" || displayVideos == true) && thisUrl.indexOf("www.youtube") > 0) {
            if (thisUrl.indexOf("watch") > 0) {
                var videoId = thisUrl.match('v=([^&]*)')[1]
                $(node).html('<br><iframe width="' + maxWidth + '" height="' + maxHeight + '" src="https://www.youtube.com/embed/' + videoId + '"></iframe>')
                $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
            }
        }
        else if ((displayVideos == "true" || displayVideos == true) && isSupportedVideo(thisUrl)) {
            $(node).html('<br><video width="' + maxWidth + '" height="' + maxHeight + '" controls autoplay muted><source src="' + thisUrl + '" type="video/mp4"></video>')
            $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
        }
        else if ((displayImages == "true" || displayImages == true) && thisUrl.indexOf("https://gyazo.com") > -1) {
            $(node).html("<br><img src='" + thisUrl.replace("https://gyazo.com", "https://i.gyazo.com") + ".png' width='" + maxWidth + "px'/>")
            $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')

        }
        else if ((displayImages == "true" || displayImages == true) && thisUrl.indexOf("imgur") > -1) {
            var imgurId = ""
            if (thisUrl.indexOf("gallery") > -1) {
                imgurId = thisUrl.match('gallery\/([^#]*)')[1]
                try {
                    $(node).html('<div style="width:200"><blockquote class="imgur-embed-pub" lang="en" data-id="a/' + imgurId + '"><a href="//imgur.com/' + imgurId + '" ></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>')
                    $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
                }
                catch (err) {
                }
            }
            else {
                imgurId = thisUrl.match('a\/([^#]*)')[1]
                try {
                    $(node).html('<div style="width:200"><blockquote class="imgur-embed-pub" lang="en" data-id="a/' + imgurId + '"><a href="//imgur.com/' + imgurId + '" ></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>')
                    $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
                }
                catch (err) {
                }
            }
            parentToScroll.animate({ scrollTop: parentToScroll.scrollTop() + 500 }, 'slow')
        }
        else if ((displayVideos == "true" || displayVideos == true) && thisUrl.indexOf("clips.twitch.tv") > -1) {
            var clipId = thisUrl.match('.tv\/(.*)')[1]
            $(node).html('<iframe src="https://clips.twitch.tv/embed?clip=' + clipId + '&autoplay=' + autoPlayClips + '&muted=true&parent=twitch.tv" frameborder="0"   allowfullscreen="true" height="' + maxHeight + '" width="' + maxWidth + '"></iframe>')
            $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
        }
        else if ((displayVideos == "true" || displayVideos == true) && thisUrl.indexOf("twitch") > -1 && thisUrl.indexOf("clip") > -1) {
            var clipId1 = thisUrl.match('clip\/([^?]*)')[1]
            $(node).html('<iframe src="https://clips.twitch.tv/embed?clip=' + clipId1 + '&autoplay=' + autoPlayClips + '&muted=true&parent=twitch.tv" frameborder="0"   allowfullscreen="true" height="' + maxHeight + '" width="' + maxWidth + '"></iframe>')
            $(".enhanceAppended").find('.simplebar-scroll-content').animate({ scrollTop: $(".enhanceAppended").find('.simplebar-scroll-content').scrollTop() + 1000 }, 'fast')
        }
    }
    // Callback function to execute when mutations are observed
    var callback = function (mutationsList, observer) {
        for (var mutation of mutationsList) {
            mutation.addedNodes.forEach(function (node) {
                if (node.classList != undefined && node.classList.contains('link-fragment')) {
                    alterNode(node)
                }
                if (node.classList != undefined && node.classList.contains('seventv-message-context')) {

                    alterNode($(node).find("a"))
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('.link-fragment').forEach(function (node) {
                        alterNode(node)
                    })
                    node.querySelectorAll('.text-fragment').forEach(function (node) {
                        alterNode(node)
                    })
                    node.querySelectorAll('.seventv-message-context').forEach(function (node) {
                        alert("yep")
                        alterNode(node)
                    })
                }
            })
        }
    }

    var callbackClaim = function (mutationsList, observer) {
        for (var mutation of mutationsList) {
            $(".claimable-bonus__icon").click()
        }
    }


    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback)
    function _appendObserver() {
        let isReady = $("div.chat-list--default").length > 0
        if (!isReady) {
            setTimeout(_appendObserver, 500)
            return
        }
        if (!$("div.chat-list--default").hasClass("enhanceAppended")) {
            $("div.chat-list--default").addClass("enhanceAppended")
            var targetNode = $("div.chat-list--default").get(0)
            var targetNode2 = $(".chat-room").get(0)
            // Start observing the target node for configured mutations

            if (targetNode != undefined) {
                observer.observe(targetNode, config)
            }
            if (changeKekheim == "true" || changeKekheim == true) {
                changeKekheimPlease()
            }
            if (changePogBones == "true" || changePogBones == true) {
                changePogBonesPlease()
            }
        }
    }
    _appendObserver()

    var targetNodeRoot = document.getElementById('root')
    var configRoot = { attributes: false, childList: true, subtree: true }

    var callbackRoot = function (mutationsList, observer) {
        $(".claimable-bonus__icon").click()
        $(".chat-private-callout__header-segment").find('div:contains("Claim")').click()
        $('div:contains("Reload")').click()
        _appendObserver()
        if (hideTags == "true")
            $(".tw-tag").attr("style", "display:none !important")
        if (hideOfflineChannels == "true") {
            for (var mutation of mutationsList) {
                mutation.addedNodes.forEach(function (node) {
                    //side-nav-card__avatar

                    var a7tvGarbageImgHandlefml = $(node).find("img.chat-line__message--emote")

                    if (testFix7tv == "true" || testFix7tv == true) {
                        if (a7tvGarbageImgHandlefml.length > 0) {
                            if (a7tvGarbageImgHandlefml.attr("src").includes("static-cdn.jtvnw.net/emoticons/v2")) {
                                var srcOfThisGarbage = a7tvGarbageImgHandlefml.attr("src")
                                console.log("trying to fix now " + srcOfThisGarbage)

                                srcOfThisGarbage = srcOfThisGarbage.replace("static-cdn.jtvnw.net/emoticons/v2", "cdn.7tv.app/emote")
                                srcOfThisGarbage = srcOfThisGarbage.replace("default/dark/1.0", "1x")

                                $.ajax({
                                    url: srcOfThisGarbage, //be sure to check the right attribute
                                    success: function () { //pass an anonymous callback function
                                        // nothing to do
                                        console.log("is 7tv emote")
                                        a7tvGarbageImgHandlefml.attr("src", srcOfThisGarbage)
                                    },
                                    error: function (jqXHR, status, er) {
                                        //only set the error on 404
                                        console.log("trying to fix now with frankerface")
                                        srcOfThisGarbage = srcOfThisGarbage.replace("static-cdn.jtvnw.net/emoticons/v2", "cdn.betterttv.net/frankerfacez_emote")
                                        srcOfThisGarbage = srcOfThisGarbage.replace("default/dark/1.0", "1")
                                        $.ajax({
                                            url: srcOfThisGarbage, //be sure to check the right attribute
                                            success: function () { //pass an anonymous callback function
                                                // nothing to do
                                                console.log("is frankerface emote")
                                                a7tvGarbageImgHandlefml.attr("src", srcOfThisGarbage)
                                            },
                                            error: function (jqXHR, status, er) {
                                                //only set the error on 404
                                                console.log("trying to fix now with frankerface")
                                                srcOfThisGarbage = srcOfThisGarbage.replace("static-cdn.jtvnw.net/emoticons/v2", "cdn.betterttv.net/emote")
                                                srcOfThisGarbage = srcOfThisGarbage.replace("default/dark/1.0", "1x")
                                                a7tvGarbageImgHandlefml.attr("src", srcOfThisGarbage)
                                                //you could perform additional checking with different classes
                                                //for other 400 and 500 level HTTP status codes.
                                            }
                                        })
                                        //you could perform additional checking with different classes
                                        //for other 400 and 500 level HTTP status codes.
                                    }
                                })
                            }
                        }

                    }
                    var channelStatus = $(node).find(".side-nav-card__avatar")
                    var offlineChannels = $(node).find(".side-nav-card__avatar--offline")
                    if (offlineChannels.length > 0) {
                        var parentStatus = offlineChannels.parent()
                        parentStatus.attr("style", "display:none !important;")
                    }
                    if (channelStatus.length > 0) {
                        var elemToObserve = channelStatus.get(0)
                        var observer = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                var channelIsOffline = mutation.target.classList.contains('side-nav-card__avatar--offline')
                                var parentStatus = $($(mutation)[0].target).parent()
                                if (channelIsOffline) {
                                    parentStatus.attr("style", "display:none !important;")
                                }
                                else {
                                    parentStatus.attr("style", "display:inherit !important;")
                                    $('button[data-test-selector="ShowMore"]').click()
                                }
                            })
                        })
                        observer.observe(elemToObserve, { attributes: true })
                    }
                })
            }
        }

        if (window.location.href == "https://www.twitch.tv/") {
            var videoMainPage = $(".featured-content-carousel:not(.fixVideoPausedOnce)").find("video")
            if (videoMainPage.length > 0) {
                videoMainPage.get(0).pause()
                videoMainPage.parent().click(function () {
                    $(".featured-content-carousel").addClass('fixVideoPausedOnce')
                })
            }
        }

        var linkArg = $(".about-section__panel--content").find(".tw-title").text().replace("About ", "")
        if ($(".about-section__panel--content:not(.fixLinksAppended)").length > 0 || $(".about-section__panel--content").attr("id") != "fix" + linkArg) {
            var appendable = $(".about-section__panel--content").find('.tw-title').parent()
            if (appendable.length > 0) {
                $("#fixVideosLinks").remove()
                $("#fixClipsLinks").remove()
                $("#fixSpanLinks").remove()
                appendable.parent().append('<a target="_blank" id ="fixVideosLinks" href="/' + linkArg + '/videos"><span>Videos</span></a><span id = "fixSpanLinks"> / </span>')
                appendable.parent().append('<a target="_blank" id ="fixClipsLinks" href="/' + linkArg + '/clips?filter=clips&range=7d"><span>Clips</span></a>')
                $(".about-section__panel--content").addClass("fixLinksAppended")
                $(".about-section__panel--content").attr("id", "fix" + linkArg)
                if (hideTags == "true")
                    $(".tw-tag").attr("style", "display:none !important")
                if (hideSubscribeText == "true") {
                    hideSubButton()
                }
                if (hideUnfollowButton == "true")
                    GM_addStyle('button[data-a-target="unfollow-button"] div:first-child{width: 0 !important;}')
            }
        }
    }

    // Create an observer instance linked to the callback function
    var observerroot = new MutationObserver(callbackRoot)

    // Start observing the target node for configured mutations
    observerroot.observe(targetNodeRoot, config)

    var callbackQuality = function (mutationsList, observer) {
        localStorage.setItem('video-quality', '{"default":"chunked"}')
    }

    function _appendQualityObserver() {
        var isReady = $('div[data-a-target="player-controls"]').length > 0
        if (!isReady) {
            setTimeout(_appendQualityObserver, 500)
            return
        }
        var targetNodeQuality = $('div[data-a-target="player-controls"]').get(0)
        var observerQuality = new MutationObserver(callbackQuality)
        observerQuality.observe(targetNodeQuality, config)
    }
}

function hideRecommendedChannelsPlease() {
    GM_addStyle('div[aria-label="Recommended Channels"]{    display:none !important;}')
}

function hideFriends() {
    GM_addStyle('div[data-a-target="online-friends-list"]{    display:none !important;}')
}

if (hideRecommendedChannels == "true") {
    hideRecommendedChannelsPlease()
}
if (hideFriendsList == "true") {
    hideFriends()
}

function getMenuItem(id, display, checked) {

    var res = ""
    if (checked == "true" || checked == true)
        res = '<input type="checkbox" checked class="enhancCheck" id="fix' + id + '" name="' + id + '" value="' + display + '">  <label for="fix' + id + '">' + display + '</label> '
    else
        res = '<input type="checkbox" class="enhancCheck" id="fix' + id + '" name="' + id + '" value="' + display + '">  <label for="fix' + id + '">' + display + '</label> '
    return res
}

function AddTheMenu() {
    var menuButton = `
    <div class="Layout-sc-nxg1ff-0 jA-dUUY"><div class="Layout-sc-nxg1ff-0 dDnLci">
    <div class="Layout-sc-nxg1ff-0 bYXYej">
    <div class="InjectLayout-sc-588ddc-0 iETGeJ">
    <button class="ScCoreButton-sc-1qn4ixc-0 enhanceButton jGqsfG ScButtonIcon-sc-o7ndmn-0 fNzXyu"  style="
    background: url(https://i.ibb.co/gTMY816/wstar.png);
    background-size: 22px;
    background-repeat: no-repeat;
    background-position: center; width: 25px;
    height: 25px;" ></button>
  </div>
  </div>
  <div aria-label="Whispers" role="button" data-click-out-id="threads-box" data-a-target="threads-box-closed" class="Layout-sc-nxg1ff-0 emWtQg InjectLayout-sc-588ddc-0 kgrtoC whispers-threads-box__container"></div></div></div>

    `

    var enhanceSettings = `
    <div class="enhancecontainer" style="display:none;">

    </div>
    `




    $("body").append(enhanceSettings)
    $(".enhancecontainer").append('<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase" style="color: var(--color-text-alt-2)!important;    font-size: var(--font-size-6)!important;    font-weight: 600!important;    text-transform: uppercase!important;">Enhance Twitch</p></div>')


    $(".enhancecontainer").append(getMenuItem('displayImages', 'Display Images', displayImages))
    $("#fixdisplayImages").on('change', function () {
        localStorage.setItem("displayImages", $(this).prop('checked'))
        displayImages = $(this).prop('checked')
    })

    $(".enhancecontainer").append(getMenuItem('hideUnfollowButton', 'Hide unfollow button', hideUnfollowButton))
    $("#fixhideUnfollowButton").change(function () {
        localStorage.setItem("hideUnfollowButton", this.checked)
        hideUnfollowButton = localStorage.getItem("hideUnfollowButton")
        if (hideUnfollowButton == "false")
            RemoveCssRule('button[data-a-target="unfollow-button"] div:first-child')
        else
            GM_addStyle('button[data-a-target="unfollow-button"] div:first-child{width: 0 !important;}')
    })

    $(".enhancecontainer").append(getMenuItem('hideSubscribeText', 'Hide (re)subscribe text', hideSubscribeText))
    $("#fixhideSubscribeText").change(function () {
        localStorage.setItem("hideSubscribeText", this.checked)
        hideSubscribeText = localStorage.getItem("hideSubscribeText")
        if (hideSubscribeText == "false") {
            let btnSub = $('button[data-a-target="subscribe-button"]')
            if (btnSub.length == 0)
                btnSub = $('button[data-a-target="subscribed-button"]')
            btnSub.find(".tw-mg-l-05").attr("style", "display: block !important")
            btnSub.find('div[data-a-target="tw-core-button-label-text"]').attr("style", "display: block !important")
        }
        else {
            hideSubButton()
        }
    })

    //alwaysSourceQuality
    $(".enhancecontainer").append(getMenuItem('alwaysSourceQuality', 'Always source quality', alwaysSourceQuality))
    $(document).on('change', "#fixalwaysSourceQuality", function () {
        localStorage.setItem("alwaysSourceQuality", $(this).prop('checked'))
        alwaysSourceQuality = $(this).prop('checked')
        AlwaysSourceQuality()
    })

    $(".enhancecontainer").append(getMenuItem('displayVideos', 'Display Videos', displayVideos))
    $(document).on('change', "#fixdisplayVideos", function () {
        localStorage.setItem("displayVideos", $(this).prop('checked'))
        displayVideos = $(this).prop('checked')
    })


    $(".enhancecontainer").append(getMenuItem('autoPlayClips', 'Auto play clips', autoPlayClips))

    $(document).on('change', "#fixautoPlayClips", function () {
        localStorage.setItem("autoPlayClips", $(this).prop('checked'))
        autoPlayClips = $(this).prop('checked')
    })

    //hideOfflineChannels

    $(".enhancecontainer").append(getMenuItem('hideOfflineChannels', 'Hide offline channels*', hideOfflineChannels))
    $(document).on('change', "#fixhideOfflineChannels", function () {
        localStorage.setItem("hideOfflineChannels", $(this).prop('checked'))
        hideOfflineChannels = $(this).prop('checked')
    })


    //hideRecommendedChannels
    $(".enhancecontainer").append(getMenuItem('hideRecommendedChannels', 'Hide Recommended Channels', hideRecommendedChannels))
    $("#fixhideRecommendedChannels").change(function () {
        localStorage.setItem("hideRecommendedChannels", this.checked)
        hideRecommendedChannels = localStorage.getItem("hideRecommendedChannels")
        if (hideRecommendedChannels == "true")
            hideRecommendedChannelsPlease()
        else {
            RemoveCssRule('div[aria-label="Recommended Channels"]')
        }
    })

    $(".enhancecontainer").append(getMenuItem('hide7Tvtooltip', 'Hide 7tv emote tooltip', hide7Tvtooltip))
    $("#fixhide7Tvtooltip").change(function () {
        localStorage.setItem("hide7Tvtooltip", $(this).prop('checked'))
        hide7Tvtooltip = $(this).prop('checked')
        hide7Tvtooltipplease()
    })

    $(".enhancecontainer").append(getMenuItem('bigger7tvPanel', 'Bigger 7tv emote panel', bigger7tvPanel))
    $("#fixbigger7tvPanel").change(function () {
        localStorage.setItem("bigger7tvPanel", $(this).prop('checked'))
        bigger7tvPanel = $(this).prop('checked')
        bigger7tvPanelplease()
    })



    //hideRecommendedChannels
    $(".enhancecontainer").append(getMenuItem('hideFriendsList', 'Hide Friends', hideFriendsList))
    $("#fixhideFriendsList").change(function () {
        localStorage.setItem("hideFriendsList", this.checked)
        hideFriendsList = localStorage.getItem("hideFriendsList")
        if (hideFriendsList == "true")
            hideFriends()
        else {
            RemoveCssRule('div[data-a-target="online-friends-list"]')
        }
    })

    $(".enhancecontainer").append(getMenuItem('hideExtensions', 'Hide Extensions', hideExtensions))
    $("#fixhideExtensions").change(function () {
        localStorage.setItem("hideExtensions", this.checked)
        hideExtensions = localStorage.getItem("hideExtensions")
        if (hideExtensions == "false")
            RemoveCssRule(".extensions-dock__layout, .extensions-video-overlay-size-container")
        else
            GM_addStyle(".extensions-dock__layout, .extensions-video-overlay-size-container{display: none !important;}")
    })

    $(".enhancecontainer").append(getMenuItem('hideHypeTrain', 'Hide hype train', hideHypeTrain))
    $("#fixhideHypeTrain").change(function () {
        localStorage.setItem("hideHypeTrain", this.checked)
        hideHypeTrain = localStorage.getItem("hideHypeTrain")
        if (hideHypeTrain == "false")
            RemoveCssRule(".community-highlight-stack__scroll-area--disable")
        else
            GM_addStyle(".community-highlight-stack__scroll-area--disable{display: none !important;}")
    })

    $(".enhancecontainer").append(getMenuItem('hideBitGiftLeaderBoard', 'Hide gift/bit leaderboard', hideBitGiftLeaderBoard))
    $("#fixhideBitGiftLeaderBoard").change(function () {
        localStorage.setItem("hideBitGiftLeaderBoard", this.checked)
        hideBitGiftLeaderBoard = localStorage.getItem("hideBitGiftLeaderBoard")
        if (hideBitGiftLeaderBoard == "false")
            RemoveCssRule(".channel-leaderboard")
        else
            GM_addStyle(".channel-leaderboard{display: none !important;}")
    })

    $(".enhancecontainer").append(getMenuItem('hideBitGiftLeaderBoard', 'Hide gift/bit leaderboard', hideBitGiftLeaderBoard))
    $("#fixhideBitGiftLeaderBoard").change(function () {
        localStorage.setItem("hideBitGiftLeaderBoard", this.checked)
        hideBitGiftLeaderBoard = localStorage.getItem("hideBitGiftLeaderBoard")
        if (hideBitGiftLeaderBoard == "false")
            RemoveCssRule(".channel-leaderboard")
        else
            GM_addStyle(".channel-leaderboard{display: none !important;}")
    }); -

        $(".enhancecontainer").append(getMenuItem('hideTags', 'Hide tags', hideTags))
    $("#fixhideTags").change(function () {
        localStorage.setItem("hideTags", this.checked)
        hideTags = localStorage.getItem("hideTags")
        if (hideTags == "false")
            $(".tw-tag").attr("style", "display:flex !important")
        else
            $(".tw-tag").attr("style", "display:none !important")
    })

    /*$(".enhancecontainer").append(getMenuItem('changePogBones','Swap PogBones by PogChamp*',changePogBones));
    $("#fixchangePogBones").change(function() {
        localStorage.setItem("changePogBones", this.checked);
        changePogBones = localStorage.getItem("changePogBones");
        if (changePogBones == "true" || changePogBones == true)
            changePogBonesPlease();
    });


     $(".enhancecontainer").append(getMenuItem('changeKekheim','Swap KekHeim by KEKW*',changeKekheim));
    $("#fixchangeKekheim").change(function() {
        localStorage.setItem("changeKekheim", this.checked);
        changeKekheim = localStorage.getItem("changeKekheim");
        if (changeKekheim == "true" || changeKekheim == true)
            changeKekheimPlease();
    });*/


    $(".enhancecontainer").append(`<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase"

style="color: var(--color-text-alt-2)!important;
    font-size: smaller;
    margin-top: 6px;">Options marked with * need a refresh after disabling.</p></div>`)


    $(".top-nav__prime").parent().children().eq(2).after(menuButton)

    $(".enhanceButton").click(function () {
        $(".enhancecontainer").toggle()
    })

    //rgba(25, 25, 25, 0.75);




    document.addEventListener('keydown', (event) => {


        if (event.altKey && event.key == 's') {
            $(".enhancecontainer").toggle()
        }
    })
}

GM_addStyle('.enhanceButton:hover{    background-color:var(--color-background-button-text-hover) !important;}')
GM_addStyle(`
    .enhancecontainer {
display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: var(--color-background-base);
    padding: 10px;
    width: 200px;
    position: absolute;
    right: 100px;
    z-index: 100;
    margin-top: 66px;
    width: 500px;
    height: auto;
}
    `)

GM_addStyle(`
    input.enhancCheck[type=checkbox] + label {
  display: block;
    cursor: pointer;
    height: fit-content;
    flex: 1 0 35%;
    margin-top: 5px;
}
`)
GM_addStyle(`
    input.enhancCheck[type=checkbox] {
  display: none;
}`)
GM_addStyle(` input.enhancCheck[type=checkbox] + label:before {
  content: "\\2714";
  border: 0.1em solid #fff;
  border-radius: 0.2em;
  display: inline-block;
  width: 1em;
  height: 1em;
  padding-left: 0.2em;
  padding-bottom: 0.3em;
  margin-right: 0.2em;
  vertical-align: bottom;
  color: transparent;
}`)
GM_addStyle(`input.enhancCheck[type=checkbox]:checked + label:before {
  background-color: #ED820A;
  border-color:white;
  color: #fff;
}`);

(function () {
    'use strict'
    LoadTwitchEnhance()
})()