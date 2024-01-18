// ==UserScript==
// @name         PirateBay: Pirate Bay Cleaner
// @version      5.6.1
// @author       BoKu
// @description  Updated for 2022. Settings are in the navigation menus. Now Includes support for thepiratebay.org with support for 1337x.to and rarbg.to hopefully soon.
// @license 	   The Pirate Bay Cleaner is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/pbay/PBay-Cleaner.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/pbay/PBay-Cleaner.user.js
// @icon         https://thepiratebay.org/favicon.ico
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.openInTab
// @run-at       document-end
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js#sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js#sha512-bCd+wlawQOsxutqlrFLgATxcGnQcb2PQ/Og8DtTcLzJVssqgSk3Ro0qUuOKF3fgZwee622W/i91fGYrd32zFpw==
// @include      https://thepiratebay.org/*
// @include      https://pirate-bays.net/*
// @include      https://rargb.to/
// @include      https://1337x.to/*
// @include      https://eztv.re/*
// @include      https://kickass.onl/*
// ==/UserScript==

"use strict"
const WindowLocationHostname = ProxyTranslate(window.location.hostname.toLowerCase())
var PDT

function RemoveAds(DoThis) {
  GM.setValue("RemoveAds", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("section[class^='col-left ad']").remove()
        $("section[class^='col-right ad']").remove()
        $(".adblock").remove()
        $("dl#meta-right.col-meta").remove()
        $("div.links > label > a[href*='coiwqe.site']").remove()
        $("a[href*='a_fid=hulkvpn']").remove()
        /* Proxy Specific Settings */
        if (window.location.hostname.toLowerCase() == "pirateproxy.surf") {
          $("center").remove()
        }
        break
      case 'rarbg.to':
        $("#top_news *").css("width", "100%")
        $("#newsRight, a[href*='dyncdn'], a[onclick='Bookmark()'], a[onclick='addsearchplugin()']").remove()
        $("a[href$='viewnews'], a[href$='chart.php'], a[href$='login'], a[href$='trailers.php']").parent().remove()
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RemoveAds", "Remove advertisements (i.e. those pesky space-taking VPN ads!)", "checkbox", DoThis)
}

function FullSize(DoThis) {
  GM.setValue("FullSize", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("body#browse").width("100%")
        break
      case 'rarbg.to':
        $("html > body > table").css("width", "100%")
        $("img[src$='logo_dark_nodomain2_optimized.png']").css({ "margin": "0px", "height": "32px" })
        $("body > table:first > tbody > tr > td:not(:first)").remove()
        $("table.lista3[style^='padding: 20px']").css("padding", "0")
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("FullSize", "Resize the page to fill up the browser window. (i.e. full width)", "checkbox", DoThis)
}

function RemovePorn(DoThis) {
  GM.setValue("RemovePorn", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("optgroup[label='Porn']").remove()
        $("div[class='category_list'] > div, li[class*='list-entry'], span[class='form-box']").each(function (i) {
          if ($(this).text().toLowerCase().indexOf("porn") >= 0) {
            $(this).remove()
          }
        })
        break
      case 'rarbg.to':
        $("td.header5 > a[href$='category=2;4'], div.divadvscat > a[href$='category[]=4'], td.header5 > a:contains(Non XXX)").parent().remove()
        $("tr.lista2 > td > a[href$='category=4']").parent().parent().remove()
        $("a[href$='category[]=4'] > button, a[href$='category=4'] > button").remove()
        $("h1:contains(XXX)").next("table").remove()
        $("h1:contains(XXX)").remove()
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RemovePorn", "Remove adult material (i.e. Porn, XXX, etc.)", "checkbox", DoThis)
}

function DarkMode(DoThis, NoSetting) {
  GM.setValue("DarkMode", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("body").css("background-color", "#121212")
        $("*").css("color", "#fff")
        $("a, a > strong").css({ "color": "#02800e", "border-bottom": "1px dotted" })
        $("a > b").css({ "color": "#02800e" })
        $("a").hover(function () { $(this).css("border-bottom", "1px solid #02800e") }, function () { $(this).css("border-bottom", "1px dotted #02800e") })
        $("a > img").parent().hover(function () { $(this).css({ "border-bottom": "none" }) }).css({ "border-bottom": "none" })
        $("#browse h1, input, select#cat, h2, #description_container .text-box, #description_container #filelist li").css("background-color", "#242424")
        $("#browse h1").css("border-bottom", "solid 1px #555555")
        $("#description_container .text-box").css("border", "solid 1px #555555")
        $("#torrents span.list-header").css({ "background": "#555555", "border": "solid 1px #121212" })
        $("#torrents li.list-entry, #description_container").css("background", "#333")
        $("#torrents li.list-entry").hover(function () { $(this).css("background", "#121212") }, function () { $(this).css("background", "#333") })
        $("#torrents li.list-entry.alt").css("background", "#222")
        $("#torrents li.list-entry.alt").hover(function () { $(this).css("background", "#121212") }, function () { $(this).css("background", "#222") })
        $("img[src*='tpb.jpg']").attr("style", "width:275px;height:295px;").attr("src", "https://i.imgur.com/F6VXCWv.png")
        $("img[src*='tpbsmall_notext.jpg']").attr("style", "width:82px;height:87px;").attr("src", "https://i.imgur.com/F6VXCWv.png")
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  if (!NoSetting) {
    AddSetting("DarkMode", "Enable Dark Mode (A sweet darker theme if I do say so)", "checkbox", DoThis)
  }
}

function RemoveUntrusted(DoThis) {
  GM.setValue("RemoveUntrusted", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("li[class*='list-entry']").each(function () {
          if (!$(this).html().match(/alt=\"Trusted\"|alt=\"VIP\"|alt=\"Helper\"|alt=\"Moderator\"|alt=\"Supermod\"|alt=\"Admin\"/gi)) {
            $(this).remove()
          }
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RemoveUntrusted", "Remove untrusted users (i.e. users without a trusted skull etc.)", "checkbox", DoThis)
}

function RemoveFooter(DoThis) {
  GM.setValue("RemoveFooter", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("footer").remove()
        break
      case 'rarbg.to':
        $("body > div[align='center']").remove()
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RemoveFooter", "Remove footer (i.e. Forum, TOR, Bitcoin links etc.)", "checkbox", DoThis)
}

function BiggerFont(DoThis) {
  GM.setValue("BiggerFont", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $(".view-single").addClass("view-double").removeClass("view-single")
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("BiggerFont", "Increase the font size in the torrent list", "checkbox", DoThis)
}

function ShrinkDescription(DoThis) {
  GM.setValue("ShrinkDescription", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("div#description_text").toggle()
        $("<a />", {
          "text": "↕ Hide/Show Description",
          "href": "#",
          "class": "links",
          "style": "margin-left:15px;border-bottom:0px!important;"
        }).on("click", function (e) {
          e.preventDefault()
          $("div#description_text").toggle()
        }).insertBefore("div#description_text")
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("ShrinkDescription", "Shrink (Hide/Show) the torrent description box.", "checkbox", DoThis)
}

function ShrinkFileList(DoThis) {
  GM.setValue("ShrinkFileList", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("div#filelist").toggle()
        $("<a />", {
          "text": "↕ Hide/Show File List",
          "href": "#",
          "class": "links",
          "style": "margin-left:15px;border-bottom:0px!important;"
        }).on("click", function (e) {
          e.preventDefault()
          $("div#filelist").toggle()
        }).insertBefore("div#filelist")
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("ShrinkFileList", "Shrink (Hide/Show) the file list below the description box.", "checkbox", DoThis)
}

function RemoveZeroSeeds(DoThis) {
  GM.setValue("RemoveZeroSeeds", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("span.list-item.item-seed").each(function () {
          if ($(this).text() == "0") {
            $(this).parent().remove()
          }
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RemoveZeroSeeds", "Remove torrents that have zero seeds.", "checkbox", DoThis)
}

function FixRowColours(DoThis) {
  GM.setValue("FixRowColours", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("li.list-entry").each(function (e) {
          $(this).removeClass("alt")
          if ((e % 2) == "1") {
            $(this).addClass("alt")
          }
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  switch (WindowLocationHostname) {
    case 'thepiratebay.org':
      (async () => {
        let DoThisAgain = await GM.getValue("DarkMode", false)
        DarkMode(DoThisAgain, true)
      })()
      break
    case 'rarbg.to':
      break
    case '1337x.to':
      break
  }
  AddSetting("FixRowColours", "Re-alternate the torrent row colours (used in conjuction with removing torrent settings)", "checkbox", DoThis)
}

function HideUploader(DoThis) {
  GM.setValue("HideUploader", DoThis)
  if (DoThis === true) {
    (async () => {
      let filterList = await GM.getValue("HideUploader_List", "")
      filterList = filterList.trim().split('\n')
      if (filterList.length == 1 && filterList[0] === "") { return }
      switch (WindowLocationHostname) {
        case 'thepiratebay.org':
          $("span.list-item.item-user").each(function () {
            let itemValue = $(this).text()
            if (filterList.includes(itemValue)) {
              $(this).parent().remove()
            }
          })
          break
        case 'rarbg.to':
          break
        case '1337x.to':
          break
      }
    })()
  }
  AddSetting("HideUploader", "Remove users that you don't like torrents from (e.g. aXXo, YIFY, Anonymous etc.) One per line. <strong style='color:red;'>CASE SENSITIVE</strong>", "wordlist", DoThis)
}

function KeywordFilter(DoThis) {
  GM.setValue("KeywordFilter", DoThis)
  if (DoThis === true) {
    (async () => {
      let filterList = await GM.getValue("KeywordFilter_List", "")
      filterList = filterList.trim().split('\n')
      if (filterList.length == 1 && filterList[0] === "") { return }
      switch (WindowLocationHostname) {
        case 'thepiratebay.org':
          $("span.list-item.item-name").each(function () {
            let itemValue = $(this).text()
            if (filterList.some(word => itemValue.includes(word))) {
              $(this).parent().remove()
            }
          })
          break
        case 'rarbg.to':
          break
        case '1337x.to':
          break
      }
    })()
  }
  AddSetting("KeywordFilter", "Remove torrents that contain certain words (e.g. 480p, DVD, .TS. etc.) One per line. <strong style='color:red;'>CASE SENSITIVE</strong>", "wordlist", DoThis)
}

function Replace(oldstring = "", newvalue = "") {
  return oldstring.replace('<<replace>>', newvalue)
}

function PromoteuBlockOrigin(DoThis) {
  if (DoThis === true) {
    let newDiv = $("<div />", {
      "style": "margin-bottom:10px; color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.25rem; padding: 0.50rem 1.00rem; text-align:center; font-size:0.75rem;",
      "html": "The Pirate Bay Cleaner recommends using <a style='border-bottom:0;' href='https://github.com/gorhill/uBlock#ublock-origin' target='_blank' title='Get uBlock Origin'><img style='height:20px;width:20px;' src='https://raw.githubusercontent.com/gorhill/uBlock/master/doc/img/icon38@2x.png'> <strong>uBlock Origin</strong></a> as well."
    })
    newDiv.appendTo("div#TPBCleaner.pico-content")
  }
}

function AddInfoIcon(DoThis) {
  GM.setValue("AddInfoIcon", DoThis)
  let IconImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAg9JREFUKFNtkV9IU3Ecxe9LDxY1GgyF1W2r2W6ru6bZvDk2/ENqtjKZI8mk5i2tnHNegimYkBKyGRG9DJEZ+dBDD9JbCRYEBYbVvFq6ldvKdMz807DVbD2cfgrBhL5P34fPOXy/51BU2sgUx8qYkg7vwUrfC+aUd0TBNfdslezRpTP/9gy2vPuByRGEvimE0x0RlLrCyHdEoL/iT2Zq69o2idjyrkGD8wtyL4lgbX6MzyRw/+k3aHgRXEsQBddnIdVY7Rsi6e784+vOuZdFHGkQYXS+xwVPCGdufsLRlmlwQgAGVwR5V0fjVIZUTqmLbvRz9hDyGkUcIo6u/lmEomvwDS8hu2EKOicxEz5C3xaFZH8FT+ksAy/114Jg+XHsrfVDdXECsZUUnrxbBdNMwPYwOPKToWsZtEm4Q7GVfc81tmnssr4BTQSaxg+YWyICfwI57Z9ReGsOxe4oSu8moCxqdVNZOU0e+dkA6Jq32EfctfYA5pdTGJ74Ca57HifuLcLsXUGVLwmZuria2rJNqaWtr1OK85PI5idxmNy8EP+DZ1NJGHsXUDUQR+0QYHaPhUlGko2kdjLnXKr6GSj5IDofxvCVnBSMpSAMrcL6CKh//ON31oGCik1dbFdbHKq6V4umzhjKer/D0vcLNYNrMHvGApmM8eT/2qbWc5aozDa5UbhNF7b2yNQlFgLuSIf/AudoEB2ILrLAAAAAAElFTkSuQmCC"
  let APIUrl = 'https://apibay.org/t.php?id=<<replace>>'
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("li.list-entry").each(function () {
          let IconColumn = $(this).find("span[class='item-icons']")
          IconColumn.css("width", "100%")
          let TorrentID = $(this).find("a[href*='description.php?id=']").attr('href').split('id=')[1]
          let InfoUrl = Replace(APIUrl, TorrentID)
          $.get(InfoUrl, function (APIData) {
            let TorrentInfo = APIData.descr
            if (TorrentInfo === null) { return }
            TorrentInfo = TorrentInfo.replace(/(?:\r\n|\r|\n)/g, '<br>')
            let newInfoIcon = $("<img />", {
              src: IconImage,
              style: "cursor:pointer;"
            })
            newInfoIcon.on("click", function () {
              picoModal({
                content: TorrentInfo,
                width: "50%",
                overlayStyles: {
                  backgroundColor: "#000",
                  opacity: 0.75
                }
              })
                .afterClose(function (modal) { modal.destroy() })
                .show()
            })
            IconColumn.append("&nbsp;").append(newInfoIcon)
          })
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("AddInfoIcon", "Add an image icon that displays information about the torrent. <img src='" + IconImage + "'>", "checkbox", DoThis)
}

function AddIMDBIcon(DoThis) {
  GM.setValue("AddIMDBIcon", DoThis)
  let IconImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAMCAMAAABP7o1HAAAAA3NCSVQICAjb4U/gAAAAilBMVEUAAADnwBC2hhBKQQr/4CW6jBDwxiTbsRBoWw8eGAObhBb/7iX40SSokhi8pRqEbxTyzRDKqh3NoRD/9yFYSwz81iSylhrgvyDpzB8uJwb/5SXGmRCWfRWlihh3ZxDuxhAGBQD20RDv0SBhVQzAkhDTqBC2nBqtlBiqjhjDpRucjBleUAzhwx/y1CAgsSEMAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3NPsx9OAAAAFnRFWHRDcmVhdGlvbiBUaW1lADAxLzI3LzEwRqa2TAAAAINJREFUGJV1jEkSgkAQBBMZBGFUJBwXUHEBwVD//z0LDW9DHuqQ2dFcRiDPvOTU/lATlGXJndM10cKC9y6TCv6B9Kydc1N8fUNsjKGDGWx0Hw5ZKqb9hb1KJxmyJZVqKZxz9CSs9ajnyYNeqqCy1nLkwFJ6eAcrqYrGemmIpl4iJiN8AInuDuH3dvGpAAAAAElFTkSuQmCC"
  let APIUrl = 'https://apibay.org/t.php?id=<<replace>>'
  let IMDBUrl = 'https://www.imdb.com/title/<<replace>>/'
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("li.list-entry").each(function () {
          let IconColumn = $(this).find("span[class='item-icons']")
          IconColumn.css("width", "100%")
          let TorrentID = $(this).find("a[href*='description.php?id=']").attr('href').split('id=')[1]
          let InfoUrl = Replace(APIUrl, TorrentID)
          $.get(InfoUrl, function (APIData) {
            let IMDBID = APIData.imdb
            if (IMDBID === null) { return }
            let IMDBLink = Replace(IMDBUrl, IMDBID)
            let newIMDBIcon = $("<img />", {
              src: IconImage,
              style: "cursor:pointer;",
              title: IMDBLink
            })
            newIMDBIcon.on("click", function () {
              window.open(IMDBLink)
            })
            IconColumn.append("&nbsp;").append(newIMDBIcon)
          })
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("AddIMDBIcon", "Add an image icon that links the to the IMDB page. <img src='" + IconImage + "'>", "checkbox", DoThis)
}

function RememberDownloaded(DoThis) {
  GM.setValue("RememberDownloaded", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        $("li.list-entry").each(function (t) {
          let TorrentID = $(this).find("a[href*='description.php?id=']").attr('href').split('id=')[1]
          if ($.inArray(TorrentID, PDT) >= 0) {
            $(this).css("text-decoration", "line-through")
            return
          }
          let Magnet = $(this).find("a[href^='magnet']")[0]
          $(Magnet).on("click", function (e) {
            PDT.push(TorrentID)
            DownloadedTorrents(PDT)
            $($("li.list-entry")[t]).css("text-decoration", "line-through")
          })
        })
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("RememberDownloaded", "Strike-out <strike><i>example</i></strike> previously downloaded torrents (when magnet link clicked)", "checkbox", DoThis)
}

function AddSetting(name, desc, type, value) {
  let newDiv = $("<div />", {
    "style": "margin-bottom:5px;"
  })
  let isChecked = value == true ? true : false
  let newElement = $("<label />", {
    "html": desc,
    "for": "tpbc_" + name,
    style: "line-height: 1.5em;"
  })
  let newCheck = $("<input />", {
    "type": "checkbox",
    "id": "tpbc_" + name,
    "checked": isChecked,
    "style": "margin:0; padding:0; margin-right:10px; min-height:13px; max-height:16px"
  })
  newCheck.on("click", function (e) {
    GM.setValue(name, this.checked)
    $("#" + name + "_List").prop("disabled", !this.checked)
  })
  newCheck.prependTo(newElement)
  newElement.appendTo(newDiv)
  if (type == "wordlist") {
    (async () => {
      let wordListVals = await GM.getValue(name + "_List", "")
      let wordList = $("<textarea />", {
        "id": name + "_List",
        "rows": 5,
        "style": "width:100%; resize:none; background-color:#242424;color:#fff;",
        "text": wordListVals,
        "disabled": (!isChecked),
        "placeholder": "Using this feature may slow down page load times"
      })
      wordList.on("keyup", function (e) {
        GM.setValue(name + "_List", $(this).val())
      })
      wordList.appendTo(newDiv)
    })()
  }
  newDiv.appendTo("div#TPBCleaner.pico-content")
}

function ProxyTranslate(CurrentUrl = null) {
  if (CurrentUrl) {
    switch (CurrentUrl) {
      case 'thepiratebay.org':
      case 'pirateproxy.surf':
        CurrentUrl = 'thepiratebay.org'
        break
      case 'rarbg.to':
        CurrentUrl = 'rarbg.to'
        break
      case '1337x.to':
      case '1337x.st':
      case 'x1337x.ws':
      case 'x1337x.eu':
      case 'x1337x.se':
        CurrentUrl = '1337x.to'
        break
      default:
        CurrentUrl = CurrentUrl
        break
    }
  }
  return CurrentUrl
}

function FixJsRedirect(DoThis) {
  GM.setValue("FixJsRedirect", DoThis)
  if (DoThis === true) {
    switch (WindowLocationHostname) {
      case 'thepiratebay.org':
        if (WindowLocationHostname === "thepiratebay.org" && window.location.pathname == "/static/main.js") {
          let RedirectTo = window.location.origin + "/browse.php"
          window.location.href = RedirectTo
        }
        break
      case 'rarbg.to':
        break
      case '1337x.to':
        break
    }
  }
  AddSetting("FixJsRedirect", "Fixes an issue where you sometimes end up on /static/main.js (thepiratebay.org only)", "checkbox", DoThis)
}

function DownloadedTorrents(arrDownloadedTorrents) {
  //Array of Previously Downloaded Torrents
  if (typeof arrDownloadedTorrents == "string") {
    PDT = JSON.parse(arrDownloadedTorrents)
  } else if (typeof arrDownloadedTorrents == "object") {
    PDT = arrDownloadedTorrents
  }
  GM.setValue("DownloadedTorrents", PDT)
}

function SettingsWindow(DoThis) {
  if (DoThis === true) {
    const picoWindow = picoModal({
      modalId: "TPBCleaner",
      content: "<h2 style='margin-top:2rem; padding: 1rem 0.25rem; background:#242424; text-align:center; border-radius: 0.25rem;'>The Pirate Bay Cleaner Settings</h2>",
      width: "50%",
      focus: true,
      modalStyles: {
        "background-color": "#121212",
        "color": "#fff",
        "padding": "0.5rem 0.5rem 0px",
        borderRadius: "0.25rem", border: "1px solid #02800e",
        "text-align": "left",
        "overflow": "hidden",
        "overflow-y": "auto"
      },
      overlayStyles: {
        backgroundColor: "#000",
        opacity: 0.75
      },
      closeStyles: {
        position: "absolute", top: "0.5rem", right: "0.5rem",
        "color": "#fff",
        background: "#121212", padding: "0.25rem 0.5rem", cursor: "pointer",
        borderRadius: "0.25rem", border: "1px solid #02800e"
      }
    }).afterClose((modal, event) => {
      location.reload()
    }).buildDom()

    switch (WindowLocationHostname) {
      case 'thepiratebay.org': {
        let SettingsLink = $("<a />", {
          text: "TPBC ⚙",
          title: "The Pirate Bay Cleaner Settings",
          href: "TPBC ⚙"
        })
        SettingsLink.on("click", function (e) {
          e.preventDefault()
          picoWindow.show()
        })
        $("nav").append(" | ").append(SettingsLink)
        break
      }
      case 'rarbg.to': {
        let SettingsTD = $("<td />", {
          class: "header3",
          align: "center"
        })
        let SettingsLink = $("<a />", {
          text: "TPBC ⚙",
          title: "The Pirate Bay Cleaner Settings",
          href: "TPBC ⚙",
          class: "anal tdlinkfull1"
        })
        SettingsLink.on("click", function (e) {
          e.preventDefault()
          picoWindow.show()
        })
        SettingsLink.appendTo(SettingsTD)
        $("table.lista3:contains(Top 10) > tbody > tr > td:first").after(SettingsTD)
        break
      }
      case '1337x.to': {
        break
      }
    }
  }
}

function Load() {
  console.clear();
  (async () => {
    SettingsWindow(true)
    FixJsRedirect(await GM.getValue("FixJsRedirect", true))
    RemoveAds(await GM.getValue("RemoveAds", true))
    FullSize(await GM.getValue("FullSize", true))
    RemovePorn(await GM.getValue("RemovePorn", false))
    RemoveUntrusted(await GM.getValue("RemoveUntrusted", true))
    RemoveFooter(await GM.getValue("RemoveFooter", true))
    RemoveZeroSeeds(await GM.getValue("RemoveZeroSeeds", true))
    ShrinkDescription(await GM.getValue("ShrinkDescription", true))
    ShrinkFileList(await GM.getValue("ShrinkFileList", true))
    BiggerFont(await GM.getValue("BiggerFont", true))
    DarkMode(await GM.getValue("DarkMode", false))
    HideUploader(await GM.getValue("HideUploader", false))
    KeywordFilter(await GM.getValue("KeywordFilter", false))
    FixRowColours(await GM.getValue("FixRowColours", true))
    AddInfoIcon(await GM.getValue("AddInfoIcon", false))
    AddIMDBIcon(await GM.getValue("AddIMDBIcon", false))
    DownloadedTorrents(await GM.getValue("DownloadedTorrents", '[]'))
    RememberDownloaded(await GM.getValue("RememberDownloaded", true))
    PromoteuBlockOrigin(true)
  })()
}
Load()