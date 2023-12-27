// ==UserScript==
// @exclude     *
// ==UserLibrary==
// @name        OCH: One Click Hosters List
// @description A list of One-Click-Hosters that are supported by nopremium.pl
// @version     42
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserLibrary==
// @namespace   cuzi
// @homepageURL https://github.com/cvzi/Userscripts
// ==/UserScript==

/*
  This library requires another library:
  (at)require http://openuserjs.org/src/libs/cuzi/RequestQueue.js
*/

'use strict'

/*

var rq = new RequestQueue();
var MAXDOWNLOADSIZE = 2048; // KB
*/

if (typeof module !== 'undefined') {
  module.exports = getOCH
}

function getOCH(rq, MAXDOWNLOADSIZE) {
  if (!rq) {
    rq = { add: function () { console.log('OCH List: Error: No RequestQueue() parameter set') } }
  }
  if (!MAXDOWNLOADSIZE) {
    MAXDOWNLOADSIZE = 2048
  }

  const permanentlyoffline = function (link, cb, thisArg) {
    cb.call(thisArg, link, 0) // Offline
  }

  const unkownStatus = function (link, cb, thisArg) {
    cb.call(thisArg, link, -1, 'This hoster cannot be checked')
  }

  const offlineByFindingString = function (link, s, cb, thisArg, useURL) {
    // Offline if one of the strings [s] is found in the responseText
    if (typeof s === 'string') {
      s = [s]
    }
    rq.add({
      method: 'GET',
      url: useURL || link.url,
      onprogress: function (response) {
        // abort download of big files
        if ((Math.max(response.loaded, response.total) / 1024) > MAXDOWNLOADSIZE) {
          this.__result.abort()
          cb.call(thisArg, link, 1) // Let's assume big files are online
        }
      },
      onload: function (response) {
        for (let i = 0; i < s.length; i++) {
          if (response.responseText.indexOf(s[i]) !== -1) {
            cb.call(thisArg, link, 0) // Offline
            return
          }
        }
        if (response.status < 400) { // Online 2xx
          cb.call(thisArg, link, 1)
        } else if (response.status > 499) { // Server error 5xx (server error)
          cb.call(thisArg, link, -1, 'Server error: ' + response.status + ' ' + response.statusText)
        } else {
          cb.call(thisArg, link, 0) // Offline 4xx (client error)
        }
      },
      onerror: function (response) {
        cb.call(thisArg, link, 0) // Offline
      }
    })
  }
  const onlineByFindingString = function (link, s, cb, thisArg, useURL) {
    // Offline if none of the strings [s] is found in the responseText
    if (typeof s === 'string') {
      s = [s]
    }
    rq.add({
      method: 'GET',
      url: useURL || link.url,
      onprogress: function (response) {
        // abort download of big files
        if ((Math.max(response.loaded, response.total) / 1024) > MAXDOWNLOADSIZE) {
          this.__result.abort()
          cb.call(thisArg, link, 1) // Let's assume big files are online
        }
      },
      onload: function (response) {
        for (let i = 0; i < s.length; i++) {
          if (response.responseText.indexOf(s[i]) !== -1) {
            cb.call(thisArg, link, 1) // Online
            return
          }
        }
        cb.call(thisArg, link, 0) // Offline
      },
      onerror: function (response) {
        cb.call(thisArg, link, 0) // Offline
      }
    })
  }
  const offlineByMatchingFinalUrl = function (link, re, cb, thisArg, useURL) {
    // Offline if one of the RegEx [re] matches the finalUrl
    if (!Array.isArray(re)) {
      re = [re]
    }

    rq.add({
      method: 'GET',
      url: useURL || link.url,
      onprogress: function (response) {
        // abort download of big files
        if ((Math.max(response.loaded, response.total) / 1024) > MAXDOWNLOADSIZE) {
          this.__result.abort()
          cb.call(thisArg, link, 1) // Let's assume big files are online
        }
      },
      onload: function (response) {
        for (let i = 0; i < re.length; i++) {
          if (re[i].test(response.finalUrl)) {
            // Link is offline
            cb.call(thisArg, link, 0)
            return
          }
        }
        cb.call(thisArg, link, 1) // Online
      },
      onerror: function (response) {
        cb.call(thisArg, link, 0) // Offline
      }
    })
  }

  return {

    /*

pattern: A single RegExp or an array of RegExp
multi: An array of multihost-services that support this hoster
title: String
homepage: String/URL
check: void check(link, cb, thisArg)
  link : { url: "http://example.com/example.file", [...]  }
  cb : void thisArg.cb(link, result, errorstring)
       link : the original link object
       result: 1 -> online, 0 -> offline, -1 -> error
       errorstring: may contain error details e.g. the request result, only set if result === -1
  thisArg : The value of this provided for the call to cb.
*/

    '180upload': {
      pattern: /^https?:\/\/180upload\.com\/\w+$/m,
      multi: [],
      title: 'Offline: 180upload',
      homepage: 'http://180upload.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    '1fichier': {
      pattern: [/^https?:\/\/(www\.)?1fichier\.com\/.+$/m, /^https?:\/\/\w+\.1fichier\.com\/?.*$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: '1fichier',
      homepage: 'http://1fichier.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['The requested file could not be found', 'The requested file has been deleted', 'The requested file does not exist'], cb, thisArg)
      }
    },
    '2shared': {
      pattern: /^https?:\/\/www\.2shared\.com\/[a-z]+\/\w+\/?(.+\.html)?$/,
      multi: [],
      title: '2Shared',
      homepage: 'http://www.2shared.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'VGhlIGZpbGUgbGluayB0aGF0IHlvdSByZXF1ZXN0ZWQgaXMgbm90IHZhbGlkLiBQbGVhc2UgY29udGFjdCBsaW5rIHB1Ymxpc2hlciBvciB0cnkgdG8gbWFrZSBhIHNlYXJjaC4=', cb, thisArg)
      }
    },
    '4shared': {
      pattern: /^https?:\/\/www\.4shared\.com\/[a-z]+\/\w+\/?(.+\.html)?$/,
      multi: ['nopremium.pl'],
      title: '4shared.com',
      homepage: 'http://www.4shared.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, [' is not valid', ' is unavailable', ' was deleted'], cb, thisArg)
      }
    },
    '4downfiles': {
      pattern: /^https?:\/\/4downfiles?\.com?\/\w+\/?(.+\.html)?$/m,
      multi: [],
      title: '4 Down Files',
      homepage: 'http://4downfiles.co/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    alfafile: {
      pattern: /^https?:\/\/(www\.)?alfafile\.net\/file\/.+$/m,
      multi: ['nopremium.pl'],
      title: 'Alfafile',
      homepage: 'https://alfafile.net',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'error-box', cb, thisArg)
      }
    },
    anonfiles: {
      pattern: /^https?:\/\/anonfiles\.com\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'anonfiles',
      homepage: 'https://anonfiles.com',
      check: function (link, cb, thisArg) {
        rq.add({
          method: 'GET',
          url: 'https://api.anonfiles.com/v2/file/' + encodeURIComponent(link.url.match(/\/\/anonfiles\.com\/(\w+)/)[1]) + '/info',
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            if (result && result.status) {
              // Link is online
              cb.call(thisArg, link, 1)
            } else {
              // Link is offline
              cb.call(thisArg, link, 0)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    ayefiles: {
      pattern: /^https?:\/\/ayefiles\.com\/\w+\/?.*$/m,
      multi: [],
      title: 'AyeFiles',
      homepage: 'https://ayefiles.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    bayfiles: {
      pattern: /^https?:\/\/(www\.)?bayfiles\.(net|com)\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'BayFiles',
      homepage: 'http://bayfiles.com/',
      check: function (link, cb, thisArg) {
        rq.add({
          method: 'GET',
          url: 'https://api.bayfiles.com/v2/file/' + encodeURIComponent(link.url.match(/bayfiles\.(net|com)\/(\w+)/)[2]) + '/info',
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            if (result && result.status) {
              // Link is online
              cb.call(thisArg, link, 1)
            } else {
              // Link is offline
              cb.call(thisArg, link, 0)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    bigfile: {
      pattern: /^https?:\/\/(www\.)?bigfile\.to\/file\/.+\/?.*$/m,
      multi: [],
      title: 'BigFile',
      homepage: 'https://www.bigfile.to/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['errorBox', 'error-box'], cb, thisArg)
      }
    },
    billionuploads: {
      pattern: /^http:\/\/billionuploads\.com\/\w+$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: Billion Uploads',
      homepage: 'http://billionuploads.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    bitshare: {
      pattern: /^https?:\/\/bitshare\.com\/files\/\w+\/.+\.html$/m,
      multi: [],
      title: 'BitShare.com',
      homepage: 'http://bitshare.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    catshare: {
      pattern: /^https?:\/\/(www\.)?catshare\.net\/.+$/m,
      multi: [],
      title: 'Offline: CatShare',
      homepage: 'http://catshare.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    clicknupload: {
      pattern: /^https?:\/\/(www\.)?clicknupload\.(link|org|co|cc|to|club|click)\/\w+\/?.*$/m,
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'ClicknUpload',
      homepage: 'https://clicknupload.co',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File Not Found', 'Error</td>'], cb, thisArg)
      }
    },
    cloudyfiles: {
      pattern: [/^https?:\/\/cloudyfiles\.(me|com|org)\/\w+.*$/m, /^https?:\/\/businessnewsstories\.online\/\w+.*$/m],
      multi: [],
      title: 'Offline: Cloudyfiles.org',
      homepage: 'http://cloudyfiles.org/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    cwtv: {
      pattern: /^https?:\/\/www\.cwtv\.com\/cw-video\/.+$/m,
      multi: [],
      title: 'CW Television Shows',
      homepage: 'http://www.cwtv.com/',
      check: function (link, cb, thisArg) {
        offlineByMatchingFinalUrl(link, /\/cw-video\/$/, cb, thisArg)
      }
    },
    dailymotion: {
      pattern: /^https?:\/\/www\.dailymotion\.com\/video\/\w+.*$/m,
      multi: [],
      title: 'Dailymotion',
      homepage: 'http://www.dailymotion.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'You will be redirected to the homepage', cb, thisArg)
      }
    },
    dailyuploads: {
      pattern: /^https?:\/\/dailyuploads\.net\/\w{8,}\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'Daily Uploads',
      homepage: 'http://dailyuploads.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File Not Found', 'file was removed'], cb, thisArg)
      }
    },
    datafile: {
      pattern: /^https?:\/\/www\.datafile\.com\/d\/\w+.*$/m,
      multi: [],
      title: 'DataFile.com',
      homepage: 'http://www.datafile.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    datei: {
      pattern: /^https?:\/\/(www\.)?datei\.to\/\?\w+$/m,
      multi: [],
      title: 'Offline: datei.to',
      homepage: 'http://datei.to/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    ddownload: {
      pattern: [/^https?:\/\/(www\.)?ddl\.to\/\w+.*$/m, /^https?:\/\/ddownload\.com\/\w+.*$/m],
      multi: ['premiumize.me', 'nopremium.pl'],
      title: 'ddownload.com',
      homepage: 'https://ddl.to/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },

    depositfiles: {
      pattern: [/^https?:\/\/dfiles\.eu\/files\/\w+\/?$/m, /^https?:\/\/depositfiles\.com\/files\/\w+\/?$/m],
      multi: [],
      title: 'DepositFiles',
      homepage: 'http://dfiles.eu',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'no_download_message', cb, thisArg)
      }
    },
    devilshare: {
      pattern: /^https?:\/\/(www\.)?devilshare\.net\/view.+$/m,
      multi: [],
      title: 'Offline: Devilshare.net',
      homepage: 'http://devilshare.net',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    douploads: {
      pattern: /^https?:\/\/(www\.)?douploads\.com\/\w{8}\w+$/m,
      multi: [],
      title: 'DoUploads',
      homepage: 'https://douploads.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File Not Found', 'file was removed'], cb, thisArg)
      }
    },
    dropapk: {
      pattern: [/^https?:\/\/(www\.)?dropapk\.to\/\w+.*$/m, /^https?:\/\/(www\.)?drop.download\/\w+.*$/m],
      multi: ['nopremium.pl'],
      title: 'Dropapk',
      homepage: 'https://dropapk.to/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    earn4files: {
      pattern: /^https?:\/\/(www\.)?earn4files\.com\/\w+.*$/m,
      multi: [],
      title: 'Earn4Files',
      homepage: 'https://earn4files.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    expressleech: {
      pattern: /^https?:\/\/(www\.)?expressleech\.com\/\w+\.html$/m,
      multi: [],
      title: 'ExpressLeech',
      homepage: 'http://expressleech.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fastdown: {
      pattern: [/^https?:\/\/down\.fast-down\.com\/\w+\/?.*$/m, /^https?:\/\/down\.fast-down\.com\/download\d+/m],
      multi: [],
      title: 'Fast-Down',
      homepage: 'https://down.fast-down.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fastclick: {
      pattern: /^https?:\/\/fastclick\.to\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'FastClick.to',
      homepage: 'https://fastclick.to/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fastdrive: {
      pattern: [/^https?:\/\/fastdrive\.io\/\w+\/?.*$/m],
      multi: [],
      title: 'FastDrive',
      homepage: 'https://fastdrive.io/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['Page Not Found', '>404<', 'File Not Found', '>Error<'], cb, thisArg)
      }
    },
    fastshare: {
      pattern: /^https?:\/\/fastshare\.cz\/\d+\/.+$/m,
      multi: ['nopremium.pl'],
      title: 'FastShare.cz',
      homepage: 'https://fastshare.cz/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['This file is no longer available', 'není dostupný', 'nie je dostupný', 'został usunięty'], cb, thisArg)
      }
    },
    faststore: {
      pattern: /^https?:\/\/(www\.)?faststore\.org\/.+$/m,
      multi: [],
      title: 'Fast store',
      homepage: 'http://faststore.org/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, '<b class="err">', cb, thisArg)
      }
    },
    fikper: {
      pattern: /^https?:\/\/fikper\.com\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'Fikper',
      homepage: 'http://fikper.com/',
      check: function (link, cb, thisArg) {
        // Ask fipker API
        rq.add({
          method: 'POST',
          url: 'https://sapi.fikper.com/',
          data: JSON.stringify({
            fileHashName: link.url.match(/fikper\.com\/(\w+)(\/.*)?/)[1]
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          onload: function (response) {
            let result = null
            try {
              result = JSON.parse(response.responseText)
            } catch (e) {
              cb.call(thisArg, link, 0) // Offline
              return
            }
            if ('downloadToken' in result) {
              // Link is online
              cb.call(thisArg, link, 1)
            } else {
              // Unkown response
              cb.call(thisArg, link, -1)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0)
          }
        })
      }
    },
    file: {
      pattern: /^https?:\/\/(www\.)?file\.al\/\w+\/?.*$/m,
      multi: ['premiumize.me'],
      title: 'File.AL',
      homepage: 'https://file.al/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fileboom: {
      pattern: [/^https?:\/\/(www\.)?fileboom\.me\/\w+\/?.*$/m, /^https?:\/\/(www\.)?fboom\.me\/\w+\/?.*$/m],
      multi: [],
      title: 'FileBoom.me',
      homepage: 'http://fileboom.me/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'alert-block', cb, thisArg)
      }
    },
    filecloud: {
      pattern: /^https?:\/\/filecloud\.io\/\w+(\/.*)?$/m,
      multi: [],
      title: 'filecloud.io',
      homepage: 'http://filecloud.io/',
      check: function (link, cb, thisArg) {
        // Ask filecloud API.
        // https://code.google.com/p/filecloud/wiki/CheckFile
        rq.add({
          method: 'POST',
          url: 'http://api.filecloud.io/api-check_file.api',
          data: 'ukey=' + encodeURIComponent(link.url.match(/filecloud\.io\/(\w+)(\/.*)?/)[1]),
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            if (result.status === 'ok') {
              if (result.name) {
                // Link is online
                cb.call(thisArg, link, 1)
              } else {
                // Link is offline
                cb.call(thisArg, link, 0)
              }
            } else {
              cb.call(thisArg, link, -1, 'Strange reply from filecloud API:\n' + response.responseText)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    filefactory: {
      pattern: /^https?:\/\/(www\.)?filefactory\.com\/file\/.+$/m,
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'FileFactory',
      homepage: 'http://www.filefactory.com',
      check: function (link, cb, thisArg) {
        offlineByMatchingFinalUrl(link, /error\.php\?code=/, cb, thisArg)
      }
    },
    fileflares: {
      pattern: /^https?:\/\/fileflares.com\/\w+\/?.*$/m,
      multi: [],
      title: 'Offline: FileFlares.com',
      homepage: 'http://fileflares.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    filefox: {
      pattern: /^https?:\/\/(www\.)?filefox\.cc\/\w+\/?.*$/m,
      multi: [],
      title: 'FileFox.cc',
      homepage: 'https://filefox.cc/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File could not be found', cb, thisArg)
      }
    },
    filejoker: {
      pattern: /^https?:\/\/(www\.)?filejoker\.net\/\w+\/?.*$/m,
      multi: [],
      title: 'FileJoker',
      homepage: 'https://filejoker.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },

    filemonkey: {
      pattern: /^https?:\/\/www.filemonkey.in\/file\/.+$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: Filemonkey.in',
      homepage: 'https://www.filemonkey.in/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    filenext: {
      pattern: /^https?:\/\/www.filenext.com\/\w+\/.*$/m,
      multi: ['nopremium.pl'],
      title: 'Filenext',
      homepage: 'https://www.filenext.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fileload: {
      pattern: /^https:\/\/fileload\.io\/.+$/m,
      multi: [],
      title: 'fileload.io',
      homepage: 'https://fileload.io/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'Not found', cb, thisArg)
      }
    },
    filer: {
      pattern: /^https:\/\/filer\.net\/get\/\w+$/m,
      multi: ['premiumize.me'],
      title: 'filer.net',
      homepage: 'https://filer.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['Datei nicht mehr vorhanden', 'Not available', 'Not found'], cb, thisArg)
      }
    },
    filerice: {
      pattern: /^https:\/\/filerice\.com\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'FileRice.com',
      homepage: 'https://filerice.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    filescdn: {
      pattern: /^https:\/\/filescdn\.com\/.+$/m,
      multi: [],
      title: 'filescdn.com',
      homepage: 'https://filescdn.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'icon-warning text-danger', cb, thisArg)
      }
    },
    fileshark: {
      pattern: /^https?:\/\/(www\.)?fileshark\.pl\/pobierz\/\d+\/\w+\/.*$/m,
      multi: [],
      title: 'Offline: fileshark.pl',
      homepage: 'https://fileshark.pl/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    filespace: {
      pattern: /^https?:\/\/(www\.)?filespace\.com\/\w+\/?$/m,
      multi: ['premiumize.me'],
      title: 'FileSpace',
      homepage: 'http://filespace.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File not found', cb, thisArg)
      }
    },
    filestore: {
      pattern: /^https?:\/\/filestore\.to\/\?d=\w+$/m,
      multi: ['premiumize.me'],
      title: 'Filestore',
      homepage: 'http://filestore.to/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File not found', 'Datei nicht gefunden'], cb, thisArg)
      }
    },
    fileup: {
      pattern: /^https?:\/\/(www\.)?file-up\.org\/\w+\/?$/m,
      multi: [],
      title: 'file-up.org',
      homepage: 'https://file-up.org/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    fileupload: {
      pattern: /^https?:\/\/(www\.)?file-upload\.com\/\w+\/?$/m,
      multi: [],
      title: 'FileUpload',
      homepage: 'https://www.file-upload.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    firedrive: {
      pattern: /^http:\/\/www\.firedrive\.com\/file\/\w+$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: Firedrive',
      homepage: 'http://www.firedrive.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    fireget: {
      pattern: /^https?:\/\/fireget\.com\/\w+\/?.*$/m,
      multi: ['premiumize.me'],
      title: 'Fireget',
      homepage: 'http://fireget.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    freakshare: {
      pattern: /^https?:\/\/freakshare\.com\/files\/\w+\/.+\.html$/m,
      multi: [],
      title: 'FreakShare',
      homepage: 'http://freakshare.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['This file does not exist', 'Dieser Download existiert nicht'], cb, thisArg)
      }
    },
    free: {
      pattern: /^https?:\/\/dl\.free\.fr\/\w+$/m,
      multi: [],
      title: 'Free',
      homepage: 'http://dl.free.fr/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['ERREUR', 'erreur', 'inexistant'], cb, thisArg)
      }
    },
    gboxes: {
      pattern: /^http:\/\/www\.gboxes\.com\/\w+.*$/m,
      multi: [],
      title: 'Offline: Green Boxes',
      homepage: 'http://www.gboxes.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    hexupload: {
      pattern: [/^https?:\/\/(www\.)?hexupload\.net\/\w+.*$/m],
      multi: [],
      title: 'HexUpload',
      homepage: 'https://hexupload.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    hitfile: {
      pattern: [/^https?:\/\/(www\.)?hitfile\.net\/\w+.*$/m, /^https?:\/\/(www\.)?hil\.to\/\w+.*$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'Hitfile.net',
      homepage: 'http://hitfile.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File was deleted or not found', cb, thisArg)
      }
    },
    hugefiles: {
      pattern: /^https?:\/\/hugefiles\.net\/\w+\/?.*$/m,
      multi: [],
      title: 'Offline: HugeFiles.net',
      homepage: 'http://hugefiles.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    inclouddrive: {
      pattern: /^https:\/\/www\.inclouddrive\.com\/file\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: inCLOUDdrive',
      homepage: 'https://www.inclouddrive.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    isra: {
      pattern: /^https:\/\/isra\.cloud\/\w+\/?.*$/m,
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'Isracloud',
      homepage: 'https://isra.cloud/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    katfile: {
      pattern: /^https?:\/\/katfile\.com\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'Katfile.com',
      homepage: 'http://katfile.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['file not found', 'File has been removed', 'File Not Found', 'The file expired', 'Error</h3>'], cb, thisArg)
      }
    },
    keep2share: {
      pattern: [/^https?:\/\/keep2share\.cc\/file\/\w+\/?.*$/m, /^https?:\/\/(spa\.)?k2s\.cc\/file\/\w+\/?.*$/m],
      multi: [],
      title: 'Keep2Share',
      homepage: 'https://keep2share.cc/',
      check: function (link, cb, thisArg) {
        //  https://api.k2s.cc/v1/files/{id}
        const fileid = link.url.match(/file\/(\w+)\//)[1]
        rq.add({
          method: 'GET',
          url: 'https://api.k2s.cc/v1/files/' + fileid,
          onload: function (response) {
            if (response.status === 401) {
              cb.call(thisArg, link, -1, 'Please manually open the keep2share website at least once to initiate a proper session.')
              return
            }
            if (response.status !== 200 || !response.responseText) {
              cb.call(thisArg, link, 0) // Offline
            } else {
              const jdata = JSON.parse(response.responseText)
              if (jdata.id !== fileid) {
                cb.call(thisArg, link, 0) // Offline
                return
              }
              if (jdata.isDeleted) {
                cb.call(thisArg, link, 0) // Offline
                return
              }

              cb.call(thisArg, link, 1) // Online
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    kingfile: {
      pattern: /^https?:\/\/(\w+\.)?kingfile\.pl\/download\/.+$/m,
      multi: [],
      title: 'Offline: kingfile.pl',
      homepage: 'http://kingfile.pl/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    kingfiles: {
      pattern: /^https?:\/\/(www\.)?kingfiles\.net\/\w+.*$/m,
      multi: [],
      title: 'Offline: KingFiles.net',
      homepage: 'http://www.kingfiles.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    letitbit: {
      pattern: /^https?:\/\/(\w+\.)?letitbit\.net\/download\/(\w|\.)+\/.*$/m,
      multi: [],
      title: 'Offline: Letitbit.net',
      homepage: 'http://letitbit.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    lunaticfiles: {
      pattern: /^https?:\/\/lunaticfiles\.com\/\w+\/?.*$/m,
      multi: [],
      title: 'Offline: lunaticfiles.com',
      homepage: 'http://lunaticfiles.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    mediafire: {
      pattern: [/^https?:\/\/www\.mediafire\.com\/?\?.+$/m, /^https?:\/\/www\.mediafire\.com\/download\/.+$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'MediaFire',
      homepage: 'https://www.mediafire.com/',
      check: function (link, cb, thisArg) {
        offlineByMatchingFinalUrl(link, /error\.php/, cb, thisArg)
      }
    },
    mega: {
      pattern: [
        /^https?:\/\/mega\.co\.nz\/#!\w+!*(\w|-|_)*$/m,
        /^https?:\/\/mega\.nz\/#!\w+!*(\w|-|_)*$/m,
        /^https?:\/\/mega\.nz\/file\/(\w|-|_)+#?(\w|-|_)*$/m,
        /^https?:\/\/mega\.nz\/folder\/(\w|-|_)+#?(\w|-|_)*$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'MEGA',
      homepage: 'https://mega.io/',
      check: function (link, cb, thisArg) {
        // Ask mega.co.nz API
        const type = link.url.split('/')[3]
        const id = link.url.split('/')[4].split('#')[0]
        let payload
        if (type === 'folder') {
          payload = { a: 'f', c: 1, r: 1, ca: 1, p: id }
        } else {
          payload = { a: 'g', p: id }
        }

        rq.add({
          method: 'POST',
          url: `https://g.api.mega.co.nz/cs?id=${Math.random().toString().substring(2, 12)}&n=${id}`,
          data: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            if (typeof result === 'number' && result < 0) {
              // Link is offline
              cb.call(thisArg, link, 0)
            } else {
              // Link is online
              cb.call(thisArg, link, 1)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    megaup: {
      pattern: [/^https?:\/\/megaup\.net\/\w+\/?.*$/m],
      multi: ['nopremium.pl'],
      title: 'megaup.net',
      homepage: 'https://megaup.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, '>File not found<', cb, thisArg)
      }
    },
    mexashare: {
      pattern: [/^https?:\/\/(www\.)?mexashare\.com\/\w+\/?.*$/m],
      multi: [],
      title: 'MexaShare',
      homepage: 'http://www.mexashare.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    mdiaload: {
      pattern: [/^https?:\/\/down\.mdiaload\.com\/\w+\/?.*$/m, /^https?:\/\/down\.mdiaload\.com\/download\d+/m],
      multi: [],
      title: 'MdiaLoad',
      homepage: 'https://down.mdiaload.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    mixdrop: {
      pattern: /^https?:\/\/mixdrop\.co\/f\/\w+.*$/m,
      multi: ['nopremium.pl'],
      title: 'MixDrop.co',
      homepage: 'https://mixdrop.co/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['WE ARE SORRY', 'notfound', 'download error'], cb, thisArg)
      }
    },
    mixloads: {
      pattern: /^https?:\/\/mixloads\.com\/\w+.*$/m,
      multi: [],
      title: 'MixLoads.Com',
      homepage: 'https://mixloads.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    modsbase: {
      pattern: [/^https?:\/\/modsbase\.com\/\w+\/?.*$/m],
      multi: ['premiumize.me'],
      title: 'modsbase',
      homepage: 'https://modsbase.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    nitroflare: {
      pattern: [/^https?:\/\/nitroflare\.com\/view\/.+$/m, /^https?:\/\/nitro\.download\/view\/.+$/m],
      multi: ['nopremium.pl'],
      title: 'NitroFlare',
      homepage: 'http://nitroflare.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['be redirect to the main page', ' id="error"'], cb, thisArg)
      }
    },
    novafile: {
      pattern: [/^https?:\/\/(www\.)?novafile\.com\/\w+\/?.*$/m],
      multi: [],
      title: 'Novafile',
      homepage: 'http://novafile.com',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },

    oboom: {
      pattern: /^https?:\/\/www\.oboom\.com\/\w+.*$/m,
      multi: [],
      title: 'OBOOM.com',
      homepage: 'https://www.oboom.com/',
      check: function (link, cb, thisArg) {
        // Ask oboom API.
        rq.add({
          method: 'GET',
          url: 'https://api.oboom.com/1/info?items=' + encodeURIComponent(link.url.match(/oboom\.com\/(\w+)/)[1]),
          onload: function (response) {
            const result = JSON.parse(response.responseText)
            if (result[0] === 200) {
              if (result[1][0].state === 'online') {
                // Link is online
                cb.call(thisArg, link, 1)
              } else {
                // Link is offline
                cb.call(thisArg, link, 0)
              }
            } else {
              cb.call(thisArg, link, -1, 'Strange reply from oboom API:\n' + response.responseText)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    },
    openload: {
      pattern: [/^https?:\/\/openload\.co\/f\/.+$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'Offline: Openload',
      homepage: 'http://openload.co/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    ozofiles: {
      pattern: [/^https?:\/\/ozofiles\.com\/\w+\/.*$/m],
      multi: ['nopremium.pl'],
      title: 'Offline: Ozofiles.com',
      homepage: 'http://ozofiles.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    potload: {
      pattern: /^https?:\/\/potload\.com\/\w+$/m,
      multi: [],
      title: 'Offline: Potload',
      homepage: 'http://potload.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    publish2me: {
      pattern: /^https?:\/\/publish2\.me\/file\/\w+\/?.*$/m,
      multi: [],
      title: 'Publish.me',
      homepage: 'https://publish2.me/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'alert-block', cb, thisArg)
      }
    },
    rapidgator: {
      pattern: [/^https?:\/\/rapidgator\.net\/file\/[^#]+$/m, /^https?:\/\/rg\.to\/file\/[^#]+$/m],
      multi: ['nopremium.pl'],
      title: 'Rapidgator.net',
      homepage: 'http://rapidgator.net/',
      check: function (link, cb, thisArg) {
        offlineByMatchingFinalUrl(link, /article\/premium/, cb, thisArg)
      }
    },
    rapidu: {
      pattern: /^https?:\/\/(\w+\.)?rapidu\.net\/\d+\/.*$/m,
      multi: [],
      title: 'Offline: Rapidu.net',
      homepage: 'https://rapidu.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    rapidrar: {
      pattern: [/^https?:\/\/(\w+\.)?rapidrar\.com\/\w+.*$/m, /^https?:\/\/rapidrar\.(cr|com)\/\w+.*$/m],
      multi: [],
      title: 'RapidRAR',
      homepage: 'https://rapidrar.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    rioupload: {
      pattern: /^https?:\/\/(www\.)?rioupload\.com\/\w+$/m,
      multi: [],
      title: 'RioUpload',
      homepage: 'http://rioupload.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    rockfile: {
      pattern: /^https?:\/\/(www\.)?rockfile\.(eu|co)\/\w+.*$/m,
      multi: [],
      title: 'Offline: Rockfile.co',
      homepage: 'http://rockfile.co',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    rusfolder: {
      pattern: /^https?:\/\/rusfolder\.com\/\d+$/m,
      multi: [],
      title: 'Rusfolder.com',
      homepage: 'http://rusfolder.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File not found.', cb, thisArg)
      }
    },
    salefiles: {
      pattern: /^https?:\/\/salefiles\.com\/\w+\/?.*$/m,
      multi: [],
      title: 'Salefiles',
      homepage: 'http://salefiles.com',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    'share-online': {
      pattern: /^https?:\/\/www\.share-online\.biz\/dl\/\w+$/m,
      multi: [],
      title: 'Share-Online',
      homepage: 'http://www.share-online.biz/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['The requested file is not available', 'Die angeforderte Datei konnte nicht gefunden werden'], cb, thisArg)
      }
    },
    sockshare: {
      pattern: /^http:\/\/www\.sockshare\.com\/file\/\w+$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: SockShare',
      homepage: 'http://www.sockshare.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },

    soundcloud: {
      pattern: /^https?:\/\/soundcloud.com\/(\w|-)+\/(\w|-)+$/m,
      multi: [],
      title: 'SoundCloud',
      homepage: 'https://soundcloud.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, "We can't find that track.", cb, thisArg)
      }
    },
    storebit: {
      pattern: /^https?:\/\/(www\.)?storbit\.net\/file\/.+$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: Storbit.net',
      homepage: 'http://storbit.net',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    spicyfile: {
      pattern: /^https?:\/\/(www\.)?spicyfile\.com\/\w+$/m,
      multi: ['premiumize.me'],
      title: 'spicyfile.com',
      homepage: 'http://spicyfile.com',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    streamcloud: {
      pattern: /^https?:\/\/streamcloud\.eu\/\w+$/m,
      multi: [],
      title: 'Offline: Streamcloud',
      homepage: 'http://streamcloud.org/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    streamin: {
      pattern: /^https?:\/\/streamin\.to\/.+$/m,
      multi: [],
      title: 'Offline: Streamin.to',
      homepage: 'http://streamin.to/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    streamtape: {
      pattern: /^https?:\/\/streamtape\.com\/\w\/\w{5,}.+$/m, // https://streamtape.com/v/AJW7RqA2mlFXlLp/How.to.Sell.Drugs.Online.Fast.S03E01.DUBBED.WEBRip.x264-ION10.mp4
      multi: [],
      title: 'streamtape.com',
      homepage: 'https://streamtape.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['not found!', 'not found '], cb, thisArg)
      }
    },
    subyshare: {
      pattern: /^https?:\/\/subyshare\.com\/\w+\/?.*$/m,
      multi: [],
      title: 'Subyshare.com',
      homepage: 'http://subyshare.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    suprafiles: {
      pattern: [/^https?:\/\/suprafiles\.(me|net|org)\/\w+\/?.*$/m, /^https?:\/\/srfiles\.com\/\w+\/?.*$/m],
      multi: [],
      title: 'Offline: Suprafiles',
      homepage: 'http://suprafiles.org/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    turbobit: {
      pattern: [/^https?:\/\/turbobit\.net\/\w+.*\.html$/m, /^https?:\/\/turb\.(to|cc)\/\w+.*\.html$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'turbobit.net',
      homepage: 'http://turbobit.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File not found', 'File was not found'], cb, thisArg)
      }
    },
    tusfiles: {
      pattern: /^https?:\/\/(www\.)?tusfiles\.net\/\w+$/m,
      multi: ['nopremium.pl'],
      title: 'TusFiles',
      homepage: 'http://tusfiles.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'The file you are trying to download is no longer available', cb, thisArg)
      }
    },
    ubiqfile: {
      pattern: /^https?:\/\/ubiqfile\.com\/\w+$/m,
      multi: ['premiumize.me'],
      title: 'ubiqfile',
      homepage: 'http://ubiqfile.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    unibytes: {
      pattern: /^https?:\/\/www\.unibytes\.com\/\w+-\w+$/m,
      multi: [],
      title: 'Offline: Unibytes.com',
      homepage: 'http://www.unibytes.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    unlimitzone: {
      pattern: /^https?:\/\/unlimitzone\.com\/\w+.*$/m,
      multi: [],
      title: 'Unlimit Zone',
      homepage: 'http://unlimitzone.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    up07: {
      pattern: /^https?:\/\/up07\.net\/\w+$/m,
      multi: [],
      title: 'up07.net',
      homepage: 'http://up07.net/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    upera: {
      pattern: /^https?:\/\/public\.upera\.co\/\w+$/m,
      multi: [],
      title: 'Upera',
      homepage: 'http://public.upera.co/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'Invalid or Deleted File', cb, thisArg)
      }
    },
    uploadable: {
      pattern: /^https?:\/\/www\.uploadable\.ch\/file\/\w+\/(\w|-|\.)+$/m,
      multi: [],
      title: 'Offline: Uploadable.ch',
      homepage: 'http://www.uploadable.ch/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    uploadac: {
      pattern: [/^https?:\/\/upload\.ac\/\w+\/?.*$/m, /^https?:\/\/uplod\.io\/\w+\/?.*$/m],
      multi: [],
      title: 'Upload.ac',
      homepage: 'https://upload.ac/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'No File Found', cb, thisArg)
      }
    },
    uploadboy: {
      pattern: [/^https?:\/\/(www\.)?uploadboy\.com\/\w+\.html$/m, /^https?:\/\/uploadboy\.(me|com)\/\w+\/?.*$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'Uploadboy.com',
      homepage: 'http://uploadboy.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File Not Found', 'not be found', 'File not found'], cb, thisArg)
      }
    },
    uploaded: {
      pattern: [/^https?:\/\/uploaded\.(net|to)\/file\/.+$/m, /^https?:\/\/ul\.to\/.+$/m],
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'uploaded.net',
      homepage: 'http://uploaded.net/',
      check: function (link, cb, thisArg) {
        // offlineByMatchingFinalUrl(link,[/uploaded\.net\/404/,/uploaded\.net\/410/], cb, thisArg);
        offlineByFindingString(link, 'Error: ', cb, thisArg)
      }
    },
    uploadgig: {
      pattern: /^https?:\/\/uploadgig\.com\/file\/download\/\w+\/?.*$/m,
      multi: ['nopremium.pl'],
      title: 'UploadGIG',
      homepage: 'https://uploadgig.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File not found', cb, thisArg)
      }
    },
    uploadingcom: {
      pattern: /^https?:\/\/uploading\.com\/\w+\/?.*$/m,
      multi: [],
      title: 'Offline: Uploading.com',
      homepage: 'http://uploading.com/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    uploading: {
      pattern: /^https?:\/\/(www\.)?uploading\.site\/\w+.*$/m,
      multi: [],
      title: 'Offline: Uploading.site',
      homepage: 'http://uploading.site/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    uploadocean: {
      pattern: /^https?:\/\/uploadocean\.com\/\w+$/m,
      multi: [],
      title: 'UploadOcean',
      homepage: 'http://uploadocean.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'deleted.png"', cb, thisArg)
      }
    },
    uploadon: {
      pattern: /^https?:\/\/uploadon\.me\/\w+\.html$/m,
      multi: [],
      title: 'Uploadon.me',
      homepage: 'http://uploadon.me/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File not found', 'This page was not found'], cb, thisArg)
      }
    },
    uploadrocket: {
      pattern: /^https?:\/\/uploadrocket\.net\/\w+(\/|\w|-|\.)+(\.html)?$/m,
      multi: [],
      title: 'Offline: UploadRocket.net',
      homepage: 'http://uploadrocket.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    uppit: {
      pattern: /^https?:\/\/uppit\.com\/\w+(\/.*)?$/m,
      multi: [],
      title: 'UppIT',
      homepage: 'http://uppit.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    uptobox: {
      pattern: /^https?:\/\/uptobox.com\/\w+(\/.*)?$/m,
      multi: ['nopremium.pl'],
      title: 'Uptobox',
      homepage: 'http://uptobox.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, '<span class="para_title">File not found', cb, thisArg)
      }
    },
    userscloud: {
      pattern: /^https?:\/\/userscloud\.com\/\w+.*$/m,
      multi: ['premiumize.me'],
      title: 'Userscloud',
      homepage: 'https://userscloud.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['label-danger', 'The file is no longer available', 'no longer available'], cb, thisArg)
      }
    },
    usersdrive: {
      pattern: /^https?:\/\/usersdrive\.com\/\w+.*$/m,
      multi: [],
      title: 'Usersdrive',
      homepage: 'https://usersdrive.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    vevo: {
      pattern: /^https?:\/\/www\.vevo\.com\/watch\/.+$/m,
      multi: [],
      title: 'VEVO',
      homepage: 'https://www.vevo.com/',
      check: function (link, cb, thisArg) {
        // At the moment there seems to be no straightforward way to get the online/offline status
        cb.call(thisArg, link, 1) // Online
      }
    },
    vidlox: {
      pattern: /^https?:\/\/vidlox\.me\/\w+.*$/m,
      multi: [],
      title: 'Offline: vidlox.me',
      homepage: 'https://vidlox.me/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    vidoza: {
      pattern: /^https?:\/\/vidoza\.org\/\w+.*$/m,
      multi: ['nopremium.pl'],
      title: 'vidoza.org',
      homepage: 'https://vidoza.org/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, ['File Not Found', 'file was deleted', 'File was deleted', 'Video is processing now'], cb, thisArg)
      }
    },
    vidto: {
      pattern: /^https?:\/\/vidto\.me\/\w+\.?\w*$/m,
      multi: ['nopremium.pl'],
      title: 'Offline: vidto.me',
      homepage: 'http://vidto.me/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    vimeo: {
      pattern: /^https?:\/\/vimeo\.com\/(.+\/)?\d+\/?$/m,
      multi: [],
      title: 'Vimeo',
      homepage: 'https://vimeo.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'Page not found', cb, thisArg)
      }
    },
    vipfile: {
      pattern: /^https?:\/\/(\w+.)?vip-file.(com|net)\/downloadlib\/.*$/m,
      multi: [],
      title: 'Offline: VIP-file',
      homepage: 'http://vip-file.net/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    vishare: {
      pattern: /^https:\/\/(\w+.)?vishare.pl\/\w{10,}\/.*$/m,
      multi: [],
      title: 'Offline: Vishare',
      homepage: 'https://vishare.pl/',
      check: function (link, cb, thisArg) {
        permanentlyoffline(link, cb, thisArg)
      }
    },
    wdupload: {
      pattern: /^https?:\/\/www\.wdupload\.com\/file\/\w+\/?.*$/m,
      multi: ['premiumize.me'],
      title: 'wdupload.com',
      homepage: 'http://wdupload.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'file-error', cb, thisArg)
      }
    },
    worldbytez: {
      pattern: /^https?:\/\/worldbytez\.com\/\w+$/m,
      multi: ['premiumize.me'],
      title: 'worldbytez.com',
      homepage: 'https://worldbytez.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    wrzucajpliki: {
      pattern: /^https?:\/\/wrzucajpliki\.pl\/\w{0,6}.*$/m,
      multi: ['premiumize.me'],
      title: 'wrzucajpliki.pl',
      homepage: 'http://wrzucajpliki.pl/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    xubster: {
      pattern: /^https?:\/\/(www\.)?xubster\.com\/\w+\/?.*$/m,
      multi: ['premiumize.me'],
      title: 'xubster.com',
      homepage: 'https://xubster.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, 'File Not Found', cb, thisArg)
      }
    },
    youtube: {
      pattern: /^https?:\/\/www\.youtube\.com\/watch(\?v=|\/).+$/m,
      multi: ['nopremium.pl'],
      title: 'YouTube',
      homepage: 'https://www.youtube.com/',
      check: function (link, cb, thisArg) {
        offlineByFindingString(link, '<title>YouTube</title>', cb, thisArg)
      }
    },
    zippyshare: {
      pattern: /^https?:\/\/www\d*\.zippyshare\.com\/v\/\w+\/file\.html$/m,
      multi: ['nopremium.pl', 'premiumize.me'],
      title: 'Zippyshare.com',
      homepage: 'http://www.zippyshare.com/',
      check: function (link, cb, thisArg) {
        onlineByFindingString(link, 'does not exist', cb, thisArg)
        const s = ['does not exist']
        rq.add({
          method: 'GET',
          url: link.url,
          onprogress: function (response) {
            // abort download of big files
            if ((Math.max(response.loaded, response.total) / 1024) > MAXDOWNLOADSIZE) {
              this.__result.abort()
              cb.call(thisArg, link, 1) // Let's assume big files are online
            }
          },
          onload: function (response) {
            for (let i = 0; i < s.length; i++) {
              if (response.responseText.indexOf(s[i]) !== -1) {
                cb.call(thisArg, link, 0) // Offline
                return
              }
            }
            if (response.status === 403) { // Blocked
              cb.call(thisArg, link, -1, 'Blocked in your region')
              // Blocked in your region
              // Try with https://unblockweb.one/
              return offlineByFindingString(link, s, cb, thisArg, `https://unblockweb.one/?cdURL=${encodeURIComponent(link.url)}`)
            } else if (response.status < 400) { // Online 2xx
              cb.call(thisArg, link, 1)
            } else if (response.status > 499) { // Server error 5xx (server error)
              cb.call(thisArg, link, -1, 'Server error: ' + response.status + ' ' + response.statusText)
            } else {
              cb.call(thisArg, link, 0) // Offline 4xx (client error)
            }
          },
          onerror: function (response) {
            cb.call(thisArg, link, 0) // Offline
          }
        })
      }
    }
  }
}
