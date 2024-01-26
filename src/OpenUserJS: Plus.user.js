// ==UserScript==
// @name               OpenUserJS: Plus
// @author             Davide <iFelix18@protonmail.com>
// @namespace          https://egore.url.lol/userscripts
// @icon               https://www.google.com/s2/favicons?domain=openuserjs.org
// @description        Adds various features and improves the OpenUserJS experience
// @description:de     Fügt verschiedene Funktionen hinzu und verbessert das OpenUserJS-Erlebnis
// @description:es     Agrega varias funciones y mejora la experiencia de OpenUserJS
// @description:fr     Ajoute diverses fonctionnalités et améliore l'expérience OpenUserJS
// @description:it     Aggiunge varie funzionalità e migliora l'esperienza di OpenUserJS
// @description:ru     Добавляет различные функции и улучшает работу с OpenUserJS
// @description:zh-CN  添加各种功能并改善 OpenUserJS 体验
// @copyright          2021, Davide (https://github.com/iFelix18)
// @license            MIT
// @version            2.0.5
// @homepage           https://github.com/iFelix18/Userscripts#readme
// @homepageURL        https://github.com/iFelix18/Userscripts#readme
// @supportURL         https://github.com/iFelix18/Userscripts/issues
// @updateURL          https://raw.githubusercontent.com/iFelix18/Userscripts/master/userscripts/meta/openuserjs-plus.meta.js
// @downloadURL        https://raw.githubusercontent.com/iFelix18/Userscripts/master/userscripts/openuserjs-plus.user.js
// @require            https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.min.js
// @require            https://fastly.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require            https://fastly.jsdelivr.net/npm/@ifelix18/utils@6.5.0/lib/index.min.js
// @require            https://fastly.jsdelivr.net/npm/@violentmonkey/shortcut@1.2.6/dist/index.min.js
// @match              *://openuserjs.org/*
// @connect            openuserjs.org
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         safari
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.deleteValue
// @grant              GM.getValue
// @grant              GM.notification
// @grant              GM.registerMenuCommand
// @grant              GM.setValue
// @run-at             document-start
// @inject-into        page
// ==/UserScript==

/* global $, GM_config, UU, VM */
/* eslint-disable unicorn/prefer-top-level-await */

(async () => {
  //* Constants
  const id = 'openuserjs-plus'
  const title = `${GM.info.script.name} v${GM.info.script.version} Settings`
  const fields = {
    hideBlacklistedScripts: {
      label: 'Hide blacklisted scripts:<br><span>Choose which lists to activate in the section below, press <b>Ctrl + Alt + B</b> to show Blacklisted scripts</span>',
      section: ['Features'],
      labelPos: 'right',
      type: 'checkbox',
      default: true
    },
    hideHiddenScript: {
      label: 'Hide scripts:<br><span>Add a button to hide the script<br>See and edit the list of hidden scripts below, press <b>Ctrl + Alt + H</b> to show Hidden script',
      labelPos: 'right',
      type: 'checkbox',
      default: true
    },
    showInstallButton: {
      label: 'Install button:<br><span>Add to the scripts list a button to install the script directly</span>',
      labelPos: 'right',
      type: 'checkbox',
      default: true
    },
    milestoneNotification: {
      label: 'Milestone notifications:<br><span>Get notified whenever your total installs got over any of these milestone<br>Separate milestones with a comma, leave blank to turn off notifications</span>',
      labelPos: 'left',
      type: 'text',
      title: 'Separate milestones with a comma!',
      size: 150,
      default: '10, 100, 500, 1000, 2500, 5000, 10000, 100000, 1000000'
    },
    nonLatins: {
      label: 'Non-Latin:<br><span>This list blocks all scripts with non-Latin characters in the title/description</span>',
      section: ['Lists'],
      labelPos: 'right',
      type: 'checkbox',
      default: true
    },
    blacklist: {
      label: 'Blacklist:<br><span>A "non-opinionable" list that blocks all scripts with emoji in the title/description, references to "bots", "cheats" and some online game sites, and other "bullshit"</span>',
      labelPos: 'right',
      type: 'checkbox',
      default: true
    },
    customBlacklist: {
      label: 'Custom Blacklist:<br><span>Personal blacklist defined by a set of unwanted words<br>Separate unwanted words with a comma (example: YouTube, Facebook, pizza), leave blank to disable this list</span>',
      labelPos: 'left',
      type: 'text',
      title: 'Separate unwanted words with a comma!',
      size: 150,
      default: ''
    },
    hiddenList: {
      label: 'Hidden Scripts:<br><span>Block individual undesired scripts by their names<br>Separate each script with a new line</span>',
      labelPos: 'left',
      type: 'textarea',
      title: 'Separate each script with a new line!',
      default: '',
      save: false
    },
    logging: {
      label: 'Logging',
      section: ['Developer options'],
      labelPos: 'right',
      type: 'checkbox',
      default: false
    },
    debugging: {
      label: 'Debugging',
      labelPos: 'right',
      type: 'checkbox',
      default: false
    }
  }
  const logo = 'data:image/png;base64,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'
  const nonLatins = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/gu
  const blacklist = new RegExp([ /* cspell: disable-next-line */
    '\\bagar((.)?io)?\\b', '\\bagma((.)?io)?\\b', '\\baimbot\\b', '\\barras((.)?io)?\\b', '\\bbot(s)?\\b', '\\bbubble((.)?am)?\\b', '\\bcheat(s)?\\b', '\\bdiep((.)?io)?\\b', '\\bfreebitco((.)?in)?\\b', '\\bgota((.)?io)?\\b', '\\bhack(s)?\\b', '\\bkrunker((.)?io)?\\b', '\\blostworld((.)?io)?\\b', '\\bmoomoo((.)?io)?\\b', '\\broblox(.com)?\\b', '\\bshell\\sshockers\\b', '\\bshellshock((.)?io)?\\b', '\\bshellshockers\\b', '\\bskribbl((.)?io)?\\b', '\\bslither((.)?io)?\\b', '\\bsurviv((.)?io)?\\b', '\\btaming((.)?io)?\\b', '\\bvenge((.)?io)?\\b', '\\bvertix((.)?io)?\\b', '\\bzombs((.)?io)?\\b', '\\p{Extended_Pictographic}'
  ].join('|'), 'giu')
  const hiddenList = await GM.getValue('hiddenList', [])

  //* GM_config
  GM_config.init({
    id,
    title,
    fields,
    css: '#openuserjs-plus *{font-family:Open Sans,sans-serif,Segoe UI Emoji!important;font-size:12px}#openuserjs-plus .section_header{background-color:#0057b7!important;border:1px solid transparent!important;color:#fff!important}#openuserjs-plus .field_label{margin-bottom:4px!important}#openuserjs-plus .field_label span{font-size:95%!important;font-style:italic!important;opacity:.8!important}#openuserjs-plus .field_label b{color:#0057b7!important}#openuserjs-plus .config_var{display:flex!important}#openuserjs-plus_customBlacklist_var,#openuserjs-plus_hiddenList_var,#openuserjs-plus_milestoneNotification_var{flex-direction:column!important;margin-left:21px!important}#openuserjs-plus_field_customBlacklist,#openuserjs-plus_field_milestoneNotification{flex:1!important}#openuserjs-plus_field_hiddenList{box-sizing:border-box!important;overflow:hidden!important;resize:none!important;width:100%!important}',
    events: {
      init: () => {
        // ? remove old hiddenList from Greasy Fork+ 1.x
        if (!Array.isArray(hiddenList)) {
          GM.deleteValue('hiddenList')
          setTimeout(window.location.reload(false), 500)
        }

        //! Userscripts Safari: GM.registerMenuCommand is missing
        if (GM.info.scriptHandler !== 'Userscripts') GM.registerMenuCommand('Configure', () => GM_config.open())
      },
      open: async (document) => {
        const textarea = $(document).find(`#${id}_field_hiddenList`)

        // show unsaved hidden list in config panel
        const hiddenList = await GM.getValue('hiddenList', [])
        const unsavedHiddenList = GM_config.get('hiddenList') !== '' ? GM_config.get('hiddenList').split(/\n/g).map(String) : undefined

        if (($(hiddenList).not(unsavedHiddenList).length > 0 || $(unsavedHiddenList).not(hiddenList).length > 0) && !$.isEmptyObject(hiddenList)) {
          GM_config.fields.hiddenList.value = hiddenList.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0)).join('\n')

          // ? fix GM_config
          GM_config.close()
          GM_config.open()
        }

        // resize textarea on creation and editing
        const resize = (target) => {
          $(target).height('')
          $(target).height($(target)[0].scrollHeight)
        }

        resize(textarea)
        $(textarea).bind({
          input: (event) => resize(event.target)
        })
      },
      save: (forgotten) => {
        // store unsaved hiddenList
        const unsavedHiddenList = forgotten.hiddenList !== '' ? forgotten.hiddenList.split(/\n/g).map(String).filter((element) => element !== undefined && element !== '') : undefined

        if (GM_config.isOpen) {
          GM.setValue('hiddenList', $.makeArray(unsavedHiddenList))

          UU.alert('settings saved')
          GM_config.close()
          setTimeout(window.location.reload(false), 500)
        }
      }
    }
  })

  //* Utils
  UU.init({ id, logging: GM_config.get('logging') })
  UU.log(nonLatins)
  UU.log(blacklist)
  UU.log(hiddenList)

  //* Shortcuts
  const { register } = VM.shortcut
  register('ctrl-alt-s', () => {
    GM_config.open()
  })
  register('ctrl-alt-b', () => {
    $('.panel-default > .table .tr-link.blacklisted').toggle()
  })
  register('ctrl-alt-h', () => {
    $('.panel-default > .table .tr-link.hidden-script').toggle()
  })

  //* Functions
  /**
   * Adds a link to the menu to access the script configuration
   */
  const addSettingsToMenu = () => {
    const menu = `<li class=${id}><a href=""onclick=return!1>${GM.info.script.name}</a>`

    $('.navbar-collapse-top > .navbar-right > li').first().before(menu)
    $(`.${id}`).click(() => GM_config.open())
  }

  /**
   * Adds buttons to the side menu to quickly show/hide scripts hidden by filters
   */
  const addOptions = () => {
    // create menu
    const html = `<div class="panel panel-default"id=${id}-options><a class=panel-heading href=/settings/ onclick=return!1><div class=panel-title><i class="fa fa-exclamation-circle fa-fw"></i>${GM.info.script.name} Lists</div></a><div><div class=table-responsive><table class="table table-condensed table-hover table-striped"><tr class="list-option blacklisted"><td class=align-middle><b><a class=tr-link-a href=/blacklist onclick=return!1>Blacklisted scripts (${$('.panel-default > .table .tr-link.blacklisted').length})</a></b><tr class="list-option hidden-script"><td class=align-middle><b><a class=tr-link-a href=/blacklist onclick=return!1>Hidden scripts (${$('.panel-default > .table .tr-link.hidden-script').length})</a></b></table></div></div></div>`
    $('.col-sm-4 > .panel-default').first().before(html)

    // click
    $('.list-option.blacklisted').click(() => $('.panel-default > .table .tr-link.blacklisted').toggle())
    $('.list-option.hidden-script').click(() => $('.panel-default > .table .tr-link.hidden-script').toggle())
  }

  /**
   * Get user data from Greasy Fork API
   *
   * @param {string} userID User ID
   * @returns {Promise} User data
   */
  const getUserData = (userID) => {
    return new Promise((resolve, reject) => {
      fetch(`https://openuserjs.org${userID}`)
        .then((response) => {
          UU.log(`${response.status}: ${response.url}`)
          return response.text()
        })
        .then((data) => resolve(data))
    })
  }

  /**
   * Return label for the hide script button
   *
   * @param {boolean} hidden Is hidden
   * @returns {string} Label
   */
  const blockLabel = (hidden) => {
    return hidden ? '✔️ Not hide this script' : '❌ Hide this script'
  }

  /**
   * Hide a blacklisted script
   *
   * @param {object} element  Script
   * @param {string} list     Blacklist name
   */
  const hideBlacklistedScript = (element, list) => {
    const name = $(element).find('.tr-link-a b').text()
    const description = $(element).find('td:nth-child(1) p').text()

    if (!name) return

    switch (list) {
      case 'nonLatins':
        if ((nonLatins.test(name) || nonLatins.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted non-latins')
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.tr-link-a b').append(' (non-latin)') }
        }
        break
      case 'blacklist':
        if ((blacklist.test(name) || blacklist.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted blacklist')
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.tr-link-a b').append(' (blacklist)') }
        }
        break
      case 'customBlacklist': {
        const customBlacklist = new RegExp(GM_config.get('customBlacklist').replace(/\s/g, '').split(',').join('|'), 'giu')
        if ((customBlacklist.test(name) || customBlacklist.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted custom-blacklist')
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.tr-link-a b').append(' (custom-blacklist)') }
        }
        break
      }
      default:
        UU.log('No blacklists')
        break
    }
  }

  /**
   * Hide a hidden scripts
   *
   * @param {object} element Script
   * @param {boolean} list Is list
   */
  const hideHiddenScript = async (element, list) => {
    const name = list ? $(element).find('.tr-link-a b').text() : $(element).find('.script-name').text()

    if (!name) return

    // if is in hiddenList hide it
    if ($.inArray(name, hiddenList) !== -1) {
      $(element).addClass('hidden-script')
      if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)') }
    }

    // add button to hide the script
    $(element).find('td:nth-child(1) span:last-of-type').after(`<span class=block-button role=button style=cursor:pointer;margin-left:1ex>${blockLabel($(element).hasClass('hidden-script'))}</span>`)
    $(element).find('.script-name').after(`<span class=block-button role=button style=cursor:pointer;margin-left:1ex;font-size:70%>${blockLabel($(element).hasClass('hidden-script'))}</span>`)

    // on click...
    $(element).find('.block-button').click((event) => {
      event.stopPropagation()

      // ...if it is not in the list add it and hide it...
      if ($.inArray(name, hiddenList) === -1) {
        hiddenList.push(name)

        GM.setValue('hiddenList', hiddenList)

        if (list) {
          $(element).hide(750).addClass('hidden-script').find('.block-button').text(blockLabel($(element).hasClass('hidden-script')))
          if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)') }
        } else {
          $(element).addClass('hidden-script').find('.block-button').text(blockLabel($(element).hasClass('hidden-script')))
          if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)') }
        }
      } else { // ...else remove it
        hiddenList.splice($.inArray(name, hiddenList), 1)

        GM.setValue('hiddenList', hiddenList)

        $(element).removeClass('hidden-script').find('.block-button').text(blockLabel($(element).hasClass('hidden-script')))
        if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').html($(element).find('.script-link').html().replace(' (hidden)', '')) }
      }
    })
  }

  /**
   * Shows a button to install the script
   *
   * @param {object} element Script
   */
  const addInstallButton = (element) => {
    const regex = /\/scripts\//g
    let url = $(element).find('.tr-link-a').attr('href')

    if (!url) return

    if (regex.test(url)) {
      url = url.replace(regex, '/install/') + '.user.js'

      $(element).find('.script-version').before(`<span class="install-script label label-info"style=margin-right:1ex><a href=${url}>Install</a></span>`)
    }
  }

  //* Main Script
  $(async () => {
    addSettingsToMenu()

    const userID = $('.navbar-default .navbar-nav > li > a[title^="My profile"]').length > 0 ? $('.navbar-default .navbar-nav > li > a[title^="My profile"]').attr('href') : undefined

    // blacklisted scripts / hidden scripts / install button
    if (!window.location.pathname.startsWith(userID) && !/groups/.test(window.location.pathname) && (GM_config.get('hideBlacklistedScripts') || GM_config.get('hideHiddenScript') || GM_config.get('showInstallButton'))) {
      // for each script in the list
      $('.panel-default > .table .tr-link').each((index, element) => {
        // blacklisted scripts
        if (GM_config.get('nonLatins')) hideBlacklistedScript(element, 'nonLatins')
        if (GM_config.get('blacklist')) hideBlacklistedScript(element, 'blacklist')
        if (GM_config.get('customBlacklist')) hideBlacklistedScript(element, 'customBlacklist')

        // hidden scripts
        if (GM_config.get('hideHiddenScript')) hideHiddenScript(element, true)

        // install button
        if (GM_config.get('showInstallButton')) addInstallButton(element)
      })

      // hidden scripts on details page
      if (GM_config.get('hideHiddenScript') && window.location.pathname.includes('/scripts/')) {
        const element = $('#body > .container-fluid')
        hideHiddenScript(element, false)
      }

      // add options and style for blacklisted/hidden scripts
      if (GM_config.get('hideBlacklistedScripts') || GM_config.get('hideHiddenScript')) {
        addOptions()
        UU.addStyle('.panel-default>.table .tr-link.blacklisted,.panel-default>.table .tr-link.blacklisted:hover{display:none;background:#321919;color:#e8e6e3}.panel-default>.table .tr-link.hidden-script,.panel-default>.table .tr-link.hidden-script:hover{display:none;background:#321932;color:#e8e6e3}.container-fluid.hidden-script .col-sm-8,.container-fluid.hidden-script .col-sm-8 .panel-body{background:#321932;color:#e8e6e3}.container-fluid.hidden-script .col-sm-8 code{background-color:transparent}')
      }
    }

    // milestone notification
    if (GM_config.get('milestoneNotification')) {
      const milestones = GM_config.get('milestoneNotification').replace(/\s/g, '').split(',').map(Number)

      if (!userID) return

      const userData = await getUserData(userID).then()
      const totalInstalls = $(userData).find('.dl-horizontal dt:contains("Total installs")').next('dd').text()
      const lastMilestone = await GM.getValue('lastMilestone', 0)
      const milestone = $($.grep(milestones, (milestone) => totalInstalls >= milestone)).get(-1)

      UU.log(`total installs are "${totalInstalls}", milestone reached is "${milestone}", last milestone reached is "${lastMilestone}"`)

      if (milestone <= lastMilestone) return

      GM.setValue('lastMilestone', milestone)

      const text = `Congrats, your scripts got over the milestone of ${milestone.toLocaleString()} total installs!`
      if (GM.info.scriptHandler !== 'Userscripts') { //! Userscripts Safari: GM.notification is missing
        GM.notification({
          text,
          title: GM.info.script.name,
          image: logo,
          onclick: () => {
            window.location = `https://${window.location.hostname}users/${$(userID).text()}/scripts`
          }
        })
      } else {
        UU.alert(text)
      }
    }
  })
})()