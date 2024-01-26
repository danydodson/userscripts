// ==UserScript==
// @name         Kick: Auto Quality
// @namespace    https://egore.url.lol/userscripts
// @version      1.2.1
// @author       Sharkiller
// @description  Auto select best quality, show buffer delay and speedup the stream to catch up.
// @match        *://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469543/Kickcom%20-%20Auto%20select%20best%20quality%2C%20show%20buffer%20delay%20and%20speedup%20stream.user.js
// @updateURL https://update.greasyfork.org/scripts/469543/Kickcom%20-%20Auto%20select%20best%20quality%2C%20show%20buffer%20delay%20and%20speedup%20stream.meta.js
// ==/UserScript==



let run = () => {
    if ( isLive() ){
        addLiveStyle();
        setStreamQuality();
        updateDelay();
    }else if ( isVod() ){
        addVodStyle();
    }
}
setInterval(run, 500);


let isLive = () => {
    if ( !getPlayer() ) return false;
    let live_display = document.getElementsByClassName("vjs-live-control");
    if ( live_display.length == 0 ) return false;
    return !live_display[0].classList.contains('vjs-hidden');
}


let isVod = () => {
    if ( !getPlayer() ) return false;
    let live_display = document.getElementsByClassName("vjs-live-control");
    if ( live_display.length == 0 ) return false;
    return live_display[0].classList.contains('vjs-hidden');
}


let updateDelay = () => {
    if ( !document.querySelector('#stream-delay') ){
        createDelayDiv();
    }
    let player = getPlayer();
    if (player){
        let stats = player.getVideoPlaybackQuality();

        let buffer = player.buffered;
        if ( buffer.length === 0 ) return;
        let bufferDelay = buffer.end(0) - player.currentTime;
        document.querySelector('#stream-delay-time').innerHTML = bufferDelay.toFixed(2)+"s";

        if ( bufferDelay > 10 ) playbackRate( 1.5 );
        else if ( bufferDelay > 5 ) playbackRate( 1.2 );
        else if ( bufferDelay > 3 ) playbackRate( 1.1 );
        else if ( bufferDelay > 1.5 ) playbackRate( 1.05 );
        else playbackRate( 1 );

        document.querySelector('#stream-delay').setAttribute('title', 'Buffer Delay'
                                                            +'\nDropped Frames: '+stats.droppedVideoFrames
                                                            +'\nPlayback Rate: '+player.playbackRate);
    }
}


let createDelayDiv = () => {
    let div = document.createElement("div");
    div.id = 'stream-delay';
    div.title = 'Buffer Delay';
    div.classList.add('flex-row', 'flex-nowrap', 'items-center', 'whitespace-nowrap', 'md:flex', 'mr-4');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="white" class="-mt-0.5">'
        + '<path fill="white" d="M256 0c-17.7 0-32 14.3-32 32V96c0 17.7 14.3 32 32 32s32-14.3 32-32V66.7C378.8 81.9 448 160.9 448 256c0 106-86 192-192 192S64 362 64 256c0-53.7 22-102.3 57.6-137.1c12.6-12.4 12.8-32.6 .5-45.3S89.5 60.8 76.8 73.1C29.5 119.6 0 184.4 0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0zM193 159c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l80 80c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80z"/></svg>'
        + '<div id="stream-delay-time" class="ml-3 text-base font-bold text-red-500">0.00s</div>';

    document.querySelector('div.stream-info div.items-end > div:nth-of-type(2)').prepend(div);
}


let getPlayer = () => {
    let video = document.getElementsByClassName('vjs-tech');
    if ( video.length == 0 ) return false;
    if ( video[0].nodeName != 'VIDEO' ) return false;
    if ( isNaN(video[0].duration) ) return false;
    return video[0];
}



let checkQuality = (quality) => {
    let node = document.evaluate("//span[text()='"+quality+"']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (node){
        if (node.parentNode.getAttribute('aria-checked') === 'true'){
            return true;
        }
        node.parentNode.click();
        return true;
    }
    return false;
}

let setStreamQuality = () => {
    if (checkQuality('1080p60') ||
       checkQuality('1080p') ||
       checkQuality('936p60') ||
       checkQuality('720p60') ||
       checkQuality('720p') ||
       checkQuality('Auto') ){
        return true;
    }
    return false;
}

let addSeekToLive = () => {
    if ( !document.querySelector('#seek-to-live') ){
        let btn = document.createElement('button');
        btn.id = 'seek-to-live';
        btn.classList.add('vjs-control','vjs-button');
        btn.innerHTML = '<span class="vjs-icon-placeholder" aria-hidden="true">'
            + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="white" height="18" width="18" style="margin: auto">'
            + '<path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>'
            + '</span><span class="vjs-control-text" aria-live="polite">Seek to Live</span>';

        btn.addEventListener('click', () => {
            if ( isLive() ){
                let player = getPlayer();
                if ( !player ) return;

                let buffer = player.buffered;
                player.currentTime = buffer.end(0) - 1;
            }
        });

        document.querySelector('.vjs-volume-panel').after(btn);
    }
}

let playbackRate = (rate) => {
    let player = getPlayer();
    if ( !player ) return;

    if ( isLive() ){
        player.playbackRate = rate;
    }else if ( isVod() ){
        if ( rate === 'down' ){
            if ( player.playbackRate - 0.25 >= 0.25){
                player.playbackRate -= 0.25;
            }
        }else if ( rate === 'up' ){
            if ( player.playbackRate + 0.25 <= 2){
                player.playbackRate += 0.25;
            }
        }
        document.querySelector('.vjs-playback-rate-value').innerHTML = player.playbackRate+'x';
    }
}

window.addEventListener('keydown', (ev) => {
    if ( ![37,39,188,190].includes(ev.which) ) return;
    if ( ev.altKey || ev.ctrlKey || ev.shiftKey ) return;
    if ( document.activeElement.id === "message-input" ) return;

    let player = getPlayer();
    if ( !player ) return;

    if ( !isLive() && !isVod() ) return;

    switch (ev.which) {
        case 37:
            player.currentTime -= 5;
            break;
        case 39:
            player.currentTime += isLive()? 1 : 5;
            break;
        case 188:
            if ( isVod() ) playbackRate( 'down' );
            break;
        case 190:
            if ( isVod() ) playbackRate( 'up' );
            break;
    }

    ev.preventDefault();
    ev.stopPropagation();
});


// CSS Styles

let LiveStyleAdded = false;
let VodStyleAdded = false;

// Live

let addLiveStyle = () => {
if ( LiveStyleAdded ) return;
LiveStyleAdded = true;
console.log('Live Style Added!');

addSeekToLive();

GM_addStyle(`
#stream-delay-time{
    width: 50px;
}
`);
}

// Vod

let addVodStyle = () => {
if ( VodStyleAdded ) return;
VodStyleAdded = true;
console.log('Vod Style Added!');

let elem = document.querySelector('div.vjs-playback-rate');
if ( elem ) elem.classList.remove('vjs-menu-button','vjs-menu-button-popup','vjs-button','vjs-hidden');

elem = document.querySelector('button.vjs-playback-rate');
if ( elem ) elem.classList.remove('vjs-menu-button','vjs-menu-button-popup','vjs-button');

GM_addStyle(`
.video-js .vjs-playback-rate,
.vjs-playback-rate .vjs-playback-rate-value,
.video-js .vjs-time-control
{
    display: flex!important;
    user-select: none;
    font-size: .875rem;
    line-height: 1.25rem;
    align-items: center;
    justify-content: center;
}
.vjs-load-progress{
    display: none!important;
}
`);
}