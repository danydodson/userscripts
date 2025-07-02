// ==UserScript==
// @name         DDB Character Sheet Full
// @namespace    https://greasyfork.org/en/users/860107-ogbetua
// @version      0.1
// @description  Reformats the character sheet for fullscreen
// @author       Ogbetua
// @match        https://www.dndbeyond.com/profile/*/characters/*
// @match        https://www.dndbeyond.com/characters/*
// @icon         https://www.google.com/s2/favicons?domain=dndbeyond.com
// @run-at       document-end
// @grant        GM.addElement
// @grant        GM.addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437913/DD%20Beyond%20Fullscreen%20Character%20Sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/437913/DD%20Beyond%20Fullscreen%20Character%20Sheet.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    'esversion: 6';
    // Your code here...

    GM.addStyle(".fullscreen-toolbar { font-family: Roboto; position: fixed; display: flex; align-items: center; height: 50px; width: 50px; border-radius: 25px; box-shadow: 2px 2px 6px rgba(0,0,0,.6); cursor: pointer; right: 10px; bottom: 10px; background-color: #555752; padding-left: 9px; }");
    GM.addStyle(".fullscreen-toolbar:hover { background-color: rgb(68, 70, 66) }");
    GM.addStyle(".fullscreen-image { width: 30px; height: 32px; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 20 20'%3E%3Ctitle%3E fullscreen %3C/title%3E%3Cpath fill='%23FFFFFF' fill-rule='evenodd' d='M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z'/%3E%3C/svg%3E\");}");
    GM.addStyle(":fullscreen .fullscreen-image { background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Capa_1' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve' height='32px' width='32px'%3E%3Cg%3E%3Cg id='fullscreen_x5F_exit'%3E%3Cg%3E%3Cpolygon style='fill:%23FFFFFF;' points='24.586,27.414 29.172,32 32,29.172 27.414,24.586 32,20 20,20 20,32 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='0,12 12,12 12,0 7.414,4.586 2.875,0.043 0.047,2.871 4.586,7.414 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='0,29.172 2.828,32 7.414,27.414 12,32 12,20 0,20 4.586,24.586 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='20,12 32,12 27.414,7.414 31.961,2.871 29.133,0.043 24.586,4.586 20,0 '/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E\");}");
    GM.addStyle(":-webkit-full-screen .fullscreen-image { background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Capa_1' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve' height='32px' width='32px'%3E%3Cg%3E%3Cg id='fullscreen_x5F_exit'%3E%3Cg%3E%3Cpolygon style='fill:%23FFFFFF;' points='24.586,27.414 29.172,32 32,29.172 27.414,24.586 32,20 20,20 20,32 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='0,12 12,12 12,0 7.414,4.586 2.875,0.043 0.047,2.871 4.586,7.414 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='0,29.172 2.828,32 7.414,27.414 12,32 12,20 0,20 4.586,24.586 '/%3E%3Cpolygon style='fill:%23FFFFFF;' points='20,12 32,12 27.414,7.414 31.961,2.871 29.133,0.043 24.586,4.586 20,0 '/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E\");}");
    GM.addStyle(":fullscreen .site-bar, :fullscreen .mm-mega-menu { display: none; }");
    GM.addStyle(":-webkit-full-screen .site-bar, :-webkit-full-screen .mm-mega-menu { display: none; }");
    GM.addStyle("@media(min-width: 1200px) { .ct-character-sheet:before { height: 95px !important; } }");
    //GM.addStyle("@media(min-width: 1200px) { .ct-character-header-desktop { height: 126px !important; } }");
    GM.addStyle("html body.body-rpgcharacter-sheet { background-position-y: 210px !important; }");
    GM.addStyle(":fullscreen body.body-rpgcharacter-sheet { background-position-y: 96px !important; }");
    GM.addStyle("@media(min-width: 1200px) { :fullscreen .ct-sidebar {top: 0px !important; } }");

    waitForElement("div.ct-character-sheet", 3000).then(function(){
        var parentDiv = document.querySelector("div.ct-character-sheet");
        GM.addElement(parentDiv, "div", {}).then((div)=>{
            div.setAttribute("class", "fullscreen-toolbar");
            div.addEventListener("click", ()=>{
                if (!document.documentElement.inFullscreen) {
                    enterFullscreen();
                } else {
                    exitFullscreen();
                }
            });
            GM.addElement(div, "span", {}).then((span)=> {
                span.setAttribute("class", "fullscreen-image");
            });

            function enterFullscreen() {
                //var elem = document.querySelector("div.container");
                var elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            }

            function exitFullscreen() {
                document.exitFullscreen();
            }
        });
    });

    document.addEventListener("fullscreenchange", ()=>{
        if (document.fullscreenElement) {
            document.documentElement.inFullscreen = true;
        }
        else {
            document.documentElement.inFullscreen = false;
        }
    });

    function waitForElement(querySelector, timeout){
        return new Promise((resolve, reject)=>{
            var timer = false;
            if(document.querySelectorAll(querySelector).length) return resolve();
            const observer = new MutationObserver(()=>{
                if(document.querySelectorAll(querySelector).length){
                    observer.disconnect();
                    if(timer !== false) clearTimeout(timer);
                    return resolve();
               }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        if(timeout) { timer = setTimeout(()=>{ observer.disconnect(); reject(); }, timeout);}
    });
}
})();