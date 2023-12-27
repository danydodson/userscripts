// ==UserScript==
// @name             OCH: Multi Helper
// @namespace        cuzi
// @license          MIT
// @description      nopremium.pl and premiumize.me. Inserts a direct download link on several one-click-hosters and some container/folder providers.
// @homepageURL      https://openuserjs.org/scripts/cuzi/Multi-OCH_Helper
// @updateURL        https://openuserjs.org/meta/cuzi/Multi-OCH_Helper.meta.js
// @contributionURL  https://buymeacoff.ee/cuzi
// @contributionURL  https://ko-fi.com/cuzicvzi
// @icon             https://raw.githubusercontent.com/cvzi/Userscripts/master/Multi-OCH/icons/helper.png
// @version          17.1.3

// @match            https://cvzi.github.io/Userscripts/index.html?link=*
// @match            https://www.nopremium.pl/files*
// @match            https://www.premiumize.me/hosters/*
// @match            https://www.premiumize.me/services/*
// @match            https://www.premiumize.me/downloader*

// @match            https://*.filecrypt.cc/Container/*
// @match            https://*.filecrypt.cc/helper.html*
// @match            https://protected.to/*
// @match            https://rapidgator.net/folder/*
// @match            https://safelinking.net/p/*
// @match            https://multiup.org/*

// @match            https://1fichier.com/*
// @match            https://*.1fichier.com/*
// @match            https://www.4shared.com/*
// @match            https://alfafile.net/*
// @match            https://*.alfafile.net/*
// @match            https://anonfiles.com/*
// @match            https://bayfiles.com/*
// @match            https://*.bayfiles.com/*
// @match            http://clicknupload.link/*
// @match            https://clicknupload.to/*
// @match            https://clicknupload.org/*
// @match            https://clicknupload.co/*
// @match            https://clicknupload.cc/*
// @match            https://clicknupload.to/*
// @match            https://clicknupload.club/*
// @match            https://clicknupload.click/*
// @match            https://dailyuploads.net/*
// @match            https://ddl.to/*
// @match            https://ddownload.com/*
// @match            https://*.dropapk.com/*
// @match            https://dropapk.com/*
// @match            https://*.drop.download.com/*
// @match            https://drop.download.com/*
// @match            https://fastclick.to/*
// @match            https://fastshare.cz/*
// @match            https://fikper.com/*
// @match            https://file.al/*
// @match            https://www.file.al/*
// @match            https://filefactory.com/*
// @match            https://www.filefactory.com/*
// @match            https://filenext.com/*
// @match            https://www.filenext.com/*
// @match            https://filer.net/*
// @match            https://filerice.com/*
// @match            https://filespace.com/*
// @match            https://filestore.to/*
// @match            http://fireget.com/*
// @match            https://fireget.com/*
// @match            https://hitfile.net/*
// @match            https://hil.to/*
// @match            https://isra.cloud/*
// @match            https://katfile.com/*
// @match            https://www.mediafire.com/*
// @match            https://mediafire.com/*
// @match            https://mega.nz/*
// @match            https://megaup.net/*
// @match            https://mixdrop.co/*
// @match            https://modsbase.com/*
// @match            https://nitroflare.com/*
// @match            https://rapidgator.net/file/*
// @match            https://rg.to/file/*
// @match            https://spicyfile.com/*
// @match            https://www.spicyfile.com/*
// @match            https://turbobit.net/*
// @match            https://turb.to/*
// @match            https://tusfiles.net/*
// @match            https://ubiqfile.com/*
// @match            https://uploadboy.com/*
// @match            https://uploadgig.com/*
// @match            https://uptobox.com/*
// @match            https://userscloud.com/*
// @match            https://vidoza.org/*
// @match            https://worldbytez.com/*
// @match            https://wrzucajpliki.pl/*
// @match            https://xubster.com/*
// @match            https://*.zippyshare.com/*

// @require          https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @require          https://greasyfork.org/scripts/13883-aes-js/code/aesjs.js
// @grant            GM.registerMenuCommand
// @grant            unsafeWindow
// @grant            GM_setClipboard
// @grant            GM.xmlHttpRequest
// @grant            GM.openInTab
// @grant            GM.setClipboard
// @grant            GM.setValue
// @grant            GM.getValue
// @grant            GM.deleteValue
// @grant            GM.listValues
// ==/UserScript==

/* globals confirm, alert, GM, GM_setClipboard, unsafeWindow, $, atob, slowAES, cloneInto */
/* eslint n/no-callback-literal: 0 */

(async function () {
  'use strict'

  // And to keep for myself whatever I may find? - Certainly. For yourself, and any friends you want to share with you.

  // This program inserts a download link on One-Click-Hosters and a few folder services.
  // If you click on the button, the current website address (or the links on the relink website) will be sent to nopremium.pl and you'll receive a nopremium.pl download link.
  //
  // Standard actions for the button are
  // * left mouse click:                      copy the link to the clipboard
  // * middle/wheel click:                    start download of the link
  // * right mouse click:                     open the nopremium.pl website and insert the link in the text box
  // * hovering the mouse over the button:    open a menu with all the above option
  //

  const scriptName = 'Multi-OCH Helper'
  const scriptReferer = 'multiochhelper'
  const scriptHightligherName = 'Multi-OCH Helper Highlight links'

  const chrome = ~navigator.userAgent.indexOf('Chrome')
  const greasemonkey = 'info' in GM && 'scriptHandler' in GM.info && GM.info.scriptHandler === 'Greasemonkey'

  const config = {
    position: [['bottom', 'top'], ['left', 'right']],
    position_desc: ['vertical', 'horizontal'],
    position_quest: 'Position of the Button. If you use "' + scriptHightligherName + '" this has to be set to bottom left',
    leftClick: ['clipboard', 'download', 'showLinks', 'openWebsite', 'menu', 'sendToJD', 'none'],
    leftClick_desc: ['Copy link to clipboard', 'Direct download', 'Show links like on website', 'Open the multihoster website', 'Show the extended menu', 'Send links to JDownloader', 'Do nothing'],
    leftClick_quest: 'Action on left mouse click on button',
    middleClick: ['download', 'clipboard', 'showLinks', 'openWebsite', 'menu', 'sendToJD', 'none'],
    middleClick_desc: ['Direct download', 'Copy link to clipboard', 'Show links like on website', 'Open the multihoster website', 'Show the extended menu', 'Send links to JDownloader', 'Do nothing'],
    middleClick_quest: 'Action on middle mouse/wheel click on button',
    rightClick: ['openWebsite', 'clipboard', 'showLinks', 'download', 'menu', 'sendToJD', 'none'],
    rightClick_desc: ['Show links like on website', 'Copy link to clipboard', 'Direct download', 'Open the multihoster website', 'Show the extended menu', 'Send links to JDownloader', 'Do nothing'],
    rightClick_quest: 'Action on right mouse click on button',
    mouseOver: ['menu', 'clipboard', 'download', 'showLinks', 'openWebsite', 'sendToJD', 'none'],
    mouseOver_desc: ['Show the extended menu', 'Copy link to clipboard', 'Direct download', 'Show links like on website', 'Open the multihoster website', 'Send links to JDownloader', 'Do nothing'],
    mouseOver_quest: 'Action on mouse hover over button',
    mouseOverDelay: 'int',
    mouseOverDelay_range: [0, 700, 3000],
    mouseOverDelay_quest: 'Mouse hover time before action is executed.',
    mouseOverDelay_suffix: 'milliseconds',
    newTab: 'bool',
    newTab_desc: ['Open in a new tab', 'Open in the same window'],
    newTab_quest: 'Should websites be opened in a new tab?',
    updateHosterStatusInterval: 'int',
    updateHosterStatusInterval_range: [1, 168, 9999],
    updateHosterStatusInterval_quest: 'How often should the status of the hosters be updated?',
    updateHosterStatusInterval_prefix: 'Every',
    updateHosterStatusInterval_suffix: 'hours',
    jDownloaderSupport: 'bool',
    jDownloaderSupport_desc: ['Show JDownloader button if JDownloader is runnning', 'Never show JDownloader button'],
    jDownloaderSupport_quest: ['Show a JDownloader button in the menu?']

  }
  const settings = {}
  // Load settings
  const savedsettings = JSON.parse(await GM.getValue('settings', '{}')) // e.g. {  position : [0,1], newTab : 1  }
  for (const key in config) {
    if (key in savedsettings) { // Saved
      if (config[key] === 'int') { // Int
        settings[key] = parseInt(savedsettings[key], 10)
      } else if (config[key] === 'string') { // String
        settings[key] = savedsettings[key].toString()
      } else if (config[key] === 'bool') { // Bool
        settings[key] = (savedsettings[key] === 'true' || savedsettings[key] === true)
      } else if (Array.isArray(config[key][0])) { // Nested array
        if (!Array.isArray(savedsettings[key])) {
          try {
            const tmp = JSON.parse(savedsettings[key])
            if (Array.isArray(tmp)) {
              savedsettings[key] = tmp
            }
          } catch (e) { }
        }
        settings[key] = []
        for (let i = 0; i < savedsettings[key].length; i++) {
          settings[key].push(savedsettings[key][i])
        }
      } else { // Array
        settings[key] = savedsettings[key]
      }
    } else { // Default
      if (config[key] === 'int') { // Int
        settings[key] = config[key + '_range'][1]
      } else if (config[key] === 'string') { // String
        settings[key] = '' // String defaults to empty string
      } else if (config[key] === 'bool') { // Bool
        settings[key] = true
      } else if (Array.isArray(config[key][0])) { // Nested array defaults to first value for each array
        settings[key] = []
        for (let i = 0; i < config[key].length; i++) {
          settings[key].push(config[key][i][0])
        }
      } else {
        settings[key] = config[key][0] // Array defaults to first value
      }
    }
  }

  const JDOWNLOADER = 'http://127.0.0.1:9666/'
  const SPINNERCSS = `/* http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/ */
  .ochspinner {
    height:16px;
    width:16px;
    margin:0px auto;
    position:relative;
    animation: rotation .6s infinite linear;
    border-left:6px solid rgba(0,174,239,.15);
    border-right:6px solid rgba(0,174,239,.15);
    border-bottom:6px solid rgba(0,174,239,.15);
    border-top:6px solid rgba(0,174,239,.8);
    border-radius:100%;
  }
  @keyframes rotation {
    from {transform: rotate(0deg)}
    to {transform: rotate(359deg)}
  }
  `
  // const LOADINGBARBG = 'background: #b4e391;background: linear-gradient(to bottom, #b4e391 0%,#61c419 50%,#b4e391 100%);'

  let showOneclickButton = false
  let showOneclickLink = ''
  let showOneclickFromHighlighScriptAllLinks = document.location.host === 'cvzi.github.io'
  let showOneclickFromHighlighScriptAllLinksLoc = false
  let showOneclickFromHighlighScriptAllLinksLinks = ''
  let showOneclickFromHighlighScriptSelectedLinks = false
  let showOneclickFromHighlighScriptSelectedLinksLoc = false
  let showOneclickFromHighlighScriptSelectedLinksLinks = ''

  let linksBeforeSelection = false

  const multi = {
    'premiumize.me': new function () {
      const self = this
      this.config = {
        apikey: 'string',
        apikey_hidden: true,
        apikey_quest: 'Enter your premiumize.me API key',
        apikey_prefix: 'API key: ',
        apikey_suffix: ' find it under <a target="_blank" href="https://www.premiumize.me/account">https://www.premiumize.me/account</a>'
      }
      this.key = 'premiumize.me'
      this.name = 'premiumize'
      this.homepage = 'https://www.premiumize.me/'
      // this.updateStatusURL = 'https://www.premiumize.me/services';
      this.updateStatusURLpattern = /https:\/\/www\.premiumize\.me\/services\/?/
      this.updateDownloadProgressInterval = 5000
      this.updateDownloadProgressInterfaceInterval = 500

      this.status = {}

      this.init = async function () {
        self.status = JSON.parse(await GM.getValue(self.key + '_status', '{}'))
        self.lastUpdate = new Date(await GM.getValue(self.key + '_status_time', 0))
      }

      this.settings = {}
      this.loadSettings = async function (silent) {
        // Load settings, use first value as default
        const savedsettings = JSON.parse(await GM.getValue(self.key + '_settings', '{}'))

        for (const key in self.config) {
          if (key.endsWith('desc') || key.endsWith('range') || key.endsWith('quest') || key.endsWith('prefix') || key.endsWith('suffix')) {
            continue
          }
          if (key in savedsettings) { // Saved
            if (self.config[key] === 'int') { // Int
              self.settings[key] = parseInt(savedsettings[key], 10)
            } else if (self.config[key] === 'string') { // String
              self.settings[key] = savedsettings[key].toString()
            } else if (config[key] === 'bool') { // Bool
              self.settings[key] = savedsettings[key] === 'true' || savedsettings[key] === true
            } else if (Array.isArray(savedsettings[key])) { // Nested array
              self.settings[key] = []
              for (let i = 0; i < savedsettings[key].length; i++) {
                self.settings[key].push(savedsettings[key][i])
              }
            } else { // Array
              self.settings[key] = savedsettings[key]
            }
          } else { // Default
            if (self.config[key] === 'int') { // Int
              self.settings[key] = self.config[key + '_range'][1]
            } else if (self.config[key] === 'string') { // String
              self.settings[key] = '' // String defaults to empty string
            } else if (config[key] === 'bool') { // Bool
              self.settings[key] = true
            } else if (Array.isArray(self.config[key][0])) { // Nested array defaults to first value for each array
              self.settings[key] = []
              for (let i = 0; i < self.config[key].length; i++) {
                self.settings[key].push(self.config[key][i][0])
              }
            } else {
              self.settings[key] = self.config[key][0] // Array defaults to first value
            }
          }
        }

        if (!self.settings.apikey && !silent) {
          // Try to get the apikey from the website
          GM.xmlHttpRequest({
            method: 'GET',
            url: self.homepage + 'account',
            onerror: function (response) {
              console.log(scriptName + ': premiumize.me API Key could not be loaded')
              setStatus('You have not set you premiumize.me Api key ')
            },
            onload: function (response) {
              let s = ''
              try {
                s = response.responseText.split('class="apipass"')[1].split('</')[0].split('>')[1]
              } catch (e) {
              }
              if (s) {
                self.settings.apikey = s
                GM.setValue(self.key + '_settings', JSON.stringify(self.settings))

                console.log(scriptName + ': premiumize.me API Key was loaded from account and saved!')
              } else {
                setStatus('You need to set you premiumize.me Api key')
              }
            }
          })
        }
      }

      this.updateStatus = async function () { // Update list of online hosters
        await self.loadSettings()
        if (document.location.href.match(self.updateStatusURL)) {
          // Read and save current status of all hosters
          if ($('table.table tr>td:first-child').length) {
            self.status = {}
            await GM.setValue(self.key + '_status_time', '' + (new Date()))
            $('table.table tr>td:first-child').each(function () {
              const text = $(this).text()
              if (text.match(/^\s*[0-9a-z-]+\.\w{0,6}\s*$/i)) {
                const name = text.match(/^\s*([0-9a-z-]+)\.\w{0,6}\s*$/i)[1]
                self.status[name.toLowerCase()] = true
              }
            })
            await GM.setValue(self.key + '_status', JSON.stringify(self.status))
            console.log(scriptName + ': ' + self.name + ': Hosters (' + Object.keys(self.status).length + ') updated')
          } else if (self.settings.apikey) {
            GM.xmlHttpRequest({
              method: 'GET',
              url: self.homepage + 'api/services/list?apikey=' + encodeURIComponent(self.settings.apikey),
              onerror: function (response) {
                console.log(scriptName + ': GM.xmlHttpRequest error: ' + self.homepage + 'api/services/list')
                console.log(response)
              },
              onload: async function (response) {
                const result = JSON.parse(response.responseText)
                /*
              { "cache": [ "uploaded.to", "filefactory.com", ... ], "directdl": [ "uploaded.to", "filefactory.com", ... ] }
              */
                if ('cache' in result && 'directdl' in result) {
                  self.status = {}
                  await GM.setValue(self.key + '_status_time', '' + (new Date()))
                  result.cache.forEach(function (host) {
                    const name = host.match(/^\s*([0-9a-z-]+)\.\w{0,6}\s*$/i)[1]
                    self.status[name.toLowerCase()] = result.directdl.indexOf(host) !== -1
                  })

                  await GM.setValue(self.key + '_status', JSON.stringify(self.status))
                  console.log(scriptName + ': ' + self.name + ': Hosters (' + Object.keys(self.status).length + ') updated')
                } else {
                  console.log(scriptName + ': GM.xmlHttpRequest error: ' + self.homepage + 'api/services/list')
                  console.log(response)
                }
              }
            })
          } else {
            console.log(scriptName + ': Cannot update hosters, no html and no api key found')
          }
        } else {
          alert(scriptName + '\n\nError: wrong update URL')
        }
      }
      this.isOnline = hostername => hostername in self.status && self.status[hostername]

      this.getOpenWebsiteURL = function (urls) {
        // Return a link to the premiumize.me website that will insert the links
        const url = this.homepage + 'downloader?link:' + encodeURIComponent(urls.join('\n'))
        return url
      }

      this.checkLink = function (url, cb) { // check whether the link is supported and online
        const host = url.match(/https?:\/\/(.+?)\//)[1]
        let hoster = host.split('.')
        hoster.pop()
        hoster = hoster.pop().replace('-', '')
        cb(this.isOnline(hoster))
      }

      this.getResults = function (urls, cb) {
        // cb($node,linkNumber) -- $node contains the result, linkNumber is the number of links that should be online i.e. number of hashes
        alert('This function does not work for ' + this.name)
      }

      this._notLoggedIn = false

      this.getLinks = async function (urls, cb) {
        await showConfirm('fairPointsWarning', 'You will be charged premiumize fair points for generating ' + (urls.length > 1 ? ('<b>' + urls.length + '</b> files') : ('<b>one</b> file')) + '!<br><br>Generate links?', function () { self._getLinks(urls, cb) }, function () { setStatus('Operation canceled!', 0); cb([], -1) }, self)
      }

      this._getLinks = function (urls, cb) {
        setTitle('✈️' + urls.length + '🔗 ')
        const N = urls.length
        const downloadLinks = []
        const errors = []
        for (let i = 0; i < urls.length; i++) {
          this._addSingleTransfer(urls[i], function (downloadlink, originallink, message) {
            if (downloadlink) {
              downloadLinks.push(downloadlink)
            } else {
              errors.push([originallink, message])
            }
          })
        }

        const checkprogress = function () {
          if (self._notLoggedIn) {
            // Stop checking and open premiumize homepage
            setTitle('🔑 ')
            setStatus(self.name + ' error: Not logged in!\nMaybe update your API key?', 0)
            GM.openInTab(self.homepage)
            cb([], -2)
            return
          }

          if (N === errors.length) { // All errors
            setTitle('❌ ')
            cb(false, -1)
            if (errors.length === 1 && errors[0][1]) {
              setStatus(errors[0][1], 0)
            } else {
              alert('Errors occured\n' + errors.length + ' links failed:\n\n' + errors.join('\n'))
            }
          } else if (N === downloadLinks.length + errors.length) { // All finished
            setTitle(downloadLinks.length + '/' + errors.length + '✅ ')
            cb(downloadLinks)
            if (errors.length > 0) { // Errors occured
              alert('Errors occured\n' + errors.length + ' links failed:\n\n' + errors.join('\n'))
            }
          } else { // not finished yet
            setTitle(downloadLinks.length + '/' + N + '⏳ ')
            window.setTimeout(checkprogress, self.updateDownloadProgressInterfaceInterval)
          }
        }
        window.setTimeout(checkprogress, self.updateDownloadProgressInterfaceInterval * Math.max(5, N))
      }

      this._addSingleTransfer = function (url, cb) {
        GM.xmlHttpRequest({
          method: 'POST',
          url: self.homepage + 'api/transfer/create',
          data: 'apikey=' + encodeURIComponent(self.settings.apikey) + '&src=' + encodeURIComponent(url),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          },
          onerror: function (response) {
            console.log(scriptName + ': GM.xmlHttpRequest error: ' + self.homepage + 'api/transfer/create')
            console.log(response)
            cb(false, url, 'GM.xmlHttpRequest error: api/transfer/create')
          },
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            /*
          {"status":"success","type":"savetocloud","id":"gfwRtdgd5fgdfgfhgfhf","name":"test.zip"}
          {"status":"error","error":"duplicate","id":"gfdgd5fgFddfgfhgfhf","message":"You already have this job added."}
          {"status":"error","message":"This link is not available on the file hoster website"}
          */
            if ('id' in result && result.id) {
              window.setTimeout(function () {
                self._getFileFromTransfer(url, result.id, cb)
              }, 1000)
              if ('message' in result) {
                addStatus(result.message, -1)
              }
            } else {
              if ('message' in result && !self._notLoggedIn) {
                addStatus(result.message, -1)
                if (~result.message.indexOf('log')) {
                  self._notLoggedIn = true
                }
              }
              cb(false, url, 'message' in result ? result.message : response.responseText)
            }
          }
        })
      }

      this._getFileFromTransfer = function (url, transferId, cb) {
        GM.xmlHttpRequest({
          method: 'GET',
          url: self.homepage + 'api/transfer/list?apikey=' + encodeURIComponent(self.settings.apikey),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          },
          onerror: function (response) {
            console.log(scriptName + ': GM.xmlHttpRequest error: ' + self.homepage + 'api/transfer/list')
            console.log(response)
            cb(false, url, 'GM.xmlHttpRequest error: /api/transfer/list')
          },
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            /*
          {
            "status": "success",
            "transfers": [
              {
                "id": "xXFDSXXFDSGD",
                "name": "test.zip",
                "message": null,
                "status": "finished",
                "progress": 0,
                "folder_id": "gfjdfsuigjfdoikfsadf",
                "file_id": "trhgf982u30fjklfsdag"
              }
            ]
          }
          {
            "status": "success",
            "transfers": [
              {
                "id":"xXFDSXXFDSGD",
                "name":"test.zip",
                "message":"Initializing Download...",
                "status":"running",
                "progress":0,
                "folder_id":"gfjdfsuigjfdoikfsadf",
                "file_id":null
              }
            ]
          }
          */
            if (result.status === 'success' && 'transfers' in result) {
              for (let i = 0; i < result.transfers.length; i++) {
                if (result.transfers[i].id === transferId) {
                  if (result.transfers[i].file_id) {
                    // Finished
                    window.setTimeout(function () {
                      self._getSingleLink(url, result.transfers[i].file_id, cb)
                    }, result.transfers[i].status === 'finished' ? 10 : self.updateDownloadProgressInterval)
                  } else {
                    // Downloading
                    if ('message' in result.transfers[i] && result.transfers[i].message) {
                      setStatus(result.transfers[i].message, -1)
                    }
                    window.setTimeout(function () {
                      self._getFileFromTransfer(url, transferId, cb)
                    }, self.updateDownloadProgressInterval)
                  }

                  return
                }
              }
            }
            if ('message' in result && result.message) {
              alert(scriptName + '\n\nCould not get /api/transfer/list\nError:\n' + result.message)
            }
            cb(false, url, 'Could not find url in transfer list')
          }
        })
      }

      this._getSingleLink = function (url, fileId, cb) {
        GM.xmlHttpRequest({
          method: 'POST',
          url: self.homepage + 'api/item/details',
          data: 'apikey=' + encodeURIComponent(self.settings.apikey) + '&id=' + encodeURIComponent(fileId),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          },
          onerror: function (response) {
            console.log(scriptName + ': GM.xmlHttpRequest error: ' + self.homepage + 'api/item/details')
            console.log(response)
            cb(false, url, 'GM.xmlHttpRequest error: /api/item/details')
          },
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            /*
          {
            "id": "xxXxXxxxXxxx",
            "name": "test.zip",
            "size": 156,
            "created_at": 1572458477,
            "transcode_status": "not_applicable",
            "folder_id": "XxXXXxxxxxx",
            "ip": "1.1.1.1",
            "acodec": "",
            "vcodec": "",
            "mime_type": "application/zip",
            "opensubtitles_hash": "",
            "resx": "",
            "resy": "",
            "duration": "",
            "virus_scan": "ok",
            "type": "file",
            "link": "https://down.host.example.com/dl/abcdefg/test.zip",
            "stream_link": null
          }
          */
            if ('link' in result && result.link) {
              cb(result.link, url)
            } else {
              window.setTimeout(function () {
                self._getSingleLink(url, fileId, cb)
              }, self.updateDownloadProgressInterval)
            }
          }
        })
      }
    }(),

    'nopremium.pl': new function () {
      const self = this
      this.config = {
        mode: ['transfer', 'premium', 'none'],
        mode_desc: ['Transfer User (Pakiety Transferowe)', 'Premium User (Konta Premium)', 'No account'],
        mode_quest: 'What kind of account do you have at nopremium.pl',
        downloadmode: ['direct', 'server'],
        downloadmode_desc: ['Direct download (TRYB SZYBKIEGO POBIERANIA)', 'Downloading via NoPremium.pl server (TRYB POBIERANIA NA SERWERY)'],
        downloadmode_quest: ['Which download mode do you want to use?']
      }
      this.key = 'nopremium.pl'
      this.name = 'NoPremium.pl'
      this.homepage = 'https://www.nopremium.pl/'
      this.updateStatusURL = 'https://www.nopremium.pl/files'
      this.updateStatusURLpattern = /https?:\/\/www\.nopremium\.pl\/files\/?/
      this.updateDownloadProgressInterval = 5000
      const mapHosterName = name => name.replace('-', '')
      this.status = {}

      this.init = async function () {
        self.status = JSON.parse(await GM.getValue(self.key + '_status', '{}'))

        self.lastUpdate = new Date(await GM.getValue(self.key + '_status_time', 0))
      }

      this.settings = {}
      this.loadSettings = async function (silent) {
        // Load settings, use first value as default
        const savedsettings = JSON.parse(await GM.getValue(self.key + '_settings', '{}'))

        for (const key in self.config) {
          if (key.endsWith('desc') || key.endsWith('range') || key.endsWith('quest') || key.endsWith('prefix') || key.endsWith('suffix')) {
            continue
          }
          if (key in savedsettings) { // Saved
            if (self.config[key] === 'int') { // Int
              self.settings[key] = parseInt(savedsettings[key], 10)
            } else if (self.config[key] === 'string') { // String
              self.settings[key] = savedsettings[key].toString()
            } else if (config[key] === 'bool') { // Bool
              self.settings[key] = savedsettings[key] === 'true' || savedsettings[key] === true
            } else if (Array.isArray(savedsettings[key])) { // Nested array
              self.settings[key] = []
              for (let i = 0; i < savedsettings[key].length; i++) {
                self.settings[key].push(savedsettings[key][i])
              }
            } else { // Array
              self.settings[key] = savedsettings[key]
            }
          } else { // Default
            if (self.config[key] === 'int') { // Int
              self.settings[key] = self.config[key + '_range'][1]
            } else if (self.config[key] === 'string') { // String
              self.settings[key] = '' // String defaults to empty string
            } else if (config[key] === 'bool') { // Bool
              self.settings[key] = true
            } else if (Array.isArray(self.config[key][0])) { // Nested array defaults to first value for each array
              self.settings[key] = []
              for (let i = 0; i < self.config[key].length; i++) {
                self.settings[key].push(self.config[key][i][0])
              }
            } else {
              self.settings[key] = self.config[key][0] // Array defaults to first value
            }
          }
        }
      }

      this.updateStatus = async function () { // Update list of online hosters
        if (document.location.href.match(self.updateStatusURL)) {
          // Read and save current status of all hosters
          await GM.setValue(self.key + '_status_time', '' + (new Date()))
          self.status = {}
          $('#servers a[title]').each(function () {
            const name = mapHosterName(this.title)
            self.status[name] = true
          })
          await GM.setValue(self.key + '_status', JSON.stringify(self.status))
          console.log(scriptName + ': ' + self.name + ': Hosters (' + Object.keys(self.status).length + ') updated')
        } else {
          alert(scriptName + '\n\nError: wrong update URL')
        }
      }
      this.isOnline = hostername => hostername in self.status && self.status[hostername]

      this.getOpenWebsiteURL = function (urls) {
        // Return a link to the nopremium.pl website that will insert the links
        const url = this.homepage + 'files?link:' + encodeURIComponent(urls.join('\n'))
        return url
      }

      const getHashs = function (urls, cb, silent) {
        // cb(hashes,sizestring)
        setTitle('✈️ ')
        setStatus('Sending ' + (urls.length === 1 ? 'one link' : (urls.length + ' links')), -1)
        GM.xmlHttpRequest({
          method: 'POST',
          url: self.homepage + 'files',
          data: 'watchonline=&session=' + (Math.round(Math.random() * 1234567)) + '&links=' + encodeURIComponent(urls.join('\n')),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
            // "Referer" : "https://www.nopremium.pl/files" // FIREFOX57
          },
          onload: function (response) {
            if (response.responseText.indexOf('<input type="text" name="login" placeholder="Login"/>') !== -1) {
              setTitle('🔑 ')
              setStatus(self.name + ' error: Not logged in!', 0)
              GM.openInTab(self.homepage)
              return cb([], -1)
            }

            const hashes = []
            // Find hashes
            const re = /name="hash(\d+)" value="(\w+)"/g // <input type="checkbox" id="hash0" name="hash0" value="fab3c41988" onclick="UpdateCounter();" c
            let ma = re.exec(response.responseText)
            while (ma) {
              hashes.push(ma[2])
              ma = re.exec(response.responseText)
            }
            // Find errors
            ma = response.responseText.match(/Pliki nieprzetworzone \((\d+)\)/)
            if (ma && !silent) {
              addStatus('Error: ' + (parseInt(ma[1], 10) === 1 ? ('One file is offline or unsupported') : (ma[1] + ' files are offline or unsupported')), 0)
            }

            // Find size
            let size = '0 Byte'
            if (response.responseText.indexOf('id="countSize"') !== -1) {
              ma = response.responseText.split('id="countSize"')[1].match(/value="(\d+.?\d*) (\w+)"/) // <input type="text" name="countSize" id="countSize" style="width:80px;" readonly="readonly" value="1.38 GB">
              size = ma[1] + ' ' + ma[2]
            }

            setStatus(self.name + ' identified ' + (hashes.length === 1 ? 'one online file' : (hashes.length + ' online files')), -1)
            setTitle(hashes.length + '🔗 ')
            cb(hashes, size)
          }
        })
      }

      this.checkLink = function (url, cb) { // check whether the link is supported and online
        // cb(boolresult)
        return getHashs([url], function (hashes, size) {
          cb(hashes.length === 1)
        }, true)
      }

      this.getResults = function (urls, cb, hashes) {
        // cb($node,linkNumber) -- $node contains the result, linkNumber is the number of links that should be online i.e. number of hashes
        // Get download links from nopremium.pl and show the usual info about the file, that is normally shown on nopremium.pl
        if (typeof hashes === 'undefined') {
          // 1. Get hashes and show transfer warning
          getHashs(urls, async function (hashes, size) {
            if (settings.mode === 'transfer') {
              await showConfirm('transferWarning', 'You will be charged <b>' + size + "</b> 'Transfer' for generating " + (hashes.length > 1 ? ('<b>' + hashes.length + '</b> files') : ('<b>one</b> file')) + '!<br><br>Generate links?', function () { this.getResults(urls, cb, hashes) }, null, self)
            } else if (hashes.length > 0) {
              self.getResults(urls, cb, hashes)
            } else if (size === -1) { // Error was already handled (probably not logged in)
              console.log('getHashs->cb: Error was already handled (probably not logged in)')
              cb(false, -2)
            } else { // No files found
              setStatus('No online/available files', 0)
              cb(false, 0)
            }
          })
          return
        }

        // 2. Work with hashes
        const $resultContainer = $('<div></div>').attr('id', 'generated-links')
        const mode = self.settings.downloadmode === 'direct' ? 0 : 1 // 0 -> direct , 1  ->  via server
        GM.xmlHttpRequest({
          method: 'POST',
          url: self.homepage + 'files',
          data: 'insert=1&mode=' + mode + '&hh=0&hash[]=' + hashes.join('&hash[]=') + '&',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
            // "Referer" : "https://www.nopremium.pl/files"  // FIREFOX57
          },
          onload: function (response) {
            GM.xmlHttpRequest({
              method: 'POST',
              url: self.homepage + 'files',
              data: 'loadfiles=1',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
                // "Referer" : "https://www.nopremium.pl/files"  // FIREFOX57
              },
              onload: function (response) {
                if (mode === 0) {
                  $resultContainer.append($('<div></div>').append(response.responseText).find('#fastFilesArea'))
                } else {
                  $resultContainer.append($('<div></div>').append(response.responseText).find('#downloadFilesArea'))
                }
                $resultContainer.find('input[type=checkbox]').remove()
                cb($resultContainer, hashes.length)
              }
            })
          }
        })
      }
      this.getLinks = function (urls, cb) {
        // cb(downloadlinks)

        if (this.settings.downloadmode === 'direct') {
          return this._getDirectLinks(urls, cb)
        } else {
          return this._getServerLinks(urls, cb)
        }
      }

      this._getDirectLinks = function (urls, cb) {
        // Get Direct download links

        this.getResults(urls, async function ($node, N) {
          if (!$node || N < 1) {
            cb(false)
            return
          }

          const text = $node.html()

          /*
        <td>16-08-2014 20:22</td>
        <td class="dlBox"><a href="http://direct.nopremium.pl/9091456/7895ca02bfcb2c2e43806f1079b7ff069129e/result.file"><img src="https://www.nopremium.pl/images/download_ico.png" alt="Sciagnij" title="Sciagnij"></a></td>
        */
          const files = []
          const re = /<td>(\d+)-(\d+)-(\d+) (\d+):(\d+)<\/td>(\s|\n)+<td class="dlBox"><a href="(.*?)"/gm
          let m = re.exec(text) // wholeString, 16,08,2014,20,37,#newline#,http://direct.nopremium.pl/9091456/7895ca02bfcb2c2e43806f1079b7ff069129e/result.file

          while (m) {
            if (m[7].indexOf('//direct.nopremium.pl') === -1) {
              continue // Skip files via server, only use direct download links
            }
            const d = new Date(m[3], m[2], m[1], m[4], m[5], 0, 0)
            files.push([d, m[7]])
            m = re.exec(text)
          }

          if (files.length === 0) {
            alert(scriptName + '\n\nAn error occured.\nCould not find download links in response.')
            cb(false)
            return
          }
          // Find youngest files by comparing their ids
          const pattern = /\.pl\/(\d+)\//
          files.sort(function (a, b) {
            const x = a[1].match(pattern)[1]
            const y = a[1].match(pattern)[1]
            return x > y ? -1 : x < y ? 1 : 0
          })

          const result = []
          for (let i = 0; i < N; i++) {
            result.push(files[i][1])
            await cacheLink([urls[i]], files[i][0], [files[i][1]], self.key) // CACHE single URLs
          }

          await cacheLink(urls, new Date(), result, self.key) // CACHE all URLs

          cb(result)
        })
      }

      this._getServerLinks = function (urls, cb) {
        this.getResults(urls, function ($node, N) {
          if (N === 0) {
            cb(false)
          } else {
            self._getProgress(cb, $node, N)
          }
        })
      }

      this._getProgress = function (cb, $node, N, ids) {
        GM.xmlHttpRequest({
          method: 'POST',
          url: self.homepage + 'files',
          data: 'downloadprogress=1',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
            // "Referer" : "https://www.nopremium.pl/files" // FIREFOX57
          },
          onerror: function () {
            self._getProgressBlocked = false

            window.setTimeout(function () {
              self._getProgress(cb, $node, N, ids)
            }, self.updateDownloadProgressInterval)
          },
          onload: function (response) {
            self._getProgressBlocked = false

            let data
            try {
              data = JSON.parse(response.responseText)
            } catch (e) {
              console.log(scriptName + ': ' + e)
              console.log(response.responseText)

              if (response.responseText.indexOf('<input type="text" name="login" placeholder="Login"/>') !== -1) {
                setTitle('🔑 ')
                setStatus(self.name + ' error: Not logged in!', 0)
                GM.openInTab(self.homepage)
                cb(false, -2)
              } else {
                window.setTimeout(function () {
                  self._getProgress(cb, $node, N, ids)
                }, self.updateDownloadProgressInterval)
              }
              return
            }

            data.StandardFiles.sort(function (a, b) {
              const x = new Date(a.insert_date.split('-').join('/'))
              const y = new Date(b.insert_date.split('-').join('/'))
              return x > y ? -1 : x < y ? 1 : 0
            })

            const result = []
            const runnning = []
            let percent = 0
            const progess = []

            if (!ids) { // First run: Find the correct files: just use the first N files
              ids = []
              for (let i = 0; i < data.StandardFiles.length && i < N; i++) {
                ids.push(data.StandardFiles[i].id)
                if (data.StandardFiles[i].status === 'finish') {
                  result.push(data.StandardFiles[i].download_url)
                  progess.push(100)
                  percent += 100
                } else {
                  runnning.push(data.StandardFiles[i])
                  if (parseInt(data.StandardFiles[i].status, 10) > 0) {
                    progess.push(parseInt(data.StandardFiles[i].status, 10))
                    percent += parseInt(data.StandardFiles[i].status, 10)
                  }
                }
              }
            } else { // Consecutive runs: Use the ids from first run
              for (let i = 0; i < data.StandardFiles.length; i++) {
                if (ids.indexOf(data.StandardFiles[i].id) === -1) continue
                if (data.StandardFiles[i].status === 'finish') {
                  result.push(data.StandardFiles[i].download_url)
                  progess.push(100)
                  percent += 100
                } else {
                  runnning.push(data.StandardFiles[i])
                  if (parseInt(data.StandardFiles[i].status, 10) > 0) {
                    progess.push(parseInt(data.StandardFiles[i].status, 10))
                    percent += parseInt(data.StandardFiles[i].status, 10)
                  }
                }
              }
            }

            /*
          Regarding caching in server mode:
            If you add a file, that is already on the server (or currently downloading), you will not be charged additional bandwith - therefore caching is not necessary at the moment.
          */

            if (result.length === N) {
              setStatus((result.length === 1 ? 'One file' : (result.length + ' files')) + ' downloaded to server', 1)
              setTitle(result.length + '✅ ')
              cb(result)
            } else {
              // Waiting
              percent = percent / N
              // setStatus('Download '+result.length+'/'+N+' ('+Math.floor(percent)+'%)\n<span title="'+round(percent,2)+'%" style="display:block; width:120px; height:18px; background:white; border:1px solid black; border-radius:5px;"><span style="display:block; border-radius:5px; height:18px; width:'+Math.ceil(percent*1.2)+'px; '+LOADINGBARBG+'"> </span></span>',-1);
              const dotheight = N > 2 ? 2 : 4
              let h = 'Download ' + result.length + '/' + N + ' (' + Math.floor(percent) + '%)\n<div style="display:block; width:130px; height:auto; background:white; border:1px solid black; border-radius:5px; padding:2px; ">'
              for (let i = 0; i < N; i++) {
                if (progess[i]) {
                  h += '<span style="display:block; width:' + Math.ceil(progess[i] * 1.2) + 'px; height:1px; background:white; border-top:' + dotheight + 'px ' + (progess[i] > 99.9 ? 'solid' : 'dotted') + ' green; margin-bottom:1px;"></span>'
                } else {
                  h += '<span style="display:block; width:0x; height:1px; background:white; border-top:' + dotheight + 'px dotted silver; margin-bottom:1px;"></span>'
                }
              }
              h += '</div>'

              setTitle(Math.floor(percent) + '%⏳ ')

              setStatus(h)
              showOnlyStatus()

              window.setTimeout(function () {
                self._getProgress(cb, $node, N, ids)
              }, self.updateDownloadProgressInterval)
            }
          }
        })
      }
    }()

  }

  const debridprovider = Object.keys(multi)
  let currentdebrid = await GM.getValue('currentdebrid', debridprovider[0])

  for (const key in multi) {
    await multi[key].init()
    if (key === currentdebrid) {
      await multi[key].loadSettings()
      continue
    }
    if (!greasemonkey) {
      GM.registerMenuCommand(scriptName + ' - Switch to ' + multi[key].name, (function (key) {
        return async function () {
          if (!confirm(scriptName + '\n\nSet multi-download provider:\n' + multi[key].name)) return

          await GM.setValue('currentdebrid', key)
          currentdebrid = key
          document.location.reload()
        }
      })(key)
      )
    }
  }

  if (!greasemonkey) {
    GM.registerMenuCommand(scriptName + ' - Delete cached links', async function () {
      if (!confirm(scriptName + '\n\nReally delete cached links?')) return

      await GM.setValue('cachedDownloadLinks', '{}')

      alert(scriptName + '\n\nCache is empty!')
    })
    GM.registerMenuCommand(scriptName + ' - Restore dialogs and warnings', async function () {
      if (!confirm(scriptName + '\n\nReally restore all dialogs and warnings?')) return

      await GM.setValue('dialogs', '[]')

      alert(scriptName + '\n\nDialogs and warnings restored')
    })
  }

  /*
  function round (f, p) {
  // Round f to p places after the comma
    return parseFloat(parseFloat(f).toFixed(p))
  }
  */

  const orgDocumentTitle = document.title
  function setTitle(message) {
    if (window.parent.parent !== window) {
      window.parent.parent.postMessage({ iAm: 'Unrestrict.li', type: 'title', str: message }, '*')
    }
    if (message) {
      document.title = message + orgDocumentTitle
    } else {
      document.title = orgDocumentTitle
    }
  }

  function popUp(id, onClose, thisArg, doNotCloseOnOutsideClick) {
    // Remove window scrolling
    $(document.body).css('overflow', 'hidden')
    let zi = getNextZIndex()
    id = id || ('popup' + (new Date()).getTime())
    const $par = $('<div style="position:absolute; top:0px;"></div>').attr('id', id).appendTo(document.body)
    const $background = $('<div style="position:fixed; top:0px; left:0px; right:0px; bottom:0px; background:black; opacity:0.5; z-index:' + (zi++) + '"></div>').appendTo($par)
    const $div = $('<div style="position:fixed; top:50px; left:100px; overflow:auto; z-index:' + (zi++) + '; background:#E6E6E6; color:Black; border:#B555C5 2px solid;border-radius:5px; padding:10px; font-family: "Ubuntu",Arial,Sans-Serif"></div>').css('maxHeight', window.innerHeight - 100).css('maxWidth', window.innerWidth - 200).appendTo($par)

    const close = function () {
      $par.remove()
      if (onClose) onClose.call(thisArg)
      // Restore scrolling
      $(document.body).css('overflow', 'initial')
    }

    if (!doNotCloseOnOutsideClick) {
      $background.click(close)
    }

    return { node: $div, close }
  }

  function configForm($form, c, s, formid) {
    for (const key in c) {
      if (key.endsWith('desc') || key.endsWith('range') || key.endsWith('quest') || key.endsWith('prefix') || key.endsWith('suffix') || key.endsWith('hidden')) {
        continue
      }

      const $p = $('<p>').appendTo($form)

      if (c[key + '_quest']) {
        $p.append(c[key + '_quest'])
      } else {
        $p.append(key)
      }

      $p.append('<br>')

      if (c[key + '_prefix']) {
        $p.append(c[key + '_prefix'] + ' ')
      }

      const hidden = (key + '_hidden') in c && c[key + '_hidden']
      if (c[key] === 'int') { // Int
        const $input = $('<input type="number">').addClass('form_' + formid).data('key', key).data('parse', 'int').val(s[key]).appendTo($p)
        if (c[key + '_range']) {
          $input.prop('min', c[key + '_range'][0])
          $input.prop('max', c[key + '_range'][2])
          $input.prop('title', c[key + '_range'][0] + ' - ' + c[key + '_range'][2])
        }
      } else if (c[key] === 'string') { // String
        const $inputText = $('<input type="text">').addClass('form_' + formid).data('key', key).data('parse', 'string').appendTo($p)
        if (hidden && s[key]) {
          $inputText.val('## HIDDEN ##')
          $inputText.data('hidden', '1')
        } else {
          $inputText.val(s[key])
        }
      } else if (c[key] === 'bool') { // Bool
        const $select = $('<select></select>').addClass('form_' + formid).data('key', key).data('parse', 'bool').appendTo($p)

        const $optionYes = $('<option></option>').val('true').appendTo($select)
        if (c[key + '_desc']) {
          $optionYes.html(c[key + '_desc'][0])
        } else {
          $optionYes.html('Yes')
        }
        if (s[key]) {
          $optionYes[0].selected = true
        }

        const $optionNo = $('<option></option>').val('false').appendTo($select)
        if (c[key + '_desc']) {
          $optionNo.html(c[key + '_desc'][1])
        } else {
          $optionNo.html('No')
        }
        if (!s[key]) {
          $optionNo[0].selected = true
        }
      } else if (Array.isArray(c[key][0])) { // Nested array
        for (let j = 0; j < c[key].length; j++) {
          if (c[key + '_desc'] && !Array.isArray(c[key + '_desc'][j])) {
            $p.append(c[key + '_desc'][j] + ': ')
          }

          const $select = $('<select></select>').addClass('form_' + formid).data('key', key).data('index', j).appendTo($p)
          for (let i = 0; i < c[key][j].length; i++) {
            const $option = $('<option></option>').val(c[key][j][i]).appendTo($select)
            if (c[key + '_desc'] && Array.isArray(c[key + '_desc'][0])) {
              $option.html(c[key + '_desc'][j][i])
            } else {
              $option.html(c[key][j][i])
            }
            if (s[key][j] === c[key][j][i]) { $option[0].selected = true }
          }
          $p.append('<br>')
        }
      } else { // Array
        const $select = $('<select></select>').addClass('form_' + formid).data('key', key).appendTo($p)
        for (let i = 0; i < c[key].length; i++) {
          const $option = $('<option></option>').val(c[key][i]).appendTo($select)
          if (c[key + '_desc']) {
            $option.html(c[key + '_desc'][i])
          } else {
            $option.html(c[key][i])
          }
          if (s[key] === c[key][i]) { $option[0].selected = true }
        }
      }

      if (c[key + '_suffix']) {
        $p.append(' ' + c[key + '_suffix'])
      }
    }
  }

  async function saveSettings(ev) {
    const $body = ev.data
    const $form = $body.find('.form')

    // Save preferred hoster:
    currentdebrid = $form.find('.debridhoster').val()

    // Save options:
    const newsettings = { general: {} }
    for (const key in multi) {
      newsettings[key] = {}
    }

    $form.find('*[class^=form_]').each(function () {
      const $this = $(this)
      const namespace = $this.prop('class').split('_', 2)[1]
      const key = $this.data('key')
      const index = $this.data('index')
      let value = $this.val()
      const parse = $this.data('parse')
      const hiddenAndUnchanged = $this.data('hidden') && value === '## HIDDEN ##'
      if (typeof index !== 'undefined') { // Nested Array
        if (!(key in newsettings[namespace]) || !Array.isArray(newsettings[namespace][key])) {
          newsettings[namespace][key] = []
        }
        newsettings[namespace][key][index] = value
      } else { // Normal
        if (hiddenAndUnchanged) {
          value = multi[namespace].settings[key]
        } else if (parse === 'int') {
          value = parseInt(value, 10)
        } else if (parse === 'bool') {
          value = (value === 'true')
        }
        newsettings[namespace][key] = value
      }
    })

    await GM.setValue('setup', true)
    await GM.setValue('currentdebrid', currentdebrid)
    await GM.setValue('settings', JSON.stringify(newsettings.general))
    for (const key in multi) {
      await GM.setValue(key + '_settings', JSON.stringify(newsettings[key]))
    }

    alert(scriptName + '\n\nSettings were successfully saved!')
    document.location.reload()
  }

  async function aboutMe() {
    const popup = popUp('multiochhelper_about', null, null, true)
    const $popup = popup.node
    const $frame = $('<iframe width="' + (window.innerWidth - 250) + '" height="' + (window.innerHeight - 150) + '" style="border:0">').appendTo($popup)
    $frame.bind('load', async function (e) {
      // Load settings for all
      for (const key in multi) {
        await multi[key].loadSettings(true)
      }

      const $body = $($frame[0].contentDocument.getElementsByTagName('body')[0])

      $body.css('fontFamily', 'Ubuntu,Arial,Sans-Serif')

      $('<div style="position:fixed; top:0px; right:5px; cursor:pointer; color:White; background:#b555c5; border: 1px solid White; border-radius:3px; padding:0px; font-weight:bold ; " title="Close menu">X</span>').click(function () { if (confirm('Settings will NOT be saved!')) popup.close() }).appendTo($body)

      $body.append('<h2>' + scriptName + '</h2>')
      $('<a>').appendTo($body).attr('target', '_blank').css('fontSize', 'small').html('https://openuserjs.org/scripts/cuzi/Multi-OCH_Helper').attr('href', 'https://openuserjs.org/scripts/cuzi/Multi-OCH_Helper')

      const $form = $('<div class="form">').appendTo($body)

      // General options
      $form.append('<h3>Settings</h3>')
      configForm($form, config, settings, 'general')

      // Preferred multihoster
      const $p = $('<p>').appendTo($form)
      $p.append('Preferred multihoster:<br>')
      const $select = $('<select></select>').addClass('debridhoster').appendTo($p)
      for (const key in multi) {
        const $option = $('<option></option>').val(key).appendTo($select)
        $option.html(multi[key].name)
        $option[0].selected = key === currentdebrid
      }

      // Options for multihosters
      for (const key in multi) {
        $('<h3>').appendTo($form).html(multi[key].name)
        $('<a>').appendTo($form).css('fontSize', 'small').attr('target', '_blank').html(multi[key].homepage).attr('href', multi[key].homepage)
        if (multi[key].config) {
          configForm($form, multi[key].config, multi[key].settings, key)
        } else {
          $('<p>').appendTo($form).text('No settings available for this service.')
        }
      }

      $form.append('<br>')

      $('<input type="button">').val('Cancel').click(function () {
        if (confirm('Settings will NOT be saved!')) {
          popup.close()
        }
      }).appendTo($form)
      $('<input type="button">').val('Save').click($body, saveSettings).appendTo($form)

      $form.append('<h3>Other options</h3>')

      $('<input type="button">').val('Clear cache (' + humanBytes((await GM.getValue('cachedDownloadLinks', '{}')).length - 2) + ')').appendTo($form).click(async function () {
        if (!confirm(scriptName + '\n\nReally delete cached links?')) {
          return
        }

        await GM.setValue('cachedDownloadLinks', '{}')

        this.value = 'Clear cache (' + humanBytes((await GM.getValue('cachedDownloadLinks', '{}')).length - 2) + ')'
        alert(scriptName + '\n\nCache is empty!')
      })

      $form.append('<br>')
      $form.append('<br>')

      $('<input type="button">').val('Restore dialogs and warnings').appendTo($form).click(async function () {
        if (!confirm(scriptName + '\n\nReally restore all dialogs and warnings?')) {
          return
        }

        await GM.setValue('dialogs', '[]')

        alert(scriptName + '\n\nDialogs and warnings restored')
      })

      let greasemonkeyIssue = ''
      if (greasemonkey) {
        greasemonkeyIssue = `<li>In Greasymonkey it is not possible to select multiple links with the mouse and send them at once.<br>
      The reason is this bug: <a href="https://github.com/greasemonkey/greasemonkey/issues/2574">https://github.com/greasemonkey/greasemonkey/issues/2574</a><br>
      If you need this functionality, you can use Tampermonkey instead of Greasemonkey</li>`
      }

      $(`<div>
      <br>
      <br>
      <h3>Known issues:</h3>
      <ul>
      <li>nopremium.pl sometimes omits a few links in folders</li>
      <li>In Firefox the script sometimes does not work if the "Accept thid-parts cookies" policy is set to "Never".<br>
      To resolve this problem open the Firefox options and go to the tab "Privacy". Set the "Accept thid-parts cookies" to "From visited" or "Always"<br>
      Close and re-open Firefox. Log out and then log in your nopremium.pl account. Everything should work fine now.</li>
      ${greasemonkeyIssue}
      </ul>
      </div><br><br><br>`).appendTo($body)

      $('<input type="button">').val('Debug info').appendTo($body).click(inspectGMvalues)
    })
    if (chrome) {
      $frame.attr('src', 'about:blank')
    }
  }

  function inspectGMvalues() {
    let iv
    const popup = popUp('multiochhelper_inspectGM', function () {
      clearInterval(iv)
    })
    const $popup = popup.node
    const $frame = $('<iframe width="' + (window.innerWidth - 250) + '" height="' + (window.innerHeight - 150) + '" style="border:0">').appendTo($popup)
    $frame.bind('load', async function (e) {
      $($frame[0].contentDocument.getElementsByTagName('head')[0]).append('<style type="text/css">' + SPINNERCSS + '</style>')

      const $body = $($frame[0].contentDocument.getElementsByTagName('body')[0])
      $body.append('<h2>' + scriptName + '</h2>')

      let keys = await GM.listValues()
      if (keys.length && typeof keys[0] === 'undefined') { // Firefox 35+ workaround
        keys = cloneInto(await GM.listValues(), window)
      }

      const $table = $('<table>').appendTo($body)
      let $tr
      $tr = $('<tr>').appendTo($table)
      $('<th>').html('Key').appendTo($tr)
      $('<th>').html('Value').appendTo($tr)
      $('<th>').html('Type').appendTo($tr)
      $('<th>').html('').appendTo($tr)

      const deleteValue = async function (ev) {
        const key = $(this).data('key')
        await GM.deleteValue(key)
        $(this).parent().parent().remove()
      }

      let total = 0
      for (let i = 0; i < keys.length; i++) {
        const value = await GM.getValue(keys[i])
        let svalue = '' + value
        let len = 1
        if (typeof value === 'undefined') {
          svalue = 'undefined'
        } else if (typeof value === 'string') {
          len = value.length
        }
        total += len
        $tr = $('<tr>').appendTo($table)
        $('<td>').html(keys[i]).appendTo($tr)
        $('<td>').append($('<input type="text" style="width:600px">').val(svalue)).appendTo($tr)
        $('<td>').append('' + (typeof value) + (typeof value === 'string' ? ('(' + len + ')') : '')).appendTo($tr)
        $('<td>').append($('<input type="button">').val('Delete').data('key', keys[i]).click(deleteValue)).appendTo($tr)
      }

      $tr = $('<tr>').appendTo($table)
      $('<th>').html('Total').appendTo($tr)
      $('<th>').html(keys.length).appendTo($tr)
      $('<th>').html('approx. ' + humanBytes(total)).appendTo($tr)

      const $reload = $('<div>').appendTo($body)
      $('<div style="display:inline-block;width:20px; height:20px;" class="ochspinner"></div>').appendTo($reload)
      $reload.append(' Reload in ')
      const $timer = $('<span style="pointer:cursor;" title="Click to reload now"></span>').html('20 seconds').click(function () { this.innerHTML = 0 }).appendTo($reload)
      iv = window.setInterval(function () {
        let s = parseInt($timer.html(), 10)
        if (s === 0) {
          clearInterval(iv)
          popup.close()
          inspectGMvalues()
        } else {
          s--
          $timer.html(s + ' seconds')
        }
      }, 1000)
    })
    if (chrome) {
      $frame.attr('src', 'about:blank')
    }
  }

  function hexToBytes(s) {
    return s.match(/([0-9a-fA-F]{2})/g).map(v => parseInt(v, 16))
  }

  function stringToBytes(s) {
    return s.split('').map(v => v.charCodeAt(0))
  }

  function bytesToString(a) {
    return String.fromCharCode.apply(String, a)
  }

  function addCSSHead(body) {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = body
    document.head.appendChild(style)
  }

  function humanBytes(bytes, precision) {
    // http://stackoverflow.com/a/18650828
    bytes = parseInt(bytes, 10)
    if (bytes === 0) return '0 Byte'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toPrecision(2)) + ' ' + sizes[i]
  }

  function getNextZIndex() {
    // Calculate: max(zIndex) + 1
    let zIndexMax = 0
    try {
      $('div').each(function () {
        const z = parseInt($(this).css('z-index'), 10)
        if (z > zIndexMax) {
          zIndexMax = z
        }
      })
    } catch (e) { } finally {
      if (zIndexMax < 20000) {
        zIndexMax = 20006
      }
    }
    return zIndexMax + 1
  }

  async function showConfirm(id, text, onConfirm, onNotConfirm, thisArg) {
    // Skip
    const dialogs = JSON.parse(await GM.getValue('dialogs', '[]'))
    if (dialogs.indexOf(id) !== -1) {
      onConfirm.call(thisArg)
      return
    }

    const popup = popUp('confirm' + id, function () { }, thisArg)
    const $div = popup.node
    $div.append(text)
    $div.append('<br>')
    $('<input type="button" value="Yes">').click(function () {
      popup.close()
      onConfirm.call(thisArg)
    }).appendTo($div)

    $('<input type="button" value="No">').click(function () {
      popup.close()
      if (onNotConfirm) {
        onNotConfirm.call(thisArg)
      }
    }).appendTo($div)

    $div.append('<br>')

    $('<input type="checkbox" value="remember">').click(async function () {
      const dialogs = JSON.parse(await GM.getValue('dialogs', '[]'))
      if (this.checked) {
        if (dialogs.indexOf(id) === -1) {
          dialogs.push(id)
          await GM.setValue('dialogs', JSON.stringify(dialogs))
        }
      } else {
        if (dialogs.indexOf(id) !== -1) {
          dialogs.splice(dialogs.indexOf(id), 1)
          await GM.setValue('dialogs', JSON.stringify(dialogs))
        }
      }
    }).appendTo($div)
    $div.append(' Always "Yes". Do not show this message again!')
  }

  function setStatus(text, success) {
    addStatus(text, success, true)
  }

  function addStatus(text, success, clear) {
    if (!document.getElementById('multiochhelper')) {
      alert(`${scriptName}\n\n${text}`)
      return
    }
    let $status = $('#multiochhelper_status')
    if (!document.getElementById('multiochhelper_status_text')) {
      if (!document.getElementById('multiochhelper_status')) {
        const $div = $('#multiochhelper')
        $status = $('<div>').prependTo($div)
        $status.attr('id', 'multiochhelper_status')
      } else {
        $status.empty()
      }
      const $loader = $('<div>').appendTo($status)
      $loader.attr('id', 'multiochhelper_status_loader')
      const $statustext = $('<div>').appendTo($status)
      $statustext.attr('id', 'multiochhelper_status_text')
      const $statusclear = $('<div>').appendTo($status)
      $statusclear.attr('id', 'multiochhelper_status_clear')
    }

    const $statustext = $('#multiochhelper_status_text')
    if (clear) {
      $statustext.empty()
    } else if ($statustext.html().trim() !== '') {
      $statustext.append(document.createElement('br'))
    }
    $status.show()

    $statustext.append(text)
    if (success === 1) {
      $statustext.css('color', '#33FF99')
    } else if (success === 0) {
      $statustext.css('color', 'orange')
    } else if (success === -1) {
      $statustext.css('color', 'cyan')
    } else {
      $statustext.css('color', 'white')
    }
  }

  function showOnlyStatus() {
    const $status = $('#multiochhelper_status')
    $status.siblings().not('#multiochhelper_status').remove()
  }

  function getMultiOCHWebsiteURL(links) {
    return multi[currentdebrid].getOpenWebsiteURL(links)
  }

  function openWebsite(links, cb) {
    // Call cb() and navigate to the website
    if (!links) {
      cb(false)
      return
    }

    if (cb) {
      cb()
    }
    const url = getMultiOCHWebsiteURL(links)

    if (settings.newTab) {
      if (typeof GM.openInTab === 'undefined') {
        window.open(url)
      } else {
        GM.openInTab(url)
      }
    } else {
      document.location.href = url
    }
  }

  async function useCache(urls, cb) {
    urls = '' + urls
    const cachedDownloadLinks = JSON.parse(await GM.getValue('cachedDownloadLinks', '{}')) // [datestring,downloadlink,multihoster]
    if (urls in cachedDownloadLinks) {
      if (confirm(scriptName + '\n\nLink was found in cache.\nUse cached link?\n\nFrom: ' + (new Date(cachedDownloadLinks[urls][0])) + '\nWith: ' + cachedDownloadLinks[urls][2] + '\n' + cachedDownloadLinks[urls][1].join('\n'))) {
        cb(cachedDownloadLinks[urls][1])
        return true
      }
    }
    return false
  }
  async function cacheLink(urls, datetime, downloadLinks, multihoster) {
    if (!Array.isArray(downloadLinks)) {
      const parts = downloadLinks.split('\n')
      downloadLinks = []
      for (let i = 0; i < parts.length; i++) {
        if ($.trim(parts[i])) {
          downloadLinks.push($.trim(parts[i]))
        }
      }
    }
    if (downloadLinks.length === 0) return

    urls = '' + urls
    const cachedDownloadLinks = JSON.parse(await GM.getValue('cachedDownloadLinks', '{}'))
    cachedDownloadLinks[urls] = [datetime, downloadLinks, multihoster]
    await GM.setValue('cachedDownloadLinks', JSON.stringify(cachedDownloadLinks))
  }

  function showExtractedLinks(links) {
    if (document.querySelector('.alertlinkscont')) {
      alert(links.join('\n'))
      $('.alertlinkscont').remove()
      return
    }
    $('<style type="text/css">.alertlinkscont{transition: left 500ms;}.alertlinkscont a{font-size:12px;user-select:all; font-family: monospace;} .alertlinkscont a:link,.alertlinkscont a:hover{color:black; text-decoration:none;}.alertlinkscont a:visited{color:rgb(70,0,120); text-decoration:none;}</style>').appendTo('head')
    const $div = $('<div class="alertlinkscont"></div>')
    $div.appendTo(document.body)
    $div.css({
      zIndex: 10000,
      position: 'fixed',
      top: '20px',
      left: '20px',
      minWidth: '300px',
      minHeight: '300px',
      background: 'white',
      color: 'black',
      border: '2px solid black',
      borderRadius: '5px',
      padding: '20px 25px 10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      overflow: 'auto'
    })
    for (let i = 0; i < links.length; i++) {
      $div[0].innerHTML += '<a target="_blank" href="' + links[i] + '">' + links[i] + '</a><br>\n'
    }
    $div[0].innerHTML += '<br><br>\n'
    window.setTimeout(function moveMenuIntoView() {
      $div.css('maxHeight', (document.documentElement.clientHeight - 100) + 'px')
      $div.css('maxWidth', (document.documentElement.clientWidth - 40) + 'px')
      $div.css('left', Math.max(20, 0.5 * (document.body.clientWidth - $div[0].clientWidth)) + 'px')
    }, 0)
  }

  async function generateLinks(urls, cb) {
    // Check cache
    if (await useCache(urls, cb)) {
      return
    }

    await multi[currentdebrid].getLinks(urls, cb)
  }

  async function download(urls, cb) {
    // Get one/first download link and open it immediately/start download
    if (urls.length > 1) {
      alert(scriptName + '\n\nOnly the first link will be opened!')
    }

    await generateLinks(urls, function (result, code) {
      if (cb) {
        cb()
      }
      if (result && result[0]) {
        addStatus('Opening download...', -1)
        if (window.top === window) {
          document.location.href = result[0]
        } else {
          // Changing location may be blocked by sandboxed iframe
          window.top.location.href = result[0]
        }
      } else if (code === -2) {
        // Error was already handled
        console.log('download() in generateLinks(): error already handled')
      } else if (!code) {
        addStatus('An error occured: No downloadlink to open', 0)
      }
    })
  }

  async function clipboard(urls, cb) {
    // Get download links and copy them into clipboard
    generateLinks(urls, function (result, code) {
      if (result) {
        let succeeded = false
        setStatus('Trying to set clipboard', -1)
        window.setTimeout(function () {
          if (succeeded) {
            return
          }
          setStatus('Trying GM_setClipboard()', -1)
          try {
            GM_setClipboard(result.join('\r\n'))
            setStatus('Copied to clipboard', 1)
          } catch (e) {
            setStatus('Failed to access clipboard 02', 0)
            alert('Failed to access clipboard.\n\nLinks will appear in next dialog window')
            alert(result.join('\r\n'))
          }
        }, 3000)
        try {
          GM.setClipboard(result.join('\r\n')).then(function () {
            setStatus('Copied to clipboard', 1)
            succeeded = true
          }, function () {
            setStatus('Failed to access clipboard 01', 0)
          })
        } catch (e) {
          setStatus('Clipboard not supported by this browser', 0)
          alert(result.join('\n'))
        };
      } else if (code === -2) {
        // Error was already handled
        console.log('clipboard() in generateLinks(): error already handled')
      } else {
        setStatus('An error occured: No downloadlinks found', 0)
      }
      if (cb) {
        cb()
      }
    })
  }

  async function sendToJD(urls, cb) {
    // Get download links and send them to JDownloader
    generateLinks(urls, function (result, code) {
      if (result) {
        setStatus('Waiting for JDownloader', -1)

        // Comment should be the original page in case of multiple links
        let comment = urls[0]
        if (urls.length > 1) {
          if (showOneclickFromHighlighScriptAllLinksLoc) {
            comment = showOneclickFromHighlighScriptAllLinksLoc
          } else if (showOneclickFromHighlighScriptSelectedLinksLoc) {
            comment = showOneclickFromHighlighScriptAllLinksLoc
          } else {
            comment = document.location.href
          }
        }

        GM.xmlHttpRequest({
          method: 'POST',
          url: JDOWNLOADER + 'flash/add',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: scriptReferer,
            'User-Agent': scriptReferer
          },
          // data: "source="+encodeURIComponent(scriptReferer)+"&urls="+encodeURIComponent(result.join("\r\n")), // Moved "source" to Referer
          // data: "comment="+encodeURIComponent(comment)+"&urls="+encodeURIComponent(result.join("\r\n")), // See ExternInterfaceImpl.java
          data: 'source=' + encodeURIComponent(scriptReferer) + '&comment=' + encodeURIComponent(comment) + '&urls=' + encodeURIComponent(result.join('\r\n')), // See ExternInterfaceImpl.java
          onload: function (resp) {
            if (cb) {
              cb()
            }
            if (resp.status === 204 || resp.responseText.startsWith('success')) {
              setStatus('Sent to JDownloader', 1)
            } else {
              setStatus('JDownloader rejected the request', 0)
            }
          },
          onerror: function (resp) {
            if (cb) {
              cb()
            }
            setStatus('JDownloader is not running', 0)
          }

        })
      } else if (code === -2) {
        // Error was already handled
        console.log('sendToJD() in generateLinks(): error already handled')
        if (cb) {
          cb()
        }
      } else {
        if (cb) {
          cb()
        }
        addStatus('No links to send', 0)
      }
    })
  }

  function showLinks(urls, cb, append, n) {
    const popup = popUp('showLinks')
    const $div = popup.node
    const $loader = $('<div style="width:20px; height:20px;" class="ochspinner"></div>').appendTo($div)

    const $frame = $('<iframe width="900" height="500" style="border:0">').appendTo($div)
    $frame.bind('load', function (e) {
      $($frame[0].contentDocument.getElementsByTagName('head')[0]).append('<link rel="stylesheet" href="https://www.nopremium.pl/css/style.css" type="text/css" />')
      const $body = $($frame[0].contentDocument.getElementsByTagName('body')[0])
      multi[currentdebrid].getResults(urls, function ($node) {
        $loader.remove()
        $body.append($node)
        $body.find('a').each(function () {
          // Open links in new window
          this.setAttribute('target', '_blank')
        })
        if (cb) {
          cb()
        }
      })
    })
    if (chrome) {
      $frame.attr('src', 'about:blank')
    }
  }

  function decryptClickNLoad(cb, jk, cryptedBase64) {
    // Get all the links by decrypting the Click'n'Load form
    // return False for any error
    // return True, run cb() and open the menu if Click'n'Load was successfully decoded

    if (!cryptedBase64 && !(document.getElementsByName('crypted').length && document.getElementsByName('jk').length)) {
      return false // Click'n'Load not avaiblabe
    }

    setStatus("Trying to decrypt Click'n'Load", -1)

    try {
      // Key/IV
      if (!jk) {
        jk = document.getElementsByName('jk')[0].value
      }
      if (jk.indexOf('return') !== -1) {
        jk = eval(jk + '; f();') // eslint-disable-line no-eval
      }

      const key = hexToBytes(jk)
      const iv = key.slice(0)

      // Text
      if (!cryptedBase64) {
        cryptedBase64 = document.getElementsByName('crypted')[0].value
      }
      const cryptedString = atob(cryptedBase64)
      const cryptedBytes = stringToBytes(cryptedString)

      // Decrypt
      const textBytes = slowAES.decrypt(cryptedBytes, slowAES.modeOfOperation.CBC, key, iv)
      let text = bytesToString(textBytes)

      text = text.replace('\r', '')

      const splitted = text.split('\n')

      const links = []
      for (let i = 0; i < splitted.length; i++) {
        // Remove any line that is not a http link
        const t = $.trim(splitted[i])
        if (t && t.substring(0, 4) === 'http') {
          links.push(t)
        }
      }

      const N = links.length

      if (N === 0) {
        return false // Click'n'Load probably failed, try another method...
      }

      if (cb) {
        cb()
      }
      menu(links)
      setStatus('Found ' + (N === 1 ? 'one link' : (N + ' links')), 1)
      return true
    } catch (e) {
      alert("Click'N'Load failed:\n" + e)
      return false // Click'n'Load probably failed, try another method...
    }

    /*
    // Get all the links by decrypting the Click'n'Load form
    if(!document.getElementsByName('crypted').length || !document.getElementsByName('jk').length) {
      if(cb) {
        cb();
      }
      return;
    }
  
    setStatus("Trying linkdecrypter.com",-1);
    const crypted = document.getElementsByName('crypted')[0].value;
    const jk = document.getElementsByName('jk')[0].value;
  
    GM.xmlHttpRequest( {
      method: "POST",
      url: "http://linkdecrypter.com/api/?t=cnl2",
      data: 'crypted=' + encodeURIComponent(crypted) + '&jk=' + encodeURIComponent(btoa(jk)),
      headers: {
        "User-agent": "Mozilla/5.0 (X11;U;Linux i686;es-ES;rv:1.9.2.8) Gecko/20100723 Ubuntu/10.04 (lucid) Firefox/3.6.8",
        "Accept": "application/atom+xml,application/xml,text/xml",
        "Content-type" : "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        if(cb) {
          cb();
        }
        const N = response.responseText.split("\n").length;
        if(!response.responseText || response.responseText.indexOf("ERROR(CNL2)") !== -1 ||  N === 0) {
          setStatus("An error occurred while handling the response of linkdecrypter.com",0);
        } else {
          menu(response.responseText);
          setStatus("Found "+(N===1?"one link":(N+" links")),1);
        }
      }
    });
    */
  }

  function getAllSerienjunkiesLinks(cb) {
    // Get all download links from a serienjunkies.org download page (i.e. the page right after the captcha)
    const urls = [] // [  [partnumber0,link0]  ,  [partnumber1,link1]  ,  .... ]
    let total = 0

    const rap = document.getElementById('rap')
    const table = rap.getElementsByTagName('table')[0]
    const forms = table.getElementsByTagName('form')

    let j = 1 // part number, in order to make sure that sorting of the links is the same as on the page.
    // This is only a fallback in case there is no visible part number in the actual downloadlink/filename.
    for (let i = 0; i < forms.length; i++) {
      const url = forms[i].action
      if (url.indexOf('mirror') !== -1 || url.indexOf('firstload') !== -1) {
        continue
      }
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        onload: (function (j) {
          return function (response) {
            const loc = response.finalUrl // Actual link after posible redirections
            if (response.finalUrl.match(/part*(\d+)\./)) { // Try to guess part number
              const part = response.finalUrl.match(/part*(\d+)\./)[1]
              urls.push([parseInt(part, 10), loc])
            } else { // fallback part number
              urls.push([j, loc])
            }
            setStatus('Decrypting: ' + urls.length + '/' + total, total === urls.length ? 1 : -1)
            if (total === urls.length) {
              // Got all links
              cb(urls)
            }
          }
        }(j))
      })
      j++
    }
    total = j - 1
  };

  function getSerienjunkiesLinks(cb) {
    // Get all the links from the page
    getAllSerienjunkiesLinks(function (urls) {
      if (cb) {
        cb()
      }

      urls = urls.sort(function (a, b) {
        if (a[0] > b[0]) return 1
        else if (a[0] < b[0]) return -1
        return 0
      })

      let alllinks = ''
      for (let i = 0; i < urls.length; ++i) {
        alllinks += urls[i][1] + '\n'
      }
      menu(alllinks)
    })
  }

  function getFilecryptcc(jddata, cb) {
    // Get all the links by decrypting the Click'n'Load form
    const fieldJk = jddata[0]
    const fieldCrypted = jddata[1]

    const r = decryptClickNLoad(cb, fieldJk, fieldCrypted)
    if (!r) {
      setStatus("Could not find Click'n'Load", -1)
      if (cb) {
        cb()
      }
    }
  }

  function getSafeLinkingNetLinks(cb) {
    // Get all the links by following each link

    const crypticUrls = []
    $('div.links-container.result-form a.result-a').each(function () {
      if (this.getAttribute('href') && this.getAttribute('href').indexOf('/d/') !== -1) { crypticUrls.push(this.getAttribute('href')) }
    })

    const urls = []
    let total = 0

    let j = 1
    for (let i = 0; i < crypticUrls.length; i++) {
      GM.xmlHttpRequest({
        method: 'GET',
        url: crypticUrls[i],
        onload: (function (j) {
          return function (response) {
            const loc = response.finalUrl // Actual link after posible redirections
            urls.push(loc)
            setStatus('Decrypting: ' + urls.length + '/' + total, -1)
            if (total === urls.length) {
              // Got all links
              cb()
              menu(urls)
              setStatus('Found ' + (total === 1 ? 'one link' : (total + ' links')), 1)
            }
          }
        }(j))
      })
      j++
    }
    total = j - 1
  };

  const linkSelectorFilter = {
    _filter: function (key) {
      const a = Array.prototype.slice.call(arguments, 1)
      return function () {
        linkSelectorFilter[key].apply(linkSelectorFilter, a)
      }
    },

    all: function (trs) {
      for (let i = 0; i < trs.length; i++) {
        trs[i].$check.prop('checked', true)
      }
    },
    none: function (trs) {
      for (let i = 0; i < trs.length; i++) {
        trs[i].$check.prop('checked', false)
      }
    },
    flip: function (trs) {
      for (let i = 0; i < trs.length; i++) {
        trs[i].$check.prop('checked', !trs[i].$check.prop('checked'))
      }
    },

    has: function (trs, inpFilter) {
      const s = inpFilter.val()
      for (let i = 0; i < trs.length; i++) {
        if (trs[i].link.indexOf(s) !== -1) {
          trs[i].$check.prop('checked', !trs[i].$check.prop('checked'))
        }
      }
    },

    host: function (trs, $selHost) {
      const h = $selHost.val()

      for (let i = 0; i < trs.length; i++) {
        if (trs[i].host === h) {
          trs[i].$check.prop('checked', !trs[i].$check.prop('checked'))
        }
      }
    },

    fromto: function (trs, $table, $thead, $th) {
      const _self = this

      for (let i = 0; i < trs.length; i++) {
        trs[i].$check.prop('disabled', true)
      }
      $table.find('td').hover(function () {
        $(this).parent().find('td').each(function (i, e) {
          $(e).css('background', 'PaleGreen')
        })
      }, function () {
        $(this).parent().find('td').each(function (i, e) {
          $(e).css('background', '')
        })
      })
      $thead.find('th').css('display', 'none')
      $th.css('display', '')
      $th.html('Select from where to start')

      $table.find('td').click(function () {
        const from = $(this.parentNode).data('index')
        $(this).parent().find('td').css('background', 'PaleGreen')
        $table.find('td').unbind('click mouseenter mouseleave')
        $th.html('Select where to stop')

        $table.find('td').hover(function () {
          const to = $(this.parentNode).data('index')
          $table.find('td').each(function (i, e) {
            const $e = $(e)
            const j = $e.parent().data('index')
            if (j > from && j <= to) {
              $e.css('background', 'DarkSeaGreen')
            } else if (j > from && j > to) {
              $e.css('background', '')
            }
          })
          if ($(this).parent().data('index') > from) $(this).parent().find('td').css('background', 'PaleGreen')
        })
        $table.find('td').filter(function (i, e) { return $(e.parentNode).data('index') > from }).click(function () {
          const to = $(this.parentNode).data('index') + 1

          $table.find('td').unbind('click mouseenter mouseleave')
          $(this).parent().find('td').css('background', 'PaleGreen')
          $table.find('td').each(function (i, e) {
            const $e = $(e)
            const j = $e.parent().data('index')
            if (j < from || j >= to) {
              $e.css('display', 'none')
            }
          })

          const ntrs = trs.slice(from, to)
          for (let i = 0; i < ntrs.length; i++) {
            ntrs[i].$check.prop('disabled', false)
          }

          $th.html('Select ')
          $('<button>').appendTo($th).text('all').click(_self._filter('all', ntrs))
          $('<button>').appendTo($th).text('none').click(_self._filter('none', ntrs))
          $('<button>').appendTo($th).text('flip').click(_self._filter('flip', ntrs))
          $('<button>').appendTo($th).text('return to all links').click(function () {
            $table.find('td').each(function (i, e) {
              const $e = $(e)
              $e.css('display', '')
              $e.css('background', '')
            })
            $thead.find('th').css('display', '')
            $th.css('display', 'none')
            $th.html('')
            for (let i = 0; i < trs.length; i++) {
              trs[i].$check.prop('disabled', false)
            }
          })
          $th[0].scrollIntoView()

          return false
        })
      })
    },

    every: function (trs, $table, $thead, $th) {
      const _self = this

      for (let i = 0; i < trs.length; i++) {
        trs[i].$check.prop('disabled', true)
      }
      $table.find('td').hover(function () {
        $(this).parent().find('td').each(function (i, e) {
          $(e).css('background', 'PaleGreen')
        })
      }, function () {
        $(this).parent().find('td').each(function (i, e) {
          $(e).css('background', '')
        })
      })
      $thead.find('th').css('display', 'none')
      $th.css('display', '')
      $th.html('Select from where to start')

      $table.find('td').click(function () {
        const from = $(this.parentNode).data('index')
        $(this).parent().find('td').css('background', 'PaleGreen')
        $table.find('td').unbind('click mouseenter mouseleave')
        $th.html('Select next')

        $table.find('td').hover(function () {
          const to = $(this.parentNode).data('index')
          const diff = to - from
          if (to < from + 2) {
            $table.find('td').filter(function (i, e) { return $(e.parentNode).data('index') > from + 1 }).css('background', '')
          } else {
            $table.find('td').filter(function (i, e) { return $(e.parentNode).data('index') > from + 1 }).each(function (i, e) {
              const j = $(this.parentNode).data('index')
              if ((j - from) % diff === 0 && j > from + 1) {
                $(this).css('background', 'PaleGreen')
              } else {
                $(this).css('background', '')
              }
            })
            $(this).parent().find('td').css('background', 'DarkSeaGreen')
          }
        }).click(function () {
          const to = $(this.parentNode).data('index')

          if (to < from + 2) return false

          $(this).parent().find('td').css('background', 'PaleGreen')

          const diff = to - from

          $table.find('td').unbind('click mouseenter mouseleave')

          $table.find('td').each(function (i, e) {
            const $e = $(e)
            const j = $e.parent().data('index')
            if ((j - from) % diff !== 0 || j < from) {
              $e.css('display', 'none')
            }
          })

          const ntrs = []
          for (let i = 0; i < trs.length; i++) {
            if ((i - from) % diff === 0 && i >= from) {
              trs[i].$check.prop('disabled', false)
              ntrs.push(trs[i])
            }
          }

          $th.html('Select ')
          $('<button>').appendTo($th).text('all').click(_self._filter('all', ntrs))
          $('<button>').appendTo($th).text('none').click(_self._filter('none', ntrs))
          $('<button>').appendTo($th).text('flip').click(_self._filter('flip', ntrs))
          $('<button>').appendTo($th).text('return to all links').click(function () {
            $table.find('td').each(function (i, e) {
              const $e = $(e)
              $e.css('display', '')
              $e.css('background', '')
            })
            $thead.find('th').css('display', '')
            $th.css('display', 'none')
            $th.html('')
            for (let i = 0; i < trs.length; i++) {
              trs[i].$check.prop('disabled', false)
            }
          })
          $th[0].scrollIntoView()

          return false
        })
      })
    }

  }

  function linkSelector(links) {
    const filter = function (key) {
      const a = Array.prototype.slice.call(arguments, 1)
      return function () {
        linkSelectorFilter[key].apply(linkSelectorFilter, a)
      }
    }

    const trs = []

    const selectedLinks = []
    // Coyp array and remove empty elements
    for (let i = 0; i < links.length; i++) {
      const t = $.trim(links[i])
      if (t) {
        selectedLinks.push(t)
      }
    }

    if (linksBeforeSelection === false) {
      linksBeforeSelection = links.slice(0) // Save all links for later selections
    }
    const allLinks = linksBeforeSelection.slice(0)

    const popup = popUp('linkSelector')
    const $div = popup.node
    const $loader = $('<div style="width:20px; height:20px;" class="ochspinner"></div>').appendTo($div)
    $div.css('overflow', 'none')
    const $frame = $('<iframe style="border:0">').appendTo($div)
    $frame.attr('width', window.innerWidth - 190)
    $frame.attr('height', window.innerHeight - 120)
    $frame.bind('load', function (e) {
      const $body = $($frame[0].contentDocument.getElementsByTagName('body')[0])

      const $main = $('<div>').appendTo($body)

      const $table = $('<table>').appendTo($main)
      const $thead = $('<thead>').appendTo($table)

      const $tr0 = $('<tr>').appendTo($thead)
      const $th0 = $('<th>').appendTo($tr0).attr('colspan', 2)
      const $tr1 = $('<tr>').appendTo($thead)
      const $th1 = $('<th>').appendTo($tr1).attr('colspan', 2)
      const $tr2 = $('<tr>').appendTo($thead)
      const $th2 = $('<th>').appendTo($tr2).attr('colspan', 2)
      const $tr3 = $('<tr>').appendTo($thead)
      const $th3 = $('<th>').appendTo($tr3).attr('colspan', 2)
      const $tr4 = $('<tr>').appendTo($thead)
      const $th4 = $('<th>').appendTo($tr4).attr('colspan', 2)

      $('<span>Select: <span>').appendTo($th0)
      $('<button>').appendTo($th0).text('all').click(filter('all', trs))
      $('<button>').appendTo($th0).text('none').click(filter('none', trs))
      $('<button>').appendTo($th0).text('flip').click(filter('flip', trs))

      $('<button>').appendTo($th1).text('Select from ... to ...').click(filter('fromto', trs, $table, $thead, $th4))
      $('<button>').appendTo($th1).text('Select every ...').click(filter('every', trs, $table, $thead, $th4))

      $('<span> Filter:<span>').appendTo($th2)
      const inpFilter = $('<input>').appendTo($th2).attr('type', 'text')
      $('<button>').appendTo($th2).text('Flip with filter').click(filter('has', trs, inpFilter))

      $('<span> Host filter:<span>').appendTo($th3)
      const $selHost = $('<select>').appendTo($th3)
      $('<button>').appendTo($th3).text('Flip with host filter').click(filter('has', trs, $selHost))

      const allhosts = []
      for (let i = 0; i < allLinks.length; i++) {
        const $tr = $('<tr>').data('index', i).appendTo($table)
        const $td0 = $('<td>').appendTo($tr)
        const $check = $('<input>').appendTo($td0).attr('type', 'checkbox').attr('id', 'link_checkbox_' + i).prop('checked', selectedLinks.indexOf(allLinks[i]) !== -1)
        const $td1 = $('<td>').appendTo($tr)
        $('<label>').attr('for', 'link_checkbox_' + i).text(allLinks[i]).css('font-family', 'monospace').appendTo($td1)

        const host = allLinks[i].split('/')[2].replace(/^www\./, '')
        if (allhosts.indexOf(host) === -1) {
          allhosts.push(host)
        }

        trs.push({ $tr, $check, link: allLinks[i], host })
      }

      for (let i = 0; i < allhosts.length; i++) {
        $('<option>').val(allhosts[i]).text(allhosts[i]).appendTo($selHost)
      }

      $('<button>').appendTo($main).text('Apply').click(function () {
        const nlinks = []
        for (let i = 0; i < trs.length; i++) {
          if (trs[i].$check.prop('checked')) {
            nlinks.push(trs[i].link)
          }
        }
        if (nlinks.length === 0) {
          alert('No links selected?!')
          return
        }
        menu(nlinks)
        setStatus((nlinks.length === 1 ? 'One link' : (nlinks.length + ' links')) + ' selected', 1)
        popup.close()
      })

      $loader.remove()
    })
    if (chrome) {
      $frame.attr('src', 'about:blank')
    }
  }

  function menu(links) {
    // normalize links:
    if (!Array.isArray(links)) {
      const parts = links.split('\n')
      links = []
      for (let i = 0; i < parts.length; i++) {
        if ($.trim(parts[i])) {
          links.push($.trim(parts[i]))
        }
      }
    }

    const $c = $('#multiochhelper ul')
    $c.html('')

    const $select = $('<select>')
    const m = links[0].match(/https?:\/\/(.+?)\//)
    if (!m) {
      console.log(scriptName + ": Not a valid link: '" + links[0] + "'")
      return
    }
    const host = m[1]
    let hoster = host.split('.')
    hoster.pop()
    hoster = hoster.pop().replace('-', '')
    $.each(multi, function (key, val) {
      const $option = $('<option></option>').val(key).html(val.name).appendTo($select)
      if (key === currentdebrid) {
        $option[0].selected = true
      }
      if (multi[key].isOnline(hoster)) {
        $option.css('color', 'green')
      } else {
        $option.css('color', '#F00')
      }
    })
    let $entry = menuentry($select)
    $select.bind('change', function (ev) {
      const $this = $(this)
      // Change hoster
      currentdebrid = $this.val()

      // Check general support
      if (multi[currentdebrid].isOnline(hoster)) {
        // Check first link for support on this multi hoster
        multi[currentdebrid].checkLink(links[0], function (result) {
          if (!result) {
            alert(scriptName + '\n\n' + host + ' is not supported by this hoster or the file is offline.\n\nChecked: ' + links[0])
          }
        })
      } else {
        alert(scriptName + '\n\n' + host + ' is not supported by ' + multi[currentdebrid].name)
      }

      // Add "Remember" checkbox
      if (!$this.parent().find('#remember').length) {
        const $div = $('<div>')
        const $check = $('<input id="remember" type="checkbox" value="remember" title="Remember selection">').click(async function () {
          if (this.checked) {
            currentdebrid = $select.val()
            await GM.setValue('currentdebrid', currentdebrid)
            setStatus('Switched to ' + multi[currentdebrid].name, 1)
            $div.remove()
          }
        })
        $div.append($check).append('Remember')
        $this.parent().append($div)
      }
    })

    $entry = menuentry('Direct download')
    $entry.click(function () { mouse('download', links) })

    $entry = menuentry('Copy to clipboard')
    $entry.click(function () { mouse('clipboard', links) })

    if (settings.jDownloaderSupport) {
      $entry = menuentry('Send to JDownloader')
      $entry.attr('id', 'multiochhelperjdbutton')
      $entry.hide()
      $entry.click(function () { mouse('sendToJD', links) })
      GM.xmlHttpRequest({
        method: 'GET',
        url: JDOWNLOADER + 'flash/',
        onerror: function () {
        },
        onload: function (resp) {
          if (resp && resp.responseText && resp.responseText.startsWith('JDownloader')) {
            $('#multiochhelperjdbutton').show()
          }
        }
      })
    }

    if (!showOneclickFromHighlighScriptAllLinks) {
      $entry = menuentry('Show generated links')
      $entry.click(function () { mouse('showLinks', links) })
    }

    $entry = menuentry('Show extracted links')
    $entry.click(function () {
      if (window.parent.parent !== window) {
        window.parent.parent.postMessage({ iAm: 'Unrestrict.li', type: 'alert', str: links.join('\n') }, '*')
        alert(links.join('\n'))
      } else {
        showExtractedLinks(links)
      }
    })

    if (!showOneclickFromHighlighScriptAllLinks && (links.length > 1 || linksBeforeSelection !== false)) {
      $entry = menuentry('Select links')
      $entry.click(function () { linkSelector(links) })
    }

    if (!showOneclickFromHighlighScriptAllLinks) {
      $entry = menuentry()
      $('<a style="color:white !important;">Open Website</a>').attr('href', getMultiOCHWebsiteURL(links)).appendTo($entry)
    }

    if (showOneclickFromHighlighScriptAllLinks && showOneclickFromHighlighScriptAllLinksLinks) {
      $entry = $(menuentry('Use all links on page...'))
      $entry.click(function () {
        // Switch to all links instead of one
        const links = showOneclickFromHighlighScriptAllLinksLinks
        showOneclickFromHighlighScriptAllLinksLinks = ''
        menu(links)
        $('#multiochhelper div:empty:not(:first)').remove()
        setStatus('All links!', 1)
      })
    }

    if (showOneclickFromHighlighScriptSelectedLinks && showOneclickFromHighlighScriptSelectedLinksLinks) {
      $entry = $(menuentry('Use selected links...'))
      $entry.click(function () {
        // Switch to selected links instead of one
        const links = showOneclickFromHighlighScriptSelectedLinksLinks
        showOneclickFromHighlighScriptSelectedLinksLinks = ''
        menu(links)
        $('#multiochhelper div:empty:not(:first)').remove()
        setStatus('Using selected links!', 1)
      })
    }

    if (!showOneclickFromHighlighScriptAllLinks) {
      $entry = menuentry($('<span style="cursor:default; color:silver">Userscript menu</span>').click(function (ev) { ev.stopPropagation(); aboutMe() }))
      $entry.css('cursor', 'default')
      $('<span style="cursor:pointer; color:White; border: 1px solid White; border-radius:3px; padding:0px; margin-left:20px; font-weight:bold ; " title="Close menu">X</span>').click(function () { $('#multiochhelper').remove() }).appendTo($entry)
    }
  }

  function loader() {
    // Show an animation, return function to remove the loader
    $('#multiochhelper_status_loader').parent().show()
    const $div = $('<div class="ochspinner"></div>').appendTo($('#multiochhelper_status_loader'))
    return function () {
      $div.remove()
    }
  }

  async function mouse(action, linkText) {
    // decide what to do after a mouse click
    const removeImg = loader()
    if (action === 'download') {
      await download(linkText, removeImg)
    } else if (action === 'showLinks') {
      showLinks(linkText, removeImg)
    } else if (action === 'openWebsite') {
      openWebsite(linkText)
    } else if (action === 'clipboard') {
      await clipboard(linkText, removeImg)
    } else if (action === 'menu') {
      removeImg()
      menu(linkText)
    } else if (action === 'sendToJD') {
      await sendToJD(linkText, removeImg)
    }
  }

  function menuentry(html) {
    const $li = $('<li>')
    if (html) {
      $li.append(html)
    }
    $li.appendTo('#multiochhelper ul')
    return $li
  }

  function button(label) {
    addCSSHead(`
  #multiochhelper,#multiochhelper * {
    font-family:Sans-Serif !important;
    padding:0px; margin:0px;
  }
  #multiochhelper a, #multiochhelper a:link,#multiochhelper a:visited {
    text-decoration:underline !important;
    color:#3788e8 !important;
    font-style:none !important;
  }
  #multiochhelper a:hover {
    text-decoration:none !important;
    color:#3788e8 !important;
    font-style:none !important;
  }
  #multiochhelper ul li,#multiochhelper_status {
    margin:1px 1px;
    padding:1px 5px;
    font-size:13px;
    text-shadow:0 -1px 0 #333333;
    color:White;
    border:1px solid #8B3D92;
    background-color:#B555C5;
    background:radial-gradient(ellipse at center, #B555C5, #8B3D92);
    list-style:none outside;
  }
  #multiochhelper div#multiochhelper_status_loader {
    float:left;
  }
  #multiochhelper div#multiochhelper_status_text {
    float:left;
  }
  #multiochhelper div#multiochhelper_status_clear {
    clear:left;
  }
  #multiochhelper ul li {
    cursor:pointer;
  }
  #multiochhelper ul li:hover {
    background-color:#CC6BDD;
    background:radial-gradient(ellipse at center, #CC6BDD, #8B3D92);
  }
  #multiochhelper select,#multiochhelper input {
    border-radius:0;
    box-shadow:none;
    text-shadow:none;
    border:none;
    background:white;
    color:black;
  }

  ${SPINNERCSS}
  `)

    // div container
    const zi = getNextZIndex()
    const $div = $('<div>').appendTo(document.body)
    $div.attr('id', 'multiochhelper')
    $div.attr('style', 'z-index:' + zi + '; position:fixed; background:#E6E6E6; color:Black; border:#B555C5 2px solid;border-radius:5px; padding:3px;')
    if (settings.position[0] === 'top') {
      $div.css('top', '0%')
    } else {
      $div.css('bottom', '0%')
    }
    if (settings.position[1] === 'left') {
      $div.css('left', '0%')
    } else {
      $div.css('right', '0%')
    }
    // Status
    const $status = $('<div>').appendTo($div).hide()
    $status.attr('id', 'multiochhelper_status')
    const $loader = $('<div>').appendTo($status)
    $loader.attr('id', 'multiochhelper_status_loader')
    const $statustext = $('<div>').appendTo($status)
    $statustext.attr('id', 'multiochhelper_status_text')
    const $statusclear = $('<div>').appendTo($status)
    $statusclear.attr('id', 'multiochhelper_status_clear')

    const $ul = $('<ul>').appendTo($div)

    // Button
    const $entry = menuentry(label || (multi[currentdebrid].name.charAt(0).toUpperCase() + multi[currentdebrid].name.slice(1)))

    $ul.append($entry)

    return $entry
  }

  const isSetup = await GM.getValue('setup', false)

  // Update hoster status
  let updatinghosters = false
  if (isSetup) {
    for (const key in multi) {
      if (multi[key].updateStatusURLpattern.test(document.location.href)) { //  usually in this is true in the iframe which is defined below
        multi[key].updateStatus()
        updatinghosters = true
        break
      }
    }
  }

  // Create iframes to check hoster status:
  if (!updatinghosters && isSetup) {
    const now = new Date()
    for (const key in multi) {
      if ('updateStatusURL' in multi[key] && (now - multi[key].lastUpdate) > (settings.updateHosterStatusInterval * 60 * 60 * 1000)) {
        const $iframe = $('<embed>').appendTo(document.body)
        $iframe.bind('load', function () {
          const frame = this
          window.setTimeout(function () { $(frame).remove() }, 3000)
        })
        $iframe.attr('src', multi[key].updateStatusURL)
      }
    }
  }

  // Setup
  if (!updatinghosters) {
    if (!isSetup) {
      await aboutMe()
      if (!confirm(scriptName + ' Setup\n\nPlease take some time to configure ' + scriptName + ' and then save the settings!\n\nPress cancel to continue with the default configuration!')) {
        await GM.setValue('setup', true)
        alert(scriptName + '\n\nDefault settings will be used.')
        document.location.reload()
      }
    }
  }

  if (document.location.href.indexOf('nopremium.pl') !== -1) {
    // nopremium.pl Website
    if (document.location.search.substring(0, 6) === '?link:') {
      // Insert link on nopremium.pl
      $('#filesList').val(decodeURIComponent(document.location.search.substring(6)))
    }
  } else if (document.location.href.indexOf('www.premiumize.me') !== -1) {
    // premiumize.me Website
    if (document.location.search.substring(0, 6) === '?link:') {
      // Insert link on nopremium.pl
      $('textarea').val(decodeURIComponent(document.location.search.substring(6)))
    }
  } else if (document.location.href.indexOf('download.serienjunkies.org') !== -1) {
    // Serienjunkies
    if (!document.querySelector('.g-recaptcha')) { // if not on captcha page
      const $b = button('Decrypt links')
      $b.click(function (ev) {
        const removeImg = loader()
        getSerienjunkiesLinks(removeImg)
      })
    }
  } else if (document.location.href === 'http://filecloud.io/download.html') {
    // filecloud.io
    if (unsafeWindow.__currentUrl) {
      showOneclickButton = true
      showOneclickLink = decodeURIComponent(unsafeWindow.__currentUrl)
    }
  } else if (document.location.href.indexOf('filecrypt.cc') !== -1) {
    // filecrypt.cc folder
    if (document.location.href.indexOf('helper.html') !== -1) { // if not on captcha page
      window.addEventListener('message', function filecryptmessage(event) {
        if (event.data && typeof (event.data) === 'object') {
          window.opener.postMessage({ filecryptData: JSON.stringify(event.data) }, '*') // Send message back to the opening window
          window.removeEventListener('message', filecryptmessage) // Prevent further messages from creating several buttons
        }
      }, false)
    } else if (document.location.href.indexOf('Container') !== -1) { // if not on captcha page
      const $b = button("Please open the Click'n'Load Popup (several times)")
      $b.click(function () {
        $('#cnl_btn').click()
      })
      window.addEventListener('message', function filecryptmessage2(event) { // Receive messages from the popup
        if (event.data && typeof (event.data) === 'object' && 'filecryptData' in event.data) {
          window.removeEventListener('message', filecryptmessage2) // Prevent further messages from creating several buttons
          setStatus('Decrypting', -1)
          const removeImg = loader()
          getFilecryptcc(JSON.parse(event.data.filecryptData), removeImg)
        }
      }, false)
    }
  } else if (document.location.href.substring(7, 22) === 'protected.to/f-') {
    // http://protected.to folder
    if (document.querySelectorAll('.links a').length > 0) { // If not on captcha page
      showOneclickButton = true
      showOneclickLink = ''
      $('.links a').each(function () {
        showOneclickLink += decodeURIComponent(this.href) + '\n'
      })
    }
  } else if (document.location.href.substring(8, 23) === 'safelinking.net') {
    // safelinking.net folder
    if (!document.getElementById('captcha-wrapper')) {
      const $b = button('Decrypt links')
      $b.click(function (ev) {
        const removeImg = loader()
        getSafeLinkingNetLinks(removeImg)
      })
    }
  } else if (document.location.href.indexOf('.firedrive.com/share/') !== -1) {
    // firedrive.com folder
    showOneclickButton = true
    showOneclickLink = ''
    $('a.pf_item_link:visible').each(function () {
      showOneclickLink += decodeURIComponent(this.href) + '\n'
    })
  } else if (document.location.href.indexOf('rapidgator.net/folder/') !== -1) {
    // Rapidgator folder
    showOneclickButton = true
    showOneclickLink = ''
    $('#grid tbody a').each(function () {
      showOneclickLink += decodeURIComponent(this.href) + '\n'
    })
  } else if (document.location.hostname === "dailyuploads.net" && currentdebrid === 'premiumize.me') {
    // Dailyuploads.net: submit direct download link (after captcha was solved) to premiumize.me instead of link
    if (document.querySelector('div.banner div.inner a>img[src*="redbutton.png"]')) {
      showOneclickButton = true
      showOneclickLink = document.querySelector('div.banner div.inner a>img[src*="redbutton.png"]').parentNode.href
    } else {
      showOneclickButton = false
      button("Please solve the captcha first")
    }
  } else if (document.location.hostname === 'multiup.org') {
    // Multiup.org mirrors
    showOneclickButton = document.querySelectorAll('button[link]').length > 0
    showOneclickLink = Array.from(document.querySelectorAll('button[link]')).map(b => b.getAttribute('link')).join('\n')
  } else if (document.location.href.substring(0, 55) === 'https://cvzi.github.io/Userscripts/index.html?link=sync') {
    // Window opened from Helper script to sync hoster status (see postMessage events below)
    showOneclickButton = false
    const message = 'Updating hoster status...'
    const h1 = document.body.appendChild(document.createElement('h1'))
    h1.appendChild(document.createTextNode(scriptHightligherName + ': ' + message))
    setTitle('')
    window.setTimeout(function () {
      const h2 = document.body.appendChild(document.createElement('h2'))
      h2.appendChild(document.createTextNode('You may close this tab now'))
    }, 4000)
  } else if (document.location.href.substring(0, 51) === 'https://cvzi.github.io/Userscripts/index.html?link=') {
    // Iframe for a X-Frame-Options website
    showOneclickButton = true
    showOneclickLink = decodeURIComponent(document.location.search.match(/link=(.+)/)[1])
  } else {
    // One click hoster website
    showOneclickButton = true
    showOneclickLink = decodeURIComponent(document.location.href)
  }

  if (showOneclickButton) {
    let mouseOverAvailable = true

    // Split links into array
    const splitted = showOneclickLink.split('\n')
    showOneclickLink = []
    for (let i = 0; i < splitted.length; i++) {
      if ($.trim(splitted[i])) {
        showOneclickLink.push($.trim(splitted[i]))
      }
    }

    const $b = button()

    $b.bind('mousedown',
      function (ev) {
        mouseOverAvailable = false
        if (ev.which === 3) { // Right click
          mouse(settings.rightClick, showOneclickLink)
        } else if (ev.which === 2) { // Middle click
          mouse(settings.middleClick, showOneclickLink)
        } else if (ev.which === 1) { // Left click {
          mouse(settings.leftClick, showOneclickLink)
        }
      })
    if (settings.mouseOver !== 'none') {
      let ti = false
      $b.on({
        mouseover: function () {
          if (!mouseOverAvailable) { return }
          ti = setTimeout(function () {
            if (!mouseOverAvailable) { return }
            mouseOverAvailable = false
            mouse(settings.mouseOver, showOneclickLink)
          }, settings.mouseOverDelay)
        },
        mouseout: function () {
          if (ti !== false) clearTimeout(ti)
        }
      })
    }
    // Prevent context menu on right click
    if (settings.rightClick !== 'none') {
      $b[0].addEventListener('contextmenu', e => e.preventDefault(), false)
    }
  }

  // Handle messages from the highlight script
  window.addEventListener('message', function (e) {
    if (typeof e.data !== 'object' || !('iAm' in e.data) || e.data.iAm !== 'Unrestrict.li') {
      return
    }

    switch (e.data.type) {
      case 'alllinks':
        if (showOneclickFromHighlighScriptAllLinks) {
          return
        }
        showOneclickFromHighlighScriptAllLinks = true
        showOneclickFromHighlighScriptAllLinksLoc = e.data.loc
        showOneclickFromHighlighScriptAllLinksLinks = e.data.links.join('\n')
        if ($('#multiochhelper ul li').length > 1) { // Menu already opened
          menu(showOneclickLink)
        }
        break
      case 'selectedlinks':
        if (showOneclickFromHighlighScriptSelectedLinks) {
          return
        }
        showOneclickFromHighlighScriptSelectedLinks = true
        showOneclickFromHighlighScriptSelectedLinksLoc = e.data.loc
        showOneclickFromHighlighScriptSelectedLinksLinks = e.data.links.join('\n')
        if ($('#multiochhelper ul li').length > 1) { // Menu already opened
          menu(showOneclickLink)
        }
        break
      case 'requesthosterstatus': {
        window.setTimeout(function () {
          const h3 = document.body.appendChild(document.createElement('h3'))
          h3.appendChild(document.createTextNode('This will only take a few seconds'))
        }, 0)
        const o = {}
        for (const key in multi) {
          o[key] = multi[key].status
        }
        e.source.postMessage({ iAm: 'Unrestrict.li', type: 'hosterstatus', str: JSON.stringify(o) }, '*')
        break
      }
    }
  }, true)
})()
