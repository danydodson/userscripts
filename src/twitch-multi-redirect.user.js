// ==UserScript==
// @name         Twitch Multi Redirect
// @namespace    https://egore.url.lol/userscripts
// @version      1.2
// @description  Redirect Twitch with options.
// @author       RexOmniFurtim
// @match        https://www.twitch.tv/*
// @exclude      https://www.twitch.tv/directory/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// ==/UserScript==

(function() {
    'use strict';

    // if not top frame, stop
    if (frameElement) {
        return;
    }

    ///////////
    // SETUP //
    ///////////
    let tmr = { };
    tmr.intervals = [];
    tmr.elements = [];
    tmr.options = [
        'TwitchLS',
        'Multitwitch'
    ];
    tmr.redirects = { // Redirect functions
        'TwitchLS' : ()=> { window.location.replace('http://twitchls.com/' + tmr.channel); },
        'Multitwitch' : ()=>{ window.location.replace('http://multitwitch.tv/' + tmr.channel); }
    };

    tmr.settings = { };
    // load settings
    tmr.settings.redirectTarget = GM_getValue("tmr-redirectTarget", 'TwitchLS');
    tmr.settings.redirectTimer = GM_getValue("tmr-redirectTimer", 2000);

    tmr.channel = window.location.pathname.substring(1, window.location.pathname.length);

    ///////////
    // START //
    ///////////

    // redirect immediately if redirect set to 0
    if(tmr.settings.redirectTimer === 0 && shouldRedirect()){
		console.log('redirecting early');
        redirect();
        return;
    }
	else{
		document.addEventListener("DOMContentLoaded", ()=> { 
			createBlock();
			
			// If the url says not to redirect, stop the redirect
			if( !urlParamRedirect() ){
				tmr.elements.container.click();
			}
		});
	}

    ///////////////
    // FUNCTIONS //
    ///////////////

    // redirect to the target
    function redirect(){
        tmr.redirects[tmr.settings.redirectTarget]();
    }

    function setRedirectTimeout(){
        tmr.intervals.redirect = setTimeout(()=>{

            // if the redirect target function is found is found
            if( tmr.redirects[tmr.settings.redirectTarget] !== null ){

                // let the user know navigation has begun
                tmr.elements.warning.style.background = 'black';

                // activate naviagtion function
                redirect();
            }
            else{
                console.log("TMR: redirection target funciton not found");
                cancelRedirect();
            }
        }, tmr.settings.redirectTimer);
    }

    function cancelRedirect(){
        clearTimeout(tmr.intervals.redirect);
        tmr.intervals.redirect = null;

        tmr.elements.container.onclick = null;
        console.log('%cStopping Redirect', 'background: #3333ff; color: #fff; font-size: 22px;');

        tmr.elements.warning.style.display = 'none';
        tmr.elements.container.style.display = 'none';
        tmr.elements.settings.style.display = 'block';

        addGear();
    }

    function createBlock(){
        // create and add div
        tmr.elements.container = document.createElement('div');
        tmr.elements.container.innerHTML = ' <div style="width:100%;height:100%;position:absolute;background:rgba(255,0,0,0.5);z-index:99999;text-align:center;cursor:pointer;"> <div style="background:white;padding: 2rem;margin: 2rem;"> <p style="font-size:6rem;">Twitch Multi-Redirect</p> <hr style="margin-top: 3rem;"> <div id="TMR-Warning" style="margin-top:2rem;display:block;"> <p style="font-size: 2rem; background: rgba(0,0,255,.4); padding-bottom: 0.5rem;">Click anywhere to stop redirecting</p> </div> <div id="TMR-Settings" style="margin-top:2rem;display:none"> <p style="font-size:4rem;background:rgba(0,125,125,.5);padding-bottom:2rem;padding-top:1rem;">Settings</p> <div style="width: 100%;margin-top: 2rem;"> <span style="padding-right:.7rem">Redirection target</span><select id="TMR-Select"> </select><br><span style="padding-right:.7rem">Wait (ms)</span><input type=Number value=850 id="TMR-Timer"/> <br> <input id="TMR-Savebtn" type="button" value="Save"> </div> </div> </div> </div>';
        document.body.insertBefore(tmr.elements.container, document.body.firstChild);

        tmr.elements.warning = document.getElementById("TMR-Warning");
        tmr.elements.settings = document.getElementById("TMR-Settings");
        tmr.elements.select = document.getElementById("TMR-Select");
        tmr.elements.timer = document.getElementById('TMR-Timer');
        tmr.elements.savebtn = document.getElementById('TMR-Savebtn');

        // populate the drop-down, select
        let numOptions = tmr.options.length;
        for (let i = 0; i < numOptions; i++) {
            let option = document.createElement("option");
            option.text = tmr.options[i];
            option.value = tmr.options[i];
			//option.setAttribute("id", "TMR-" + tmr.options[i]);
            tmr.elements.select.add(option);
        }

        // set the setting elements to setting values
        // TODO: Get the value of select to equal the right element
        //tmr.elements.select.value = document.getElementById("TMR-" + tmr.settings.redirectTarget);
		//console.log(document.getElementById("TMR-" + tmr.settings.redirectTarget));
		tmr.elements.select.selectedIndex = tmr.options.indexOf(tmr.settings.redirectTarget);
        tmr.elements.timer.value = Number(tmr.settings.redirectTimer);

        // save the selection
        tmr.elements.savebtn.onclick = ()=>{
            //save the data
            GM_setValue("tmr-redirectTarget", tmr.elements.select.value);
            GM_setValue("tmr-redirectTimer", tmr.elements.timer.value);
            tmr.elements.container.style.display = 'none';
        };

        // start the redirect Timeout
        setRedirectTimeout();

        // on click anywhere stop redirect
        tmr.elements.container.onclick = ()=>{cancelRedirect();};
    }

    // Return the redirect url param as bool
    function urlParamRedirect(){
        let pathArray = /redirect=([^&]+)/.exec(window.location.href);

        // deault behavior
        if (pathArray === null){
            return true;
        }

        return ( pathArray[1] === '0' ) ? false : true;
    }

    // Returns whether the page should redirect
    // Keep for inclusion of other checks when they are ported.
    function shouldRedirect(){
        return urlParamRedirect();
    }

    // add the gear when the hcat popup is available
    function addGear(){
        // wait until chat popup available
        let gearInterval = setInterval(()=>{
            let chatpopup = document.getElementsByClassName('chat-settings chat-menu dropmenu');
            if(chatpopup.length > 0){
                clearInterval(gearInterval);
                gearInterval = null;

                tmr.elements.gear = document.createElement('div');
                tmr.elements.gear.innerHTML = '<div style="cursor:pointer;background: rgba(237,237,237,0.7);padding: 0.5rem 10rem 0.2rem 1.3rem;"> <img src="data:image/png;base64,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" style=" width: 15%;"> <span style="">TMR Settings</span> </div>';

                chatpopup[0].insertBefore(tmr.elements.gear, chatpopup[0].firstChild);

                // Gear onclick function;
                tmr.elements.gear.addEventListener('click', ()=>{
                    tmr.elements.container.style.display = 'block';
                });
            }
        }, 100);
    }

    console.log('%c AutotwitchLS loaded! ', 'background: #333; color: #fff; font-size: 2em;');
})();