// ==UserScript==
// @name          Twitch: RSS Button
// @namespace     https://egore.url.lol/userscripts
// @description   Add link to a channel's RSS feed
// @include       *://*.twitch.*/*
// @run-at        document-start
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @version      0.0.1.20191107015349
// @downloadURL  https://update.greasyfork.org/scripts/392078/Twitch%20RSS%20Button.user.js
// @updateURL    https://update.greasyfork.org/scripts/392078/Twitch%20RSS%20Button.meta.js
// ==/UserScript==

setInterval(function()
{

    var cur_url = window.document.URL;

//// Get Rss Link
    var fields = cur_url.split('/');
    var junk1 = fields[0];
    var junk2 = fields[1];
    var twitchlink = fields[2];
    window.channellink = fields[3];
    var junk3 = fields[4];
    window.targetlink = "https://twitchrss.appspot.com/vod/" + window.channellink;

    var btn = document.getElementById('button')

        if (window.channellink != "")
        {
          if (window.channellink != "directory")
          {
              btn.style.visibility = "visible";
          }
          else
          {
              btn.style.visibility = "hidden";
          }
        }
        else
        {
            btn.style.visibility = "hidden";
        }
}, 500);

        //Make Button
    addButton("RSS Feed", rssFeedFn)

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '86%', left:'75%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        button.id = "button"
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }


    //Clck Button

    function rssFeedFn()
    {
        if (window.channellink != "")
        {
          if (window.channellink != "directory")
          {
              window.open(window.targetlink);
          }
        }

    }
