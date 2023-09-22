// ==UserScript==
// @name        Feedly: Filter Sorting
// @namespace   https://github.com/soufianesakhi/feedly-filtering-and-sorting
// @description Enhance the feedly website with advanced filtering, sorting and more
// @author      Soufiane Sakhi
// @copyright   2016-2020, Soufiane Sakhi
// @license     MIT; https://opensource.org/licenses/MIT
// @homepageURL https://github.com/soufianesakhi/feedly-filtering-and-sorting
// @supportURL  https://github.com/soufianesakhi/feedly-filtering-and-sorting/issues
// @icon        https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @resource    jquery.min.js https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://greasyfork.org/scripts/19857-node-creation-observer/code/node-creation-observer.js?version=174436
// @resource    node-creation-observer.js https://greasyfork.org/scripts/19857-node-creation-observer/code/node-creation-observer.js?version=174436
// @require     https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js
// @match      *://feedly.com/*
// @version     3.22.17
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_getResourceText
// ==/UserScript==

var ext = {
	plusIconLink: "",
	eraseIconLink: "",
	closeIconLink: "",
	moveUpIconLink: "",
	moveDownIconLink: "",
	supportedURLsPattern: "^https?://[^/]+/i/(?:subscription|collection/content/user)/.*$",
	defaultUrlPrefixPattern: "https?://[^/]+/i/",
	subscriptionUrlPrefixPattern: "https?://[^/]+/i/feed/content",
	categoryUrlPrefixPattern: "https?://[^/]+/i/collection/content/user/[^/]+/",
	settingsBtnPredecessorSelector: ".header .MarkAsReadButton",
	articlesContainerSelector: ".list-entries",
	articlesChunkClass: "EntryList__chunk",
	articlesChunkSelector: ".EntryList__chunk",
	articleSelector: ".EntryList__chunk :where(article.entry, .InlineArticle--u100):not([gap-article])",
	articleAndGapSelector: ".EntryList__chunk :where(article.entry, .InlineArticle--u100)",
	articleIdSelector: ".EntryList__chunk article[id]",
	articleIdFromFrameSelector: "article[id]",
	sortedArticlesSelector: ".EntryList__chunk article[id]:not([gap-article])",
	articleAndInlineSelector: ".EntryList__chunk :where(article.entry, .InlineArticle):not([gap-article])",
	inlineArticleFrameSelector: ".InlineArticle",
	readArticleSelector: "article[id].entry--read",
	unreadArticleSelector: "article[id].entry--unread",
	unreadArticlesCountSelector: ".entry--unread:not([gap-article]), .Article__title:not(.Article__title--read)",
	uncheckedArticlesSelector: ":not([gap-article]):not([checked-FFnS])",
	checkedArticlesAttribute: "checked-FFnS",
	markAsReadImmediatelySelector: ".list-entries .FFnS-mark-as-read",
	unreadArticleClass: "entry--unread",
	readArticleClass: "entry--read",
	articleTitleSelector: ".EntryTitle,.Article__title",
	articleViewUrlAnchorSelector: ".Article__title",
	articleVisualSelector: ".EntryVisual",
	inlineViewClass: "InlineArticle",
	articleViewReadTitleClass: "Article__title--read",
	articleViewReadSelector: ".Article__title--read",
	articleViewEntryContainerSelector: ".u100",
	loadingMessageSelector: ".list-entries .EntryList__loading",
	sectionSelector: "#timeline > .section",
	publishAgeSpanSelector: ".ago, .metadata [title^=published]",
	publishAgeTimestampAttr: "title",
	articleSourceSelector: ".EntryMetadataSource",
	subscriptionChangeSelector: "#header-title",
	popularitySelector: ".EntryEngagement, .engagement, .nbrRecommendations",
	hidingInfoSibling: "header .right-col, header > h1 .button-dropdown",
	keepArticlesUnreadId: "keepArticlesUnread",
	articlesToMarkAsReadId: "articlesToMarkAsRead",
	openAndMarkAsReadId: "isOpenAndMarkAsRead",
	openAndMarkAsReadClass: "open-in-new-tab-button",
	visualOpenAndMarkAsReadId: "isVisualOpenAndMarkAsRead",
	titleOpenAndMarkAsReadId: "isTitleOpenAndMarkAsRead",
	markAsReadAboveBelowId: "isMarkAsReadAboveBelowId",
	markAsReadAboveBelowClass: "mark-as-read-above-below-button",
	entryInfosJsonClass: "entryInfosJson",
	hideWhenMarkAboveBelowId: "isHideWhenMarkAboveBelow",
	hideAfterReadId: "isHideAfterRead",
	autoLoadAllArticlesId: "autoLoadAllArticles",
	batchSizeId: "batchSize",
	loadByBatchEnabledId: "loadByBatchEnabled",
	isNewestFirstId: "isNewestFirst",
	markAsReadAboveBelowReadId: "MarkAsReadAboveBelowRead",
	markAsReadImmediatelyClass: "FFnS-mark-as-read",
	buttonsContainerId: "FFnS-buttons-container",
	containerButtonClass: "FFnS-UI-button",
	openCurrentFeedArticlesId: "isOpenCurrentFeedArticles",
	openCurrentFeedArticlesClass: "open-current-articles-in-new-tab-button",
	disableAllFiltersButtonId: "isDisableAllFiltersButton",
	disableAllFiltersEnabled: "isDisableAllFiltersEnabled",
	disableAllFiltersButtonClass: "disable-all-filters-button",
	openCurrentFeedArticlesUnreadOnlyId: "openCurrentFeedArticlesUnreadOnly",
	markAsReadOnOpenCurrentFeedArticlesId: "isMarkAsReadOnOpenCurrentFeedArticles",
	maxOpenCurrentFeedArticlesId: "maxOpenCurrentFeedArticles",
	forceRefreshArticlesId: "forceRefreshArticles",
	disablePageOverridesId: "disablePageOverrides",
	articleSorterConfigId: "articleSorterConfig",
	navigatingToNextId: "navigatingToNext",
	navigatingEntry: "navigatingEntry",
	layoutChangeSelector: "input[id^='layout-']",
	loadingElementSelector: ".FFnS-loading",
	buttonContainerClass: "FFnS-buttonContainer",
}

var templates = {
	settingsHTML: "<div id='FFnS_settingsDivContainer'> <div id='FFnS_settingsDiv'> <img id='FFnS_CloseSettingsBtn' src='{{closeIconLink}}' /> <fieldset> <legend>General settings</legend> <div class='setting_group'> <span>Auto load all unread articles</span> <input id='FFnS_autoLoadAllArticles' type='checkbox' /> </div> <div class='setting_group' style='display: none;'> <span>Load articles by batch</span> <input id='FFnS_loadByBatchEnabled' type='checkbox' /> <span>Batch size</span> <input id='FFnS_batchSize' class='FFnS_input MediumNumberInput' type='number' min='50' max='1000' step='50' /> </div> <div class='setting_group'> <span class='tooltip' >Always use global settings <span class='tooltiptext' >Use the same filtering and sorting settings for all subscriptions and categories. Uncheck to have specific settings for each subscription/category</span > </span> <input id='FFnS_globalSettingsEnabled' type='checkbox' /> </div> <div class='setting_group'> <span class='tooltip' >Sync settings <span class='tooltiptext' >The settings will be synced by the browser, and be available across all instances of that browser that the user is logged into (e.g. via Chrome sync, or Firefox sync), across different devices.</span > </span> <input id='FFnS_syncSettingsEnabled' type='checkbox' /> </div> </fieldset> <fieldset> <legend><span id='FFnS_settings_mode_title'></span></legend> <div class='setting_group'> <span class='tooltip' >Filtering enabled <span class='tooltiptext' >Hide the articles that contain at least one of the filtering keywords (not applied if empty)</span > </span> <input id='FFnS_FilteringEnabled' type='checkbox' /> </div> <div class='setting_group'> <span class='tooltip'> Restricting enabled <span class='tooltiptext' >Show only articles that contain at least one of the restricting keywords (not applied if empty)</span > </span> <input id='FFnS_RestrictingEnabled' type='checkbox' /> </div> <div class='setting_group'> <span>Sorting enabled</span> <input id='FFnS_SortingEnabled' type='checkbox' /> </div> {{ SortingSelect }} <ul id='FFnS_tabs_menu'> <li class='current'> <a href='#FFnS_Tab_FilteredOut'>Filtering keywords</a> </li> <li><a href='#FFnS_Tab_RestrictedOn'>Restricting keywords</a></li> <li><a href='#FFnS_Tab_KeywordControls'>Keyword controls</a></li> <li><a href='#FFnS_Tab_UIControls'>UI controls</a></li> <li><a href='#FFnS_Tab_AdvancedControls'>Advanced controls</a></li> <li><a href='#FFnS_Tab_SettingsControls'>Settings controls</a></li> </ul> <div id='FFnS_tabs_content'> {{ FilteringList.Type.FilteredOut }} {{ FilteringList.Type.RestrictedOn }} <div id='FFnS_Tab_KeywordControls' class='FFnS_Tab_Menu'> <p> The following settings are applied to the filtering and restricting </p> <fieldset> <legend>Matching area (domain)</legend> <div> <span>Search for keywords in the entry's: </span> {{ DefaultKeywordMatchingArea }} <span> (Multiple values can be selected)</span> </div> <div> <span>Always use these matching areas</span> <input id='FFnS_AlwaysUseDefaultMatchingAreas' type='checkbox' /> <span> (the area select boxes in the filtering and restricting will be invisible when this option is checked)</span > </div> </fieldset> <fieldset> <legend>Matching method</legend> <span>The keywords are treated as : </span> {{ KeywordMatchingMethod }} </fieldset> </div> <div id='FFnS_Tab_UIControls' class='FFnS_Tab_Menu'> <fieldset> <legend>Custom buttons</legend> <div> <span >Add a button to open articles in a new window/tab and mark them as read</span > <input id='FFnS_OpenAndMarkAsRead' type='checkbox' /> </div> <div> <span >Open articles in a new window/tab and mark them as read when clicking the visual image (Cards &amp; Magazine view)</span > <input id='FFnS_VisualOpenAndMarkAsRead' type='checkbox' /> </div> <div> <span >Open articles in a new window/tab and mark them as read when clicking the title (Title view)</span > <input id='FFnS_TitleOpenAndMarkAsRead' type='checkbox' /> </div> <div> <span>Add buttons to mark articles above/below as</span> <select id='FFnS_MarkAsReadAboveBelowRead' class='FFnS_input'> <option value='true' selected>read</option> <option value='false'>unread</option> </select> <input id='FFnS_MarkAsReadAboveBelow' type='checkbox' /> <span> (Also hide using the same buttons when marking as read</span > <input id='FFnS_HideWhenMarkAboveBelow' type='checkbox' /> <span>)</span> </div> <div> <span >Add button to open all current feed articles in a new tab</span > <input id='FFnS_OpenCurrentFeedArticles' type='checkbox' /> <span> unread only</span> <input id='FFnS_OpenCurrentFeedArticlesUnreadOnly' type='checkbox' /> <span class='tooltip'> maximum articles to open <span class='tooltiptext' >If set to 0, all the articles will be opened</span > </span> <input id='FFnS_MaxOpenCurrentFeedArticles' class='FFnS_input MediumNumberInput' type='number' min='0' step='1' /> <span> mark as read</span> <input id='FFnS_MarkAsReadOnOpenCurrentFeedArticles' type='checkbox' /> </div> <div> <span >Add button to quickly disable all filters</span > <input id='FFnS_DisplayDisableAllFiltersButton' type='checkbox' /> </div> </fieldset> <fieldset> <legend> <span class='tooltip' >Coloring rules to highlight titles <span class='tooltiptext' >For each article, only the first matching coloring rule is applied by following their order. You can move up/down the coloring rules to change this order.</span > </span> </legend> <span id='FFnS_AddColoringRule'> <img src='{{plusIconLink}}' class='FFnS_icon' title='Add a new coloring rule' /> </span> <span id='FFnS_EraseColoringRules'> <img src='{{eraseIconLink}}' class='FFnS_icon' title='Remove all the coloring rules' /> </span> <span id='FFnS_ColoringRules'></span> </fieldset> </div> <div id='FFnS_Tab_AdvancedControls' class='FFnS_Tab_Menu'> <fieldset> <legend>Recently received articles</legend> <div id='FFnS_MaxPeriod_Infos'> <span>Articles received (crawled) less than</span> <input id='FFnS_Hours_AdvancedControlsReceivedPeriod' class='FFnS_input' type='number' min='0' max='23' /> <span>hours and</span> <input id='FFnS_Days_AdvancedControlsReceivedPeriod' class='FFnS_input' type='number' min='0' /> <span>days</span> <span>ago should be:</span> </div> <div class='setting_group'> <span class='tooltip' >Kept unread if unread <span class='tooltiptext' >Only the articles that were not marked as read (manually or on scroll) will be kept unread. Please note that by enabling this option, only the loaded articles will be marked as read.</span > </span> <input id='FFnS_KeepUnread_AdvancedControlsReceivedPeriod' type='checkbox' /> </div> <div class='setting_group'> <span>Hidden</span> <input id='FFnS_Hide_AdvancedControlsReceivedPeriod' type='checkbox' /> </div> <div class='setting_group'> <span>Visible if hot or popularity superior to:</span> <input id='FFnS_MinPopularity_AdvancedControlsReceivedPeriod' class='FFnS_input MediumNumberInput' type='number' min='0' step='100' /> <input id='FFnS_ShowIfHot_AdvancedControlsReceivedPeriod' type='checkbox' /> <span class='tooltip' >Marked as read if hot or popular <span class='tooltiptext' >Mark as read the articles made visible if hot or with popularity superior to the defined value</span > </span> <input id='FFnS_MarkAsReadVisible_AdvancedControlsReceivedPeriod' type='checkbox' /> </div> </fieldset> <fieldset> <legend>Reading time</legend> <div class='setting_group'> <span>Enable filtering of articles with reading time </span> <select id='FFnS_FilterLong_FilteringByReadingTime' class='FFnS_input' > <option value='true' selected>superior</option> <option value='false'>inferior</option> </select> <span>to </span> <input id='FFnS_ThresholdMinutes_FilteringByReadingTime' class='FFnS_input MediumNumberInput' type='number' min='1' /> <span>minutes: </span> <input id='FFnS_Enabled_FilteringByReadingTime' type='checkbox' /> </div> <div class='setting_group'> <span class='tooltip' >Keep unread <span class='tooltiptext' >When this option is enabled, the filtered articles will be kept unread</span > </span> <input id='FFnS_KeepUnread_FilteringByReadingTime' type='checkbox' /> <span class='tooltip' >Reading speed : <span class='tooltiptext' >The average words read per minute</span > </span> <input id='FFnS_WordsPerMinute_FilteringByReadingTime' class='FFnS_input MediumNumberInput' type='number' min='1' /> </div> </fieldset> <fieldset> <legend> Additional sorting levels (applied when two entries have equal sorting) </legend> <span id='FFnS_AdditionalSortingTypes'></span> <span id='FFnS_AddSortingType'> <img src='{{plusIconLink}}' class='FFnS_icon' /> </span> <span id='FFnS_EraseSortingTypes'> <img src='{{eraseIconLink}}' class='FFnS_icon' /> </span> </fieldset> <fieldset> <legend>Duplicates filtering</legend> <div class='setting_group'> <span class='tooltip' >Hide duplicates <span class='tooltiptext tooltip-top' >The duplicate articles will be hidden based on the url and the title. For each duplicate article group, only the most recently published one will be kept.</span > </span> <input id='FFnS_HideDuplicates' type='checkbox' /> </div> <div class='setting_group'> <span class='tooltip' >Highlight<span class='tooltiptext tooltip-top'> Apply a color to the newer duplicate articles</span ></span > <input id='FFnS_HighlightDuplicates' type='checkbox' /> <input id='FFnS_HighlightDuplicatesColor' class='FFnS_input jscolor' size='10' type='text' /> </div> <div class='setting_group'> <span class='tooltip' >Enable cross checking with persistence up to: <span class='tooltiptext tooltip-top' >The duplicates will be checked across all subscriptions and categories against current articles and stored articles. The url and title of all articles published less then the configured days will be stored locally (sync not supported).</span > </span> <input id='FFnS_CrossCheckDuplicatesDays' class='FFnS_input MediumNumberInput' type='number' min='0' /> <span> days </span> <input id='FFnS_CrossCheckDuplicates' type='checkbox' /> </div> </fieldset> <fieldset> <legend>Misc</legend> <div class='setting_group'> <span>Group hot articles & pin to top</span> <input id='FFnS_PinHotToTop' type='checkbox' /> </div> <div class='setting_group'> <span>Hide articles after reading them</span> <input id='FFnS_HideAfterRead' type='checkbox' /> <span class='tooltip' >Replace with gap <span class='tooltiptext tooltip-top' >Replace the hidden article with a gap with same dimensions.</span > </span> <input id='FFnS_ReplaceHiddenWithGap' type='checkbox' /> </div> <div class='setting_group'> <span>Mark as read filtered articles</span> <input id='FFnS_MarkAsReadFiltered' type='checkbox' /> </div> <div class='setting_group'> <span>Disable page overrides</span> <input id='FFnS_DisablePageOverrides' type='checkbox' /> </div> <div class='setting_group'> <span class='tooltip' >Auto refresh <span class='tooltiptext tooltip-top' >The articles will be reloaded periodically following the configured minutes</span > </span> <input id='FFnS_AutoRefreshEnabled' type='checkbox' /> <input id='FFnS_AutoRefreshMinutes' class='FFnS_input MediumNumberInput' type='number' min='1' /> <span>(minutes)</span> </div> </fieldset> </div> <div id='FFnS_Tab_SettingsControls' class='FFnS_Tab_Menu'> <fieldset> <legend>Import/export all settings from/to file</legend> <div class='setting_group'> <span>Import settings </span> <input id='FFnS_ImportSettings' type='file' /> </div> <button id='FFnS_ExportSettings'>Export settings</button> </fieldset> <fieldset> <legend>Subscription management</legend> <select id='FFnS_SettingsControls_SelectedSubscription' class='FFnS_input' > {{ ImportMenu.SubscriptionOptions }} </select> <button id='FFnS_SettingsControls_ImportFromOtherSub'> Import settings from selected subscription </button> <button id='FFnS_SettingsControls_DeleteSub'> Delete selected subscription </button> <div id='FFnS_SettingsControls_LinkedSubContainer'> <span id='FFnS_SettingsControls_LinkedSub'></span> <button id='FFnS_SettingsControls_UnlinkFromSub'>Unlink</button> </div> <button id='FFnS_SettingsControls_LinkToSub'> Link current subscription to selected subscription </button> </fieldset> </div> </div> </fieldset> </div> </div> ",
	filteringListHTML: "<div id='{{FilteringTypeTabId}}' class='FFnS_Tab_Menu'> {{ FilteringKeywordMatchingArea }} <input id='{{inputId}}' class='FFnS_input' size='10' type='text' /> <span id='{{plusBtnId}}'> <img src='{{plusIconLink}}' class='FFnS_icon' /> </span> <span id='{{filetringKeywordsId}}'></span> <span id='{{eraseBtnId}}'> <img src='{{eraseIconLink}}' class='FFnS_icon' /> </span> </div> ",
	keywordHTML: '<button id="{{keywordId}}" type="button" class="FFnS_keyword">{{keyword}}</button>',
	sortingSelectHTML: "<select id='{{Id}}' class='FFnS_input FFnS_select'> <option value='{{PopularityDesc}}' >Sort by popularity (highest to lowest)</option > <option value='{{PopularityAsc}}' >Sort by popularity (lowest to highest)</option > <option value='{{TitleAsc}}'>Sort by title (a -&gt; z)</option> <option value='{{TitleDesc}}'>Sort by title (z -&gt; a)</option> <option value='{{ReceivedDateNewFirst}}' >Sort by received date (new first)</option > <option value='{{ReceivedDateOldFirst}}' >Sort by received date (old first)</option > <option value='{{PublishDateNewFirst}}' >Sort by publish date (new first)</option > <option value='{{PublishDateOldFirst}}' >Sort by publish date (old first)</option > <option value='{{PublishDayNewFirst}}' >Sort by publish day (new first)</option > <option value='{{PublishDayOldFirst}}' >Sort by publish day (old first)</option > <option value='{{SourceAsc}}'>Sort by source title (a -&gt; z)</option> <option value='{{SourceDesc}}'>Sort by source title (z -&gt; a)</option> <option value='{{SourceNewestReceiveDate}}' >Sort by source title (newest received first)</option > <option value='{{Random}}'>Random sort</option> </select> ",
	keywordMatchingSelectHTML: "<select id='{{Id}}' class='FFnS_input FFnS_keywordMatchingSelect' {{attributes}} > {{ defaultOption }} <option value='{{KeywordMatchingArea.Title}}' {{selectFirst}}>Title</option> <option value='{{KeywordMatchingArea.Body}}'>Body (summary)</option> <option value='{{KeywordMatchingArea.Author}}'>Author</option> </select> ",
	keywordMatchingMethodHTML: "<select id='{{id}}' class='FFnS_input FFnS_KeywordMatchingMethod' {{size}}> <option value='{{KeywordMatchingMethod.Simple}}' selected >Strings (simple match)</option > <option value='{{KeywordMatchingMethod.Word}}' >Words (whole word match)</option > <option value='{{KeywordMatchingMethod.RegExp}}' >Regular expressions (pattern match)</option > </select> ",
	coloringRuleHTML: "<div id='{{Id}}' class='FFnS_ColoringRule'> <img class='FFnS_RemoveColoringRule FFnS_ColoringRuleManagement' title='Remove the coloring rule' src='{{eraseIconLink}}' /> <img class='FFnS_MoveUpColoringRule FFnS_ColoringRuleManagement' title='Move up the order of the coloring rule' src='{{moveUpIconLink}}' /> <img class='FFnS_MoveDownColoringRule FFnS_ColoringRuleManagement' title='Move down the order of the coloring rule' src='{{moveDownIconLink}}' /> <span>Keyword source: </span> <select class='FFnS_ColoringRule_Source FFnS_input FFnS_select'> <option value='{{SpecificKeywords}}'>Specific keywords</option> <option value='{{RestrictingKeywords}}'>Restricting keywords</option> <option value='{{FilteringKeywords}}'>Filtering keywords</option> <option value='{{SourceTitle}}'>Source title (subscription)</option> </select> <span class='FFnS_ColoringRule_Options'> <span style='display: none'>Highlight all the title</span> <input class='FFnS_HighlightAllTitle' type='checkbox' style='display: none' /> <span class='FFnS_SpecificColorGroup' >Color <input class='FFnS_SpecificColor FFnS_input jscolor' value='{{Color}}' size='10' type='text' /> </span> </span> <span class='FFnS_ColoringRule_SourceTitleInfos' >All the titles from the same source (subscription) will have the same generated color (only applied when viewing categories)</span > <div class='FFnS_ColoringRule_MatchingMethodGroup'> Keyword matching method: {{ KeywordMatchingMethod }} </div> <div class='FFnS_ColoringRule_MatchingAreaGroup'> Keyword matching area: {{ KeywordMatchingArea }} </div> <div class='FFnS_ColoringRule_KeywordsGroup'> <span>Specific keywords: </span> <input class='FFnS_input FFnS_ColoringRule_KeywordInput' size='10' type='text' /> <span class='FFnS_ColoringRule_AddKeyword'> <img src='{{plusIconLink}}' class='FFnS_icon' /> </span> <span class='FFnS_ColoringRuleKeywords'></span> <span class='FFnS_ColoringRule_EraseKeywords'> <img src='{{eraseIconLink}}' class='FFnS_icon' /> </span> </div> </div> ",
	optionHTML: "<option value='{{value}}'>{{value}}</option>",
	emptyOptionHTML: "<option value=''>{{value}}</option>",
	styleCSS: "#FFnS_settingsDivContainer { display: none; color: #333333; scrollbar-color: auto; background: rgba(0, 0, 0, 0.9); width: 100%; height: 100%; z-index: 999; top: 0; left: 0; position: fixed; } #FFnS_settingsDiv { max-height: 87%; margin-top: 1%; margin-left: 5%; margin-right: 1%; border-radius: 25px; border: 2px solid #336699; background: #e0f5ff; padding: 2%; opacity: 1; overflow-y: auto; overflow-x: hidden; } .FFnS_input { font-size: 12px; } #FFnS_tabs_menu { display: block; clear: both; margin-top: 1%; margin-bottom: 0%; padding: 0px; text-align: center; } #FFnS_tabs_menu li { height: 30px; line-height: 30px; display: inline-block; border: 1px solid #d4d4d1; } #FFnS_tabs_menu li.current { background-color: #b9e0ed; } #FFnS_tabs_menu li a { padding: 3px; color: #2a687d; } #FFnS_tabs_content { padding: 1%; } .FFnS_Tab_Menu { display: none; width: 100%; overflow-y: auto; overflow-x: hidden; } .FFnS_icon { vertical-align: middle; height: 20px; width: 20px; cursor: pointer; } .FFnS_keyword { vertical-align: middle; background-color: #35a5e2; border-radius: 20px; color: #fff; cursor: pointer; } .tooltip { position: relative; display: inline-block; border-bottom: 1px dotted black; } .tooltip .tooltiptext { visibility: hidden; width: 120px; background-color: black; color: #fff; text-align: center; padding: 5px; border-radius: 6px; position: absolute; z-index: 1; white-space: normal; } .tooltip-top { bottom: 100%; left: 50%; } .tooltip:hover .tooltiptext { visibility: visible; } #FFnS_CloseSettingsBtn, .FFnS_ColoringRuleManagement { float: right; cursor: pointer; width: 24px; height: 24px; padding: 4px; } #FFnS_Tab_SettingsControls button, #FFnS_Tab_SettingsControls input { margin-top: 1%; font-size: 12px; vertical-align: inherit; } #FFnS_Tab_SettingsControls #FFnS_SettingsControls_UnlinkFromSub { display: inline; } #FFnS_MaxPeriod_Infos > input[type='number'] { width: 30px; margin-left: 1%; margin-right: 1%; } .MediumNumberInput { width: 45px; } #FFnS_MaxPeriod_Infos { margin: 1% 0 2% 0; } .setting_group { display: inline-block; white-space: nowrap; margin-right: 2%; } fieldset { border-color: #333690; border-style: bold; } legend { color: #333690; font-weight: bold; } fieldset + fieldset, #FFnS_Tab_SettingsControls fieldset { margin-top: 1%; } fieldset select { margin-left: 1%; } fieldset select.FFnS_keywordMatchingSelect { margin-left: 0%; margin-right: 1%; vertical-align: middle; } input { vertical-align: middle; } .ShowSettingsBtn { display: inline-block; vertical-align: bottom; background-image: url('{{extension-icon}}'); background-size: 20px 20px; background-position: center center; background-repeat: no-repeat; background-color: transparent; filter: grayscale(1); font-weight: normal; min-width: 0; height: 40px; width: 40px; margin-right: 0px; } .ShowSettingsBtn:hover { color: #636363; background-color: rgba(0, 0, 0, 0.05); } .fx header h1 .detail.FFnS_Hiding_Info::before { content: ''; } .FFnS_Hiding_Info { text-align: center; } .fx .open-in-new-tab-button.mark-as-read, .fx .mark-as-read-above-below-button.mark-as-read { background-repeat: no-repeat; margin-right: 0px; } .fx .mark-as-read { opacity: 0.5; display: inline-block; } .fx .mark-as-read:hover { opacity: 1; } .fx .u100Entry .mark-as-read-above-below-button.mark-as-read:hover, .fx .u100Entry .open-in-new-tab-button.mark-as-read:hover { background-color: #efefef; } .theme--dark .open-in-new-tab-button, .theme--dark .mark-as-read-above-below-button { filter: contrast(0%); } .fx .open-in-new-tab-button.mark-as-read { background-image: url('{{open-in-new-tab-url}}'); background-size: 20px 20px; } .fx .entry.u5 .open-in-new-tab-button.mark-as-read { background-size: 24px 24px; padding: 2px; } #FFnS-buttons-container { float: right; } .fx .FFnS-UI-button { background-repeat: no-repeat; display: inline; margin-left: auto; min-width: 10px; padding: 10px; } .FFnS-UI-button { opacity: 0.8; } .FFnS-UI-button:hover { opacity: 1; } .theme--dark .FFnS-UI-button { filter: contrast(0%); } .fx .open-current-articles-in-new-tab-button { background-image: url('{{open-in-new-tab-url}}'); background-size: 18px 18px; } .fx .disable-all-filters-button { background-image: url('{{disable-all-filters-url}}'); background-size: 20px 20px; opacity: 0.4; } .fx .disable-all-filters-button.enabled { opacity: 1; } .fx .mark-as-read-above-below-button.mark-as-read, .fx .open-in-new-tab-button.mark-as-read, .fx .entry.u0 .mark-as-read-above-below-button.condensed-toolbar-icon, .fx .entry.u5 .mark-as-read-above-below-button { background-size: 20px 20px; width: 24px; height: 24px; background-origin: content-box; } .fx .entry.u5 .mark-as-read-above-below-button { padding: 4px; } .fx .u100Entry .mark-as-read-above-below-button.mark-as-read, .fx .u100Entry .open-in-new-tab-button.mark-as-read { margin-left: 0.5rem; padding: 24px; background-position: center; width: 24px; height: 24px; opacity: 0.54; } .fx .mark-above-as-read.mark-as-read { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAEBAQICAgMDAwQEBAUFBQYGBggICA8PDxERERMTExUVFRgYGBkZGRoaGhwcHB4eHh8fHyAgICYmJicnJygoKCoqKiwsLC4uLi8vLzAwMDExMTIyMjMzMzk5OTo6Oj09PT4+PkREREhISEtLS01NTU5OTlFRUVNTU1RUVFhYWF1dXV5eXl9fX2BgYGhoaGlpaWxsbHJycnh4eHp6enx8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhUO7wAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjb8jGPfAAAA1klEQVQoU3WQiVICQQwFGxBUPLgVROQQEBDFA/7/02KSyS6sVXQVyZvXNezWImfIxCx28JCJOvUUnNVlduOOKreejHFJh4s2fRnQsqg8cdBpYklHZ5eF1dJnZctvTG3EHDL0HQ/PeeEmhX/ilYtIRfFOfi6IA8wjFgU0Irn42UWuUomk8AnxIlew9+DwpsL/rwkjrxJIWcWvyAj00x1BNioeZRH3cvRU0W6tv+eoEio+tFTK0QR2v+biKxUZJr6tv0/nHH/itQo/nZAK2Po+IYlJz9cRkT+a78AFAEXS0AAAAABJRU5ErkJggg==); } .fx .mark-below-as-read.mark-as-read { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICA8PDxERERUVFRoaGhwcHB4eHigoKCoqKiwsLC4uLjAwMDExMTIyMjMzMzk5OTo6Oj09PUhISElJSUtLS01NTVFRUVNTU1RUVFhYWF1dXV5eXl9fX2BgYGhoaGlpaWxsbG5ubnJycnR0dHV1dXh4eHp6ent7e3x8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACY/twoAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjb8jGPfAAAAxElEQVQoU3WQhxKCMBBEF7D3gg27Inbl/3/uvLtkQNrOJLvZNxcKqEIVYFQO9q3yiaXDWwmYIua9CCbYixWAD189DxbompADAWo2ZcEJyTkDYmBjYxYAfZsUPCKb6/BsYuEC2BdpAx8NKuwY6H0DYK6VEchl8CaaA/zrUoGODMa0tXOJ+ORxd+A1I3qap7iBgpBLliuVI2M1vBRQQ8FVAH9K1EQogddN+p729OV4kCCAOnwSF92xVjcFcFb/kwGroVoqoh+q2r44+TStvAAAAABJRU5ErkJggg==); } .fx .mark-as-read { min-width: unset; min-height: unset; } .fx .entry.u4 .mark-as-read:first-of-type { margin-left: 0.7rem; } .fx .entry.u5 .open-in-new-tab-button, .fx .entry.u5 .mark-as-read-above-below-button { filter: brightness(0) invert(1); } .ShowSettingsBtn:hover { color: #636363; background-color: rgba(0, 0, 0, 0.05); } .theme--dark .ShowSettingsBtn:hover { background-color: rgba(255, 255, 255, 0.15); } #FFnS_Tab_KeywordControls span { vertical-align: top; } #FFnS_Tab_KeywordControls div { margin-top: 2%; } .FFnS_select { vertical-align: middle; } #FFnS_AddSortingType { margin-left: 1%; } .entry[gap-article] { visibility: hidden; } #FFnS_ImportSettings { width: 400px; } .FFnS_ColoringRule { margin-top: 1%; padding: 1%; border: 1px solid #636363; } .FFnS_ColoringRule div { margin-top: 1%; } .list-entries { margin-top: 1rem; } #topHeaderBarFX, #headerBarFX { margin-right: 20px; } .FFnS-loading, .FFnS-sorting { padding: 1%; margin: 2%; } .FFnS-loading-animation { display: inline-block; position: relative; width: 80px; height: 14px; } .FFnS-loading-animation div { position: absolute; top: 5px; width: 13px; height: 13px; border-radius: 50%; background: #2bb24c; animation-timing-function: cubic-bezier(0, 1, 1, 0); } .FFnS-loading-animation div:nth-child(1) { left: 8px; animation: FFnS-loading-animation1 0.6s infinite; } .FFnS-loading-animation div:nth-child(2) { left: 8px; animation: FFnS-loading-animation2 0.6s infinite; } .FFnS-loading-animation div:nth-child(3) { left: 32px; animation: FFnS-loading-animation2 0.6s infinite; } .FFnS-loading-animation div:nth-child(4) { left: 56px; animation: FFnS-loading-animation3 0.6s infinite; } @keyframes FFnS-loading-animation1 { 0% { transform: scale(0); } 100% { transform: scale(1); } } @keyframes FFnS-loading-animation3 { 0% { transform: scale(1); } 100% { transform: scale(0); } } @keyframes FFnS-loading-animation2 { 0% { transform: translate(0, 0); } 100% { transform: translate(24px, 0); } } "
}

var exported = {}
const pageSupportedRegexp = new RegExp(ext.supportedURLsPattern, "i")
function currentPageNotSupported() {
	return !pageSupportedRegexp.test(document.URL)
}
function $id(id) {
	return $("#" + id)
}
function onClick(jq, handler, thisArg) {
	jq.click((eventObject) => {
		try {
			handler.apply(thisArg, eventObject)
		}
		catch (e) {
			console.log(e)
		}
	})
}
function bindMarkup(html, bindings) {
	bindings.forEach((binding) => {
		html = html.replace(new RegExp("{{[ ]*" + binding.name + "[ ]*}}", "g"), "" + binding.value)
	})
	return html
}
function callbackBindedTo(thisArg) {
	return function (callback) {
		return callback.bind(this)
	}.bind(thisArg)
}
function capitalizeFirst(s) {
	return s.charAt(0).toUpperCase() + s.slice(1)
}
function isChecked(input) {
	return input.is(":checked")
}
function setChecked(htmlId, checked) {
	$id(htmlId).prop("checked", checked)
}
function registerAccessors(srcObject, srcFieldName, targetPrototype, setterCallback, setterCallbackThisArg, fieldObjectName) {
	for (var field in srcObject) {
		var type = typeof srcObject[field]
		if (type === "object" && !$.isArray(srcObject[field])) {
			registerAccessors(srcObject[field], srcFieldName, targetPrototype, setterCallback, setterCallbackThisArg, field)
		}
		else if (type !== "function") {
			var accessorName = capitalizeFirst(field)
			if (fieldObjectName != null) {
				accessorName += "_" + capitalizeFirst(fieldObjectName)
			}
			var getterName = (type === "boolean" ? "is" : "get") + accessorName
			var setterName = "set" + accessorName;
			(() => {
				var callbackField = field
				var getFinalObj = function (callbackSrcObj) {
					return fieldObjectName == null
						? callbackSrcObj
						: callbackSrcObj[fieldObjectName]
				}
				if (targetPrototype[getterName] == null) {
					targetPrototype[getterName] = function () {
						var finalObj = getFinalObj(this[srcFieldName])
						return finalObj[callbackField]
					}
				}
				if (targetPrototype[setterName] == null) {
					targetPrototype[setterName] = function (value) {
						var callbackSrcObj = this[srcFieldName]
						var finalObj = getFinalObj(callbackSrcObj)
						finalObj[callbackField] = value
						setterCallback.call(setterCallbackThisArg, callbackSrcObj)
					}
				}
			})()
		}
	}
}
function getOrDefault(a, b) {
	return a != null ? a : b
}
function deepClone(toClone, clone, alternativeToCloneByField) {
	if (!toClone) {
		return clone
	}
	var typedClone = clone
	if (!clone) {
		clone = {}
		typedClone = toClone
	}
	for (var field in typedClone) {
		var type = typeof typedClone[field]
		if (toClone[field] == null) {
			continue
		}
		switch (type) {
			case "object":
				if (!$.isArray(typedClone[field])) {
					clone[field] = deepClone(toClone[field], alternativeToCloneByField[field], alternativeToCloneByField)
				}
				else {
					var array = toClone[field]
					if (array.length > 0) {
						var arrayType = typeof array[0]
						if (arrayType === "object") {
							let cloneArray = []
							array.forEach((element) => {
								cloneArray.push(deepClone(element, new alternativeToCloneByField[field](), alternativeToCloneByField))
							})
							clone[field] = cloneArray
						}
						else {
							clone[field] = array.slice(0)
						}
					}
					else {
						clone[field] = array.slice(0)
					}
				}
				break
			case "number":
			case "string":
				clone[field] = toClone[field] || clone[field]
				break
			case "boolean":
				clone[field] = getOrDefault(toClone[field], clone[field])
				break
		}
	}
	return clone
}
function executeWindow(sourceName, ...functions) {
	var srcTxt = "try {\n"
	srcTxt += functions.map((f) => `(function ${f})();\n`).join("\n")
	srcTxt += "\n} catch(e) { console.log(e) }"
	injectScriptText(srcTxt, sourceName)
}
function injectToWindow(...functions) {
	var srcTxt = functions
		.map((f) => (f.prototype ? "" : "function ") + f)
		.join("\n")
	const name = functions.length == 1 ? functions[0].name : "Functions"
	injectScriptText(srcTxt, "FFnS-" + name, true)
}
function injectClasses(...classes) {
	var srcTxt = classes
		.map((c) => `${c} window.${c.name} = ${c.name};`)
		.join("\n")
	injectScriptText(srcTxt, "FFnS-classes", true)
}
function injectScriptText(srcTxt, sourceURL, evalPermitted) {
	if (sourceURL) {
		srcTxt += "//# sourceURL=" + sourceURL + ".js"
	}
	if (evalPermitted && typeof InstallTrigger != "undefined") {
		srcTxt = "eval(atob('" + btoa(srcTxt) + "'))"
	}
	var script = document.createElement("script")
	script.type = "text/javascript"
	script.text = srcTxt
	document.body.appendChild(script)
}
function injectStyleText(styleTxt, id) {
	$("head").append("<style" + (id ? 'id="' + id + '" ' : "") + ">" + styleTxt + "</style>")
}
function exportFile(content, filename) {
	var textToSaveAsBlob = new Blob([content], { type: "application/json" })
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob)
	var downloadLink = document.createElement("a")
	downloadLink.download = filename ? filename : "export.json"
	downloadLink.href = textToSaveAsURL
	downloadLink.onclick = function () {
		$(downloadLink).remove()
	}
	downloadLink.style.display = "none"
	document.body.appendChild(downloadLink)
	downloadLink.click()
}
function getDateWithoutTime(date) {
	let result = new Date(date.getTime())
	result.setHours(0, 0, 0, 0)
	return result
}
function pushIfAbsent(array, value) {
	if (array.indexOf(value) < 0) {
		array.push(value)
		return true
	}
	return false
}
function removeContent(elements) {
	elements.each((i, element) => {
		var attributes = $.map(element.attributes, function (item) {
			return item["name"]
		})
		$.each(attributes, function (i, item) {
			$(element).removeAttr(item)
		})
		$(element).empty()
	})
}
function hexToRgb(hexColor) {
	const rgb = parseInt(hexColor.substring(1), 16)
	const r = (rgb >> 16) & 0xff
	const g = (rgb >> 8) & 0xff
	const b = (rgb >> 0) & 0xff
	return [r, g, b]
}
function isLight(rgb) {
	const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] // per ITU-R BT.709
	return luma > 128
}
function shadeColor(rgb, percent) {
	let R = (rgb[0] * (100 + percent)) / 100
	let G = (rgb[1] * (100 + percent)) / 100
	let B = (rgb[2] * (100 + percent)) / 100
	R = R < 255 ? R : 255
	G = G < 255 ? G : 255
	B = B < 255 ? B : 255
	return `rgb(${R}, ${G}, ${B})`
}
function debugLog(buildMessage, category) {
	if (debugEnabled) {
		let message = buildMessage()
		if (message == null) {
			return
		}
		if (Array.isArray(message)) {
			message = message.join(" | ")
		}
		console.debug((category ? `[${category}] ` : "") + message)
	}
}

var SortingType;
(function (SortingType) {
	SortingType[SortingType["PopularityDesc"] = 0] = "PopularityDesc"
	SortingType[SortingType["PopularityAsc"] = 1] = "PopularityAsc"
	SortingType[SortingType["TitleDesc"] = 2] = "TitleDesc"
	SortingType[SortingType["TitleAsc"] = 3] = "TitleAsc"
	SortingType[SortingType["PublishDateNewFirst"] = 4] = "PublishDateNewFirst"
	SortingType[SortingType["PublishDateOldFirst"] = 5] = "PublishDateOldFirst"
	SortingType[SortingType["SourceAsc"] = 6] = "SourceAsc"
	SortingType[SortingType["SourceDesc"] = 7] = "SourceDesc"
	SortingType[SortingType["ReceivedDateNewFirst"] = 8] = "ReceivedDateNewFirst"
	SortingType[SortingType["ReceivedDateOldFirst"] = 9] = "ReceivedDateOldFirst"
	SortingType[SortingType["SourceNewestReceiveDate"] = 10] = "SourceNewestReceiveDate"
	SortingType[SortingType["Random"] = 11] = "Random"
	SortingType[SortingType["PublishDayNewFirst"] = 12] = "PublishDayNewFirst"
	SortingType[SortingType["PublishDayOldFirst"] = 13] = "PublishDayOldFirst"
})(SortingType || (SortingType = {}))
var FilteringType;
(function (FilteringType) {
	FilteringType[FilteringType["RestrictedOn"] = 0] = "RestrictedOn"
	FilteringType[FilteringType["FilteredOut"] = 1] = "FilteredOut"
})(FilteringType || (FilteringType = {}))
var KeywordMatchingArea;
(function (KeywordMatchingArea) {
	KeywordMatchingArea[KeywordMatchingArea["Title"] = 0] = "Title"
	KeywordMatchingArea[KeywordMatchingArea["Body"] = 1] = "Body"
	KeywordMatchingArea[KeywordMatchingArea["Author"] = 2] = "Author"
})(KeywordMatchingArea || (KeywordMatchingArea = {}))
var KeywordMatchingMethod;
(function (KeywordMatchingMethod) {
	KeywordMatchingMethod[KeywordMatchingMethod["Simple"] = 0] = "Simple"
	KeywordMatchingMethod[KeywordMatchingMethod["Word"] = 1] = "Word"
	KeywordMatchingMethod[KeywordMatchingMethod["RegExp"] = 2] = "RegExp"
})(KeywordMatchingMethod || (KeywordMatchingMethod = {}))
var ColoringRuleSource;
(function (ColoringRuleSource) {
	ColoringRuleSource[ColoringRuleSource["SpecificKeywords"] = 0] = "SpecificKeywords"
	ColoringRuleSource[ColoringRuleSource["SourceTitle"] = 1] = "SourceTitle"
	ColoringRuleSource[ColoringRuleSource["RestrictingKeywords"] = 2] = "RestrictingKeywords"
	ColoringRuleSource[ColoringRuleSource["FilteringKeywords"] = 3] = "FilteringKeywords"
})(ColoringRuleSource || (ColoringRuleSource = {}))
var HTMLElementType;
(function (HTMLElementType) {
	HTMLElementType[HTMLElementType["SelectBox"] = 0] = "SelectBox"
	HTMLElementType[HTMLElementType["CheckBox"] = 1] = "CheckBox"
	HTMLElementType[HTMLElementType["NumberInput"] = 2] = "NumberInput"
	HTMLElementType[HTMLElementType["ColorInput"] = 3] = "ColorInput"
})(HTMLElementType || (HTMLElementType = {}))
function getFilteringTypes() {
	return [FilteringType.FilteredOut, FilteringType.RestrictedOn]
}
function getFilteringTypeId(type) {
	return FilteringType[type]
}

class AsyncResult {
	constructor(task, taskThisArg) {
		this.task = task
		this.taskThisArg = taskThisArg
	}
	then(callback, thisArg) {
		try {
			this.resultCallback = callback
			this.resultThisArg = thisArg
			this.task.call(this.taskThisArg, this)
		}
		catch (e) {
			console.log(e)
		}
	}
	result(result) {
		try {
			this.resultCallback.call(this.resultThisArg, result)
		}
		catch (e) {
			console.log(e)
		}
	}
	chain(asyncResult) {
		this.then(() => {
			asyncResult.done()
		}, this)
	}
	done() {
		try {
			this.resultCallback.apply(this.resultThisArg)
		}
		catch (e) {
			console.log(e)
		}
	}
}

class UserScriptInitializer {
	loadScript(name) {
		injectScriptText(GM_getResourceText(name))
	}
	getResourceURLs() {
		return {
			plusIconURL: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/add-circle-blue-128.png",
			eraseIconURL: "https://cdn2.iconfinder.com/data/icons/large-glossy-svg-icons/512/erase_delete_remove_wipe_out-128.png",
			closeIconURL: "https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-1/128/close-cancel-128.png",
			moveUpIconURL: "https://cdn2.iconfinder.com/data/icons/designers-and-developers-icon-set/32/move_up-32.png",
			moveDownIconURL: "https://cdn2.iconfinder.com/data/icons/designers-and-developers-icon-set/32/move_down-32.png",
			openInNewTabURL: "http://findicons.com/files/icons/2315/default_icon/256/open_in_new_window.png",
			clearFiltersURL: "https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/images/filter_clear.png",
			extensionIconURL: "https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png"
		}
	}
}
var INITIALIZER = new UserScriptInitializer()

class UserScriptStorage {
	getAsync(id, defaultValue) {
		return new AsyncResult(p => {
			p.result(JSON.parse(GM_getValue(id, JSON.stringify(defaultValue))))
		}, this)
	}
	getItemsAsync(ids) {
		return new AsyncResult(p => {
			let results = {}
			ids.forEach(id => {
				let value = GM_getValue(id, null)
				if (value != null) {
					results[id] = JSON.parse(value)
				}
			})
			p.result(results)
		}, this)
	}
	put(id, value) {
		GM_setValue(id, JSON.stringify(value))
	}
	delete(id) {
		GM_deleteValue(id)
	}
	listKeys() {
		return GM_listValues()
	}
	init() {
		return new AsyncResult(p => {
			p.done()
		}, this)
	}
	getSyncStorageManager() {
		return null
	}
	getLocalStorage() {
		return this
	}
}
var DataStore = new UserScriptStorage()

class SubscriptionDTO {
	constructor(url) {
		this.filteringEnabled = false
		this.restrictingEnabled = false
		this.sortingEnabled = true
		this.openAndMarkAsRead = true
		this.visualOpenAndMarkAsRead = false
		this.titleOpenAndMarkAsRead = false
		this.markAsReadAboveBelow = false
		this.markAsReadAboveBelowRead = true
		this.hideWhenMarkAboveBelow = false
		this.openCurrentFeedArticles = false
		this.displayDisableAllFiltersButton = false
		this.openCurrentFeedArticlesUnreadOnly = true
		this.markAsReadOnOpenCurrentFeedArticles = true
		this.maxOpenCurrentFeedArticles = 0
		this.hideAfterRead = false
		this.replaceHiddenWithGap = false
		this.markAsReadFiltered = false
		this.sortingType = SortingType.PopularityDesc
		this.advancedControlsReceivedPeriod = new AdvancedControlsReceivedPeriod()
		this.pinHotToTop = false
		this.additionalSortingTypes = []
		this.filteringListsByType = {}
		this.keywordMatchingAreas = [KeywordMatchingArea.Title]
		this.alwaysUseDefaultMatchingAreas = true
		this.keywordMatchingMethod = KeywordMatchingMethod.Simple
		this.coloringRules = []
		this.disablePageOverrides = false
		this.autoRefreshEnabled = false
		this.autoRefreshMinutes = 60
		this.hideDuplicates = false
		this.highlightDuplicates = false
		this.highlightDuplicatesColor = "FFFF00"
		this.filteringByReadingTime = new FilteringByReadingTime()
		this.url = url
		getFilteringTypes().forEach(type => {
			this.filteringListsByType[type] = []
		})
	}
}
class AdvancedControlsReceivedPeriod {
	constructor() {
		this.maxHours = 6
		this.keepUnread = false
		this.hide = false
		this.showIfHot = false
		this.minPopularity = 200
		this.markAsReadVisible = false
	}
}
class FilteringByReadingTime {
	constructor() {
		this.enabled = false
		this.filterLong = true
		this.thresholdMinutes = 5
		this.keepUnread = false
		this.wordsPerMinute = 200
	}
}
class ColoringRule {
	constructor() {
		this.source = ColoringRuleSource.SpecificKeywords
		this.color = "FFFF00"
		this.highlightAllTitle = true
		this.matchingMethod = KeywordMatchingMethod.Simple
		this.matchingArea = KeywordMatchingArea.Title
		this.specificKeywords = []
	}
}

class Subscription {
	constructor(dao, dto) {
		this.dao = dao
		if (dto) {
			this.dto = dto
		}
	}
	getURL() {
		return this.dto.url
	}
	isFilteringEnabled() {
		return this.dto.filteringEnabled
	}
	isRestrictingEnabled() {
		return this.dto.restrictingEnabled
	}
	isSortingEnabled() {
		return this.dto.sortingEnabled
	}
	isPinHotToTop() {
		return this.dto.pinHotToTop
	}
	isOpenAndMarkAsRead() {
		return this.dto.openAndMarkAsRead
	}
	isVisualOpenAndMarkAsRead() {
		return this.dto.visualOpenAndMarkAsRead
	}
	isTitleOpenAndMarkAsRead() {
		return this.dto.titleOpenAndMarkAsRead
	}
	isMarkAsReadAboveBelow() {
		return this.dto.markAsReadAboveBelow
	}
	isMarkAsReadAboveBelowRead() {
		return this.dto.markAsReadAboveBelowRead
	}
	isHideWhenMarkAboveBelow() {
		return this.dto.hideWhenMarkAboveBelow
	}
	isOpenCurrentFeedArticles() {
		return this.dto.openCurrentFeedArticles
	}
	isDisplayDisableAllFiltersButton() {
		return this.dto.displayDisableAllFiltersButton
	}
	isOpenCurrentFeedArticlesUnreadOnly() {
		return this.dto.openCurrentFeedArticlesUnreadOnly
	}
	isMarkAsReadOnOpenCurrentFeedArticles() {
		return this.dto.markAsReadOnOpenCurrentFeedArticles
	}
	getMaxOpenCurrentFeedArticles() {
		return this.dto.maxOpenCurrentFeedArticles
	}
	isHideAfterRead() {
		return this.dto.hideAfterRead
	}
	isReplaceHiddenWithGap() {
		return this.dto.replaceHiddenWithGap
	}
	isAlwaysUseDefaultMatchingAreas() {
		return this.dto.alwaysUseDefaultMatchingAreas
	}
	isMarkAsReadFiltered() {
		return this.dto.markAsReadFiltered
	}
	getAdvancedControlsReceivedPeriod() {
		return this.dto.advancedControlsReceivedPeriod
	}
	getSortingType() {
		return this.dto.sortingType
	}
	getFilteringList(type) {
		return this.dto.filteringListsByType[type]
	}
	getKeywordMatchingAreas() {
		return this.dto.keywordMatchingAreas
	}
	getKeywordMatchingMethod() {
		return this.dto.keywordMatchingMethod
	}
	isDisablePageOverrides() {
		return this.dto.disablePageOverrides
	}
	isAutoRefreshEnabled() {
		return this.dto.autoRefreshEnabled
	}
	getAutoRefreshTime() {
		return this.dto.autoRefreshMinutes * 60 * 1000
	}
	checkDuplicates() {
		return (this.isHideDuplicates() ||
			this.isHighlightDuplicates())
	}
	isHideDuplicates() {
		return this.dto.hideDuplicates
	}
	isHighlightDuplicates() {
		return this.dto.highlightDuplicates
	}
	getHighlightDuplicatesColor() {
		return this.dto.highlightDuplicatesColor
	}
	getFilteringByReadingTime() {
		return this.dto.filteringByReadingTime
	}
	setHours_AdvancedControlsReceivedPeriod(hours) {
		if (hours > 23) {
			return
		}
		var advancedPeriodDays = Math.floor(this.getAdvancedControlsReceivedPeriod().maxHours / 24)
		this.setMaxHours_AdvancedControlsReceivedPeriod(hours, advancedPeriodDays)
	}
	setDays_AdvancedControlsReceivedPeriod(days) {
		var advancedPeriodHours = this.getAdvancedControlsReceivedPeriod().maxHours % 24
		this.setMaxHours_AdvancedControlsReceivedPeriod(advancedPeriodHours, days)
	}
	setMaxHours_AdvancedControlsReceivedPeriod(hours, days) {
		var maxHours = hours + 24 * days
		this.getAdvancedControlsReceivedPeriod().maxHours = maxHours
		this.save()
	}
	getAdditionalSortingTypes() {
		return this.dto.additionalSortingTypes
	}
	setAdditionalSortingTypes(additionalSortingTypes) {
		this.dto.additionalSortingTypes = additionalSortingTypes
		this.save()
	}
	addAdditionalSortingType(additionalSortingType) {
		this.dto.additionalSortingTypes.push(additionalSortingType)
		this.save()
	}
	getColoringRules() {
		return this.dto.coloringRules
	}
	setColoringRules(coloringRules) {
		this.dto.coloringRules = coloringRules
		this.save()
	}
	addColoringRule(coloringRule) {
		this.dto.coloringRules.push(coloringRule)
		this.save()
	}
	addKeyword(keyword, type) {
		this.getFilteringList(type).push(keyword.trim())
		this.save()
	}
	removeKeyword(keyword, type) {
		var keywordList = this.getFilteringList(type)
		var index = keywordList.indexOf(keyword)
		if (index > -1) {
			keywordList.splice(index, 1)
		}
		this.save()
	}
	resetFilteringList(type) {
		this.getFilteringList(type).length = 0
	}
	save() {
		this.dao.save(this.dto)
	}
	getArticleSorterConfig() {
		return {
			sortingEnabled: this.isSortingEnabled(),
			filteringEnabled: this.isFilteringEnabled() || this.isRestrictingEnabled() || this.isHideDuplicates(),
			pinHotToTop: this.isPinHotToTop(),
			sortingType: this.getSortingType(),
			additionalSortingTypes: this.getAdditionalSortingTypes(),
		}
	}
}

class SubscriptionDAO {
	constructor() {
		this.SUBSCRIPTION_ID_PREFIX = "subscription_"
		this.GLOBAL_SETTINGS_SUBSCRIPTION_URL = "---global settings---"
		registerAccessors(new SubscriptionDTO(""), "dto", Subscription.prototype, this.save, this)
	}
	init() {
		return new AsyncResult((p) => {
			DataStore.init().then(() => {
				var t = this
				var onLoad = function (sub) {
					t.defaultSubscription = sub
					p.done()
				}
				if (DataStore.listKeys().indexOf(this.getSubscriptionId(this.GLOBAL_SETTINGS_SUBSCRIPTION_URL)) > -1) {
					this.loadSubscription(this.GLOBAL_SETTINGS_SUBSCRIPTION_URL).then(onLoad, this)
				}
				else {
					// First time installing
					var dto = new SubscriptionDTO(this.GLOBAL_SETTINGS_SUBSCRIPTION_URL)
					this.save(dto)
					onLoad.call(this, new Subscription(this, dto))
				}
			}, this)
		}, this)
	}
	loadSubscription(url, forceReloadGlobalSettings) {
		return new AsyncResult((p) => {
			var sub = new Subscription(this)
			if (forceReloadGlobalSettings) {
				url = this.GLOBAL_SETTINGS_SUBSCRIPTION_URL
			}
			this.load(url).then((dto) => {
				sub.dto = dto
				if (forceReloadGlobalSettings) {
					this.defaultSubscription = sub
				}
				p.result(sub)
			}, this)
		}, this)
	}
	save(dto) {
		var url = dto.url
		var id = this.getSubscriptionId(url)
		DataStore.put(id, dto)
		debugLog(() => "Subscription saved: " + JSON.stringify(dto), "SubscriptionDAO")
	}
	saveAll(subscriptions) {
		for (var url in subscriptions) {
			subscriptions[url].url = url
			this.save(subscriptions[url])
		}
		let globalSettings = subscriptions[this.GLOBAL_SETTINGS_SUBSCRIPTION_URL]
		if (globalSettings) {
			// ensure initialization of new properties
			let defaultDTO = this.clone(globalSettings, globalSettings.url)
			this.defaultSubscription = new Subscription(this, defaultDTO)
		}
	}
	loadAll() {
		return new AsyncResult((p) => {
			let ids = this.getAllSubscriptionIds()
			DataStore.getItemsAsync(ids).then((results) => {
				for (var key in results) {
					var url = results[key].url
					if (!url) {
						url = key.substring(this.SUBSCRIPTION_ID_PREFIX.length)
					}
					results[url] = results[key]
					delete results[url].url
					delete results[key]
				}
				p.result(results)
			}, this)
		}, this)
	}
	load(url) {
		return new AsyncResult((p) => {
			DataStore.getAsync(this.getSubscriptionId(url), null).then((dto) => {
				var cloneURL
				if (dto) {
					var linkedURL = dto.linkedUrl
					if (linkedURL != null) {
						debugLog(() => "Loading linked subscription: " + linkedURL, "SubscriptionDAO")
						this.load(linkedURL).then((dto) => {
							p.result(dto)
						}, this)
						return
					}
					else {
						cloneURL = dto.url
						debugLog(() => "Loaded saved subscription: " + JSON.stringify(dto), "SubscriptionDAO")
					}
				}
				else {
					dto = this.defaultSubscription
						? this.defaultSubscription.dto
						: new SubscriptionDTO(url)
					cloneURL = url
				}
				dto = this.clone(dto, cloneURL)
				p.result(dto)
			}, this)
		}, this)
	}
	delete(url) {
		DataStore.delete(this.getSubscriptionId(url))
		debugLog(() => "Deleted: " + url, "SubscriptionDAO")
	}
	clone(dtoToClone, cloneUrl) {
		var clone = deepClone(dtoToClone, new SubscriptionDTO(cloneUrl), {
			advancedControlsReceivedPeriod: new AdvancedControlsReceivedPeriod(),
			coloringRules: ColoringRule,
			filteringByReadingTime: new FilteringByReadingTime(),
		})
		clone.url = cloneUrl
		return clone
	}
	importSettings(urlToImport, actualUrl) {
		return new AsyncResult((p) => {
			this.load(urlToImport).then((dto) => {
				dto.url = actualUrl
				if (this.isURLGlobal(actualUrl)) {
					this.defaultSubscription.dto = dto
				}
				this.save(dto)
				p.done()
			}, this)
		}, this)
	}
	getGlobalSettings() {
		return this.defaultSubscription
	}
	getAllSubscriptionIds() {
		return DataStore.listKeys().filter((value) => {
			return value.indexOf(this.SUBSCRIPTION_ID_PREFIX) == 0
		})
	}
	getAllSubscriptionURLs() {
		return this.getAllSubscriptionIds().map((value) => {
			return value.substring(this.SUBSCRIPTION_ID_PREFIX.length)
		})
	}
	getSubscriptionId(url) {
		return this.SUBSCRIPTION_ID_PREFIX + url
	}
	linkSubscriptions(url, linkedURL) {
		var id = this.getSubscriptionId(url)
		var linkedSub = new LinkedSubscriptionDTO(linkedURL)
		var t = this
		DataStore.put(id, linkedSub)
		debugLog(() => "Subscription linked: " + JSON.stringify(linkedSub), "SubscriptionDAO")
	}
	isURLGlobal(url) {
		return url === this.GLOBAL_SETTINGS_SUBSCRIPTION_URL
	}
}
class LinkedSubscriptionDTO {
	constructor(linkedUrl) {
		this.linkedUrl = linkedUrl
	}
}

class SettingsManager {
	constructor(uiManager) {
		this.defaultUrlPrefixPattern = new RegExp(ext.defaultUrlPrefixPattern, "i")
		this.subscriptionUrlPrefixPattern = new RegExp(ext.subscriptionUrlPrefixPattern, "i")
		this.categoryUrlPrefixPattern = new RegExp(ext.categoryUrlPrefixPattern, "i")
		this.crossCheckDuplicatesSettings = new CrossCheckDuplicatesSettings()
		this.dao = new SubscriptionDAO()
		this.uiManager = uiManager
	}
	init() {
		return new AsyncResult(p => {
			this.dao.init().chain(p)
		}, this)
	}
	loadSubscription(globalSettingsEnabled, forceReloadGlobalSettings) {
		return new AsyncResult(p => {
			var onLoad = (sub) => {
				this.currentSubscription = sub
				p.result(sub)
			}
			if (globalSettingsEnabled) {
				if (forceReloadGlobalSettings) {
					this.dao.loadSubscription(null, true).then(onLoad, this)
				}
				else {
					onLoad.call(this, this.dao.getGlobalSettings())
				}
			}
			else {
				this.dao
					.loadSubscription(this.getActualSubscriptionURL())
					.then(onLoad, this)
			}
		}, this)
	}
	linkToSubscription(url) {
		var currentURL = this.currentSubscription.getURL()
		if (url === currentURL) {
			alert("Linking to the same subscription URL is impossible")
		}
		else if (this.isGlobalMode()) {
			alert("Global settings can't be linked to any other subscription")
		}
		else {
			this.dao.linkSubscriptions(currentURL, url)
		}
	}
	deleteSubscription(url) {
		this.dao.delete(url)
	}
	importAllSettings(file) {
		let fr = new FileReader()
		fr.onload = () => {
			try {
				let settingsExport = JSON.parse(fr.result)
				this.uiManager.autoLoadAllArticlesCB.refreshValue(settingsExport.autoLoadAllArticles)
				this.uiManager.loadByBatchEnabledCB.refreshValue(settingsExport.loadByBatchEnabled)
				this.uiManager.batchSizeInput.refreshValue(settingsExport.batchSize)
				this.uiManager.globalSettingsEnabledCB.refreshValue(settingsExport.globalSettingsEnabled)
				this.dao.saveAll(settingsExport.subscriptions)
				this.uiManager.refreshPage()
				alert("The settings were successfully imported")
			}
			catch (e) {
				console.log(e)
				alert("The file is incorrectly formatted")
			}
		}
		fr.readAsText(file)
	}
	exportAllSettings() {
		this.dao.loadAll().then(subscriptions => {
			let settingsExport = {
				autoLoadAllArticles: this.uiManager.autoLoadAllArticlesCB.getValue(),
				loadByBatchEnabled: this.uiManager.loadByBatchEnabledCB.getValue(),
				batchSize: this.uiManager.batchSizeInput.getValue(),
				globalSettingsEnabled: this.uiManager.globalSettingsEnabledCB.getValue(),
				subscriptions: subscriptions
			}
			exportFile(JSON.stringify(settingsExport, null, 4), "feedly-filtering-and-sorting.json")
		}, this)
	}
	importSubscription(url) {
		return new AsyncResult(p => {
			var currentURL = this.currentSubscription.getURL()
			this.dao.importSettings(url, currentURL).chain(p)
		}, this)
	}
	getAllSubscriptionURLs() {
		return this.dao.getAllSubscriptionURLs()
	}
	getActualSubscriptionURL() {
		const url = document.URL.replace(this.subscriptionUrlPrefixPattern, "subscription")
			.replace(this.categoryUrlPrefixPattern, "")
			.replace(this.defaultUrlPrefixPattern, "")
		return decodeURIComponent(url)
	}
	isGlobalMode() {
		return this.dao.isURLGlobal(this.currentSubscription.getURL())
	}
	getCurrentSubscription() {
		return this.currentSubscription
	}
	getCrossCheckDuplicatesSettings() {
		return this.crossCheckDuplicatesSettings
	}
}
class CrossCheckDuplicatesSettings {
	setChangeCallback(fun) {
		this.changeCallback = fun
	}
	isEnabled() {
		return this.enabled
	}
	setEnabled(enabled) {
		this.enabled = enabled
		this.changeCallback()
	}
	getDays() {
		return this.days
	}
	setDays(days) {
		this.days = days
		this.changeCallback()
	}
}

class EntryInfos {
	constructor(jsonInfos) {
		var bodyInfos = jsonInfos.content ? jsonInfos.content : jsonInfos.summary
		this.body = bodyInfos ? bodyInfos.content : ""
		this.author = jsonInfos.author
		this.engagement = jsonInfos.engagement
		this.published = jsonInfos.published
		this.received = jsonInfos.crawled
	}
}
class Article {
	constructor(articleContainer) {
		this.container = $(articleContainer)
		let articleIdElement = this.container
		if (!this.container.is(ext.articleIdFromFrameSelector)) {
			articleIdElement = this.container.find(ext.articleIdFromFrameSelector)
		}
		this.entryId = articleIdElement.attr("id").replace(/_main$/, "")
		var infosElement = this.container.find("." + ext.entryInfosJsonClass)
		if (infosElement.length > 0) {
			this.entryInfos = JSON.parse(infosElement.text())
		}
		if (this.entryInfos) {
			this.body = this.entryInfos.body
			this.body = this.body ? this.body.toLowerCase() : ""
			this.author = this.entryInfos.author
			this.author = this.author ? this.author.toLowerCase() : ""
			this.receivedAge = this.entryInfos.received
			this.publishAge = this.entryInfos.published
		}
		else {
			let isInlineView = this.container.find(ext.inlineViewClass).length > 0
			this.body = this.container
				.find(isInlineView ? ".content" : ".summary")
				.text()
				.toLowerCase()
			this.author = this.container
				.find(".authors")
				.text()
				.replace("by", "")
				.trim()
				.toLowerCase()
			var ageStr = this.container
				.find(ext.publishAgeSpanSelector)
				.attr(ext.publishAgeTimestampAttr)
			var ageSplit = ageStr.split("\n")
			var publishDate = ageSplit[0].replace(/[^:]*:/, "").trim()
			var receivedDate = ageSplit[1].replace(/[^:]*:/, "").trim()
			this.publishAge = Date.parse(publishDate)
			this.receivedAge = Date.parse(receivedDate)
		}
		// Title
		this.title = this.container
			.find(ext.articleTitleSelector)
			.text()
			.trim()
			.toLowerCase()
		// Popularity
		this.popularity = this.parsePopularity(this.container.find(ext.popularitySelector).text())
		// Source
		var source = this.container.find(ext.articleSourceSelector)
		if (source != null) {
			this.source = source.text().trim()
		}
		// URL
		this.url = this.container
			.find(this.container.is(".u0,.u4,.u5")
				? "a[target='_blank']"
				: ext.articleViewUrlAnchorSelector)
			.attr("href")
	}
	addClass(c) {
		return this.container.addClass(c)
	}
	getTitle() {
		return this.title
	}
	getUrl() {
		return this.url
	}
	getSource() {
		return this.source
	}
	getPopularity() {
		return this.popularity
	}
	getReceivedAge() {
		return this.receivedAge
	}
	getReceivedDate() {
		return new Date(this.receivedAge)
	}
	getPublishAge() {
		return this.publishAge
	}
	getPublishDate() {
		return new Date(this.publishAge)
	}
	isHot() {
		var span = this.container.find(ext.popularitySelector)
		return (span.hasClass("hot") ||
			span.hasClass("onfire") ||
			span.hasClass("EntryEngagement--hot"))
	}
	getEntryId() {
		return this.entryId
	}
	setVisible(visible) {
		if (visible != null && !visible) {
			const parent = this.container.parent()
			this.container.detach().prependTo(parent)
			this.container.css("display", "none")
		}
		else {
			this.container.css("display", "")
		}
	}
	getContainer() {
		return this.container
	}
	isVisible() {
		return !(this.container.css("display") === "none")
	}
	isGap() {
		return this.container.attr("gap-article") === "true"
	}
	checked() {
		this.container.attr(ext.checkedArticlesAttribute, "")
	}
	setColor(color) {
		this.container.css("background-color", color)
	}
	parsePopularity(popularityStr) {
		popularityStr = popularityStr.trim().replace("+", "")
		if (popularityStr.indexOf("K") > -1) {
			popularityStr = popularityStr.replace("K", "")
			popularityStr += "000"
		}
		return Number(popularityStr)
	}
}

class ArticleSorter {
	constructor(sortingEnabled, pinHotToTop, sortingType, additionalSortingTypes, sortGaps = false) {
		this.sortingEnabled = sortingEnabled
		this.pinHotToTop = pinHotToTop
		this.sortingType = sortingType
		this.sortGaps = sortGaps
		this.articleVisible = this.sortGaps
			? (a) => a.isVisible() || a.isGap()
			: (a) => a.isVisible()
		this.sortingTypes = [sortingType].concat(additionalSortingTypes)
	}
	static from(config) {
		return new ArticleSorter(config.sortingEnabled, config.pinHotToTop, config.sortingType, config.additionalSortingTypes)
	}
	prepare(articles) {
		let visibleArticles = []
		let hiddenArticles = []
		articles.forEach((a) => {
			if (this.articleVisible(a)) {
				visibleArticles.push(a)
			}
			else {
				hiddenArticles.push(a)
			}
		})
		return { visibleArticles, hiddenArticles }
	}
	sort(articles) {
		let { visibleArticles, hiddenArticles } = this.prepare(articles)
		if (this.pinHotToTop) {
			var hotArticles = []
			var normalArticles = []
			visibleArticles.forEach((article) => {
				if (article.isHot()) {
					hotArticles.push(article)
				}
				else {
					normalArticles.push(article)
				}
			})
			if (this.sortingEnabled) {
				this.sortArray(hotArticles)
				this.sortArray(normalArticles)
			}
			visibleArticles = hotArticles.concat(normalArticles)
		}
		else if (this.sortingEnabled) {
			this.sortArray(visibleArticles)
		}
		return { visibleArticles, hiddenArticles }
	}
	sortArray(articles) {
		articles.sort(articleSorterFactory.getSorter(this.sortingTypes))
		if (SortingType.SourceNewestReceiveDate == this.sortingType) {
			let sourceToArticles = {}
			articles.forEach((a) => {
				let sourceArticles = (sourceToArticles[a.getSource()] ||
					(sourceToArticles[a.getSource()] = []),
					sourceToArticles[a.getSource()])
				sourceArticles.push(a)
			})
			articles.length = 0
			for (let source in sourceToArticles) {
				articles.push(...sourceToArticles[source])
			}
		}
	}
}
class ArticleSorterFactory {
	constructor() {
		this.sorterByType = {}
		function titleSorter(isAscending) {
			var multiplier = isAscending ? 1 : -1
			return (a, b) => {
				return a.getTitle().localeCompare(b.getTitle()) * multiplier
			}
		}
		function popularitySorter(isAscending) {
			var multiplier = isAscending ? 1 : -1
			return (a, b) => {
				return (a.getPopularity() - b.getPopularity()) * multiplier
			}
		}
		function receivedDateSorter(isNewFirst) {
			var multiplier = isNewFirst ? -1 : 1
			return (a, b) => {
				return (a.getReceivedAge() - b.getReceivedAge()) * multiplier
			}
		}
		function publishDateSorter(isNewFirst) {
			var multiplier = isNewFirst ? -1 : 1
			return (a, b) => {
				return (a.getPublishAge() - b.getPublishAge()) * multiplier
			}
		}
		function publishDaySorter(isNewFirst) {
			var multiplier = isNewFirst ? -1 : 1
			return (a, b) => {
				let dateA = a.getPublishDate(), dateB = b.getPublishDate()
				let result = dateA.getFullYear() - dateB.getFullYear()
				if (result == 0) {
					result = dateA.getMonth() - dateB.getMonth()
					if (result == 0) {
						result = dateA.getDay() - dateB.getDay()
					}
				}
				return result * multiplier
			}
		}
		function sourceSorter(isAscending) {
			var multiplier = isAscending ? 1 : -1
			return (a, b) => {
				return a.getSource().localeCompare(b.getSource()) * multiplier
			}
		}
		this.sorterByType[SortingType.TitleDesc] = titleSorter(false)
		this.sorterByType[SortingType.TitleAsc] = titleSorter(true)
		this.sorterByType[SortingType.PopularityDesc] = popularitySorter(false)
		this.sorterByType[SortingType.PopularityAsc] = popularitySorter(true)
		this.sorterByType[SortingType.ReceivedDateNewFirst] =
			receivedDateSorter(true)
		this.sorterByType[SortingType.ReceivedDateOldFirst] =
			receivedDateSorter(false)
		this.sorterByType[SortingType.PublishDateNewFirst] =
			publishDateSorter(true)
		this.sorterByType[SortingType.PublishDateOldFirst] =
			publishDateSorter(false)
		this.sorterByType[SortingType.PublishDayNewFirst] = publishDaySorter(true)
		this.sorterByType[SortingType.PublishDayOldFirst] = publishDaySorter(false)
		this.sorterByType[SortingType.SourceAsc] = sourceSorter(true)
		this.sorterByType[SortingType.SourceDesc] = sourceSorter(false)
		this.sorterByType[SortingType.SourceNewestReceiveDate] =
			receivedDateSorter(true)
		this.sorterByType[SortingType.Random] = () => {
			return Math.random() - 0.5
		}
	}
	getSorter(sortingTypes) {
		if (sortingTypes.length == 1) {
			return this.sorterByType[sortingTypes[0]]
		}
		return (a, b) => {
			var res
			for (var i = 0; i < sortingTypes.length; i++) {
				res = this.sorterByType[sortingTypes[i]](a, b)
				if (res != 0) {
					return res
				}
			}
			return res
		}
	}
}
articleSorterFactory = new ArticleSorterFactory()

class ArticleManager {
	constructor(settingsManager, keywordManager, page) {
		this.articlesToMarkAsRead = []
		this.articlesToAdd = []
		this.darkMode = this.isDarkMode()
		this.settingsManager = settingsManager
		this.keywordManager = keywordManager
		this.page = page
		this.duplicateChecker = new DuplicateChecker(this)
	}
	refreshArticles() {
		debugLog(() => "refresh articles at " + new Date().toTimeString())
		this.resetArticles()
		if ($(ext.articleSelector).length == 0) {
			return
		}
		$(ext.articleSelector).each((i, e) => {
			this.addArticle(e, true)
		})
		this.checkLastAddedArticle(true)
		this.page.sortArticles()
	}
	resetArticles() {
		this.articlesToMarkAsRead = []
		this.duplicateChecker.reset()
	}
	refreshColoring() {
		this.darkMode = this.isDarkMode()
		$(ext.articleSelector).each((i, e) => {
			this.applyColoringRules(new Article(e))
		})
	}
	getCurrentSub() {
		return this.settingsManager.getCurrentSubscription()
	}
	addNewArticle(a) {
		if (this.articlesAddTimeout) {
			clearTimeout(this.articlesAddTimeout)
		}
		this.articlesToAdd.push(a)
		this.articlesAddTimeout = setTimeout(() => {
			const articlesToAdd = [...this.articlesToAdd]
			this.articlesAddTimeout = null
			this.articlesToAdd = []
			if (articlesToAdd.length > 300) {
				setTimeout(() => {
					this.page.displaySortingAnimation(true)
					setTimeout(() => {
						articlesToAdd.forEach((a) => this.addArticle(a))
						this.page.displaySortingAnimation(false)
					}, 100)
				}, 100)
			}
			else {
				articlesToAdd.forEach((a) => this.addArticle(a))
			}
		}, 100)
	}
	addArticle(a, skipCheck) {
		var article = new Article(a)
		this.filterAndRestrict(article)
		this.advancedControls(article)
		this.applyColoringRules(article)
		if (!skipCheck) {
			article.checked()
			this.checkLastAddedArticle()
		}
	}
	filterAndRestrict(article) {
		if (this.isDisableAllFilters()) {
			return
		}
		var sub = this.getCurrentSub()
		if (sub.isFilteringEnabled() || sub.isRestrictingEnabled()) {
			var hide = false
			if (sub.isRestrictingEnabled()) {
				hide = this.keywordManager.matchKeywords(article, sub, FilteringType.RestrictedOn, true)
			}
			if (sub.isFilteringEnabled()) {
				let filtered = this.keywordManager.matchKeywords(article, sub, FilteringType.FilteredOut)
				hide = hide || filtered
				if (filtered && sub.isMarkAsReadFiltered()) {
					article.addClass(ext.markAsReadImmediatelyClass)
				}
			}
			if (hide) {
				article.setVisible(false)
			}
			else {
				article.setVisible()
			}
		}
		else {
			article.setVisible()
		}
	}
	advancedControls(article) {
		var sub = this.getCurrentSub()
		var advControls = sub.getAdvancedControlsReceivedPeriod()
		if (advControls.keepUnread || advControls.hide) {
			try {
				var threshold = Date.now() - advControls.maxHours * 3600 * 1000
				var receivedAge = article.getReceivedAge()
				if (receivedAge <= threshold) {
					if (advControls.keepUnread) {
						this.articlesToMarkAsRead.push(article)
					}
				}
				else {
					if (advControls.showIfHot &&
						(article.isHot() ||
							article.getPopularity() >= advControls.minPopularity)) {
						if (advControls.keepUnread && advControls.markAsReadVisible) {
							this.articlesToMarkAsRead.push(article)
						}
					}
					else if (advControls.hide && !this.isDisableAllFilters()) {
						article.setVisible(false)
					}
				}
			}
			catch (err) {
				console.log(err)
			}
		}
		this.duplicateChecker.check(article)
		const filteringByReadingTime = sub.getFilteringByReadingTime()
		if (filteringByReadingTime.enabled && !this.isDisableAllFilters()) {
			let thresholdWords = filteringByReadingTime.thresholdMinutes *
				filteringByReadingTime.wordsPerMinute
			let articleWords = article.body.split(" ").length
			if (articleWords != thresholdWords &&
				filteringByReadingTime.filterLong == articleWords > thresholdWords) {
				article.setVisible(false)
			}
			else if (filteringByReadingTime.keepUnread) {
				this.articlesToMarkAsRead.push(article)
			}
		}
	}
	checkDisableAllFilters() {
		if (this.isDisableAllFilters()) {
			$(ext.articleSelector).css("display", "")
			this.page.clearHidingInfo()
		}
	}
	isDisableAllFilters() {
		return (this.page.get(ext.disableAllFiltersButtonId) &&
			this.page.get(ext.disableAllFiltersEnabled, true))
	}
	applyColoringRules(article) {
		let sub = this.getCurrentSub()
		let rules = sub.getColoringRules()
		for (let i = 0; i < rules.length; i++) {
			let rule = rules[i]
			let keywords
			switch (rule.source) {
				case ColoringRuleSource.SpecificKeywords:
					keywords = rule.specificKeywords
					break
				case ColoringRuleSource.RestrictingKeywords:
					keywords = sub.getFilteringList(FilteringType.RestrictedOn)
					break
				case ColoringRuleSource.FilteringKeywords:
					keywords = sub.getFilteringList(FilteringType.FilteredOut)
					break
			}
			if (rule.source == ColoringRuleSource.SourceTitle) {
				article.setColor(this.generateColor(article.getSource()))
			}
			else {
				let match = this.keywordManager.matchSpecficKeywords(article, keywords, rule.matchingMethod, rule.matchingArea)
				article.setColor(match ? this.correctDarkness("#" + rule.color) : "")
				if (match) {
					return
				}
			}
		}
	}
	correctDarkness(hexColor) {
		const rgb = hexToRgb(hexColor)
		if (isLight(rgb) && this.darkMode) {
			return shadeColor(rgb, -80)
		}
		return hexColor
	}
	generateColor(id) {
		if (!id || id.length == 0) {
			return ""
		}
		var x = 0
		for (var i = 0; i < id.length; i++) {
			x += id.charCodeAt(i)
		}
		let h = (x % 360) + 1
		return "hsl(" + h + ", 100%, " + (this.darkMode ? "20%)" : "80%)")
	}
	isDarkMode() {
		return $("body").hasClass("theme--dark")
	}
	checkLastAddedArticle(refresh) {
		const allArticlesChecked = $(ext.articleSelector).filter(ext.uncheckedArticlesSelector).length == 0
		if (allArticlesChecked) {
			this.prepareMarkAsRead()
			this.page.refreshHidingInfo()
			if (!refresh) {
				this.duplicateChecker.allArticlesChecked()
			}
			this.checkDisableAllFilters()
		}
	}
	prepareMarkAsRead() {
		if (this.articlesToMarkAsRead.length > 0) {
			var ids = this.articlesToMarkAsRead.map((article) => {
				return article.getEntryId()
			})
			this.page.put(ext.articlesToMarkAsReadId, ids)
		}
	}
	isOldestFirst() {
		return !this.page.get(ext.isNewestFirstId, true)
	}
}

class DuplicateChecker {
	constructor(articleManager) {
		this.articleManager = articleManager
		this.url2Article = {}
		this.title2Article = {}
		this.crossArticles = new CrossArticleManager(articleManager, this)
	}
	reset() {
		this.url2Article = {}
		this.title2Article = {}
	}
	allArticlesChecked() {
		this.crossArticles.save(true)
	}
	check(article) {
		var sub = this.articleManager.getCurrentSub()
		if (sub.checkDuplicates()) {
			let url = article.getUrl()
			let title = article.getTitle()
			let duplicate = true
			if (!url || !title) {
				duplicate = false
			}
			if (!this.checkDuplicate(article, this.url2Article[url])) {
				this.url2Article[url] = article
				if (!this.checkDuplicate(article, this.title2Article[title])) {
					this.title2Article[title] = article
					duplicate = false
				}
			}
			this.crossArticles.addArticle(article, duplicate)
		}
	}
	checkDuplicate(a, b) {
		if (!b || a.getEntryId() === b.getEntryId()) {
			return false
		}
		let toKeep = a.getPublishAge() > b.getPublishAge() ? a : b
		let duplicate = a.getPublishAge() > b.getPublishAge() ? b : a
		this.title2Article[a.getTitle()] = toKeep
		this.title2Article[b.getTitle()] = toKeep
		this.url2Article[a.getUrl()] = toKeep
		this.url2Article[b.getUrl()] = toKeep
		this.setDuplicate(duplicate, toKeep)
		return true
	}
	setDuplicate(duplicate, newerDuplicate = duplicate) {
		var sub = this.articleManager.getCurrentSub()
		if (sub.isHideDuplicates()) {
			duplicate.setVisible(false)
			this.articleManager.page.refreshHidingInfo()
		}
		if (sub.isHighlightDuplicates()) {
			newerDuplicate.setColor("#" + sub.getHighlightDuplicatesColor())
		}
	}
}
class CrossArticleManager {
	constructor(articleManager, duplicateChecker) {
		this.duplicateChecker = duplicateChecker
		this.URLS_KEY_PREFIX = "cross_article_urls_"
		this.TITLES_KEY_PREFIX = "cross_article_titles_"
		this.IDS_KEY_PREFIX = "cross_article_ids_"
		this.DAYS_ARRAY_KEY = "cross_article_days"
		this.crossUrls = {}
		this.crossTitles = {}
		this.crossIds = {}
		this.daysArray = []
		this.changedDays = []
		this.initializing = false
		this.ready = false
		this.crossCheckSettings =
			articleManager.settingsManager.getCrossCheckDuplicatesSettings()
		this.crossCheckSettings.setChangeCallback(() => this.refresh())
	}
	addArticle(a, duplicate) {
		if (!this.crossCheckSettings.isEnabled() || !this.isReady()) {
			return
		}
		if (!duplicate) {
			duplicate = this.checkDuplicate(a)
		}
		const articleDay = getDateWithoutTime(a.getReceivedDate()).getTime()
		if (articleDay < this.getThresholdDay()) {
			return
		}
		this.initDay(articleDay)
		try {
			let changed = pushIfAbsent(this.crossUrls[articleDay], a.getUrl())
			changed =
				pushIfAbsent(this.crossTitles[articleDay], a.getTitle()) || changed
			if (!duplicate) {
				changed =
					pushIfAbsent(this.crossIds[articleDay], a.getEntryId()) || changed
			}
			if (changed) {
				pushIfAbsent(this.changedDays, articleDay)
			}
		}
		catch (e) {
			console.error(e.message + ": " + articleDay + ". Days and urls:")
			console.log(this.daysArray.map(this.formatDay))
			console.log(this.crossUrls)
		}
	}
	save(saveAll) {
		if (saveAll) {
			this.changedDays = this.daysArray
		}
		if (!this.crossCheckSettings.isEnabled() ||
			!this.isReady() ||
			this.changedDays.length == 0) {
			return
		}
		this.saveDaysArray()
		this.changedDays.forEach(this.saveDay, this)
		this.changedDays = []
	}
	checkDuplicate(a) {
		const id = a.getEntryId()
		const checkedNotDuplicate = this.daysArray.some((day) => this.crossIds[day].indexOf(id) > -1)
		if (!checkedNotDuplicate) {
			let found = this.daysArray.some((day) => {
				return (this.crossUrls[day].indexOf(a.getUrl()) > -1 ||
					this.crossTitles[day].indexOf(a.getTitle()) > -1)
			}, this)
			if (found) {
				this.duplicateChecker.setDuplicate(a)
				return true
			}
		}
		return false
	}
	isReady() {
		return this.ready
	}
	init() {
		return new AsyncResult((p) => {
			this.localStorage = DataStore.getLocalStorage()
			this.localStorage
				.getAsync(this.DAYS_ARRAY_KEY, [])
				.then((result) => {
					console.log("[Duplicates cross checking] Loading the stored days ...")
					this.setAndCleanDays(result)
					if (this.daysArray.length == 0) {
						console.log("[Duplicates cross checking] No day was stored")
						p.done()
					}
					else {
						this.loadDays(this.daysArray.slice(0)).chain(p)
					}
				}, this)
		}, this)
	}
	refresh() {
		if (this.crossCheckSettings.isEnabled()) {
			if (!this.isReady()) {
				if (this.initializing) {
					return
				}
				this.initializing = true
				this.init().then(() => {
					this.ready = true
					this.addArticles()
					this.save()
					this.initializing = false
				}, this)
			}
			else {
				this.setAndCleanDays(this.daysArray)
				this.addArticles()
				this.save()
			}
		}
	}
	addArticles() {
		$(ext.articleSelector).each((i, e) => {
			this.addArticle(new Article(e))
		})
	}
	getUrlsKey(day) {
		return this.URLS_KEY_PREFIX + day
	}
	getTitlesKey(day) {
		return this.TITLES_KEY_PREFIX + day
	}
	getIdsKey(day) {
		return this.IDS_KEY_PREFIX + day
	}
	getThresholdDay() {
		const maxDays = this.crossCheckSettings.getDays()
		let thresholdDate = getDateWithoutTime(new Date())
		thresholdDate.setDate(thresholdDate.getDate() - maxDays)
		let thresholdDay = thresholdDate.getTime()
		return thresholdDay
	}
	setAndCleanDays(crossArticleDays) {
		this.daysArray = crossArticleDays.slice(0).filter((val) => {
			return !isNaN(val)
		})
		let thresholdDay = this.getThresholdDay()
		crossArticleDays
			.filter((day) => day < thresholdDay)
			.forEach(this.cleanDay, this)
	}
	initDay(day) {
		if (this.daysArray.indexOf(day) < 0) {
			this.daysArray.push(day)
			this.crossUrls[day] = []
			this.crossTitles[day] = []
			this.crossIds[day] = []
		}
	}
	loadDays(days) {
		if (days.length == 1) {
			return this.loadDay(days[0])
		}
		else {
			return new AsyncResult((p) => {
				this.loadDay(days.pop()).then(() => {
					this.loadDays(days).chain(p)
				}, this)
			}, this)
		}
	}
	loadDay(day) {
		return new AsyncResult((p) => {
			this.localStorage
				.getAsync(this.getIdsKey(day), [])
				.then((result) => {
					this.crossIds[day] = result
					this.localStorage
						.getAsync(this.getUrlsKey(day), [])
						.then((result) => {
							this.crossUrls[day] = result
							this.localStorage
								.getAsync(this.getTitlesKey(day), [])
								.then((result) => {
									this.crossTitles[day] = result
									console.log("[Duplicates cross checking] Loaded successfully the day: " +
										this.formatDay(day) +
										", title count: " +
										this.crossTitles[day].length)
									p.done()
								}, this)
						}, this)
				}, this)
		}, this)
	}
	cleanDay(day) {
		console.log("[Duplicates cross checking] Cleaning the stored day: " +
			this.formatDay(day))
		this.daysArray.splice(this.daysArray.indexOf(day), 1)
		this.saveDaysArray()
		delete this.crossUrls[day]
		delete this.crossTitles[day]
		delete this.crossIds[day]
		this.localStorage.delete(this.getUrlsKey(day))
		this.localStorage.delete(this.getTitlesKey(day))
	}
	saveDay(day) {
		console.log("[Duplicates cross checking] Saving the day: " +
			this.formatDay(day) +
			", title count: " +
			this.crossTitles[day].length)
		this.localStorage.put(this.getUrlsKey(day), this.crossUrls[day])
		this.localStorage.put(this.getTitlesKey(day), this.crossTitles[day])
		this.localStorage.put(this.getIdsKey(day), this.crossIds[day])
	}
	saveDaysArray() {
		this.localStorage.put(this.DAYS_ARRAY_KEY, this.daysArray)
	}
	formatDay(day) {
		return new Date(day).toLocaleDateString()
	}
}

class KeywordManager {
	constructor() {
		this.separator = "#"
		this.areaPrefix = "#Area#"
		this.keywordSplitPattern = new RegExp(this.separator + "(.+)")
		this.matcherFactory = new KeywordMatcherFactory()
	}
	insertArea(keyword, area) {
		return (this.areaPrefix + KeywordMatchingArea[area] + this.separator + keyword)
	}
	matchSpecficKeywords(article, keywords, method, area) {
		var matcher = this.matcherFactory.getMatcher(area, method)
		for (var i = 0; i < keywords.length; i++) {
			let keyword = keywords[i]
			if (keyword.indexOf(this.areaPrefix) == 0) {
				keyword = this.splitKeywordArea(keyword)[1]
			}
			if (matcher.match(article, keyword)) {
				return true
			}
		}
		return false
	}
	matchKeywords(article, sub, type, invert) {
		var keywords = sub.getFilteringList(type)
		if (keywords.length == 0) {
			return false
		}
		var match = !invert == true
		var matchers = this.matcherFactory.getMatchers(sub)
		for (var i = 0; i < keywords.length; i++) {
			var keyword = keywords[i]
			if (keyword.indexOf(this.areaPrefix) == 0) {
				let split = this.splitKeywordArea(keyword)
				keyword = split[1]
				if (!sub.isAlwaysUseDefaultMatchingAreas()) {
					var area = KeywordMatchingArea[split[0]]
					var matcher = this.matcherFactory.getMatcher(area, sub.getKeywordMatchingMethod())
					if (matcher.match(article, keyword)) {
						return match
					}
					continue
				}
			}
			for (var m = 0; m < matchers.length; m++) {
				if (matchers[m].match(article, keyword)) {
					return match
				}
			}
		}
		return !match
	}
	splitKeywordArea(keyword) {
		keyword = keyword.slice(this.areaPrefix.length)
		return keyword.split(this.keywordSplitPattern)
	}
}
class KeywordMatcherFactory {
	constructor() {
		this.matcherByType = {}
		this.comparerByMethod = {}
		this.comparerByMethod[KeywordMatchingMethod.Simple] = (area, keyword) => {
			return area.indexOf(keyword.toLowerCase()) != -1
		}
		this.comparerByMethod[KeywordMatchingMethod.RegExp] = (area, pattern) => {
			return new RegExp(pattern, "i").test(area)
		}
		this.comparerByMethod[KeywordMatchingMethod.Word] = (area, word) => {
			return new RegExp("\\b" + word + "\\b", "i").test(area)
		}
		this.matcherByType[KeywordMatchingArea.Title] = (a, k, method) => {
			return this.comparerByMethod[method](a.title, k)
		}
		this.matcherByType[KeywordMatchingArea.Body] = (a, k, method) => {
			return this.comparerByMethod[method](a.body, k)
		}
		this.matcherByType[KeywordMatchingArea.Author] = (a, k, method) => {
			return this.comparerByMethod[method](a.author, k)
		}
	}
	getMatchers(sub) {
		var method = sub.getKeywordMatchingMethod()
		return sub.getKeywordMatchingAreas().map((a) => {
			return this.getMatcher(a, method)
		})
	}
	getMatcher(area, method) {
		var t = this
		return {
			match(a, k) {
				return t.matcherByType[area](a, k, method)
			},
		}
	}
}

class FeedlyPage {
	constructor() {
		this.get = this.getFFnS
		this.put = this.putFFnS
		this.put("ext", ext)
		this.put("SortingType", SortingType)
		injectClasses(EntryInfos, Article, ArticleSorter, ArticleSorterFactory)
		injectToWindow(this.getFFnS, this.putFFnS, this.getById, this.getArticleId, this.getReactPage, this.getStreamPage, this.getStreamObj, this.getService, this.onClickCapture, this.disableOverrides, this.fetchMoreEntries, this.getKeptUnreadEntryIds, this.getSortedVisibleArticles, debugLog, enableDebug, removeContent, this.sortArticlesDOM, this.displaySortingAnimation, this.isAutoLoad, this.refreshHidingInfo)
		injectToWindow(this.overrideLoadingEntries)
		injectToWindow(this.overrideSorting)
		injectToWindow(this.overrideNavigation)
		injectToWindow(this.onNewPageObserve)
		injectToWindow(this.onNewArticleObserve)
		executeWindow("Feedly-Page-FFnS", this.initWindow, this.overrideMarkAsRead)
	}
	update(sub) {
		this.updateCheck(sub.isOpenAndMarkAsRead(), ext.openAndMarkAsReadId, ext.openAndMarkAsReadClass)
		this.updateCheck(sub.isMarkAsReadAboveBelow(), ext.markAsReadAboveBelowId, ext.markAsReadAboveBelowClass)
		this.updateCheck(sub.isOpenCurrentFeedArticles(), ext.openCurrentFeedArticlesId, ext.openCurrentFeedArticlesClass)
		this.updateCheck(sub.isDisplayDisableAllFiltersButton(), ext.disableAllFiltersButtonId, ext.disableAllFiltersButtonClass)
		const filteringByReadingTime = sub.getFilteringByReadingTime()
		if (sub.getAdvancedControlsReceivedPeriod().keepUnread ||
			(filteringByReadingTime.enabled && filteringByReadingTime.keepUnread)) {
			this.put(ext.keepArticlesUnreadId, true)
		}
		if (sub.isHideWhenMarkAboveBelow()) {
			this.put(ext.hideWhenMarkAboveBelowId, true)
		}
		if (sub.isHideAfterRead()) {
			this.put(ext.hideAfterReadId, true)
		}
		this.put(ext.markAsReadAboveBelowReadId, sub.isMarkAsReadAboveBelowRead())
		this.put(ext.visualOpenAndMarkAsReadId, sub.isVisualOpenAndMarkAsRead())
		this.put(ext.titleOpenAndMarkAsReadId, sub.isTitleOpenAndMarkAsRead())
		this.put(ext.openCurrentFeedArticlesUnreadOnlyId, sub.isOpenCurrentFeedArticlesUnreadOnly())
		this.put(ext.maxOpenCurrentFeedArticlesId, sub.getMaxOpenCurrentFeedArticles())
		this.put(ext.markAsReadOnOpenCurrentFeedArticlesId, sub.isMarkAsReadOnOpenCurrentFeedArticles())
		this.put(ext.disablePageOverridesId, sub.isDisablePageOverrides())
		this.put(ext.articleSorterConfigId, sub.getArticleSorterConfig())
	}
	sortArticles() {
		document.dispatchEvent(new Event("ensureSortedEntries"))
	}
	isAutoLoad() {
		try {
			return (getStreamPage() != null &&
				!(getStreamPage().stream.state.info.subscribed === false) &&
				getFFnS(ext.autoLoadAllArticlesId, true))
		}
		catch (e) {
			return false
		}
	}
	displaySortingAnimation(visible) {
		if (visible) {
			if (getService("preferences").content.autoSelectOnScroll === "no") {
				$(ext.articlesContainerSelector).hide()
			}
			$(".FFnS_Hiding_Info").hide()
			if ($(".FFnS-sorting,.FFnS-loading").length == 0) {
				$(ext.articlesContainerSelector)
					.first()
					.before(`<div class='FFnS-sorting'>
                <div class='FFnS-loading-animation'><div></div><div></div><div></div><div></div></div>
                <span>Sorting and filtering articles</span>
              </div>`)
			}
		}
		else {
			$(".FFnS-sorting").remove()
			if ($(".FFnS-loading").length == 0) {
				$(ext.articlesContainerSelector).show()
			}
			(this.refreshHidingInfo || refreshHidingInfo)()
		}
	}
	sortArticlesDOM(articleSorterConfig, sortedArticles) {
		if (!articleSorterConfig) {
			articleSorterConfig = getFFnS(ext.articleSorterConfigId)
		}
		if (!articleSorterConfig.sortingEnabled &&
			!articleSorterConfig.pinHotToTop &&
			!sortedArticles) {
			return
		}
		debugLog(() => "sort at " + new Date().toTimeString(), "Sorting")
		displaySortingAnimation(true)
		const sortedArticlesContainers = []
		if (sortedArticles) {
			const { visibleArticles, hiddenArticles } = sortedArticles
			$(ext.articlesContainerSelector).each((_, container) => {
				const ids = $(container)
					.find(ext.articleIdSelector)
					.get()
					.map(getArticleId)
				const conatinerVisibleArticles = visibleArticles.filter((a) => ids.includes(a.getEntryId()))
				const conatinerHiddenArticles = hiddenArticles.filter((a) => ids.includes(a.getEntryId()))
				sortedArticlesContainers.push({
					container,
					sortedArticles: {
						visibleArticles: conatinerVisibleArticles,
						hiddenArticles: conatinerHiddenArticles,
					},
				})
			})
		}
		else {
			$(ext.articlesContainerSelector).each((_, container) => {
				const articles = $(container)
					.find(ext.articleAndGapSelector)
					.get()
					.map((e) => new Article(e))
				const sortedArticles = ArticleSorter.from(articleSorterConfig).sort(articles)
				sortedArticlesContainers.push({ container, sortedArticles })
			})
		}
		sortedArticlesContainers.forEach((sortedArticlesContainer) => {
			const articlesContainer = $(sortedArticlesContainer.container)
			const { visibleArticles, hiddenArticles } = sortedArticlesContainer.sortedArticles
			let chunks = articlesContainer.find(ext.articlesChunkSelector)
			removeContent(chunks.find(".Heading,.EntryList__heading"))
			let containerChunk = chunks.first()
			containerChunk.empty()
			let appendArticle = (article) => {
				const container = article.getContainer();
				(window["appendChildOriginal"] || Node.prototype.appendChild).call(containerChunk.get(0), container.detach().get(0))
			}
			visibleArticles.forEach(appendArticle)
			hiddenArticles.forEach(appendArticle)
		})
		setTimeout(() => {
			displaySortingAnimation(false)
		}, 100)
	}
	updateCheck(enabled, id, className) {
		if (enabled) {
			this.put(id, true)
			$("." + className).css("display", "")
		}
		else {
			$("." + className).css("display", "none")
		}
	}
	initAutoLoad() {
		if (this.get(ext.autoLoadAllArticlesId, true)) {
			executeWindow("Feedly-Page-FFnS-InitAutoLoad", this.autoLoad)
		}
	}
	initWindow() {
		window["ext"] = getFFnS("ext")
		window["SortingType"] = getFFnS("SortingType")
		window["articleSorterFactory"] = new ArticleSorterFactory()
		window["debugEnabled"] = localStorage.getItem("debug_enabled") === "true"
		NodeCreationObserver.init("observed-page")
		overrideLoadingEntries()
		overrideSorting()
		overrideNavigation()
		onNewPageObserve()
		onNewArticleObserve()
		let removeChild = Node.prototype.removeChild
		Node.prototype.removeChild = function (child) {
			try {
				// debugLog(() => {
				//   if (!$(child).is(ext.articleAndInlineSelector)) {
				//     return null;
				//   }
				//   return [
				//     `child: ${child["id"] || child["classList"] || child["tagName"]}`,
				//   ];
				// }, "remove");
				if (child.nodeName === "ARTICLE") {
					// save id to show inline div in right place (this -> EntryList__chunk node)
					$(".list-entries").attr("hiddenArticleId", child["id"])
				}
				return removeChild.apply(this, arguments)
			}
			catch (e) {
				if ($(this).hasClass(ext.articlesChunkClass)) {
					$(child).remove()
				}
				else {
					if (e.name !== "NotFoundError") {
						console.log(e)
					}
				}
			}
		}
		const insertBefore = Node.prototype.insertBefore
		const appendChild = Node.prototype.appendChild
		window["appendChildOriginal"] = appendChild
		function insertArticleNode(_, node, parent) {
			let sibling = null
			try {
				const id = node.nodeName === "ARTICLE"
					? getArticleId(node)
					: parent.className === "EntryList__chunk"
						? $(".list-entries")
							.attr("hiddenArticleId")
							.replace(/_main$/, "")
						: undefined
				if (id === undefined) {
					// skip below code in try to move faster to appendChild.call?
					throw false
				}
				const sortedIds = getService("navigo").entries.map((e) => e.id)
				let nextIndex = sortedIds.indexOf(id) + 1
				if (nextIndex === sortedIds.length) {
					return appendChild.call(parent, node)
				}
				else if (nextIndex > 0 && nextIndex < sortedIds.length) {
					const nextId = sortedIds[nextIndex]
					sibling = getById(nextId)
				}
				else {
					sibling = null
				}
			}
			catch (e) { }
			if (!sibling) {
				sibling = parent.firstChild
			}
			if (node.nodeName == "ARTICLE" &&
				$(".list-entries").attr("hiddenArticleId") &&
				$(".list-entries").attr("hiddenArticleId") == node.id) {
				// clear if current showing article is the one that was hidden
				$(".list-entries").removeAttr("hiddenArticleId")
			}
			if (!sibling) {
				// debugLog(() => {
				//   return [
				//     `child: ${node["id"] || node["classList"] || node["tagName"]}`,
				//   ];
				// }, "append");
				return appendChild.call(parent, node)
			}
			// debugLog(
			//   () => [
			//     `node: ${node["id"] || node["classList"] || node["tagName"]}`,
			//     "insertBefore",
			//     `siblingNode: ${
			//       sibling["id"] || sibling["classList"] || sibling["tagName"]
			//     }`,
			//   ],
			//   "insert"
			// );
			return insertBefore.call(sibling.parentNode, node, sibling)
		}
		Node.prototype.insertBefore = function (node, siblingNode) {
			try {
				if (!disableOverrides() && $(this).hasClass(ext.articlesChunkClass)) {
					return insertArticleNode(this, node, siblingNode.parentNode || this)
				}
				else {
					// debugLog(() => {
					//   if (!$(node).is(ext.articleAndInlineSelector)) {
					//     return null;
					//   }
					//   return [
					//     `node: ${node["id"] || node["classList"] || node["tagName"]}`,
					//     "insertBefore",
					//     `siblingNode: ${
					//       siblingNode["id"] ||
					//       siblingNode["classList"] ||
					//       siblingNode["tagName"]
					//     }`,
					//   ];
					// }, "insert");
					return insertBefore.apply(this, arguments)
				}
			}
			catch (e) {
				console.log(e)
			}
		}
		Node.prototype.appendChild = function (child) {
			if (!disableOverrides() &&
				($(child).is(ext.inlineArticleFrameSelector) ||
					$(child).is(ext.readArticleSelector) ||
					($(child).is(ext.unreadArticleSelector) &&
						getFFnS(ext.navigatingEntry)))) {
				return insertArticleNode(this, child, this)
			}
			else {
				const result = appendChild.apply(this, arguments)
				// debugLog(() => {
				//   if (!$(child).is(ext.articleAndInlineSelector)) {
				//     return null;
				//   }
				//   return [
				//     `child: ${child["id"] || child["classList"] || child["tagName"]}`,
				//   ];
				// }, "append");
				return result
			}
		}
	}
	autoLoad() {
		var navigo = getService("navigo")
		navigo.initAutoLoad = true
		navigo.setEntries(navigo.getEntries())
	}
	getStreamPage() {
		var observers = getService("navigo").observers
		for (let i = 0, len = observers.length; i < len; i++) {
			let stream = observers[i].stream
			if ((stream && stream.streamId) || observers[i]._streams) {
				return observers[i]
			}
		}
	}
	getReactPage() {
		var observers = getService("feedly").observers
		for (let i = 0, len = observers.length; i < len; i++) {
			const prototype = Object.getPrototypeOf(observers[i])
			if (prototype.markAsRead) {
				return observers[i]
			}
		}
	}
	getStreamObj() {
		let streamPage = getStreamPage()
		let streamObj = streamPage.stream
		if (!streamObj) {
			streamObj = streamPage._streams[Object.keys(streamPage._streams)[0]]
		}
		return streamObj
	}
	getService(name) {
		return window["streets"].service(name)
	}
	onNewPageObserve() {
		NodeCreationObserver.onCreation(ext.subscriptionChangeSelector, () => {
			if (disableOverrides()) {
				return
			}
			let openCurrentFeedArticlesBtn = $("<div>", {
				title: "Open all current feed articles in a new tab",
				class: ext.openCurrentFeedArticlesClass + " " + ext.containerButtonClass,
				style: getFFnS(ext.openCurrentFeedArticlesId)
					? "cursor: pointer;"
					: "display: none",
				type: "button",
			})
			let disableAllFiltersBtn = $("<div>", {
				class: ext.disableAllFiltersButtonClass + " " + ext.containerButtonClass,
				style: getFFnS(ext.disableAllFiltersButtonId)
					? "cursor: pointer;"
					: "display: none",
				type: "button",
			})
			function refreshDisableAllFiltersBtn(enabled) {
				disableAllFiltersBtn.attr("title", `${enabled ? "Restore" : "Disable all"} filters`)
				if (enabled) {
					disableAllFiltersBtn.addClass("enabled")
				}
				else {
					disableAllFiltersBtn.removeClass("enabled")
				}
			}
			refreshDisableAllFiltersBtn(getFFnS(ext.disableAllFiltersEnabled, true))
			let feedButtonsContainer = $(`<div id='${ext.buttonsContainerId}'>`)
			feedButtonsContainer.append(openCurrentFeedArticlesBtn)
			feedButtonsContainer.append(disableAllFiltersBtn)
			$("header.header").parent().after(feedButtonsContainer)
			onClickCapture(openCurrentFeedArticlesBtn, (event) => {
				event.stopPropagation()
				let articlesToOpen = getSortedVisibleArticles()
				if (articlesToOpen.length == 0) {
					return
				}
				if (getFFnS(ext.openCurrentFeedArticlesUnreadOnlyId)) {
					articlesToOpen = articlesToOpen.filter((id) => {
						const a = $(getById(id))
						return (a.hasClass(ext.unreadArticleClass) ||
							(a.hasClass(ext.inlineViewClass) &&
								a.find(ext.articleViewReadSelector).length === 0))
					})
				}
				let max = getFFnS(ext.maxOpenCurrentFeedArticlesId)
				if (max && max > 0) {
					if (max < articlesToOpen.length) {
						articlesToOpen.length = max
					}
				}
				articlesToOpen
					.map((id) => getById(id))
					.forEach((a) => {
						let link = $(a)
							.find($(a).is(".u0,.u4,.u5")
								? "a[target='_blank']"
								: ext.articleViewUrlAnchorSelector)
							.attr("href")
						window.open(link, link)
					})
				if (getFFnS(ext.markAsReadOnOpenCurrentFeedArticlesId)) {
					let reader = getService("reader")
					articlesToOpen.forEach((entryId) => {
						reader.askMarkEntryAsRead(entryId)
						const a = $(getById(entryId))
						if (a.hasClass(ext.inlineViewClass)) {
							a.find(ext.articleTitleSelector).addClass(ext.articleViewReadTitleClass)
						}
						else {
							a.removeClass(ext.unreadArticleClass).addClass(ext.readArticleClass)
						}
					})
				}
			})
			onClickCapture(disableAllFiltersBtn, (event) => {
				event.stopPropagation()
				const newEnabled = !getFFnS(ext.disableAllFiltersEnabled, true)
				putFFnS(ext.disableAllFiltersEnabled, newEnabled, true)
				refreshDisableAllFiltersBtn(newEnabled)
				document.dispatchEvent(new Event("ensureSortedEntries"))
				$(`#${ext.forceRefreshArticlesId}`).click()
			})
			document.dispatchEvent(new Event("ensureSortedEntries"))
		})
		NodeCreationObserver.onCreation(ext.layoutChangeSelector, (e) => {
			$(e).click(() => setTimeout(() => $(`#${ext.forceRefreshArticlesId}`).click(), 1000))
		})
	}
	disableOverrides() {
		let disable = getFFnS(ext.disablePageOverridesId)
		disable =
			disable || !new RegExp(ext.supportedURLsPattern, "i").test(document.URL)
		return disable
	}
	onClickCapture(element, callback) {
		element.get(0).addEventListener("click", callback, true)
	}
	getKeptUnreadEntryIds() {
		let navigo = getService("navigo")
		let entries = navigo.originalEntries || navigo.getEntries()
		let keptUnreadEntryIds = entries
			.filter((e) => {
				return e.wasKeptUnread()
			})
			.map((e) => {
				return e.id
			})
		return keptUnreadEntryIds
	}
	getSortedVisibleArticles(container) {
		const sortedVisibleArticles = Array.from((container || document).querySelectorAll(ext.sortedArticlesSelector))
			.filter((a) => a.style.display !== "none")
			.map((a) => getArticleId(a))
		return sortedVisibleArticles
	}
	onNewArticleObserve() {
		var getLink = (a) => {
			return a
				.find(a.is(".u0,.u4,.u5")
					? "a[target='_blank']"
					: ext.articleViewUrlAnchorSelector)
				.attr("href")
		}
		var getMarkAsReadAboveBelowCallback = (above) => {
			return (event) => {
				event.stopPropagation()
				const entryId = getArticleId($(event.target)
					.closest("article")
					.get(0))
				var sortedVisibleArticles = getSortedVisibleArticles()
				var markAsRead = getFFnS(ext.markAsReadAboveBelowReadId)
				if (markAsRead) {
					let keptUnreadEntryIds = getKeptUnreadEntryIds()
					sortedVisibleArticles = sortedVisibleArticles.filter((id) => {
						return keptUnreadEntryIds.indexOf(id) < 0
					})
				}
				var index = sortedVisibleArticles.indexOf(entryId)
				if (index == -1) {
					return
				}
				var start, endExcl
				if (above) {
					if (index == 0) {
						return
					}
					start = 0
					endExcl = index
				}
				else {
					if (index == sortedVisibleArticles.length) {
						return
					}
					start = index + 1
					endExcl = sortedVisibleArticles.length
				}
				var hide = getFFnS(ext.hideWhenMarkAboveBelowId)
				let reader = getService("reader")
				for (var i = start; i < endExcl; i++) {
					var id = sortedVisibleArticles[i]
					if (markAsRead) {
						reader.askMarkEntryAsRead(id)
						const a = $(getById(id))
						if (a.hasClass(ext.inlineViewClass)) {
							a.find(ext.articleTitleSelector).addClass(ext.articleViewReadTitleClass)
						}
						else {
							a.removeClass(ext.unreadArticleClass).addClass(ext.readArticleClass)
						}
						if (hide) {
							$(getById(id)).remove()
						}
					}
					else {
						reader.askKeepEntryAsUnread(id)
					}
				}
			}
		}
		const openAndMarkAsRead = (event) => {
			event.stopPropagation()
			const article = $(event.target).closest("article")
			const link = getLink(article)
			const entryId = getArticleId(article.get(0))
			const inlineView = article.hasClass(ext.inlineViewClass)
			const reader = getService("reader")
			window.open(link, link)
			reader.askMarkEntryAsRead(entryId)
			if (inlineView) {
				article
					.find(ext.articleTitleSelector)
					.addClass(ext.articleViewReadTitleClass)
			}
		}
		const createButtonContainer = (cardsView = false) => {
			const buttonContainer = $("<span>", {
				class: ext.buttonContainerClass,
			})
			const addButton = (id, attributes) => {
				attributes.type = "button"
				attributes.style = getFFnS(id) ? "cursor: pointer;" : "display: none"
				attributes.class += " mark-as-read"
				var e = $("<div>", attributes)
				buttonContainer.append(e)
				return e
			}
			const markAsReadAboveElement = addButton(ext.markAsReadAboveBelowId, {
				class: ext.markAsReadAboveBelowClass + " mark-above-as-read",
				title: "Mark articles above" +
					(cardsView ? " and on the left" : "") +
					" as read/unread",
			})
			const markAsReadBelowElement = addButton(ext.markAsReadAboveBelowId, {
				class: ext.markAsReadAboveBelowClass + " mark-below-as-read",
				title: "Mark articles below" +
					(cardsView ? " and on the right" : "") +
					" as read/unread",
			})
			const openAndMarkAsReadElement = addButton(ext.openAndMarkAsReadId, {
				class: ext.openAndMarkAsReadClass,
				title: "Open in a new window/tab and mark as read",
			})
			onClickCapture(openAndMarkAsReadElement, openAndMarkAsRead)
			onClickCapture(markAsReadBelowElement, getMarkAsReadAboveBelowCallback(false))
			onClickCapture(markAsReadAboveElement, getMarkAsReadAboveBelowCallback(true))
			return buttonContainer
		}
		NodeCreationObserver.onCreation(".CardEntry__toolbar", (e) => {
			const buttonContainer = createButtonContainer(true)
			$(e).prepend(buttonContainer)
		})
		NodeCreationObserver.onCreation(".TitleOnlyEntry__toolbar", (e) => {
			const buttonContainer = createButtonContainer()
			$(e).prepend(buttonContainer)
		})
		NodeCreationObserver.onCreation(".MagazineLayout__toolbar", (e) => {
			// $(e).closest(".MagazineLayout__content").find(".EntryMetadata .ago").after(buttonContainer);
			const buttonContainer = createButtonContainer()
			$(e).prepend(buttonContainer)
		})
		NodeCreationObserver.onCreation(ext.articleAndInlineSelector, (element) => setTimeout(() => {
			if (disableOverrides()) {
				return
			}
			var a = $(element)
			let articleIdElement = element
			if (!a.is(ext.articleIdFromFrameSelector)) {
				articleIdElement = a.find(ext.articleIdFromFrameSelector).get(0)
			}
			var entryId = getArticleId(articleIdElement)
			let reader = getService("reader")
			var e = reader.lookupEntry(entryId)
			var entryInfos = $("<span>", {
				class: ext.entryInfosJsonClass,
				style: "display: none",
			})
			entryInfos.text(JSON.stringify(e ? new EntryInfos(e.jsonInfo) : {}))
			a.append(entryInfos)
			var cardsView = a.hasClass("u5")
			var magazineView = a.hasClass("u4")
			var inlineView = a.hasClass(ext.inlineViewClass)
			var titleView = a.hasClass("u0") && !inlineView
			if (inlineView) {
				const buttonContainer = createButtonContainer()
				a.find(".ShareBar__actions-left").after(buttonContainer)
			}
			if (cardsView || magazineView) {
				let visualElement = a.find(ext.articleVisualSelector)
				onClickCapture(visualElement, (e) => {
					if (getFFnS(ext.visualOpenAndMarkAsReadId)) {
						openAndMarkAsRead(e)
					}
				})
			}
			if (titleView) {
				onClickCapture(a.find(ext.articleTitleSelector), (e) => {
					if (getFFnS(ext.titleOpenAndMarkAsReadId)) {
						e.stopPropagation()
						e.preventDefault()
						const link = getLink(a)
						window.open(link, link)
						reader.askMarkEntryAsRead(entryId)
					}
				})
			}
		}, 900))
	}
	reset() {
		this.clearHidingInfo()
		var i = sessionStorage.length
		while (i--) {
			var key = sessionStorage.key(i)
			if (/^FFnS_/.test(key)) {
				sessionStorage.removeItem(key)
			}
		}
	}
	refreshHidingInfo() {
		if ($(".FFnS-sorting,.FFnS-loading").length > 0) {
			return
		}
		var hiddenCount = 0
		$(ext.articleSelector).each((i, a) => {
			if (!$(a).is(":visible")) {
				hiddenCount++
			}
		})
		$(".FFnS_Hiding_Info").remove()
		if (hiddenCount == 0) {
			return
		}
		$(ext.hidingInfoSibling).after("<div class='col-xs-3 col-md-3 detail FFnS_Hiding_Info'> (" +
			hiddenCount +
			" hidden entries)</div>")
	}
	clearHidingInfo() {
		$(".FFnS_Hiding_Info").remove()
	}
	putFFnS(id, value, persistent) {
		sessionStorage.setItem("FFnS" + (persistent ? "#" : "_") + id, JSON.stringify(value))
	}
	getFFnS(id, persistent) {
		return JSON.parse(sessionStorage.getItem("FFnS" + (persistent ? "#" : "_") + id))
	}
	getById(id) {
		const article = document.querySelector(`.EntryList__chunk article[id^='${id}']`)
		const container = $(article).closest(".EntryList__chunk > *").get(0)
		return container
	}
	getArticleId(e) {
		return e.getAttribute("id").replace(/_main$/, "")
	}
	fetchMoreEntries(batchSize) {
		const streamPage = getStreamPage()
		let stream = streamPage.stream
		stream.setBatchSize(batchSize)
		$(".FFnS-sorting").remove()
		if ($(".FFnS-loading").length == 0 &&
			getService("preferences").content.autoSelectOnScroll === "no") {
			$(ext.articlesContainerSelector)
				.first()
				.before(`<div class='FFnS-loading'>
              <div class='FFnS-loading-animation'><div></div><div></div><div></div><div></div></div>
              <span>Auto loading all articles</span>
            </div>`)
		}
		debugLog(() => "[Fetching] load with batch size: " +
			stream._batchSize +
			" at: " +
			new Date().toTimeString())
		streamPage._scrollTarget.dispatchEvent(new CustomEvent("scroll"))
	}
	overrideLoadingEntries() {
		let streamObj = getStreamObj()
		if (!streamObj) {
			setTimeout(overrideLoadingEntries, 1000)
			return
		}
		putFFnS(ext.isNewestFirstId, streamObj._sort === "newest", true)
		var autoLoadAllArticleDefaultBatchSize = 1000
		var prototype = Object.getPrototypeOf(streamObj)
		var setBatchSize = prototype.setBatchSize
		prototype.setBatchSize = function (customSize) {
			if (disableOverrides()) {
				return setBatchSize.apply(this, arguments)
			}
			if (this._batchSize == customSize) {
				return
			}
			if (isAutoLoad()) {
				this._batchSize = customSize
			}
			else {
				setBatchSize.apply(this, arguments)
			}
		}
		var navigoPrototype = Object.getPrototypeOf(getService("navigo"))
		var setEntries = navigoPrototype.setEntries
		navigoPrototype.setEntries = function (entries) {
			if (disableOverrides()) {
				return setEntries.apply(this, arguments)
			}
			try {
				if (entries.length == 0) {
					return setEntries.apply(this, arguments)
				}
				debugLog(() => `set entries`, "Fetching")
				var stream = getStreamPage().stream
				if (stream.state.isLoadingEntries) {
					debugLog(() => `[Fetching] already fetching at: ${new Date().toTimeString()}`)
				}
				else if (isAutoLoad() && !stream.state.hasAllEntries) {
					if (!stream.fetchingMoreEntries) {
						stream.fetchingMoreEntries = true
						setTimeout(() => {
							if (getService("preferences").content.autoSelectOnScroll === "no") {
								$(ext.articlesContainerSelector).hide()
							}
							$(".FFnS_Hiding_Info").hide()
							fetchMoreEntries(Math.min(stream.state.info.unreadCount, autoLoadAllArticleDefaultBatchSize))
						}, 100)
					}
				}
				else {
					if (isAutoLoad() && stream.fetchingMoreEntries) {
						stream.fetchingMoreEntries = false
						debugLog(() => `[Fetching] End at: ${new Date().toTimeString()}`)
						$(ext.articlesContainerSelector).show()
						$(".FFnS-loading").remove()
						setTimeout(() => refreshHidingInfo, 200)
					}
					document.dispatchEvent(new Event("ensureSortedEntries"))
				}
			}
			catch (e) {
				console.log(e)
			}
			return setEntries.apply(this, arguments)
		}
		NodeCreationObserver.onCreation(ext.loadingMessageSelector, (e) => {
			if (disableOverrides()) {
				return
			}
			if ($(ext.loadingElementSelector).length > 0) {
				$(e).hide()
			}
		})
	}
	overrideMarkAsRead() {
		var prototype = Object.getPrototypeOf(getService("readingManager"))
		var askMarkPageAsRead = prototype.askMarkPageAsRead
		prototype.askMarkPageAsRead = function (lastEntryObject) {
			let readingManager = getService("readingManager")
			if (disableOverrides()) {
				return askMarkPageAsRead.apply(readingManager, arguments)
			}
			let jumpToNext = () => {
				if (document.URL.indexOf("category/global.") < 0) {
					let navigo = getService("navigo")
					if (navigo.getNextURI()) {
						readingManager._jumpToNext.call(readingManager)
					}
					else {
						this.feedly.loadDefaultPage()
					}
				}
				else {
					this._askRefreshCurrentPage()
				}
			}
			if (lastEntryObject && lastEntryObject.asOf) {
				askMarkPageAsRead.call(readingManager, lastEntryObject)
			}
			else if (getFFnS(ext.keepArticlesUnreadId)) {
				debugLog(() => "Marking as read with keeping new articles unread")
				var idsToMarkAsRead = getFFnS(ext.articlesToMarkAsReadId)
				if (idsToMarkAsRead) {
					let keptUnreadEntryIds = getKeptUnreadEntryIds()
					idsToMarkAsRead = idsToMarkAsRead.filter((id) => {
						return keptUnreadEntryIds.indexOf(id) < 0
					})
					debugLog(() => idsToMarkAsRead.length + " new articles will be marked as read")
					let reader = getService("reader")
					reader.askMarkEntriesAsRead(idsToMarkAsRead, {})
				}
				else {
					debugLog(() => "No article to mark as read")
				}
				jumpToNext()
			}
			else {
				askMarkPageAsRead.call(readingManager, lastEntryObject)
			}
		}
	}
	overrideSorting() {
		function ensureSortedEntries() {
			const streamState = getStreamPage().stream?.state
			if (getFFnS(ext.navigatingEntry) || streamState?.modificationCount > 0) {
				return
			}
			const articleSorterConfig = getFFnS(ext.articleSorterConfigId)
			if (!articleSorterConfig ||
				(!articleSorterConfig.sortingEnabled &&
					!articleSorterConfig.filteringEnabled &&
					!articleSorterConfig.pinHotToTop)) {
				return
			}
			if (isAutoLoad() &&
				streamState.hasAllEntries &&
				streamState.entries?.length > 100) {
				displaySortingAnimation(true)
			}
			let timeoutId = +localStorage.getItem("ensureSortedEntriesTimeoutId")
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
			timeoutId = setTimeout(() => {
				try {
					localStorage.setItem("ensureSortedEntriesTimeoutId", "")
					checkSortedEntries(articleSorterConfig)
				}
				finally {
					displaySortingAnimation(false)
				}
			}, 600)
			localStorage.setItem("ensureSortedEntriesTimeoutId", "" + timeoutId)
		}
		function checkSortedEntries(articleSorterConfig) {
			debugLog(() => "checking entries", "Sorting")
			let navigo = getService("navigo")
			var entries = navigo.entries
			var originalEntries = navigo.originalEntries || entries
			navigo.originalEntries = originalEntries
			const pageArticles = Array.from(document.querySelectorAll(ext.articleIdSelector)).map((a) => getArticleId(a))
			const addedArticles = entries
				.filter((e) => !pageArticles.includes(e.id))
				.map((e) => e.id)
			if (articleSorterConfig.filteringEnabled) {
				const visibleArticles = getSortedVisibleArticles()
				navigo.entries = entries.filter((e) => addedArticles.includes(e.id) || visibleArticles.includes(e.id))
			}
			const sorter = ArticleSorter.from(articleSorterConfig)
			if (!articleSorterConfig.sortingEnabled &&
				!articleSorterConfig.pinHotToTop) {
				const articles = navigo.originalEntries
					.map((e) => getById(e.id))
					.filter((e) => e != null)
					.map((e) => new Article(e))
				var visibleEntryIds = getSortedVisibleArticles()
				const entryIds = articles
					.map((a) => a.getEntryId())
					.filter((id) => visibleEntryIds.includes(id))
				for (var i = 0; i < visibleEntryIds.length; i++) {
					if (entryIds[i] !== visibleEntryIds[i]) {
						return sortArticlesDOM(articleSorterConfig, sorter.prepare(articles))
					}
				}
				return
			}
			let sorted = false
			let len = 0
			$(ext.articlesContainerSelector).each((_, container) => {
				var sortedVisibleArticles = getSortedVisibleArticles(container)
				if (!sortedVisibleArticles) {
					navigo.entries = originalEntries
					navigo.originalEntries = null
					return
				}
				len += sortedVisibleArticles.length
				const visibleEntryIds = navigo.entries.map((e) => e.id)
				for (var i = 0; i < sortedVisibleArticles.length && sorted; i++) {
					if (visibleEntryIds[i] !== sortedVisibleArticles[i]) {
						debugLog(() => [
							"entries not sorted",
							"\n\t" +
							visibleEntryIds
								.slice(Math.max(0, i - 1), Math.min(i + 2, entries.length))
								.map((id) => new Article(getById(id)).getTitle())
								.join("\n\t"),
							"\nvisible:\n\t" +
							sortedVisibleArticles
								.slice(Math.max(0, i - 1), Math.min(i + 2, entries.length))
								.map((id) => new Article(getById(id)).getTitle())
								.join("\n\t"),
						], "Sorting")
						sorted = false
					}
				}
			})
			if (!sorted && len > 0) {
				try {
					const articles = navigo.originalEntries
						.map((e) => {
							const el = getById(e.id)
							return el ? new Article(el) : null
						})
						.filter((a) => !!a)
					const sortedArticles = sorter.sort(articles)
					const { visibleArticles } = sortedArticles
					const idToEntry = {}
					navigo.originalEntries.forEach((e) => (idToEntry[e.id] = e))
					entries = visibleArticles.map((a) => idToEntry[a.getEntryId()])
					// debugLog(
					//   () => [
					//     "sorted entries",
					//     "\n\t" +
					//       entries
					//         .slice(0, Math.min(5, entries.length))
					//         .map((e) => e.getTitle())
					//         .join("\n\t"),
					//   ],
					//   "ensureSortedEntries"
					// );
					navigo.entries = entries
					sortArticlesDOM(articleSorterConfig, sortedArticles)
				}
				catch (e) {
					debugLog(() => ["!!", e.name, e.message, "!!"], "ensureSortedEntries")
				}
			}
			// debugLog(() => "end", "ensureSortedEntries");
		}
		document.addEventListener("ensureSortedEntries", ensureSortedEntries)
		const feedly = getService("feedly")
		const feedlyInlineEntry = feedly.inlineEntry
		feedly.inlineEntry = function () {
			putFFnS(ext.navigatingEntry, true)
			const result = feedlyInlineEntry.apply(this, arguments)
			putFFnS(ext.navigatingEntry, false)
			return result
		}
		const navigoPrototype = Object.getPrototypeOf(getService("navigo"))
		const lookupNextEntry = navigoPrototype.lookupNextEntry
		const lookupPreviousEntry = navigoPrototype.lookupPreviousEntry
		const getEntries = navigoPrototype.getEntries
		const setEntries = navigoPrototype.setEntries
		const reset = navigoPrototype.reset
		navigoPrototype.lookupNextEntry = function (a) {
			if (disableOverrides()) {
				return lookupNextEntry.apply(this, arguments)
			}
			const selectedEntryId = this.selectedEntryId
			let result = lookupNextEntry.call(this, getFFnS(ext.hideAfterReadId) ? true : a)
			if (!result) {
				return result
			}
			let entry
			while (result &&
				(entry = getById(result.id)) &&
				(!$(entry).is(":visible") || entry.hasAttribute("gap-article"))) {
				this.selectedEntryId = result?.id
				result = lookupNextEntry.call(this, false)
			}
			debugLog(() => [
				"selectedEntryId: " + selectedEntryId,
				"nextEntryId: " + result?.id,
			], "lookupNextEntry")
			return result
		}
		navigoPrototype.lookupPreviousEntry = function (a) {
			if (disableOverrides()) {
				return lookupPreviousEntry.apply(this, arguments)
			}
			const selectedEntryId = this.selectedEntryId
			let result = lookupPreviousEntry.call(this, getFFnS(ext.hideAfterReadId) ? true : a)
			if (!result) {
				return result
			}
			let entry
			while (result &&
				(entry = getById(result.id)) &&
				(!$(entry).is(":visible") || entry.hasAttribute("gap-article"))) {
				this.selectedEntryId = result.id
				result = lookupPreviousEntry.call(this, false)
			}
			debugLog(() => [
				"selectedEntryId: " + selectedEntryId,
				"previousEntryId: " + result?.id,
			], "lookupPreviousEntry")
			return result
		}
		navigoPrototype.getEntries = function () {
			if (disableOverrides()) {
				return getEntries.apply(this, arguments)
			}
			return getEntries.apply(this, arguments)
		}
		navigoPrototype.setEntries = function () {
			if (disableOverrides()) {
				return setEntries.apply(this, arguments)
			}
			let navigo = getService("navigo")
			navigo.originalEntries = null
			try {
				document.dispatchEvent(new Event("ensureSortedEntries"))
			}
			catch (e) {
				console.log(e)
			}
			return setEntries.apply(this, arguments)
		}
		navigoPrototype.reset = function () {
			let navigo = getService("navigo")
			navigo.originalEntries = null
			return reset.apply(this, arguments)
		}
		const listEntryIds = navigoPrototype.listEntryIds
		navigoPrototype.listEntryIds = function () {
			if (disableOverrides()) {
				return listEntryIds.apply(this, arguments)
			}
			let navigo = getService("navigo")
			var a = []
			var entries = navigo.originalEntries || navigo.entries
			return (entries.forEach(function (b) {
				a.push(b.getId())
			}),
				a)
		}
		const inlineEntry = navigoPrototype.inlineEntry
		navigoPrototype.inlineEntry = function () {
			putFFnS(ext.navigatingEntry, true)
			const result = inlineEntry.apply(this, arguments)
			putFFnS(ext.navigatingEntry, false)
			return result
		}
	}
	overrideNavigation() {
		var prototype = Object.getPrototypeOf(getService("navigo"))
		const collectionPrefix = "collection/content/"
		const allCategorySuffix = "category/global.all"
		const getNextURI = prototype.getNextURI
		prototype.getNextURI = function () {
			if (disableOverrides()) {
				return getNextURI.apply(this, arguments)
			}
			let nextURI = this.nextURI
			if (getFFnS(ext.navigatingToNextId)) {
				putFFnS(ext.navigatingToNextId, false)
				const currentCategory = document.URL.replace(new RegExp(ext.categoryUrlPrefixPattern, "i"), "")
				if (nextURI &&
					nextURI.endsWith(allCategorySuffix) &&
					currentCategory == allCategorySuffix) {
					nextURI = null
				}
				if (!nextURI) {
					try {
						let categories = JSON.parse(getService("preferences").getPreference("categoriesOrderingId"))
						return collectionPrefix + categories[0]
					}
					catch (e) {
						console.log(e)
					}
				}
			}
			return nextURI
		}
		const readingManager = Object.getPrototypeOf(getService("readingManager"))
		const _jumpToNext = readingManager._jumpToNext
		readingManager._jumpToNext = () => {
			if (!disableOverrides()) {
				putFFnS(ext.navigatingToNextId, true)
			}
			return _jumpToNext.apply(getService("readingManager"), arguments)
		}
	}
}
const page = typeof FeedlyPage

class UIManager {
	constructor() {
		this.containsReadArticles = false
		this.forceReloadGlobalSettings = false
		this.keywordToId = {}
		this.idCount = 1
		this.sortingSelectId = "SortingType"
		this.htmlSettingsElements = [
			{
				type: HTMLElementType.SelectBox,
				ids: [
					this.sortingSelectId,
					"KeywordMatchingMethod",
					this.getKeywordMatchingSelectId(false),
				],
			},
			{
				type: HTMLElementType.ColorInput,
				ids: ["HighlightDuplicatesColor"],
			},
			{
				type: HTMLElementType.CheckBox,
				ids: [
					"FilteringEnabled",
					"RestrictingEnabled",
					"SortingEnabled",
					"PinHotToTop",
					"KeepUnread_AdvancedControlsReceivedPeriod",
					"Hide_AdvancedControlsReceivedPeriod",
					"ShowIfHot_AdvancedControlsReceivedPeriod",
					"MarkAsReadVisible_AdvancedControlsReceivedPeriod",
					"OpenAndMarkAsRead",
					"MarkAsReadAboveBelow",
					"HideWhenMarkAboveBelow",
					"HideAfterRead",
					"ReplaceHiddenWithGap",
					"AlwaysUseDefaultMatchingAreas",
					"VisualOpenAndMarkAsRead",
					"TitleOpenAndMarkAsRead",
					"MarkAsReadFiltered",
					"AutoRefreshEnabled",
					"OpenCurrentFeedArticles",
					"OpenCurrentFeedArticlesUnreadOnly",
					"MarkAsReadOnOpenCurrentFeedArticles",
					"DisplayDisableAllFiltersButton",
					"HideDuplicates",
					"HighlightDuplicates",
					"Enabled_FilteringByReadingTime",
					"KeepUnread_FilteringByReadingTime",
					"DisablePageOverrides",
				],
			},
			{
				type: HTMLElementType.NumberInput,
				ids: [
					"MinPopularity_AdvancedControlsReceivedPeriod",
					"AutoRefreshMinutes",
					"MaxOpenCurrentFeedArticles",
					"ThresholdMinutes_FilteringByReadingTime",
					"WordsPerMinute_FilteringByReadingTime",
				],
			},
		]
		this.settingsDivContainerId = this.getHTMLId("settingsDivContainer")
		this.closeBtnId = this.getHTMLId("CloseSettingsBtn")
	}
	init() {
		return new AsyncResult((p) => {
			this.settingsManager = new SettingsManager(this)
			this.keywordManager = new KeywordManager()
			this.page = new FeedlyPage()
			this.htmlSubscriptionManager = new HTMLSubscriptionManager(this)
			this.settingsManager.init().then(() => {
				this.articleManager = new ArticleManager(this.settingsManager, this.keywordManager, this.page)
				this.autoLoadAllArticlesCB = new HTMLGlobalSettings(ext.autoLoadAllArticlesId, true, this)
				this.globalSettingsEnabledCB = new HTMLGlobalSettings("globalSettingsEnabled", true, this, true, false)
				this.loadByBatchEnabledCB = new HTMLGlobalSettings(ext.loadByBatchEnabledId, false, this)
				this.batchSizeInput = new HTMLGlobalSettings(ext.batchSizeId, 200, this)
				const crossCheckSettings = this.settingsManager.getCrossCheckDuplicatesSettings()
				this.crossCheckDuplicatesCB = new HTMLGlobalSettings("CrossCheckDuplicates", false, this, false, false)
				this.crossCheckDuplicatesDaysInput = new HTMLGlobalSettings("CrossCheckDuplicatesDays", 3, this, false, false)
				this.crossCheckDuplicatesCB.setAdditionalChangeCallback((val) => crossCheckSettings.setEnabled(val))
				this.crossCheckDuplicatesDaysInput.setAdditionalChangeCallback((val) => crossCheckSettings.setDays(val))
				this.globalSettings = [
					this.autoLoadAllArticlesCB,
					this.loadByBatchEnabledCB,
					this.batchSizeInput,
					this.globalSettingsEnabledCB,
					this.crossCheckDuplicatesCB,
					this.crossCheckDuplicatesDaysInput,
				]
				this.initGlobalSettings(this.globalSettings.slice(0)).then(() => {
					this.page.initAutoLoad()
					this.updateSubscription().then(() => {
						this.initUI()
						this.registerSettings()
						this.postUpdate()
						this.initSettingsCallbacks()
						this.postInit()
						p.done()
					}, this)
				}, this)
			}, this)
		}, this)
	}
	initGlobalSettings(settings) {
		if (settings.length == 1) {
			return settings[0].init()
		}
		else {
			return new AsyncResult((p) => {
				settings
					.pop()
					.init()
					.then(() => {
						this.initGlobalSettings(settings).chain(p)
					}, this)
			}, this)
		}
	}
	resetGlobalSettings(settings) {
		if (settings.length == 1) {
			return settings[0].reset()
		}
		else {
			return new AsyncResult((p) => {
				settings
					.pop()
					.reset()
					.then(() => {
						this.resetGlobalSettings(settings).chain(p)
					}, this)
			}, this)
		}
	}
	updatePage() {
		if (currentPageNotSupported()) {
			return
		}
		try {
			this.resetPage()
			this.updateSubscription().then(this.postUpdate, this)
		}
		catch (err) {
			console.log(err)
		}
	}
	postUpdate() {
		if (currentPageNotSupported()) {
			return
		}
		this.updateMenu()
		setTimeout(() => {
			this.refreshFilteringAndSorting()
		}, 500)
		if (this.subscription.isAutoRefreshEnabled()) {
			setInterval(() => {
				window.location.reload()
			}, this.subscription.getAutoRefreshTime())
		}
	}
	resetPage() {
		this.containsReadArticles = false
		this.articleManager.resetArticles()
	}
	refreshPage() {
		this.updatePage()
		this.refreshFilteringAndSorting()
	}
	refreshFilteringAndSorting() {
		this.page.reset()
		this.page.update(this.subscription)
		this.articleManager.refreshArticles()
	}
	updateSubscription() {
		return new AsyncResult((p) => {
			if (currentPageNotSupported()) {
				p.done()
				return
			}
			var globalSettingsEnabled = this.globalSettingsEnabledCB.getValue()
			this.settingsManager
				.loadSubscription(globalSettingsEnabled, this.forceReloadGlobalSettings)
				.then((sub) => {
					this.subscription = sub
					p.done()
				}, this)
		}, this)
	}
	updateMenu() {
		this.htmlSubscriptionManager.update()
		getFilteringTypes().forEach((type) => {
			this.prepareFilteringList(type)
		})
		this.updateSettingsControls()
		// Additional sorting types
		$("#FFnS_AdditionalSortingTypes").empty()
		this.subscription.getAdditionalSortingTypes().forEach((s) => {
			var id = this.registerAdditionalSortingType()
			$id(id).val(s)
		})
		// coloring rules
		$("#FFnS_ColoringRules").empty()
		this.subscription
			.getColoringRules()
			.forEach(this.registerColoringRule, this)
		this.refreshColoringRuleArrows()
		this.updateSettingsModeTitle()
		this.updateFilteringKeywordMatchingSelects()
	}
	updateSettingsModeTitle() {
		var title = this.globalSettingsEnabledCB.getValue()
			? "Global"
			: "Subscription"
		title += " settings"
		$id("FFnS_settings_mode_title").text(title)
	}
	updateSettingsControls() {
		$id("FFnS_SettingsControls_SelectedSubscription").html(this.getImportOptionsHTML())
		var linkedSubContainer = $id("FFnS_SettingsControls_LinkedSubContainer")
		var linkedSub = $id("FFnS_SettingsControls_LinkedSub")
		if ((!this.globalSettingsEnabledCB.getValue() &&
			this.subscription.getURL() !==
			this.settingsManager.getActualSubscriptionURL()) ||
			(this.globalSettingsEnabledCB.getValue() &&
				!this.settingsManager.isGlobalMode())) {
			linkedSubContainer.css("display", "")
			linkedSub.text("Subscription currently linked to: " + this.subscription.getURL())
		}
		else {
			linkedSubContainer.css("display", "none")
			linkedSub.text("")
		}
	}
	getSettingsControlsSelectedSubscription() {
		return $id("FFnS_SettingsControls_SelectedSubscription").val()
	}
	initUI() {
		this.initSettingsMenu()
		this.initShowSettingsBtns()
		this.globalSettings.forEach((globalSetting) => {
			globalSetting.initUI()
		})
	}
	initSettingsMenu() {
		var marginElementClass = this.getHTMLId("margin_element")
		var tabsMenuId = this.getHTMLId("tabs_menu")
		var tabsContentContainerId = this.getHTMLId("tabs_content")
		var settingsHtml = bindMarkup(templates.settingsHTML, [
			{
				name: "SortingSelect",
				value: this.getSortingSelectHTML(this.getHTMLId(this.sortingSelectId)),
			},
			{
				name: "FilteringList.Type.FilteredOut",
				value: this.getFilteringListHTML(FilteringType.FilteredOut),
			},
			{
				name: "FilteringList.Type.RestrictedOn",
				value: this.getFilteringListHTML(FilteringType.RestrictedOn),
			},
			{
				name: "ImportMenu.SubscriptionOptions",
				value: this.getImportOptionsHTML(),
			},
			{ name: "closeIconLink", value: ext.closeIconLink },
			{ name: "plusIconLink", value: ext.plusIconLink },
			{ name: "eraseIconLink", value: ext.eraseIconLink },
			{
				name: "DefaultKeywordMatchingArea",
				value: this.getKeywordMatchingSelectHTML("multiple required", false),
			},
			{
				name: "KeywordMatchingMethod",
				value: this.getKeywordMatchingMethod(true),
			},
		])
		$("body").prepend(settingsHtml)
		// set up tabs
		$("#" + tabsMenuId + " a").click(function (event) {
			event.preventDefault()
			$(this).parent().addClass("current")
			$(this).parent().siblings().removeClass("current")
			var tab = $(this).attr("href")
			$("#" + tabsContentContainerId + " > div")
				.not(tab)
				.css("display", "none")
			$(tab).show()
			focusKeywordsInput()
		})
		$("#" + tabsContentContainerId + " > div")
			.first()
			.show()
		$(document).keyup((event) => {
			if (event.key === "Escape") {
				$id(this.settingsDivContainerId).hide()
			}
			this.checkKeywordsInputEnter(event)
		})
		$("#FFnS_settingsDivContainer").click((event) => {
			if (event.target.id === "FFnS_settingsDivContainer") {
				$id(this.settingsDivContainerId).hide()
			}
		})
	}
	checkKeywordsInputEnter(event) {
		if (event.key !== "Enter") {
			return
		}
		keywordInputs.forEach((e) => {
			const { input, type } = e
			if ($(input).is(":focus")) {
				this.addKeyword($(input), type)
			}
		})
	}
	getSortingSelectHTML(id) {
		return bindMarkup(templates.sortingSelectHTML, [
			{ name: "Id", value: id },
			{ name: "PopularityDesc", value: SortingType.PopularityDesc },
			{ name: "TitleAsc", value: SortingType.TitleAsc },
			{ name: "PopularityAsc", value: SortingType.PopularityAsc },
			{ name: "TitleDesc", value: SortingType.TitleDesc },
			{ name: "PublishDateNewFirst", value: SortingType.PublishDateNewFirst },
			{ name: "PublishDateOldFirst", value: SortingType.PublishDateOldFirst },
			{ name: "PublishDayNewFirst", value: SortingType.PublishDayNewFirst },
			{ name: "PublishDayOldFirst", value: SortingType.PublishDayOldFirst },
			{ name: "ReceivedDateNewFirst", value: SortingType.ReceivedDateNewFirst },
			{ name: "ReceivedDateOldFirst", value: SortingType.ReceivedDateOldFirst },
			{ name: "SourceAsc", value: SortingType.SourceAsc },
			{ name: "SourceDesc", value: SortingType.SourceDesc },
			{
				name: "SourceNewestReceiveDate",
				value: SortingType.SourceNewestReceiveDate,
			},
			{ name: "Random", value: SortingType.Random },
		])
	}
	getFilteringListHTML(type) {
		var ids = this.getIds(type)
		var filteringListHTML = bindMarkup(templates.filteringListHTML, [
			{ name: "FilteringTypeTabId", value: this.getFilteringTypeTabId(type) },
			{ name: "inputId", value: this.getHTMLId(ids.inputId) },
			{ name: "plusBtnId", value: this.getHTMLId(ids.plusBtnId) },
			{ name: "eraseBtnId", value: this.getHTMLId(ids.eraseBtnId) },
			{ name: "filetringKeywordsId", value: ids.filetringKeywordsId },
			{
				name: "FilteringKeywordMatchingArea",
				value: this.getKeywordMatchingSelectHTML("filtering", true, type),
			},
		])
		return filteringListHTML
	}
	getKeywordMatchingSelectHTML(attributes, includeDefaultOption, type, selectId) {
		var defaultOption = includeDefaultOption
			? bindMarkup(templates.emptyOptionHTML, [
				{ name: "value", value: "-- area (optional) --" },
			])
			: ""
		var filteringListHTML = bindMarkup(templates.keywordMatchingSelectHTML, [
			{
				name: "Id",
				value: selectId || this.getKeywordMatchingSelectId(true, type),
			},
			{ name: "attributes", value: attributes },
			{ name: "defaultOption", value: defaultOption },
			{ name: "selectFirst", value: includeDefaultOption ? "" : "selected" },
			{ name: "KeywordMatchingArea.Title", value: KeywordMatchingArea.Title },
			{ name: "KeywordMatchingArea.Body", value: KeywordMatchingArea.Body },
			{ name: "KeywordMatchingArea.Author", value: KeywordMatchingArea.Author },
		])
		return filteringListHTML
	}
	getKeywordMatchingSelectId(html, type) {
		var suffix = type == undefined ? "s" : "_" + FilteringType[type]
		var id = "KeywordMatchingArea" + suffix
		return html ? this.getHTMLId(id) : id
	}
	getKeywordMatchingMethod(fullSize, id) {
		id = id || "FFnS_KeywordMatchingMethod"
		return bindMarkup(templates.keywordMatchingMethodHTML, [
			{ name: "id", value: id },
			{
				name: "KeywordMatchingMethod.Simple",
				value: KeywordMatchingMethod.Simple,
			},
			{ name: "KeywordMatchingMethod.Word", value: KeywordMatchingMethod.Word },
			{
				name: "KeywordMatchingMethod.RegExp",
				value: KeywordMatchingMethod.RegExp,
			},
			{ name: "size", value: fullSize ? 'size="3"' : "" },
		])
	}
	getImportOptionsHTML() {
		var optionsHTML = ""
		var urls = this.settingsManager.getAllSubscriptionURLs()
		urls.forEach((url) => {
			optionsHTML += bindMarkup(templates.optionHTML, [
				{ name: "value", value: url },
			])
		})
		return optionsHTML
	}
	initShowSettingsBtns() {
		var this_ = this
		NodeCreationObserver.onCreation(ext.settingsBtnPredecessorSelector, (predecessor) => {
			if (currentPageNotSupported() ||
				$(predecessor).parent().find(".ShowSettingsBtn").length > 0) {
				return
			}
			var settingsBtn = $("<div>", {
				title: "Feedly filtering and sorting",
				style: "cursor: pointer;",
				class: "ShowSettingsBtn"
			})
			$(predecessor).after(settingsBtn)
			$(settingsBtn).click(function () {
				$id(this_.settingsDivContainerId).toggle()
				focusKeywordsInput()
			})
		})
	}
	registerSettings() {
		this.htmlSettingsElements.forEach((element) => {
			this.htmlSubscriptionManager.registerSettings(element.ids, element.type)
		})
		this.htmlSubscriptionManager.registerSettings([
			"Hours_AdvancedControlsReceivedPeriod",
			"Days_AdvancedControlsReceivedPeriod",
		], HTMLElementType.NumberInput, {
			update: (subscriptionSetting) => {
				var advancedControlsReceivedPeriod = subscriptionSetting.manager.subscription.getAdvancedControlsReceivedPeriod()
				var maxHours = advancedControlsReceivedPeriod.maxHours
				var advancedPeriodHours = maxHours % 24
				var advancedPeriodDays = Math.floor(maxHours / 24)
				if (subscriptionSetting.id.indexOf("Hours") != -1) {
					$id(subscriptionSetting.htmlId).val(advancedPeriodHours)
				}
				else {
					$id(subscriptionSetting.htmlId).val(advancedPeriodDays)
				}
			},
		})
		this.htmlSubscriptionManager.registerSelectBoxBoolean(ext.markAsReadAboveBelowReadId, (subscription) => {
			return subscription.isMarkAsReadAboveBelowRead()
		})
		this.htmlSubscriptionManager.registerSelectBoxBoolean("FilterLong_FilteringByReadingTime", (subscription) => {
			return subscription.getFilteringByReadingTime().filterLong
		})
	}
	initSettingsCallbacks() {
		this.htmlSubscriptionManager.setUpCallbacks()
		$id(this.closeBtnId).click(() => {
			$id(this.settingsDivContainerId).toggle()
		})
		let importSettings = $id("FFnS_ImportSettings")
		importSettings.change(() => {
			this.settingsManager.importAllSettings(importSettings.prop("files")[0])
		})
		$id("FFnS_ExportSettings").click(() => {
			this.settingsManager.exportAllSettings()
		})
		$id("FFnS_SettingsControls_ImportFromOtherSub").click(() => {
			this.importFromOtherSub()
		})
		$id("FFnS_SettingsControls_LinkToSub").click(() => {
			this.linkToSub()
		})
		$id("FFnS_SettingsControls_UnlinkFromSub").click(() => {
			this.unlinkFromSub()
		})
		$id("FFnS_SettingsControls_DeleteSub").click(() => {
			this.deleteSub()
		})
		$id("FFnS_AddSortingType").click(() => {
			var id = this.registerAdditionalSortingType()
			this.subscription.addAdditionalSortingType($id(id).val())
			this.refreshFilteringAndSorting()
		})
		$id("FFnS_EraseSortingTypes").click(() => {
			this.subscription.setAdditionalSortingTypes([])
			$("#FFnS_AdditionalSortingTypes").empty()
			this.refreshFilteringAndSorting()
		})
		onClick($id("FFnS_AddColoringRule"), () => {
			let cr = new ColoringRule()
			this.registerColoringRule(cr)
			this.subscription.addColoringRule(cr)
			this.articleManager.refreshColoring()
			this.refreshColoringRuleArrows()
		})
		onClick($id("FFnS_EraseColoringRules"), () => {
			this.subscription.setColoringRules([])
			$id("FFnS_ColoringRules").empty()
			this.articleManager.refreshColoring()
		})
		this.setUpFilteringListEvents()
		$id("FFnS_AlwaysUseDefaultMatchingAreas").change(this.updateFilteringKeywordMatchingSelects)
	}
	updateFilteringKeywordMatchingSelects() {
		var selects = $(".FFnS_keywordMatchingSelect[filtering]")
		if (isChecked($($id("FFnS_AlwaysUseDefaultMatchingAreas")))) {
			selects.hide()
		}
		else {
			selects.show()
		}
	}
	postInit() {
		let syncManager = DataStore.getSyncStorageManager()
		let syncCBId = "FFnS_syncSettingsEnabled"
		if (syncManager) {
			setChecked(syncCBId, syncManager.isSyncEnabled())
			$id(syncCBId).change(() => {
				syncManager.setSyncEnabled(isChecked($id(syncCBId)))
				this.forceReloadGlobalSettings = true
				this.resetGlobalSettings(this.globalSettings.slice(0)).then(() => {
					this.refreshPage()
					this.forceReloadGlobalSettings = false
				}, this)
			})
		}
		else {
			$id(syncCBId).closest(".setting_group").remove()
		}
		const forceRefreshArticlesBtn = $("<button>", {
			id: ext.forceRefreshArticlesId,
			style: "display: none;",
		})
		$("body").append(forceRefreshArticlesBtn)
		forceRefreshArticlesBtn.click((e) => {
			e.preventDefault()
			this.articleManager.refreshArticles()
		})
		onClick($(".icon-fx-light-mode-md-black, .icon-fx-dark-mode-md-black"), () => {
			setTimeout(() => this.articleManager.refreshColoring(), 100)
		})
	}
	registerAdditionalSortingType() {
		var id = this.getHTMLId("AdditionalSortingType_" + this.idCount++)
		$("#FFnS_AdditionalSortingTypes").append(this.getSortingSelectHTML(id))
		$id(id).change(() => this.updateAdditionalSortingTypes())
		return id
	}
	registerColoringRule(cr) {
		var ids = new ColoringRuleHTMLIds(this.getHTMLId("ColoringRule_" + this.idCount++))
		let self = this
		// append template
		let html = bindMarkup(templates.coloringRuleHTML, [
			{ name: "Id", value: ids.id },
			{ name: "Color", value: cr.color },
			{ name: "SpecificKeywords", value: ColoringRuleSource.SpecificKeywords },
			{ name: "SourceTitle", value: ColoringRuleSource.SourceTitle },
			{
				name: "RestrictingKeywords",
				value: ColoringRuleSource.RestrictingKeywords,
			},
			{
				name: "FilteringKeywords",
				value: ColoringRuleSource.FilteringKeywords,
			},
			{
				name: "KeywordMatchingMethod",
				value: this.getKeywordMatchingMethod(false, ids.id + "_KeywordMatchingMethod"),
			},
			{
				name: "KeywordMatchingArea",
				value: this.getKeywordMatchingSelectHTML("required", false, null, ids.id + "_KeywordMatchingArea"),
			},
			{ name: "plusIconLink", value: ext.plusIconLink },
			{ name: "eraseIconLink", value: ext.eraseIconLink },
			{ name: "moveUpIconLink", value: ext.moveUpIconLink },
			{ name: "moveDownIconLink", value: ext.moveDownIconLink },
		])
		$("#FFnS_ColoringRules").append(html)
		// set current values
		setChecked(ids.highlightId, cr.highlightAllTitle)
		$id(ids.sourceId).val(cr.source)
		$id(ids.matchingMethodId).val(cr.matchingMethod)
		$id(ids.matchingAreaId).val(cr.matchingArea)
		this.refreshColoringRuleSpecificKeywords(cr, ids)
		let refreshVisibility = () => {
			$id(ids.keywordGroupId).css("display", cr.source == ColoringRuleSource.SpecificKeywords ? "" : "none")
			let sourceTitle = cr.source == ColoringRuleSource.SourceTitle
			$id(ids.matchingMethodContainerId).css("display", sourceTitle ? "none" : "")
			$id(ids.matchingAreaContainerId).css("display", sourceTitle ? "none" : "")
			$id(ids.optionsSpanId).css("display", sourceTitle ? "none" : "")
			$id(ids.sourceTitleInfosId).css("display", sourceTitle ? "" : "none")
		}
		new jscolor($id(ids.colorId)[0])
		refreshVisibility()
		// change callbacks
		function onChange(id, cb, input, click, onchange) {
			function callback() {
				try {
					let noChange = cb.call(this)
					if (noChange) {
						return
					}
					self.subscription.save()
					self.articleManager.refreshColoring()
					refreshVisibility()
				}
				catch (e) {
					console.log(e)
				}
			}
			click
				? onClick($id(id), callback)
				: input
					? ($id(id)[0].oninput = callback)
					: $id(id).change(callback)
			if (onchange) {
				$id(id)[0].onchange = callback
			}
		}
		onChange(ids.highlightId, function () {
			cr.highlightAllTitle = isChecked($(this))
		})
		onChange(ids.sourceId, function () {
			cr.source = Number($(this).val())
		})
		onChange(ids.matchingMethodId, function () {
			cr.matchingMethod = Number($(this).val())
		})
		onChange(ids.matchingAreaId, function () {
			cr.matchingArea = Number($(this).val())
		})
		onChange(ids.colorId, function () {
			let str = $(this).val()
			if (str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
				cr.color = str.toUpperCase()
			}
			else {
				$(this).val(str)
				return true
			}
		}, true, false, true)
		onChange(ids.addBtnId, () => {
			let keyword = $id(ids.keywordInputId).val()
			if (keyword != null && keyword !== "") {
				cr.specificKeywords.push(keyword)
			}
			$id(ids.keywordInputId).val("")
			this.refreshColoringRuleSpecificKeywords(cr, ids)
		}, false, true)
		onChange(ids.eraseBtnId, () => {
			cr.specificKeywords = []
			$id(ids.keywordContainerId).empty()
		}, false, true)
		// Coloring rule management
		onClick($id(ids.removeColoringRuleId), () => {
			let rules = self.subscription.getColoringRules()
			let i = rules.indexOf(cr)
			if (i > -1) {
				rules.splice(i, 1)
				self.subscription.save()
				self.articleManager.refreshColoring()
			}
			$id(ids.id).remove()
			self.refreshColoringRuleArrows()
		})
		let getMoveColoringRuleCallback = (up) => {
			return () => {
				let rules = self.subscription.getColoringRules()
				let i = rules.indexOf(cr)
				if (up ? i > 0 : i < rules.length) {
					let swapIdx = up ? i - 1 : i + 1
					let swap = rules[swapIdx]
					rules[swapIdx] = rules[i]
					rules[i] = swap
					self.subscription.save()
					self.articleManager.refreshColoring()
					let element = $id(ids.id)
					if (up) {
						let prev = element.prev()
						element.detach().insertBefore(prev)
					}
					else {
						let next = element.next()
						element.detach().insertAfter(next)
					}
					self.refreshColoringRuleArrows()
				}
			}
		}
		onClick($id(ids.moveUpColoringRuleId), getMoveColoringRuleCallback(true))
		onClick($id(ids.moveDownColoringRuleId), getMoveColoringRuleCallback(false))
	}
	refreshColoringRuleArrows() {
		$(".FFnS_MoveUpColoringRule").not(":first").show()
		$(".FFnS_MoveUpColoringRule:first").hide()
		$(".FFnS_MoveDownColoringRule").not(":last").show()
		$(".FFnS_MoveDownColoringRule:last").hide()
	}
	refreshColoringRuleSpecificKeywords(cr, ids) {
		var keywords = cr.specificKeywords
		var html = ""
		for (var i = 0; i < keywords.length; i++) {
			var keyword = keywords[i]
			var keywordId = this.getKeywordId(ids.id, keyword)
			var keywordHTML = bindMarkup(templates.keywordHTML, [
				{ name: "keywordId", value: keywordId },
				{ name: "keyword", value: keyword },
			])
			html += keywordHTML
		}
		$id(ids.keywordContainerId).html(html)
	}
	setUpFilteringListEvents() {
		getFilteringTypes().forEach(this.setUpFilteringListManagementEvents, this)
	}
	setUpFilteringListManagementEvents(type) {
		var ids = this.getIds(type)
		// Add button
		$id(this.getHTMLId(ids.plusBtnId)).click(() => {
			var input = $id(this.getHTMLId(ids.inputId))
			this.addKeyword(input, type)
		})
		// Erase all button
		$id(this.getHTMLId(ids.eraseBtnId)).click(() => {
			if (confirm("Erase all the keywords of this list ?")) {
				this.subscription.resetFilteringList(type)
				this.updateFilteringList(type)
			}
		})
	}
	addKeyword(input, type) {
		var keyword = input.val()
		if (keyword != null && keyword !== "") {
			var area = $id(this.getKeywordMatchingSelectId(true, type)).val()
			if (area.length > 0) {
				keyword = this.keywordManager.insertArea(keyword, area)
			}
			this.subscription.addKeyword(keyword, type)
			this.updateFilteringList(type)
			input.val("")
		}
	}
	setUpKeywordButtonsEvents(type) {
		var ids = this.getIds(type)
		var keywordList = this.subscription.getFilteringList(type)
		// Keyword buttons events
		var t = this
		for (var i = 0; i < keywordList.length; i++) {
			var keywordId = this.getKeywordId(ids.typeId, keywordList[i])
			$id(keywordId).click(function () {
				var keyword = $(this).text()
				if (confirm("Delete the keyword ?")) {
					t.subscription.removeKeyword(keyword, type)
					t.updateFilteringList(type)
				}
			})
		}
	}
	updateFilteringList(type) {
		this.prepareFilteringList(type)
		this.refreshFilteringAndSorting()
	}
	prepareFilteringList(type) {
		var ids = this.getIds(type)
		var filteringList = this.subscription.getFilteringList(type)
		var filteringKeywordsHTML = ""
		for (var i = 0; i < filteringList.length; i++) {
			var keyword = filteringList[i]
			var keywordId = this.getKeywordId(ids.typeId, keyword)
			var filteringKeywordHTML = bindMarkup(templates.keywordHTML, [
				{ name: "keywordId", value: keywordId },
				{ name: "keyword", value: keyword },
			])
			filteringKeywordsHTML += filteringKeywordHTML
		}
		$id(ids.filetringKeywordsId).html(filteringKeywordsHTML)
		this.setUpKeywordButtonsEvents(type)
	}
	updateAdditionalSortingTypes() {
		var additionalSortingTypes = []
		$("#FFnS_AdditionalSortingTypes > select").each((i, e) => {
			additionalSortingTypes.push($(e).val())
		})
		this.subscription.setAdditionalSortingTypes(additionalSortingTypes)
		this.refreshFilteringAndSorting()
	}
	addArticle(article) {
		if (currentPageNotSupported()) {
			return
		}
		try {
			this.articleManager.addNewArticle(article)
			const callback = this.readArticlesMutationCallback(article)
			var articleObserver = new MutationObserver(callback)
			articleObserver.observe(article, { attributes: true })
			callback([], articleObserver)
		}
		catch (err) {
			console.log(err)
		}
	}
	readArticlesMutationCallback(article) {
		return (mr, observer) => {
			let readClassElement = !$(article).hasClass(ext.inlineViewClass)
				? $(article)
				: $(article).closest(ext.articleViewEntryContainerSelector)
			if (readClassElement.hasClass(ext.readArticleClass) &&
				!$(article).hasClass(ext.inlineViewClass)) {
				if (this.subscription.isHideAfterRead()) {
					if (this.subscription.isReplaceHiddenWithGap()) {
						$(article).attr("gap-article", "true")
					}
					else {
						$(article).remove()
					}
				}
				observer.disconnect()
			}
		}
	}
	addSection(section) {
		if (currentPageNotSupported()) {
			return
		}
		if (section.id === "section0") {
			$(section).find("h2").text(" ")
		}
		else {
			$(section).remove()
		}
	}
	importFromOtherSub() {
		var selectedURL = this.getSettingsControlsSelectedSubscription()
		if (selectedURL &&
			confirm("Import settings from the subscription url /" + selectedURL + " ?")) {
			this.settingsManager
				.importSubscription(selectedURL)
				.then(this.refreshPage, this)
		}
	}
	linkToSub() {
		var selectedURL = this.getSettingsControlsSelectedSubscription()
		if (selectedURL &&
			confirm("Link current subscription to: /" + selectedURL + " ?")) {
			this.settingsManager.linkToSubscription(selectedURL)
			this.refreshPage()
		}
	}
	unlinkFromSub() {
		if (confirm("Unlink current subscription ?")) {
			this.settingsManager.deleteSubscription(this.settingsManager.getActualSubscriptionURL())
			this.refreshPage()
		}
	}
	deleteSub() {
		var selectedURL = this.getSettingsControlsSelectedSubscription()
		if (selectedURL && confirm("Delete : /" + selectedURL + " ?")) {
			this.settingsManager.deleteSubscription(selectedURL)
			this.refreshPage()
		}
	}
	getHTMLId(id) {
		return "FFnS_" + id
	}
	getKeywordId(keywordListId, keyword) {
		if (!(keyword in this.keywordToId)) {
			var id = this.idCount++
			this.keywordToId[keyword] = id
		}
		return this.getHTMLId(keywordListId + "_" + this.keywordToId[keyword])
	}
	getFilteringTypeTabId(filteringType) {
		return this.getHTMLId("Tab_" + FilteringType[filteringType])
	}
	getIds(type) {
		var id = getFilteringTypeId(type)
		return {
			typeId: "Keywords_" + id,
			inputId: "Input_" + id,
			plusBtnId: "Add_" + id,
			eraseBtnId: "DeleteAll_" + id,
			filetringKeywordsId: "FiletringKeywords_" + id,
		}
	}
}
class ColoringRuleHTMLIds {
	constructor(id) {
		this.id = id
		this.highlightId = id + " .FFnS_HighlightAllTitle"
		this.colorId = id + " .FFnS_SpecificColor"
		this.sourceId = id + " .FFnS_ColoringRule_Source"
		this.matchingMethodId = id + " .FFnS_KeywordMatchingMethod"
		this.matchingMethodContainerId =
			id + " .FFnS_ColoringRule_MatchingMethodGroup"
		this.matchingAreaId = id + " .FFnS_keywordMatchingSelect"
		this.matchingAreaContainerId = id + " .FFnS_ColoringRule_MatchingAreaGroup"
		this.keywordInputId = id + " .FFnS_ColoringRule_KeywordInput"
		this.addBtnId = id + " .FFnS_ColoringRule_AddKeyword"
		this.eraseBtnId = id + " .FFnS_ColoringRule_EraseKeywords"
		this.keywordContainerId = id + " .FFnS_ColoringRuleKeywords"
		this.keywordGroupId = id + " .FFnS_ColoringRule_KeywordsGroup"
		this.specificColorGroupId = id + " .FFnS_SpecificColorGroup"
		this.optionsSpanId = id + " .FFnS_ColoringRule_Options"
		this.sourceTitleInfosId = id + " .FFnS_ColoringRule_SourceTitleInfos"
		this.removeColoringRuleId = id + " .FFnS_RemoveColoringRule"
		this.moveUpColoringRuleId = id + " .FFnS_MoveUpColoringRule"
		this.moveDownColoringRuleId = id + " .FFnS_MoveDownColoringRule"
	}
}
const keywordInputs = [
	{ input: "#FFnS_Input_FilteredOut", type: FilteringType.FilteredOut },
	{ input: "#FFnS_Input_RestrictedOn", type: FilteringType.RestrictedOn },
]
const focusKeywordsInputSelector = keywordInputs
	.map((e) => e.input + ":visible")
	.join(",")
function focusKeywordsInput() {
	$(focusKeywordsInputSelector).focus().val("")
}

class HTMLSubscriptionManager {
	constructor(manager) {
		this.subscriptionSettings = []
		this.configByElementType = {}
		this.manager = manager
		this.configByElementType[HTMLElementType.SelectBox] = {
			setUpChangeCallback: subscriptionSetting => {
				$id(subscriptionSetting.htmlId).change(this.getChangeCallback(subscriptionSetting))
			},
			getHTMLValue: subscriptionSetting => {
				return $id(subscriptionSetting.htmlId).val()
			},
			update: subscriptionSetting => {
				var value = this.manager.subscription["get" + subscriptionSetting.id]()
				$id(subscriptionSetting.htmlId).val(value)
			}
		}
		this.configByElementType[HTMLElementType.CheckBox] = {
			setUpChangeCallback: subscriptionSetting => {
				$id(subscriptionSetting.htmlId).change(this.getChangeCallback(subscriptionSetting))
			},
			getHTMLValue: subscriptionSetting => {
				return isChecked($id(subscriptionSetting.htmlId))
			},
			update: subscriptionSetting => {
				var value = this.manager.subscription["is" + subscriptionSetting.id]()
				setChecked(subscriptionSetting.htmlId, value)
			}
		}
		this.configByElementType[HTMLElementType.NumberInput] = {
			setUpChangeCallback: subscriptionSetting => {
				var callback = this.getChangeCallback(subscriptionSetting)
				$id(subscriptionSetting.htmlId)[0].oninput = ev => {
					callback()
				}
			},
			getHTMLValue: subscriptionSetting => {
				return Number($id(subscriptionSetting.htmlId).val())
			},
			update: this.configByElementType[HTMLElementType.SelectBox].update
		}
		this.configByElementType[HTMLElementType.ColorInput] = {
			setUpChangeCallback: subscriptionSetting => {
				var callback = this.getChangeCallback(subscriptionSetting)
				const e = $id(subscriptionSetting.htmlId)[0]
				e.oninput = ev => {
					callback()
				}
				e.onchange = e.oninput
			},
			getHTMLValue: this.configByElementType[HTMLElementType.SelectBox]
				.getHTMLValue,
			update: subscriptionSetting => {
				var value = this.manager.subscription["get" + subscriptionSetting.id]()
				const jq = $id(subscriptionSetting.htmlId)
				jq.val(value)
				if (!subscriptionSetting["jscolor"]) {
					subscriptionSetting["jscolor"] = true
					new jscolor(jq[0])
				}
			}
		}
	}
	getChangeCallback(setting) {
		return function () {
			try {
				var val = setting.config.getHTMLValue(setting)
				if (val == null) {
					return
				}
				setting.manager.subscription["set" + setting.id](val)
				setting.manager.refreshFilteringAndSorting()
			}
			catch (e) {
				console.log(e)
			}
		}
	}
	registerSettings(ids, type, subscriptionSettingConfig) {
		this.addSettings(ids, this.configByElementType[type], subscriptionSettingConfig)
	}
	registerSelectBoxBoolean(id, getValueCallback) {
		this.registerSettings([id], HTMLElementType.SelectBox, {
			update: (subscriptionSetting) => {
				$id(subscriptionSetting.htmlId).val(getValueCallback(subscriptionSetting.manager.subscription) + "")
			},
			getHTMLValue: subscriptionSetting => {
				return $id(subscriptionSetting.htmlId).val() === "true"
			}
		})
	}
	addSettings(ids, config, subscriptionSettingConfig) {
		ids.forEach(id => {
			var setting = new HTMLSubscriptionSetting(this.manager, id, config, subscriptionSettingConfig)
			this.subscriptionSettings.push(setting)
		})
	}
	setUpCallbacks() {
		this.subscriptionSettings.forEach(subscriptionSetting => {
			subscriptionSetting.setUpCallbacks()
		})
	}
	update() {
		this.subscriptionSettings.forEach(subscriptionSetting => {
			subscriptionSetting.update()
		})
	}
}
class HTMLSubscriptionSetting {
	constructor(manager, id, config, subscriptionSettingConfig) {
		this.manager = manager
		this.id = id
		this.htmlId = manager.getHTMLId(id)
		var getHTMLValue, update
		if (subscriptionSettingConfig != null) {
			getHTMLValue = subscriptionSettingConfig.getHTMLValue
			update = subscriptionSettingConfig.update
		}
		getHTMLValue = getHTMLValue == null ? config.getHTMLValue : getHTMLValue
		update = update == null ? config.update : update
		this.config = {
			setUpChangeCallback: config.setUpChangeCallback,
			getHTMLValue: getHTMLValue,
			update: update
		}
	}
	update() {
		this.config.update(this)
	}
	setUpCallbacks() {
		this.config.setUpChangeCallback(this)
	}
}

class HTMLGlobalSettings {
	constructor(id, defaultValue, uiManager, fullRefreshOnChange = false, sessionStore = true) {
		this.id = id
		this.defaultValue = defaultValue
		this.isBoolean = typeof defaultValue === "boolean"
		this.uiManager = uiManager
		this.htmlId = uiManager.getHTMLId(id)
		this.fullRefreshOnChange = fullRefreshOnChange
		this.sessionStoreEnabled = sessionStore
	}
	init() {
		return this.load()
	}
	load() {
		return new AsyncResult(p => {
			DataStore.getAsync(this.id, this.defaultValue).then(value => {
				this.setValue(value)
				p.done()
			}, this)
		}, this)
	}
	reset() {
		return new AsyncResult(p => {
			this.load().then(() => {
				this.refreshHTMLValue()
				p.done()
			}, this)
		}, this)
	}
	getValue() {
		return this.value
	}
	setValue(value) {
		this.value = value
		this.sessionStore()
	}
	refreshValue(value) {
		this.setValue(value)
		this.save()
		this.refreshHTMLValue()
	}
	setAdditionalChangeCallback(additionalChangeCallback) {
		this.additionalChangeCallback = additionalChangeCallback
	}
	save() {
		DataStore.put(this.id, this.value)
	}
	sessionStore() {
		if (this.sessionStoreEnabled) {
			this.uiManager.page.put(this.id, this.value, true)
		}
	}
	getHTMLValue(e) {
		if (this.isBoolean) {
			return isChecked(e)
		}
		else {
			return Number(e.val())
		}
	}
	refreshHTMLValue() {
		if (this.isBoolean) {
			setChecked(this.htmlId, this.value)
		}
		else {
			return $id(this.htmlId).val(this.value)
		}
	}
	initUI() {
		var this_ = this
		let additionalCallback = () => {
			if (this.additionalChangeCallback) {
				this.additionalChangeCallback.call(this, this_.value)
			}
		}
		function changeCallback() {
			let val = this_.getHTMLValue($(this))
			this_.setValue(val)
			this_.save()
			if (this_.fullRefreshOnChange) {
				this_.uiManager.refreshPage()
			}
			additionalCallback()
		}
		if (this.isBoolean) {
			$id(this.htmlId).click(changeCallback)
		}
		else {
			$id(this.htmlId)[0].oninput = changeCallback
		}
		this.refreshHTMLValue()
		additionalCallback()
	}
}

var debugEnabled = localStorage.getItem("debug_enabled") === "true"
function enableDebug(enabled = true) {
	localStorage.setItem("debug_enabled", "" + enabled)
}
function initResources() {
	INITIALIZER.loadScript("jquery.min.js")
	INITIALIZER.loadScript("node-creation-observer.js")
	let urls = INITIALIZER.getResourceURLs()
	ext.plusIconLink = urls.plusIconURL
	ext.eraseIconLink = urls.eraseIconURL
	ext.closeIconLink = urls.closeIconURL
	ext.moveUpIconLink = urls.moveUpIconURL
	ext.moveDownIconLink = urls.moveDownIconURL
	templates.styleCSS = bindMarkup(templates.styleCSS, [
		{ name: "open-in-new-tab-url", value: urls.openInNewTabURL },
		{ name: "disable-all-filters-url", value: urls.clearFiltersURL },
		{ name: "extension-icon", value: urls.extensionIconURL },
	])
	injectStyleText(templates.styleCSS)
}
$(document).ready(function () {
	try {
		initResources()
		var uiManager = new UIManager()
		var uiManagerBind = callbackBindedTo(uiManager)
		NodeCreationObserver.onCreation(ext.subscriptionChangeSelector, function () {
			console.log("Feedly page fully loaded")
			uiManager.init().then(() => {
				NodeCreationObserver.onCreation(ext.articleSelector, uiManagerBind(uiManager.addArticle))
				NodeCreationObserver.onCreation(ext.sectionSelector, uiManagerBind(uiManager.addSection))
				NodeCreationObserver.onCreation(ext.subscriptionChangeSelector, uiManagerBind(uiManager.updatePage))
			}, this)
		}, true)
	}
	catch (e) {
		console.log(e)
	}
})
