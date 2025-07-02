// ==UserScript==
// @name         Reddit: Fix Infinite Scroll
// @namespace    https://egore.url.lol/userscripts
// @version      1.8.2
// @description  Fix of the infinite scroll, Hide subreddits, see full image/tweet shows the full image/tweet, html5 video player, remove background effects on comments, show spoiler/nsfw
// @author       Bum
// @icon          https://www.google.com/s2/favicons?domain=reddit.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.reddit.com/*
// @grant        GM_addStyle
// ==/UserScript==

var holdTopicsInMemory = "false";
var commentEffects = "false";
var originalBehavior = "false";
var topicLimitInDom = 70;
var lastScrollTop = 0;
var scrollTopWhenREmoved = -1;
var menuButtonWasAdded = false;
var subsToHide = "";

var lastTopicRemovedTime =  new Date().getTime();

if (localStorage.getItem("holdTopicsInMemory") != null) {
    holdTopicsInMemory = localStorage.getItem("holdTopicsInMemory");
}

if (localStorage.getItem("commentEffects") != null) {
    commentEffects = localStorage.getItem("commentEffects");
}

if (localStorage.getItem("originalBehavior") != null) {
    originalBehavior = localStorage.getItem("originalBehavior");
}
if (localStorage.getItem("subsToHide") != null) {
    subsToHide = localStorage.getItem("subsToHide");
}

var topicsInMemory = [];
var isAPop = false;
var maxOffset = 0;

(function() {
    'use strict';
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }
    HideAllSubs();
    if (commentEffects == "false")
    {
        GM_addStyle ( 'img[src*="flame"]{display:none;}' );
        GM_addStyle ( 'div[aria-role="presentation"]{box-shadow:none !important;background : transparent !important;}' );
    }
    GM_addStyle ( '.wwHbgRV0ZXGp5CHHlpo5u{display:block !important;}' );
    GM_addStyle ( '._1Q2mF3u7v9hBVu_4bkC7R4{display:block !important;}' );
    GM_addStyle ( '._3hUbl08LBz2mbXjy0iYhOS,._3b8u2OJXaSDdBWoRB7zUoK {height: 50px !important;width: 100% !important; bottom: 0 !important;}' );


    GM_addStyle ( '._3UEq__yL-82zX4EyuluREz,.gUpEQXQu8G8UvISmBIPsj,._1RZSSlyqzokrcxh0ESwE2e{display:none !important;}' );
    GM_addStyle ( '.vLH0XV-l8Y4mNGUvw4HHy{display:none !important;}' );
    GM_addStyle ( '.eI6Ep6BNFA5DZjPWNVb4,._2XQ3ZY6qCbEm9_WtvLLFru{display:none !important;}' );

    //POPUP
    GM_addStyle('.fixmodal {position:fixed;background-color:rgba(0, 0, 0, 0.5);height:100%;width:100%;top:0;left:0;display:none; z-index: 1000;}');
    GM_addStyle('#fixPopup {padding:5px;text-align:center;}');
    GM_addStyle('.fixmodalWrap {margin: 50px auto; position:relative;width: fit-content;} ');
var maxWidthPop = window.screen.height - 200;
GM_addStyle('#fixPopup img {max-height:'+maxWidthPop+'px;}');
    GM_addStyle('._2f5uYHvlfzs2DngQsiCdvB {height: 50px !important;width: 100% !important; position: relative !important; bottom: 50px !important;}');
    GM_addStyle('.videoFixIcon {margin: 50px auto; background: url("https://www.pngall.com/white-play-png")} ');
    GM_addStyle('.expandDivCaption {padding: 5px!important; white-space: pre-wrap !important;max-height: max-content !important; display: inline-block !important; overflow-wrap: break-word !important;} ');
    GM_addStyle('.expandSpanCaption{height: auto !important; position: absolute !important; bottom: 0;} ');
     GM_addStyle('.expandDisableClick{pointer-events: none; } ');
     GM_addStyle('.expandEnableClick{pointer-events: auto; !important; } ');
     GM_addStyle('.expandGarbageRedditCaptions{position:relative !important; } ');


    window.addEventListener('scroll', throttle(callback, 300));

    function throttle(fn, wait) {
        var time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    function getMenuItem(id, display)
    {
        return '<a class="M2Hk_S2yvXpsNPfZMBMur customRedditFixMenu" id = "'+id+'" ><div class="_1lwNBHmCQJObvqs1fXKSYR" style="margin-right: 0px;">'+display+'</div></a>';
    }

    function getCheckBoxItem(checked, id, display){

        if (checked == 'true')
            return '<a data-redditstyle="true" class="_1YWXCINvcuU7nk0ED-bta8" class = "fixRedditCustomMenuB"><div class="vzhy90YD0qH7ZDJi7xMGw" style = "margin-left:-30px;">'+display+'</div><button id = "'+id+'" aria-checked="true" class="_2e2g485kpErHhJQUiyvvC2 _179edq2yfZswDIo3NdeebM _1L5kUnhRYhUJ4TkMbOTKkI" role="switch" type="button"><div class="_2FKpII1jz0h6xCAw1kQAvS"></div></button></a>';
        else
            return '<a data-redditstyle="true" class="_1YWXCINvcuU7nk0ED-bta8" class = "fixRedditCustomMenuB"><div class="vzhy90YD0qH7ZDJi7xMGw" style = "margin-left:-30px;">'+display+'</div><button id = "'+id+'" aria-checked="false" class="_2e2g485kpErHhJQUiyvvC2 _179edq2yfZswDIo3NdeebM" role="switch" type="button"><div class="_2FKpII1jz0h6xCAw1kQAvS"></div></button></a>';
    }

    function RemoveMenu(){
        $("#redditFixReloadAll").remove();
        $("#redditFixReload25").remove();
    }
    function AddMenu(){
        var menu = $("._2pUO1Sfe7WlIHvq6goN3Pz");
        if (menu.find(".customRedditFixMenu").length > 0 )
            return;
        menu.append(getMenuItem('redditFixReloadAll', 'Reload All'));
        $("#redditFixReloadAll").click(function(){
            for (var i = topicsInMemory.length - 1; i >= 0; --i) {
                var el = topicsInMemory.pop(i);
                $(".rpBJOHq2PR60pnwJlUyP0").prepend(el);
            }
            maxOffset = $(document).height();
        });
        menu.append(getMenuItem('redditFixReload25', 'Reload 25'));
        $("#redditFixReload25").click(function(){
            var reloadTill = topicsInMemory.length;
            if (reloadTill > 25)
                reloadTill = 25;
            for (var i = 0; i < 25; ++i) {
                var el = topicsInMemory.pop(i);
                $(".rpBJOHq2PR60pnwJlUyP0").prepend(el);
            }
            maxOffset = $(document).height();
        });
    }

    function attachObserver(){
        if ($(".observerIsAttached").length > 0)
            return;
        $(".rpBJOHq2PR60pnwJlUyP0").addClass("observerIsAttached");
        var config = { attributes: false, childList: true, subtree: true };
        var targetNodeRoot = $(".rpBJOHq2PR60pnwJlUyP0").first().get(0);
        var configRoot = { attributes: false, childList: true, subtree: true };
        $("video").each(function(){
            if ($(this).hasClass("_1EQJpXY7ExS04odI1YBBlj")){
                $(this).removeClass("_1EQJpXY7ExS04odI1YBBlj" );
            }
            $(this).attr("controls","");
            $(this).attr("style","height: 100%");
            $(this).parent().attr("style","text-align: center");
            $(this).click(function(){
                $(this).prop('muted', false);
                $(this).attr({'autoplay':'true'});
            });
        });

        var callbackRoot = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                mutation.addedNodes.forEach(function(node) {
                    var currentTime = new Date().getTime();
                    var time = currentTime - lastTopicRemovedTime;
HideAllSubs();

                    if ($(node).find("video")){
                        var garbageVideoPlayer = $(node).find("video");

                        if (garbageVideoPlayer.hasClass("_1EQJpXY7ExS04odI1YBBlj")){
                            garbageVideoPlayer.removeClass("_1EQJpXY7ExS04odI1YBBlj" );
                        }
                        garbageVideoPlayer.attr("controls","");
                        garbageVideoPlayer.attr("style","height: 100%");
                        garbageVideoPlayer.parent().attr("style","text-align: center");
                        garbageVideoPlayer.click(function(){
                            garbageVideoPlayer.prop('muted', false);
                            garbageVideoPlayer.attr({'autoplay':'true'});
                        });
                    }

                    if ($(node).find(".scrollerItem")){
                        if ($(".scrollerItem").length > topicLimitInDom){
                            let newHeight = $(window).scrollTop();
                            $(".scrollerItem").slice(0,49).each(function(){
                                var currElHeight = 0;
                                if ($(this).parent().parent().attr("style") != ""){
                                    var el = $(this);
                                    if (holdTopicsInMemory)
                                        topicsInMemory.push(el.parent().parent());
                                    currElHeight = el.parent().parent().height();

                                    if(el.parent().parent().find(".promotedlink")){
                                    }
                                    else{
                                        if (currElHeight == 0){
                                            currElHeight = currElHeight + 500;
                                        }
                                    }
                                    el.parent().parent().remove();
                                    newHeight = newHeight - currElHeight;
                                    currElHeight = 0;
                                }
                                lastTopicRemovedTime = new Date().getTime();
                                scrollTopWhenREmoved = lastScrollTop+10000;
                            });
                            $(window).scrollTop(newHeight);
                        }
                    }
                });
            }
        };


        var observerroot = new MutationObserver(callbackRoot);
        observerroot.observe(targetNodeRoot, config);
    }

    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }

    function attachTopicObserver(){
        var config = { attributes: false, childList: true, subtree: true };
        var targetNodeTopics = $("#2x-container").first().get(0);
        var configRoot = { attributes: false, childList: true, subtree: true };

        var callbackTopic = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                mutation.addedNodes.forEach(function(node) {
HideAllSubs();
                    if (($('div[data-test-id="post-content"]:not(.ObserverAttached)').length > 0)){
                        var content = $('div[data-test-id="post-content"]');
                        if (content.find("video")){
                            var garbageVideoPlayer =content.find("video");

                            if (garbageVideoPlayer.hasClass("_1EQJpXY7ExS04odI1YBBlj")){
                                garbageVideoPlayer.removeClass("_1EQJpXY7ExS04odI1YBBlj" );
                            }
                            garbageVideoPlayer.attr("controls","");
                            garbageVideoPlayer.attr("style","height: 100%");
                            garbageVideoPlayer.parent().attr("style","text-align: center");
                            garbageVideoPlayer.click(function(){
                                garbageVideoPlayer.prop('muted', false);
                                garbageVideoPlayer.attr({'autoplay':'true'});
                            });
                        }
                        content.addClass("ObserverAttached");
                        content.find("._3-miAEojrCvx_4FQ8x3P-s").append('<a class="_10K5i7NW6qcm-UoCtpB3aK YszYBnnIoNY8pZ6UwCivd _3yh2bniLq7bYr4BaiXowdO _2sAFaB0tx4Hd5KxVkdUcAx _28vEaVlLWeas1CDiLuTCap" id ="fixDirectLink"><span class="_2-cXnP74241WI7fpcpfPmg"> Get Direct Link</span></a>');
                        $("#fixDirectLink").css("cursor","pointer");
                        var urlThisWindow = $(content).find("._3jOxDPIQ0KaOWpzvSQo-1s").attr("href");
                        if (urlThisWindow.substring(urlThisWindow.length-1) == "/")
                        {
                            urlThisWindow = urlThisWindow.substring(0, urlThisWindow.length-1);
                        }
                        urlThisWindow = urlThisWindow+".json";
                        $("#fixDirectLink").click(function(){
                            $.getJSON( urlThisWindow, function( data ) {
                                try {
                                    var urlFallback = data[0].data.children[0].data.secure_media.reddit_video.fallback_url;
                                    copyToClipboard($("<div>"+urlFallback+"</div>"));
                                    var popupCopy = '<div class="_3q-XSJ2vokDQrvdG6mR__k fixObserverpopup"><div class="trdUvQxqQHHqQKOUBcgnr EjdBJNEwygtHMKiHd3Bnv" style="opacity: 1; x: 1px; y: 0px; transform: translateY(0px) scale(1, 1); --Toaster-indicatorColor:#24A0ED;"><div class="_21oJwLzDt5kLN6scufKBab"><span class="_7JH6kQpO-bx66b9ajIZrz">Link copied to clipboard: ' + urlFallback + '</span></div><div class="_2-rGW3UtrT-pD45pofU3tx"></div></div></div>';
                                    $("#POPUP_CONTAINER").append(popupCopy);
                                    setTimeout(function(){ $(".fixObserverpopup").remove(); }, 3000);

                                }
                                catch(err) {
                                    var popupCopyfailed = '<div class="_3q-XSJ2vokDQrvdG6mR__k fixObserverpopup"><div class="trdUvQxqQHHqQKOUBcgnr EjdBJNEwygtHMKiHd3Bnv" style="opacity: 1; x: 1px; y: 0px; transform: translateY(0px) scale(1, 1); --Toaster-indicatorColor:#24A0ED;"><div class="_21oJwLzDt5kLN6scufKBab"><span class="_7JH6kQpO-bx66b9ajIZrz">No link found</span></div><div class="_2-rGW3UtrT-pD45pofU3tx"></div></div></div>';
                                    $("#POPUP_CONTAINER").append(popupCopyfailed);
                                    setTimeout(function(){ $(".fixObserverpopup").remove(); }, 3000);
                                }
                            });
                        });
                    }
                });
            }
        };
        if (targetNodeTopics != undefined){
            var observerTopic = new MutationObserver(callbackTopic);
            observerTopic.observe(targetNodeTopics, config);
        }
    }

    function fadeOutThePicture(){
        $(".fixmodal").fadeOut("fast");
        document.removeEventListener("click", fadeOutThePicture);
    }

     $(document).on("mousedown", "._15nNdGlBIgryHV04IfAfpA", function(e) {

         $(this).parent().toggleClass( "expandSpanCaption" );
         $(this).toggleClass( "expandDivCaption" );

         if ($(".DraftEditor-root").length > 0){
             $(this).parent().toggleClass("expandGarbageRedditCaptions");
         }

         //If anyone ever find how to stop this fucking propagation send me a dm like fuck none of this shit work on this element...
         e.stopPropagation();
         e.preventDefault();
         e.cancelBubble = true;
         e.stopImmediatePropagation();
         return false
    });
    var control = false;
    $("img").on('keyup keydown', function(e) {
        control = e.ctrlKey;
    });

    $('img').on('click', function() {
        if (control) {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            return false
        }
    });



    $(document).on("mousedown", "._3b8u2OJXaSDdBWoRB7zUoK,._3hUbl08LBz2mbXjy0iYhOS,._2f5uYHvlfzs2DngQsiCdvB", function(e) {

        $(".fixmodal").fadeIn("fast");
        $("#fixPopup img").remove();
        $("#fixPopup iframe").remove();
        var closestIframe = $(this).parent().find("iframe");
        if (closestIframe.length > 0){
            var clonedIframe = closestIframe.clone()
            clonedIframe.appendTo("#fixPopup");
            clonedIframe.css({'width': '800px', 'max-height':maxWidthPop + 'px'});
        }
        else{
            var imgSrc = $(this).parent().find("img").attr("src");
            $('<img src="'+imgSrc+'" alt="image3" />').appendTo("#fixPopup");
        }

        setTimeout(() => {document.addEventListener("click", fadeOutThePicture);}, 100);
        e.stopPropagation();
        e.preventDefault();
        e.cancelBubble = true;
        e.stopImmediatePropagation();
        return false
    });

    function callback() {
        if (originalBehavior == "true")
            return;
        if (holdTopicsInMemory == "true")
            AddMenu();
        var st = $(document).scrollTop();
        if (st > maxOffset)
        {
            if (st > lastScrollTop){
                attachObserver();
            }
            lastScrollTop = st;
            maxOffset = 0;
        }
    }
    $("body").append('<div class="fixmodal"> <div class="fixmodalWrap"><div id="fixPopup"></div> </div></div>');

    //#####Custom menu for unbluring
        GM_addStyle(`
.container__menu {
                /* Absolute position */
                position: absolute;

                /* Reset */
                list-style: none;
                margin: 0;
                padding: 0;
                display: none;

                /* Misc */
                border: 1px solid #cbd5e0;
                border-radius: 0.25rem;
                background-color: #f7fafc;
            }
`);


    GM_addStyle(`
    .open {
    display: block;
    z-index: 9999;
}
`);

    GM_addStyle(`
.container__item {
                padding: 0.5rem 1rem;
                white-space: nowrap;
                cursor: pointer;
    color: black;
            }
`);

    GM_addStyle(`
 .container__item:hover {
                background-color: #bee3f8;
            }
`);

    GM_addStyle(`
.container__divider {
                border-bottom: 1px solid #cbd5e0;
                height: 1px;
            }
`);
    $("body").append(`
    <ul id="redditfixShowImage" class="container__menu">
                    <li class="container__item">Show Image</li>
                </ul>
                `);

    var cntxtMn = $("#redditfixShowImage");
    var mouseX;
    var mouseY;
    var currentTarget = null;

    $(document).mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    $(document).on("mousedown", function(e){
        if ($(event.target).is('img')){

            $(this).on('contextmenu', displayContextMenu)
            function displayContextMenu(e) {
                (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;

                if ($(e.target).attr("src").toUpperCase().indexOf("BLUR=") >=0)
                {
                    cntxtMn.css({'top':mouseY,'left':mouseX}).addClass("open");
                    e.preventDefault();
                    currentTarget = e.target;
                    return;
                }

            }
            cntxtMn.click(function(e) {
                e.stopPropagation();
            });

            $(document).click(function() {
                (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;
            });

            $(".container__item").click(function(){
                var src =  $(currentTarget).attr('src');
                var myRegexp = /^.*\/(.*)\.?(.*)?\?/g;
                var match = myRegexp.exec(src);
                if (src.toUpperCase().indexOf("EXTERNAL") >= 0){

                    var closestOutBound = $(currentTarget).parents(".STit0dLageRsa2yR4te_b").parent().find(".styled-outbound-link");
                    $(currentTarget).attr("src",closestOutBound.attr("href"));
                }
                else{
                    $(currentTarget).attr("src","https://i.redd.it/" + match[1]);
                }
                $(currentTarget).attr("style","filter:none; width: auto; height: 100%;");
                cntxtMn.removeClass("open");
            });
        }
    });





    function AddTheMenu(){
        var menuButton = `
    <div class="Layout-sc-nxg1ff-0 jA-dUUY"><div class="Layout-sc-nxg1ff-0 dDnLci">
    <div class="Layout-sc-nxg1ff-0 bYXYej">
    <div class="InjectLayout-sc-588ddc-0 iETGeJ">
    <button class="ScCoreButton-sc-1qn4ixc-0 enhanceButton jGqsfG ScButtonIcon-sc-o7ndmn-0 fNzXyu"  style="
    background: url(https://i.imgur.com/kWu713g.png);
    background-size: 22px;
    background-repeat: no-repeat;
    background-position: center; width: 25px;
    height: 25px;" ></button>
  </div>
  </div>
  <div aria-label="Whispers" role="button" data-click-out-id="threads-box" data-a-target="threads-box-closed" class="Layout-sc-nxg1ff-0 emWtQg InjectLayout-sc-588ddc-0 kgrtoC whispers-threads-box__container"></div></div></div>

    `;

        var enhanceSettings = `
    <div class="enhancecontainer" style="display:none;">

    </div>
    `;




        $("body").append(enhanceSettings);
        $(".enhancecontainer").append('<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase" style="color: var(--color-text-alt-2)!important;    font-size: var(--font-size-6)!important;    font-weight: 600!important;    text-transform: uppercase!important;">Reddit enhance</p></div>');


        $(".enhancecontainer").append(getCheckBoxItem(commentEffects, "redditFixCheckBoxBackground", "Comment effects"));
        $("#redditFixCheckBoxBackground").click(function(){
            var btnBackgroundsChecked = $(this);
            if (btnBackgroundsChecked.hasClass("_1L5kUnhRYhUJ4TkMbOTKkI")){
                btnBackgroundsChecked.removeClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("commentEffects", false);
                commentEffects = "false";
            }
            else{
                btnBackgroundsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("commentEffects", true);
                commentEffects = "true";
            }
        });

        $(".enhancecontainer").append(getCheckBoxItem(holdTopicsInMemory, "fixRedditKeepTopicsInMemory", "Save topics in ram"));
        $("#fixRedditKeepTopicsInMemory").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.hasClass("_1L5kUnhRYhUJ4TkMbOTKkI")){
                btnTopicsChecked.removeClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("holdTopicsInMemory", false);
                holdTopicsInMemory = "false";
                RemoveMenu();
            }
            else{
                btnTopicsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("holdTopicsInMemory", true);
                holdTopicsInMemory = "true";
                AddMenu();
            }
        });
        $(".enhancecontainer").append(getCheckBoxItem(originalBehavior, "fixRedditoriginalBehavior", "Original behavior"));
        $("#fixRedditoriginalBehavior").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.hasClass("_1L5kUnhRYhUJ4TkMbOTKkI")){
                btnTopicsChecked.removeClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("originalBehavior", false);
                originalBehavior = "false";
            }
            else{
                btnTopicsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("originalBehavior", true);
                originalBehavior = "true";
            }
        });

        $(".enhancecontainer").append("<span style = 'flex:1'>Hide subreddit from appearing in feed. If you remove subs you have to restart. If you add just click save, no need to restart.</span>");
        $(".enhancecontainer").append(`
        <textarea id="fixHideSubreddits" name="fixHideSubreddits" rows="4" cols="50" style = "flex:1">`+subsToHide+`</textarea>
        `);

        $(".enhancecontainer").append(" <button type='button' id='fixSaveSubredditsHidden' style = 'background:darkgreen'>Save</button> ");

        $(".enhancecontainer").append(`<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase"

style="color: var(--color-text-alt-2)!important;
    font-size: smaller;line-height: 1.4;
    margin-top: 6px;">Any subreddit containing this word will be hidden from your feed. This is Case Sensitive. Write the exact subreddit name if you only target that subreddit. Use ; to separate keywords. Example: funny;tiktok;celebrity</p></div>`);

        $("#change-username-tooltip-id").children().eq(2).after(menuButton);

        $(".enhanceButton").click(function(){
            $(".enhancecontainer").toggle();
        });

        $("#fixSaveSubredditsHidden").click(function(){
            subsToHide = $("#fixHideSubreddits").val();
            localStorage.setItem("subsToHide", subsToHide);
            HideAllSubs();
        });
        //rgba(25, 25, 25, 0.75);




    }

    function HideAllSubs(){

        var subsToHideArray = subsToHide.split(";");
        let i = 0;
        while (i < subsToHideArray.length) {
            $("._3ryJoIoycVkA88fy40qNJc[href*='"+ subsToHideArray[i] + "']").closest(".scrollerItem").parent().css("display","none");
            i++;
        }
        //   alert( );
    }

    AddTheMenu();
      GM_addStyle('.enhanceButton:hover{    background-color:var(--color-background-button-text-hover) !important;}');
    GM_addStyle(`
    .enhancecontainer {
display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: #393939;
    padding: 10px;
    width: 200px;
    position: fixed;
    right: 100px;
    z-index: 100;
    margin-top: 66px;
    width: 500px;
    height: auto;
    top: 0;
}
    `);

    GM_addStyle(`
    input.enhancCheck[type=checkbox] + label {
  display: block;
    cursor: pointer;
    height: fit-content;
    flex: 1 0 35%;
    margin-top: 5px;
}
`);
    GM_addStyle(`
    input.enhancCheck[type=checkbox] {
  display: none;
}`);
    GM_addStyle(`
    ._1L5kUnhRYhUJ4TkMbOTKkI{
    background: green !important;
    }

    `)

    GM_addStyle(`
    #redditFixCheckBoxBackground,#fixRedditKeepTopicsInMemory,#fixRedditoriginalBehavior{
    background: red;
    }

    `)
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
}`);
    GM_addStyle(`input.enhancCheck[type=checkbox]:checked + label:before {
  background-color: #ED820A;
  border-color:white;
  color: #fff;
}`);
})();










