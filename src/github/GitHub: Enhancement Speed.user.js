// ==UserScript==
// @name         Github: Enhancement Speed
// @version      2.5.2
// @author       X.I.U
// @description  High-speed download of Git Clone/SSH, Release, Raw, Code(ZIP) and other files (Based on public welfare), project list file quick download (☁)
// @match        *://github.com/*
// @match        *://hub.fgit.cf/*
// @match        *://githubfast.com/*
// @match        *://hub.fgit.mxtrans.net/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace   https://egore.url.lol/userscripts
// @supportURL   https://github.com/XIU2/UserScript
// @homepageURL  https://github.com/XIU2/UserScript
// ==/UserScript==


(function () {
	'use strict'
	var backColor = '#ffffff', fontColor = '#888888', menu_rawFast = GM_getValue('xiu2_menu_raw_fast'), menu_rawFast_ID, menu_rawDownLink_ID, menu_gitClone_ID, menu_feedBack_ID
	const download_url_us = [
		['https://gh.h233.eu.org/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [@X.I.U/XIU2] supply'],
		['https://gh.api.99988866.xyz/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [hunshcn/gh-proxy] supply'], // There are too many people who use the official demonstration station
		['https://gh.ddlc.top/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [@mtr-static-official] supply'],
		//['https://gh2.yanqishui.work/https://github.com', '美国', '[USA Cloudflare CDN] - The source of public welfare acceleration [@HongjieCN] supply'], // Error 1101
		['https://dl.ghpig.top/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [feizhuqwq.com] supply'],
		['https://dl-slb.ghpig.top/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [feizhuqwq.com] supply'],
		//['https://gh-proxy-misakano7545.koyeb.app/https://github.com', '美国', '[美国 Cloudflare CDN]'], // 404
		//['https://gh.flyinbug.top/gh/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [Mintimate] 提供'], // Domain Name No Analysis
		//['https://github.91chi.fun/https://github.com', '美国', '[美国 Cloudflare CDN]'], // 连接超时
		['https://slink.ltd/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [I know the small station] supply'],
		['https://git.xfj0.cn/https://github.com', 'USA', '[USA Cloudflare CDN]'],
		['https://gh.con.sh/https://github.com', 'USA', '[USA Cloudflare CDN]'],
		['https://ghps.cc/https://github.com', 'USA', '[USA Cloudflare CDN]'],
		['https://cors.isteed.cc/github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [Lufs\'s] supply'],
		['https://hub.gitmirror.com/https://github.com', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [GitMirror] supply'],
		//['https://cdn.githubjs.cf', '美国', '[美国 Cloudflare CDN]'], // 域名无解析
		['https://download.fgit.cf', 'USA', '[USA Los Angeles] - The source of public welfare acceleration [FastGit Group member] supply'],
		['https://download.nuaa.cf', 'USA', '[USA Los Angeles] - The source of public welfare acceleration [LibraryCloud] supply'],
		['https://download.njuu.cf', 'USA', '[USA Las Vegas] - The source of public welfare acceleration [LibraryCloud] supply'],
		['https://download.yzuu.cf', 'USA', '[USA Cloudflare CDN] - The source of public welfare acceleration [LibraryCloud] supply']
	], download_url = [
		//['https://download.fastgit.org', '德国', '[德国] - 该公益加速源由 [FastGit] 提供&#10;&#10;提示：希望大家尽量多使用前面的美国节点（每次随机 4 个来负载均衡），&#10;避免流量都集中到亚洲公益节点，减少成本压力，公益才能更持久~', 'https://archive.fastgit.org'], // Certificate
		['https://mirror.ghproxy.com/https://github.com', 'South Korea', '[japan,SouthKorea,Germany,Etc] (CDN Not fixed) - The source of public welfare acceleration [ghproxy] supply&#10;&#10;Tip: I hope you can use the previous American nodes as much as possible (random each time Load balancing),&#10;Avoid flow to the Asian public welfare node and reduce cost pressure, so that public welfare can be more long -lasting~'],
		//['https://gh-proxy.com/https://github.com', '韩国', '[韩国] - 该公益加速源由 [ghproxy] 提供&#10;&#10;提示：希望大家尽量多使用前面的美国节点（每次随机 负载均衡），&#10;避免流量都集中到亚洲公益节点，减少成本压力，公益才能更持久~'],
		['https://ghproxy.net/https://github.com', 'Japan', '[Japan Osaka] - The source of public welfare acceleration [ghpLoad balancing),supply&#10;&#10;Tip: I hope you can use the previous American nodes as much as possible (random each time Load balancing),&#10;Avoid flow to the Asian public welfare node and reduce cost pressure, so that public welfare can be more long -lasting~']
	], clone_url = [
		['https://gitclone.com', 'domestic', '[China domestic] - 该公益加速源由 [GitClone] 提供&#10;&#10; - 缓存：有&#10; - 首次比较慢，缓存后较快'],
		['https://mirror.ghproxy.com/https://github.com', '韩国', '[日本、韩国、德国等] (CDN 不固定） - 该公益加速源由 [ghproxy] 提供&#10;&#10; - 缓存：无（或时间很短）'],
		//['https://gh-proxy.com/https://github.com', '韩国', '[韩国] - 该公益加速源由 [ghproxy] 提供&#10;&#10; - 缓存：无（或时间很短）'],
		['https://githubfast.com', 'South Korea', '[South Korea] - The source of public welfare acceleration [Github Fast] supply&#10;&#10; - Cache: None (or short time)'],
		['https://ghproxy.net/https://github.com', 'Japan', '[Japan Osaka] - The source of public welfare acceleration [ghproxy] supply&#10;&#10; - Cache: None (or short time)'],
		['https://github.moeyy.xyz/https://github.com', 'SingaporSingapore, Hong Kong, Japan, etc.Hong Kong, Japan, etc.] (CDN Not the source of public welfare Acceleration public welfare acceleration source [Moeyy] supply&#10;&#10; - Cache: None (or short time)'],
		['https://hub.fgit.mxtrans.net', 'Singapore', '[Singapore] - The source of public welfare acceleration [FastGit Group member] supply&#10;&#10; - Cache: None (or short time)']
		//['https://slink.ltd/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [知了小站] 提供'] // 暂无必要
		//['https://hub.gitmirror.com/https://github.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [GitMirror] 提供'], // 暂无必要
		//['https://hub.fgit.cf', '美国', '[美国 洛杉矶] - 该公益加速源由 [FastGit 群组成员] 提供'],
		//['https://hub.nuaa.cf', '美国', '[美国 洛杉矶] - 该公益加速源由 [LibraryCloud] 提供'],
		//['https://hub.njuu.cf', '美国', '[美国 拉斯维加斯] - 该公益加速源由 [LibraryCloud] 提供']
		//['https://hub.yzuu.cf', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [LibraryCloud] 提供'], // 暂无必要
		//['https://hub.0z.gs', '美国', '[美国 Cloudflare CDN]'], // 域名无解析
		//['https://hub.shutcm.cf', '美国', '[美国 Cloudflare CDN]'] // 连接超时
	], clone_ssh_url = [
		['ssh://git@ssh.github.com:443/', 'Github Native', '[Japan, Singapore, etc.] - Github Official 443 Port Ssh (still SSH Protocol), suitable for restriction access 22 The network environment of the port'],
		['git@ssh.fastgit.org:', 'Hongkong', '[China Hong Kong] - The source of public welfare acceleration [FastGit] supply']
		//['git@git.zhlh6.cn:', 'USA', '[USA Los Angeles]'] // Bye
	], raw_url = [
		['https://raw.githubusercontent.com', 'Github Native', '[Japan Tokyo]'],
		//['https://raw.iqiq.io', '香港', '[中国 香港] - 该公益加速源由 [iQDNS/iQZone] 提供&#10;&#10; - 缓存：无（或时间很短）'], // 超时
		['https://mirror.ghproxy.com/https://raw.githubusercontent.com', 'South Korea', '[Japan, South Korea, Germany, etc.] (CDN Not fixed) - The source of public welfare acceleration [ghproxy] supply&#10;&#10; - Cache: None (or short time)'],
		//['https://gh-proxy.com/https://raw.githubusercontent.com', '韩国 2', '[韩国] - 该公益加速源由 [ghproxy] 提供&#10;&#10; - 缓存：无（或时间很短）'],
		['https://ghproxy.net/https://raw.githubusercontent.com', 'Japan 1', '[Japan Osaka] - The source of public welfare acceleration [ghproxy] supply&#10;&#10; - Cache: None (or short time)'],
		['https://fastly.jsdelivr.net/gh', 'Japan 2', '[Japan Tokyo] - The source of public welfare acceleration [JSDelivr CDN] supply&#10;&#10; - Cache: Yes&#10; - Do not support the size exceeding 50 MB document&#10; - The branch name of the version number format is not supported (such as v1.2.3)'],
		['https://raw.fgit.mxtrans.net', 'Singapore', '[Singapore] - The source of public welfare acceleration [FastGit Group member] supply&#10;&#10; - Cache: None (or short time)'],
		['https://gcore.jsdelivr.net/gh', 'other 1', '[Mobile walk in Hong Kong, Telecom to Japan] - The source of public welfare acceleration [JSDelivr CDN] supply&#10;&#10; - Cache: Yes&#10; - Do not support the size exceeding 50 MB document&#10; - The branch name of the version number format is not supported (such as v1.2.3)'],
		//['https://cdn.jsdelivr.ren/gh', '其他 1', '[新加坡、香港、日本等]（CDN 不固定） - 该公益加速源由 [ayao] 提供&#10;&#10; - 缓存：有'], // 域名无解析
		['https://jsdelivr.b-cdn.net/gh', 'other 2', '[Hong Kong, Taiwan, Japan, Singapore, etc.] (CDN Not fixed) - The source of public welfare acceleration [rttwyjz] supply&#10;&#10; - Cache: Yes'], // 500
		['https://github.moeyy.xyz/https://raw.githubusercontent.com', 'other 3', '[Singapore, Hong Kong, Japan, etc.] (CDN is not fixed)&#10;&#10; - Cache: None (or short time)'],
		['https://raw.fgit.cf', 'USA', '[USA Los Angeles] - The source of public welfare acceleration [FastGit Group member] supply&#10;&#10; - Cache: None (or short time)']
		//['https://raw.nuaa.cf', '美国', '[美国 洛杉矶] - 该公益加速源由 [LibraryCloud] 提供'], // 暂无必要
		//['https://raw.fastgit.org', '德国', '[德国] - 该公益加速源由 [FastGit] 提供&#10;&#10; - 缓存：无（或时间很短）'], // 挂了
		//['https://raw.njuu.cf', '美国', '[美国 拉斯维加斯] - 该公益加速源由 [LibraryCloud] 提供&#10;&#10; - 缓存：无（或时间很短）'], // 暂无必要
		//['https://raw.gitmirror.com', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [GitMirror] 提供&#10;&#10; - 缓存：有'], // 暂无必要
		//['https://cdn.54188.cf/gh', '美国', '[美国 Cloudflare CDN] - 该公益加速源由 [PencilNavigator] 提供&#10;&#10; - 缓存：有'], // 暂无必要
		//['https://git.yumenaka.net/https://raw.githubusercontent.com', '美国', '[美国 圣何塞]&#10;&#10; - 缓存：无（或时间很短）'], // 连接超时
	], svg = [
		'<svg class="octicon octicon-file-zip mr-2" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>',
		'<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon d-inline-block"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-inline-block d-sm-none"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>',
		'<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>'
	], style = ['padding:0 6px; margin-right: -1px; border-radius: 2px; background-color: var(--XIU2-back-Color); border-color: rgba(27, 31, 35, 0.1); font-size: 11px; color: var(--XIU2-font-Color);']

	if (menu_rawFast == null) { menu_rawFast = 1; GM_setValue('xiu2_menu_raw_fast', 1) };
	if (GM_getValue('menu_rawDownLink') == null) { GM_setValue('menu_rawDownLink', true) };
	if (GM_getValue('menu_gitClone') == null) { GM_setValue('menu_gitClone', true) };
	registerMenuCommand()
	// Register script menu
	function registerMenuCommand() {
		// If the feedback menu ID is not NULL, delete all script menus
		if (menu_feedBack_ID) { GM_unregisterMenuCommand(menu_rawFast_ID); GM_unregisterMenuCommand(menu_rawDownLink_ID); GM_unregisterMenuCommand(menu_gitClone_ID); GM_unregisterMenuCommand(menu_feedBack_ID); menu_rawFast = GM_getValue('xiu2_menu_raw_fast') }
		// Avoid reducing raw After the array, the data stored by the user is greater than the array and reported an error
		if (menu_rawFast > raw_url.length - 1) menu_rawFast = 0

		if (GM_getValue('menu_rawDownLink')) menu_rawFast_ID = GM_registerMenuCommand(`${['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][menu_rawFast]} [ ${raw_url[menu_rawFast][1]} ] Acceleration source (☁) - Click to switch`, menu_toggle_raw_fast)

		menu_rawDownLink_ID = GM_registerMenuCommand(`${GM_getValue('menu_rawDownLink') ? '✅' : '❌'} Project List File Fast Download (☁)`, function () { if (GM_getValue('menu_rawDownLink') == true) { GM_setValue('menu_rawDownLink', false); GM_notification({ text: `closed [Project List File Fast Download (☁)] Function\n (click to refresh the webpage to take effect)`, timeout: 3500, onclick: function () { location.reload() } }) } else { GM_setValue('menu_rawDownLink', true); GM_notification({ text: `Turned on [Project List File Fast Download (☁)] Function\n (click to refresh the webpage to take effect)`, timeout: 3500, onclick: function () { location.reload() } }) } registerMenuCommand() })

		menu_gitClone_ID = GM_registerMenuCommand(`${GM_getValue('menu_gitClone') ? '✅' : '❌'} Add to git clone Order`, function () { if (GM_getValue('menu_gitClone') == true) { GM_setValue('menu_gitClone', false); GM_notification({ text: `closed [Add to git clone Order] Function\n (click to refresh the webpage to take effect)`, timeout: 3500, onclick: function () { location.reload() } }) } else { GM_setValue('menu_gitClone', true); GM_notification({ text: `Turned on [Add to git clone Order] Function\n (click to refresh the webpage to take effect)`, timeout: 3500, onclick: function () { location.reload() } }) } registerMenuCommand() })

		menu_feedBack_ID = GM_registerMenuCommand('💬 feedback & suggestion [Github]', function () { window.GM_openInTab('https://github.com/XIU2/UserScript', { active: true, insert: true, setParent: true }); window.GM_openInTab('https://greasyfork.org/en/scripts/412245/feedback', { active: true, insert: true, setParent: true }) })
	}

	// Switch the acceleration source
	function menu_toggle_raw_fast() {
		// If the current acceleration source location is greater than equal to the total number of acceleration sources, the first acceleration source is changed, and the next acceleration source is increasing
		if (menu_rawFast >= raw_url.length - 1) { menu_rawFast = 0 } else { menu_rawFast += 1 }
		GM_setValue('xiu2_menu_raw_fast', menu_rawFast)
		delRawDownLink() // Delete the old acceleration source
		addRawDownLink() // Add new speed source
		GM_notification({ text: "Switching the acceleration source is:" + raw_url[menu_rawFast][1], timeout: 3000 }) // Prompt message
		registerMenuCommand() // Re -register the script menu
	};

	colorMode() // Adaptation during the day/Night theme mode
	setTimeout(addRawFile, 1000) // Raw accelerate
	setTimeout(addRawDownLink, 2000) // Raw Single file fast download (), delay 2 Execute in seconds, avoid being avoided pjax Brush

	// Tampermonkey v4.11 Version added onurlchange event Grant, you can monitor pjax Webpage URL Variety
	if (window.onurlchange === undefined) addUrlChangeEvent()
	window.addEventListener('urlchange', function () {
		colorMode() // Adaptation during the day/Night theme mode
		if (location.pathname.indexOf('/releases')) addRelease() // Release accelerate
		setTimeout(addRawFile, 1000) // Raw accelerate
		setTimeout(addRawDownLink, 2000) // Raw Single file fast download (), delay 2 Execute in seconds, avoid being avoided pjax Brush
		setTimeout(addRawDownLink_, 1000) // Return to the browser/Add it again when you move forward Raw Download link (☁) mouse event
	})


	// Github Git Clone/SSH、Release、Download ZIP The revision is a list of dynamic loading files, so it is necessary to monitor the changes in the webpage elements
	const callback = (mutationsList, observer) => {
		if (location.pathname.indexOf('/releases') > -1) { // Release
			for (const mutation of mutationsList) {
				for (const target of mutation.addedNodes) {
					if (target.nodeType !== 1) return
					if (target.tagName === 'DIV' && target.dataset.viewComponent === 'true' && target.classList[0] === 'Box') addRelease()
				}
			}
		} else if (document.querySelector('#repository-container-header:not([hidden])')) { // Homepage
			for (const mutation of mutationsList) {
				for (const target of mutation.addedNodes) {
					if (target.nodeType !== 1) return
					if (target.tagName === 'DIV' && target.parentElement.id === '__primerPortalRoot__') {
						addDownloadZIP(target)
						addGitClone(target)
						addGitCloneSSH(target)
					} else if (target.tagName === 'DIV' && target.className.indexOf('Box-sc-') != -1) {
						if (target.querySelector('input[value^="https:"]')) {
							addGitCloneClear('.XIU2-GCS'); addGitClone(target)
						} else if (target.querySelector('input[value^="git@"]')) {
							addGitCloneClear('.XIU2-GC'); addGitCloneSSH(target)
						} else if (target.querySelector('input[value^="gh "]')) {
							addGitCloneClear('.XIU2-GC, .XIU2-GCS')
						}
					}
				}
			}
		}
	}
	const observer = new MutationObserver(callback)
	observer.observe(document, { childList: true, subtree: true })


	// download_url random 4 An acceleration source in the United States
	function get_New_download_url() {
		//return download_url_us.concat(download_url) // Full output debugging
		let shuffled = download_url_us.slice(0), i = download_url_us.length, min = i - 4, temp, index
		while (i-- > min) { index = Math.floor((i + 1) * Math.random()); temp = shuffled[index]; shuffled[index] = shuffled[i]; shuffled[i] = temp }
		return shuffled.slice(min).concat(download_url) // Random reshuffle download_url_us Array 4 One, then merge it to download_url Array
	}

	// Release
	function addRelease() {
		let html = document.querySelectorAll('.Box-footer'); if (html.length == 0 || location.pathname.indexOf('/releases') == -1) return
		let divDisplay = 'margin-left: -90px;', new_download_url = get_New_download_url()
		if (document.documentElement.clientWidth > 755) { divDisplay = 'margin-top: -3px;margin-left: 8px;display: inherit;' }; // Adjust the style of the small screen
		for (const current of html) {
			if (current.querySelector('.XIU2-RS')) continue
			current.querySelectorAll('li.Box-row a').forEach(function (_this) {
				let href = _this.href.split(location.host),
					url = '', _html = `<div class="XIU2-RS" style="${divDisplay}">`

				for (let i = 0; i < new_download_url.length; i++) {
					if (new_download_url[i][3] !== undefined && url.indexOf('/archive/') !== -1) {
						url = new_download_url[i][3] + href[1]
					} else {
						url = new_download_url[i][0] + href[1]
					}
					if (location.host !== 'github.com') url = url.replace(location.host, 'github.com')
					_html += `<a style="${style[0]}" class="btn" href="${url}" title="${new_download_url[i][2]}" rel="noreferrer noopener nofollow">${new_download_url[i][1]}</a>`
				}
				_this.parentElement.nextElementSibling.insertAdjacentHTML('beforeend', _html + '</div>')
			})
		}
	}


	// Download ZIP
	function addDownloadZIP(target) {
		let html = target.querySelector('ul[class^=List__ListBox-sc-] ul[class^=List__ListBox-sc-]>li:last-child'); if (!html) return
		let href_script = document.querySelector('react-partial[partial-name=repos-overview]>script[data-target="react-partial.embeddedData"]'),
			href_slice = href_script.textContent.slice(href_script.textContent.indexOf('"zipballUrl":"') + 14),
			href = href_slice.slice(0, href_slice.indexOf('"')),
			url = '', _html = '', new_download_url = get_New_download_url()
		for (let i = 0; i < new_download_url.length; i++) {
			if (new_download_url[i][3] === '') continue

			if (new_download_url[i][3] !== undefined) {
				url = new_download_url[i][3] + href
			} else {
				url = new_download_url[i][0] + href
			}
			if (location.host !== 'github.com') url = url.replace(location.host, 'github.com')
			let html_outer = html.outerHTML.slice(0, html.outerHTML.indexOf('<span id="'))
			_html += `${html_outer}<a class="d-flex flex-items-center color-fg-default no-underline" rel="noreferrer noopener nofollow" href="${url}" title="${new_download_url[i][2]}">Download ZIP ${new_download_url[i][1]}</a></div></li>`
		}
		html.insertAdjacentHTML('afterend', _html)
	}

	// Git Clone Switch
	function addGitCloneClear(css) {
		document.querySelectorAll(css).forEach((e) => { e.remove() })
	}

	// Git Clone
	function addGitClone(target) {
		let html = target.querySelector('input[value^="https:"]'); if (!html) return
		let href_split = html.value.split(location.host)[1],
			html_parent = '<div style="margin-top: 4px;" class="XIU2-GC ' + html.parentElement.className + '">',
			url = '', _html = '', _gitClone = ''
		html.nextElementSibling.hidden = true // Hide the right copy button
		if (GM_getValue('menu_gitClone')) { _gitClone = 'git clone '; html.value = _gitClone + html.value; html.setAttribute('value', html.value) }
		for (let i = 0; i < clone_url.length; i++) {
			if (clone_url[i][0] === 'https://gitclone.com') {
				url = _gitClone + clone_url[i][0] + '/github.com' + href_split
			} else {
				url = _gitClone + clone_url[i][0] + href_split
			}
			let html_clone = html.cloneNode(true)
			html_clone.title = `Acceleration source:${clone_url[i][1]} (Click to copy directly)`
			html_clone.setAttribute('value', url)
			_html += html_parent + html_clone.outerHTML + '</div>'
		}
		html.parentElement.insertAdjacentHTML('afterend', _html)
	}


	// Git Clone SSH
	function addGitCloneSSH(target) {
		let html = target.querySelector('input[value^="git@"]'); if (!html) return
		let href_split = html.value.split(':')[1],
			html_parent = '<div style="margin-top: 4px;" class="XIU2-GCS ' + html.parentElement.className + '">',
			url = '', _html = '', _gitClone = ''
		html.nextElementSibling.hidden = true // Hide the right copy button
		if (GM_getValue('menu_gitClone')) { _gitClone = 'git clone '; html.value = _gitClone + html.value; html.setAttribute('value', html.value) }
		for (let i = 0; i < clone_ssh_url.length; i++) {
			url = _gitClone + clone_ssh_url[i][0] + href_split
			let html_clone = html.cloneNode(true)
			html_clone.title = `Acceleration source:${clone_ssh_url[i][1]} (Click to copy directly)`
			html_clone.setAttribute('value', url)
			_html += html_parent + html_clone.outerHTML + '</div>'
		}
		html.parentElement.insertAdjacentHTML('afterend', _html)
	}


	// Raw
	function addRawFile() {
		let html = document.querySelector('a[data-testid="raw-button"]'); if (!html) return
		let href = location.href.replace(`https://${location.host}`, ''),
			href2 = href.replace('/blob/', '/'),
			url = '', _html = ''

		for (let i = 1; i < raw_url.length; i++) {
			if ((raw_url[i][0].indexOf('/gh') + 3 === raw_url[i][0].length) && raw_url[i][0].indexOf('cdn.staticaly.com') === -1) {
				url = raw_url[i][0] + href.replace('/blob/', '@')
			} else {
				url = raw_url[i][0] + href2
			}
			_html += `<a href="${url}" title="${raw_url[i][2]}" target="_blank" role="button" rel="noreferrer noopener nofollow" data-size="small" class="${html.className} XIU2-RF">${raw_url[i][1].replace(/ \d/, '')}</a>`
		}
		if (document.querySelector('.XIU2-RF')) document.querySelectorAll('.XIU2-RF').forEach((e) => { e.remove() })
		html.insertAdjacentHTML('afterend', _html)
	}


	// Raw Single file fast download (Unreasonable)
	function addRawDownLink() {
		if (!GM_getValue('menu_rawDownLink')) return
		// If it is not the project file page, return it, if the webpage has it Raw Download the link (☁) and return
		let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file, .react-directory-filename-column>svg.color-fg-muted'); if (files.length === 0) return; if (location.pathname.indexOf('/tags') > -1) return
		let files1 = document.querySelectorAll('a.fileDownLink'); if (files1.length > 0) return

		// Mouse pointing is displayedointing is displayed
		var mouseOverHandler = function (evt) {
			let elem = evt.currentTarget,
				aElm_new = elem.querySelectorAll('.fileDownLink'),
				aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted')
			aElm_new.forEach(el => { el.style.cssText = 'display: inline' })
			aElm_now.forEach(el => { el.style.cssText = 'display: none' })
		}

		// The mouse leaves hiddense leaves hidden
		var mouseOutHandler = function (evt) {
			let elem = evt.currentTarget,
				aElm_new = elem.querySelectorAll('.fileDownLink'),
				aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted')
			aElm_new.forEach(el => { el.style.cssText = 'display: none' })
			aElm_now.forEach(el => { el.style.cssText = 'display: inline' })
		}

		// Cycle adde add
		files.forEach(function (fileElm) {
			let trElm = fileElm.parentNode.parentNode,
				cntElm_a = trElm.querySelector('[role="rowheader"] > .css-truncate.css-truncate-target.d-block.width-fit > a, .react-directory-truncate>a'),
				Name = cntElm_a.innerText,
				href = cntElm_a.getAttribute('href'),
				href2 = href.replace('/blob/', '/'), url, url_name, url_tip = ''
			if ((raw_url[menu_rawFast][0].indexOf('/gh') + 3 === raw_url[menu_rawFast][0].length) && raw_url[menu_rawFast][0].indexOf('cdn.staticaly.com') === -1) {
				url = raw_url[menu_rawFast][0] + href.replace('/blob/', '@')
			} else {
				url = raw_url[menu_rawFast][0] + href2
			}

			url_name = raw_url[menu_rawFast][1]; url_tip = raw_url[menu_rawFast][2]
			fileElm.insertAdjacentHTML('afterend', `<a href="${url}" download="${Name}" target="_blank" rel="noreferrer noopener nofollow" class="fileDownLink" style="display: none;" title="「${url_name}」&#10;&#10;[Alt + Left -button] or [Right button - Save as...] download file.&#10;Note: Mouse click [☁] Icons, not the file name on the left!&#10;&#10;${url_tip}Tip: Click on the upper right corner of the browser Tampermonkey Extended icon - [ ${raw_url[menu_rawFast][1]} ] Acceleration source (☁) You can switch.">${svg[2]}</a>`)
			// Binded mouse incident
			trElm.onmouseover = mouseOverHandler
			trElm.onmouseout = mouseOutHandler
		})
	}


	// Remove Raw Single file fast download (Unreasonable)
	function delRawDownLink() {
		if (!GM_getValue('menu_rawDownLink')) return
		let aElm = document.querySelectorAll('.fileDownLink'); if (aElm.length === 0) return
		aElm.forEach(function (fileElm) { fileElm.remove() })
	}


	// Return to the browser/Add it again when you move forward Raw Single file fast download (mouse) mouse event
	function addRawDownLink_() {
		if (!GM_getValue('menu_rawDownLink')) return
		// If it is not the project file page, return it, if the webpage does not Raw Download the link (☁) and return
		let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file, .react-directory-filename-column>svg.color-fg-muted'); if (files.length === 0) return
		let files1 = document.querySelectorAll('a.fileDownLink'); if (files1.length === 0) return

		// Mouse pointing is displayed
		var mouseOverHandler = function (evt) {
			let elem = evt.currentTarget,
				aElm_new = elem.querySelectorAll('.fileDownLink'),
				aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted')
			aElm_new.forEach(el => { el.style.cssText = 'display: inline' })
			aElm_now.forEach(el => { el.style.cssText = 'display: none' })
		}

		// The mouse leaves hidden
		var mouseOutHandler = function (evt) {
			let elem = evt.currentTarget,
				aElm_new = elem.querySelectorAll('.fileDownLink'),
				aElm_now = elem.querySelectorAll('svg.octicon.octicon-file, svg.color-fg-muted')
			aElm_new.forEach(el => { el.style.cssText = 'display: none' })
			aElm_now.forEach(el => { el.style.cssText = 'display: inline' })
		}
		// Cycle add
		files.forEach(function (fileElm) {
			let trElm = fileElm.parentNode.parentNode
			// Binded mouse incident
			trElm.onmouseover = mouseOverHandler
			trElm.onmouseout = mouseOutHandler
		})
	}


	// Adaptation during the day/Night theme mode
	function colorMode() {
		let style_Add
		if (document.getElementById('XIU2-Github')) { style_Add = document.getElementById('XIU2-Github') } else { style_Add = document.createElement('style'); style_Add.id = 'XIU2-Github'; style_Add.type = 'text/css' }
		backColor = '#ffffff'; fontColor = '#888888'

		if (document.lastElementChild.dataset.colorMode === 'dark') { // If it is night mode
			if (document.lastElementChild.dataset.darkTheme === 'dark_dimmed') {
				backColor = '#272e37'; fontColor = '#768390'
			} else {
				backColor = '#161a21'; fontColor = '#97a0aa'
			}
		} else if (document.lastElementChild.dataset.colorMode === 'auto') { // If it is automatic mode
			if (window.matchMedia('(prefers-color-scheme: dark)').matches || document.lastElementChild.dataset.lightTheme.indexOf('dark') > -1) { // If the browser is a night mode or The day mode is dark Case
				if (document.lastElementChild.dataset.darkTheme === 'dark_dimmed') {
					backColor = '#272e37'; fontColor = '#768390'
				} else if (document.lastElementChild.dataset.darkTheme.indexOf('light') == -1) { // Excluding the night mode is light Case
					backColor = '#161a21'; fontColor = '#97a0aa'
				}
			}
		}

		document.lastElementChild.appendChild(style_Add).textContent = `.XIU2-RS a {--XIU2-back-Color: ${backColor}; --XIU2-font-Color: ${fontColor};}`
	}


	// customize urlchange Event (for monitoring URL Change), target non -wrong Tampermonkey Oil monkey manager
	function addUrlChangeEvent() {
		history.pushState = (f => function pushState() {
			var ret = f.apply(this, arguments)
			window.dispatchEvent(new Event('pushstate'))
			window.dispatchEvent(new Event('urlchange'))
			return ret
		})(history.pushState)

		history.replaceState = (f => function replaceState() {
			var ret = f.apply(this, arguments)
			window.dispatchEvent(new Event('replacestate'))
			window.dispatchEvent(new Event('urlchange'))
			return ret
		})(history.replaceState)

		window.addEventListener('popstate', () => { // Click the forward of the browser/Triggered when the back button urlchange event
			window.dispatchEvent(new Event('urlchange'))
		})
	}
})()
