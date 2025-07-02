// ==UserScript==
// @name         Video: Enhanced Video Player
// @description  H5 video video enhancement script - https://github.com/xxxily/h5player
// @author       ankvps
// @version      3.7.1
// @license      GPL
// @namespace    https://egore.url.lol/userscripts
// @icon         https://cdn.jsdelivr.net/gh/xxxily/h5player@master/logo.png
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function (w) { if (w) { w.name = 'h5player' } })()

/**
 * Element monitoring device
 * @param selector -required
 * @param fn -Must -choose, the callback of elements when the element is existed
 * @param shadowRoot -Optional Specify the DOM element below a shadowroot
 * Reference: https://javascript.ruanyifeng.com/dom/mutationobserver.html
 */
function ready(selector, fn, shadowRoot) {
  const win = window
  const docRoot = shadowRoot || win.document.documentElement
  if (!docRoot) return false
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver
  const listeners = docRoot._MutationListeners || []

  function $ready(selector, fn) {
    // Storing selector and callback function
    listeners.push({
      selector: selector,
      fn: fn
    })

    /* Increase monitoring object */
    if (!docRoot._MutationListeners || !docRoot._MutationObserver) {
      docRoot._MutationListeners = listeners
      docRoot._MutationObserver = new MutationObserver(() => {
        for (let i = 0; i < docRoot._MutationListeners.length; i++) {
          const item = docRoot._MutationListeners[i]
          check(item.selector, item.fn)
        }
      })

      docRoot._MutationObserver.observe(docRoot, {
        childList: true,
        subtree: true
      })
    }

    // Check whether the node is already in the DOM
    check(selector, fn)
  }

  function check(selector, fn) {
    const elements = docRoot.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      element._MutationReadyList_ = element._MutationReadyList_ || []
      if (!element._MutationReadyList_.includes(fn)) {
        element._MutationReadyList_.push(fn)
        fn.call(element, element)
      }
    }
  }

  const selectorArr = Array.isArray(selector) ? selector : [selector]
  selectorArr.forEach(selector => $ready(selector, fn))
}

/**
 * Some web pages used Attachshdow closed MODE, you need Open to get Video tags, such as Baidu Cloud Plate
 * Reference:
 * https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn#closed
 * https://stackoverflow.com/questions/54954383/override-element-prototype-attachshadow-using-chrome-extension
 */
function hackAttachShadow() {
  if (window._hasHackAttachShadow_) return
  try {
    window._shadowDomList_ = []
    window.Element.prototype._attachShadow = window.Element.prototype.attachShadow
    window.Element.prototype.attachShadow = function () {
      const arg = arguments
      if (arg[0] && arg[0].mode) {
        // Forced use open mode
        arg[0].mode = 'open'
      }
      const shadowRoot = this._attachShadow.apply(this, arg)
      // Save a shadowdomlist
      window._shadowDomList_.push(shadowRoot)

      /* Let the elements in ShadowROOT have the opportunity to visit Shadowhost */
      shadowRoot._shadowHost = this

      // Add under document addShadowCustom Event custom event
      const shadowEvent = new window.CustomEvent('addShadowRoot', {
        shadowRoot,
        detail: {
          shadowRoot,
          message: 'addShadowRoot',
          time: new Date()
        },
        bubbles: true,
        cancelable: true
      })
      document.dispatchEvent(shadowEvent)

      return shadowRoot
    }
    window._hasHackAttachShadow_ = true
  } catch (e) {
    console.error('hackAttachShadow error by h5player plug-in', e)
  }
}

/*!
* @name         original.js
* @description  The storage part of the important native function to prevent external pollution. This logic should be as early as possible, otherwise it will be stored in the pollution function
* @version      0.0.1
* @author       xxxily
* @date         2022/10/16 10:32
* @github       https://github.com/xxxily
*/

const original = {
  // Prevent DEFINEPROPRETY and DefineProperties rewritten by AOP scripts
  Object: {
    defineProperty: Object.defineProperty,
    defineProperties: Object.defineProperties
  },

  // Prevent such gameplay: https://juejin.cn/post/6865910564817010702
  Proxy,

  Map,
  map: {
    clear: Map.prototype.clear,
    set: Map.prototype.set,
    has: Map.prototype.has,
    get: Map.prototype.get
  },

  console: {
    log: console.log,
    info: console.info,
    error: console.error,
    warn: console.warn,
    table: console.table
  },

  ShadowRoot,
  HTMLMediaElement,
  CustomEvent,
  // appendChild: Node.prototype.appendChild,

  JSON: {
    parse: JSON.parse,
    stringify: JSON.stringify
  },

  alert,
  confirm,
  prompt
}

/**
 * Media label detection can detect VIODE, Audio, and other labels.
 * @param {Function} handler -required The callback function to be executed after detection
 * @returns mediaElementList
 */
const mediaCore = (function () {
  let hasMediaCoreInit = false
  let hasProxyHTMLMediaElement = false
  let originDescriptors = {}
  const originMethods = {}
  const mediaElementList = []
  const mediaElementHandler = []
  const mediaMap = new original.Map()

  const firstUpperCase = str => str.replace(/^\S/, s => s.toUpperCase())
  function isHTMLMediaElement(el) {
    return el instanceof original.HTMLMediaElement
  }

  /**
   * Create related API functions based on the instance object of HTMLMEDIEMENT, so as to achieve enhanced functions such as locking playback speed, locking pause and playback
   * @param {*} mediaElement - Must -choose, specific examples of htmlmediaelemenwait, such as video tags or new on the webpage Audio()wait
   * @returns mediaPlusApi
   */
  function createMediaPlusApi(mediaElement) {
    if (!isHTMLMediaElement(mediaElement)) { return false }

    let mediaPlusApi = original.map.get.call(mediaMap, mediaElement)
    if (mediaPlusApi) {
      return mediaPlusApi
    }

    /* Create MediaPlusapi objects */
    mediaPlusApi = {}
    const mediaPlusBaseApi = {
      /**
       * Create a lock to prevent the external logic operation from the attributes or functions related to the MediaElement
       * The lock logic here is only data status marking and switching. The specific lock function needs to be
       * PROXYPROTOTYPemethod and HijackPrototypeproperty are implemented
       */
      lock(keyName, duration) {
        const infoKey = `__${keyName}_info__`
        mediaPlusApi[infoKey] = mediaPlusApi[infoKey] || {}
        mediaPlusApi[infoKey].lock = true

        /* Unlock time information */
        duration = Number(duration)
        if (!Number.isNaN(duration) && duration > 0) {
          mediaPlusApi[infoKey].unLockTime = Date.now() + duration
        }

        // original.console.log(`[mediaPlusApi][lock][${keyName}] ${duration}`)
      },
      unLock(keyName) {
        const infoKey = `__${keyName}_info__`
        mediaPlusApi[infoKey] = mediaPlusApi[infoKey] || {}
        mediaPlusApi[infoKey].lock = false
        mediaPlusApi[infoKey].unLockTime = Date.now() - 100

        // original.console.log(`[mediaPlusApi][unLock][${keyName}]`)
      },
      isLock(keyName) {
        const info = mediaPlusApi[`__${keyName}_info__`] || {}

        if (info.unLockTime) {
          /* The delay lock is calculated based on the current time whether it is still in the lock state */
          return Date.now() < info.unLockTime
        } else {
          return info.lock || false
        }
      },

      /* Note: Call the restricted restrictions of the GET and SET and Apply here */
      get(keyName) {
        if (originDescriptors[keyName] && originDescriptors[keyName].get && !originMethods[keyName]) {
          return originDescriptors[keyName].get.apply(mediaElement)
        }
      },
      set(keyName, val) {
        if (originDescriptors[keyName] && originDescriptors[keyName].set && !originMethods[keyName] && typeof val !== 'undefined') {
          // original.console.log(`[mediaPlusApi][${keyName}] Execute the native set operation`)
          return originDescriptors[keyName].set.apply(mediaElement, [val])
        }
      },
      apply(keyName) {
        if (originMethods[keyName] instanceof Function) {
          const args = Array.from(arguments)
          args.shift()
          // original.console.log(`[mediaPlusApi][${keyName}] Execute the native Apply operation`)
          return originMethods[keyName].apply(mediaElement, args)
        }
      }
    }

    mediaPlusApi = { ...mediaPlusApi, ...mediaPlusBaseApi }

    /**
     * Extend the API list.accomplish' playbackRate', 'volume', 'currentTime', 'play', 'pause'The pure API calling effect, the specific API is as follows:
     * mediaPlusApi.lockPlaybackRate()
     * mediaPlusApi.unLockPlaybackRate()
     * mediaPlusApi.isLockPlaybackRate()
     * mediaPlusApi.getPlaybackRate()
     * mediaPlusApi.setPlaybackRate(val)
     *
     * mediaPlusApi.lockVolume()
     * mediaPlusApi.unLockVolume()
     * mediaPlusApi.isLockVolume()
     * mediaPlusApi.getVolume()
     * mediaPlusApi.setVolume(val)
     *
     * mediaPlusApi.lockCurrentTime()
     * mediaPlusApi.unLockCurrentTime()
     * mediaPlusApi.isLockCurrentTime()
     * mediaPlusApi.getCurrentTime()
     * mediaPlusApi.setCurrentTime(val)
     *
     * mediaPlusApi.lockPlay()
     * mediaPlusApi.unLockPlay()
     * mediaPlusApi.isLockPlay()
     * mediaPlusApi.applyPlay()
     *
     * mediaPlusApi.lockPause()
     * mediaPlusApi.unLockPause()
     * mediaPlusApi.isLockPause()
     * mediaPlusApi.applyPause()
     */
    const extApiKeys = ['playbackRate', 'volume', 'currentTime', 'play', 'pause']
    const baseApiKeys = Object.keys(mediaPlusBaseApi)
    extApiKeys.forEach(key => {
      baseApiKeys.forEach(baseKey => {
        /* When the key corresponds to the function, there should be no GET and SET APIs, but the Apply API should */
        if (originMethods[key] instanceof Function) {
          if (baseKey === 'get' || baseKey === 'set') {
            return true
          }
        } else if (baseKey === 'apply') {
          return true
        }

        mediaPlusApi[`${baseKey}${firstUpperCase(key)}`] = function () {
          return mediaPlusBaseApi[baseKey].apply(null, [key, ...arguments])
        }
      })
    })

    original.map.set.call(mediaMap, mediaElement, mediaPlusApi)

    return mediaPlusApi
  }

  /* The processing logic of the Media object is detected, and the proxy of depending on the proxy on the Media function */
  function mediaDetectHandler(ctx) {
    if (isHTMLMediaElement(ctx) && !mediaElementList.includes(ctx)) {
      // console.log(`[mediaDetectHandler]`, ctx)
      mediaElementList.push(ctx)
      createMediaPlusApi(ctx)

      try {
        mediaElementHandler.forEach(handler => {
          (handler instanceof Function) && handler(ctx)
        })
      } catch (e) { }
    }
  }

  /* The proxy method PLAY and PAUSE methods to ensure that it can be paused and played correctly */
  function proxyPrototypeMethod(element, methodName) {
    const originFunc = element && element.prototype[methodName]
    if (!originFunc) return

    element.prototype[methodName] = new original.Proxy(originFunc, {
      apply(target, ctx, args) {
        mediaDetectHandler(ctx)
        // original.console.log(`[mediaElementMethodProxy] After the proxy${methodName}function`)

        /* Enhance the playback logic of playback, for example, allow locking through MediaPlusapi */
        if (['play', 'pause'].includes(methodName)) {
          const mediaPlusApi = createMediaPlusApi(ctx)
          if (mediaPlusApi && mediaPlusApi.isLock(methodName)) {
            // original.console.log(`[mediaElementMethodProxy] ${methodName}Has been locked and cannot be executed related operations`)
            return
          }
        }

        const result = target.apply(ctx, args)

        // TODO Observe and judge the function execution results

        return result
      }
    })

    // It is not recommended to expand the prototype chain of HTMLMEDIAEEMENT, so that the webpage can detect the existence of MediaCore to enhance logic
    // if (originMethods[methodName]) {
    //   element.prototype[`__${methodName}__`] = originMethods[methodName]
    // }
  }

  /**
   * hijack playbackRate、volume、currentTime Attributes, and increase locking logic, so as to achieve stronger anti -interference ability
   */
  function hijackPrototypeProperty(element, property) {
    if (!element || !element.prototype || !originDescriptors[property]) {
      return false
    }

    original.Object.defineProperty.call(Object, element.prototype, property, {
      configurable: true,
      enumerable: true,
      get: function () {
        const val = originDescriptors[property].get.apply(this, arguments)
        // original.console.log(`[mediaElementPropertyHijack][${property}][get]`, val)

        const mediaPlusApi = createMediaPlusApi(this)
        if (mediaPlusApi && mediaPlusApi.isLock(property)) {
          if (property === 'playbackRate') {
            return +!+[]
          }
        }

        return val
      },
      set: function (value) {
        // original.console.log(`[mediaElementPropertyHijack][${property}][set]`, value)

        if (property === 'src') {
          mediaDetectHandler(this)
        }

        /* Enhance the speed regulation, tuning and progress control logic, such as allowing the functions of MEDIAPLUSAPI to lock */
        if (['playbackRate', 'volume', 'currentTime'].includes(property)) {
          const mediaPlusApi = createMediaPlusApi(this)
          if (mediaPlusApi && mediaPlusApi.isLock(property)) {
            // original.console.log(`[mediaElementPropertyHijack] ${property}Has been locked and cannot be executed related operations`)
            return
          }
        }

        return originDescriptors[property].set.apply(this, arguments)
      }
    })
  }

  function mediaPlus(mediaElement) {
    return createMediaPlusApi(mediaElement)
  }

  function mediaProxy() {
    if (!hasProxyHTMLMediaElement) {
      const proxyMethods = ['play', 'pause', 'load', 'addEventListener']
      proxyMethods.forEach(methodName => { proxyPrototypeMethod(HTMLMediaElement, methodName) })

      const hijackProperty = ['playbackRate', 'volume', 'currentTime', 'src']
      hijackProperty.forEach(property => { hijackPrototypeProperty(HTMLMediaElement, property) })

      hasProxyHTMLMediaElement = true
    }

    return hasProxyHTMLMediaElement
  }

  /**
   * Media label detection can detect VIODE, Audio, and other labels.
   * @param {Function} handler -required The callback function to be executed after detection
   * @returns mediaElementList
   */
  function mediaChecker(handler) {
    if (!(handler instanceof Function) || mediaElementHandler.includes(handler)) {
      return mediaElementList
    } else {
      mediaElementHandler.push(handler)
    }

    if (!hasProxyHTMLMediaElement) {
      mediaProxy()
    }

    return mediaElementList
  }

  /**
   * Initialize MediaCore -related functions
   */
  function init(mediaCheckerHandler) {
    if (hasMediaCoreInit) { return false }

    originDescriptors = Object.getOwnPropertyDescriptors(HTMLMediaElement.prototype)

    Object.keys(HTMLMediaElement.prototype).forEach(key => {
      try {
        if (HTMLMediaElement.prototype[key] instanceof Function) {
          originMethods[key] = HTMLMediaElement.prototype[key]
        }
      } catch (e) { }
    })

    mediaCheckerHandler = mediaCheckerHandler instanceof Function ? mediaCheckerHandler : function () { }
    mediaChecker(mediaCheckerHandler)

    hasMediaCoreInit = true
    return true
  }

  return {
    init,
    mediaPlus,
    mediaChecker,
    originDescriptors,
    originMethods,
    mediaElementList
  }
})()

const mediaSource = (function () {
  let hasMediaSourceInit = false
  const originMethods = {}
  const originURLMethods = {}
  const mediaSourceMap = new original.Map()
  const objectURLMap = new original.Map()

  function proxyMediaSourceMethod() {
    if (!originMethods.addSourceBuffer || !originMethods.endOfStream) {
      return false
    }

    // TODO The proxy may be delayed in the effectiveness of the upper layer. The reason is to be studied
    originURLMethods.createObjectURL = originURLMethods.createObjectURL || URL.prototype.constructor.createObjectURL
    URL.prototype.constructor.createObjectURL = new original.Proxy(originURLMethods.createObjectURL, {
      apply(target, ctx, args) {
        const objectURL = target.apply(ctx, args)

        original.map.set.call(objectURLMap, args[0], objectURL)

        return objectURL
      }
    })

    MediaSource.prototype.addSourceBuffer = new original.Proxy(originMethods.addSourceBuffer, {
      apply(target, ctx, args) {
        if (!original.map.has.call(mediaSourceMap, ctx)) {
          original.map.set.call(mediaSourceMap, ctx, {
            mediaSource: ctx,
            createTime: Date.now(),
            sourceBuffer: [],
            endOfStream: false
          })
        }

        original.console.log('[addSourceBuffer]', ctx, args)

        const mediaSourceInfo = original.map.get.call(mediaSourceMap, ctx)
        const mimeCodecs = args[0] || ''
        const sourceBuffer = target.apply(ctx, args)

        const sourceBufferItem = {
          mimeCodecs,
          originAppendBuffer: sourceBuffer.appendBuffer,
          bufferData: [],
          mediaInfo: {}
        }

        try {
          // Example of MIMECODECS string:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
          const mediaInfo = sourceBufferItem.mediaInfo
          const tmpArr = sourceBufferItem.mimeCodecs.split(';')

          mediaInfo.type = tmpArr[0].split('/')[0]
          mediaInfo.format = tmpArr[0].split('/')[1]
          mediaInfo.codecs = tmpArr[1].trim().replace('codecs=', '').replace(/["']/g, '')
        } catch (e) {
          original.console.error('[addSourceBuffer][mediaInfo] Media information analysis error', sourceBufferItem, e)
        }

        mediaSourceInfo.sourceBuffer.push(sourceBufferItem)

        /* Acting SourceBuffer.Appendbuffer function, and save a Buffer in MediaSourceInfo */
        sourceBuffer.appendBuffer = new original.Proxy(sourceBufferItem.originAppendBuffer, {
          apply(bufTarget, bufCtx, bufArgs) {
            const buffer = bufArgs[0]
            sourceBufferItem.bufferData.push(buffer)

            /* Make sure the existence and correspondence of MediaURL */
            if (original.map.get.call(objectURLMap, ctx)) {
              mediaSourceInfo.mediaUrl = original.map.get.call(objectURLMap, ctx)
            }

            return bufTarget.apply(bufCtx, bufArgs)
          }
        })

        return sourceBuffer
      }
    })

    MediaSource.prototype.endOfStream = new original.Proxy(originMethods.endOfStream, {
      apply(target, ctx, args) {
        /* Identifying the current media flow has been loaded and completed */
        const mediaSourceInfo = original.map.get.call(mediaSourceMap, ctx)
        if (mediaSourceInfo) {
          mediaSourceInfo.endOfStream = true
        }

        return target.apply(ctx, args)
      }
    })
  }

  /**
   * Download media resources, download code reference: https://juejin.cn/post/6873267073674379277
   */
  function downloadMediaSource() {
    mediaSourceMap.forEach(mediaSourceInfo => {
      if (mediaSourceInfo.hasDownload) {
        const confirm = original.confirm('The media file has been downloaded, and it is true that you need to download it again?')
        if (!confirm) {
          return false
        }
      }

      if (!mediaSourceInfo.hasDownload && !mediaSourceInfo.endOfStream) {
        const confirm = original.confirm('Media data is not completely ready. Are you sure to perform the download operation?')
        if (!confirm) {
          return false
        }

        original.console.log('[downloadMediaSource] Media data is not completely ready yet', mediaSourceInfo)
      }

      mediaSourceInfo.hasDownload = true
      mediaSourceInfo.sourceBuffer.forEach(sourceBufferItem => {
        if (!sourceBufferItem.mimeCodecs || sourceBufferItem.mimeCodecs.toString().indexOf(';') === -1) {
          const msg = '[downloadMediaSource][mimeCodecs][error] MIMECODECS does not exist or information is abnormal to download'
          original.console.error(msg, sourceBufferItem)
          original.alert(msg)
          return false
        }

        try {
          let mediaTitle = sourceBufferItem.mediaInfo.title || `${document.title || Date.now()}_${sourceBufferItem.mediaInfo.type}.${sourceBufferItem.mediaInfo.format}`

          if (!sourceBufferItem.mediaInfo.title) {
            mediaTitle = original.prompt('Please confirm the file title:', mediaTitle) || mediaTitle
            sourceBufferItem.mediaInfo.title = mediaTitle
          }

          if (!mediaTitle.endsWith(sourceBufferItem.mediaInfo.format)) {
            mediaTitle = mediaTitle + '.' + sourceBufferItem.mediaInfo.format
          }

          const a = document.createElement('a')
          a.href = URL.createObjectURL(new Blob(sourceBufferItem.bufferData))
          a.download = mediaTitle
          a.click()
          URL.revokeObjectURL(a.href)
        } catch (e) {
          mediaSourceInfo.hasDownload = false
          const msg = '[downloadMediaSource][error]'
          original.console.error(msg, e)
          original.alert(msg)
        }
      })
    })
  }

  function hasInit() {
    return hasMediaSourceInit
  }

  function init() {
    if (hasMediaSourceInit) {
      return false
    }

    if (!window.MediaSource) {
      return false
    }

    Object.keys(MediaSource.prototype).forEach(key => {
      try {
        if (MediaSource.prototype[key] instanceof Function) {
          originMethods[key] = MediaSource.prototype[key]
        }
      } catch (e) { }
    })

    proxyMediaSourceMethod()

    hasMediaSourceInit = true
  }

  return {
    init,
    hasInit,
    originMethods,
    originURLMethods,
    mediaSourceMap,
    objectURLMap,
    downloadMediaSource
  }
})()

/*!
* @name         utils.js
* @description  Data type -related method
* @version      0.0.1
* @author       Blaze
* @date         22/03/2019 22:46
* @github       https://github.com/xxxily
*/

/**
 * Properly obtain the specific type of the object See: https://www.talkingcoder.com/article/6333557442705696719
 * @param obj { all } -required The object to be judged
 * @returns {*} Specific type of judgment
 */
function getType(obj) {
  if (obj == null) {
    return String(obj)
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? (obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase()) ||
    /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase()
    : typeof obj
}

const isType = (obj, typeName) => getType(obj) === typeName
const isObj = obj => isType(obj, 'object')

/*!
* @name         object.js
* @description  Related method of object operation
* @version      0.0.1
* @author       Blaze
* @date         21/03/2019 23:10
* @github       https://github.com/xxxily
*/

/**
 * Deep copy of an object
 * @source -Object (Object|Array) The object or array that needs to be copied
 */
function clone(source) {
  var result = {}

  if (typeof source !== 'object') {
    return source
  }
  if (Object.prototype.toString.call(source) === '[object Array]') {
    result = []
  }
  if (Object.prototype.toString.call(source) === '[object Null]') {
    result = null
  }
  for (var key in source) {
    result[key] = (typeof source[key] === 'object') ? clone(source[key]) : source[key]
  }
  return result
}

/* Traversing objects, but does not include attributes on its prototype chain */
function forIn(obj, fn) {
  fn = fn || function () { }
  for (var key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      fn(key, obj[key])
    }
  }
}

/**
 * Two enumeration objects in depth
 * @param objA {object} -required Object A
 * @param objB {object} -required Object B
 * @param concatArr {boolean} -Optional The merger array, when the array is encountered by default, directly replace the current array with another array. True this settings will be merged when encountering an array instead of directly replacing
 * @returns {*|void}
 */
function mergeObj(objA, objB, concatArr) {
  function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  function isArr(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
  if (!isObj(objA) || !isObj(objB)) return objA
  function deepMerge(objA, objB) {
    forIn(objB, function (key) {
      const subItemA = objA[key]
      const subItemB = objB[key]
      if (typeof subItemA === 'undefined') {
        objA[key] = subItemB
      } else {
        if (isObj(subItemA) && isObj(subItemB)) {
          /* Deep merger */
          objA[key] = deepMerge(subItemA, subItemB)
        } else {
          if (concatArr && isArr(subItemA) && isArr(subItemB)) {
            objA[key] = subItemA.concat(subItemB)
          } else {
            objA[key] = subItemB
          }
        }
      }
    })
    return objA
  }
  return deepMerge(objA, objB)
}

/**
 * To obtain the value in the object according to the text path, if you need to support the array, please use the getash get method of Lodash
 * @param obj {Object} -required Object to be operated
 * @param path {String} -required Path information
 * @returns {*}
 */
function getValByPath(obj, path) {
  path = path || ''
  const pathArr = path.split('.')
  let result = obj

  /* Recursive extraction result value */
  for (let i = 0; i < pathArr.length; i++) {
    if (!result) break
    result = result[pathArr[i]]
  }

  return result
}

/**
 * Set the value in the object according to the text path, if you need to support the array, please use the setsh set method of lodash
 * @param obj {Object} -required Object to be operated
 * @param path {String} -required Path information
 * @param val {Any} -required If you don't pass it, the final result will be set to undefined
 * @returns {Boolean} Return TRUE indicates that the setting is successful, otherwise the setting will fail
 */
function setValByPath(obj, path, val) {
  if (!obj || !path || typeof path !== 'string') {
    return false
  }

  let result = obj
  const pathArr = path.split('.')

  for (let i = 0; i < pathArr.length; i++) {
    if (!result) break

    if (i === pathArr.length - 1) {
      result[pathArr[i]] = val
      return Number.isNaN(val) ? Number.isNaN(result[pathArr[i]]) : result[pathArr[i]] === val
    }

    result = result[pathArr[i]]
  }

  return false
}

const quickSort = function (arr) {
  if (arr.length <= 1) { return arr }
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)[0]
  var left = []
  var right = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

function hideDom(selector, delay) {
  setTimeout(function () {
    const dom = document.querySelector(selector)
    if (dom) {
      dom.style.opacity = 0
    }
  }, delay || 1000 * 5)
}

/**
 * Find the operation upward
 * @param dom {Element} -required Initial DOM element
 * @param fn {function} -required The callback operation of each level of Parentnode
 * If the function returns true, it means stop looking up to find the action
 */
function eachParentNode(dom, fn) {
  let parent = dom.parentNode
  while (parent) {
    const isEnd = fn(parent, dom)
    parent = parent.parentNode
    if (isEnd) {
      break
    }
  }
}

/**
 * Dynamic loading CSS content
 * @param cssText {String} -required Style text content
 * @param id {String} -Optional Specify the ID number of the style text, if the corresponding ID number already exists, it will not be inserted again
 * @param insetTo {Dom} -Optional Where to insert
 * @returns {HTMLStyleElement}
 */
function loadCSSText(cssText, id, insetTo) {
  if (id && document.getElementById(id)) {
    return false
  }

  const style = document.createElement('style')
  const head = insetTo || document.head || document.getElementsByTagName('head')[0]
  style.appendChild(document.createTextNode(cssText))
  head.appendChild(style)

  if (id) {
    style.setAttribute('id', id)
  }

  return style
}

/**
 * Determine whether the current element is editable element
 * @param target
 * @returns Boolean
 */
function isEditableTarget(target) {
  const isEditable = target.getAttribute && target.getAttribute('contenteditable') === 'true'
  const isInputDom = /INPUT|TEXTAREA|SELECT/.test(target.nodeName)
  return isEditable || isInputDom
}

/**
 * Determine whether a certain element is in shadowdom
 * Reference: https://www.coder.work/article/299700
 * @param node
 * @returns {boolean}
 */
function isInShadow(node, returnShadowRoot) {
  for (; node; node = node.parentNode) {
    if (node.toString() === '[object ShadowRoot]') {
      if (returnShadowRoot) {
        return node
      } else {
        return true
      }
    }
  }
  return false
}

/**
 * To determine whether a certain element is in a visible area and suitable for passive calls, you need high performance, please use the InternetObServer
 * Reference: https://github.com/febobo/web-interview/issues/84
 * @param element
 * @returns {boolean}
 */
function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth
  const viewHeight = window.innerHeight || document.documentElement.clientHeight
  const {
    top,
    right,
    bottom,
    left
  } = element.getBoundingClientRect()

  return (
    top >= 0 &&
    left >= 0 &&
    right <= viewWidth &&
    bottom <= viewHeight
  )
}

/**
 * Convert the inner style of the line into an object form
 * @param {string} inlineStyle -Must -choose, for example: position: relative; opacity: 1; visibility: hidden; transform: scale(0.1) rotate(180deg);
 * @returns {Object}
 */

function inlineStyleToObj(inlineStyle) {
  if (typeof inlineStyle !== 'string') {
    return {}
  }

  const result = {}
  const styArr = inlineStyle.split(';')
  styArr.forEach(item => {
    const tmpArr = item.split(':')
    if (tmpArr.length === 2) {
      result[tmpArr[0].trim()] = tmpArr[1].trim()
    }
  })

  return result
}

function objToInlineStyle(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return ''
  }

  const styleArr = []
  Object.keys(obj).forEach(key => {
    styleArr.push(`${key}: ${obj[key]}`)
  })

  return styleArr.join('; ')
}

/* UA information camouflage */
function fakeUA(ua) {
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    writable: false,
    configurable: false,
    enumerable: true
  })
}

/* UA information source: https://developers.whatismybrowser.com */
const userAgentMap = {
  android: {
    chrome: 'Mozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
    firefox: 'Mozilla/5.0 (Android 7.0; Mobile; rv:57.0) Gecko/57.0 Firefox/57.0'
  },
  iPhone: {
    safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    chrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.121 Mobile/15E148 Safari/605.1'
  },
  iPad: {
    safari: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    chrome: 'Mozilla/5.0 (iPad; CPU OS 12_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.155 Mobile/15E148 Safari/605.1'
  }
}

/**
 * Determine whether it is in iframe
 * @returns {boolean}
 */
function isInIframe() {
  return window !== window.top
}

/**
 * Determine whether it is in iframe, which is in cross -domain restrictions
 * @returns {boolean}
 */
function isInCrossOriginFrame() {
  let result = true
  try {
    if (window.top.localStorage || window.top.location.href) {
      result = false
    }
  } catch (e) {
    result = true
  }
  return result
}

/**
 * Simple running function
 * @param fn
 * @param interval
 * @returns {Function}
 */
function throttle(fn, interval = 80) {
  let timeout = null
  return function () {
    if (timeout) return false
    timeout = setTimeout(() => {
      timeout = null
    }, interval)
    fn.apply(this, arguments)
  }
}

/*!
* @name         url.js
* @description  Related methods for parsing URL
* @version      0.0.1
* @author       Blaze
* @date         27/03/2019 15:52
* @github       https://github.com/xxxily
*/

/**
 * Reference example:
 * https://segmentfault.com/a/1190000006215495
 * Note: This method must rely on the browser's DOM object
 */

function parseURL(url) {
  var a = document.createElement('a')
  a.href = url || window.location.href
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    origin: a.origin,
    search: a.search,
    query: a.search,
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    params: (function () {
      var ret = {}
      var seg = []
      var paramArr = a.search.replace(/^\?/, '').split('&')

      for (var i = 0; i < paramArr.length; i++) {
        var item = paramArr[i]
        if (item !== '' && item.indexOf('=')) {
          seg.push(item)
        }
      }

      for (var j = 0; j < seg.length; j++) {
        var param = seg[j]
        var idx = param.indexOf('=')
        var key = param.substring(0, idx)
        var val = param.substring(idx + 1)
        if (!key) {
          ret[val] = null
        } else {
          ret[key] = val
        }
      }
      return ret
    })()
  }
}

/**
 * Convert the Params object to a string mode
 * @param params {Object} - required Params object
 * @returns {string}
 */
function stringifyParams(params) {
  var strArr = []

  if (!Object.prototype.toString.call(params) === '[object Object]') {
    return ''
  }

  for (var key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      var val = params[key]
      var valType = Object.prototype.toString.call(val)

      if (val === '' || valType === '[object Undefined]') continue

      if (val === null) {
        strArr.push(key)
      } else if (valType === '[object Array]') {
        strArr.push(key + '=' + val.join(','))
      } else {
        val = (JSON.stringify(val) || '' + val).replace(/(^"|"$)/g, '')
        strArr.push(key + '=' + val)
      }
    }
  }
  return strArr.join('&')
}

/**
 * The URL object will be resolved through PARSEURL to resume the URL address
 * After the query parameters are dynamically modified, reorganize the URL link
 * @param obj {Object} -required PARSEURL parsed out the URL object
 */
function stringifyToUrl(urlObj) {
  var query = stringifyParams(urlObj.params) || ''
  if (query) { query = '?' + query }
  var hash = urlObj.hash ? '#' + urlObj.hash : ''
  return urlObj.origin + urlObj.path + query + hash
}

/*!
configManager parse localStorage error * @name         configManager.js
* @description  Configure unified management script
* @version      0.0.1
* @author       xxxily
* @date         2022/09/20 16:10
* @github       https://github.com/xxxily
*/

/**
 * Determine whether the localStorage is available
 * LocalStorage does not guarantee 100 xIt is available, so it must be judged before use, otherwise it will cause abnormal scripts in some websites.
 * https://stackoverflow.com/questions/30481516/iframe-in-chrome-error-failed-to-read-localstorage-from-window-access-deni
 * https://cloud.tencent.com/developer/article/1803097 (When the localStorage cannot be used, Window.LocalStorage is null, not the UNDEFINED in the text)
 */
function isLocalStorageUsable() {
  return window.localStorage && window.localStorage.getItem && window.localStorage.setItem
}

/**
 * Determine whether the GlobalStorage is available. The GlobalStorage currently used is based on the relevant API provided by TamperMonkey
 * https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_setValue
 */
function isGlobalStorageUsable() {
  return window.GM_setValue && window.GM_getValue && window.GM_deleteValue && window.GM_listValues
}

/**
 * Store clean LocalStorage related methods
 * Prevent methods under the LocalStorage object are rewritten, causing the reading and writing rules to be different.
 */
const rawLocalStorage = (function getRawLocalStorage() {
  const localStorageApis = [
    'getItem',
    'setItem',
    'removeItem',
    'clear',
    'key'
  ]

  const rawLocalStorage = {}

  localStorageApis.forEach(apiKey => {
    if (isLocalStorageUsable()) {
      rawLocalStorage[`_${apiKey}_`] = localStorage[apiKey]
      rawLocalStorage[apiKey] = function () {
        return rawLocalStorage[`_${apiKey}_`].apply(localStorage, arguments)
      }
    } else {
      rawLocalStorage[apiKey] = function () {
        console.error('localStorage unavailable')
      }
    }
  })

  return rawLocalStorage
})()

const configPrefix = '_h5player_'
const defConfig = {
  media: {
    autoPlay: false,
    playbackRate: 1,
    volume: 1,

    /* Whether to allow storage and playback progress */
    allowRestorePlayProgress: {

    },
    /* Video playback progress mapping table */
    progress: {}
  },
  hotkeys: [
    {
      desc: 'Full screen screen',
      key: 'shift+enter',
      command: 'setWebFullScreen',
      /* If you need to disable shortcut keys, set disabled to true */
      disabled: false
    },
    {
      desc: 'full screen',
      key: 'enter',
      command: 'setFullScreen'
    },
    {
      desc: 'Switch the painting mode in painting',
      key: 'shift+p',
      command: 'togglePictureInPicture'
    },
    {
      desc: 'Video screenshot',
      key: 'shift+s',
      command: 'capture'
    },
    {
      desc: 'Enable or prohibit automatic recovery of playback progress functions',
      key: 'shift+r',
      command: 'capture'
    },
    {
      desc: 'Vertical mirror flip',
      key: 'shift+m',
      command: 'setMirror',
      args: [true]
    },
    {
      desc: 'Horizontal mirror flip',
      key: 'm',
      command: 'setMirror'
    },
    {
      desc: 'Download audio and video file (experimental function)',
      key: 'shift+d',
      command: 'mediaDownload'
    },
    {
      desc: 'Reduce video screen -0.05',
      key: 'shift+x',
      command: 'setScaleDown'
    },
    {
      desc: 'Zooli video screen +0.05',
      key: 'shift+c',
      command: 'setScaleUp'
    },
    {
      desc: 'Restore video screen',
      key: 'shift+z',
      command: 'resetTransform'
    },
    {
      desc: 'Move to the right 10px to the right',
      key: 'shift+arrowright',
      command: 'setTranslateRight'
    },
    {
      desc: 'Move 10px to the left',
      key: 'shift+arrowleft',
      command: 'setTranslateLeft'
    },
    {
      desc: 'Move 10px upwards',
      key: 'shift+arrowup',
      command: 'setTranslateUp'
    },
    {
      desc: 'Move 10px down the screen',
      key: 'shift+arrowdown',
      command: 'setTranslateDown'
    },
    {
      desc: '5 seconds',
      key: 'arrowright',
      command: 'setCurrentTimeUp'
    },
    {
      desc: '5 seconds back',
      key: 'arrowleft',
      command: 'setCurrentTimeDown'
    },
    {
      desc: '30 seconds',
      key: 'ctrl+arrowright',
      command: 'setCurrentTimeUp',
      args: [30]
    },
    {
      desc: '30 seconds back',
      key: 'ctrl+arrowleft',
      command: 'setCurrentTimeDown',
      args: [-30]
    },
    {
      desc: 'Increased volume 5%',
      key: 'arrowup',
      command: 'setVolumeUp',
      args: [0.05]
    },
    {
      desc: 'Decrease 5%',
      key: 'arrowdown',
      command: 'setVolumeDown',
      args: [-0.05]
    },
    {
      desc: 'Increased volume 20%',
      key: 'ctrl+arrowup',
      command: 'setVolumeUp',
      args: [0.2]
    },
    {
      desc: 'Decrease 20%',
      key: 'ctrl+arrowdown',
      command: 'setVolumeDown',
      args: [-0.2]
    },
    {
      desc: 'Switching/Play',
      key: 'space',
      command: 'switchPlayStatus'
    },
    {
      desc: 'Deceleration -0.1',
      key: 'x',
      command: 'setPlaybackRateDown'
    },
    {
      desc: 'Accelerate +0.1',
      key: 'c',
      command: 'setPlaybackRateUp'
    },
    {
      desc: 'Play normal speed',
      key: 'z',
      command: 'resetPlaybackRate'
    },
    {
      desc: 'Set 1X playback speed',
      key: 'Digit1',
      command: 'setPlaybackRatePlus',
      args: 1
    },
    {
      desc: 'Set 1X playback speed',
      key: 'Numpad1',
      command: 'setPlaybackRatePlus',
      args: 1
    },
    {
      desc: 'Set 2X playback speed',
      key: 'Digit2',
      command: 'setPlaybackRatePlus',
      args: 2
    },
    {
      desc: 'Set 2X playback speed',
      key: 'Numpad2',
      command: 'setPlaybackRatePlus',
      args: 2
    },
    {
      desc: 'Set the playback speed of 3X',
      key: 'Digit3',
      command: 'setPlaybackRatePlus',
      args: 3
    },
    {
      desc: 'Set the playback speed of 3X',
      key: 'Numpad3',
      command: 'setPlaybackRatePlus',
      args: 3
    },
    {
      desc: 'Set 4X playback speed',
      key: 'Digit4',
      command: 'setPlaybackRatePlus',
      args: 4
    },
    {
      desc: 'Set 4X playback speed',
      key: 'Numpad4',
      command: 'setPlaybackRatePlus',
      args: 4
    },
    {
      desc: 'Next frame',
      key: 'F',
      command: 'freezeFrame',
      args: 1
    },
    {
      desc: 'Last frame',
      key: 'D',
      command: 'freezeFrame',
      args: -1
    },
    {
      desc: 'Increase brightness',
      key: 'E',
      command: 'setBrightnessUp'
    },
    {
      desc: 'Reduce brightness',
      key: 'W',
      command: 'setBrightnessDown'
    },
    {
      desc: 'Increase',
      key: 'T',
      command: 'setContrastUp'
    },
    {
      desc: 'Reduce contrast',
      key: 'R',
      command: 'setContrastDown'
    },
    {
      desc: 'Increase saturation',
      key: 'U',
      command: 'setSaturationUp'
    },
    {
      desc: 'Reduce saturation',
      key: 'Y',
      command: 'setSaturationDown'
    },
    {
      desc: 'Increasing hue',
      key: 'O',
      command: 'setHueUp'
    },
    {
      desc: 'Reduce hue',
      key: 'I',
      command: 'setHueDown'
    },
    {
      desc: 'Vague increase 1 px',
      key: 'K',
      command: 'setBlurUp'
    },
    {
      desc: 'Blur 1 px',
      key: 'J',
      command: 'setBlurDown'
    },
    {
      desc: 'Image reset',
      key: 'Q',
      command: 'resetFilterAndTransform'
    },
    {
      desc: 'Rotation 90 Every time',
      key: 'S',
      command: 'setRotate'
    },
    {
      desc: 'Play the next episode',
      key: 'N',
      command: 'setNextVideo'
    },
    {
      desc: 'Execute JS script',
      key: 'ctrl+j ctrl+s',
      command: () => {
        alert('Custom JS script')
      },
      when: ''
    }
  ],
  enhance: {
    /* Can't help but use the default speed regulation logic, when multiple video switching, the speed is easily reset, so the option is turned on by default */
    blockSetPlaybackRate: true,
    blockSetCurrentTime: false,
    blockSetVolume: false,
    allowExperimentFeatures: false,
    allowExternalCustomConfiguration: false,
    /* Whether to turn on the volume gain function */
    allowAcousticGain: false,
    /* Whether to turn on cross -domain control */
    allowCrossOriginControl: true,
    unfoldMenu: false
  },
  debug: false
}

const configManager = {
  /**
   * Conversion of confpath is called the key name in LocalStorage or GlobalStorage
   * @param {String} confPath -Must -choose, configuration path information: for example:'enhance.blockSetPlaybackRate'
   * @returns {keyName}
   */
  getConfKeyName(confPath = '') {
    return configPrefix + confPath.replace(/\./g, '_')
  },

  /**
   * Convert the key name in LocalStorage or GlobalStorage into Confpath when actual calls
   * @param {String} keyName -required The key names in LocalStorage or GlobalStorage, such as::'_h5player_enhance_blockSetPlaybackRate'
   * @returns {confPath}
   */
  getConfPath(keyName = '') {
    return keyName.replace(configPrefix, '').replace(/_/g, '.')
  },

  /**
   * Get the relevant configuration information according to the given configuration path
   * Sequence: LocalStorage > GlobalStorage > defConfig > null
   * @param {String} confPath -Must -choose, configuration path information: for example:'enhance.blockSetPlaybackRate'
   * @returns {*} If you return null, it means that the relevant configuration information is not obtained
   */
  get(confPath) {
    if (typeof confPath !== 'string') {
      return null
    }

    /* By default, priority uses the local localStorage configuration */
    const localConf = configManager.getLocalStorage(confPath)
    if (localConf !== null && localConf !== undefined) {
      return localConf
    }

    /* If LocalStorage has no relevant configuration, try to use the configuration of GlobalStorage */
    const globalConf = configManager.getGlobalStorage(confPath)
    if (globalConf !== null && globalConf !== undefined) {
      return globalConf
    }

    /* If neither LocalStorage and GlobalStorage configuration is not found, try to get related configuration information in the default configuration table */
    const defConfVal = getValByPath(defConfig, confPath)
    if (typeof defConfVal !== 'undefined' && defConfVal !== null) {
      return defConfVal
    }

    return null
  },

  /**
   * Write the configuration results to LocalStorage or GlobalStorage
   * Writing order: LocalStorage > GlobalStorage
   * Regardless of whether it is written or not, the result will be updated to the corresponding configuration items in Defconfig
   * @param {String} confPath
   * @param {*} val
   * @returns {Boolean}
   */
  set(confPath, val) {
    if (typeof confPath !== 'string' || typeof val === 'undefined' || val === null) {
      return false
    }

    // setValByPath(defConfig, confPath, val)

    let sucStatus = false

    sucStatus = configManager.setLocalStorage(confPath, val)

    if (!sucStatus) {
      sucStatus = configManager.setGlobalStorage(confPath, val)
    }

    return sucStatus
  },

  /* Get side -to -tied allocated configuration items */
  list() {
    const result = {
      localConf: configManager.listLocalStorage(),
      globalConf: configManager.listGlobalStorage(),
      defConfig
    }
    return result
  },

  /* Clear the configuration items that have been written in local storage */
  clear() {
    configManager.clearLocalStorage()
    configManager.clearGlobalStorage()
  },

  /**
   * According to the given configuration path, obtain the configuration information defined under localStorage
   * @param {String} confPath -Must -choose, configure path information
   * @returns
   */
  getLocalStorage(confPath) {
    if (typeof confPath !== 'string') {
      return null
    }

    const key = configManager.getConfKeyName(confPath)

    if (isLocalStorageUsable()) {
      let localConf = rawLocalStorage.getItem(key)
      if (localConf !== null && localConf !== undefined) {
        try {
          localConf = JSON.parse(localConf)
        } catch (e) {
          console.error('configManager parse localStorage error:', key, localConf)
        }

        return localConf
      }
    }

    return null
  },

  /**
   * According to the given configuration path, obtain the configuration information defined under GlobalStorage
   * @param {String} confPath -Must -choose, configure path information
   * @returns
   */
  getGlobalStorage(confPath) {
    if (typeof confPath !== 'string') {
      return null
    }

    const key = configManager.getConfKeyName(confPath)

    if (isGlobalStorageUsable()) {
      const globalConf = window.GM_getValue(key)
      if (globalConf !== null && globalConf !== undefined) {
        return globalConf
      }
    }

    return null
  },

  /**
   * Write the configuration results into the localStorage
   * @param {String} confPath
   * @param {*} val
   * @returns {Boolean}
   */
  setLocalStorage(confPath, val) {
    if (typeof confPath !== 'string' || typeof val === 'undefined' || val === null) {
      return false
    }

    setValByPath(defConfig, confPath, val)

    const key = configManager.getConfKeyName(confPath)

    if (isLocalStorageUsable()) {
      try {
        if (Object.prototype.toString.call(val) === '[object Object]' || Array.isArray(val)) {
          val = JSON.stringify(val)
        }

        rawLocalStorage.setItem(key, val)

        return true
      } catch (e) {
        console.error('configManager set localStorage error:', key, val, e)
        return false
      }
    } else {
      return false
    }
  },

  /**
   * Write the configuration results into GlobalStorage
   * @param {String} confPath
   * @param {*} val
   * @returns {Boolean}
   */
  setGlobalStorage(confPath, val) {
    if (typeof confPath !== 'string' || typeof val === 'undefined' || val === null) {
      return false
    }

    setValByPath(defConfig, confPath, val)

    const key = configManager.getConfKeyName(confPath)

    if (isGlobalStorageUsable()) {
      try {
        window.GM_setValue(key, val)
        return true
      } catch (e) {
        console.error('configManager set globalStorage error:', key, val, e)
        return false
      }
    } else {
      return false
    }
  },

  listLocalStorage() {
    if (isLocalStorageUsable()) {
      const result = {}
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(configPrefix)) {
          const confPath = configManager.getConfPath(key)
          result[confPath] = configManager.getLocalStorage(confPath)
        }
      })
      return result
    } else {
      return {}
    }
  },

  listGlobalStorage() {
    if (isGlobalStorageUsable()) {
      const result = {}
      const globalStorage = window.GM_listValues()
      globalStorage.forEach(key => {
        if (key.startsWith(configPrefix)) {
          const confPath = configManager.getConfPath(key)
          result[confPath] = configManager.getGlobalStorage(confPath)
        }
      })
      return result
    } else {
      return {}
    }
  },

  clearLocalStorage() {
    if (isLocalStorageUsable()) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(configPrefix)) {
          rawLocalStorage.removeItem(key)
        }
      })
    }
  },

  clearGlobalStorage() {
    if (isGlobalStorageUsable()) {
      const globalStorage = window.GM_listValues()
      globalStorage.forEach(key => {
        if (key.startsWith(configPrefix)) {
          window.GM_deleteValue(key)
        }
      })
    }
  },

  mergeDefConf(conf) { return mergeObj(defConfig, conf) }
}

/* Preserve important original functions to prevent contamination by external scripts */
const originalMethods = {
  Object: {
    defineProperty: Object.defineProperty,
    defineProperties: Object.defineProperties
  },
  setInterval: window.setInterval,
  setTimeout: window.setTimeout
}

/**
 * Mission Configuration Center Task Control Center
 * It is used to configure all tasks that cannot be performed in general processing. For example, the full -screen method of different websites is different. You must call the full screen logic of the website itself to ensure that subtitles, barrage and other normal work
 **/

class TCC {
  constructor(taskConf, doTaskFunc) {
    this.conf = taskConf || {
      /**
       * Configuration example
       * The parent key name corresponds to the first -level domain name,
       * The relevant function name corresponds to the sub -key name, and the key value corresponding to this function to be triggered by the click selector or the relevant function to be called
       * All sub -level key values support the use of selector trigger or function call
       * If the sub -level is configured, the sub -level configuration logic is operated, otherwise the default logic will be used
       * Note: In addition to the two sub -level keys, these two are used to match the URL range
       * */
      'demo.demo': {
        fullScreen: '.fullscreen-btn',
        exitFullScreen: '.exit-fullscreen-btn',
        webFullScreen: function () { },
        exitWebFullScreen: '.exit-fullscreen-btn',
        autoPlay: '.player-start-btn',
        pause: '.player-pause',
        play: '.player-play',
        switchPlayStatus: '.player-play',
        playbackRate: function () { },
        currentTime: function () { },
        addCurrentTime: '.add-currenttime',
        subtractCurrentTime: '.subtract-currenttime',
        // The execution method of custom shortcut keys, if it is a combination key, must be ctrl-->shift-->alt This order is not available, the key name must be fullycase
        shortcuts: {
          /* Register to execute the shortcut key to customize the callback operation */
          register: [
            'ctrl+shift+alt+c',
            'ctrl+shift+c',
            'ctrl+alt+c',
            'ctrl+c',
            'c'
          ],
          /* Customized shortcut bonding operation */
          callback: function (h5Player, taskConf, data) {
            const { event, player } = data
            console.log(event, player)
          }
        },
        /* The path information that needs to be included under the current domain name, all paths are available under the default entire domain name Must be regular */
        include: /^.*/,
        /* The path information needs to be excluded under the current domain name, and no path is not excluded by default Must be regular */
        exclude: /\t/
      }
    }

    // How to perform tasks should
    this.doTaskFunc = doTaskFunc instanceof Function ? doTaskFunc : function () { }
  }

  setTaskConf(taskConf) { this.conf = taskConf }

  /**
   * Get the domain name , At present, the implementation method is not good, and it needs to be transformed. For regional domain names (such as COM.CN), level three and above domain names are not supported well
   * */
  getDomain() {
    const host = window.location.host
    let domain = host
    const tmpArr = host.split('.')
    if (tmpArr.length > 2) {
      tmpArr.shift()
      domain = tmpArr.join('.')
    }
    return domain
  }

  /**
   * Formatting configuration task
   * @param isAll { boolean } -Optional The default format only format or host configuration task is formatted by the task configuration of all domain names in True
   */
  formatTCC(isAll) {
    const t = this
    const keys = Object.keys(t.conf)
    const domain = t.getDomain()
    const host = window.location.host

    function formatter(item) {
      const defObj = {
        include: /^.*/,
        exclude: /\t/
      }
      item.include = item.include || defObj.include
      item.exclude = item.exclude || defObj.exclude
      return item
    }

    const result = {}
    keys.forEach(function (key) {
      let item = t[key]
      if (isObj(item)) {
        if (isAll) {
          item = formatter(item)
          result[key] = item
        } else {
          if (key === host || key === domain) {
            item = formatter(item)
            result[key] = item
          }
        }
      }
    })
    return result
  }

  /* Determine whether the configuration task provided is applicable to the current URL */
  isMatch(taskConf) {
    const url = window.location.href
    let isMatch = false
    if (!taskConf.include && !taskConf.exclude) {
      isMatch = true
    } else {
      if (taskConf.include && taskConf.include.test(url)) {
        isMatch = true
      }
      if (taskConf.exclude && taskConf.exclude.test(url)) {
        isMatch = false
      }
    }
    return isMatch
  }

  /**
   * Get the task configuration, you can only get the task configuration information under the current domain name
   * @param taskName {string} -Optional Specify the specific task, and return all types of task configuration by default
   */
  getTaskConfig() {
    const t = this
    if (!t._hasFormatTCC_) {
      t.formatTCC()
      t._hasFormatTCC_ = true
    }
    const domain = t.getDomain()
    const taskConf = t.conf[window.location.host] || t.conf[domain]

    if (taskConf && t.isMatch(taskConf)) {
      return taskConf
    }

    return {}
  }

  /**
   * Execute the corresponding tasks under the current page
   * @param taskName {object|string} -Must be selected, you can directly pass the task configuration object, or it can also be used as a string information of the task name.
   * @param data {object} -Optional, data passed to the callback function
   */
  doTask(taskName, data) {
    const t = this
    let isDo = false
    if (!taskName) return isDo
    const taskConf = isObj(taskName) ? taskName : t.getTaskConfig()

    if (!isObj(taskConf) || !taskConf[taskName]) return isDo

    const task = taskConf[taskName]

    if (task) {
      isDo = t.doTaskFunc(taskName, taskConf, data)
    }

    return isDo
  }
}

class Debug {
  constructor(msg, printTime = false) {
    const t = this
    msg = msg || 'debug message:'
    t.log = t.createDebugMethod('log', null, msg)
    t.error = t.createDebugMethod('error', null, msg)
    t.info = t.createDebugMethod('info', null, msg)
    t.warn = t.createDebugMethod('warn', null, msg)
  }

  create(msg) {
    return new Debug(msg)
  }

  createDebugMethod(name, color, tipsMsg) {
    name = name || 'info'

    const bgColorMap = {
      info: '#2274A5',
      log: '#95B46A',
      warn: '#F5A623',
      error: '#D33F49'
    }

    const printTime = this.printTime

    return function () {
      if (!window._debugMode_) {
        return false
      }

      const msg = tipsMsg || 'debug message:'

      const arg = Array.from(arguments)
      arg.unshift(`color: white; background-color: ${color || bgColorMap[name] || '#95B46A'}`)

      if (printTime) {
        const curTime = new Date()
        const H = curTime.getHours()
        const M = curTime.getMinutes()
        const S = curTime.getSeconds()
        arg.unshift(`%c [${H}:${M}:${S}] ${msg} `)
      } else {
        arg.unshift(`%c ${msg} `)
      }

      window.console[name].apply(window.console, arg)
    }
  }

  isDebugMode() {
    return Boolean(window._debugMode_)
  }
}

var Debug$1 = new Debug()

var debug = Debug$1.create('h5player message:')

const $q = function (str) { return document.querySelector(str) }

/**
 * Mission Configuration Center Task Control Center
 * It is used to configure all tasks that cannot be performed in general processing. For example, the full -screen method of different websites is different. You must call the full screen logic of the website itself to ensure that subtitles, barrage and other normal work
 * */

const taskConf = {
  /**
   * Configuration example
   * The parent key name corresponds to the first -level domain name,
   * The relevant function name corresponds to the sub -key name, and the key value corresponding to this function to be triggered by the click selector or the relevant function to be called
   * All sub -level key values support the use of selector trigger or function call
   * If the sub -level is configured, the sub -level configuration logic is operated, otherwise the default logic will be used
   * Note: In addition to the two sub -level keys, these two are used to match the URL range
   * */
  'demo.demo': {
    // disable: true, // All functions of the plug -in in this domain name
    fullScreen: '.fullscreen-btn',
    exitFullScreen: '.exit-fullscreen-btn',
    webFullScreen: function () { },
    exitWebFullScreen: '.exit-fullscreen-btn',
    autoPlay: '.player-start-btn',
    // pause: ['.player-pause', '.player-pause02'], //When a variety of cases correspond to different selectors, they can use the array, and the plug -in will traverse the selector.
    pause: '.player-pause',
    play: '.player-play',
    switchPlayStatus: '.player-play',
    playbackRate: function () { },
    // playbackRate: true, // When setting True to a function, it means that the ability to control the website itself controls the video and ignore the ability of the plug -in
    currentTime: function () { },
    addCurrentTime: '.add-currenttime',
    subtractCurrentTime: '.subtract-currenttime',
    // The execution method of custom shortcut keys, if it is a combination key, must be ctrl-->shift-->alt This order is not available, the key name must be fullycase
    shortcuts: {
      /* Register to execute the shortcut key to customize the callback operation */
      register: [
        'ctrl+shift+alt+c',
        'ctrl+shift+c',
        'ctrl+alt+c',
        'ctrl+c',
        'c'
      ],
      /* Customized shortcut bonding operation */
      callback: function (h5Player, taskConf, data) {
        const { event, player } = data
        console.log(event, player)
      }
    },

    /* To prevent the website's own speed regulation and enhance the ability to break through the speed regulation limit */
    blockSetPlaybackRate: true,
    /* Prevent the logic of controlling the progress of the website itself, and enhance the ability to regulate the restrictions of breakthrough progress */
    blockSetCurrentTime: true,
    /* Prevent the logic of the volume control of the website itself and exclude the tuning interference of the website itself */
    blockSetVolume: true,

    /* The path information that needs to be included under the current domain name, all paths are available under the default entire domain name Must be regular */
    include: /^.*/,
    /* The path information needs to be excluded under the current domain name, and no path is not excluded by default Must be regular */
    exclude: /\t/
  },
  'youtube.com': {
    webFullScreen: 'button.ytp-size-button',
    fullScreen: 'button.ytp-fullscreen-button',
    next: '.ytp-next-button',
    shortcuts: {
      register: [
        'escape'
      ],
      callback: function (h5Player, taskConf, data) {
        const { event } = data
        if (event.keyCode === 27) {
          /* Cancel the video to play the next recommended video */
          if (document.querySelector('.ytp-upnext').style.display !== 'none') {
            document.querySelector('.ytp-upnext-cancel-button').click()
          }
        }
      }
    }
  },
  'netflix.com': {
    // Stop all the functions of using plug -in under netflix
    // disable: true,
    fullScreen: 'button.button-nfplayerFullscreen',
    addCurrentTime: 'button.button-nfplayerFastForward',
    subtractCurrentTime: 'button.button-nfplayerBackTen',
    /**
     * Use Netflix's own speed regulation, because the current plug -in cannot solve the problem of service interrupt caused by the speed regulation
     * https://github.com/xxxily/h5player/issues/234
     * https://github.com/xxxily/h5player/issues/317
     * https://github.com/xxxily/h5player/issues/381
     * https://github.com/xxxily/h5player/issues/179
     * https://github.com/xxxily/h5player/issues/147
     */
    playbackRate: true,
    shortcuts: {
      /**
       * TODO
       * netflix Some users are used to using the F key for full screen, so the next frame function of the F key is shielded here
       * After the follow -up custom configuration capabilities, let the user decide whether to block
       */
      register: [
        'f'
      ],
      callback: function (h5Player, taskConf, data) {
        return true
      }
    }
  },
  'bilibili.com': {
    fullScreen: function () {
      const fullScreen = $q('.bpx-player-ctrl-full') || $q('.squirtle-video-fullscreen') || $q('.bilibili-player-video-btn-fullscreen')
      if (fullScreen) {
        fullScreen.click()
        return true
      }
    },
    webFullScreen: function () {
      const oldWebFullscreen = $q('.bilibili-player-video-web-fullscreen')
      const webFullscreenEnter = $q('.bpx-player-ctrl-web-enter') || $q('.squirtle-pagefullscreen-inactive')
      const webFullscreenLeave = $q('.bpx-player-ctrl-web-leave') || $q('.squirtle-pagefullscreen-active')
      if (oldWebFullscreen || (webFullscreenEnter && webFullscreenLeave)) {
        const webFullscreen = oldWebFullscreen || (getComputedStyle(webFullscreenLeave).display === 'none' ? webFullscreenEnter : webFullscreenLeave)
        webFullscreen.click()

        /* Cancel the focus of the barrage frame and interfere with the operation of the shortcut key */
        setTimeout(function () {
          const danmaku = $q('.bpx-player-dm-input') || $q('.bilibili-player-video-danmaku-input')
          danmaku && danmaku.blur()
        }, 1000 * 0.1)

        return true
      }
    },
    autoPlay: ['.bpx-player-ctrl-play', '.squirtle-video-start', '.bilibili-player-video-btn-start'],
    switchPlayStatus: ['.bpx-player-ctrl-play', '.squirtle-video-start', '.bilibili-player-video-btn-start'],
    next: ['.bpx-player-ctrl-next', '.squirtle-video-next', '.bilibili-player-video-btn-next', '.bpx-player-ctrl-btn[aria-label="下一个"]'],
    init: function (h5Player, taskConf) { },
    shortcuts: {
      register: [
        'escape'
      ],
      callback: function (h5Player, taskConf, data) {
        const { event } = data
        if (event.keyCode === 27) {
          /* Exit the full screen of the webpage */
          const oldWebFullscreen = $q('.bilibili-player-video-web-fullscreen')
          if (oldWebFullscreen && oldWebFullscreen.classList.contains('closed')) {
            oldWebFullscreen.click()
          } else {
            const webFullscreenLeave = $q('.bpx-player-ctrl-web-leave') || $q('.squirtle-pagefullscreen-active')
            if (getComputedStyle(webFullscreenLeave).display !== 'none') {
              webFullscreenLeave.click()
            }
          }
        }
      }
    }
  },
  't.bilibili.com': {
    fullScreen: 'button[name="fullscreen-button"]'
  },
  'live.bilibili.com': {
    init: function () {
      if (!JSON._stringifySource_) {
        JSON._stringifySource_ = JSON.stringify

        JSON.stringify = function (arg1) {
          try {
            return JSON._stringifySource_.apply(this, arguments)
          } catch (e) {
            console.error('JSON.stringify Explain the error:', e, arg1)
          }
        }
      }
    },
    fullScreen: '.bilibili-live-player-video-controller-fullscreen-btn button',
    webFullScreen: '.bilibili-live-player-video-controller-web-fullscreen-btn button',
    switchPlayStatus: '.bilibili-live-player-video-controller-start-btn button'
  },
  'acfun.cn': {
    fullScreen: '[data-bind-key="screenTip"]',
    webFullScreen: '[data-bind-key="webTip"]',
    switchPlayStatus: function (h5player) {
      /* Can't grab control, so you have to delay judgment whether to intervene */
      const player = h5player.player()
      const status = player.paused
      setTimeout(function () {
        if (status === player.paused) {
          if (player.paused) {
            player.play()
          } else {
            player.pause()
          }
        }
      }, 200)
    }
  },
  'ixigua.com': {
    fullScreen: ['xg-fullscreen.xgplayer-fullscreen', '.xgplayer-control-item__entry[aria-label="全屏"]', '.xgplayer-control-item__entry[aria-label="Exit Full Screen"]'],
    webFullScreen: ['xg-cssfullscreen.xgplayer-cssfullscreen', '.xgplayer-control-item__entry[aria-label="Theater mode"]', '.xgplayer-control-item__entry[aria-label="Exit the theater mode"]']
  },
  'tv.sohu.com': {
    fullScreen: 'button[data-title="Full screen screen"]',
    webFullScreen: 'button[data-title="full screen"]'
  },
  'iqiyi.com': {
    fullScreen: '.iqp-btn-fullscreen',
    webFullScreen: '.iqp-btn-webscreen',
    next: '.iqp-btn-next',
    init: function (h5Player, taskConf) {
      // Hidden watermark
      hideDom('.iqp-logo-box')
      // Remove Paramount Advertising
      window.GM_addStyle(`
            div[templatetype="common_pause"]{ display:none }
            .iqp-logo-box{ display:none !important }
        `)
    }
  },
  'youku.com': {
    fullScreen: '.control-fullscreen-icon',
    next: '.control-next-video',
    init: function (h5Player, taskConf) {
      // Hidden watermark
      hideDom('.youku-layer-logo')
    }
  },
  'ted.com': {
    fullScreen: 'button.Fullscreen'
  },
  'qq.com': {
    pause: '.container_inner .txp-shadow-mod',
    play: '.container_inner .txp-shadow-mod',
    shortcuts: {
      register: ['c', 'x', 'z', '1', '2', '3', '4'],
      callback: function (h5Player, taskConf, data) {
        const { event } = data
        const key = event.key.toLowerCase()
        const keyName = 'customShortcuts_' + key

        if (!h5Player[keyName]) {
          /* Press the shortcut key for the first time to use the default logic for speed adjustment */
          h5Player[keyName] = {
            time: Date.now(),
            playbackRate: h5Player.playbackRate
          }
          return false
        } else {
          /* After the first operation, the operation within 200ms is adjusted by the default logic */
          if (Date.now() - h5Player[keyName].time < 200) {
            return false
          }

          /* Determine whether you need to be downgraded and use the sessionStorage for speed adjustment */
          if (h5Player[keyName] === h5Player.playbackRate || h5Player[keyName] === true) {
            if (window.sessionStorage.playbackRate && /(c|x|z|1|2|3|4)/.test(key)) {
              const curSpeed = Number(window.sessionStorage.playbackRate)
              const perSpeed = curSpeed - 0.1 >= 0 ? curSpeed - 0.1 : 0.1
              const nextSpeed = curSpeed + 0.1 <= 4 ? curSpeed + 0.1 : 4
              let targetSpeed = curSpeed
              switch (key) {
                case 'z':
                  targetSpeed = 1
                  break
                case 'c':
                  targetSpeed = nextSpeed
                  break
                case 'x':
                  targetSpeed = perSpeed
                  break
                default:
                  targetSpeed = Number(key)
                  break
              }

              window.sessionStorage.playbackRate = targetSpeed
              h5Player.setCurrentTime(0.01, true)
              h5Player.setPlaybackRate(targetSpeed, true)
              return true
            }

            /* The default speed regulation scheme is invalid, and the SESSIONSTORAGE speed regulation scheme is required */
            h5Player[keyName] = true
          } else {
            /* The default speed regulation scheme is effective */
            h5Player[keyName] = false
          }
        }
      }
    },
    fullScreen: 'txpdiv[data-report="window-fullscreen"]',
    webFullScreen: 'txpdiv[data-report="browser-fullscreen"]',
    next: 'txpdiv[data-report="play-next"]',
    init: function (h5Player, taskConf) {
      // Hidden watermark
      hideDom('.txp-watermark')
      hideDom('.txp-watermark-action')
    },
    include: /(v.qq|sports.qq)/
  },
  'pan.baidu.com': {
    fullScreen: function (h5Player, taskConf) {
      h5Player.player().parentNode.querySelector('.vjs-fullscreen-control').click()
    }
  },
  'pornhub.com': {
    fullScreen: 'div[class*="icon-fullscreen"]',
    webFullScreen: 'div[class*="icon-size-large"]'
  },
  'facebook.com': {
    fullScreen: function (h5Player, taskConf) {
      const actionBtn = h5Player.player().parentNode.querySelectorAll('button')
      if (actionBtn && actionBtn.length > 3) {
        /* Introduction to the penultimate button */
        actionBtn[actionBtn.length - 2].click()
        return true
      }
    },
    webFullScreen: function (h5Player, taskConf) {
      const actionBtn = h5Player.player().parentNode.querySelectorAll('button')
      if (actionBtn && actionBtn.length > 3) {
        /* Introduction to the penultimate button */
        actionBtn[actionBtn.length - 2].click()
        return true
      }
    },
    shortcuts: {
      /* Press the ESC key in the video mode and automatically return to the previous layer interface */
      register: [
        'escape'
      ],
      /* Customized shortcut bonding operation */
      callback: function (h5Player, taskConf, data) {
        eachParentNode(h5Player.player(), function (parentNode) {
          if (parentNode.getAttribute('data-fullscreen-container') === 'true') {
            const goBackBtn = parentNode.parentNode.querySelector('div>a>i>u')
            if (goBackBtn) {
              goBackBtn.parentNode.parentNode.click()
            }
            return true
          }
        })
      }
    }
  },
  'douyu.com': {
    fullScreen: function (h5Player, taskConf) {
      const player = h5Player.player()
      const container = player._fullScreen_.getContainer()
      if (player._isFullScreen_) {
        container.querySelector('div[title="Exit the window full screen"]').click()
      } else {
        container.querySelector('div[title="Full screen"]').click()
      }
      player._isFullScreen_ = !player._isFullScreen_
      return true
    },
    webFullScreen: function (h5Player, taskConf) {
      const player = h5Player.player()
      const container = player._fullScreen_.getContainer()
      if (player._isWebFullScreen_) {
        container.querySelector('div[title="Exit the full screen of the webpage"]').click()
      } else {
        container.querySelector('div[title="Full screen screen"]').click()
      }
      player._isWebFullScreen_ = !player._isWebFullScreen_
      return true
    }
  },
  'open.163.com': {
    init: function (h5Player, taskConf) {
      const player = h5Player.player()
      /**
       * Do not set the CORS logo, so as to cross -the -domain screenshots
       * https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image
       * https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_settings_attributes
       */
      player.setAttribute('crossOrigin', 'anonymous')
    }
  },
  'agefans.tv': {
    init: function (h5Player, taskConf) {
      h5Player.player().setAttribute('crossOrigin', 'anonymous')
    }
  },
  'chaoxing.com': {
    fullScreen: '.vjs-fullscreen-control'
  },
  'yixi.tv': {
    init: function (h5Player, taskConf) {
      h5Player.player().setAttribute('crossOrigin', 'anonymous')
    }
  },
  'douyin.com': {
    fullScreen: '.xgplayer-fullscreen',
    webFullScreen: '.xgplayer-page-full-screen',
    next: ['.xgplayer-playswitch-next'],
    init: function (h5Player, taskConf) {
      h5Player.player().setAttribute('crossOrigin', 'anonymous')
    }
  },
  'live.douyin.com': {
    fullScreen: '.xgplayer-fullscreen',
    webFullScreen: '.xgplayer-page-full-screen',
    next: ['.xgplayer-playswitch-next'],
    init: function (h5Player, taskConf) {
      h5Player.player().setAttribute('crossOrigin', 'anonymous')
    }
  },
  'zhihu.com': {
    fullScreen: ['button[aria-label="full screen"]', 'button[aria-label="Exit Full Screen"]'],
    play: function (h5Player, taskConf, data) {
      const player = h5Player.player()
      if (player && player.parentNode && player.parentNode.parentNode) {
        const maskWrap = player.parentNode.parentNode.querySelector('div~div:nth-child(3)')
        if (maskWrap) {
          const mask = maskWrap.querySelector('div')
          if (mask && mask.innerText === '') {
            mask.click()
          }
        }
      }
    },
    init: function (h5Player, taskConf) {
      h5Player.player().setAttribute('crossOrigin', 'anonymous')
    }
  },
  'weibo.com': {
    fullScreen: ['button.wbpv-fullscreen-control'],
    // webFullScreen: ['div[title="Turn off the bullet layer"]', 'div.wbpv-open-layer-button']
    webFullScreen: ['div.wbpv-open-layer-button']
  }
}

function h5PlayerTccInit(h5Player) {
  return new TCC(taskConf, function (taskName, taskConf, data) {
    try {
      const task = taskConf[taskName]
      const wrapDom = h5Player.getPlayerWrapDom()

      if (!task) { return }

      if (taskName === 'shortcuts') {
        if (isObj(task) && task.callback instanceof Function) {
          return task.callback(h5Player, taskConf, data)
        }
      } else if (task instanceof Function) {
        try {
          return task(h5Player, taskConf, data)
        } catch (e) {
          debug.error('The execution of the custom function of the task configuration center failed:', taskName, taskConf, data, e)
          return false
        }
      } else if (typeof task === 'boolean') {
        return task
      } else {
        const selectorList = Array.isArray(task) ? task : [task]
        for (let i = 0; i < selectorList.length; i++) {
          const selector = selectorList[i]

          /* Trigger a click event on the selector */
          if (wrapDom && wrapDom.querySelector(selector)) {
            // Find in Video's parent element is to compat with the logic of multiple instances as much as possible
            wrapDom.querySelector(selector).click()
            return true
          } else if (document.querySelector(selector)) {
            document.querySelector(selector).click()
            return true
          }
        }
      }
    } catch (e) {
      debug.error('The execution of the custom task execution of the task configuration center failed:', taskName, taskConf, data, e)
      return false
    }
  })
}

function mergeTaskConf(config) {
  return mergeObj(taskConf, config)
}

/* UA camouflage configuration */
const fakeConfig = {
  // 'tv.cctv.com': userAgentMap.iPhone.chrome,
  // 'v.qq.com': userAgentMap.iPad.chrome,
  'open.163.com': userAgentMap.iPhone.chrome,
  'm.open.163.com': userAgentMap.iPhone.chrome
}

function setFakeUA(ua) {
  const host = window.location.host
  ua = ua || fakeConfig[host]

  /**
   * Dynamic judgment requires UA camouflage
   * The following scheme is temporarily unavailable
   * Due to the inconsistent domain names of some websites to the after -mobile terminal, cross -domain issues are formed
   * As a result, it is impossible to synchronize camouflage configuration and constantly die in a cycle
   * eg. open.163.com
   * */
  // let customUA = window.localStorage.getItem('_h5_player_user_agent_')
  // debug.log(customUA, window.location.href, window.navigator.userAgent, document.referrer)
  // if (customUA) {
  //   fakeUA(customUA)
  //   alert(customUA)
  // } else {
  //   alert('ua false')
  // }

  ua && fakeUA(ua)
}

/**
 * The element full screen API, compatible with the full screen of the web page
 */

hackAttachShadow()
class FullScreen {
  constructor(dom, pageMode) {
    this.dom = dom
    this.shadowRoot = null
    this.fullStatus = false
    // The default full -screen mode, if it is introduced to the PageMode, it means that the full screen operation of the page is performed.
    this.pageMode = pageMode || false
    const fullPageStyle = `
        ._webfullscreen_box_size_ {
          width: 100% !important;
          height: 100% !important;
        }
        ._webfullscreen_ {
          display: block !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
          background: #000 !important;
          z-index: 999999 !important;
        }
        ._webfullscreen_zindex_ {
          z-index: 999999 !important;
        }
      `
    /* Insert style into the global page */
    if (!window._hasInitFullPageStyle_ && window.GM_addStyle) {
      window.GM_addStyle(fullPageStyle)
      window._hasInitFullPageStyle_ = true
    }

    /* Insert the style into the shadowroot */
    const shadowRoot = isInShadow(dom, true)
    if (shadowRoot) {
      this.shadowRoot = shadowRoot
      loadCSSText(fullPageStyle, 'fullPageStyle', shadowRoot)
    }

    const t = this
    window.addEventListener('keyup', (event) => {
      const key = event.key.toLowerCase()
      if (key === 'escape') {
        if (t.isFull()) {
          t.exit()
        } else if (t.isFullScreen()) {
          t.exitFullScreen()
        }
      }
    }, true)

    this.getContainer()
  }

  eachParentNode(dom, fn) {
    let parent = dom.parentNode
    while (parent && parent.classList) {
      const isEnd = fn(parent, dom)
      parent = parent.parentNode
      if (isEnd) {
        break
      }
    }
  }

  getContainer() {
    const t = this
    if (t._container_) return t._container_

    const d = t.dom
    const domBox = d.getBoundingClientRect()
    let container = d
    t.eachParentNode(d, function (parentNode) {
      const noParentNode = !parentNode || !parentNode.getBoundingClientRect
      if (noParentNode || parentNode.getAttribute('data-fullscreen-container')) {
        container = parentNode
        return true
      }

      const parentBox = parentNode.getBoundingClientRect()
      const isInsideTheBox = parentBox.width <= domBox.width && parentBox.height <= domBox.height
      if (isInsideTheBox) {
        container = parentNode
      } else {
        return true
      }
    })

    container.setAttribute('data-fullscreen-container', 'true')
    t._container_ = container
    return container
  }

  isFull() {
    return this.dom.classList.contains('_webfullscreen_') || this.fullStatus
  }

  isFullScreen() {
    const d = document
    return !!(d.fullscreen || d.webkitIsFullScreen || d.mozFullScreen ||
      d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement)
  }

  enterFullScreen() {
    const c = this.getContainer()
    const enterFn = c.requestFullscreen || c.webkitRequestFullScreen || c.mozRequestFullScreen || c.msRequestFullScreen
    enterFn && enterFn.call(c)
  }

  enter() {
    const t = this
    if (t.isFull()) return
    const container = t.getContainer()
    let needSetIndex = false
    if (t.dom === container) {
      needSetIndex = true
    }

    function addFullscreenStyleToParentNode(node) {
      t.eachParentNode(node, function (parentNode) {
        parentNode.classList.add('_webfullscreen_')
        if (container === parentNode || needSetIndex) {
          needSetIndex = true
          parentNode.classList.add('_webfullscreen_zindex_')
        }
      })
    }
    addFullscreenStyleToParentNode(t.dom)

    /* Determine whether DOM itself needs to add WebFullScreen style */
    if (t.dom.parentNode) {
      const domBox = t.dom.getBoundingClientRect()
      const domParentBox = t.dom.parentNode.getBoundingClientRect()
      if (domParentBox.width - domBox.width >= 5) {
        t.dom.classList.add('_webfullscreen_')
      }

      if (t.shadowRoot && t.shadowRoot._shadowHost) {
        const shadowHost = t.shadowRoot._shadowHost
        const shadowHostBox = shadowHost.getBoundingClientRect()
        if (shadowHostBox.width <= domBox.width) {
          shadowHost.classList.add('_webfullscreen_')
          addFullscreenStyleToParentNode(shadowHost)
        }
      }
    }

    const fullScreenMode = !t.pageMode
    if (fullScreenMode) {
      t.enterFullScreen()
    }

    this.fullStatus = true
  }

  exitFullScreen() {
    const d = document
    const exitFn = d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen || d.msExitFullscreen
    exitFn && exitFn.call(d)
  }

  exit() {
    const t = this

    function removeFullscreenStyleToParentNode(node) {
      t.eachParentNode(node, function (parentNode) {
        parentNode.classList.remove('_webfullscreen_')
        parentNode.classList.remove('_webfullscreen_zindex_')
      })
    }
    removeFullscreenStyleToParentNode(t.dom)

    t.dom.classList.remove('_webfullscreen_')

    if (t.shadowRoot && t.shadowRoot._shadowHost) {
      const shadowHost = t.shadowRoot._shadowHost
      shadowHost.classList.remove('_webfullscreen_')
      removeFullscreenStyleToParentNode(shadowHost)
    }

    const fullScreenMode = !t.pageMode
    if (fullScreenMode || t.isFullScreen()) {
      t.exitFullScreen()
    }
    this.fullStatus = false
  }

  toggle() {
    this.isFull() ? this.exit() : this.enter()
  }
}

/*!
* @name      videoCapturer.js
* @version   0.0.1
* @author    Blaze
* @date      2019/9/21 12:03
* @github    https://github.com/xxxily
*/

async function setClipboard(blob) {
  if (navigator.clipboard) {
    navigator.clipboard.write([
      // eslint-disable-next-line no-undef
      new ClipboardItem({
        [blob.type]: blob
      })
    ]).then(() => {
      console.info('[setClipboard] clipboard suc')
    }).catch((e) => {
      console.error('[setClipboard] clipboard err', e)
    })
  } else {
    console.error('The current website does not support writing data into the clipboard. See:\n https://developer.mozilla.org/en-US/docs/Web/API/Clipboard')
  }
}

var videoCapturer = {
  /**
   * Screenshot operation
   * @param video {dom} -required video dom Label
   * @returns {boolean}
   */
  capture(video, download, title) {
    if (!video) return false
    const t = this
    const currentTime = `${Math.floor(video.currentTime / 60)}'${(video.currentTime % 60).toFixed(3)}''`
    const captureTitle = title || `${document.title}_${currentTime}`

    /* Screenshot core logic */
    video.setAttribute('crossorigin', 'anonymous')
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    if (download) {
      t.download(canvas, captureTitle, video)
    } else {
      t.previe(canvas, captureTitle)
    }

    return canvas
  },
  /**
   * Preview The content of the screen intercepted
   * @param canvas
   */
  previe(canvas, title) {
    canvas.style = 'max-width:100%'
    const previewPage = window.open('', '_blank')
    previewPage.document.title = `capture previe - ${title || 'Untitled'}`
    previewPage.document.body.style.textAlign = 'center'
    previewPage.document.body.style.background = '#000'
    previewPage.document.body.appendChild(canvas)
  },
  /**
   * canvas Download the contents of the interception
   * @param canvas
   */
  download(canvas, title, video) {
    title = title || 'videoCapturer_' + Date.now()

    try {
      canvas.toBlob(function (blob) {
        const el = document.createElement('a')
        el.download = `${title}.jpg`
        el.href = URL.createObjectURL(blob)
        el.click()

        /* Try to copy to the clipboard */
        setClipboard(blob)
      }, 'image/jpg', 0.99)
    } catch (e) {
      videoCapturer.previe(canvas, title)
      console.error('The video source is limited by the CORS logo, and the screenshot cannot be downloaded directly. See:\n https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS')
      console.error(video, e)
    }
  }
}

/**
 * Mouse event observation object
 * Used to achieve penetration response of mouse events, different from Pointer-events:none
 * pointer-events:None is setting the current layer to allow penetration
 * And MouseobServer is: Even if you don’t know how many layers of obstruction exists on Target, you can also respond to mouse events
 */

class MouseObserver {
  constructor(observeOpt) {
    // eslint-disable-next-line no-undef
    this.observer = new IntersectionObserver((infoList) => {
      infoList.forEach((info) => {
        info.target.IntersectionObserverEntry = info
      })
    }, observeOpt || {})

    this.observeList = []
  }

  _observe(target) {
    let hasObserve = false
    for (let i = 0; i < this.observeList.length; i++) {
      const el = this.observeList[i]
      if (target === el) {
        hasObserve = true
        break
      }
    }

    if (!hasObserve) {
      this.observer.observe(target)
      this.observeList.push(target)
    }
  }

  _unobserve(target) {
    this.observer.unobserve(target)
    const newObserveList = []
    this.observeList.forEach((el) => {
      if (el !== target) {
        newObserveList.push(el)
      }
    })
    this.observeList = newObserveList
  }

  /**
   * Increase event binding
   * @param target {element} -required To bind the DOM object of the event
   * @param type {string} -required The event to be binding only supports mouse events
   * @param listener {function} -required The response function that meets the trigger conditions
   */
  on(target, type, listener, options) {
    const t = this
    t._observe(target)

    if (!target.MouseObserverEvent) {
      target.MouseObserverEvent = {}
    }
    target.MouseObserverEvent[type] = true

    if (!t._mouseObserver_) {
      t._mouseObserver_ = {}
    }

    if (!t._mouseObserver_[type]) {
      t._mouseObserver_[type] = []

      window.addEventListener(type, (event) => {
        t.observeList.forEach((target) => {
          const isVisibility = target.IntersectionObserverEntry && target.IntersectionObserverEntry.intersectionRatio > 0
          const isReg = target.MouseObserverEvent[event.type] === true
          if (isVisibility && isReg) {
            /* Determine whether it meets the triggering conditions of the hearing device */
            const bound = target.getBoundingClientRect()
            const offsetX = event.x - bound.x
            const offsetY = event.y - bound.y
            const isNeedTap = offsetX <= bound.width && offsetX >= 0 && offsetY <= bound.height && offsetY >= 0

            if (isNeedTap) {
              /* Execute the monitoring recovery */
              const listenerList = t._mouseObserver_[type]
              listenerList.forEach((listener) => {
                if (listener instanceof Function) {
                  listener.call(t, event, {
                    x: offsetX,
                    y: offsetY
                  }, target)
                }
              })
            }
          }
        })
      }, options)
    }

    /* Add the monitor recovery to the incident queue */
    if (listener instanceof Function) {
      t._mouseObserver_[type].push(listener)
    }
  }

  /**
   * Lie incident binding
   * @param target {element} -required To relieve the DOM object of the event
   * @param type {string} -required The event to be lifted only supports mouse events
   * @param listener {function} -required The response function during the binding event
   * @returns {boolean}
   */
  off(target, type, listener) {
    const t = this
    if (!target || !type || !listener || !t._mouseObserver_ || !t._mouseObserver_[type] || !target.MouseObserverEvent || !target.MouseObserverEvent[type]) return false

    const newListenerList = []
    const listenerList = t._mouseObserver_[type]
    let isMatch = false
    listenerList.forEach((listenerItem) => {
      if (listenerItem === listener) {
        isMatch = true
      } else {
        newListenerList.push(listenerItem)
      }
    })

    if (isMatch) {
      t._mouseObserver_[type] = newListenerList

      /* The listener has been completely removed */
      if (newListenerList.length === 0) {
        delete target.MouseObserverEvent[type]
      }

      /* When the Mouseobserverevent is an empty object, the observation object is removed */
      if (JSON.stringify(target.MouseObserverEvent[type]) === '{}') {
        t._unobserve(target)
      }
    }
  }
}

/**
 * Simple I18N library
 */

class I18n {
  constructor(config) {
    this._languages = {}
    this._locale = this.getClientLang()
    this._defaultLanguage = ''
    this.init(config)
  }

  init(config) {
    if (!config) return false

    const t = this
    t._locale = config.locale || t._locale
    /* Specify that if the current language environment is used, the default does not need to be specified by default, and it will automatically read automatically */
    t._languages = config.languages || t._languages
    t._defaultLanguage = config.defaultLanguage || t._defaultLanguage
  }

  use() { }

  t(path) {
    const t = this
    let result = t.getValByPath(t._languages[t._locale] || {}, path)

    /* Version back */
    if (!result && t._locale !== t._defaultLanguage) {
      result = t.getValByPath(t._languages[t._defaultLanguage] || {}, path)
    }

    return result || ''
  }

  /* Current language value */
  language() {
    return this._locale
  }

  languages() {
    return this._languages
  }

  changeLanguage(locale) {
    if (this._languages[locale]) {
      this._languages = locale
      return locale
    } else {
      return false
    }
  }

  /**
   * Get the value in the object according to the text path
   * @param obj {Object} -required Object to be operated
   * @param path {String} -required Path information
   * @returns {*}
   */
  getValByPath(obj, path) {
    path = path || ''
    const pathArr = path.split('.')
    let result = obj

    /* Recursive extraction result value */
    for (let i = 0; i < pathArr.length; i++) {
      if (!result) break
      result = result[pathArr[i]]
    }

    return result
  }

  /* Get the current language environment of the client */
  getClientLang() {
    return navigator.languages ? navigator.languages[0] : navigator.language
  }
}

var enUS = {
  website: 'Script Website',
  about: 'About',
  issues: 'Issues',
  setting: 'Setting',
  hotkeys: 'Hotkeys',
  donate: 'Donate',
  openCrossOriginFramePage: 'Open cross-domain pages alone',
  disableInitAutoPlay: 'Prohibit autoplay of videos on this site',
  enableInitAutoPlay: 'Allow autoplay videos on this site',
  restoreConfiguration: 'Restore the global default configuration',
  blockSetPlaybackRate: 'Disable default speed regulation logic',
  blockSetCurrentTime: 'Disable default playback progress control logic',
  blockSetVolume: 'Disable default volume control logic',
  unblockSetPlaybackRate: 'Allow default speed adjustment logic',
  unblockSetCurrentTime: 'Allow default playback progress control logic',
  unblockSetVolume: 'Allow default volume control logic',
  allowAcousticGain: 'Turn on volume boost',
  notAllowAcousticGain: 'Disable volume boost ability',
  allowCrossOriginControl: 'Enable cross-domain control capability',
  notAllowCrossOriginControl: 'Disable cross-domain control capabilities',
  allowExperimentFeatures: 'Turn on experimental features',
  notAllowExperimentFeatures: 'Disable experimental features',
  experimentFeaturesWarning: 'Experimental features are likely to cause some uncertain problems, please turn on with caution',
  allowExternalCustomConfiguration: 'Enable external customization capabilities',
  notAllowExternalCustomConfiguration: 'Turn off external customization capabilities',
  configFail: 'Configuration failed',
  globalSetting: 'Global Settings',
  localSetting: 'For this site only',
  openDebugMode: 'Enable debug mode',
  closeDebugMode: 'Turn off debug mode',
  unfoldMenu: 'Expand menu',
  foldMenu: 'Collapse menu',
  tipsMsg: {
    playspeed: 'Speed: ',
    forward: 'Forward: ',
    backward: 'Backward: ',
    seconds: 'sec',
    volume: 'Volume: ',
    nextframe: 'Next frame',
    previousframe: 'Previous frame',
    stopframe: 'Stopframe: ',
    play: 'Play',
    pause: 'Pause',
    arpl: 'Allow auto resume playback progress',
    drpl: 'Disable auto resume playback progress',
    brightness: 'Brightness: ',
    contrast: 'Contrast: ',
    saturation: 'Saturation: ',
    hue: 'HUE: ',
    blur: 'Blur: ',
    imgattrreset: 'Attributes: reset',
    imgrotate: 'Picture rotation: ',
    onplugin: 'ON h5Player plugin',
    offplugin: 'OFF h5Player plugin',
    globalmode: 'Global mode: ',
    playbackrestored: 'Restored the last playback progress for you',
    playbackrestoreoff: 'The function of restoring the playback progress is disabled. Press SHIFT+R to turn on the function',
    horizontal: 'Horizontal displacement: ',
    vertical: 'Vertical displacement: ',
    horizontalMirror: 'Horizontal mirror',
    verticalMirror: 'vertical mirror',
    videozoom: 'Video zoom: '
  },
  demo: 'demo-test'
}

const messages = {
  'en-US': enUS,
  en: enUS,
}

const i18n = new I18n({
  defaultLanguage: 'en',
  /* Specify that if the current language environment is used, the default does not need to be specified by default, and it will automatically read automatically */
  locale: 'en-US',
  languages: messages
})

/* Used to obtain the unique ID of the global */
let __globalId__ = 0
function getId() {
  if (window.GM_getValue && window.GM_setValue) {
    let gID = window.GM_getValue('_global_id_')
    if (!gID) gID = 0
    gID = Number(gID) + 1
    window.GM_setValue('_global_id_', gID)
    return gID
  } else {
    /* If it is not under the oil monkey plug -in, the ID is the ID that the page itself is exclusive */
    __globalId__ = Number(__globalId__) + 1
    return __globalId__
  }
}

let curTabId = null

/**
 * Get the ID number of the current TAB label, which can be used for iframe to determine whether you are in the same TAB tag
 * @returns {Promise<any>}
 */
function getTabId() {
  return new Promise((resolve, reject) => {
    if (window.GM_getTab instanceof Function) {
      window.GM_getTab(function (obj) {
        if (!obj.tabId) {
          obj.tabId = getId()
          window.GM_saveTab(obj)
        }
        /* Update the ID number of the current TAB every time */
        curTabId = obj.tabId
        resolve(obj.tabId)
      })
    } else {
      /* Under the non -oil monkey plug -in, it is impossible to determine whether iframe is under the same TAB */
      resolve(Date.now())
    }
  })
}

/* From the beginning, initialize Curtabid, so that there is no need to obtain tabid asynchronous in the future. In some scenarios, you need to use it */
getTabId()

/*!
* @name      monkeyMsg.js
* @version   0.0.1
* @author    Blaze
* @date      2019/9/21 14:22
*/
// import debug from './debug'

/**
 * Extract the value in the object data to the value in GM_SETVALUE
 * @param obj {objcet} -required Data planned to store objects
 * @param deep {number} -Optional If the object level is very deep, the level of recursion must be limited, and the highest default cannot exceed level 3
 * @returns {{}}
 */
function extractDatafromOb(obj, deep) {
  deep = deep || 1
  if (deep > 3) return {}

  const result = {}
  if (typeof obj === 'object') {
    for (const key in obj) {
      const val = obj[key]
      const valType = typeof val
      if (valType === 'number' || valType === 'string' || valType === 'boolean') {
        Object.defineProperty(result, key, {
          value: val,
          writable: true,
          configurable: true,
          enumerable: true
        })
      } else if (valType === 'object' && Object.prototype.propertyIsEnumerable.call(obj, key)) {
        /* Recursive extraction */
        result[key] = extractDatafromOb(val, deep + 1)
      } else if (valType === 'array') {
        result[key] = val
      }
    }
  }
  return result
}

const monkeyMsg = {
  /**
   * Send messages, in addition to sending information normally, it will also supplement various necessary information
   * @param name {string} -required To send it to that field, it must be consistent when receiving it to monitor the correctness
   * @param data {Any} -required Data to be sent
   * @param throttleInterval -Optional, because there will be an inexplicable repeated sending situation, in order to eliminate the side effects of repeated sending, the introduction of the logic of the throttling restrictions, that is, it can only be sent once within a certain time interval.
   * @returns {Promise<void>}
   */
  send(name, data, throttleInterval = 80) {
    if (!window.GM_getValue || !window.GM_setValue) {
      return false
    }

    /* Prevent frequently sending modification events */
    const oldMsg = window.GM_getValue(name)
    if (oldMsg && oldMsg.updateTime) {
      const interval = Math.abs(Date.now() - oldMsg.updateTime)
      if (interval < throttleInterval) {
        return false
      }
    }

    const msg = {
      /* Send data */
      data,
      /* Supplementary tag ID to determine whether it is in the same TAB tag */
      tabId: curTabId || 'undefined',
      /* The title information of the page source of the supplementary message */
      title: document.title,
      /* Page source information for supplementary messages */
      referrer: extractDatafromOb(window.location),
      /* The last time the data is updated */
      updateTime: Date.now()
    }
    if (typeof data === 'object') {
      msg.data = extractDatafromOb(data)
    }
    window.GM_setValue(name, msg)

    // debug.info(`[monkeyMsg-send][${name}]`, msg)
  },
  set: (name, data) => monkeyMsg.send(name, data),
  get: (name) => window.GM_getValue && window.GM_getValue(name),
  on: (name, fn) => window.GM_addValueChangeListener && window.GM_addValueChangeListener(name, function (name, oldVal, newVal, remote) {
    // debug.info(`[monkeyMsg-on][${name}]`, oldVal, newVal, remote)

    /* Does the supplementary message source come from the judgment field of the same TAB? */
    newVal.originTab = newVal.tabId === curTabId

    fn instanceof Function && fn.apply(null, arguments)
  }),
  off: (listenerId) => window.GM_removeValueChangeListener && window.GM_removeValueChangeListener(listenerId),

  /**
   * Monkeymsg message broadcast, the broadcast is sent once every two seconds, and other pages can be connected to the broadcast information to update some variable information
   * It is mainly used to solve the problem that the non -running or execution frequency of the variable state cannot be correctly updated through the visual state and performance strategies caused by the visual state and performance strategies of the SetInterval or Settimeout.
   * See: https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API
   * Broadcasting cannot be 100%Ensure that it is not affected by performance strategies, but as long as one webpage is running at the front desk, it can work normally
   * @param handler {Function} -required The callback function when receiving the broadcast information
   * @returns
   */
  broadcast(handler) {
    const broadcastName = '__monkeyMsgBroadcast__'
    monkeyMsg._monkeyMsgBroadcastHandler_ = monkeyMsg._monkeyMsgBroadcastHandler_ || []
    handler instanceof Function && monkeyMsg._monkeyMsgBroadcastHandler_.push(handler)

    if (monkeyMsg._hasMonkeyMsgBroadcast_) {
      return broadcastName
    }

    monkeyMsg.on(broadcastName, function () {
      monkeyMsg._monkeyMsgBroadcastHandler_.forEach(handler => {
        handler.apply(null, arguments)
      })
    })

    setInterval(function () {
      /* To prevent multiple pages from batch broadcast information by limited time interval */
      const data = monkeyMsg.get(broadcastName)
      if (data && Date.now() - data.updateTime < 1000 * 2) {
        return false
      }

      monkeyMsg.send(broadcastName, {})
    }, 1000 * 2)

    return broadcastName
  }
}

/* The shortcut keys currently used */
const hasUseKey = {
  keyCodeList: [13, 16, 17, 18, 27, 32, 37, 38, 39, 40, 49, 50, 51, 52, 67, 68, 69, 70, 73, 74, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 220],
  keyList: ['enter', 'shift', 'control', 'alt', 'escape', ' ', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', '1', '2', '3', '4', 'c', 'd', 'e', 'f', 'i', 'j', 'k', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z', '\\', '|'],
  keyMap: { enter: 13, shift: 16, ctrl: 17, alt: 18, esc: 27, space: 32, '←': 37, '↑': 38, '→': 39, '↓': 40, 1: 49, 2: 50, 3: 51, 4: 52, c: 67, d: 68, e: 69, f: 70, i: 73, j: 74, k: 75, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, w: 87, x: 88, y: 89, z: 90, pad1: 97, pad2: 98, pad3: 99, pad4: 100, '\\': 220 }
}

/**
 * Determine whether the current keys are registered as a key that needs to be used
 * Used to reduce interference to other key positions
 */
function isRegisterKey(event) {
  const keyCode = event.keyCode
  const key = event.key.toLowerCase()
  return hasUseKey.keyCodeList.includes(keyCode) ||
    hasUseKey.keyList.includes(key)
}

/**
 * Since TamperMonkey encapsulates the Window object, the Window we actually visited is not the real Window of the page
 * This causes it to be mounted if we need to mount some objects to the page of the page for debugging
 * Therefore, we must use special means to access the real Window object of the page, so there is a function below
 * @returns {Promise<void>}
 */
async function getPageWindow() {
  return new Promise(function (resolve, reject) {
    if (window._pageWindow) {
      return resolve(window._pageWindow)
    }

    /* Try to obtain pageswindow in a synchronous manner */
    try {
      const pageWin = getPageWindowSync()
      if (pageWin && pageWin.document && pageWin.XMLHttpRequest) {
        window._pageWindow = pageWin
        resolve(pageWin)
        return pageWin
      }
    } catch (e) { }

    /* The following method of obtaining Pagewindow is not effective in the latest Chrome browser */

    const listenEventList = ['load', 'mousemove', 'scroll', 'get-page-window-event']

    function getWin(event) {
      window._pageWindow = this
      // debug.log('getPageWindow succeed', event)
      listenEventList.forEach(eventType => {
        window.removeEventListener(eventType, getWin, true)
      })
      resolve(window._pageWindow)
    }

    listenEventList.forEach(eventType => {
      window.addEventListener(eventType, getWin, true)
    })

    /* The self -proofing incident can be obtained in the shortest time to obtain the Pagewindow object */
    window.dispatchEvent(new window.Event('get-page-window-event'))
  })
}
getPageWindow()

/**
 * Get PAGEWINDOW in a synchronous manner
 * Pay attention to the method of simultaneous acquisition that requires the script into the head. Some websites cannot be obtained normally because the security strategy will cause the writing failure
 * @returns {*}
 */
function getPageWindowSync(rawFunction) {
  if (window.unsafeWindow) return window.unsafeWindow
  if (document._win_) return document._win_

  try {
    rawFunction = rawFunction || window.__rawFunction__ || Function.prototype.constructor
    // return rawFunction('return window')()
    // Function('return (function(){}.constructor("return this")());')
    return rawFunction('return (function(){}.constructor("var getPageWindowSync=1; return this")());')()
  } catch (e) {
    console.error('getPageWindowSync error', e)

    const head = document.head || document.querySelector('head')
    const script = document.createElement('script')
    script.appendChild(document.createTextNode('document._win_ = window'))
    head.appendChild(script)

    return document._win_
  }
}

function openInTab(url, opts, referer) {
  if (referer) {
    const urlObj = parseURL(url)
    if (!urlObj.params.referer) {
      urlObj.params.referer = encodeURIComponent(window.location.href)
      url = stringifyToUrl(urlObj)
    }
  }

  if (window.GM_openInTab) {
    window.GM_openInTab(url, opts || {
      active: true,
      insert: true,
      setParent: true
    })
  }
}

/* Make sure the number is positive */
function numUp(num) {
  if (typeof num === 'number' && num < 0) {
    num = Math.abs(num)
  }
  return num
}

/* Make sure the number is negative */
function numDown(num) {
  if (typeof num === 'number' && num > 0) {
    num = -num
  }
  return num
}

function isMediaElement(element) {
  return element && (element instanceof HTMLMediaElement || element.HTMLMediaElement || element.HTMLVideoElement || element.HTMLAudioElement)
}

function isVideoElement(element) {
  return element && (element instanceof HTMLVideoElement || element.HTMLVideoElement)
}

function isAudioElement(element) {
  return element && (element instanceof HTMLAudioElement || element.HTMLAudioElement)
}

/*!
* @name         crossTabCtl.js
* @description  Cross Tab control script logic
* @version      0.0.1
* @author       Blaze
* @date         2019/11/21 11 am:56
* @github       https://github.com/xxxily
*/

const crossTabCtl = {
  /* When performing cross -TAB control, exclude the shortcut key to forward to reduce the interference of important shortcut keys */
  excludeShortcuts(event) {
    if (!event || typeof event.keyCode === 'undefined') {
      return false
    }

    const excludeKeyCode = ['c', 'v', 'f', 'd']

    if (event.ctrlKey || event.metaKey) {
      const key = event.key.toLowerCase()
      if (excludeKeyCode.includes(key)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  /* When the unexpected exit is exited, the LeavePictionInPiction event will not be called, so you can only update the painting information in the painting by rotating inquiries */
  updatePictureInPictureInfo() {
    setInterval(function () {
      if (document.pictureInPictureElement) {
        monkeyMsg.send('globalPictureInPictureInfo', {
          usePictureInPicture: true
        })
      }
    }, 1000 * 1.5)

    /**
     * Update the GlobalPitalPictureInPictionInfo through SetInterval will be influenced by page visibility and performance strategies without being updated
     * See: https://developer.mozilla.org/zh-CN/docs/Web/api/Page_Visibility_API
     * So to calibrate the GlobalPictionInppicTureInfo status by adding MonkeyMSG broadcasting mechanism
     */
    monkeyMsg.broadcast(function () {
      // console.log('[monkeyMsg][broadcast]', ...arguments)
      if (document.pictureInPictureElement) {
        monkeyMsg.send('globalPictureInPictureInfo', {
          usePictureInPicture: true
        })
      }
    })
  },
  /* Determine whether the current painting function is turned on */
  hasOpenPictureInPicture() {
    const data = monkeyMsg.get('globalPictureInPictureInfo')

    /* The overall information update time difference between painting in painting is within 3S, so I think that the painting mode in the painting is currently turned on, otherwise it may be unexpectedly exited without modifying the value of the USEPICTURENPICTURETURE, causing misjudgments */
    if (data && data.data) {
      if (data.data.usePictureInPicture) {
        return Math.abs(Date.now() - data.updateTime) < 1000 * 3
      } else {
        /**
         * The painting in the painting has been closed, but if it has not been closed for too long, it is allowed to allow users to cross TAB control videos across the TAB within a short period of time.
         * For example: pause video playback
         */
        return Math.abs(Date.now() - data.updateTime) < 1000 * 15
      }
    }

    return false
  },
  /**
   * Determine whether you need to send a cross -TAB control button information
   */
  isNeedSendCrossTabCtlEvent() {
    const t = crossTabCtl

    /* After the painting is turned on, the judgment is not sent to the same TAB incident */
    const data = monkeyMsg.get('globalPictureInPictureInfo')
    if (t.hasOpenPictureInPicture() && data.tabId !== curTabId) {
      return true
    } else {
      return false
    }
  },
  crossTabKeydownEvent(event) {
    const t = crossTabCtl
    /* Do not perform any shortcut keys in editing elements */
    if (isEditableTarget(event.target)) return
    if (t.isNeedSendCrossTabCtlEvent() && isRegisterKey(event) && !t.excludeShortcuts(event)) {
      // Prevent incident bubbling and default events
      event.stopPropagation()
      event.preventDefault()

      /* Broadcast button message, perform cross -TAB control */
      // Keydownevent has contained GlobalKeyDownevent event
      // monkeyMsg.send('globalKeydownEvent', event)

      return true
    }
  },
  bindCrossTabEvent() {
    const t = crossTabCtl
    if (t._hasBindEvent_) return
    document.removeEventListener('keydown', t.crossTabKeydownEvent)
    document.addEventListener('keydown', t.crossTabKeydownEvent, true)
    t._hasBindEvent_ = true
  },
  init() {
    const t = crossTabCtl
    t.updatePictureInPictureInfo()
    t.bindCrossTabEvent()
  }
}

/*!
* @name         index.js
* @description  hookJs JS AOP cut surface programming auxiliary library
* @version      0.0.1
* @author       Blaze
* @date         2020/10/22 17:40
* @github       https://github.com/xxxily
*/

const win = typeof window === 'undefined' ? global : window
const toStr = Function.prototype.call.bind(Object.prototype.toString)
/* Special scenes, if Boolean is also hook, it is easy to cause call overflow, so you need to use the native Boolean */
const toBoolean = Boolean.originMethod ? Boolean.originMethod : Boolean
const util = {
  toStr,
  isObj: obj => toStr(obj) === '[object Object]',
  /* Determine whether it is a reference type, for a broader scene */
  isRef: obj => typeof obj === 'object',
  isReg: obj => toStr(obj) === '[object RegExp]',
  isFn: obj => obj instanceof Function,
  isAsyncFn: fn => toStr(fn) === '[object AsyncFunction]',
  isPromise: obj => toStr(obj) === '[object Promise]',
  firstUpperCase: str => str.replace(/^\S/, s => s.toUpperCase()),
  toArr: arg => Array.from(Array.isArray(arg) ? arg : [arg]),

  debug: {
    log() {
      let log = win.console.log
      /* If the log is also HOOK, use the log function before the hook */
      if (log.originMethod) { log = log.originMethod }
      if (win._debugMode_) {
        log.apply(win.console, arguments)
      }
    }
  },
  /* Get the key name that includes itself, inheritance, enumeration, and indispensable */
  getAllKeys(obj) {
    const tmpArr = []
    for (const key in obj) { tmpArr.push(key) }
    const allKeys = Array.from(new Set(tmpArr.concat(Reflect.ownKeys(obj))))
    return allKeys
  }
}

class HookJs {
  constructor(useProxy) {
    this.useProxy = useProxy || false
    this.hookPropertiesKeyName = '_hookProperties' + Date.now()
  }

  hookJsPro() {
    return new HookJs(true)
  }

  _addHook(hookMethod, fn, type, classHook) {
    const hookKeyName = type + 'Hooks'
    const hookMethodProperties = hookMethod[this.hookPropertiesKeyName]
    if (!hookMethodProperties[hookKeyName]) {
      hookMethodProperties[hookKeyName] = []
    }

    /* Register (stored) the HOOK function to be called, while preventing repeated registration at the same time */
    let hasSameHook = false
    for (let i = 0; i < hookMethodProperties[hookKeyName].length; i++) {
      if (fn === hookMethodProperties[hookKeyName][i]) {
        hasSameHook = true
        break
      }
    }

    if (!hasSameHook) {
      fn.classHook = classHook || false
      hookMethodProperties[hookKeyName].push(fn)
    }
  }

  _runHooks(parentObj, methodName, originMethod, hookMethod, target, ctx, args, classHook, hookPropertiesKeyName) {
    const hookMethodProperties = hookMethod[hookPropertiesKeyName]
    const beforeHooks = hookMethodProperties.beforeHooks || []
    const afterHooks = hookMethodProperties.afterHooks || []
    const errorHooks = hookMethodProperties.errorHooks || []
    const hangUpHooks = hookMethodProperties.hangUpHooks || []
    const replaceHooks = hookMethodProperties.replaceHooks || []
    const execInfo = {
      result: null,
      error: null,
      args: args,
      type: ''
    }

    function runHooks(hooks, type) {
      let hookResult = null
      execInfo.type = type || ''
      if (Array.isArray(hooks)) {
        hooks.forEach(fn => {
          if (util.isFn(fn) && classHook === fn.classHook) {
            hookResult = fn(args, parentObj, methodName, originMethod, execInfo, ctx)
          }
        })
      }
      return hookResult
    }

    const runTarget = (function () {
      if (classHook) {
        return function () {
          // eslint-disable-next-line new-cap
          return new target(...args)
        }
      } else {
        return function () {
          return target.apply(ctx, args)
        }
      }
    })()

    const beforeHooksResult = runHooks(beforeHooks, 'before')
    /* Support instructions to terminate subsequent calls */
    if (beforeHooksResult && beforeHooksResult === 'STOP-INVOKE') {
      return beforeHooksResult
    }

    if (hangUpHooks.length || replaceHooks.length) {
      /**
       * When there is HanguPhooks or Replacehooks, it will not trigger the original function
       * In essence, HangupHooks and Replacehooks are the same, but the external definition description is inconsistent and the classification is inconsistent.
       */
      runHooks(hangUpHooks, 'hangUp')
      runHooks(replaceHooks, 'replace')
    } else {
      if (errorHooks.length) {
        try {
          execInfo.result = runTarget()
        } catch (err) {
          execInfo.error = err
          const errorHooksResult = runHooks(errorHooks, 'error')
          /* Do not throw an abnormal instruction after supporting the execution error */
          if (errorHooksResult && errorHooksResult === 'SKIP-ERROR'); else {
            throw err
          }
        }
      } else {
        execInfo.result = runTarget()
      }
    }

    /**
     * After executing afterhooks, if the Promise is returned, further segmentation should be performed in theory
     * However, after adding the subdivision logic, it is found that the performance has fallen fell, and it is prone to various abnormalities.
     * The following is the original Promise processing logic. After adding, it will cause the following website to be stuck or not accessible:
     * wenku.baidu.com
     * https://pubs.rsc.org/en/content/articlelanding/2021/sc/d1sc01881g#!divAbstract
     * https://www.elsevier.com/connect/coronavirus-information-center
     */
    // if (execInfo.result && execInfo.result.then && util.isPromise(execInfo.result)) {
    //   execInfo.result.then(function (data) {
    //     execInfo.result = data
    //     runHooks(afterHooks, 'after')
    //     return Promise.resolve.apply(ctx, arguments)
    //   }).catch(function (err) {
    //     execInfo.error = err
    //     runHooks(errorHooks, 'error')
    //     return Promise.reject.apply(ctx, arguments)
    //   })
    // }

    runHooks(afterHooks, 'after')

    return execInfo.result
  }

  _proxyMethodcGenerator(parentObj, methodName, originMethod, classHook, context, proxyHandler) {
    const t = this
    const useProxy = t.useProxy
    let hookMethod = null

    /* If there is a cache, use the cache hookMethod */
    if (t.isHook(originMethod)) {
      hookMethod = originMethod
    } else if (originMethod[t.hookPropertiesKeyName] && t.isHook(originMethod[t.hookPropertiesKeyName].hookMethod)) {
      hookMethod = originMethod[t.hookPropertiesKeyName].hookMethod
    }

    if (hookMethod) {
      if (!hookMethod[t.hookPropertiesKeyName].isHook) {
        /* Re -marked the state of the hook */
        hookMethod[t.hookPropertiesKeyName].isHook = true
        util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`)
      }
      return hookMethod
    }

    /* Using the Proxy mode for HOOK can get more features, but the performance will be slightly worse */
    if (useProxy && Proxy) {
      /* Note: Use Proxy proxy, HookMethod and OriginMethod will share the same object */
      const handler = { ...proxyHandler }

      /* The following writing determines that Proxyhandler cannot cover the Construction and Apply operation */
      if (classHook) {
        handler.construct = function (target, args, newTarget) {
          context = context || this
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, context, args, true, t.hookPropertiesKeyName)
        }
      } else {
        handler.apply = function (target, ctx, args) {
          ctx = context || ctx
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, ctx, args, false, t.hookPropertiesKeyName)
        }
      }

      hookMethod = new Proxy(originMethod, handler)
    } else {
      hookMethod = function () {
        /**
         * Note that you cannot pass here context = context || this
         * Then pass the context as CTX
         * This will cause ctx reference errors
         */
        const ctx = context || this
        return t._runHooks(parentObj, methodName, originMethod, hookMethod, originMethod, ctx, arguments, classHook, t.hookPropertiesKeyName)
      }

      /* Make sure the sub -object and prototype chain are consistent with OriginMethod */
      const keys = Reflect.ownKeys(originMethod)
      keys.forEach(keyName => {
        try {
          Object.defineProperty(hookMethod, keyName, {
            get: function () {
              return originMethod[keyName]
            },
            set: function (val) {
              originMethod[keyName] = val
            }
          })
        } catch (err) {
          // When setting defineProperty, an abnormalities may cause some functions of HookMethod to be true, or it may not be affected
          util.debug.log(`[proxyMethodcGenerator] hookMethod defineProperty abnormal.  hookMethod:${methodName}, definePropertyName:${keyName}`, err)
        }
      })
      hookMethod.prototype = originMethod.prototype
    }

    const hookMethodProperties = hookMethod[t.hookPropertiesKeyName] = {}

    hookMethodProperties.originMethod = originMethod
    hookMethodProperties.hookMethod = hookMethod
    hookMethodProperties.isHook = true
    hookMethodProperties.classHook = classHook

    util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`)

    return hookMethod
  }

  _getObjKeysByRule(obj, rule) {
    let excludeRule = null
    let result = rule

    if (util.isObj(rule) && rule.include) {
      excludeRule = rule.exclude
      rule = rule.include
      result = rule
    }

    /**
     * for in、Object.keys与Reflect.See the difference between OWNKEYS:
     * https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E9%81%8D%E5%8E%86
     */
    if (rule === '*') {
      result = Object.keys(obj)
    } else if (rule === '**') {
      result = Reflect.ownKeys(obj)
    } else if (rule === '***') {
      result = util.getAllKeys(obj)
    } else if (util.isReg(rule)) {
      result = util.getAllKeys(obj).filter(keyName => rule.test(keyName))
    }

    /* If there are rules for exclusion, you need to exclude */
    if (excludeRule) {
      result = Array.isArray(result) ? result : [result]
      if (util.isReg(excludeRule)) {
        result = result.filter(keyName => !excludeRule.test(keyName))
      } else if (Array.isArray(excludeRule)) {
        result = result.filter(keyName => !excludeRule.includes(keyName))
      } else {
        result = result.filter(keyName => excludeRule !== keyName)
      }
    }

    return util.toArr(result)
  }

  /**
   * Determine whether a function has been HOOK
   * @param fn {Function} -required The function to be judged
   * @returns {boolean}
   */
  isHook(fn) {
    if (!fn || !fn[this.hookPropertiesKeyName]) {
      return false
    }
    const hookMethodProperties = fn[this.hookPropertiesKeyName]
    return util.isFn(hookMethodProperties.originMethod) && fn !== hookMethodProperties.originMethod
  }

  /**
   * Determine whether the value of a certain value under the object is the conditions of the hook
   * Note: It is two different ways to have hook conditions and whether it can be directly modified.
   * When doing hook, check the descriptor.writable是否为false
   * If for false, it is necessary to modify it to true before the hook success
   * @param parentObj
   * @param keyName
   * @returns {boolean}
   */
  isAllowHook(parentObj, keyName) {
    /* Some objects will set getter to let the read value throw the mistake, so you need to try catch Determine whether you can read the attribute normally */
    try { if (!parentObj[keyName]) return false } catch (e) { return false }
    const descriptor = Object.getOwnPropertyDescriptor(parentObj, keyName)
    return !(descriptor && descriptor.configurable === false)
  }

  /**
   * hook Core function
   * @param parentObj {Object} -required The parent object depended on the HOOK function
   * @param hookMethods {Object|Array|RegExp|string} -required The matching rules of the function name or function name of the HOOK function
   * @param fn {Function} -required The callback method after hook
   * @param type {String} -Optional By default, the timing of running the HOOK function callback is specified, and you can choose a string: BeFore, after, Replace, ERROR, Hangup
   * @param classHook {Boolean} -Optional Default FALSE, specify whether it is for new (class) operation
   * @param context {Object} -Optional Specify the context object when running the hook function
   * @param proxyHandler {Object} -Optional It is effective when using HOOK with proxy, the apply of proxy is used by default Handler performs hook, if you have special needs, you can also configure your own handler to achieve more complex functions
   * Note: You can get higher performance without using Proxy for HOOK, but it also means that the universalability is worse. For HOOK HTMLElement.prototype、EventTarget.The non -instance functions in these objects in Prototype often fail, causing an error in executing by the HOOK function
   * @returns {boolean}
   */
  hook(parentObj, hookMethods, fn, type, classHook, context, proxyHandler) {
    classHook = toBoolean(classHook)
    type = type || 'before'

    if ((!util.isRef(parentObj) && !util.isFn(parentObj)) || !util.isFn(fn) || !hookMethods) {
      return false
    }

    const t = this

    hookMethods = t._getObjKeysByRule(parentObj, hookMethods)
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] does not support modification`)
        return false
      }

      const descriptor = Object.getOwnPropertyDescriptor(parentObj, methodName)
      if (descriptor && descriptor.writable === false) {
        Object.defineProperty(parentObj, methodName, { writable: true })
      }

      const originMethod = parentObj[methodName]
      let hookMethod = null

      /* Non -function cannot perform hook operations */
      if (!util.isFn(originMethod)) {
        return false
      }

      hookMethod = t._proxyMethodcGenerator(parentObj, methodName, originMethod, classHook, context, proxyHandler)

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName]
      if (hookMethodProperties.classHook !== classHook) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] Cannot support functions hook and classes hook at the same time `)
        return false
      }

      /* Use HookMethod to take over the way to take over */
      if (parentObj[methodName] !== hookMethod) {
        parentObj[methodName] = hookMethod
      }

      t._addHook(hookMethod, fn, type, classHook)
    })
  }

  /* HOOK, which is specifically operated by New, is essentially the alias of the hook function. You can less pass the parameter of Classhook, and clear the semantics */
  hookClass(parentObj, hookMethods, fn, type, context, proxyHandler) {
    return this.hook(parentObj, hookMethods, fn, type, true, context, proxyHandler)
  }

  /**
   * Cancel HOOK for a function
   * @param parentObj {Object} -必选 To cancel the parent object dependent on the hook function
   * @param hookMethods {Object|Array|RegExp|string} -required To cancel the matching rules of the function name or function name of the HOOK function
   * @param type {String} -Optional By default before, specify the hook type to be canceled, optional string: BeFore, After, Replace, ERROR, Hangup, if you do not specify the option, cancel all the calls under all types,
   * @param fn {Function} -required Cancel the specified hook callback function, if the option is not specified, cancel all the callbacks under the corresponding type type
   * @returns {boolean}
   */
  unHook(parentObj, hookMethods, type, fn) {
    if (!util.isRef(parentObj) || !hookMethods) {
      return false
    }

    const t = this
    hookMethods = t._getObjKeysByRule(parentObj, hookMethods)
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        return false
      }

      const hookMethod = parentObj[methodName]

      if (!t.isHook(hookMethod)) {
        return false
      }

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName]
      const originMethod = hookMethodProperties.originMethod

      if (type) {
        const hookKeyName = type + 'Hooks'
        const hooks = hookMethodProperties[hookKeyName] || []

        if (fn) {
          /* Delete the specified HOOK function under the specified type */
          for (let i = 0; i < hooks.length; i++) {
            if (fn === hooks[i]) {
              hookMethodProperties[hookKeyName].splice(i, 1)
              util.debug.log(`[unHook ${hookKeyName} func] ${util.toStr(parentObj)} ${methodName}`, fn)
              break
            }
          }
        } else {
          /* Delete all the hook functions under the specified typeook functions under the specified type */
          if (Array.isArray(hookMethodProperties[hookKeyName])) {
            hookMethodProperties[hookKeyName] = []
            util.debug.log(`[unHook all ${hookKeyName}] ${util.toStr(parentObj)} ${methodName}`)
          }
        }
      } else {
        /* Fully restore the function of being HOOKe the function of being HOOK */
        if (util.isFn(originMethod)) {
          parentObj[methodName] = originMethod
          delete parentObj[methodName][t.hookPropertiesKeyName]

          // Object.keys(hookMethod).forEach(keyName => {
          //   if (/Hooks$/.test(keyName) && Array.isArray(hookMethod[keyName])) {
          //     hookMethod[keyName] = []
          //   }
          // })
          //
          // hookMethod.isHook = false
          // parentObj[methodName] = originMethod
          // delete parentObj[methodName].originMethod
          // delete parentObj[methodName].hookMethod
          // delete parentObj[methodName].isHook
          // delete parentObj[methodName].isClassHook

          util.debug.log(`[unHook method] ${util.toStr(parentObj)} ${methodName}`)
        }
      }
    })
  }

  /* HOOK before the source function runs the source function runs */
  before(obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'before', classHook, context, proxyHandler)
  }

  /* HOOK after the source function runsthe source function runs */
  after(obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'after', classHook, context, proxyHandler)
  }

  /* Replace the function of hook, no longer run the source function, and replace it with other logic, no longer run the source function, and replace it with other logic */
  replace(obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'replace', classHook, context, proxyHandler)
  }

  /* Hook when the source function runs error */
  error(obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'error', classHook, context, proxyHandler)
  }

  /* The underlying implementation logic is the same as REPLACE. They all replace the functions that want to hook. They no longer run the source function, but just to clear the semantics, hang the source function and no longer execute.For other logic, please use replace hook */
  hangUp(obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'hangUp', classHook, context, proxyHandler)
  }
}

var hookJs = new HookJs()

/**
 * Forbidden to lock on Playbackrate
 * Some players will prevent modifying Playbackrate
 * Cutting the modification of PlayBackrate through hackDefinePROPERTY
 * reference: https://greasyfork.org/zh-CN/scripts/372673
 */

function hackDefineProperCore(target, key, option) {
  if (option && target && target instanceof Element && typeof key === 'string' && key.indexOf('on') >= 0) {
    option.configurable = true
  }

  if (target instanceof HTMLVideoElement) {
    const unLockProperties = ['playbackRate', 'currentTime', 'volume', 'muted']
    if (unLockProperties.includes(key)) {
      if (!option.configurable) {
        debug.log(`Prohibit${key}Lock`)
        option.configurable = true
        key = key + '_hack'
      }
    }
  }

  return [target, key, option]
}

function hackDefineProperOnError(args, parentObj, methodName, originMethod, execInfo, ctx) {
  debug.error(`${methodName} error:`, execInfo.error)

  /* Ignore execution abnormality */
  return 'SKIP-ERROR'
}

function hackDefineProperty() {
  hookJs.before(Object, 'defineProperty', function (args, parentObj, methodName, originMethod, execInfo, ctx) {
    const option = args[2]
    const ele = args[0]
    const key = args[1]
    const afterArgs = hackDefineProperCore(ele, key, option)
    afterArgs.forEach((arg, i) => {
      args[i] = arg
    })
  })

  hookJs.before(Object, 'defineProperties', function (args, parentObj, methodName, originMethod, execInfo, ctx) {
    const properties = args[1]
    const ele = args[0]
    if (ele && ele instanceof Element) {
      Object.keys(properties).forEach(key => {
        const option = properties[key]
        const afterArgs = hackDefineProperCore(ele, key, option)
        args[0] = afterArgs[0]
        delete properties[key]
        properties[afterArgs[1]] = afterArgs[2]
      })
    }
  })

  hookJs.error(Object, 'defineProperty', hackDefineProperOnError)
  hookJs.error(Object, 'defineProperties', hackDefineProperOnError)
}

/*!
* @name      menuCommand.js
* @version   0.0.1
* @author    Blaze
* @date      2019/9/21 14:22
*/

const monkeyMenu = {
  menuIds: {},
  on(title, fn, accessKey) {
    if (title instanceof Function) {
      title = title()
    }

    if (window.GM_registerMenuCommand) {
      const menuId = window.GM_registerMenuCommand(title, fn, accessKey)

      this.menuIds[menuId] = {
        title,
        fn,
        accessKey
      }

      return menuId
    }
  },

  off(id) {
    if (window.GM_unregisterMenuCommand) {
      delete this.menuIds[id]

      /**
       * When removing the registered buttons in batches, the menu residue will be left on some poor performance machines
       * It should be a bug caused by the plug -in itself, which cannot be solved for the time being
       * So the menu is not removed for the time being, tampermonkey will automatically merge the menu of the same name
       */
      // return window.GM_unregisterMenuCommand(id)
    }
  },

  clear() {
    Object.keys(this.menuIds).forEach(id => {
      this.off(id)
    })
  },

  /**
   * Register in batches through the menu configuration, all the menus registered before registration will be cleared before registration
   * @param {array|function} menuOpts The menu configuration, if the function is the function, the function will be called to get the menu configuration, and the menu will be created after the menu is clicked to achieve the dynamic update of the menu
   */
  build(menuOpts) {
    this.clear()

    if (Array.isArray(menuOpts)) {
      menuOpts.forEach(menu => {
        if (menu.disable === true) { return }
        this.on(menu.title, menu.fn, menu.accessKey)
      })
    } else if (menuOpts instanceof Function) {
      const menuList = menuOpts()
      if (Array.isArray(menuList)) {
        this._menuBuilder_ = menuOpts

        menuList.forEach(menu => {
          if (menu.disable === true) { return }

          const menuFn = () => {
            try {
              menu.fn.apply(menu, arguments)
            } catch (e) {
              console.error('[monkeyMenu]', menu.title, e)
            }

            // After each menu click, re -register the menu, which can ensure that the state of the menu is the latest
            setTimeout(() => {
              // console.log('[monkeyMenu rebuild]', menu.title)
              this.build(this._menuBuilder_)
            }, 100)
          }

          this.on(menu.title, menuFn, menu.accessKey)
        })
      } else {
        console.error('monkeyMenu build error, no menuList return', menuOpts)
      }
    }
  }
}

/*!
* @name         menuManager.js
* @description  Menu manager
* @version      0.0.1
* @author       xxxily
* @date         2022/08/11 10:05
* @github       https://github.com/xxxily
*/

function refreshPage(msg) {
  msg = msg || 'The configuration has been changed, and immediately refresh the page to make the configuration effective?'
  const status = confirm(msg)
  if (status) {
    window.location.reload()
  }
}

let monkeyMenuList = [
  // {
  //   title: i18n.t('website'),
  //   fn: () => {
  //     openInTab('https://h5player.anzz.top/')
  //   }
  // },
  // {
  //   title: i18n.t('hotkeys'),
  //   fn: () => {
  //     openInTab('https://h5player.anzz.top/home/Introduction.html#%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%88%97%E8%A1%A8')
  //   }
  // },
  // {
  //   title: i18n.t('issues'),
  //   disable: !configManager.get('enhance.unfoldMenu'),
  //   fn: () => {
  //     openInTab('https://github.com/xxxily/h5player/issues')
  //   }
  // },
  // {
  //   title: i18n.t('donate'),
  //   fn: () => {
  //     openInTab('https://h5player.anzz.top/#%E8%B5%9E')
  //   }
  // },
  // {
  //   title: `${configManager.get('enhance.unfoldMenu') ? i18n.t('foldMenu') : i18n.t('unfoldMenu')} 「${i18n.t('globalSetting')}」`,
  //   fn: () => {
  //     const confirm = window.confirm(configManager.get('enhance.unfoldMenu') ? i18n.t('foldMenu') : i18n.t('unfoldMenu'))
  //     if (confirm) {
  //       configManager.setGlobalStorage('enhance.unfoldMenu', !configManager.get('enhance.unfoldMenu'))
  //       window.location.reload()
  //     }
  //   }
  // },
  // {
  //   title: i18n.t('setting'),
  //   disable: true,
  //   fn: () => {
  //     openInTab('https://h5player.anzz.top/configure/', null, true)
  //     window.alert('In functional development, stay tuned...')
  //   }
  // },
  // {
  //   title: i18n.t('restoreConfiguration'),
  //   disable: !configManager.get('enhance.unfoldMenu'),
  //   fn: () => {
  //     configManager.clear()
  //     refreshPage()
  //   }
  // }
]

/* The menu constructor (must be a function to dynamically update the menu status after clicking) */
function menuBuilder() {
  return monkeyMenuList
}

/* Register dynamic menu */
function menuRegister() {
  monkeyMenu.build(menuBuilder)
}

/**
 * Add menu item
 * @param {Object|Array} menuOpts The configuration item of the menu, the number of multiple configuration items is expressed by the array
 */
function addMenu(menuOpts, before) {
  menuOpts = Array.isArray(menuOpts) ? menuOpts : [menuOpts]
  menuOpts = menuOpts.filter(item => item.title && !item.disabled)

  if (before) {
    /* Add the menu to the front of other menus */
    monkeyMenuList = menuOpts.concat(monkeyMenuList)
  } else {
    monkeyMenuList = monkeyMenuList.concat(menuOpts)
  }

  /* Re -register */
  menuRegister()
}

/**
 * Register the menu related to H5Player, and only the media label is detected if the media labels will register
 */
function registerH5playerMenus(h5player) {
  const t = h5player
  const player = t.player()
  const foldMenu = !configManager.get('enhance.unfoldMenu')

  if (player && !t._hasRegisterH5playerMenus_) {
    const menus = [
      // {
      //   title: () => i18n.t('openCrossOriginFramePage'),
      //   disable: foldMenu || !isInCrossOriginFrame(),
      //   fn: () => {
      //     openInTab(location.href)
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.blockSetCurrentTime') ? i18n.t('unblockSetCurrentTime') : i18n.t('blockSetCurrentTime')} 「${i18n.t('localSetting')}」`,
      //   type: 'local',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.blockSetCurrentTime') ? i18n.t('unblockSetCurrentTime') : i18n.t('blockSetCurrentTime'))
      //     if (confirm) {
      //       configManager.setLocalStorage('enhance.blockSetCurrentTime', !configManager.get('enhance.blockSetCurrentTime'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.blockSetVolume') ? i18n.t('unblockSetVolume') : i18n.t('blockSetVolume')} 「${i18n.t('localSetting')}」`,
      //   type: 'local',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.blockSetVolume') ? i18n.t('unblockSetVolume') : i18n.t('blockSetVolume'))
      //     if (confirm) {
      //       configManager.setLocalStorage('enhance.blockSetVolume', !configManager.get('enhance.blockSetVolume'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.blockSetPlaybackRate') ? i18n.t('unblockSetPlaybackRate') : i18n.t('blockSetPlaybackRate')} 「${i18n.t('globalSetting')}」`,
      //   type: 'global',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.blockSetPlaybackRate') ? i18n.t('unblockSetPlaybackRate') : i18n.t('blockSetPlaybackRate'))
      //     if (confirm) {
      //       /* The double -speed parameter can only be set globally-speed parameter can only be set globally */
      //       configManager.setGlobalStorage('enhance.blockSetPlaybackRate', !configManager.get('enhance.blockSetPlaybackRate'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.allowAcousticGain') ? i18n.t('notAllowAcousticGain') : i18n.t('allowAcousticGain')} 「${i18n.t('globalSetting')}」`,
      //   type: 'global',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.allowAcousticGain') ? i18n.t('notAllowAcousticGain') : i18n.t('allowAcousticGain'))
      //     if (confirm) {
      //       configManager.setGlobalStorage('enhance.allowAcousticGain', !configManager.getGlobalStorage('enhance.allowAcousticGain'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.allowCrossOriginControl') ? i18n.t('notAllowCrossOriginControl') : i18n.t('allowCrossOriginControl')} 「${i18n.t('globalSetting')}」`,
      //   type: 'global',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.allowCrossOriginControl') ? i18n.t('notAllowCrossOriginControl') : i18n.t('allowCrossOriginControl'))
      //     if (confirm) {
      //       configManager.setGlobalStorage('enhance.allowCrossOriginControl', !configManager.getGlobalStorage('enhance.allowCrossOriginControl'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.allowExperimentFeatures') ? i18n.t('notAllowExperimentFeatures') : i18n.t('allowExperimentFeatures')} 「${i18n.t('globalSetting')}」`,
      //   type: 'global',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.allowExperimentFeatures') ? i18n.t('notAllowExperimentFeatures') : i18n.t('experimentFeaturesWarning'))
      //     if (confirm) {
      //       configManager.setGlobalStorage('enhance.allowExperimentFeatures', !configManager.get('enhance.allowExperimentFeatures'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.get('enhance.allowExternalCustomConfiguration') ? i18n.t('notAllowExternalCustomConfiguration') : i18n.t('allowExternalCustomConfiguration')} 「${i18n.t('globalSetting')}」`,
      //   type: 'global',
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.get('enhance.allowExternalCustomConfiguration') ? i18n.t('notAllowExternalCustomConfiguration') : i18n.t('allowExternalCustomConfiguration'))
      //     if (confirm) {
      //       configManager.setGlobalStorage('enhance.allowExternalCustomConfiguration', !configManager.getGlobalStorage('enhance.allowExternalCustomConfiguration'))
      //       window.location.reload()
      //     }
      //   }
      // },
      // {
      //   title: () => `${configManager.getGlobalStorage('debug') ? i18n.t('closeDebugMode') : i18n.t('openDebugMode')} 「${i18n.t('globalSetting')}」`,
      //   disable: foldMenu,
      //   fn: () => {
      //     const confirm = window.confirm(configManager.getGlobalStorage('debug') ? i18n.t('closeDebugMode') : i18n.t('openDebugMode'))
      //     if (confirm) {
      //       configManager.setGlobalStorage('debug', !configManager.getGlobalStorage('debug'))
      //       window.location.reload()
      //     }
      //   }
      // }
    ]

    let titlePrefix = ''
    if (isInIframe()) {
      titlePrefix = `[${location.hostname}]`

      /* Supplement Title prefix */
      menus.forEach(menu => {
        const titleFn = menu.title
        if (titleFn instanceof Function && menu.type === 'local') {
          menu.title = () => titlePrefix + titleFn()
        }
      })
    }

    addMenu(menus)

    t._hasRegisterH5playerMenus_ = true
  }
}

/**
   * Acting video player's event registration and cancellation of registration functions to debug or block the registration event
   * @param {*} player
   * @returns
   */
function proxyHTMLMediaElementEvent() {
  if (HTMLMediaElement.prototype._rawAddEventListener_) {
    return false
  }

  HTMLMediaElement.prototype._rawAddEventListener_ = HTMLMediaElement.prototype.addEventListener
  HTMLMediaElement.prototype._rawRemoveEventListener_ = HTMLMediaElement.prototype.removeEventListener

  HTMLMediaElement.prototype.addEventListener = new Proxy(HTMLMediaElement.prototype.addEventListener, {
    apply(target, ctx, args) {
      const eventName = args[0]
      const listener = args[1]
      if (listener instanceof Function && eventName === 'ratechange') {
        /* Test the registered RateChange event. If there is an abnormal behavior, try to hang the event */

        args[1] = new Proxy(listener, {
          apply(target, ctx, args) {
            if (ctx) {
              /* Prevent speed adjustment, and proceed to prevent it */
              if (ctx.playbackRate && eventName === 'ratechange') {
                if (ctx._hasBlockRatechangeEvent_) {
                  return true
                }

                const oldRate = ctx.playbackRate
                const startTime = Date.now()

                const result = target.apply(ctx, args)

                /**
                 * By determining whether the rate before and after the execution of RateChange is changed,
                 * And whether there is a long execution time (maybe alert pop -up window) to detect whether there may be a way to prevent speed adjustment
                 * Other testing methods to be supplemented
                 */
                const blockRatechangeBehave1 = oldRate !== ctx.playbackRate || Date.now() - startTime > 1000
                const blockRatechangeBehave2 = ctx._setPlaybackRate_ && ctx._setPlaybackRate_.value !== ctx.playbackRate
                if (blockRatechangeBehave1 || blockRatechangeBehave2) {
                  debug.info(`[execVideoEvent][${eventName}]It is prohibited${eventName}Execution of events`, listener)
                  ctx._hasBlockRatechangeEvent_ = true
                  return true
                } else {
                  return result
                }
              }
            }

            try {
              return target.apply(ctx, args)
            } catch (e) {
              debug.error(`[proxyPlayerEvent][${eventName}]`, listener, e)
            }
          }
        })
      }

      return target.apply(ctx, args)
    }
  })
}

/*!
* @name         hotkeysRunner.js
* @description  Hot -key operator, realize the hot key configuration method similar to VSCode
* @version      0.0.1
* @author       xxxily
* @date         2022/11/23 18:22
* @github       https://github.com/xxxily
*/

const Map$1 = window.Map
const WeakMap = window.WeakMap
function isObj$1(obj) { return Object.prototype.toString.call(obj) === '[object Object]' }

function getValByPath$1(obj, path) {
  path = path || ''
  const pathArr = path.split('.')
  let result = obj

  /* Recursive extraction result valueve extraction result value */
  for (let i = 0; i < pathArr.length; i++) {
    if (!result) break
    result = result[pathArr[i]]
  }

  return result
}

function toArrArgs(args) {
  return Array.isArray(args) ? args : (typeof args === 'undefined' ? [] : [args])
}

function isModifierKey(key) {
  return [
    'ctrl', 'controlleft', 'controlright',
    'shift', 'shiftleft', 'shiftright',
    'alt', 'altleft', 'altright',
    'meta', 'metaleft', 'metaright',
    'capsLock'].includes(key.toLowerCase())
}

const keyAlias = {
  ControlLeft: 'ctrl',
  ControlRight: 'ctrl',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'meta',
  MetaRight: 'meta'
}

const combinationKeysMonitor = (function () {
  const combinationKeysState = new Map$1()

  const hasInit = new WeakMap()

  function init(win = window) {
    if (!win || win !== win.self || !win.addEventListener || hasInit.get(win)) {
      return false
    }

    const timers = {}

    function activeCombinationKeysState(event) {
      isModifierKey(event.code) && combinationKeysState.set(event.code, true)
    }

    function inactivateCombinationKeysState(event) {
      if (!(event instanceof KeyboardEvent)) {
        combinationKeysState.forEach((val, key) => {
          combinationKeysState.set(key, false)
        })
        return true
      }

      /**
       * CombiningKeysState must be kept for a period of time, otherwise when the keyup incident is defined, it is also executed first because this registration first.e when the keyup incident is defined, it is also executed first because this registration first.
       * Change the CombinationKeysState state immediately, which will cause the event that the later definition is obtained by the state of the non -activated combination key which will cause the event that the later definition is obtained by the state of the non -activated combination key
       */
      if (isModifierKey(event.code)) {
        clearTimeout(timers[event.code])
        timers[event.code] = setTimeout(() => { combinationKeysState.set(event.code, false) }, 50)
      }
    }

    win.addEventListener('keydown', activeCombinationKeysState, true)
    win.addEventListener('keypress', activeCombinationKeysState, true)
    win.addEventListener('keyup', inactivateCombinationKeysState, true)
    win.addEventListener('blur', inactivateCombinationKeysState, true)

    hasInit.set(win, true)
  }

  function getCombinationKeys() {
    const result = new Map$1()
    combinationKeysState.forEach((val, key) => {
      if (val === true) {
        result.set(key, val)
      }
    })
    return result
  }

  return {
    combinationKeysState,
    getCombinationKeys,
    init
  }
})()

class HotkeysRunner {
  constructor(hotkeys) {
    /* Mac and Window's modifiers are differentfiers are different */
    this.MOD = typeof navigator === 'object' && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'Meta' : 'Control'

    this.prevPress = null
    this._prevTimer_ = null

    this.setHotkeys(hotkeys)
    combinationKeysMonitor.init(window)
  }

  /* Set the combination key monitoring logic of other Window objectskey monitoring logic of other Window objects */
  setCombinationKeysMonitor(win) { combinationKeysMonitor.init(win) }

  /* Pre -processingprocessing */
  hotkeysPreprocess(hotkeys) {
    if (!Array.isArray(hotkeys)) {
      return false
    }

    hotkeys.forEach((config) => {
      if (!isObj$1(config) || !config.key || typeof config.key !== 'string') {
        return false
      }

      const keyName = config.key.trim().toLowerCase()
      const mod = this.MOD.toLowerCase()

      /* Add formatted Hotkeys arraytkeys array */
      config.keyBindings = keyName.split(' ').map(press => {
        const keys = press.split(/\b\+/)
        const mods = []
        let key = ''

        keys.forEach((k) => {
          k = k === '$mod' ? mod : k

          if (isModifierKey(k)) {
            mods.push(k)
          } else {
            key = k
          }
        })

        return [mods, key]
      })
    })

    return hotkeys
  }

  setHotkeys(hotkeys) {
    this.hotkeys = this.hotkeysPreprocess(hotkeys) || []
  }

  /**
   * Determine whether the keyboard event and the expected hot key configuration currently provided match
   * @param {KeyboardEvent} event
   * @param {Array} press For example:[['alt', 'shift'], 's']
   * @param {Object} prevCombinationKeys
   * @returns
   */
  isMatch(event, press) {
    if (!event || !Array.isArray(press)) { return false }

    const combinationKeys = event.combinationKeys || combinationKeysMonitor.getCombinationKeys()
    const mods = press[0]
    const key = press[1]

    /* The number of modifiers does not match */
    if (mods.length !== combinationKeys.size) {
      return false
    }

    /* The key position is not matched with the expected key position */
    if (key && event.key.toLowerCase() !== key && event.code.toLowerCase() !== key) {
      return false
    }

    /* The modifier currently pressed is not matched with the expected modifier */
    let result = true
    const modsKey = new Map$1()
    combinationKeys.forEach((val, key) => {
      /* Supplement various possible signs */
      modsKey.set(key, val)
      modsKey.set(key.toLowerCase(), val)
      keyAlias[key] && modsKey.set(keyAlias[key], val)
    })

    mods.forEach((key) => {
      if (!modsKey.has(key)) {
        result = false
      }
    })

    return result
  }

  isMatchPrevPress(press) { return this.isMatch(this.prevPress, press) }

  run(opts = {}) {
    if (!(opts.event instanceof KeyboardEvent)) { return false }

    const event = opts.event
    const target = opts.target || null
    const conditionHandler = opts.conditionHandler || opts.whenHandler

    let matchResult = null

    this.hotkeys.forEach(hotkeyConf => {
      if (hotkeyConf.disabled || !hotkeyConf.keyBindings) {
        return false
      }

      let press = hotkeyConf.keyBindings[0]

      /* If there is a shortcut record of the previous round of operation, and the previous shortcut key matches the shortcut key defined by the first KeyBindings, it will match the second KeyBindings */
      if (this.prevPress && hotkeyConf.keyBindings.length > 1 && this.isMatchPrevPress(press)) {
        press = hotkeyConf.keyBindings[1]
      }

      const isMatch = this.isMatch(event, press)
      if (!isMatch) { return false }

      matchResult = hotkeyConf

      /* Whether to stop the incident bubbling and prevent the default event */
      const stopPropagation = opts.stopPropagation || hotkeyConf.stopPropagation
      const preventDefault = opts.preventDefault || hotkeyConf.preventDefault
      stopPropagation && event.stopPropagation()
      preventDefault && event.preventDefault()

      /* Record the shortcut key of the previous operation, and clear the record of the operation after a period of time */
      if (press === hotkeyConf.keyBindings[0]) {
        /* Transform prevpress into an object with Event related fields */
        this.prevPress = {
          combinationKeys: combinationKeysMonitor.getCombinationKeys(),
          code: event.code,
          key: event.key,
          keyCode: event.keyCode,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey
        }

        clearTimeout(this._prevTimer_)
        this._prevTimer_ = setTimeout(() => { this.prevPress = null }, 1000)
      }

      if (press === hotkeyConf.keyBindings[0] && hotkeyConf.keyBindings.length > 1) {
        return true
      } else {
        this.prevPress = null
      }

      /* Execute HotKeyConf.The function or command corresponding to the Command */
      const args = toArrArgs(hotkeyConf.args)
      let commandFunc = hotkeyConf.command
      if (target && typeof hotkeyConf.command === 'string') {
        commandFunc = getValByPath$1(target, hotkeyConf.command)
      }

      if (!(commandFunc instanceof Function) && target) {
        throw new Error(`[hotkeysRunner] No command was found: ${hotkeyConf.command} The corresponding function`)
      }

      if (hotkeyConf.when && conditionHandler instanceof Function) {
        const isMatchCondition = conditionHandler.apply(target, toArrArgs(hotkeyConf.when))
        if (isMatchCondition === true) {
          commandFunc.apply(target, args)
        }
      } else {
        commandFunc.apply(target, args)
      }
    })

    return matchResult
  }

  binding(opts = {}) {
    if (!isObj$1(opts) || !Array.isArray(opts.hotkeys)) {
      throw new Error('[hotkeysRunner] The parameters provided to binding are incorrect')
    }

    opts.el = opts.el || window
    opts.type = opts.type || 'keydown'
    opts.debug && (this.debug = true)

    this.setHotkeys(opts.hotkeys)

    if (typeof opts.el === 'string') {
      opts.el = document.querySelector(opts.el)
    }

    opts.el.addEventListener(opts.type, (event) => {
      opts.event = event
      this.run(opts)
    }, true)
  }
}

/* eslint-disable camelcase */

/**
 * @license Copyright 2017 - Chris West - MIT Licensed
 * Prototype to easily set the volume (actual and perceived), loudness,
 * decibels, and gain value.
 * https://cwestblog.com/2017/08/22/web-audio-api-controlling-audio-video-loudness/
 */
function MediaElementAmplifier(mediaElem) {
  this._context = new (window.AudioContext || window.webkitAudioContext)()
  this._source = this._context.createMediaElementSource(this._element = mediaElem)
  this._source.connect(this._gain = this._context.createGain())
  this._gain.connect(this._context.destination)
}
[
  'getContext',
  'getSource',
  'getGain',
  'getElement',
  [
    'getVolume',
    function (opt_getPerceived) {
      return (opt_getPerceived ? this.getLoudness() : 1) * this._element.volume
    }
  ],
  [
    'setVolume',
    function (value, opt_setPerceived) {
      var volume = value / (opt_setPerceived ? this.getLoudness() : 1)
      if (volume > 1) {
        this.setLoudness(this.getLoudness() * volume)
        volume = 1
      }
      this._element.volume = volume
    }
  ],
  ['getGainValue', function () { return this._gain.gain.value }],
  ['setGainValue', function (value) { this._gain.gain.value = value }],
  ['getDecibels', function () { return 20 * Math.log10(this.getGainValue()) }],
  ['setDecibels', function (value) { this.setGainValue(Math.pow(10, value / 20)) }],
  ['getLoudness', function () { return Math.pow(2, this.getDecibels() / 10) }],
  ['setLoudness', function (value) { this.setDecibels(10 * Math.log2(value)) }]
].forEach(function (name, fn) {
  if (typeof name === 'string') {
    fn = function () { return this[name.replace('get', '').toLowerCase()] }
  } else {
    fn = name[1]
    name = name[0]
  }
  MediaElementAmplifier.prototype[name] = fn
})

function download(url, title) {
  const downloadEl = document.createElement('a')
  downloadEl.href = url
  downloadEl.target = '_blank'
  downloadEl.download = title
  downloadEl.click()
}

function mediaDownload(mediaEl, title, downloadType) {
  if (mediaEl && (mediaEl.src || mediaEl.currentSrc) && !mediaEl.src.startsWith('blob:')) {
    const mediaInfo = {
      type: mediaEl instanceof HTMLVideoElement ? 'video' : 'audio',
      format: mediaEl instanceof HTMLVideoElement ? 'mp4' : 'mp3'
    }
    let mediaTitle = `${title || mediaEl.title || document.title || Date.now()}_${mediaInfo.type}.${mediaInfo.format}`

    /**
     * When the media contains the source label, the real address of the media label will be CURRENTSRC
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
     */
    const mediaUrl = mediaEl.src || mediaEl.currentSrc

    /* Small than 5 minutes of media files, try to download through fetch */
    if (downloadType === 'blob' || mediaEl.duration < 60 * 5) {
      if (mediaEl.downloading) {
        /* The situation where the download of the last time is less than 1S, not in response to any operation */
        if (Date.now() - mediaEl.downloading < 1000 * 1) {
          return false
        } else {
          const confirm = original.confirm('The file is being downloaded, and it is determined to perform repeatedly?')
          if (!confirm) {
            return false
          }
        }
      }

      if (mediaEl.hasDownload) {
        const confirm = original.confirm('The media file has been downloaded, and it is true that you need to download it again?')
        if (!confirm) {
          return false
        }
      }

      mediaTitle = original.prompt('Please confirm the file title:', mediaTitle) || mediaTitle

      if (!mediaTitle.endsWith(mediaInfo.format)) {
        mediaTitle = mediaTitle + '.' + mediaInfo.format
      }

      let fetchUrl = mediaUrl
      if (mediaUrl.startsWith('http://') && location.href.startsWith('https://')) {
        /* FETCH in HTTPS HTTP resources can cause block:mixed-content Error, so try to unify the address into the beginning of https */
        fetchUrl = mediaUrl.replace('http://', 'https://')
      }

      mediaEl.downloading = Date.now()
      fetch(fetchUrl).then(res => {
        res.blob().then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          download(blobUrl, mediaTitle)

          mediaEl.hasDownload = true
          delete mediaEl.downloading
          window.URL.revokeObjectURL(blobUrl)
        })
      }).catch(err => {
        original.console.error('FETCH download operation failed:', err)

        /* Download */
        download(mediaUrl, mediaTitle)
      })
    } else {
      download(mediaUrl, mediaTitle)
    }
  } else if (mediaSource.hasInit()) {
    /* Download media files managed through MediaSource */
    mediaSource.downloadMediaSource()
  } else {
    original.alert('The current media files cannot be downloaded, the download function is to be optimized and perfect')
  }
}

/* Define which media tags support */
// const supportMediaTags = ['video', 'bwp-video', 'audio']
const supportMediaTags = ['video', 'bwp-video']

let TCC$1 = null
const h5Player = {
  mediaCore,
  mediaPlusApi: null,
  mediaSource,
  configManager,
  /* Note of the text */
  fontSize: 12,
  enable: true,
  globalMode: true,
  playerInstance: null,
  scale: 1,
  translate: {
    x: 0,
    y: 0
  },
  rotate: 0,

  /* Horizontal mirror flip, 0 or 180 */
  rotateY: 0,
  /* Vertical mirror flip, 0 or 180 */
  rotateX: 0,

  defaultTransform: {
    scale: 1,
    translate: {
      x: 0,
      y: 0
    },
    rotate: 0,
    rotateY: 0,
    rotateX: 0
  },

  /* Store the old transform value */
  historyTransform: {},

  playbackRate: configManager.get('media.playbackRate'),
  volume: configManager.get('media.volume'),
  lastPlaybackRate: 1,
  /* Fast and fast backing */
  skipStep: 5,

  /* Observation objects of monitoring mouse activities */
  mouseObserver: new MouseObserver(),

  /* Example of obtaining the current player */
  player: function () {
    const t = this
    let playerInstance = t.playerInstance

    if (!playerInstance) {
      const mediaList = t.getPlayerList()
      if (mediaList.length) {
        playerInstance = mediaList[mediaList.length - 1]
        t.playerInstance = playerInstance
        t.initPlayerInstance(mediaList.length === 1)
      }
    }

    if (playerInstance && !t.mediaPlusApi) {
      t.mediaPlusApi = mediaCore.mediaPlus(playerInstance)
    }

    return playerInstance
  },

  isAudioInstance() {
    return isAudioElement(this.player())
  },

  /* Multiple Video players that may exist in each webpage */
  getPlayerList: function () {
    const list = mediaCore.mediaElementList || []

    function findPlayer(context) {
      supportMediaTags.forEach(tagName => {
        context.querySelectorAll(tagName).forEach(function (player) {
          if (player.tagName.toLowerCase() === 'bwp-video') {
            /* BWP at station B-Video logo as htmlvideoElement */
            player.HTMLVideoElement = true
          }

          if (isMediaElement(player) && !list.includes(player)) {
            list.push(player)
          }
        })
      })
    }

    findPlayer(document)

    // Encapsulate shadow dom Video inside
    if (window._shadowDomList_) {
      window._shadowDomList_.forEach(function (shadowRoot) {
        findPlayer(shadowRoot)
      })
    }

    return list
  },

  getPlayerWrapDom: function () {
    const t = this
    const player = t.player()
    if (!player) return

    let wrapDom = null
    const playerBox = player.getBoundingClientRect()
    eachParentNode(player, function (parent) {
      if (parent === document || !parent.getBoundingClientRect) return
      const parentBox = parent.getBoundingClientRect()
      if (parentBox.width && parentBox.height) {
        if (parentBox.width === playerBox.width && parentBox.height === playerBox.height) {
          wrapDom = parent
        }
      }
    })
    return wrapDom
  },

  /* Mount Window object on the page for debugging */
  async mountToGlobal() {
    try {
      const pageWindow = await getPageWindow()
      if (pageWindow) {
        pageWindow._h5Player = h5Player || 'null'
        if (window.top !== window) {
          pageWindow._h5PlayerInFrame = h5Player || 'null'
        }
        pageWindow._window = window || ''
        debug.log('H5Player object has been successfully mounted to global')
      }
    } catch (e) {
      debug.error(e)
    }
  },

  /**
   * Initiated player instance
   * @param isSingle Whether it is a single -instance Video tag
   */
  initPlayerInstance(isSingle) {
    const t = this
    if (!t.playerInstance) return

    const player = t.playerInstance

    t.mediaPlusApi = mediaCore.mediaPlus(player)

    t.initPlaybackRate()
    t.isFoucs()
    t.proxyPlayerInstance(player)

    t.unLockPlaybackRate()
    t.setPlaybackRate()
    t.lockPlaybackRate(1000)

    /* Increase the general screen, web full -screen API */
    player._fullScreen_ = new FullScreen(player)
    player._fullPageScreen_ = new FullScreen(player, true)

    /* Register hot -key operator */
    t.registerHotkeysRunner()

    if (!player._hasCanplayEvent_) {
      player.addEventListener('canplay', function (event) {
        t.initAutoPlay(player)
      })
      player._hasCanplayEvent_ = true
    }

    /* Related synchronization operations during playback */
    if (!player._hasPlayerInitEvent_) {
      let setPlaybackRateOnPlayingCount = 0
      player.addEventListener('playing', function (event) {
        t.unLockPlaybackRate()
        t.setPlaybackRate(null, true)
        t.lockPlaybackRate(1000)

        /* Synchronous playback volume */
        if (configManager.get('enhance.blockSetVolume') === true && event.target.muted === false) {
          t.setVolume(configManager.getGlobalStorage('media.volume'), true)
        }

        /* Prohibit the default progress control */
        if (configManager.get('enhance.blockSetCurrentTime') === true) {
          t.lockCurrentTime()
        }

        /* Restore playing progress */
        t.setPlayProgress(player)

        if (setPlaybackRateOnPlayingCount === 0) {
          /* Play speed, volume, etc. set before synchronization */
          t.unLockPlaybackRate()
          t.setPlaybackRate()
          t.lockPlaybackRate(1000)

          /* Start the playback progress record */
          setTimeout(() => {
            t.playProgressRecorder(player)
          }, 2000)
        } else {
          t.unLockPlaybackRate()
          t.setPlaybackRate(null, true)
          t.lockPlaybackRate(1000)
        }
        setPlaybackRateOnPlayingCount += 1
      })

      player._hasPlayerInitEvent_ = true
    }

    /* Customized initialization operation */
    const taskConf = TCC$1.getTaskConfig()
    if (taskConf.init) {
      TCC$1.doTask('init', player)
    }

    /* Registered mouse in response event */
    t.mouseObserver.on(player, 'click', function (event, offset, target) {
      // debug.log('Capture the mouse click event:', event, offset, target)
    })

    /* Painting incident in painting */
    player.addEventListener('enterpictureinpicture', () => {
      monkeyMsg.send('globalPictureInPictureInfo', {
        usePictureInPicture: true
      })
      debug.log('enterpictureinpicture', player)
    })
    player.addEventListener('leavepictureinpicture', () => {
      t.leavepictureinpictureTime = Date.now()

      monkeyMsg.send('globalPictureInPictureInfo', {
        usePictureInPicture: false
      })
      debug.log('leavepictureinpicture', player)
    })

    if (debug.isDebugMode()) {
      player.addEventListener('loadeddata', function () {
        debug.log(`video url: ${player.src} video duration: ${player.duration} video dom:`, player)
      })

      player.addEventListener('durationchange', function () {
        debug.log(`video durationchange: ${player.duration}`)
      })
    }
  },

  registerHotkeysRunner() {
    if (!this.hotkeysRunner) {
      this.hotkeysRunner = new HotkeysRunner(configManager.get('hotkeys'))

      if (isInIframe() && !isInCrossOriginFrame()) {
        /* Let the top page also monitor the trigger of the combination key */
        this.hotkeysRunner.setCombinationKeysMonitor(window.top)
      }
    }
  },

  /* Shortly after closing the painting in the painting, cross -TAB control is allowed during this period of time */
  isLeavepictureinpictureAwhile() {
    const t = this
    return t.leavepictureinpictureTime && (Date.now() - t.leavepictureinpictureTime < 1000 * 10)
  },

  /**
   * Proxy the method or attribute of the player instance
   * @param player
   */
  proxyPlayerInstance(player) {
    if (!player) return

    /* The method or attribute list of the proxy */
    const proxyList = [
      'play',
      'pause'
    ]

    proxyList.forEach(key => {
      const originKey = 'origin_' + key
      if (Reflect.has(player, key) && !Reflect.has(player, originKey)) {
        player[originKey] = player[key]
        const proxy = new Proxy(player[key], {
          apply(target, ctx, args) {
            // debug.log(key + 'Call')

            /* Processing Hanging Logic */
            const hangUpInfo = player._hangUpInfo_ || {}
            const hangUpDetail = hangUpInfo[key] || hangUpInfo['hangUp_' + key]
            const needHangUp = hangUpDetail && hangUpDetail.timeout >= Date.now()
            if (needHangUp) {
              debug.log(key + 'It has been hung, and this call will be ignored')
              return false
            }

            return target.apply(ctx || player, args)
          }
        })

        player[key] = proxy
      }
    })

    if (!player._hangUp_) {
      player._hangUpInfo_ = {}
      /**
       * Hanging the call of a function of Player
       * @param name {String} -required The Player method or attribute name, the name is written to the outside, also requires that the method or attribute is represented by the agent to hang, otherwise this will be an invalid call
       * @param timeout {Number} -Optional How long is the hung, the default 200ms default
       * @private
       */
      player._hangUp_ = function (name, timeout) {
        timeout = Number(timeout) || 200
        // debug.log('_hangUp_', name, timeout)
        player._hangUpInfo_[name] = {
          timeout: Date.now() + timeout
        }
      }

      /* Cancel */
      player._unHangUp_ = function (name) {
        if (player._hangUpInfo_ && player._hangUpInfo_[name]) {
          player._hangUpInfo_[name].timeout = Date.now() - 1
        }
      }
    }
  },

  /**
   * Initialize automatic playback logic
   * It must be configured with the automatic play button selectioner before the automatic playback will be performed
   */
  initAutoPlay: function (p) {
    const t = this
    const player = p || t.player()
    const taskConf = TCC$1.getTaskConfig()

    /* Register to open the control menu for automatic playback */
    if (taskConf.autoPlay) {
      if (configManager.getLocalStorage('media.autoPlay') === null) {
        configManager.setLocalStorage('media.autoPlay', true)
      }

      addMenu({
        title: () => configManager.getLocalStorage('media.autoPlay') ? i18n.t('disableInitAutoPlay') : i18n.t('enableInitAutoPlay'),
        fn: () => {
          const confirm = window.confirm(configManager.getLocalStorage('media.autoPlay') ? i18n.t('disableInitAutoPlay') : i18n.t('enableInitAutoPlay'))
          if (confirm) {
            const autoPlay = configManager.getLocalStorage('media.autoPlay')
            if (autoPlay === null) {
              alert(i18n.t('configFail'))
            } else {
              configManager.setLocalStorage('media.autoPlay', !autoPlay)
            }
          }
        }
      })
    }

    // When inquiring the trial, if the instance changes, or in the hidden page, the automatic playback operation is not performed.
    if (!configManager.get('media.autoPlay') || (!p && t.hasInitAutoPlay) || !player || (p && p !== t.player()) || document.hidden) {
      return false
    }

    /**
     * The element is not in the scope of visibility, and the logic of initialization is not allowed to be initialized
     * Due to the inaccurate judgment of the visible range of the element under iframe, the initialization automatic playback logic is also prohibited under iframe
     * TODO Be optimized
     */
    if (!isInViewPort(player) || isInIframe()) {
      return false
    }

    if (!taskConf.autoPlay) {
      return false
    }

    t.hasInitAutoPlay = true

    if (player && taskConf.autoPlay && player.paused) {
      TCC$1.doTask('autoPlay')
      if (player.paused) {
        // Ran inquiry and retry
        if (!player._initAutoPlayCount_) {
          player._initAutoPlayCount_ = 1
        }
        player._initAutoPlayCount_ += 1
        if (player._initAutoPlayCount_ >= 10) {
          return false
        }
        setTimeout(function () {
          t.initAutoPlay(player)
        }, 200)
      }
    }
  },

  /* Set video full screen */
  setFullScreen() {
    const player = this.player()
    const isDo = TCC$1.doTask('fullScreen')
    if (!isDo && player && player._fullScreen_) {
      player._fullScreen_.toggle()
    }
  },

  /* Set the full screen of the page */
  setWebFullScreen: function () {
    const t = this
    const player = t.player()
    const isDo = TCC$1.doTask('webFullScreen')
    if (!isDo && player && player._fullPageScreen_) {
      player._fullPageScreen_.toggle()
    }
  },

  initPlaybackRate() {
    const t = this
    t.playbackRate = t.getPlaybackRate()
  },

  playbackRateInfo: {
    lockTimeout: Date.now() - 1,
    time: Date.now(),
    /* Before the initialization of the playback, I do n’t know what the speed is, so the setting is-1 */
    value: -1
  },

  getPlaybackRate() {
    let playbackRate = configManager.get('media.playbackRate') || this.playbackRate
    if (isInIframe()) {
      const globalPlaybackRate = configManager.getGlobalStorage('media.playbackRate')
      if (globalPlaybackRate) {
        playbackRate = globalPlaybackRate
      }
    }
    return Number(Number(playbackRate).toFixed(1))
  },

  /* Lock Playbackrate, prohibit speed adjustment */
  lockPlaybackRate: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetPlaybackRate') === true) {
        // If you are configured to lock the operation of the external exterior on PlayBackrate, give a large value directly
        timeout = 1000 * 60 * 60 * 24 * 365
      }

      this.mediaPlusApi.lockPlaybackRate(timeout)
      return true
    }

    this.playbackRateInfo.lockTimeout = Date.now() + timeout
  },

  unLockPlaybackRate: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockPlaybackRate()
      return true
    }

    this.playbackRateInfo.lockTimeout = Date.now() - 1
  },

  isLockPlaybackRate: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockPlaybackRate()
    }

    return Date.now() - this.playbackRateInfo.lockTimeout < 0
  },

  /* Set the playback speed */
  setPlaybackRate: function (num, notips, duplicate) {
    const t = this
    const player = t.player()

    if (t.isLockPlaybackRate()) {
      debug.info('The speed adjustment ability has been locked')
      return false
    }

    if (TCC$1.doTask('playbackRate')) {
      // debug.log('[TCC][playbackRate]', 'suc')
      return
    }

    if (!player) return

    let curPlaybackRate
    if (num) {
      num = Number(num)
      if (Number.isNaN(num)) {
        debug.error('h5player: Play speed conversion error')
        return false
      }

      if (num <= 0) {
        num = 0.1
      } else if (num > 16) {
        num = 16
      }

      num = Number(num.toFixed(1))
      curPlaybackRate = num
    } else {
      curPlaybackRate = t.getPlaybackRate()
    }

    /* Record information about playback speed */
    t.playbackRate = curPlaybackRate
    if (isInIframe()) {
      configManager.setGlobalStorage('media.playbackRate', curPlaybackRate)
    } else {
      configManager.set('media.playbackRate', curPlaybackRate)
    }

    if (t.mediaPlusApi) {
      t.mediaPlusApi.setPlaybackRate(curPlaybackRate)

      if (!(!num && curPlaybackRate === 1) && !notips) {
        t.tips(i18n.t('tipsMsg.playspeed') + player.playbackRate)
      }

      /* Synchronize the playback speed to all media elements */
      const mediaList = t.getPlayerList()
      mediaList.forEach(media => {
        if (media !== player) {
          const mediaPlusApi = mediaCore.mediaPlus(media)
          mediaPlusApi && mediaPlusApi.setPlaybackRate(curPlaybackRate)
        }
      })

      return true
    }

    delete player.playbackRate
    player.playbackRate = curPlaybackRate

    t.playbackRateInfo.time = Date.now()
    t.playbackRateInfo.value = curPlaybackRate
    player._setPlaybackRate_ = {
      time: Date.now(),
      value: curPlaybackRate
    }

    try {
      const playbackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate')
      originalMethods.Object.defineProperty.call(Object, player, 'playbackRate', {
        configurable: true,
        get: function () {
          /**
           * In the oil pipe, if the back is PlaybackraatedEScriptor.get.apply(player, arguments), Speed adjustment will fluctuate and abnormal
           * I don’t know why for the time being, so I will return to CurplayBackrate first
           */
          return curPlaybackRate || playbackRateDescriptor.get.apply(player, arguments)
        },
        set: function (val) {
          if (typeof val !== 'number') {
            return false
          }

          /* Some websites are continuously brushed PLAYBACKRATE through the timer, so the unnecessary information output is reduced by the timer through the timer */
          !Number.isInteger(player._blockSetPlaybackRateTips_) && (player._blockSetPlaybackRateTips_ = 0)

          if (TCC$1.doTask('blockSetPlaybackRate')) {
            player._blockSetPlaybackRateTips_++
            player._blockSetPlaybackRateTips_ < 3 && debug.info('The speed regulation ability has been processed by the customized speed regulation task')
            return false
          }

          if (configManager.get('enhance.blockSetPlaybackRate') === true) {
            player._blockSetPlaybackRateTips_++
            player._blockSetPlaybackRateTips_ < 3 && debug.info('The speed adjustment ability has been locked by BlockSetplayBackrate')
            return false
          } else {
            t.setPlaybackRate(val)
          }
        }
      })
    } catch (e) {
      debug.error('Unlocked Playbackrate failed', e)
    }

    /* It is not prompted when it is 1 times the playback speed */
    if (!num && curPlaybackRate === 1) {
      return true
    } else {
      !notips && t.tips(i18n.t('tipsMsg.playspeed') + player.playbackRate)
    }

    /**
     * Repeat the setting of the last double speed
     * It does not take effect when you solve YouTube fast speed adjustment. If you stop pause, you need to adjust it before you can take effect.
     */
    if (!duplicate && configManager.get('enhance.blockSetPlaybackRate') === true) {
      clearTimeout(t._setPlaybackRateDuplicate_)
      clearTimeout(t._setPlaybackRateDuplicate2_)
      const duplicatePlaybackRate = () => {
        t.unLockPlaybackRate()
        t.setPlaybackRate(curPlaybackRate, true, true)
        t.lockPlaybackRate(1000)
      }
      t._setPlaybackRateDuplicate_ = setTimeout(duplicatePlaybackRate, 600)
      /* If it is re -triggered when 600ms, it will be triggered after 1200ms. If it is 1200ms before it takes effect, the delay of the speed adjustment is very obvious. */
      t._setPlaybackRateDuplicate2_ = setTimeout(duplicatePlaybackRate, 1200)
    }
  },

  /**
   * Enhanced the doubling speed adjustment. When the same value is set in a short period of time, it will be considered to be faster
   * The value of the speed adjustment will be superimposed to large, so as to achieve the purpose of rapid jump to make double -speed adjustment
   * Scenes can be used for high -speed fast -forward, speeding at the beginning of the head and the beginning of the film
   * @param {*} num
   */
  setPlaybackRatePlus: function (num) {
    num = Number(num)
    if (!num || !Number.isInteger(num)) {
      return false
    }

    const t = this
    t.playbackRatePlusInfo = t.playbackRatePlusInfo || {}
    t.playbackRatePlusInfo[num] = t.playbackRatePlusInfo[num] || {
      time: Date.now() - 1000,
      value: num
    }

    if (Date.now() - t.playbackRatePlusInfo[num].time < 300) {
      t.playbackRatePlusInfo[num].value = t.playbackRatePlusInfo[num].value + num
    } else {
      t.playbackRatePlusInfo[num].value = num
    }

    t.playbackRatePlusInfo[num].time = Date.now()

    t.unLockPlaybackRate()
    t.setPlaybackRate(t.playbackRatePlusInfo[num].value)
    t.lockPlaybackRate(1000)
  },

  /* Restore the playback speed, restore to 1 times of speed, or restore to the last double speed */
  resetPlaybackRate: function (player) {
    const t = this
    player = player || t.player()

    t.unLockPlaybackRate()

    const oldPlaybackRate = Number(player.playbackRate)
    const playbackRate = oldPlaybackRate === 1 ? t.lastPlaybackRate : 1
    if (oldPlaybackRate !== 1) {
      t.lastPlaybackRate = oldPlaybackRate
    }

    t.setPlaybackRate(playbackRate)

    /* Prevent the interference of external speed regulation logic, so lock it for a while */
    t.lockPlaybackRate(1000)
  },

  /* Increase the playback rate */
  setPlaybackRateUp(num) {
    num = numUp(num) || 0.1
    if (this.player()) {
      this.unLockPlaybackRate()
      this.setPlaybackRate(this.player().playbackRate + num)

      /* Prevent the interference of external speed regulation logic, so lock it for a while */
      this.lockPlaybackRate(1000)
    }
  },

  /* Reduce the playback rate */
  setPlaybackRateDown(num) {
    num = numDown(num) || -0.1
    if (this.player()) {
      this.unLockPlaybackRate()
      this.setPlaybackRate(this.player().playbackRate + num)

      /* Prevent the interference of external speed regulation logic, so lock it for a while */
      this.lockPlaybackRate(1000)
    }
  },

  /**
   * Control logic of locking the progress of playback progress
   * Unlike the locking volume and double speed, the playback progress is closely related to video examples, so the locking information must be attached to the play instance
   */
  lockCurrentTime: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetCurrentTime') === true) {
        // If you are configured to lock the operation of the external ones to Currenttime, give a large value directly
        timeout = 1000 * 60 * 60 * 24 * 365
      }

      this.mediaPlusApi.lockCurrentTime(timeout)
      return true
    }

    const player = this.player()
    if (player) {
      player.currentTimeInfo = player.currentTimeInfo || {}
      player.currentTimeInfo.lockTimeout = Date.now() + timeout
    }
  },

  unLockCurrentTime: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockCurrentTime()
      return true
    }

    const player = this.player()
    if (player) {
      player.currentTimeInfo = player.currentTimeInfo || {}
      player.currentTimeInfo.lockTimeout = Date.now() - 1
    }
  },

  isLockCurrentTime: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockCurrentTime()
    }

    const player = this.player()
    if (player && player.currentTimeInfo && player.currentTimeInfo.lockTimeout) {
      return Date.now() - player.currentTimeInfo.lockTimeout < 0
    } else {
      return false
    }
  },

  /* Set the playback progress */
  setCurrentTime: function (num) {
    if (!num && num !== 0) return
    num = Number(num)
    const _num = Math.abs(Number(num.toFixed(1)))

    const t = this
    const player = t.player()

    if (t.isLockCurrentTime()) {
      return false
    }

    if (TCC$1.doTask('currentTime')) {
      // debug.log('[TCC][currentTime]', 'suc')
      return
    }

    if (this.mediaPlusApi) {
      this.mediaPlusApi.setCurrentTime(_num)
      return true
    }

    delete player.currentTime
    player.currentTime = _num
    player.currentTimeInfo = player.currentTimeInfo || {}
    player.currentTimeInfo.time = Date.now()
    player.currentTimeInfo.value = _num

    try {
      const currentTimeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime')
      originalMethods.Object.defineProperty.call(Object, player, 'currentTime', {
        configurable: true,
        enumerable: true,
        get: function () {
          return currentTimeDescriptor.get.apply(player, arguments)
        },
        set: function (val) {
          if (typeof val !== 'number' || TCC$1.doTask('blockSetCurrentTime') || configManager.get('enhance.blockSetCurrentTime') === true) {
            return false
          }

          if (t.isLockCurrentTime()) {
            return false
          }

          player.currentTimeInfo.time = Date.now()
          player.currentTimeInfo.value = val

          return currentTimeDescriptor.set.apply(player, arguments)
        }
      })
    } catch (e) {
      debug.error('Unlocked Current times failure', e)
    }
  },

  setCurrentTimeUp(num) {
    num = Number(numUp(num) || this.skipStep)

    if (TCC$1.doTask('addCurrentTime')); else {
      if (this.player()) {
        this.unLockCurrentTime()
        this.setCurrentTime(this.player().currentTime + num)

        /* Prevent the interference of the logic of external progress, so lock it for a while */
        this.lockCurrentTime(500)

        this.tips(i18n.t('tipsMsg.forward') + num + i18n.t('tipsMsg.seconds'))
      }
    }
  },

  setCurrentTimeDown(num) {
    num = Number(numDown(num) || -this.skipStep)

    if (TCC$1.doTask('subtractCurrentTime')); else {
      if (this.player()) {
        let currentTime = this.player().currentTime + num
        if (currentTime < 1) {
          currentTime = 0
        }

        this.unLockCurrentTime()
        this.setCurrentTime(currentTime)

        /* Prevent the interference of the logic of external progress, so lock it for a whilece of the logic of external progress, so lock it for a while */
        this.lockCurrentTime(500)

        this.tips(i18n.t('tipsMsg.backward') + Math.abs(num) + i18n.t('tipsMsg.seconds'))
      }
    }
  },

  volumeInfo: {
    lockTimeout: Date.now() - 1,
    time: Date.now(),
    /* Before the initialization of the playback, I don't know what the volume is, so the setting is set to-1 */
    value: -1
  },

  getVolume: function () {
    let volume = configManager.get('media.volume')
    if (isInIframe() || configManager.get('enhance.blockSetVolume') === true) {
      const globalVolume = configManager.getGlobalStorage('media.volume')
      if (globalVolume !== null) {
        volume = globalVolume
      }
    }
    return Number(Number(volume).toFixed(2))
  },

  /* Lock the volume and prohibit the tuning */
  lockVolume: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetVolume') === true) {
        // If you are configured to lock the external operation of Voluem, give a large value directlyhe external operation of Voluem, give a large value directly
        timeout = 1000 * 60 * 60 * 24 * 365
      }

      this.mediaPlusApi.lockVolume(timeout)
      return true
    }

    this.volumeInfo.lockTimeout = Date.now() + timeout
  },

  unLockVolume: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockVolume()
      return true
    }

    this.volumeInfo.lockTimeout = Date.now() - 1
  },

  isLockVolume: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockVolume()
    }

    return Date.now() - this.volumeInfo.lockTimeout < 0
  },

  /* Set the sound */
  setVolume: function (num, notips, outerCall) {
    const t = this
    const player = t.player()

    if (t.isLockVolume()) {
      return false
    }

    if (!num && num !== 0) {
      num = t.getVolume()
    }

    num = Number(num).toFixed(2)
    if (num < 0) {
      num = 0
    }

    if (num > 1 && configManager.get('enhance.allowAcousticGain')) {
      num = Math.ceil(num)

      try {
        player._amp_ = player._amp_ || new MediaElementAmplifier(player)
      } catch (e) {
        num = 1
        debug.error('Media sound sound gain gain logic abnormal', e)
      }

      /* The maximum value of limited gain */
      if (num > 6) {
        num = 6
      }

      if (!player._amp_ || !player._amp_.setLoudness) {
        num = 1
      }
    } else if (num > 1) {
      num = 1
    }

    /* Record playback volume informationlayback volume information */
    t.volume = num

    /* Use the volume gain logic, the gain volume does not perform local storage records */
    if (num > 1 && player._amp_ && player._amp_.setLoudness) {
      player._amp_.setLoudness(num)

      if (!outerCall) { player.muted = false }

      !notips && t.tips(i18n.t('tipsMsg.volume') + parseInt(num * 100) + '%')
      return true
    }

    if (isInIframe() || configManager.get('enhance.blockSetVolume') === true) {
      configManager.setGlobalStorage('media.volume', num)
    } else {
      configManager.setLocalStorage('media.volume', num)
    }

    if (t.mediaPlusApi) {
      t.mediaPlusApi.setVolume(num)

      /* Synchronize the playback volume to all media elements */
      const mediaList = t.getPlayerList()
      mediaList.forEach(media => {
        if (media !== player) {
          const mediaPlusApi = mediaCore.mediaPlus(media)
          mediaPlusApi && mediaPlusApi.setVolume(num)
        }
      })
    } else {
      delete player.volume
      player.volume = num
      t.volumeInfo.time = Date.now()
      t.volumeInfo.value = num

      try {
        const volumeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume')
        originalMethods.Object.defineProperty.call(Object, player, 'volume', {
          configurable: true,
          get: function () {
            return volumeDescriptor.get.apply(player, arguments)
          },
          set: function (val) {
            if (typeof val !== 'number' || val < 0) {
              return false
            }

            if (TCC$1.doTask('blockSetVolume') || configManager.get('enhance.blockSetVolume') === true) {
              return false
            } else {
              t.setVolume(val, false, true)
            }
          }
        })
      } catch (e) {
        debug.error('Unlock Volume failed', e)
      }
    }

    /* When adjusting the volume, close the mute mode by the way */
    if (!outerCall) { player.muted = false }

    !notips && t.tips(i18n.t('tipsMsg.volume') + parseInt(player.volume * 100) + '%')
  },

  setVolumeUp(num) {
    num = numUp(num) || 0.2
    const player = this.player()
    if (player) {
      this.unLockVolume()

      if (this.volume > 1 && player._amp_) {
        this.setVolume(this.volume + num)
      } else {
        this.setVolume(player.volume + num)
      }

      /* Prevent the interference of external tuning logic, so lock it for a whileence of external tuning logic, so lock it for a while */
      this.lockVolume(500)
    }
  },

  setVolumeDown(num) {
    num = numDown(num) || -0.2
    const player = this.player()
    if (player) {
      this.unLockVolume()

      if (this.volume > 1 && player._amp_) {
        this.setVolume(Math.floor(this.volume + num))
      } else {
        this.setVolume(player.volume + num)
      }

      /* Prevent the interference of external tuning logic, so lock it for a while */
      this.lockVolume(500)
    }
  },

  /* Collection of historical changes to the transform value */
  collectTransformHistoryInfo() {
    const t = this
    Object.keys(t.defaultTransform).forEach(key => {
      if (key === 'translate') {
        const translate = t.defaultTransform.translate
        t.historyTransform.translate = t.historyTransform.translate || {}
        Object.keys(translate).forEach(subKey => {
          if (Number(t.translate[subKey]) !== t.defaultTransform.translate[subKey]) {
            t.historyTransform.translate[subKey] = t.translate[subKey]
          }
        })
      } else {
        if (Number(t[key]) !== t.defaultTransform[key]) {
          t.historyTransform[key] = t[key]
        }
      }
    })
  },

  /* Determine whether the Transform value under H5Player is consistent with the default transform value */
  isSameAsDefaultTransform() {
    let result = true
    const t = this
    Object.keys(t.defaultTransform).forEach(key => {
      if (isObj(t.defaultTransform[key])) {
        Object.keys(t.defaultTransform[key]).forEach(subKey => {
          if (Number(t[key][subKey]) !== t.defaultTransform[key][subKey]) {
            result = false
          }
        })
      } else {
        if (Number(t[key]) !== t.defaultTransform[key]) {
          result = false
        }
      }
    })
    return result
  },

  /* Set the zooming and displacement of the video screen */
  setTransform(notTips) {
    const t = this
    const player = t.player()
    const scale = t.scale = Number(t.scale).toFixed(2)
    const translate = t.translate

    const mirror = t.rotateX === 180 ? `rotateX(${t.rotateX}deg)` : (t.rotateY === 180 ? `rotateY(${t.rotateY}deg)` : '')
    player.style.transform = `scale(${scale}) translate(${translate.x}px, ${translate.y}px) rotate(${t.rotate}deg) ${mirror}`

    let tipsMsg = i18n.t('tipsMsg.videozoom') + `${(scale * 100).toFixed(0)}%`
    if (translate.x) {
      tipsMsg += ` ${i18n.t('tipsMsg.horizontal')}${t.translate.x}px`
    }
    if (translate.y) {
      tipsMsg += ` ${i18n.t('tipsMsg.vertical')}${t.translate.y}px`
    }

    if (notTips === true); else {
      t.collectTransformHistoryInfo()
      t.tips(tipsMsg)
    }

    /* Always maintain the normal of transform style */
    if (!t._transformStateGuard_) {
      t._transformStateGuard_ = setInterval(() => {
        t.setTransform(true)
      }, 300)
    }
  },

  /* Video screen rotation 90 Every time */
  setRotate() {
    const t = this
    t.rotate += 90
    if (t.rotate % 360 === 0) t.rotate = 0
    t.setTransform(true)
    t.tips(i18n.t('tipsMsg.imgrotate') + t.rotate + '°')
  },

  /* Set mirror flipping */
  setMirror(vertical = false) {
    const t = this
    let tipsMsg = ''
    if (vertical) {
      t.rotateX = t.rotateX === 0 ? 180 : 0
      tipsMsg += ` ${i18n.t('tipsMsg.verticalMirror')} ${t.rotateX}deg`
    } else {
      t.rotateY = t.rotateY === 0 ? 180 : 0
      tipsMsg += ` ${i18n.t('tipsMsg.horizontalMirror')} ${t.rotateY}deg`
    }

    t.setTransform(true)
    t.tips(tipsMsg)
  },

  /* Scaling video screeng video screen
  setScale(num) {
    if (Number.isNaN(this.scale) || Number.isNaN(num)) {
      this.scale = 1
    } else {
      this.scale = num
    }

    this.setTransform()
  },

  /* Video amplification +0.1 */
  setScaleUp(num) {
    num = numUp(num) || 0.05
    this.setScale(Number(this.scale) + num)
  },

  /* Video narrowingo narrowing -0.1 */
  setScaleDown(num) {
    num = numDown(num) || -0.05
    this.setScale(Number(this.scale) + num)
  },

  /* Set the displacement attribute of the video screen */
  setTranslate(x, y) {
    if (typeof x === 'number') {
      this.translate.x = x
    }

    if (typeof y === 'number') {
      this.translate.y = y
    }

    this.setTransform()
  },

  /* The video screen moves to the right */
  setTranslateRight(num) {
    num = numUp(num) || 10
    this.setTranslate(this.translate.x + num)
  },

  /* The video screen moves to the left */
  setTranslateLeft(num) {
    num = numDown(num) || -10
    this.setTranslate(this.translate.x + num)
  },

  /* Video screen moves upward */
  setTranslateUp(num) {
    num = numUp(num) || 10
    this.setTranslate(null, this.translate.y - num)
  },

  /* Video screen moves downward */
  setTranslateDown(num) {
    num = numDown(num) || -10
    this.setTranslate(null, this.translate.y - num)
  },

  resetTransform(notTips) {
    const t = this

    if (t.isSameAsDefaultTransform() && Object.keys(t.historyTransform).length) {
      /* Restore into the transform value in the historical record */
      Object.keys(t.historyTransform).forEach(key => {
        if (isObj(t.historyTransform[key])) {
          Object.keys(t.historyTransform[key]).forEach(subKey => {
            t[key][subKey] = t.historyTransform[key][subKey]
          })
        } else {
          t[key] = t.historyTransform[key]
        }
      })
    } else {
      /* Restore into the default transform value */
      const defaultTransform = clone(t.defaultTransform)
      Object.keys(defaultTransform).forEach(key => {
        t[key] = defaultTransform[key]
      })
    }

    t.setTransform(notTips)
  },

  /**
   * Fixed frame screen
   * @param perFps {Number} -Optionaltional default 1. Form it to the next frame, if so-1 is to set to the previous frame
   */
  freezeFrame(perFps) {
    perFps = perFps || 1
    const t = this
    const player = t.player()

    /* 跳帧 */
    player.currentTime += Number(perFps / t.fps)

    /* Fixed screen */
    if (!player.paused) player.pause()

    /* Some players find that the location of the screen will be automatically played, so at this time you need to hang the playback operation the screen will be automatically played, so at this time you need to hang the playback operation */
    player._hangUp_ && player._hangUp_('play', 400)

    if (perFps === 1) {
      t.tips(i18n.t('tipsMsg.nextframe'))
    } else if (perFps === -1) {
      t.tips(i18n.t('tipsMsg.previousframe'))
    } else {
      t.tips(i18n.t('tipsMsg.stopframe') + perFps)
    }
  },

  /**
   * Switch the painting function in the painting
   */
  togglePictureInPicture() {
    const player = this.player()
    if (window._isPictureInPicture_ && document.pictureInPictureElement) {
      document.exitPictureInPicture().then(() => {
        window._isPictureInPicture_ = null
      }).catch((e) => {
        window._isPictureInPicture_ = null
        debug.error('[togglePictureInPicture]', e)
      })
    } else {
      player.requestPictureInPicture && player.requestPictureInPicture().then(() => {
        window._isPictureInPicture_ = true
      }).catch((e) => {
        window._isPictureInPicture_ = null
        debug.error('[togglePictureInPicture]', e)
      })
    }
  },

  /* Play the next video, there is no such feature in the default. Only the Next field is equipped in the TCC can there be this function */
  setNextVideo() {
    const isDo = TCC$1.doTask('next')
    if (!isDo) {
      debug.log('The current webpage does not support one -click to play the next video function~')
    }
  },

  /* Switch play status */
  switchPlayStatus() {
    const t = this
    const player = t.player()
    if (TCC$1.doTask('switchPlayStatus')) {
      // debug.log('[TCC][switchPlayStatus]', 'suc')
      return
    }

    if (player.paused) {
      if (TCC$1.doTask('play')); else {
        if (t.mediaPlusApi) {
          t.mediaPlusApi.lockPause(400)
          t.mediaPlusApi.applyPlay()
        } else {
          /* Hanging the pause operation of other logic to ensure that the play status takes effect */
          if (player._hangUp_ instanceof Function) {
            player._hangUp_('pause', 400)
            player._unHangUp_('play')
          }

          player.play()
        }

        t.tips(i18n.t('tipsMsg.play'))
      }
    } else {
      if (TCC$1.doTask('pause')); else {
        if (t.mediaPlusApi) {
          t.mediaPlusApi.lockPlay(400)
          t.mediaPlusApi.applyPause()
        } else {
          /* Hanging other logic playback operations to ensure that the suspension status takes effect */
          if (player._hangUp_ instanceof Function) {
            player._hangUp_('play', 400)
            player._unHangUp_('pause')
          }

          player.pause()
        }

        t.tips(i18n.t('tipsMsg.pause'))
      }
    }
  },

  isAllowRestorePlayProgress: function () {
    const allowRestoreVal = configManager.get(`media.allowRestorePlayProgress.${window.location.host}`)
    return allowRestoreVal === null || allowRestoreVal
  },
  /* Switch the state of automatic recovery play progress */
  switchRestorePlayProgressStatus: function () {
    const t = h5Player
    let isAllowRestorePlayProgress = t.isAllowRestorePlayProgress()

    if (isInCrossOriginFrame()) {
      isAllowRestorePlayProgress = false
    } else {
      /* Develop value */
      isAllowRestorePlayProgress = !isAllowRestorePlayProgress
    }

    configManager.set(`media.allowRestorePlayProgress.${window.location.host}`, isAllowRestorePlayProgress)

    /* Operating prompt */
    if (isAllowRestorePlayProgress) {
      t.tips(i18n.t('tipsMsg.arpl'))
      t.setPlayProgress(t.player())
    } else {
      t.tips(i18n.t('tipsMsg.drpl'))
    }
  },
  tipsClassName: 'html_player_enhance_tips',

  getTipsContainer: function (videoEl) {
    const t = h5Player
    const player = videoEl || t.player()
    // There are too many disadvantages to use the parent nodes obtained using GetContainer, and temporarily discard it
    // const _tispContainer_ = player._tispContainer_  ||  getContainer(player);

    let tispContainer = player.parentNode || player

    /* If the parent node is an element without long and width, then look up first level */
    const containerBox = tispContainer.getBoundingClientRect()
    if ((!containerBox.width || !containerBox.height) && tispContainer.parentNode) {
      tispContainer = tispContainer.parentNode
    }

    return tispContainer
  },
  tips: function (str) {
    const t = h5Player
    const player = t.player()
    if (!player) {
      debug.log('h5Player Tips:', str)
      return true
    }

    const isAudio = t.isAudioInstance()
    const parentNode = isAudio ? document.body : t.getTipsContainer()

    if (parentNode === player) {
      debug.info('Get the tips package container abnormality:', player, str)
      return false
    }

    let backupStyle = ''
    if (!isAudio) {
      // Repair part prompt button position abnormal problem
      const defStyle = parentNode.getAttribute('style') || ''

      backupStyle = parentNode.getAttribute('style-backup') || ''
      if (!backupStyle) {
        let backupSty = defStyle || 'style-backup:none'
        const backupStyObj = inlineStyleToObj(backupSty)

        /**
       * Fix the problem of getting an error style because the cache is obtained
       * For example: https://www.xuetangx.com/
       */
        if (backupStyObj.opacity === '0') {
          backupStyObj.opacity = '1'
        }
        if (backupStyObj.visibility === 'hidden') {
          backupStyObj.visibility = 'visible'
        }

        backupSty = objToInlineStyle(backupStyObj)

        parentNode.setAttribute('style-backup', backupSty)
        backupStyle = defStyle
      }

      const newStyleArr = backupStyle.split(';')

      const oldPosition = parentNode.getAttribute('def-position') || window.getComputedStyle(parentNode).position
      if (parentNode.getAttribute('def-position') === null) {
        parentNode.setAttribute('def-position', oldPosition || '')
      }
      if (['static', 'inherit', 'initial', 'unset', ''].includes(oldPosition)) {
        newStyleArr.push('position: relative')
      }

      const playerBox = player.getBoundingClientRect()
      const parentNodeBox = parentNode.getBoundingClientRect()
      /* When there is no high and width, give the parcel node a minimum height width to ensure that the prompt can be displayed normally */
      if (!parentNodeBox.width || !parentNodeBox.height) {
        newStyleArr.push('min-width:' + playerBox.width + 'px')
        newStyleArr.push('min-height:' + playerBox.height + 'px')
      }

      parentNode.setAttribute('style', newStyleArr.join(';'))

      const newPlayerBox = player.getBoundingClientRect()
      if (Math.abs(newPlayerBox.height - playerBox.height) > 50) {
        parentNode.setAttribute('style', backupStyle)
        // debug.info('After the new style is used, the player has caused a serious deviation to the height and width of the player. The style has been restored:', player, playerBox, newPlayerBox)
      }
    }

    const tipsSelector = '.' + t.tipsClassName

    /* When multiple TIPS elements appear, remove all these TIPS elements */
    const tipsList = document.querySelectorAll(tipsSelector)
    if (tipsList.length > 1) {
      tipsList.forEach(tipsItem => {
        tipsItem.remove()
      })
    }

    let tipsDom = parentNode.querySelector(tipsSelector)

    /* If the DOM is not initialized, the initialization will be initialized */
    if (!tipsDom) {
      t.initTips()
      tipsDom = parentNode.querySelector(tipsSelector)
      if (!tipsDom) {
        debug.log('init h5player tips dom error...')
        return false
      }
    }

    const style = tipsDom.style
    tipsDom.innerText = str

    for (var i = 0; i < 3; i++) {
      if (this.on_off[i]) clearTimeout(this.on_off[i])
    }

    function showTips() {
      style.display = 'block'
      t.on_off[0] = setTimeout(function () {
        style.opacity = 1
      }, 50)
      t.on_off[1] = setTimeout(function () {
        // Hide prompt box and restore style
        style.opacity = 0
        style.display = 'none'
        if (backupStyle) {
          parentNode.setAttribute('style', backupStyle)
        }
      }, 2000)
    }

    if (style.display === 'block') {
      style.display = 'none'
      clearTimeout(this.on_off[3])
      t.on_off[2] = setTimeout(function () {
        showTips()
      }, 100)
    } else {
      showTips()
    }
  },

  /* Set the style of prompt DOM */
  initTips: function () {
    const t = h5Player
    const isAudio = t.isAudioInstance()
    const parentNode = isAudio ? document.body : t.getTipsContainer()
    if (parentNode.querySelector('.' + t.tipsClassName)) return

    // top: 50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
    let tipsStyle = `
        position: absolute;
        z-index: 999999;
        font-size: ${t.fontSize || 16}px;
        padding: 5px 10px;
        background: rgba(0,0,0,0.4);
        color:white;
        top: 0;
        left: 0;
        transition: all 500ms ease;
        opacity: 0;
        border-bottom-right-radius: 5px;
        display: none;
        -webkit-font-smoothing: subpixel-antialiased;
        font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
        -webkit-user-select: none;
      `

    if (isAudio) {
      tipsStyle = `
          position: fixed;
          z-index: 999999;
          font-size: ${t.fontSize || 16}px;
          padding: 5px 10px;
          background: rgba(0,0,0,0.4);
          color:white;
          bottom: 0;
          right: 0;
          transition: all 500ms ease;
          opacity: 0;
          border-top-left-radius: 5px;
          display: none;
          -webkit-font-smoothing: subpixel-antialiased;
          font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
          -webkit-user-select: none;
        `
    }

    const tips = document.createElement('div')
    tips.setAttribute('style', tipsStyle)
    tips.setAttribute('class', t.tipsClassName)
    parentNode.appendChild(tips)
  },
  on_off: new Array(3),
  fps: 30,
  /* Filter effect */
  filter: {
    key: [1, 1, 1, 0, 0],
    setup: function () {
      var view = 'brightness({0}) contrast({1}) saturate({2}) hue-rotate({3}deg) blur({4}px)'
      for (var i = 0; i < 5; i++) {
        view = view.replace('{' + i + '}', String(this.key[i]))
        this.key[i] = Number(this.key[i])
      }
      h5Player.player().style.filter = view
    },
    reset: function () {
      this.key[0] = 1
      this.key[1] = 1
      this.key[2] = 1
      this.key[3] = 0
      this.key[4] = 0
      this.setup()
    }
  },

  setFilter(item, num, isDown) {
    if (![0, 1, 2, 3, 4].includes(item) || typeof num !== 'number') {
      debug.error('[setFilter]', 'The parameters are wrong', item, num)
      return false
    }

    /* If the logo is DOWN, the negative number is automatically taken */
    if (isDown === true) {
      if (num && num > 0) { num = -num }
    }

    const nameMap = {
      0: 'brightness',
      1: 'contrast',
      2: 'saturation',
      3: 'hue',
      4: 'blur'
    }

    const t = this
    t.filter.key[item] += num || 0.1
    t.filter.key[item] = t.filter.key[item].toFixed(2)

    if (t.filter.key[item] < 0 && nameMap[item] !== 'hue') {
      t.filter.key[item] = 0
    }

    t.filter.setup()
    t.tips(i18n.t(`tipsMsg.${nameMap[item]}`) + parseInt(t.filter.key[item] * 100) + '%')
  },

  /* Set the brightness of the video */
  setBrightness(num) {
    this.setFilter(0, num)
  },

  /* Enhance the brightness of the video */
  setBrightnessUp(num) {
    this.setFilter(0, num || 0.1)
  },

  /* Reduce the brightness of the video */
  setBrightnessDown(num) {
    this.setFilter(0, num || -0.1, true)
  },

  /* Set the contrast of video */
  setContrast(num) {
    this.setFilter(1, num)
  },

  /* Increase the contrast of video */
  setContrastUp(num) {
    this.setFilter(1, num || 0.1)
  },

  /* Reduce the contrast of video */
  setContrastDown(num) {
    this.setFilter(1, num || -0.1, true)
  },

  /* Settling saturation */
  setSaturation(num) {
    this.setFilter(2, num)
  },

  /* Increase saturation */
  setSaturationUp(num) {
    this.setFilter(2, num || 0.1)
  },

  /* Reduce saturation */
  setSaturationDown(num) {
    this.setFilter(2, num || -0.1, true)
  },

  /* Set the hue */
  setHue(num) {
    this.setFilter(3, num)
  },

  /* Increasing hue */
  setHueUp(num) {
    this.setFilter(3, num || 1)
  },

  /* Reduce color */
  setHueDown(num) {
    this.setFilter(3, num || -1, true)
  },

  /* Set the vagueness */
  setBlur(num) {
    this.setFilter(4, num)
  },

  /* Increase blur */
  setBlurUp(num) {
    this.setFilter(4, num || 1)
  },

  /* Reduce the fuzzyness */
  setBlurDown(num) {
    this.setFilter(4, num || -1, true)
  },

  resetFilterAndTransform() {
    const t = this

    t.resetTransform(true)
    t.filter.reset()
    t.tips(i18n.t('tipsMsg.imgattrreset'))
  },

  mediaDownload() {
    if (configManager.get('enhance.allowExperimentFeatures')) {
      debug.warn('[experimentFeatures][mediaDownload]')
      mediaDownload(this.player())
    }
  },

  capture() {
    const player = this.player()
    videoCapturer.capture(player, true)

    /* Pause screen */
    if (!player.paused && !document.pictureInPictureElement && document.visibilityState !== 'visible') {
      this.freezeFrame()
    }
  },

  _isFoucs: false,

  /* Focus event of the player */
  isFoucs: function () {
    const t = h5Player
    const player = t.player()
    if (!player) return

    player.onmouseenter = function (e) {
      h5Player._isFoucs = true
    }
    player.onmouseleave = function (e) {
      h5Player._isFoucs = false
    }
  },
  /* Player event responder */
  palyerTrigger: function (player, event) {
    if (!player || !event) return
    const t = h5Player
    const keyCode = event.keyCode
    const key = event.key.toLowerCase()

    if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      // Full screen screen
      if (key === 'enter') {
        t.setWebFullScreen()
      }

      // Enter or exit the painting mode in the painting
      if (key === 'p') {
        t.togglePictureInPicture()
      }

      // Screenshot and download and save
      if (key === 's') {
        t.capture()
      }

      if (key === 'r') {
        t.switchRestorePlayProgressStatus()
      }

      if (key === 'm') {
        /* Vertical mirror flip */
        t.setMirror(true)
      }

      if (key === 'd') {
        t.mediaDownload()
      }

      // Video screen zoom -related events
      const allowKeys = ['x', 'c', 'z', 'arrowright', 'arrowleft', 'arrowup', 'arrowdown']
      if (!allowKeys.includes(key)) return

      t.scale = Number(t.scale)
      switch (key) {
        // shift+X: Video narrowing -0.1
        case 'x':
          t.setScaleDown()
          break
        // shift+C: Video amplification +0.1
        case 'c':
          t.setScaleUp()
          break
        // shift+Z: Video resumption of normal size
        case 'z':
          t.resetTransform()
          break
        case 'arrowright':
          t.setTranslateRight()
          break
        case 'arrowleft':
          t.setTranslateLeft()
          break
        case 'arrowup':
          t.setTranslateUp()
          break
        case 'arrowdown':
          t.setTranslateDown()
          break
      }

      // Prevent incident bubbling
      event.stopPropagation()
      event.preventDefault()
      return true
    }

    // ctrl+Direction button right →: Fast 30 seconds
    if (event.ctrlKey && keyCode === 39) {
      t.setCurrentTimeUp(t.skipStep * 6)
    }
    // ctrl+Treaty key left ←: 30 seconds back
    if (event.ctrlKey && keyCode === 37) {
      t.setCurrentTimeDown(-t.skipStep * 6)
    }

    // ctrl+On the direction key ↑: increased volume increase 20%
    if (event.ctrlKey && keyCode === 38) {
      t.setVolumeUp(0.2)
    }
    // Under the direction key ↓: reduced volume 20%
    if (event.ctrlKey && keyCode === 40) {
      t.setVolumeDown(-0.2)
    }

    // Prevent other unrelated combination key conflicts
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return

    // Direction keys right →: Fast 5 seconds
    if (keyCode === 39) {
      t.setCurrentTimeUp()
    }
    // Direction key left ←: 5 seconds back
    if (keyCode === 37) {
      t.setCurrentTimeDown()
    }

    // On the direction key ↑: increased volume increase 10%
    if (keyCode === 38) {
      t.setVolumeUp(0.05)
    }
    // Under the direction key ↓: reduced volume 10%
    if (keyCode === 40) {
      t.setVolumeDown(-0.05)
    }

    // Space key: suspension/play
    if (keyCode === 32) {
      t.switchPlayStatus()
    }

    // Key X: Smoral playback -0.1
    if (keyCode === 88) {
      t.setPlaybackRateDown()
    }
    // Key C: Accelerate Play +0.1
    if (keyCode === 67) {
      t.setPlaybackRateUp()
    }
    // Button Z: Normal speed playback
    if (keyCode === 90) {
      t.resetPlaybackRate()
    }

    // Press 1-4 Set the playback speed 49-52;97-100
    if ((keyCode >= 49 && keyCode <= 52) || (keyCode >= 97 && keyCode <= 100)) {
      t.setPlaybackRatePlus(event.key)
    }

    // Button F: Next frame
    if (keyCode === 70) {
      t.freezeFrame(1)
    }
    // Key D: Previous frame
    if (keyCode === 68) {
      t.freezeFrame(-1)
    }

    // Press E: Brightness increases%
    if (keyCode === 69) {
      t.setBrightnessUp()
    }
    // Key W: Brightness decreases%
    if (keyCode === 87) {
      t.setBrightnessDown()
    }

    // Key T: Increased contrast%
    if (keyCode === 84) {
      t.setContrastUp()
    }
    // Key R: Decreased contrast%
    if (keyCode === 82) {
      t.setContrastDown()
    }

    // Key U: increased saturation%
    if (keyCode === 85) {
      t.setSaturationUp()
    }
    // Key Y: Reduced saturation%
    if (keyCode === 89) {
      t.setSaturationDown()
    }

    // Key O: Greeds increase 1 Every time
    if (keyCode === 79) {
      t.setHueUp()
    }
    // Key I: decrease in hue 1 Every time
    if (keyCode === 73) {
      t.setHueDown()
    }

    // Key K: Vaguely increased 1 px
    if (keyCode === 75) {
      t.setBlurUp()
    }
    // Button J: Vague reduction reduction 1 px
    if (keyCode === 74) {
      t.setBlurDown()
    }

    // Button Q: Image reset
    if (keyCode === 81) {
      t.resetFilterAndTransform()
    }

    // Key S: Rotate the screen 90 Every time
    if (keyCode === 83) {
      t.setRotate()
    }

    /* Horizontal mirror flip */
    if (keyCode === 77) {
      t.setMirror()
    }

    // Press the car to enter the full screen
    if (keyCode === 13) {
      t.setFullScreen()
    }

    if (key === 'n') {
      t.setNextVideo()
    }

    // Prevent incident bubbling
    event.stopPropagation()
    event.preventDefault()
    return true
  },

  /* Run customized shortcut operation, if it runs, it will return True */
  runCustomShortcuts: function (player, event) {
    if (!player || !event) return
    const key = event.key.toLowerCase()
    const taskConf = TCC$1.getTaskConfig()
    const confIsCorrect = isObj(taskConf.shortcuts) &&
      Array.isArray(taskConf.shortcuts.register) &&
      taskConf.shortcuts.callback instanceof Function

    /* Determine whether the shortcut keys currently triggered have been registered */
    function isRegister() {
      const list = taskConf.shortcuts.register

      /* The combination key currently triggered */
      const combineKey = []
      if (event.ctrlKey) {
        combineKey.push('ctrl')
      }
      if (event.shiftKey) {
        combineKey.push('shift')
      }
      if (event.altKey) {
        combineKey.push('alt')
      }
      if (event.metaKey) {
        combineKey.push('command')
      }

      combineKey.push(key)

      /* Whether the combination key that currently triggered by the currently triggered and the registered combination key is completely consistent */
      let hasReg = false
      list.forEach((shortcut) => {
        const regKey = shortcut.split('+')
        if (combineKey.length === regKey.length) {
          let allMatch = true
          regKey.forEach((key) => {
            if (!combineKey.includes(key)) {
              allMatch = false
            }
          })
          if (allMatch) {
            hasReg = true
          }
        }
      })

      return hasReg
    }

    if (confIsCorrect && isRegister()) {
      // Execute custom shortcut key operation
      const isDo = TCC$1.doTask('shortcuts', {
        event,
        player,
        h5Player
      })

      if (isDo) {
        event.stopPropagation()
        event.preventDefault()
      }

      return isDo
    } else {
      return false
    }
  },

  /* Key response method */
  keydownEvent: function (event) {
    const t = h5Player
    const keyCode = event.keyCode
    // const key = event.key.toLowerCase()
    const player = t.player()

    /* Do not perform any shortcut keys in editing elements */
    if (isEditableTarget(event.target)) return

    /* Broadcast button message, perform cross -domain control */
    monkeyMsg.send('globalKeydownEvent', event, 0)

    if (!player) {
      if (t.hasCrossOriginVideoDetected) {
        if (!configManager.get('enhance.allowCrossOriginControl')) {
          return false
        }

        /**
         * Use the matching ability of the hot -key operator to decide whether to prohibit incident bubbling and prevent the default event.
         * Solution that causes other default shortcut keys to respond to abnormalities during cross -TAB and cross -domain control
         */
        if (t.hotkeysRunner && t.hotkeysRunner.run) {
          t.hotkeysRunner.run({
            event,
            stopPropagation: true,
            preventDefault: true
          })
        } else {
          t.registerHotkeysRunner()
          event.stopPropagation()
          event.preventDefault()
        }

        // debug.log('The current page detects the restricted videos of cross -domain, and it still needs to prevent the default events and incident bubbling')
      }

      // debug.log('Unavailable media elements, do not perform related operations')
      return false
    }

    /* Available state of switching plug -in */
    if (event.ctrlKey && keyCode === 32) {
      t.enable = !t.enable
      if (t.enable) {
        t.tips(i18n.t('tipsMsg.onplugin'))
      } else {
        t.tips(i18n.t('tipsMsg.offplugin'))
      }
    }

    if (!t.enable) {
      debug.log('h5Player disabled~')
      return false
    }

    // Press ctrl+\ The key enters the focus of focusing or cancel the focus, and is used for the scene of the video label being blocked.
    if (event.ctrlKey && keyCode === 220) {
      t.globalMode = !t.globalMode
      if (t.globalMode) {
        t.tips(i18n.t('tipsMsg.globalmode') + ' ON')
      } else {
        t.tips(i18n.t('tipsMsg.globalmode') + ' OFF')
      }
    }

    /* In non -full -boistorized mode, the operation of shortcut keys does not focus on not focusing */
    if (!t.globalMode && !t._isFoucs) return

    /* Determine whether the custom shortcut operation is performed, if so, no longer respond to the default definition operation later */
    if (t.runCustomShortcuts(player, event) === true) return

    /* The hot -key operator matches the relevant execution task and does not perform subsequent PALYERTRIGGER */
    if (t.hotkeysRunner && t.hotkeysRunner.run) {
      const matchResult = t.hotkeysRunner.run({
        event,
        target: t,
        stopPropagation: true,
        preventDefault: true,
        conditionHandler(condition) {
          // TODO Improve the condition of limited adjustment logic
          if (condition) {
            return true
          }
        }
      })

      if (matchResult) {
        debug.info('[hotkeysRunner][matchResult]', matchResult)
        return true
      }
    } else {
      /* Unused keys are not monitored without any incident */
      if (!isRegisterKey(event)) { return false }

      /* Response player -related operation */
      t.palyerTrigger(player, event)
    }
  },

  /**
   * Get the progress of playback
   * @param player -Optional Corresponding H5 Player object, If you do not pass, you can get the entire playback schedule, and the passage of the current player's playback progress
   */
  getPlayProgress: function (player) {
    const progressMap = configManager.get('media.progress') || {}

    if (!player) {
      return progressMap
    } else {
      const keyName = window.location.href + player.duration
      if (progressMap[keyName]) {
        /* For the live video stream, the recorded Duration and the current video Duration will be inconsistent. At this time */
        if (Number.isNaN(Number(player.duration)) || Number(progressMap[keyName].duration) !== Number(player.duration)) {
          return player.currentTime
        } else {
          return progressMap[keyName].progress
        }
      } else {
        return player.currentTime
      }
    }
  },
  /* Play progress recorder */
  playProgressRecorder: function (player) {
    const t = h5Player
    clearTimeout(player._playProgressTimer_)
    function recorder(player) {
      player._playProgressTimer_ = setTimeout(function () {
        /* Video with less than two minutes does not record the playback progress */
        const isToShort = !player.duration || Number.isNaN(Number(player.duration)) || player.duration < 120
        const isLeave = document.visibilityState !== 'visible' && player.paused

        if (!t.isAllowRestorePlayProgress() || isToShort || isLeave) {
          recorder(player)
          return true
        }

        const progressMap = t.getPlayProgress() || {}
        const list = Object.keys(progressMap)
        const keyName = window.location.href + player.duration

        /**
         * Mark the value recorded to the progressMap for the first time
         * When used to prevent manual switching and playback progress, execute the wrong recovery logic
         */
        if (!progressMap[keyName]) {
          t._firstProgressRecord_ = keyName
          t._hasRestorePlayProgress_ = keyName
        }

        /* Only save the playback progress of the last 10 videos */
        if (list.length > 10) {
          /* According to the updated timestamp, take out the earliest record items to add play progress */
          let timeList = []
          list.forEach(function (keyName) {
            progressMap[keyName] && progressMap[keyName].t && timeList.push(progressMap[keyName].t)
          })
          timeList = quickSort(timeList)
          const timestamp = timeList[0]

          /* Delete the earliest added record items */
          list.forEach(function (keyName) {
            if (progressMap[keyName].t === timestamp) {
              delete progressMap[keyName]
            }
          })
        }

        /* Record the current playback progress */
        progressMap[keyName] = {
          progress: player.currentTime,
          duration: player.duration,
          t: new Date().getTime()
        }

        /* Store playback progress table */
        configManager.setLocalStorage('media.progress', progressMap)

        /* Cyclic listening */
        recorder(player)
      }, 1000 * 2)
    }
    recorder(player)
  },

  /* Set the playback progress */
  setPlayProgress: function (player) {
    const t = h5Player
    if (!player || !player.duration || Number.isNaN(player.duration)) return

    const curTime = Number(t.getPlayProgress(player))

    /* The time to restore the progress is too small or greater than the player.Duration does not meet the norms and does not perform progress to restore operations */
    if (!curTime || Number.isNaN(curTime) || curTime < 10 || curTime >= player.duration) return

    /* Ignore a situation where the time is not much different from the current playback progress time */
    if (Math.abs(curTime - player.currentTime) < 2) {
      return false
    }

    const progressKey = window.location.href + player.duration
    t._hasRestorePlayProgress_ = t._hasRestorePlayProgress_ || ''

    if (t._hasRestorePlayProgress_ === progressKey || t._firstProgressRecord_ === progressKey) {
      if (t._hasRestorePlayProgress_ === progressKey) {
        t._firstProgressRecord_ = ''
      }
      return false
    }

    if (t.isAllowRestorePlayProgress()) {
      // 1 less than Curtime.5s allows users to know that it is the previous picture, so that there is a feeling of connecting
      player.currentTime = curTime - 1.5
      t._hasRestorePlayProgress_ = progressKey
      t.tips(i18n.t('tipsMsg.playbackrestored'))
    } else {
      t.tips(i18n.t('tipsMsg.playbackrestoreoff'))
    }
  },

  setPlayerInstance(el) {
    if (!el && !el.getBoundingClientRect) {
      return false
    }

    const t = h5Player

    if (t.player() === el) {
      return false
    }

    if (!t.playerInstance && isMediaElement(el)) {
      t.playerInstance = el
      t.initPlayerInstance(false)
      return true
    }

    if (isVideoElement(el)) {
      const elParentNode = t.getTipsContainer(el)
      const elInfo = el.getBoundingClientRect()
      const parentElInfo = elParentNode && elParentNode.getBoundingClientRect()
      if (elInfo && elInfo.width > 200 && parentElInfo && parentElInfo.width > 200) {
        t.playerInstance = el
        t.initPlayerInstance(false)
      }
    } else if (isAudioElement(el)) {
      if (isAudioElement(t.playerInstance) || (isVideoElement(t.playerInstance) && !t.playerInstance.isConnected)) {
        t.playerInstance = el
        t.initPlayerInstance(false)
      }
    }
  },

  /**
   * Whether the video element appears in the viewing objects in the viewport to optimize the instance switching of multiple video instances
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
   */
  intersectionObserver: new IntersectionObserver(function (entries, observer) {
    const t = h5Player
    // debug.log('[intersectionObserver]', entries)

    let tmpIntersectionRatio = 0
    entries.forEach(entrie => {
      entrie.target._intersectionInfo_ = entrie

      if (entrie.intersectionRatio > tmpIntersectionRatio && entrie.intersectionRatio > 0.4) {
        tmpIntersectionRatio = entrie.intersectionRatio

        const oldPlayer = t.player()
        if (oldPlayer && oldPlayer._intersectionInfo_ && tmpIntersectionRatio < oldPlayer._intersectionInfo_.intersectionRatio) {
          /* The view range of the new instance is smaller than the old, so the instance does not switch */
          return
        }

        /* Switch video example */
        const toggleResult = t.setPlayerInstance(entrie.target)
        toggleResult && debug.log('[intersectionObserver] Switch video example', entrie)
      }
    })
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  }),

  /**
   * Detect whether the H5 player exists
   * @param callback
   */
  detecH5Player: function () {
    const t = this
    const playerList = t.getPlayerList()

    if (playerList.length) {
      // debug.log('Test HTML5 video!', location.href, h5Player, playerList)

      /* Single Video instance labeling */
      if (playerList.length === 1) {
        t.playerInstance = playerList[0]
        t.initPlayerInstance(true)
      }

      /* Multiple Video instance labeling */
      playerList.forEach(function (player) {
        /* Specify the instance when the mouse moves to it */
        if (!player._hasMouseRedirectEvent_) {
          player.addEventListener('mouseenter', function (event) {
            t.setPlayerInstance(event.target)
          })
          player._hasMouseRedirectEvent_ = true
        }

        /* Re -point to the instance when the player starts to play */
        if (!player._hasPlayingRedirectEvent_) {
          player.addEventListener('playing', function (event) {
            const media = event.target

            /* For ultra -short audio and video, it may be a special effect of some operation feedback, which can be ignored to play instance switching */
            if (media.duration && media.duration < 8) {
              return false
            }

            t.setPlayerInstance(media)
          })
          player._hasPlayingRedirectEvent_ = true
        }

        /* When observed at the browser view, switch video instance */
        if (!player._hasIntersectionObserver_) {
          t.intersectionObserver.observe(player)
          player._hasIntersectionObserver_ = true
        }
      })

      if (isInCrossOriginFrame()) {
        /* The news of the broadcast detects H5Player */
        monkeyMsg.send('videoDetected', {
          src: t.playerInstance.src
        })
      }

      registerH5playerMenus(h5Player)
    }
  },

  /* Response from the broadcast of key messages */
  bindFakeEvent() {
    const t = this
    if (t._hasBindFakeEvent_) return

    /* Trigger an analog event from message broadcasting to achieve cross -domain and cross -TAB control video playback */
    let triggerFakeEvent = function (name, oldVal, newVal, remote) {
      const player = t.player()
      if (player) {
        const fakeEvent = newVal.data
        fakeEvent.stopPropagation = () => { }
        fakeEvent.preventDefault = () => { }
        t.palyerTrigger(player, fakeEvent)

        debug.log('Response across TAB/Cross -domain keys control information:', newVal)
      }
    }

    /**
     * Operation throwing control to reduce the frequency of key message,
     * Note that after opening the throttling control, the composite button (such as: shift+s) Can't take effect
     */
    if (!crossTabCtl.hasOpenPictureInPicture() && !t.hasCrossOriginVideoDetected) {
      triggerFakeEvent = throttle(triggerFakeEvent, 80)
    }

    /* Registration response comes from the broadcast of key messages */
    monkeyMsg.on('globalKeydownEvent', async (name, oldVal, newVal, remote) => {
      if (remote) {
        if (isInCrossOriginFrame()) {
          /**
           * In the same cross -domain limited page, they are all visible, and the probability is in the same TAB tag, but it is not 100%
           * Tabid is consistent and 100%Under the same label
           */
          if (document.visibilityState === 'visible' && newVal.originTab) {
            triggerFakeEvent(name, oldVal, newVal, remote)
          }
        } else if (crossTabCtl.hasOpenPictureInPicture()) {
          /* Play the video in the painting across TAB control paintings */
          if (!newVal.originTab && (document.pictureInPictureElement || t.isLeavepictureinpictureAwhile())) {
            triggerFakeEvent(name, oldVal, newVal, remote)
          }
        }
      }
    })

    t._hasBindFakeEvent_ = true
  },

  /* Binding related events */
  bindEvent: function () {
    const t = this
    if (t._hasBindEvent_) return

    document.removeEventListener('keydown', t.keydownEvent)
    document.addEventListener('keydown', t.keydownEvent, true)

    /* Compatible with iframe operation */
    if (isInIframe() && !isInCrossOriginFrame()) {
      window.top.document.removeEventListener('keydown', t.keydownEvent)
      window.top.document.addEventListener('keydown', t.keydownEvent, true)
    }

    t._hasBindEvent_ = true
  },

  setCustomConfiguration(config, tag = 'Default') {
    if (!config) return false

    const configuration = configManager.mergeDefConf(config.customConfiguration)
    const taskConf = mergeTaskConf(config.customTaskControlCenter)
    if (TCC$1 && TCC$1.setTaskConf) {
      TCC$1.setTaskConf(taskConf)
    }

    h5Player.hasSetCustomConfiguration = tag
    debug.info(`[CustomConfiguration][${tag}]`, configuration, taskConf)
  },

  mergeExternalConfiguration(config, tag = 'Default') {
    if (!config || !configManager.getGlobalStorage('enhance.allowExternalCustomConfiguration')) return false
    h5Player.setCustomConfiguration(config, 'External')
    h5Player.hasExternalCustomConfiguration = tag
  },

  init: function (global) {
    var t = this

    if (window.unsafeWindow && window.unsafeWindow.__h5PlayerCustomConfiguration__) {
      !t.hasExternalCustomConfiguration && t.mergeExternalConfiguration(window.unsafeWindow.__h5PlayerCustomConfiguration__)
    }

    if (TCC$1 && TCC$1.doTask('disable') === true) {
      debug.info(`[TCC][disable][${location.host}] It has been prohibited to run video detection logic on the website, you can view the relevant configuration of the task configuration center for details`)
      return true
    }

    if (!global) {
      /* Detect whether there is an H5 player */
      t.detecH5Player()
      return true
    }

    if (configManager.get('debug') === true) {
      window._debugMode_ = true
      t.mountToGlobal()
    }

    setFakeUA()

    /* Initialization task configuration center */
    TCC$1 = h5PlayerTccInit(t)

    /* Binding keyboard incident */
    t.bindEvent()
    t.bindFakeEvent()

    /* A response to the event from the restricted video of the cross -domain detecting events */
    monkeyMsg.on('videoDetected', async (name, oldVal, newVal, remote) => {
      if (newVal.originTab) {
        t.hasCrossOriginVideoDetected = true
      }

      debug.log('[hasCrossOriginVideoDetected]', t, name, oldVal, newVal, remote)
    })

    /* When the page is in a state of visualization, initialize the logic of the definition of the playback logic */
    document.addEventListener('visibilitychange', function () {
      h5Player.initAutoPlay()
    })

    if (window.unsafeWindow && configManager.getGlobalStorage('enhance.allowExternalCustomConfiguration')) {
      window.unsafeWindow.__setH5PlayerCustomConfiguration__ = t.mergeExternalConfiguration
    }
  }
}

async function h5PlayerInit() {
  try {
    mediaCore.init(function (mediaElement) {
      // debug.log('[mediaCore][mediaChecker]', mediaElement)
      h5Player.init()
    })

    if (configManager.get('enhance.allowExperimentFeatures')) {
      mediaSource.init()
      debug.warn(`[experimentFeatures][warning] ${i18n.t('experimentFeaturesWarning')}`)
      debug.warn('[experimentFeatures][mediaSource][activated]')
    }

    /* It is forbidden to lock the attributes such as Playback on */
    hackDefineProperty()

    /* Prohibit using Close mode for shadowdom */
    hackAttachShadow()

    /* Take over all events */
    proxyHTMLMediaElementEvent()
    // hackEventListener()
  } catch (e) {
    console.error('h5player hack error', e)
  }

  menuRegister()

  try {
    /* Related methods required for the global situation */
    h5Player.init(true)

    /* Initialize after detecting a video label */
    supportMediaTags.forEach(tagName => {
      ready(tagName, function () {
        h5Player.init()
      })
    })

    /* Detect SHADOW dom Video below */
    document.addEventListener('addShadowRoot', function (e) {
      const shadowRoot = e.detail.shadowRoot
      supportMediaTags.forEach(tagName => {
        ready(tagName, function (element) {
          h5Player.init()
        }, shadowRoot)
      })
    })

    /* Initialize cross -TAB control logic */
    crossTabCtl.init()

    if (isInIframe()) {
      debug.log('h5Player init suc, in iframe:', window, window.location.href)
    } else {
      debug.log('h5Player init suc', window, h5Player)
    }

    if (isInCrossOriginFrame()) {
      debug.log('In the iFrame, which is currently limited by cross -domain, some functions of H5Player may not be able to open normally', window.location.href)
    }
  } catch (e) {
    debug.error('h5Player init fail', e)
  }
}

function init(retryCount = 0) {
  if (!window.document || !window.document.documentElement) {
    setTimeout(() => {
      if (retryCount < 200) {
        init(retryCount + 1)
      } else {
        console.error('[h5player message:]', 'not documentElement detected!', window)
      }
    }, 10)

    return false
  } else if (retryCount > 0) {
    console.warn('[h5player message:]', 'documentElement detected!', retryCount, window)
  }

  h5PlayerInit()
}

/**
 * In some extreme cases, directly accessing Window objects will cause an error, so the entire init fry up
 * For example: www.icourse163.org has a certain chance of abnormality
 */
let initTryCount = 0
try {
  init(0)
} catch (e) {
  setTimeout(() => {
    if (initTryCount < 200) {
      initTryCount++
      init(0)
      console.error('[h5player message:]', 'init error', initTryCount, e)
    }
  }, 10)
}
