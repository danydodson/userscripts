// ==UserScript==
// @name         PirateBay: Results Thumbnails
// @version      1.0
// @author       qwertanon
// @description  Looks at search results on PirateBay results page that include Porn and adds a box with google image search results for the torrent title when you hover over the result. Also simplies the page's title.
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/piratebay/PirateBay-Results-Thumbs.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/piratebay/PirateBay-Results-Thumbs.user.js
// @icon         https://thepiratebay.org/favicon.ico
// @match        thepiratebay.org/search/*
// @match        https://pirate-bays.net/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var searchbar = document.getElementsByClassName("inputbox")[0]
document.title = "TPB - " + searchbar.value

//Phrases to take out of the torrent's title when adding it to the screenshot search link.
var titleterms = [".mp4", "mp4", "KTR", "rarbg", " xxx ", " XXX ", "1080p", "720p", "480p", ".mov", "Split Scenes", "2160p", "new release", "dvdrip", " sd ", "new", "web-dl", "x264", "sparrow"]

var SearchResults = document.getElementById("searchResult")

var Categories = document.getElementsByClassName("vertTh")

var pornfound = false
for (var i = 0; i < Categories.length; i++) {
  if (Categories[i].innerHTML.indexOf("Porn") != -1) {
    pornfound = true
  } else {
  }
}

if (pornfound === false) {
  console.log("No porn found, terminating script.")
  return
}

var Titles = document.getElementsByClassName("detName")

//Get the title's text into an array.
var TitlesText = []
for (var i = 0; i < Titles.length; i++) {
  TitlesText.push(Titles[i].textContent)
}

//Clean up Titles
for (var i2 = 0; i2 < TitlesText.length; i2++) {
  TitlesText[i2] = TitlesText[i2].replace(/[\-\[\]\/\{\}\(\)\=\*\+\.\,\\\^\$\|]/g, " ") //Remove special characters.
  for (var i = 0; i < titleterms.length; i++) {
    titletermregex = new RegExp(titleterms[i], "gi")
    TitlesText[i2] = TitlesText[i2].replace(titletermregex, " ")
  }
  TitlesText[i2] = TitlesText[i2].replace(/\s+/g, " ")
}

//Insert new CSS.
var css = document.createElement("style")
css.type = "text/css"
css.innerHTML = "div.nontooltip {display:none} div.tooltip {background-color: yellow; padding: 5px; display: none;  position: absolute; z-index: 5;} a.detLink:hover + .tooltip {display: block;} "
document.head.appendChild(css)

//Insert hover boxes in each result.
var detNameelements = document.getElementsByClassName("detName")
for (var i = 0; i < detNameelements.length; i++) {
  var currenttext = TitlesText[i]
  var hoverbox = document.createElement('div')
  hoverbox.className = "tooltip"
  var hoverboxtext = document.createTextNode(TitlesText[i])
  hoverbox.appendChild(hoverboxtext)
  detNameelements[i].appendChild(hoverbox)
}

var tooltipelems = document.getElementsByClassName("tooltip")

if (Categories[0].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[0] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[0].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }

    }
  })
}
if (Categories[1].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[1] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[1].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[2].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[2] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[2].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[3].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[3] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[3].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[4].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[4] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[4].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[5].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[5] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[5].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[6].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[6] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[6].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[7].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[7] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[7].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[8].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[8] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[8].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[9].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[9] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[9].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[10].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[10] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      //console.log("GM_xmlhttpRequest url = https://www.google.com/search?q=" + TitlesText[10] + "+porn&tbm=isch&sout=1");
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[10].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }

    }
  })
}

if (Categories[11].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[11] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[11].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[12].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[12] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[12].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[13].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[13] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[13].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[14].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[14] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[14].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[15].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[15] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[15].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[16].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[16] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[16].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}
if (Categories[17].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[17] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[17].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[18].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[18] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[18].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[19].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[19] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[19].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[20].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[20] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[20].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[21].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[21] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[21].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[22].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[22] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[22].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[23].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[23] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[23].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[24].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[24] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[24].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[25].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[25] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[25].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[26].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[26] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[26].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[27].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[27] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[27].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[28].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[28] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[28].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}

if (Categories[29].innerHTML.indexOf("Porn") != -1) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.google.com/search?q=" + TitlesText[29] + "+porn&tbm=isch&sout=1",
    onload: function (response) {
      var googleimagenode = document.createElement("P")
      googleimagenode.style.visibility = 'hidden'
      googleimagenode.innerHTML = response.responseText
      var googleimages = googleimagenode.getElementsByTagName("img")
      var googleimageresults = document.createElement("P")
      tooltipelems[29].appendChild(googleimageresults)
      for (var i2 = 2; i2 < 9; i2++) {
        var img = document.createElement("img")
        img.src = googleimages[i2].src
        var imglink = document.createElement('a')
        imglink.setAttribute('href', googleimages[i2].parentNode.href)
        var brokenhref = imglink.href
        var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6)
        var fixedhref = fixedhref.slice(0, fixedhref.indexOf("&sa=U"))
        imglink.setAttribute('href', fixedhref)
        imglink.appendChild(img)
        googleimageresults.appendChild(imglink)
      }
    }
  })
}
