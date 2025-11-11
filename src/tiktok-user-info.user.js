// ==UserScript==
// @name         TikTok User Info
// @description  Additional user info from TikTok profiles.
// @author       Brudda
// @namespace    https://github.com/bruddaa/
// @supportURL   https://github.com/bruddaa//issues
// @homepageURL  https://github.com/bruddaa/
// @license      MIT
// @match        https://www.tiktok.com/@*
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.tiktok.com/favicon.ico
// @version      2025.6.2.1
// @downloadURL  https://update.greasyfork.org/scripts/537677/TikTok%20User%20Info.user.js
// @updateURL    https://update.greasyfork.org/scripts/537677/TikTok%20User%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const countryFlags = {
    'AF': '🇦🇫', 'AL': '🇦🇱', 'DZ': '🇩🇿', 'AS': '🇦🇸', 'AD': '🇦🇩',
    'AO': '🇦🇴', 'AI': '🇦🇮', 'AQ': '🇦🇶', 'AG': '🇦🇬', 'AR': '🇦🇷',
    'AM': '🇦🇲', 'AW': '🇦🇼', 'AU': '🇦🇺', 'AT': '🇦🇹', 'AZ': '🇦🇿',
    'BS': '🇧🇸', 'BH': '🇧🇭', 'BD': '🇧🇩', 'BB': '🇧🇧', 'BY': '🇧🇾',
    'BE': '🇧🇪', 'BZ': '🇧🇿', 'BJ': '🇧🇯', 'BM': '🇧🇲', 'BT': '🇧🇹',
    'BO': '🇧🇴', 'BA': '🇧🇦', 'BW': '🇧🇼', 'BV': '🇧🇻', 'BR': '🇧🇷',
    'IO': '🇮🇴', 'BN': '🇧🇳', 'BG': '🇧🇬', 'BF': '🇧🇫', 'BI': '🇧🇮',
    'CV': '🇨🇻', 'KH': '🇰🇭', 'CM': '🇨🇲', 'CA': '🇨🇦', 'KY': '🇰🇾',
    'CF': '🇨🇫', 'TD': '🇹🇩', 'CL': '🇨🇱', 'CN': '🇨🇳', 'CX': '🇨🇽',
    'CC': '🇨🇨', 'CO': '🇨🇴', 'KM': '🇰🇲', 'CG': '🇨🇬', 'CD': '🇨🇩',
    'CK': '🇨🇰', 'CR': '🇨🇷', 'HR': '🇭🇷', 'CU': '🇨🇺', 'CW': '🇨🇼',
    'CY': '🇨🇾', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'DJ': '🇩🇯', 'DM': '🇩🇲',
    'DO': '🇩🇴', 'TL': '🇹🇱', 'EC': '🇪🇨', 'EG': '🇪🇬', 'SV': '🇸🇻',
    'GQ': '🇬🇶', 'ER': '🇪🇷', 'EE': '🇪🇪', 'SZ': '🇸🇿', 'ET': '🇪🇹',
    'FK': '🇫🇰', 'FO': '🇫🇴', 'FJ': '🇫🇯', 'FI': '🇫🇮', 'FR': '🇫🇷',
    'GF': '🇬🇫', 'PF': '🇵🇫', 'TF': '🇹🇫', 'GA': '🇬🇦', 'GM': '🇬🇲',
    'GE': '🇬🇪', 'DE': '🇩🇪', 'GH': '🇬🇭', 'GI': '🇬🇮', 'GR': '🇬🇷',
    'GL': '🇬🇱', 'GD': '🇬🇩', 'GP': '🇬🇵', 'GU': '🇬🇺', 'GT': '🇬🇹',
    'GG': '🇬🇬', 'GN': '🇬🇳', 'GW': '🇬🇼', 'GY': '🇬🇾', 'HT': '🇭🇹',
    'HM': '🇭🇲', 'HN': '🇭🇳', 'HK': '🇭🇰', 'HU': '🇭🇺', 'IS': '🇮🇸',
    'IN': '🇮🇳', 'ID': '🇮🇩', 'IR': '🇮🇷', 'IQ': '🇮🇶', 'IE': '🇮🇪',
    'IM': '🇮🇲', 'IL': '🇮🇱', 'IT': '🇮🇹', 'CI': '🇨🇮', 'JM': '🇯🇲',
    'JP': '🇯🇵', 'JE': '🇯🇪', 'JO': '🇯🇴', 'KZ': '🇰🇿', 'KE': '🇰🇪',
    'KI': '🇰🇮', 'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KG': '🇰🇬',
    'LA': '🇱🇦', 'LV': '🇱🇻', 'LB': '🇱🇧', 'LS': '🇱🇸', 'LR': '🇱🇷',
    'LY': '🇱🇾', 'LI': '🇱🇮', 'LT': '🇱🇹', 'LU': '🇱🇺', 'MO': '🇲🇴',
    'MG': '🇲🇬', 'MW': '🇲🇼', 'MY': '🇲🇾', 'MV': '🇲🇻', 'ML': '🇲🇱',
    'MT': '🇲🇹', 'MH': '🇲🇭', 'MQ': '🇲🇶', 'MR': '🇲🇷', 'MU': '🇲🇺',
    'YT': '🇾🇹', 'MX': '🇲🇽', 'FM': '🇫🇲', 'MD': '🇲🇩', 'MC': '🇲🇨',
    'MN': '🇲🇳', 'ME': '🇲🇪', 'MS': '🇲🇸', 'MA': '🇲🇦', 'MZ': '🇲🇿',
    'MM': '🇲🇲', 'NA': '🇳🇦', 'NR': '🇳🇷', 'NP': '🇳🇵', 'NL': '🇳🇱',
    'NC': '🇳🇨', 'NZ': '🇳🇿', 'NI': '🇳🇮', 'NE': '🇳🇪', 'NG': '🇳🇬',
    'NU': '🇳🇺', 'NF': '🇳🇫', 'MK': '🇲🇰', 'MP': '🇲🇵', 'OM': '🇴🇲',
    'PK': '🇵🇰', 'PW': '🇵🇼', 'PS': '🇵🇸', 'PA': '🇵🇦', 'PG': '🇵🇬',
    'PY': '🇵🇾', 'PE': '🇵🇪', 'PH': '🇵🇭', 'PN': '🇵🇳', 'PL': '🇵🇱',
    'PT': '🇵🇹', 'PR': '🇵🇷', 'QA': '🇶🇦', 'RE': '🇷🇪', 'RO': '🇷🇴',
    'RU': '🇷🇺', 'RW': '🇷🇼', 'BL': '🇧🇱', 'SH': '🇸🇭', 'KN': '🇰🇳',
    'LC': '🇱🇨', 'MF': '🇲🇫', 'PM': '🇵🇲', 'VC': '🇻🇨', 'WS': '🇼🇸',
    'SM': '🇸🇲', 'ST': '🇸🇹', 'SA': '🇸🇦', 'SN': '🇸🇳', 'RS': '🇷🇸',
    'SC': '🇸🇨', 'SL': '🇸🇱', 'SG': '🇸🇬', 'SX': '🇸🇽', 'SK': '🇸🇰',
    'SI': '🇸🇮', 'SB': '🇸🇧', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'GS': '🇬🇸',
    'SS': '🇸🇸', 'ES': '🇪🇸', 'LK': '🇱🇰', 'SD': '🇸🇩', 'SR': '🇸🇷',
    'SJ': '🇸🇯', 'SE': '🇸🇪', 'CH': '🇨🇭', 'SY': '🇸🇾', 'TJ': '🇹🇯',
    'TZ': '🇹🇿', 'TH': '🇹🇭', 'TG': '🇹🇬', 'TK': '🇹🇰', 'TO': '🇹🇴',
    'TT': '🇹🇹', 'TN': '🇹🇳', 'TR': '🇹🇷', 'TM': '🇹🇲', 'TC': '🇹🇨',
    'TV': '🇹🇻', 'UG': '🇺🇬', 'UA': '🇺🇦', 'AE': '🇦🇪', 'GB': '🇬🇧',
    'UM': '🇺🇲', 'US': '🇺🇸', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VU': '🇻🇺',
    'VE': '🇻🇪', 'VN': '🇻🇳', 'VG': '🇻🇬', 'VI': '🇻🇮', 'WF': '🇼🇫',
    'EH': '🇪🇭', 'YE': '🇾🇪', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
  };

  const languageNames = {
    'aa': 'Afar', 'ab': 'Abkhazian', 'af': 'Afrikaans', 'ak': 'Akan',
    'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'an': 'Aragonese',
    'hy': 'Armenian', 'as': 'Assamese', 'av': 'Avaric', 'ae': 'Avestan',
    'ay': 'Aymara', 'az': 'Azerbaijani',
    'ba': 'Bashkir', 'bm': 'Bambara', 'bn': 'Bengali', 'bo': 'Tibetan',
    'bs': 'Bosnian', 'br': 'Breton', 'bg': 'Bulgarian', 'my': 'Burmese',
    'be': 'Belarusian', 'eu': 'Basque',
    'ca': 'Catalan', 'ch': 'Chamorro', 'ce': 'Chechen', 'ny': 'Chichewa',
    'zh': 'Chinese', 'cu': 'Church Slavic', 'cv': 'Chuvash', 'kw': 'Cornish',
    'co': 'Corsican', 'cr': 'Cree', 'hr': 'Croatian', 'cs': 'Czech',
    'da': 'Danish', 'de': 'German', 'dv': 'Divehi', 'nl': 'Dutch', 'dz': 'Dzongkha',
    'en': 'English', 'eo': 'Esperanto', 'et': 'Estonian', 'ee': 'Ewe',
    'fo': 'Faroese', 'fj': 'Fijian', 'fi': 'Finnish', 'fr': 'French',
    'fy': 'Western Frisian', 'ff': 'Fulah',
    'gd': 'Scottish Gaelic', 'ga': 'Irish', 'gl': 'Galician', 'gv': 'Manx',
    'el': 'Greek', 'gn': 'Guarani', 'gu': 'Gujarati', 'ht': 'Haitian',
    'ha': 'Hausa', 'he': 'Hebrew', 'hz': 'Herero', 'hi': 'Hindi', 'ho': 'Hiri Motu',
    'hu': 'Hungarian', 'ia': 'Interlingua', 'id': 'Indonesian', 'ie': 'Interlingue',
    'ig': 'Igbo', 'ii': 'Sichuan Yi', 'iu': 'Inuktitut', 'ik': 'Inupiaq',
    'io': 'Ido', 'is': 'Icelandic', 'it': 'Italian',
    'ja': 'Japanese', 'jv': 'Javanese',
    'kl': 'Kalaallisut', 'kn': 'Kannada', 'kr': 'Kanuri', 'ks': 'Kashmiri',
    'kk': 'Kazakh', 'km': 'Khmer', 'ki': 'Kikuyu', 'rw': 'Kinyarwanda',
    'ky': 'Kyrgyz', 'kv': 'Komi', 'kg': 'Kongo', 'ko': 'Korean', 'kj': 'Kuanyama',
    'la': 'Latin', 'lb': 'Luxembourgish', 'lg': 'Ganda', 'li': 'Limburgish',
    'ln': 'Lingala', 'lo': 'Lao', 'lt': 'Lithuanian', 'lu': 'Luba-Katanga',
    'lv': 'Latvian', 'mk': 'Macedonian', 'mg': 'Malagasy',
    'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori',
    'mr': 'Marathi', 'mh': 'Marshallese', 'mn': 'Mongolian', 'na': 'Nauru',
    'nv': 'Navajo', 'nr': 'Southern Ndebele', 'nd': 'Northern Ndebele',
    'ng': 'Ndonga', 'ne': 'Nepali', 'nn': 'Norwegian Nynorsk', 'nb': 'Norwegian Bokmål',
    'no': 'Norwegian',
    'oc': 'Occitan', 'oj': 'Ojibwa', 'or': 'Oriya', 'om': 'Oromo',
    'pa': 'Punjabi', 'pi': 'Pali', 'fa': 'Persian', 'pl': 'Polish',
    'ps': 'Pashto', 'pt': 'Portuguese',
    'qu': 'Quechua',
    'rm': 'Romansh', 'ro': 'Romanian', 'rn': 'Rundi', 'ru': 'Russian',
    'sg': 'Sango', 'sa': 'Sanskrit', 'si': 'Sinhalese', 'sk': 'Slovak',
    'sl': 'Slovenian', 'se': 'Northern Sami', 'sm': 'Samoan', 'sn': 'Shona',
    'sd': 'Sindhi', 'so': 'Somali', 'st': 'Southern Sotho', 'es': 'Spanish',
    'sc': 'Sardinian', 'sr': 'Serbian', 'ss': 'Swati', 'su': 'Sundanese',
    'sw': 'Swahili', 'sv': 'Swedish', 'ty': 'Tahitian', 'ta': 'Tamil',
    'tt': 'Tatar', 'te': 'Telugu', 'tg': 'Tajik', 'th': 'Thai', 'ti': 'Tigrinya',
    'to': 'Tonga', 'tn': 'Tswana', 'ts': 'Tsonga', 'tk': 'Turkmen', 'tr': 'Turkish',
    'tw': 'Twi', 'ug': 'Uighur', 'uk': 'Ukrainian', 'ur': 'Urdu', 'uz': 'Uzbek',
    've': 'Venda', 'vi': 'Vietnamese', 'vo': 'Volapük',
    'wa': 'Walloon', 'cy': 'Welsh', 'wo': 'Wolof',
    'xh': 'Xhosa',
    'yi': 'Yiddish', 'yo': 'Yoruba',
    'za': 'Zhuang', 'zu': 'Zulu'
  };

  let lastUsername = GM_getValue('lastUsername', '');
  function checkProfileChange() {
    const currentUrl = window.location.href;
    if (!currentUrl.includes('tiktok.com/@')) return;

    const urlUsername = window.location.pathname.split('@')[1] || '';
    const scriptTag = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');

    if (!scriptTag) {
      console.log('Script tag not found, waiting for load');
      return;
    }

    try {
      const scriptContent = scriptTag.textContent;
      const jsonStart = scriptContent.indexOf('{');
      const jsonEnd = scriptContent.lastIndexOf('}') + 1;
      const jsonString = scriptContent.substring(jsonStart, jsonEnd);
      const fullData = JSON.parse(jsonString);

      const defaultScope = fullData.__DEFAULT_SCOPE__ || fullData;
      const userDetail = defaultScope['webapp.user-detail'];
      if (!userDetail || !userDetail.userInfo || !userDetail.userInfo.user) {
        console.log('User data not found, waiting for load');
        return;
      }

      const scriptUsername = userDetail.userInfo.user.uniqueId || '';
      if (urlUsername && scriptUsername && urlUsername !== scriptUsername && scriptUsername !== lastUsername) {
        GM_setValue('lastUsername', scriptUsername);
        console.log('Username mismatch detected, reloading page');
        window.location.reload();
      } else {
        GM_setValue('lastUsername', scriptUsername);
      }
    } catch (e) {
      console.error('Error checking profile change:', e);
    }
  }

  window.addEventListener('popstate', checkProfileChange);
  setInterval(checkProfileChange, 1000); // Interval for checking if user changed

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
    } else {
      setTimeout(() => waitForElement(selector, callback), 500);
    }
  }

  function downloadProfilePicture(url, username) {
    const filename = `tiktok_profile_${username}_${Date.now()}.jpg`;
    GM_download({
      url: url,
      name: filename,
      onload: () => console.log('Profile picture downloaded successfully'),
      onerror: (e) => console.error('Download failed:', e)
    });
  }

  function getCountryFlag(countryCode) {
    return countryFlags[countryCode] || '';
  }

  function getLanguageName(languageCode) {
    if (!languageCode) return 'N/A';
    const fullName = languageNames[languageCode.toLowerCase()];
    return fullName ? `${languageCode} (${fullName})` : languageCode;
  }

  function extractAndDisplayData() {
    const scriptTag = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
    if (!scriptTag) {
      console.log('Script tag not found');
      return;
    }

    try {
      const scriptContent = scriptTag.textContent;
      const jsonStart = scriptContent.indexOf('{');
      const jsonEnd = scriptContent.lastIndexOf('}') + 1;
      const jsonString = scriptContent.substring(jsonStart, jsonEnd);
      const fullData = JSON.parse(jsonString);
      const defaultScope = fullData.__DEFAULT_SCOPE__ || fullData;
      const userDetail = defaultScope['webapp.user-detail'];
      if (!userDetail) {
        console.log('webapp.user-detail not found');
        return;
      }

      const userInfo = userDetail.userInfo;
      if (!userInfo) {
        console.log('userInfo not found');
        return;
      }

      const user = userInfo.user;
      const stats = userInfo.stats || userInfo.statsV2;
      const avatarUrl = user?.avatarLarger;

      if (!user) {
        console.log('User data not found');
        return;
      }

      const regionWithFlag = user.region ? `${user.region} ${getCountryFlag(user.region)}` : 'N/A';
      const languageWithName = getLanguageName(user.language);

      const extractedData = {
        id: user.id || 'N/A',
        region: regionWithFlag,
        language: languageWithName,
        createTime: user.createTime ? new Date(user.createTime * 1000).toLocaleString() : 'N/A',
        friendCount: stats?.friendCount || 'N/A',
        ttSeller: typeof user.ttSeller !== 'undefined' ? (user.ttSeller ? 'Yes' : 'No') : 'N/A',
        isOrganization: typeof user.isOrganization !== 'undefined' ? (user.isOrganization ? 'Yes' : 'No') : 'N/A',
        uniqueIdModifyTime: user.uniqueIdModifyTime ? new Date(user.uniqueIdModifyTime * 1000).toLocaleString() : 'N/A',
        nickNameModifyTime: user.nickNameModifyTime ? new Date(user.nickNameModifyTime * 1000).toLocaleString() : 'N/A',
        avatarUrl: avatarUrl || null
      };

      const infoHtml = /*html*/`
        <div class="tampermonkey-user-info" 
             style="margin-top: 6px;
                    padding: 14px 0 14px 0;
                    font-family: 'TikTokFont', Arial, sans-serif;
                    font-size: 14px;
                    color: #f8f8f8;
                    border-top: 1px solid #454545;
                    border-bottom: 1px solid #454545;
        ">
          <div style="display: flex; 
                      justify-content: space-between; 
                      align-items: center; 
                      margin-bottom: 10px;
          ">
            <h3 style="margin: 0; 
                       font-size: 16px; 
                       font-weight: 700;
            ">
              Additional User Information
            </h3>
            ${extractedData.avatarUrl ? /*html */`
            <button id="downloadProfilePicBtn" 
                    style="background: #FE2C55; 
                           color: white; 
                           border: none;
                           border-radius: 4px; 
                           padding: 6px 12px; 
                           font-size: 13px; 
                           cursor: pointer; 
                           font-weight: 500;
            ">
              Download Profile Pic
            </button>
            ` : ''}
          </div>
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <ul style="list-style-type: none; 
                         padding-left: 0; 
                         margin: 0;
              ">
                <li><strong>User ID:</strong> ${extractedData.id}</li>
                <li><strong>Region:</strong> ${extractedData.region}</li>
                <li><strong>Language:</strong> ${extractedData.language}</li>
                <li><strong>Account Created:</strong> ${extractedData.createTime}</li>
                <li><strong>Friend Count:</strong> ${extractedData.friendCount}</li>
              </ul>
            </div>
            <div style="flex: 1;">
              <ul style="list-style-type: none; 
                         padding-left: 0; 
                         margin: 0;
              ">
                <li><strong>Is Seller:</strong> ${extractedData.ttSeller}</li>
                <li><strong>Is Organization:</strong> ${extractedData.isOrganization}</li>
                <li><strong>Username Modified:</strong> ${extractedData.uniqueIdModifyTime}</li>
                <li><strong>Nickname Modified:</strong> ${extractedData.nickNameModifyTime}</li>
              </ul>
            </div>
          </div>
        </div>
      `;

      const targetContainer = document.querySelector('div.css-n42mkb-5e6d46e3--DivShareTitleContainer-5e6d46e3--CreatorPageHeaderShareContainer');

      if (targetContainer) {
        if (!targetContainer.querySelector('.tampermonkey-user-info')) {
          targetContainer.insertAdjacentHTML('beforeend', infoHtml);

          if (extractedData.avatarUrl) {
            const username = window.location.pathname.split('@')[1] || 'user';
            document.getElementById('downloadProfilePicBtn').addEventListener('click', () => {
              downloadProfilePicture(extractedData.avatarUrl, username);
            });
          }
        }
      } else {
        console.log('Target container not found');
      }
    } catch (e) {
      console.error('Error extracting TikTok user info:', e);
    }
  }
  waitForElement('div.css-n42mkb-5e6d46e3--DivShareTitleContainer-5e6d46e3--CreatorPageHeaderShareContainer', extractAndDisplayData);
})();
