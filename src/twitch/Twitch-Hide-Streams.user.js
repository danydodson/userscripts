// ==UserScript==
// @name         Twitch: Hide Streams
// @description  Blocks content that you don't want to see on twitch.tv, such as channels, games, videos etc.
// @namespace    Nonce Scripts
// @author       LinogeFly
// @version      1.4.2
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @require      https://www.promisejs.org/polyfills/promise-7.0.4.min.js
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @match        http://*.twitch.tv/*
// @match        https://*.twitch.tv/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// ==/UserScript==

// jQuery init (for Greasemonkey)
this.$ = this.jQuery = jQuery.noConflict(true)

// Constants

var husot = husot || {}

husot.constants = husot.constants || {}
husot.constants.blockedChannelsSettingsKey = 'blockedChannels'
husot.constants.blockedGamesSettingsKey = 'blockedGames'
husot.constants.blockedChannelsListEmpty = 'No Blocked Channels'
husot.constants.blockedGamesListEmpty = 'No Blocked Games'
husot.constants.modalDialogShowingSpeed = 150
husot.constants.allowedUrls = [
  '^https?:\/\/([a-zA-Z]+\.)?twitch.tv\/directory.*$'
]
husot.constants.blockedItemType = husot.constants.blockedItemType || {}
husot.constants.blockedItemType.game = 'game'
husot.constants.blockedItemType.channel = 'channel'

// DOM Listener module

husot.domListener = husot.domListener || {}

husot.domListener = (function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver
  var observer = new MutationObserver(function (mutations) {
    // Don't process page if its URL is not allowed
    if (!isUrlAllowed(document.URL)) {
      return
    }

    modifyThumbs(mutations, husot.thumbs.streamThumbsManager)
    modifyThumbs(mutations, husot.thumbs.gameThumbsManager)
  })

  function start() {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  function stop() {
    observer.disconnect()
  }

  function modifyThumbs(mutations, thumbsManager) {
    // Process thumbs if they were added to the DOM
    if (!isThumbsAdded(mutations, thumbsManager.getDomListnerThumbSelector())) { return }

    // Add overlay menu
    stop()
    thumbsManager.addThumbOverlays()
    start()

    // Hide blocked thumbs
    thumbsManager.hideThumbs()
  }

  function isUrlAllowed(url) {
    return husot.constants.allowedUrls.some(function (item) {
      return (new RegExp(item)).test(decodeURIComponent(url))
    })
  }

  function isThumbsAdded(mutations, selector) {
    return mutations.some(function (item) {
      return $(item.addedNodes).find(selector).filter(function () {
        // Check that thumbnail is hidden explicitly and not because an ancestor element is hidden
        return $(this).css('display') !== 'none'
      }).length !== 0
    })
  }

  return {
    start: start,
    isUrlAllowed: isUrlAllowed
  }
})()

// Exceptions

husot.exceptions = husot.exceptions || {}

husot.exceptions.abstractFunctionCall = function () {
  return 'Cannot call abstract function'
}

husot.exceptions.notImplemented = function () {
  return 'Method or operation is not implemented'
}

husot.exceptions.argumentNullOrEmpty = function (argumentName) {
  return 'Argument "{0}" is undefined or empty'.format(argumentName)
}

husot.exceptions.argumentOneElementExpected = function (argumentName) {
  return 'More than one element in argument "{0}"'.format(argumentName)
}

husot.exceptions.elementNotFound = function (elementName) {
  return '{0} not found. CSS selector must be broken.'.format(elementName)
}

husot.exceptions.elementNotFoundFor = function (elementName, forName) {
  return '{0} not found for {1}. CSS selector must be broken.'.format(elementName, forName)
}

// Helper functions

if (!String.format) {
  String.prototype.format = function () {
    var args = arguments
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
};

if (!String.trimSlash) {
  String.prototype.trimSlash = function () {
    return this.replace(/^\/|\/$/g, '')
  }
};

// HTML Templates
// TODO: Move into separate files

husot.htmlLayout = husot.htmlLayout || {}

husot.htmlLayout.streamOverlay = '\
    <div class="husot-thumbOverlay" onclick="return false;">\
        <ul class="husot-thumbOverlay-menu">\
            <li><a class="husot-blockStreamBtn" href="javascript:void(0);">Ban</a></li>\
            <li class="husot-thumbOverlay-menu-separator"> | </li>\
            <li><a class="husot-showSettingsBtn" href="javascript:void(0);">Settings</a></li>\
        </ul>\
    </div>'

husot.htmlLayout.settingsWindow = '\
    <div class="husot-settings husot-modalWindow">\
        <ul class="husot-settings-nav">\
            <li class="husot-settings-nav-item">\
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedChannelsList">Blocked Channels</a>\
            </li>\
            <li class="husot-settings-nav-item">\
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedGamesList">Blocked Games</a>\
            </li>\
        </ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedChannelsList"></ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedGamesList"></ul>\
        <div class="husot-settings-footer">\
            <a class="husot-modalClose husot-button" href="javascript:void(0);">Close</a>\
        </div>\
    </div>'

husot.htmlLayout.modalDialogOverlay = '<div class="husot-modalOverlay"></div>'

husot.htmlLayout.blockedListItem = '\
    <li class="husot-settings-blockedList-item">\
        <div class="husot-settings-blockedList-item-name">{0}</div>\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Unblock</a>\
    </li>'

husot.htmlLayout.blockedListItemEmpty = '<li><div class="husot-settings-blockedList-item-empty">{0}</div></li>'

// Log manager

husot.log = husot.log || {}

husot.log.info = function (obj) {
  console.log('HUSOT: ' + obj)
}

husot.log.error = function (obj) {
  console.error('HUSOT: ' + obj)
}

husot.log.debug = function (obj) {
  if (typeof husot.debug === 'undefined') {
    return
  }

  console.log('HUSOT DEBUG: ' + obj)
}

// Modal Dialog module

husot.modalDialog = husot.modalDialog || {}

husot.modalDialog = (function () {
  function initOverlay() {
    if ($('.husot-modalOverlay').length) {
      return
    }

    var $overlay = $(husot.htmlLayout.modalDialogOverlay)
    $overlay.click(close)
    $(document.body).append($overlay)
  }

  function create($modalWindow) {
    $modalWindow.click(function (event) {
      event.stopPropagation()
    })
    $modalWindow.find('.husot-modalClose').click(close)
    $('.husot-modalOverlay').append($modalWindow)
  }

  function show($modalWindow) {
    $('.husot-modalOverlay').fadeIn(husot.constants.modalDialogShowingSpeed)
    $modalWindow.fadeIn({ queue: false, duration: husot.constants.modalDialogShowingSpeed })
    $modalWindow.animate({ 'margin-top': '40px' }, husot.constants.modalDialogShowingSpeed)
  }

  function close(event) {
    $('.husot-modalOverlay').fadeOut(husot.constants.modalDialogShowingSpeed)
    var $modalWindow = $('.husot-modalWindow')
    $modalWindow.fadeOut(husot.constants.modalDialogShowingSpeed)
    $modalWindow.animate({ 'margin-top': '50px' }, husot.constants.modalDialogShowingSpeed)
  }

  return {
    initOverlay: initOverlay,
    create: create,
    show: show,
    close: close,
  }
})()

// Inject javaScript into main window

husot.injector = husot.injector || {}

husot.injector.addScripts = function () {
  var script = document.createElement('script')
  script.textContent = document.addEventListener('husot.loadMoreThumbs', function () { $('[data-target="directory-container"]').trigger('scroll') });
  (document.head || document.documentElement).appendChild(script)
  script.parentNode.removeChild(script)
}

// Application settings

husot.settings = husot.settings || {}

husot.settings.BlockedItems = function (settingsKey) {
  this._settingsKey = settingsKey
  this._blockedItems // For caching
}

husot.settings.BlockedItems.prototype = {
  _get: function (name, callback) {
    this.list(function (items) {
      var $item = $.grep(items, function (x) { return x === name })

      if (!$item.length) {
        callback()
      } else {
        callback($item[0])
      }
    })
  },
  add: function (name, callback) {
    var self = this,
      start = new Date().getTime()

    // Initial checks
    if (typeof name === 'undefined' || name === '') {
      return
    }

    husot.log.debug('husot.settings.BlockedItems.add() starts')
    self._get(name, function (item) {
      // Don't process if already in the list
      if (typeof item !== 'undefined') {
        callback()
        return
      }

      // Add to the list
      self.list(function (items) {
        items.push(name)

        husot.settings.setValue(self._settingsKey, JSON.stringify(items), function () {
          // Invalidate cached list of blocked items
          self._blockedItems = undefined

          husot.log.debug('husot.settings.BlockedItems.add() ends after {0} ms'.format((new Date().getTime()) - start))

          callback()
        })
      })
    })
  },
  remove: function (name, callback) {
    var self = this

    // Initial checks
    if (typeof name === 'undefined' || name === '') {
      callback()
      return
    }

    this._get(name, function (item) {
      // Don't process if not in the list
      if (typeof item === 'undefined') {
        callback()
        return
      }

      // Remove from the list
      self.list(function (items) {
        var index = $.inArray(item, items)
        items.splice(index, 1)
        husot.settings.setValue(self._settingsKey, JSON.stringify(items), function () {
          // Invalidate cached list of blocked items
          self._blockedItems = undefined

          callback()
        })
      })
    })
  },
  list: function (callback) {
    var self = this,
      start = new Date().getTime()

    if (typeof self._blockedItems === 'undefined') {
      husot.log.debug('husot.settings.BlockedItems.list() starts')
      husot.settings.getValue(self._settingsKey, '[]', function (item) {
        // Convert to JSON
        var items = JSON.parse(item)

        items = items.map(function (x) {
          // Backward compatibility
          // Previously, items were stored not as array of strings but as objects with 'name' property.
          // So trying to fetch 'name' property first.
          if (typeof x.name !== 'undefined') {
            return x.name
          }

          return x
        })

        // Sort by name alphabetically
        items.sort(function (a, b) {
          return a.localeCompare(b)
        })

        // Save in cache
        self._blockedItems = items

        husot.log.debug('husot.settings.BlockedItems.list() ends after {0} ms'.format((new Date().getTime()) - start))

        // Return
        if (typeof callback !== 'undefined') {
          callback(self._blockedItems)
        }
      })
    } else {
      if (typeof callback !== 'undefined') {
        callback(self._blockedItems)
      }
    }
  }
}

// Settings UI

husot.settings = husot.settings || {}
husot.settings.ui = husot.settings.ui || {}

// class Tab

husot.settings.ui.Tab = function ($blockedList, blockedItemsManager, emptyText, thumbsManager) {
  this._$blockedList = $blockedList
  this._blockedItemsManager = blockedItemsManager
  this._emptyText = emptyText
  this._thumbsManager = thumbsManager
}

husot.settings.ui.Tab.prototype = (function () {
  return {
    _unblockBtn_onClick: function (self, sender) {
      var $sender = $(sender)
      var $blockedListItem = $sender.closest('.husot-settings-blockedList-item')
      var name = $blockedListItem.find('.husot-settings-blockedList-item-name').text()

      self._blockedItemsManager.remove(name, function () {
        self.loadBlockedItems()

        self._thumbsManager.showThumbs(name)
      })
    },
    loadBlockedItems: function () {
      var self = this
      this._blockedItemsManager.list(function (items) {
        self._$blockedList.empty()

        if (items.length === 0) {
          self._$blockedList.append(husot.htmlLayout.blockedListItemEmpty.format(self._emptyText))
          return
        }

        items.forEach(function (item) {
          var $blockedListItem = $(husot.htmlLayout.blockedListItem.format(item))
          var $unblockBtn = $('.husot-settings-blockedList-item-unblockBtn', $blockedListItem)
          $unblockBtn.click(function () {
            self._unblockBtn_onClick(self, this)
          })
          self._$blockedList.append($blockedListItem)
        })
      })
    },
    activate: function () {
      husot.settings.ui.activateTab(this._$blockedList.attr('id'))
    }
  }
})()

// class Window

husot.settings.ui.Window = function () {
  var create = function () {
    var $settingsWindow = $(husot.htmlLayout.settingsWindow)
    $('.husot-settings-nav-item-name', $settingsWindow).click(navItem_onClick)
    husot.modalDialog.create($settingsWindow)
  }

  // Event handlers for switching content of the tabs
  var navItem_onClick = function () {
    var tabId = $(this).attr('data-husot-contentPanelId')
    husot.settings.ui.activateTab(tabId)
  }

  // Class initialization

  create()

  this._blockedChannelsTab = new husot.settings.ui.Tab(
    $('#husot-settings-blockedChannelsList'),
    husot.settings.blockedChannels,
    husot.constants.blockedChannelsListEmpty,
    husot.thumbs.streamThumbsManager
  )

  this._blockedGamesTab = new husot.settings.ui.Tab(
    $('#husot-settings-blockedGamesList'),
    husot.settings.blockedGames,
    husot.constants.blockedGamesListEmpty,
    husot.thumbs.gameThumbsManager
  )
}

husot.settings.ui.Window.prototype = {
  init: function (blockedItemType) {
    // Load tab content
    this._blockedChannelsTab.loadBlockedItems()
    this._blockedGamesTab.loadBlockedItems()

    // Activate tab
    if (typeof blockedItemType === 'undefined' || blockedItemType === '') {
      return
    }
    if (blockedItemType === husot.constants.blockedItemType.channel) {
      this._blockedChannelsTab.activate()
      return
    }
    if (blockedItemType === husot.constants.blockedItemType.game) {
      this._blockedGamesTab.activate()
      return
    }

    throw Error('Unknown blockedItemType')
  }
}

// Helper static functions

husot.settings.ui.activateTab = function (tabId) {
  // Hide all tabs
  $('.husot-settings-blockedList').hide()
  $('.husot-settings-nav-item-name').removeClass('husot-settings-nav-item-name-active')

  // Show active tab
  var $tabHeader = $('.husot-settings-nav-item-name[data-husot-contentPanelId={0}]'.format(tabId))
  var $tab = $('#{0}'.format(tabId))
  $tab.show()
  $tabHeader.addClass('husot-settings-nav-item-name-active')
}

// Video Thumbnails module

husot.thumbs = husot.thumbs || {}

// abstract class ThumbsManagerBase

husot.thumbs.ThumbsManagerBase = function () {
}

husot.thumbs.ThumbsManagerBase.prototype = {
  _getContainerJQuery: function () {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  _getThumbJQuery: function () {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  _addThumbOverlay: function ($thumb) {
    var self = this

    // Initial checks
    if ($thumb.find('.husot-thumbOverlay').length) {
      return
    };

    // Add overlay
    var $thumbOverlay = $(husot.htmlLayout.streamOverlay)
    $thumb.append($thumbOverlay)

    // Add event handlers for overlay buttons
    $thumbOverlay.find('.husot-blockStreamBtn').click(function (event) {
      event.stopPropagation()
    })
    $thumbOverlay.find('.husot-blockStreamBtn').click(function () {
      self._blockBtn_onClick(self, this)
    })
    $thumbOverlay.find('.husot-showSettingsBtn').click(function (event) {
      event.stopPropagation()
    })
    $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
      self._showSettingsBtn_onClick(self, this)
    })

    // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
    $thumb.hover(function () {
      $thumbOverlay.show()
    }, function () {
      $thumbOverlay.hide()
    })
  },
  _blockBtn_onClick: function (self, sender) {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  _showSettingsBtn_onClick: function (self, sender) {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  // Triggers "infinite scroll" feature on Twitch to load more stream/video thumbnails
  // in order to make sure that page it is filled with new thumbnails after some thumbnails were hidden.
  _loadMoreThumbs: function () {
    husot.log.debug('Triggering "infinite scroll" to load more thumbs')

    // Raise injected custom event that triggers "infinite scroll" feature on Twitch.
    var event = document.createEvent('Event')
    event.initEvent('husot.loadMoreThumbs', true, true)
    document.dispatchEvent(event)
  },
  _notifyAboutHiddenThumbs: function (count) {
    // Initial checks
    if (count === 0) { return }

    husot.log.info('{0} thumbnail{1} {2} hidden'.format(
      count,
      (count > 1 ? 's' : ''),
      (count > 1 ? 'were' : 'was')
    ))
  },
  _notifyAboutShownThumbs: function (count) {
    // Initial checks
    if (count === 0) { return }

    husot.log.info('{0} thumbnail{1} {2} shown'.format(
      count,
      (count > 1 ? 's' : ''),
      (count > 1 ? 'were' : 'was')
    ))
  },
  getDomListnerThumbSelector: function () {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  addThumbOverlays: function () {
    var self = this

    // Initial checks
    var $thumbs = self._getThumbJQuery()
    if (!$thumbs.length) { return }

    $thumbs.each(function () {
      self._addThumbOverlay($(this))
    })
  },
  hideThumbs: function () {
    throw Error(husot.exceptions.abstractFunctionCall())
  },
  showThumbs: function (name) {
    throw Error(husot.exceptions.abstractFunctionCall())
  }
}

// class StreamThumbsManager: ThumbsManagerBase

husot.thumbs.StreamThumbsManager = function () {
  husot.thumbs.ThumbsManagerBase.call(this)
}

husot.thumbs.StreamThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype)
husot.thumbs.StreamThumbsManager.prototype.constructor = husot.thumbs.StreamThumbsManager

husot.thumbs.StreamThumbsManager.prototype.getDomListnerThumbSelector = function () {
  return '[data-test-selector="preview-card-titles__primary-link"]'
}

husot.thumbs.StreamThumbsManager.prototype._getContainerJQuery = function () {
  return $('.tw-tower > [style^="order: "]')
}

husot.thumbs.StreamThumbsManager.prototype._getThumbJQuery = function () {
  return $('.tw-tower > [style^="order: "]').find('.preview-card > .tw-relative')
}

husot.thumbs.StreamThumbsManager.prototype._getGameName = function ($thumbContainer) {
  var self = this

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }

  var $game = $thumbContainer.find('[href^="/directory/game/"]')
    .filter(function () {
      // Check that game thumbnail is hidden explicitly and not because an ancestor element is hidden
      return $(this).css('display') !== 'none'
    })

  if (!$game.length) {
    return ''
  }

  return $game.text()
}

husot.thumbs.StreamThumbsManager.prototype._getChannelName = function ($thumbContainer) {
  var self = this

  var map = [
    {
      urls: [
        '^https?:\/\/([a-zA-Z]+\.)?twitch.tv\/directory\/all.*$'
      ],
      name: function () {
        return $thumbContainer.find('[data-test-selector="preview-card-titles__primary-link"]').attr('href').trimSlash()
      }
    },
    // Default (should be the last one)
    {
      name: function () {
        return $thumbContainer.find('[data-test-selector="preview-card-titles__primary-link"]').attr('href').trimSlash()
      }
    }
  ]

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }

  return self._getChannelNameForUrl(map)
}

husot.thumbs.StreamThumbsManager.prototype._getChannelNameForUrl = function (map) {
  var result

  map.forEach(function (item) {
    if (result) { // Selector has been found already
      return
    };

    if (!item.urls) { // Gets default selector that doesn't have URLs
      result = item.name()
      return
    };

    var isMatch = item.urls.some(function (url) {
      return (new RegExp(url)).test(decodeURIComponent(document.URL))
    })

    if (isMatch) {
      result = item.name()
      return
    }
  })

  if (typeof result === 'undefined') {
    throw Error('CSS selector for "Channel name" not found.')
  }

  return result
}

husot.thumbs.StreamThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
  husot.settings.ui.window.init(husot.constants.blockedItemType.channel)
  husot.modalDialog.show($('.husot-settings'))
}

husot.thumbs.StreamThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
  var $sender = $(sender)

  var $thumbContainer = $sender.closest(self._getContainerJQuery())

  // Initial checks
  if (!$thumbContainer.length) {
    throw Error(husot.exceptions.elementNotFound('Thumb container'))
  };

  var name = self._getChannelName($thumbContainer)

  husot.settings.blockedChannels.add(name, function () {
    self._hideThumbs(name)
    self._loadMoreThumbs()
  })
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbs = function (name) {
  var self = this

  var $thumbContainers = self._getThumbContainersForChannel(name).filter(':visible')

  // Initial checks
  if (!$thumbContainers.length) {
    throw Error(husot.exceptions.elementNotFoundFor('Thumb container', '"{0}" channel'.format(name)))
  };

  $thumbContainers.hide()
  self._notifyAboutHiddenThumbs($thumbContainers.length)
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainersForChannel = function (name) {
  var self = this

  var $thumbContainers = self._getContainerJQuery()

  // No stream thumbs on the page
  if (!$thumbContainers.length) {
    return $()
  }

  return $thumbContainers.filter(function () {
    var $this = $(this)
    var channelName = self._getChannelName($this)

    return channelName.toLowerCase() === name.toLowerCase()
  })
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainersForGame = function (name) {
  var self = this

  var $thumbContainers = self._getContainerJQuery()

  // No stream thumbs on the page
  if (!$thumbContainers.length) {
    return $()
  }

  return $thumbContainers.filter(function () {
    var $this = $(this)
    var gameName = self._getGameName($this)

    return gameName.toLowerCase() === name.toLowerCase()
  })
}

husot.thumbs.StreamThumbsManager.prototype._isThumbMustBeHiddenForChannel = function ($thumbContainer, blockedChannels) {
  var self = this

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }
  if ($thumbContainer.length !== 1) {
    throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'))
  }

  var channelName = self._getChannelName($thumbContainer)

  return blockedChannels.some(function (item) {
    return channelName.toLowerCase() === item.toLowerCase()
  })
}

husot.thumbs.StreamThumbsManager.prototype._isThumbMustBeHiddenForGame = function ($thumbContainer, blockedGames) {
  var self = this

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }
  if ($thumbContainer.length !== 1) {
    throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'))
  }

  var gameName = self._getGameName($thumbContainer)
  if (typeof gameName === 'undefined' || gameName === '') { // Game name is optional in this manager
    return false
  }

  return blockedGames.some(function (item) {
    return gameName.toLowerCase() === item.toLowerCase()
  })
}

husot.thumbs.StreamThumbsManager.prototype.hideThumbs = function () {
  var self = this

  var start = new Date().getTime()
  husot.log.debug('StreamThumbsManager.hideThumbs() starts')

  // Load block lists for channels and games
  var blockedChannelsPromise = new Promise(function (resolve, reject) {
    husot.settings.blockedChannels.list(function (items) {
      resolve(items)
    })
  })
  var blockedGamesPromise = new Promise(function (resolve, reject) {
    husot.settings.blockedGames.list(function (items) {
      resolve(items)
    })
  })

  // Hide thumbnails after block lists are loaded
  Promise.all([blockedChannelsPromise, blockedGamesPromise]).then(function (values) {
    var blockedChannels = values[0]
    var blockedGames = values[1]

    // Get visible thumbs
    var $thumbContainers = self._getContainerJQuery().filter(':visible')

    // Enumerate visible thumbs and hide those that must be hidden
    var hiddenThumbsCount = 0
    $thumbContainers.each(function () {
      var $item = $(this)

      // Hide for channels
      if (self._isThumbMustBeHiddenForChannel($item, blockedChannels)) {
        $item.hide()
        hiddenThumbsCount++
        return
      }

      // Hide for games
      if (self._isThumbMustBeHiddenForGame($item, blockedGames)) {
        $item.hide()
        hiddenThumbsCount++
        return
      }
    })

    if (hiddenThumbsCount > 0) {
      self._notifyAboutHiddenThumbs(hiddenThumbsCount)
      self._loadMoreThumbs()
    }

    husot.log.debug('StreamThumbsManager.hideThumbs() ends after {0} ms'.format((new Date().getTime()) - start))
  })
}

husot.thumbs.StreamThumbsManager.prototype.showThumbs = function (name) {
  var self = this

  var $thumbContainers = self._getThumbContainersForChannel(name).filter(':hidden')

  // Initial checks
  if (!$thumbContainers.length) { return };

  new Promise(function (resolve, reject) { // Load block list for games
    husot.settings.blockedGames.list(function (items) {
      resolve(items)
    })
  })
    .then(function (blockedGames) { // Show thumbnails after block list is loaded
      var shownThumbsCount = 0
      $thumbContainers.each(function () {
        var $item = $(this)

        // Don't hide if game is in the block list
        if (self._isThumbMustBeHiddenForGame($item, blockedGames)) { return }

        $item.show()
        shownThumbsCount++
      })

      self._notifyAboutShownThumbs(shownThumbsCount)
    })
}

husot.thumbs.StreamThumbsManager.prototype.showThumbsForGame = function (name) {
  var self = this

  var $thumbContainers = self._getThumbContainersForGame(name).filter(':hidden')

  // Initial checks
  if (!$thumbContainers.length) { return };

  new Promise(function (resolve, reject) { // Load block list for channels
    husot.settings.blockedChannels.list(function (items) {
      resolve(items)
    })
  })
    .then(function (blockedChannels) { // Show thumbnails after block list is loaded
      var shownThumbsCount = 0
      $thumbContainers.each(function () {
        var $item = $(this)

        // Don't hide if channel is in the block list
        if (self._isThumbMustBeHiddenForChannel($item, blockedChannels)) { return }

        $item.show()
        shownThumbsCount++
      })

      self._notifyAboutShownThumbs(shownThumbsCount)
    })
}

// class GameThumbsManager: ThumbsManagerBase

husot.thumbs.GameThumbsManager = function (streamThumbsManager) {
  husot.thumbs.ThumbsManagerBase.call(this)

  this._streamThumbsManager = streamThumbsManager
}

husot.thumbs.GameThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype)
husot.thumbs.GameThumbsManager.prototype.constructor = husot.thumbs.GameThumbsManager

husot.thumbs.GameThumbsManager.prototype.getDomListnerThumbSelector = function () {
  return '[data-target="directory-page__card-container"]'
}

husot.thumbs.GameThumbsManager.prototype._getContainerJQuery = function () {
  return $('.tw-tower > [style^="order: "]')
}

husot.thumbs.GameThumbsManager.prototype._getThumbJQuery = function () {
  return $('.tw-tower > [style^="order: "]').find('.tw-card-img > .tw-aspect')
}

husot.thumbs.GameThumbsManager.prototype._getGameName = function ($thumbContainer) {
  var self = this

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }

  var $game = $thumbContainer.find('.tw-card-body .tw-box-art-card__title')

  if (!$game.length) {
    throw Error(husot.exceptions.elementNotFound('Game name'))
  }

  return $game.text().trim()
}

husot.thumbs.GameThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
  husot.settings.ui.window.init(husot.constants.blockedItemType.game)
  husot.modalDialog.show($('.husot-settings'))
}

husot.thumbs.GameThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
  var $sender = $(sender)

  var $thumbContainer = $sender.closest(self._getContainerJQuery())

  // Initial checks
  if (!$thumbContainer.length) {
    throw Error(husot.exceptions.elementNotFound('Thumb container'))
  };

  var name = self._getGameName($thumbContainer)

  husot.settings.blockedGames.add(name, function () {
    self._hideThumbs(name)
    self._loadMoreThumbs()
  })
}

husot.thumbs.GameThumbsManager.prototype._hideThumbs = function (name) {
  var self = this

  var $thumbContainer = self._getThumbContainer(name).filter(':visible')

  // Initial checks
  if (!$thumbContainer.length) {
    throw Error(husot.exceptions.elementNotFoundFor('Thumb container', '"{0}" game'.format(name)))
  };

  $thumbContainer.hide()
  self._notifyAboutHiddenThumbs($thumbContainer.length)
}

husot.thumbs.GameThumbsManager.prototype._getThumbContainer = function (name) {
  var self = this

  var $thumbContainers = self._getContainerJQuery()

  // No game thumbs on the page
  if (!$thumbContainers.length) {
    return $()
  }

  return $thumbContainers.filter(function () {
    var $this = $(this)
    var gameName = self._getGameName($this)

    return gameName.toLowerCase() === name.toLowerCase()
  })
}

husot.thumbs.GameThumbsManager.prototype._isThumbMustBeHidden = function ($thumbContainer, blockedGames) {
  var self = this

  // Initial checks
  if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
    throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'))
  }
  if ($thumbContainer.length !== 1) {
    throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'))
  }

  var name = self._getGameName($thumbContainer)

  return blockedGames.some(function (item) {
    return name.toLowerCase() === item.toLowerCase()
  })
}

husot.thumbs.GameThumbsManager.prototype._showThumbs = function (name) {
  var self = this

  var $thumbContainer = self._getThumbContainer(name).filter(':hidden')

  // Initial checks
  if (!$thumbContainer.length) { return };

  $thumbContainer.show()
  self._notifyAboutShownThumbs($thumbContainer.length)
}

husot.thumbs.GameThumbsManager.prototype.hideThumbs = function () {
  var self = this

  var start = new Date().getTime()
  husot.log.debug('GameThumbsManager.hideThumbs() starts')

  new Promise(function (resolve, reject) { // Load blocked list for games
    husot.settings.blockedGames.list(function (items) {
      resolve(items)
    })
  })
    .then(function (blockedGames) { // Hide thumbnails after block list is loaded
      // Get visible thumbs
      var $thumbContainers = self._getContainerJQuery().filter(':visible')

      // Enumerate visible thumbs and hide those that must be hidden
      var hiddenThumbsCount = 0
      $thumbContainers.each(function () {
        var $item = $(this)

        // Hide game if needed
        if (self._isThumbMustBeHidden($item, blockedGames)) {
          $item.hide()
          hiddenThumbsCount++
        }
      })

      if (hiddenThumbsCount > 0) {
        self._notifyAboutHiddenThumbs(hiddenThumbsCount)
        self._loadMoreThumbs()
      }

      husot.log.debug('GameThumbsManager.hideThumbs() ends after {0} ms'.format((new Date().getTime()) - start))
    })
}

husot.thumbs.GameThumbsManager.prototype.showThumbs = function (name) {
  var self = this

  self._showThumbs(name)
  self._streamThumbsManager.showThumbsForGame(name)
};

// Embedded CSS styles

(function () {
  // Run only in top frame
  if (window.top !== window.self) {
    return
  }

  var style = document.createElement('style')
  style.textContent = '.husot-button{background:#6441a5;color:#fff!important;padding:0 10px;font-size:12px;text-align:center;cursor:pointer;height:30px;display:inline-block;line-height:30px}.husot-button:hover{color:#fff;background:#7550ba;text-decoration:none}.husot-modalOverlay{display:none;background:rgba(13,13,13,0.85);position:fixed;z-index:10000;top:0;bottom:0;left:0;padding:20px 0;width:100%;overflow-x:hidden;overflow-y:auto}.husot-modalWindow{display:none;position:relative;opacity:1;margin:50px auto 0}.husot-settings{font:12px "Helvetica Neue",Helvetica,Arial,sans-serif;color:#bbb;width:360px;background:#151515;padding:20px}.husot-settings-nav{list-style:none;padding:0;margin:0 0 5px;border-bottom:1px solid rgba(255,255,255,.2);overflow:auto}.husot-settings-nav-item{float:left;margin-right:20px}.husot-settings-nav-item-name{font-size:14px;line-height:24px;padding-bottom:7px;display:inline-block;cursor:pointer;text-decoration:none;color:#b19dd8!important;border-bottom:1px solid transparent}.husot-settings-nav-item-name:hover{color:#fff!important;border-bottom:1px solid rgba(255,255,255,.35);text-decoration:none}.husot-settings-nav-item-name-active,.husot-settings-nav-item-name-active:hover{color:#fff!important;border-bottom:1px solid rgba(255,255,255,.5)}.husot-settings-blockedList{list-style:none;padding:0;margin:0 0 5px;overflow-y:auto;min-height:240px;max-height:400px}.husot-settings-blockedList-item{margin:5px 0;clear:both;overflow:auto}.husot-settings-blockedList-item-name{font-size:14px;display:inline-block;width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;height:30px;float:left;line-height:30px;padding-right:80px}.husot-settings-blockedList-item-empty{text-align:center;font-size:16px;color:#bbb;font-style:italic;padding:20px 0}.husot-settings-blockedList-item-unblockBtn{float:right;max-width:80px;overflow:hidden;margin-left:-80px}.husot-settings-footer{text-align:center;width:100%;margin:0 0 5px;padding:20px 0 0;border-top:1px solid rgba(255,255,255,.2)}.husot-settings-footer .husot-button{min-width:70px}.husot-thumbOverlay{display:none;position:absolute;top:auto!important;right:5px!important;bottom:5px!important;left:auto!important;color:#fff;background-color:#000;padding:0 5px;font:12px "Helvetica Neue",Helvetica,Arial,sans-serif;line-height:22px;width:auto!important;min-height:auto!important;border-radius:2px!important;box-shadow:0 0 0 1px #fff;z-index:9000}.husot-thumbOverlay a{color:#fff!important;text-decoration:none!important}.husot-thumbOverlay a:hover{color:#fff!important;text-decoration:underline!important}.husot-thumbOverlay-menu{list-style:none;padding:0;margin:0}.husot-thumbOverlay-menu li,.husot-thumbOverlay-menu-separator{display:inline}.husot-settings-blockedList-item{padding-right:5px}::-webkit-scrollbar{background-color:rgba(255,255,255,.2);width:12px}::-webkit-scrollbar-thumb{background:#999}::-webkit-scrollbar-thumb:hover{background: #777}::-webkit-scrollbar-thumb:active{background:#555}';
  (document.head || document.documentElement).appendChild(style)
})()

// Application settings (Userscript specific)

husot.settings = husot.settings || {}

husot.settings.setValue = function (key, value, callback) {
  GM.setValue(key, value).then(function () {
    callback()
  }, function (reason) { // rejection
    husot.log.error(reason)
  })
}

husot.settings.getValue = function (key, defaultValue, callback) {
  GM.getValue(key).then(function (value) {
    if (typeof value === 'undefined' || value === '') {
      callback(defaultValue)
    }

    callback(value)
  }, function (reason) { // rejection
    husot.log.error(reason)
  })
}

// Application start

husot.main = function () {
  // Run only in top frame
  if (window.top !== window.self) {
    return
  }

  husot.settings.blockedChannels = new husot.settings.BlockedItems(husot.constants.blockedChannelsSettingsKey)
  husot.settings.blockedChannels.list() // Warm up settings so by the hiding time they will be loaded, most likely
  husot.settings.blockedGames = new husot.settings.BlockedItems(husot.constants.blockedGamesSettingsKey)
  husot.settings.blockedGames.list() // Warm up settings so by the hiding time they will be loaded, most likely

  husot.thumbs.streamThumbsManager = new husot.thumbs.StreamThumbsManager()
  husot.thumbs.gameThumbsManager = new husot.thumbs.GameThumbsManager(husot.thumbs.streamThumbsManager)

  husot.modalDialog.initOverlay()
  husot.settings.ui.window = new husot.settings.ui.Window()
  husot.injector.addScripts()
  husot.domListener.start()
}

$(document).ready(function () {
  husot.main()
})
