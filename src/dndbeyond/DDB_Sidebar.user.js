// ==UserScript==
// @name     	  	DDB Sidebar
// @description		Automatically switches sidebar between fixed and overlay based on width. Escape closes if overlay
// @version  		  1
// @grant    		  none
// @match 	      https://www.dndbeyond.com/*
// @require 	  	http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require 	  	https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @namespace     https://greasyfork.org/users/789634
// @downloadURL   https://update.greasyfork.org/scripts/429191/DnDB%20Sidebar.user.js
// @updateURL     https://update.greasyfork.org/scripts/429191/DnDB%20Sidebar.meta.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// ==/UserScript==

/* global $ */
/* global waitForKeyElements */

// dndbeyond is a react app that doesn't always reload the page. We track style changes
// on the body so we know when the combat tracker screen is loaded, otherwise
// we're constantly polling for the right DOM elements to load, and then they only
// work on the first page change.
var observer = new MutationObserver(function(mutations) {
    if( observer.event_bound == 'undefined' ) {
        observer.event_bound = false;
    }
    if(document.URL == observer.url){
        return;
    }else{
        observer.url = document.URL;
        if(observer.url.match(/profile\/(.*)\/characters\/(.*)/g)){
            if($(".body-rpgcharacter-sheet").length){
                if(!observer.event_bound){
                    observer.event_bound = true;
                    window_resized();
                    window.addEventListener('resize', window_resized);
                    window.addEventListener('keydown', body_keydown);
                }
            }else{
                if(observer.event_bound){
                    observer.event_bound = false;
                    window.removeEventListener('resize', window_resized);
                    window.removeEventListener('keydown', window_resized);
                }
            }
    }
    }
});

observer.observe($(document.body)[0], {
    childList: true,
});

var body_keydown = function(event){
    if(event.code == 'Escape' && $(".ct-sidebar__body--overlay-right").length){
        $('.ct-sidebar__control--collapse').click();
    }
}

var window_resized = function(){
    if(window.innerWidth >= 1605 && $(".ct-sidebar--hidden").length){
        $('.ct-sidebar__control--expand').click();
        waitForKeyElements('.ct-sidebar__control--fixed', function(){
            $('.ct-sidebar__control--fixed').click();
        });
    }
    if(window.innerWidth < 1605 && $(".ct-sidebar--visible").length){
        $('.ct-sidebar__control--overlay').click();
    }
}
