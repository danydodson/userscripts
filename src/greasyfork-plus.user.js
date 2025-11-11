// ==UserScript==
// @name         Greasy Fork Plus
// @author       Davide <iFelix18@protonmail.com>
// @namespace    https://egore.url.lol/userscripts
// @icon         https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png
// @description  Adds various features and improves the greasyfork experience.
// @copyright    2021, Davide (https://github.com/iFelix18)
// @license      MIT
// @version      2.0.6
// @homepage     https://github.com/iFelix18/Userscripts#readme
// @homepageURL  https://github.com/iFelix18/Userscripts#readme
// @supportURL   https://github.com/iFelix18/Userscripts/issues
// @require      https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.min.js
// @require      https://fastly.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://fastly.jsdelivr.net/npm/@ifelix18/utils@6.5.0/lib/index.min.js
// @require      https://fastly.jsdelivr.net/npm/@violentmonkey/shortcut@1.2.6/dist/index.min.js
// @match        *://greasyfork.org/*
// @match        *://sleazyfork.org/*
// @connect      greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @run-at       document-start
// @inject-into  page
// ==/UserScript==

/* global $, GM_config, UU, VM */
(async () => {
  //* Constants
  const id = 'greasyfork-plus';
  const title = `${GM.info.script.name} v${GM.info.script.version} Settings`;
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
    showTotalInstalls: {
      label: 'Installations:<br><span>Shows the number of daily and total installations on the user profile</span>',
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
      label: 'Hidden Scripts:<br><span>Block individual undesired scripts by their unique IDs<br>Separate IDs with a comma</span>',
      labelPos: 'left',
      type: 'textarea',
      title: 'Separate IDs with a comma!',
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
  };
  const logo = 'data:image/png;base64,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';
  const nonLatins = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/gu;
  const blacklist = new RegExp([ /* cSpell: disable-next-line */
    '\\bagar((.)?io)?\\b', '\\bagma((.)?io)?\\b', '\\baimbot\\b', '\\barras((.)?io)?\\b', '\\bbot(s)?\\b', '\\bbubble((.)?am)?\\b', '\\bcheat(s)?\\b', '\\bdiep((.)?io)?\\b', '\\bfreebitco((.)?in)?\\b', '\\bgota((.)?io)?\\b', '\\bhack(s)?\\b', '\\bkrunker((.)?io)?\\b', '\\blostworld((.)?io)?\\b', '\\bmoomoo((.)?io)?\\b', '\\broblox(.com)?\\b', '\\bshell\\sshockers\\b', '\\bshellshock((.)?io)?\\b', '\\bshellshockers\\b', '\\bskribbl((.)?io)?\\b', '\\bslither((.)?io)?\\b', '\\bsurviv((.)?io)?\\b', '\\btaming((.)?io)?\\b', '\\bvenge((.)?io)?\\b', '\\bvertix((.)?io)?\\b', '\\bzombs((.)?io)?\\b', '\\p{Extended_Pictographic}'
  ].join('|'), 'giu');
  const hiddenList = await GM.getValue('hiddenList', []);
  const lang = $('html').attr('lang');
  const locales = { /* cSpell: disable */
    de: {
      downgrade: 'Auf zurückstufen',
      hide: '❌ Dieses skript ausblenden',
      install: 'Installieren',
      notHide: '✔️ Dieses skript nicht ausblenden',
      milestone: 'Herzlichen Glückwunsch, Ihre Skripte haben den Meilenstein von insgesamt $1 Installationen überschritten!',
      reinstall: 'Erneut installieren',
      update: 'Auf aktualisieren'
    },
    en: {
      downgrade: 'Downgrade to',
      hide: '❌ Hide this script',
      install: 'Install',
      notHide: '✔️ Not hide this script',
      milestone: 'Congrats, your scripts got over the milestone of $1 total installs!',
      reinstall: 'Reinstall',
      update: 'Update to'
    },
    es: {
      downgrade: 'Degradar a',
      hide: '❌ Ocultar este script',
      install: 'Instalar',
      notHide: '✔️ No ocultar este script',
      milestone: '¡Felicidades, sus scripts superaron el hito de $1 instalaciones totales!',
      reinstall: 'Reinstalar',
      update: 'Actualizar a'
    },
    fr: {
      downgrade: 'Revenir à',
      hide: '❌ Cacher ce script',
      install: 'Installer',
      notHide: '✔️ Ne pas cacher ce script',
      milestone: 'Félicitations, vos scripts ont franchi le cap des $1 installations au total!',
      reinstall: 'Réinstaller',
      update: 'Mettre à'
    },
    it: {
      downgrade: 'Riporta a',
      hide: '❌ Nascondi questo script',
      install: 'Installa',
      notHide: '✔️ Non nascondere questo script',
      milestone: 'Congratulazioni, i tuoi script hanno superato il traguardo di $1 installazioni totali!',
      reinstall: 'Reinstalla',
      update: 'Aggiorna a'
    },
    ru: {
      downgrade: 'Откатить до',
      hide: '❌ Скрыть этот скрипт',
      install: 'Установить',
      notHide: '✔️ Не скрывать этот сценарий',
      milestone: 'Поздравляем, ваши скрипты преодолели рубеж в $1 установок!',
      reinstall: 'Переустановить',
      update: 'Обновить до'
    },
    'zh-CN': {
      downgrade: '降级到',
      hide: '❌ 隐藏此脚本',
      install: '安装',
      notHide: '✔️ 不隐藏此脚本',
      milestone: '恭喜，您的脚本超过了 $1 次总安装的里程碑！',
      reinstall: '重新安装',
      update: '更新到'
    }
  }; /* cSpell: enable */

  //* GM_config
  GM_config.init({
    id,
    title,
    fields,
    css: '#greasyfork-plus *{font-family:Open Sans,sans-serif,Segoe UI Emoji!important;font-size:12px}#greasyfork-plus .section_header{background-color:#670000!important;background-image:linear-gradient(#670000,#900)!important;border:1px solid transparent!important;color:#fff!important}#greasyfork-plus .field_label{margin-bottom:4px!important}#greasyfork-plus .field_label span{font-size:95%!important;font-style:italic!important;opacity:.8!important}#greasyfork-plus .field_label b{color:#670000!important}#greasyfork-plus .config_var{display:flex!important}#greasyfork-plus_customBlacklist_var,#greasyfork-plus_hiddenList_var,#greasyfork-plus_milestoneNotification_var{flex-direction:column!important;margin-left:21px!important}#greasyfork-plus_field_customBlacklist,#greasyfork-plus_field_milestoneNotification{flex:1!important}#greasyfork-plus_field_hiddenList{box-sizing:border-box!important;overflow:hidden!important;resize:none!important;width:100%!important}',
    events: {
      init: () => {
        // ? remove old hiddenList from Greasy Fork+ 1.x
        if (!Array.isArray(hiddenList)) {
          GM.deleteValue('hiddenList');
          setTimeout(window.location.reload(false), 500);
        }

        //! Userscripts Safari: GM.registerMenuCommand is missing
        if (GM.info.scriptHandler !== 'Userscripts') GM.registerMenuCommand('Configure', () => GM_config.open());
      },
      open: async (document) => {
        const textarea = $(document).find(`#${id}_field_hiddenList`);

        // show unsaved hidden list in config panel
        const hiddenList = await GM.getValue('hiddenList', []);
        const unsavedHiddenList = GM_config.get('hiddenList') !== '' ? GM_config.get('hiddenList').split(',').map(Number) : undefined;

        if (($(hiddenList).not(unsavedHiddenList).length > 0 || $(unsavedHiddenList).not(hiddenList).length > 0) && !$.isEmptyObject(hiddenList)) {
          GM_config.fields.hiddenList.value = hiddenList.sort((a, b) => a - b).join(', ');

          // ? fix GM_config
          GM_config.close();
          GM_config.open();
        }

        // resize textarea on creation and editing
        const resize = (target) => {
          $(target).height('');
          $(target).height($(target)[0].scrollHeight);
        };

        resize(textarea);
        $(textarea).bind({
          input: (event) => resize(event.target)
        });
      },
      save: (forgotten) => {
        // store unsaved hiddenList
        const unsavedHiddenList = forgotten.hiddenList !== '' ? forgotten.hiddenList.split(',').map(Number).filter((element) => element !== 0) : undefined;

        if (GM_config.isOpen) {
          GM.setValue('hiddenList', $.makeArray(unsavedHiddenList));

          UU.alert('settings saved');
          GM_config.close();
          setTimeout(window.location.reload(false), 500);
        }
      }
    }
  });

  //* Utils
  UU.init({ id, logging: GM_config.get('logging') });
  UU.log(nonLatins);
  UU.log(blacklist);
  UU.log(hiddenList);

  //* Shortcuts
  const { register } = VM.shortcut;
  register('ctrl-alt-s', () => {
    GM_config.open();
  });
  register('ctrl-alt-b', () => {
    $('.script-list li.blacklisted').toggle();
  });
  register('ctrl-alt-h', () => {
    $('.script-list li.hidden').toggle();
  });

  //* Functions
  /**
   * Adds a link to the menu to access the script configuration
   */
  const addSettingsToMenu = () => {
    const menu = `<li class=${id}><a href=""onclick=return!1>${GM.info.script.name}</a>`;

    $('#site-nav > nav > li').first().before(menu);
    $(`.${id}`).click(() => GM_config.open());
  };

  /**
   * Adds buttons to the side menu to quickly show/hide scripts hidden by filters
   */
  const addOptions = () => {
    // create menu
    const html = `<div class=list-option-group id=${id}-options>${GM.info.script.name} Lists:<ul><li class="list-option blacklisted"><a href=/blacklist onclick=return!1>Blacklisted scripts (${$('.script-list li.blacklisted').length})</a><li class="list-option hidden"><a href=/blacklist onclick=return!1>Hidden scripts (${$('.script-list li.hidden').length})</a></ul></div>`;
    $('.list-option-groups > div').first().before(html);

    // click
    $('.list-option-group li.blacklisted').click(() => $('.script-list li.blacklisted').toggle());
    $('.list-option-group li.hidden').click(() => $('.script-list li.hidden').toggle());
  };

  /**
   * Get script data from Greasy Fork API
   *
   * @param {number} id Script ID
   * @returns {Promise} Script data
   */
  const getScriptData = async (id) => {
    return new Promise((resolve, reject) => {
      fetch(`https://${window.location.hostname}/scripts/${id}.json`)
        .then((response) => {
          UU.log(`${response.status}: ${response.url}`);
          return response.json();
        })
        .then((data) => resolve(data));
    });
  };

  /**
   * Get user data from Greasy Fork API
   *
   * @param {string} userID User ID
   * @returns {Promise} User data
   */
  const getUserData = (userID) => {
    return new Promise((resolve, reject) => {
      fetch(`https://${window.location.hostname}/users/${userID}.json`)
        .then((response) => {
          UU.log(`${response.status}: ${response.url}`);
          return response.json();
        }).then((data) => resolve(data));
    });
  };

  /**
   * Get user total installs
   *
   * @param {object} data Data
   * @returns {Promise} Total installs
   */
  const getTotalInstalls = (data) => {
    return new Promise((resolve, reject) => {
      const totalInstalls = [];

      $.each(data.scripts, (index, element) => {
        totalInstalls.push(Number.parseInt(element.total_installs, 10));
      });

      resolve(totalInstalls.reduce((a, b) => a + b, 0));
    });
  };

  /**
   * Returns installed version
   *
   * @param {string} name Script name
   * @param {string} namespace Script namespace
   * @returns {string} Installed version
   */
  const isInstalled = (name, namespace) => {
    return new Promise((resolve, reject) => {
      if (window.external && window.external.Violentmonkey) {
        window.external.Violentmonkey.isInstalled(name, namespace).then((data) => resolve(data));
        return;
      }

      if (window.external && window.external.Tampermonkey) {
        window.external.Tampermonkey.isInstalled(name, namespace, (data) => {
          (data.installed) ? resolve(data.version) : resolve();
        });
        return;
      }

      resolve();
    });
  };

  /**
   * Compare two version
   *
   * @param {string} v1 First version
   * @param {string} v2 Second version
   * @returns {number} Comparison value
   */
  const compareVersions = (v1, v2) => {
    if (!v1 || !v2) return;
    if (v1 === null || v2 === null) return;
    if (v1 === v2) return 0;

    const sv1 = v1.split('.').map((index) => +index);
    const sv2 = v2.split('.').map((index) => +index);

    for (let index = 0; index < Math.max(sv1.length, sv2.length); index++) {
      if (sv1[index] > sv2[index]) return 1;
      if (sv1[index] < sv2[index]) return -1;
    }

    return 0;
  };

  /**
   * Return label for the hide script button
   *
   * @param {boolean} hidden Is hidden
   * @returns {string} Label
   */
  const blockLabel = (hidden) => {
    return hidden ? (locales[lang] ? locales[lang].notHide : locales.en.notHide) : (locales[lang] ? locales[lang].hide : locales.en.hide);
  };

  /**
   * Return label for the install button
   *
   * @param {number} update Update value
   * @returns {string} Label
   */
  const installLabel = (update) => {
    switch (update) {
      case undefined: {
        return locales[lang] ? locales[lang].install : locales.en.install;
      }
      case 1: {
        return locales[lang] ? locales[lang].update : locales.en.update;
      }
      case -1: {
        return locales[lang] ? locales[lang].downgrade : locales.en.downgrade;
      }
      default: {
        return locales[lang] ? locales[lang].reinstall : locales.en.reinstall;
      }
    }
  };

  /**
   * Hide a blacklisted script
   *
   * @param {object} element  Script
   * @param {string} list     Blacklist name
   */
  const hideBlacklistedScript = (element, list) => {
    const name = $(element).find('.script-link').text();
    const description = $(element).find('.script-description').text();

    if (!name) return;

    switch (list) {
      case 'nonLatins':
        if ((nonLatins.test(name) || nonLatins.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted non-latins');
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (non-latin)'); }
        }
        break;
      case 'blacklist':
        if ((blacklist.test(name) || blacklist.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted blacklist');
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (blacklist)'); }
        }
        break;
      case 'customBlacklist': {
        const customBlacklist = new RegExp(GM_config.get('customBlacklist').replace(/\s/g, '').split(',').join('|'), 'giu');
        if ((customBlacklist.test(name) || customBlacklist.test(description)) && !$(element).hasClass('blacklisted')) {
          $(element).addClass('blacklisted custom-blacklist');
          if (GM_config.get('hideBlacklistedScripts') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (custom-blacklist)'); }
        }
        break;
      }
      default:
        UU.log('No blacklists');
        break;
    }
  };

  /**
   * Hide a hidden scripts
   *
   * @param {object} element Script
   * @param {number} id Script ID
   * @param {boolean} list Is list
   */
  const hideHiddenScript = async (element, id, list) => {
    // if is in hiddenList hide it
    if ($.inArray(id, hiddenList) !== -1) {
      $(element).addClass('hidden');
      if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)'); }
    }

    // add button to hide the script
    $(element).find('.badge-js, .badge-css').before(`<span class=block-button role=button style=cursor:pointer;font-size:70%>${blockLabel($(element).hasClass('hidden'))}</span>`);
    $(element).find('header h2').append(`<span class=block-button role=button style=cursor:pointer;font-size:50%;margin-left:1ex>${blockLabel($(element).hasClass('hidden'))}</span>`);

    // on click...
    $(element).find('.block-button').click((event) => {
      event.stopPropagation();

      // ...if it is not in the list add it and hide it...
      if ($.inArray(id, hiddenList) === -1) {
        hiddenList.push(id);

        GM.setValue('hiddenList', hiddenList);

        if (list) {
          $(element).hide(750).addClass('hidden').find('.block-button').text(blockLabel($(element).hasClass('hidden')));
          if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)'); }
        } else {
          $(element).addClass('hidden').find('.block-button').text(blockLabel($(element).hasClass('hidden')));
          if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').append(' (hidden)'); }
        }
      } else { // ...else remove it
        hiddenList.splice($.inArray(id, hiddenList), 1);

        GM.setValue('hiddenList', hiddenList);

        $(element).removeClass('hidden').find('.block-button').text(blockLabel($(element).hasClass('hidden')));
        if (GM_config.get('hideHiddenScript') && GM_config.get('debugging')) { $(element).find('.script-link').html($(element).find('.script-link').html().replace(' (hidden)', '')); }
      }
    });
  };

  /**
   * Shows a button to install the script
   *
   * @param {object} element Script
   * @param {string} url Script URL
   * @param {string} label Label
   * @param {string} version Script version
   */
  const addInstallButton = (element, url, label, version) => {
    $(element)
      .find('.badge-js, .badge-css')
      .after(`<a class=install-link href=${url} style=float:right;zoom:.7;-moz-transform:scale(.7);text-decoration:none>${label} ${version}</a>`);
  };

  //* Main Script
  $(async () => {
    addSettingsToMenu();

    const userID = $('.user-profile-link a').length > 0 ? $('.user-profile-link a').attr('href') : undefined;

    // blacklisted scripts / hidden scripts / install button
    if (window.location.pathname !== userID && !/discussions/.test(window.location.pathname) && (GM_config.get('hideBlacklistedScripts') || GM_config.get('hideHiddenScript') || GM_config.get('showInstallButton'))) {
      // for each script in the list
      UU.observe.creation('.script-list', (scriptList) => {
        $(scriptList).find('li').each(async (index, element) => {
          const scriptID = $(element).data('script-id');

          // blacklisted scripts
          if (GM_config.get('nonLatins')) hideBlacklistedScript(element, 'nonLatins');
          if (GM_config.get('blacklist')) hideBlacklistedScript(element, 'blacklist');
          if (GM_config.get('customBlacklist')) hideBlacklistedScript(element, 'customBlacklist');

          // hidden scripts
          if (GM_config.get('hideHiddenScript')) hideHiddenScript(element, scriptID, true);

          // install button
          if (GM_config.get('showInstallButton')) {
            const script = await getScriptData(scriptID).then();
            const installed = await isInstalled(script.name, script.namespace).then();
            const update = compareVersions(script.version, installed);
            const label = installLabel(update);

            addInstallButton(element, script.code_url, label, script.version);
          }
        });
      });

      // hidden scripts on details page
      if (GM_config.get('hideHiddenScript') && $('#script-info').length > 0) {
        const id = $('#script-info').find('.install-link').data('script-id');
        hideHiddenScript($('#script-info'), id, false);
      }

      // add options and style for blacklisted/hidden scripts
      if (GM_config.get('hideBlacklistedScripts') || GM_config.get('hideHiddenScript')) {
        addOptions();
        UU.addStyle('.script-list li.blacklisted{display:none;background:#321919;color:#e8e6e3}.script-list li.hidden{display:none;background:#321932;color:#e8e6e3}.script-list li.blacklisted a:not(.install-link),.script-list li.hidden a:not(.install-link){color:#ff8484}#script-info.hidden,#script-info.hidden .user-content{background:#321932;color:#e8e6e3}#script-info.hidden a:not(.install-link):not(.install-help-link){color:#ff8484}#script-info.hidden code{background-color:transparent}');
      }
    }

    // total installs
    if (GM_config.get('showTotalInstalls') && $('#user-script-list').length > 0) {
      const dailyInstalls = [];
      const totalInstalls = [];

      $('#user-script-list').find('li dd.script-list-daily-installs').each((index, element) => {
        dailyInstalls.push(Number.parseInt($(element).text().replace(/\D/g, ''), 10));
      });
      $('#user-script-list').find('li dd.script-list-total-installs').each((index, element) => {
        totalInstalls.push(Number.parseInt($(element).text().replace(/\D/g, ''), 10));
      });

      $('#script-list-sort').find('.list-option.list-current:nth-child(1), .list-option:not(list-current):nth-child(1) a').append(`<span> (${dailyInstalls.reduce((a, b) => a + b, 0).toLocaleString()})</span>`);
      $('#script-list-sort').find('.list-option.list-current:nth-child(2), .list-option:not(list-current):nth-child(2) a').append(`<span> (${totalInstalls.reduce((a, b) => a + b, 0).toLocaleString()})</span>`);
    }

    // milestone notification
    if (GM_config.get('milestoneNotification')) {
      const milestones = GM_config.get('milestoneNotification').replace(/\s/g, '').split(',').map(Number);

      if (!userID) return;

      const userData = await getUserData(userID.match(/\d+(?=\D)/g)).then();
      const totalInstalls = await getTotalInstalls(userData).then();
      const lastMilestone = await GM.getValue('lastMilestone', 0);
      const milestone = $($.grep(milestones, (milestone) => totalInstalls >= milestone)).get(-1);

      UU.log(`total installs are "${totalInstalls}", milestone reached is "${milestone}", last milestone reached is "${lastMilestone}"`);

      if (milestone <= lastMilestone) return;

      GM.setValue('lastMilestone', milestone);

      const text = (locales[lang] ? locales[lang].milestone : locales.en.milestone).replace('$1', milestone.toLocaleString());
      if (GM.info.scriptHandler !== 'Userscripts') { //! Userscripts Safari: GM.notification is missing
        GM.notification({
          text,
          title: GM.info.script.name,
          image: logo,
          onclick: () => {
            window.location = `https://${window.location.hostname}${userID}#user-script-list-section`;
          }
        });
      } else {
        UU.alert(text);
      }
    }
  });
})();
