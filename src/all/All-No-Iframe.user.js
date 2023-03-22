// ==UserScript==
// @name        All: No Iframe
// @namespace   no-iframe
// @homepage    https://openuserjs.org/scripts/Azev/no-iframe
// @icon        http://i.imgur.com/YdrrcRX.png
// @description Disable iframes
// @author		  Azev
// @version     2.0
// @grant       none
// @run-at      document-start
// @match       https://*kickass.*
// @match       https://*torrent.*
// @match       https://*tracker.*



// ==/UserScript==
var counter = 0

function hideFrames() {
  var elms = document.getElementsByTagName("iframe")
  for (var i = 0; i < elms.length; i++) {
    if (elms[i].src.indexOf('youtube.com') == -1) { // allow youtube videos
      elms[i].style.display = 'none'
      elms[i].src = 'about:blank'
      counter++
    }
  }
  //counter+=elms.length;
}

function popInfo() {

  if (counter > 0) {
    var info = document.createElement('div')
    info.innerHTML = '<b>' + counter + '</b> iframes blocked.'
    info.style.position = 'fixed'
    info.style.zIndex = '99999'
    info.style.top = '30px'
    info.style.right = '30px'
    info.style.border = '1px solid #999'
    info.style.borderRadius = '7px'
    info.style.borderBottomLeftRadius = '0'
    info.style.backgroundColor = '#FFFFEE'
    info.style.color = '#FF0000'
    info.style.padding = '12px'
    info.style.fontSize = '12px'
    info.style.fontFamily = 'Verdana'
    document.body.appendChild(info)
    setTimeout(function () {
      info.style.visibility = 'hidden'
    }, 5000)
  }
}

if (window.top != window.self) {
  self.location = 'about:blank'
  //counter++;
} else {

  document.addEventListener("DOMContentLoaded", hideFrames) // after load
  window.addEventListener("load", hideFrames) // after full load
  window.addEventListener("load", popInfo) // after full load

}
