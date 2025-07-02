// ==UserScript==
// @name                GitHub: Star History
// @description         Adds star history chart to sidebar of GitHub repos
// @author              Adam Lui
// @namespace           https://egore.url.lol/userscripts
// @version             2023.9.7
// @license             MIT
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @match               *://github.com/*
// @connect             api.star-history.com
// @connect             greasyfork.org
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM.xmlHttpRequest
// ==/UserScript==

// @icon                https://github.githubassets.com/favicons/favicon.png

(async () => {

  // Init alert QUEUE
  var alertQueue = []; localStorage.alertQueue = JSON.stringify(alertQueue)

  // Init CONFIG
  const config = {
    appSymbol: '⭐',
    gitHubURL: 'https://github.com/adamlui/github-star-history',
    greasyForkURL: 'https://greasyfork.org/scripts/473377-github-star-history'
  }
  config.updateURL = config.greasyForkURL + '/code/github-star-history.meta.js'

  // Register ABOUT menu command
  // GM_registerMenuCommand('💡 About GitHub Star History', async () => {

  //   // Show alert
  //   const aboutAlertID = alert(
  //     'GitHub Star History v' + GM_info.script.version, '',
  //     [ // buttons
  //       function checkForUpdates() { updateCheck() },
  //       function githubSource() { safeWindowOpen(config.gitHubURL) },
  //       function leaveAReview() {
  //         safeWindowOpen(
  //           config.greasyForkURL + '/feedback#post-discussion')
  //       }
  //     ], '', 507) // About modal width

  //   // Re-format buttons to include emojis + re-case + hide 'Dismiss'
  //   for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
  //     if (/updates/i.test(button.textContent))
  //       button.textContent = '🚀 Check for Updates'
  //     else if (/review/i.test(button.textContent))
  //       button.textContent = '⭐ Leave a Review'
  //     else if (/github/i.test(button.textContent))
  //       button.textContent = '📜 GitHub Source'
  //     else button.style.display = 'none' // hide Dismiss button
  //   }
  // })

  // Observe DOM for need to insert star history
  let starHistoryAdded = false
  const repoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        const onRepoPage = /^https?:\/\/[^/]+\/[^/]+\/[^/]+\/?$/.test(window.location.href)
        if (onRepoPage && !starHistoryAdded) {
          insertStarHistory(); starHistoryAdded = true
        } else if (!onRepoPage && starHistoryAdded) starHistoryAdded = false
      }
    })
  }); repoObserver.observe(document.documentElement, { childList: true, subtree: true })

  // Define SCRIPT functions

  function safeWindowOpen(url) { window.open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

  function updateCheck() {

    // Fetch latest meta
    const currentVer = GM_info.script.version
    GM.xmlHttpRequest({
      method: 'GET', url: config.updateURL + '?t=' + Date.now(),
      headers: { 'Cache-Control': 'no-cache' },
      onload: (response) => {

        // Compare versions
        const latestVer = /@version +(.*)/.exec(response.responseText)[1]
        for (let i = 0; i < 4; i++) { // loop thru subver's
          const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
            latestSubVer = parseInt(latestVer.split('.')[i], 10) || 0
          if (currentSubVer > latestSubVer) break // out of comparison since not outdated
          else if (latestSubVer > currentSubVer) { // if outdated

            // Alert to update
            alert('Update available! 🚀', // title
              'A newer version of GitHub Star History v' + latestVer + ' is available!  '
              + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" '
              + 'href="' + config.gitHubURL + '/commits/main/greasemonkey/'
              + config.updateURL.replace(/.*\/(.*)meta\.js/, '$1user.js') + '" '
              + '>View changes</a>',
              function update() { // button
                GM_openInTab(config.updateURL.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                  { active: true, insert: true } // focus, make adjacent
                ).onclose = () => location.reload()
              },
              '', 383 // width
            )
            return
          }
        }

        alert('Up to date!', `GitHub Star History (v${currentVer}) is up-to-date!`)
      }
    })
  }

  function isDarkMode() {
    return document.documentElement.dataset.colorMode === 'dark' ||
      document.documentElement.dataset.darkreaderScheme === 'dark'
  }

  // Define FEEDBACK functions

  function alert(title, msg, btns, checkbox, width) {
    // [ title/msg = strings, btns = [named functions], checkbox = named function, width (px) = int ] = optional
    // * Spaces are inserted into button labels by parsing function names in camel/kebab/snake case

    // Create modal parent/children elements
    const modalContainer = document.createElement('div')
    modalContainer.id = Math.floor(Math.random() * 1000000) + Date.now()
    modalContainer.classList.add('chatgpt-modal') // add class to main div
    const modal = document.createElement('div')
    const modalTitle = document.createElement('h2')
    const modalMessage = document.createElement('p')

    // Select or crate/append style
    let modalStyle
    if (!document.querySelector('#chatgpt-alert-style')) {
      modalStyle = document.createElement('style')
      modalStyle.id = 'chatgpt-alert-style'
      document.head.appendChild(modalStyle)
    } else modalStyle = document.querySelector('#chatgpt-alert-style')

    // Define styles
    const scheme = isDarkMode() ? 'dark' : 'light'
    modalStyle.innerText = (

      // Background styles
      '.chatgpt-modal {'
      + 'position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ;' // expand to full view-port
      + 'background-color: rgba(67, 70, 72, 0.75) ;' // dim bg
      + 'display: flex ; justify-content: center ; align-items: center ; z-index: 9999 }' // align

      // Alert styles
      + '.chatgpt-modal > div {'
      + `background-color: ${scheme == 'dark' ? 'black' : 'white'} ;`
      + (width ? `width: ${width}px` : 'max-width: 458px ') + ' ;'
      + 'padding: 20px ; margin: 12px 23px ; border-radius: 5px ; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) }'
      + '.chatgpt-modal h2 { font-size: 2em ; margin-bottom: 9px }'
      + '.chatgpt-modal p { font-size: 1.35em }'
      + `.chatgpt-modal a { color: ${scheme == 'dark' ? '#00cfff' : '#1e9ebb'}}`

      // Button styles
      + '.modal-buttons { display: flex ; justify-content: flex-end ; margin: 20px -5px -3px 0 }'
      + '.chatgpt-modal button {'
      + 'margin-left: 10px ; padding: 4px 12px ; border-radius: 6px ;'
      + `border: 1px solid ${scheme == 'dark' ? 'white' : '#979797'}}`
      + '.primary-modal-btn {'
      + `border: 1px solid ${scheme == 'dark' ? 'white' : '#979797'} ;`
      + `background: ${scheme == 'dark' ? 'white' : 'black'} ;`
      + `color: ${scheme == 'dark' ? 'black' : 'white'}}`
      + '.chatgpt-modal button:hover { background-color: #42B4BF ; border-color: #42B4BF ; color: black }'

      /* Checkbox styles */
      + '.chatgpt-modal .checkbox-group { display: flex ; margin-top: -18px }'
      + '.chatgpt-modal .checkbox-group label {'
      + 'font-size: .7rem ; margin: -.04rem 0 0px .3rem ;'
      + `color: ${scheme == 'dark' ? '#e1e1e1' : '#1e1e1e'}}`
      + '.chatgpt-modal input[type="checkbox"] { transform: scale(0.7) ;'
      + `border: 1px solid ${scheme == 'dark' ? 'white' : 'black'}}`
      + '.chatgpt-modal input[type="checkbox"]:checked {'
      + `border: 1px solid ${scheme == 'dark' ? 'white' : 'black'} ;`
      + 'background-color: black ; position: inherit }'
      + '.chatgpt-modal input[type="checkbox"]:focus { outline: none ; box-shadow: none }'
    )

    // Insert text into elements
    modalTitle.innerText = config.appSymbol + ' ' + title || ''
    modalMessage.innerText = msg || ''; renderHTML(modalMessage)

    // Create/append buttons (if provided) to buttons div
    const modalButtons = document.createElement('div')
    modalButtons.classList.add('modal-buttons')
    if (btns) { // are supplied
      if (!Array.isArray(btns)) btns = [btns] // convert single button to array if necessary
      btns.forEach((buttonFn) => { // create title-cased labels + attach listeners
        const button = document.createElement('button')
        button.textContent = buttonFn.name
          .replace(/[_-]\w/g, match => match.slice(1).toUpperCase()) // convert snake/kebab to camel case
          .replace(/([A-Z])/g, ' $1') // insert spaces
          .replace(/^\w/, firstChar => firstChar.toUpperCase()) // capitalize first letter
        button.addEventListener('click', () => { destroyAlert(); buttonFn() })
        modalButtons.insertBefore(button, modalButtons.firstChild) // insert button to left
      })
    }

    // Create/append OK/dismiss button to buttons div
    const dismissBtn = document.createElement('button')
    dismissBtn.textContent = btns ? 'Dismiss' : 'OK'
    dismissBtn.addEventListener('click', destroyAlert)
    modalButtons.insertBefore(dismissBtn, modalButtons.firstChild)

    // Highlight primary button
    modalButtons.lastChild.classList.add('primary-modal-btn')

    // Create/append checkbox (if provided) to checkbox group div
    const checkboxDiv = document.createElement('div')
    if (checkbox) { // is supplied
      checkboxDiv.classList.add('checkbox-group')
      const checkboxFn = checkbox // assign the named function to checkboxFn
      const checkboxInput = document.createElement('input')
      checkboxInput.type = 'checkbox'
      checkboxInput.addEventListener('change', checkboxFn)

      // Create/show label
      const checkboxLabel = document.createElement('label')
      checkboxLabel.addEventListener('click', function () {
        checkboxInput.checked = !checkboxInput.checked; checkboxFn()
      })
      checkboxLabel.textContent = checkboxFn.name.charAt(0).toUpperCase() // capitalize first char
        + checkboxFn.name.slice(1) // format remaining chars
          .replace(/([A-Z])/g, (match, letter) => ' ' + letter.toLowerCase()) // insert spaces, convert to lowercase
          .replace(/\b(\w+)nt\b/gi, '$1n\'t') // insert apostrophe in 'nt' suffixes
          .trim() // trim leading/trailing spaces

      checkboxDiv.appendChild(checkboxInput); checkboxDiv.appendChild(checkboxLabel)
    }

    // Assemble/append div
    const elements = [modalTitle, modalMessage, modalButtons, checkboxDiv]
    elements.forEach((element) => { modal.appendChild(element) })
    modalContainer.appendChild(modal); document.body.appendChild(modalContainer)

    // Enqueue alert
    alertQueue = JSON.parse(localStorage.alertQueue)
    alertQueue.push(modalContainer.id)
    localStorage.alertQueue = JSON.stringify(alertQueue)

    // Add listeners
    document.addEventListener('keydown', keyHandler)
    modalContainer.addEventListener('click', (event) => {
      if (event.target === modalContainer) destroyAlert()
    })

    // Show alert if none active
    modalContainer.style.display = (alertQueue.length === 1) ? '' : 'none'

    function destroyAlert() {
      modalContainer.remove() // remove from DOM
      alertQueue = JSON.parse(localStorage.alertQueue)
      alertQueue.shift() // + memory
      localStorage.alertQueue = JSON.stringify(alertQueue) // + storage

      // Prevent memory leaks
      modalContainer.removeEventListener('click', destroyAlert)
      document.removeEventListener('keydown', keyHandler)
      dismissBtn.removeEventListener('click', destroyAlert)

      // Check for pending alerts in queue
      if (alertQueue.length > 0) {
        const nextAlert = document.getElementById(alertQueue[0])
        setTimeout(() => { nextAlert.style.display = 'flex' }, 500)
      }
    }

    function keyHandler(event) {
      const dismissKeys = [13, 27] // enter/esc
      if (dismissKeys.includes(event.keyCode)) {
        for (const alertId of alertQueue) { // look to handle only if triggering alert is active
          const alert = document.getElementById(alertId)
          if (alert && alert.style.display !== 'none') { // active alert found
            if (event.keyCode === 27) destroyAlert() // if esc pressed, dismiss alert & do nothing
            else if (event.keyCode === 13) { // else if enter pressed
              const mainButton = alert.querySelector('.modal-buttons').lastChild // look for main button
              if (mainButton) { mainButton.click(); event.preventDefault() } // click if found
            } return
          }
        }
      }
    }

    return modalContainer.id
  }

  function renderHTML(node) {
    const reTags = /<([a-z\d]+)\b([^>]*)>([\s\S]*?)<\/\1>/g
    const reAttributes = /(\S+)=['"]?((?:.(?!['"]?\s+(?:\S+)=|[>']))+.)['"]?/g
    const nodeContent = node.childNodes

    // Preserve consecutive spaces + line breaks
    if (!renderHTML.preWrapSet) {
      node.style.whiteSpace = 'pre-wrap'; renderHTML.preWrapSet = true
      setTimeout(() => { renderHTML.preWrapSet = false }, 100)
    }

    // Process child nodes
    for (const childNode of nodeContent) {

      // Process text node
      if (childNode.nodeType === Node.TEXT_NODE) {
        const text = childNode.nodeValue
        const elems = Array.from(text.matchAll(reTags))

        // Process 1st element to render
        if (elems.length > 0) {
          const elem = elems[0]
          const [tagContent, tagName, tagAttributes, tagText] = elem.slice(0, 4)
          const tagNode = document.createElement(tagName); tagNode.textContent = tagText

          // Extract/set attributes
          const attributes = Array.from(tagAttributes.matchAll(reAttributes))
          attributes.forEach(attribute => {
            const name = attribute[1], value = attribute[2].replace(/['"]/g, '')
            tagNode.setAttribute(name, value)
          })

          const renderedNode = renderHTML(tagNode) // render child elements of newly created node

          // Insert newly rendered node
          const beforeTextNode = document.createTextNode(text.substring(0, elem.index))
          const afterTextNode = document.createTextNode(text.substring(elem.index + tagContent.length))

          // Replace text node with processed nodes
          node.replaceChild(beforeTextNode, childNode)
          node.insertBefore(renderedNode, beforeTextNode.nextSibling)
          node.insertBefore(afterTextNode, renderedNode.nextSibling)
        }

        // Process element nodes recursively
      } else if (childNode.nodeType === Node.ELEMENT_NODE) renderHTML(childNode)
    }

    return node // if assignment used
  }

  // Define CHART functions

  function sanitizeImgURL(url) {
    if (!url.startsWith('https://api.star-history.com/svg'))
      throw new Error('>> Invalid URL')
    return url
  }

  async function insertStarHistory() {
    const user = /github\.com\/(.*?)\//.exec(window.location)[1],
      repo = /.*\/(.*)/.exec(window.location)[1]

    try { // to load/insert star history chart

      // Fetch image as blob
      const imgURL = sanitizeImgURL('https://api.star-history.com/svg?repos='
        + `${user}/${repo}&type=Date` + (isDarkMode() ? '&theme=dark' : ''))
      const response = await GM.xmlHttpRequest({
        method: 'GET', url: imgURL, responseType: 'blob'
      })
      if (response.status !== 200) throw new Error('>> Failed to fetch image')

      if (!document.querySelector('#star-history')) {

        // Convert blob to data URL
        const imgDataURL = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(response.response)
        })

        // Create #star-history div + add attrs/HTML/listener
        const starHistoryDiv = document.createElement('div')
        starHistoryDiv.id = 'star-history'
        starHistoryDiv.style.cursor = 'crosshair'
        starHistoryDiv.innerHTML = '<img style="width: 100% ; padding: 20px 0" '
          + 'src="' + imgDataURL + '">'
        starHistoryDiv.addEventListener('click', () => { zoomStarHistory(imgDataURL) })

        // Insert div
        const aboutSection = document.querySelector('[class$="sidebar"] > div > div')
        aboutSection.insertAdjacentElement('afterend', starHistoryDiv)
      }

    } catch (err) { console.error('>> Error loading star history chart:', err) }
  }

  function zoomStarHistory(imgURL) {
    const user = /github\.com\/(.*?)\//.exec(window.location)[1],
      repo = /.*\/(.*)/.exec(window.location)[1]

    // Create/stylize overlay
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'
    overlay.style.width = '100%'; overlay.style.height = '100%'
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; overlay.style.display = 'flex'
    overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'
    overlay.style.zIndex = '9999'

    // Stylize zoomed img
    const zoomedImg = new Image()
    zoomedImg.title = 'View on star-history.com'; zoomedImg.src = imgURL
    zoomedImg.style.maxWidth = '90%'; zoomedImg.style.maxHeight = '90%'
    zoomedImg.style.cursor = 'pointer'

    // Add listeners
    zoomedImg.addEventListener('click', () => { // view on star-history.com
      window.open(`https://star-history.com/#${user}/${repo}&Date`, '_blank')
    })
    overlay.addEventListener('click', () => { document.body.removeChild(overlay) })

    // Append elements
    overlay.appendChild(zoomedImg); document.body.appendChild(overlay)
  }

})()
