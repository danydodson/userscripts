// ==UserScript==
// @name         Cleaner: Remove Web Limits
// @description  Pass to kill most of the site, you can lift the restrictions prohibited to copy, cut, select the text, right-click menu.revised version
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/cleaner/Cleaner-Remove-Web-Limits.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/cleaner/Cleaner-Remove-Web-Limits.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC
// @version      4.4.8
// @license      LGPLv3
// @match        *://*/*
// @exclude      *www.bilibili.com/video*
// @exclude      *www.bilibili.com/v*
// @exclude      *www.bilibili.com/s/*
// @exclude      *www.bilibili.com/bangumi*
// @exclude      https://www.bilibili.com/medialist/play/*
// @exclude      *www.youtube.com/watch*
// @exclude      *www.panda.tv*
// @exclude      *www.github.com*
// @exclude      https://lanhuapp.com/*
// @exclude      https://www.douyu.com/*
// @exclude      https://www.zhihu.com/signin?*
// @exclude      https://tieba.baidu.com/*
// @exclude      https://v.qq.com/*
// @exclude      *.taobao.com/*
// @exclude      *tmall.com*
// @exclude      *signin*
// @connect      eemm.me
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

// @--homepageURL  https://cat7373.github.io/remove-web-limits/
// @--supportURL   https://greasyfork.org/zh-CN/scripts/28497

(function () {
	'use strict'

	var settingData = {
		"status": 1,
		"version": 0.1,
		"message": "La la la la,La la la la,I am a small expert for sale",
		"positionTop": "0",
		"positionLeft": "0",
		"positionRight": "auto",
		"addBtn": true,
		"connectToTheServer": false,
		"waitUpload": [],
		"currentURL": "null",
		"shortcut": 3,
		// List of domain name rules
		"rules": {
			"rule_def": {
				"name": "default",
				"hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousemove|beforeunload",
				"unhook_eventNames": "mousedown|mouseup|keydown|keyup",
				"dom0": true,
				"hook_addEventListener": true,
				"hook_preventDefault": true,
				"hook_set_returnValue": true,
				"add_css": true
			},
			"rule_plus": {
				"name": "default",
				"hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousedown|mouseup|mousemove|beforeunload",
				"unhook_eventNames": "keydown|keyup",
				"dom0": true,
				"hook_addEventListener": true,
				"hook_preventDefault": true,
				"hook_set_returnValue": true,
				"add_css": true
			},
			"rule_zhihu": {
				"name": "default",
				"hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousemove",
				"unhook_eventNames": "keydown|keyup",
				"dom0": true,
				"hook_addEventListener": true,
				"hook_preventDefault": true,
				"hook_set_returnValue": true,
				"add_css": true
			}
		},
		"data": [
			"b.faloo.com",
			"bbs.coocaa.com",
			"book.hjsm.tom.com",
			"book.zhulang.com",
			"book.zongheng.com",
			"chokstick.com",
			"chuangshi.qq.com",
			"city.udn.com",
			"cutelisa55.pixnet.net",
			"huayu.baidu.com",
			"imac.hk",
			"life.tw",
			"luxmuscles.com",
			"news.missevan.com",
			"read.qidian.com",
			"www.15yan.com",
			"www.17k.com",
			"www.18183.com",
			"www.360doc.com",
			"www.coco01.net",
			"www.eyu.com",
			"www.hongshu.com",
			"www.hongxiu.com",
			"www.imooc.com",
			"www.jjwxc.net",
			"www.readnovel.com",
			"www.tadu.com",
			"www.xxsy.net",
			"www.z3z4.com",
			"www.zhihu.com",
			"yuedu.163.com",
			"www.ppkao.com",
			"movie.douban.com",
			"www.ruiwen.com",
			"vipreader.qidian.com",
			"www.pigai.org",
			"www.shangc.net",
			"www.myhtlmebook.com",
			"www.yuque.com",
			"www.longmabookcn.com",
			"www.alphapolis.co.jp",
			"www.sdifen.com",
			"votetw.com",
			"boke112.com",
			"www.myhtebooks.com",
			"www.xiegw.cn",
			"chuangshi.qq.com",
			"www.uta-net.com",
			"www.bimiacg.net",
			"www.dianyuan.com",
			"origenapellido.com",
			"3g.163.com",
			"www.lu-xu.com",
			"leetcode.cn",
			"www.jianbiaoku.com",
			"www.soyoung.com",
			"doc.guandang.net",
			"www.51dongshi.com",
			"m.haodf.com",
			"www.daodoc.com",
			"www.wcqjyw.com",
			"www.szxx.com.cn",
		]
	}

	var rwl_userData = null
	var hostname = window.location.hostname
	var btn_node = null
	var rule = null
	var list = null
	var hasFrame = false

	// Storage name
	var storageName = "iqxinStorageName"
	// To event List
	var hook_eventNames, unhook_eventNames, eventNames
	// Storage Hook The function
	var EventTarget_addEventListener = EventTarget.prototype.addEventListener
	var document_addEventListener = document.addEventListener
	var Event_preventDefault = Event.prototype.preventDefault

	// Check whether the old data exists in the local area
	rwl_userData = GM_getValue("rwl_userData")
	if (!rwl_userData) {
		rwl_userData = settingData
		// GM_setValue("rwl_userData",rwl_userData);
	}
	// Automatic update data
	for (let value in settingData) {
		if (!rwl_userData.hasOwnProperty(value)) {
			rwl_userData[value] = settingData[value]
			GM_setValue("rwl_userData", rwl_userData)
		}
	}

	version_up_3_to_4()

	// Get the blacklist website
	list = get_black_list()

	// Add button
	// if(rwl_userData.addBtn){
	addBtn()  // Add to
	btn_node = document.getElementById("black_node")

	var timer = setInterval(function () {
		if (document.getElementById("black_node")) {
			clearInterval(timer)
			qxinStart()
		} else {
			addBtn()
		}
	}, 500)

	// }

	GM_registerMenuCommand("Copy restriction set up", setMenu)
	var userSetting = GM_getValue("rwl_userData")

	// // ------------------------------function func

	function qxinStart() {
		console.log("Script: Copy restriction(change) --- Begin execution --- announcer: qxin --- GitHub: https://github.com/qxinGitHub/Remove-web-limits-")
		addDragEven()
		setBtnClick()

		// Check if it is on the blacklist
		if (check_black_list(list, hostname)) {
			try {
				if (rwl_userData.addBtn) {
					btn_node.checked = true
				}
			} catch (e) {
				console.error("Script RWL-mistake:\n btn_node : %s\n%s\N script RWL-Error location: btn_node.checked = true;", btn_node, e)
			} finally {
				init()
			}
		}
	}

	//Add button func
	function addBtn() {
		var node = document.createElement("remove-web-limits-iqxin")
		node.id = "rwl-iqxin"
		node.className = "rwl-exempt"

		// Open the window again when the window is less than the previous window,As a result, the button appears outside the visual window
		var screenClientHeight = document.documentElement.clientHeight
		var tempHeight
		if (rwl_userData.positionTop > screenClientHeight) {
			tempHeight = screenClientHeight - 40
		} else {
			tempHeight = rwl_userData.positionTop
		}
		// Change the size of the window
		window.onresize = function () {
			var screenClientHeight = document.documentElement.clientHeight
			var tempHeight

			if (rwl_userData.positionTop > screenClientHeight) {
				tempHeight = screenClientHeight - 40
			} else {
				tempHeight = rwl_userData.positionTop
			}

			node.style.top = tempHeight + "px"
		}

		tempHeight = tempHeight < 0 ? 0 : tempHeight
		node.style.cssText = "position:fixed;top:" + tempHeight + "px;left:" + rwl_userData.positionLeft + "px;right:" + rwl_userData.positionRight + "px;"
		// node.innerHTML = '<label><input type="checkbox" name="" id="black_node">黑名单</label><qxinbutton id="delete">delete</btton>';
		// node.innerHTML = '<label>限制解除 <input type="checkbox"  name="" id="black_node"></label>';
		node.innerHTML = '<qxinbutton type="qxinbutton" id="rwl-setbtn"> set </qxinbutton> <lalala style="cursor:move; font-size:12px;">限制解除</lalala> <input type="checkbox" name="" id="black_node" >'
		if (window.self === window.top) {
			if (document.querySelector("body")) {
				document.body.appendChild(node)
			} else {
				document.documentElement.appendChild(node)
			}
		}
		node.addEventListener("mouseover", function () {
			node.classList.add("rwl-active-iqxin")
		})
		node.addEventListener("mouseleave", function () {
			setTimeout(function () {
				node.classList.remove("rwl-active-iqxin")
				black_check(black_node.checked)
			}, 100)
		})

		var style = document.createElement("style")
		style.type = "text/css"

		var styleInner = "#rwl-iqxin{" +
			"position:fixed;" +
			"transform:translate(-95%,0);" +
			"width:85px;" +
			"height:25px;" +
			"font-size:12px;" +
			"font-weight: 500;" +
			"font-family:Verdana, Arial, '宋体';" +
			"color:#fff;" +
			"background:#333;" +
			"z-index:2147483647;" +
			"margin: 0;" +
			"opacity:0.05;" +
			"transition:0.3s;" +
			"overflow:hidden;" +
			"user-select:none;" +
			"text-align:center;" +
			"white-space:nowrap;" +
			"line-height:25px;" +
			"padding:0 16px;" +
			"border:1px solid #ccc;" +
			"border-width:1px 1px 1px 0;" +
			"border-bottom-right-radius:5px;" +
			"box-sizing: content-box;" +
			"}" +
			"#rwl-iqxin input{" +
			"margin: 0;" +
			"padding: 0;" +
			"vertical-align:middle;" +
			"-webkit-appearance:checkbox !important;" +
			"-moz-appearance:checkbox;" +
			"position: static;" +
			"clip: auto;" +
			"opacity: 1;" +
			"cursor: pointer;" +
			"}" +
			"#rwl-iqxin.rwl-active-iqxin{" +
			"left: 0px;" +
			"transform:translate(0,0);" +
			"opacity: 0.9;" +
			"height: 32px;" +
			"line-height: 32px" +
			"}" +
			"#rwl-iqxin label{" +
			"margin:0;" +
			"padding:0;" +
			"font-weight:500;" +
			"}" +
			"#rwl-iqxin #rwl-setbtn{" +
			"margin: 0 4px 0 0;" +
			"padding: 0 0 0 4px;" +
			"border: none;" +
			"border-radius: 2px;" +
			"cursor: pointer;" +
			"background: #fff;" +
			"color: #000;" +
			"}" +
			" "

		if (!rwl_userData.addBtn) {
			var styleTemp = "#rwl-iqxin{display:none}"
			style.innerHTML = styleInner + styleTemp
		} else {
			style.innerHTML = styleInner
		}
		if (document.querySelector("#rwl-iqxin")) {
			// console.log("通过style插入");
			document.querySelector("#rwl-iqxin").appendChild(style)
		} else {
			// console.log("通过GM插入");
			GM_addStyle(styleInner)
		}
	};

	// 给按钮绑定点击事件
	function setBtnClick() {
		document.querySelector("#rwl-setbtn").addEventListener("click", setMenu)
	}

	// 菜单
	function setMenu() {
		var oldEditBox = document.querySelector("#rwl-setMenu")
		if (oldEditBox) {
			oldEditBox.parentNode.removeChild(oldEditBox)
			return
		}
		var userSetting = GM_getValue("rwl_userData")
		var upload_checked = userSetting.connectToTheServer ? "checked" : ""
		var btnchecked = userSetting.addBtn ? 'checked' : ''

		var odom = document.createElement("div")
		odom.id = "rwl-setMenu"
		odom.style.cssText = "position: fixed;" +
			"top: 100px;" +
			"left: 50px;" +
			"padding: 10px;" +
			"background: #fff;" +
			"border-radius: 4px;"
		GM_addStyle("#rwl-setMenuSave," +
			"#rwl-reset," +
			"#rwl-setMenuClose{" +
			"margin: 0;" +
			"padding: 0 2px;" +
			"border: none;" +
			"border-radius: 2px;" +
			"cursor: pointer;" +
			"background: #fff;" +
			"color: #000;" +
			"}" +
			"#rwl-reset{" +
			"border: 1px solid #666;" +
			"}" +
			"#rwl-setMenuSave{" +
			"border: 1px solid green;" +
			"}" +
			"#rwl-setMenuClose{" +
			"border: 1px solid red;" +
			"}" +
			"#rwl-setMenu{" +
			"text-align:left;" +
			"font-size:14px;" +
			"z-index:999999;" +
			"border: 1px solid cornflowerblue;" +
			"}" +
			"#rwl-setMenu p{" +
			"margin:5px auto;" +
			"}" +
			" ")
		var innerH = "" +
			"<p>Following the top distance (unit pixel) <input ID = 'POSITIONTOP' Type = 'Text' Value = " + UserSetting.positationTop + "> </p> " + " " +
			// "<laberl> <p>允许上传黑名单<input id='uploadchecked'  type='checkbox' " + upload_checked + "></p>" + "</laberl>" +
			"<p ID = 'rwl-shortcuts' title = 'shortcut key'> shortcut key: " +
			"<select id='rwl-shortcut'>" +
			"<option value='off'" + (userSetting.shortcut == 0 ? "selected" : "") + ">关闭</option>" +
			"<option value='f1'" + (userSetting.shortcut == 1 ? "selected" : "") + "> F1 </option>" +
			"<option value='ctrlf1'" + (userSetting.shortcut == 2 ? "selected" : "") + ">ctrl + F1</option>" +
			"<option value='ctrlc'" + (userSetting.shortcut == 3 ? "selected" : "") + ">ctrl + C</option>" +
			"</select>" +
			"</p> " +
			"<Laberl> <p> Show button <input ID = 'Btnchecked' Type = 'Checkbox' " + Btnchecked + "> Click the script management extension to open the settings again </p> " + " </laberl> " +
			"<p>问题反馈地址: <aTarget='Blank'Href='https://githubCom/qxinGitHub/removeWebLimits '>gitHub(qxin)</a>, <aTarget='Blank'Href='https://greasyforkOrg/zhCn/scripts/28497RemoveWebLimitsModified'>greasyFork(qxin)</a> </p>" +
			"<p>The original author of the project was <a target='_blank' href='https://cat7373.github.io/remove-web-limits/'> cat7373 </a>, <a target = '//github.com/cat7373/Remove-eb-Limits'> Project Homepage </a> </p> " +
			"<p>Limited ability, you cannot be perfect every website </p> " +
			"<p> If feedback, be sure to bring a detailed website </p> " +
			"<p>  </P>" +
			// "<p> <s> Show button (to be added) </s> </p>" +
			// "<p> <s> button transparency (to be added) </s> </p>" +
			// "<p> <s> Quickly copy (to be added) </s> </p>" +
			// "<p> <s> Others (to be added) </s> </p>" +
			"<p>The data storage method is JSON, If you modify it here, Pay attention to quotation commas</P>" +
			"<textarea wrap='off' cols='45' rows='20' style='overflow:auto;border-radius:4px;'>" + JSON.stringify(userSetting.data, false, 4) + "</textarea>" +
			"<br>" +
			"<qxinbutton id='rwl-reset'>Empty settings</qxinbutton> &nbsp;&nbsp;&nbsp;" +
			"<qxinbutton id='rwl-setMenuSave'>keep</qxinbutton> &nbsp;&nbsp;&nbsp;" +
			"<qxinbutton id='rwl-setMenuClose' onclick='this.parentNode.parentNode.removeChild(this.parentNode);' title='If it cannot be closed Please refresh the interface' >closure</qxinbutton> &nbsp;&nbsp;&nbsp;" +
			"<span style='font-size:0.7em;'>--| qxin v4.4.8 2022-12-13 |--</span>" +
			""
		""
		odom.innerHTML = innerH
		document.body.appendChild(odom)

		document.querySelector("#rwl-setMenuSave").addEventListener("click", saveSetting)
		document.querySelector("#rwl-setMenuClose").addEventListener("click", closeMenu)
		document.querySelector("#rwl-reset").addEventListener("click", rwlReset)

	}

	// 保存选项
	function saveSetting() {
		var positionTop = document.querySelector("#rwl-setMenu #positiontop").value
		// var uploadChecked = document.querySelector("#rwl-setMenu #uploadchecked").checked;
		var shortcut = document.querySelector("#rwl-setMenu #rwl-shortcut").selectedIndex
		var addBtnChecked = document.querySelector("#rwl-setMenu #btnchecked").checked
		var codevalue = document.querySelector("#rwl-setMenu textarea").value
		if (codevalue) {
			var userSetting = GM_getValue("rwl_userData")

			userSetting.addBtn = addBtnChecked
			userSetting.data = JSON.parse(codevalue)
			userSetting.positionTop = parseInt(positionTop)
			userSetting.shortcut = parseInt(shortcut)
			// userSetting.connectToTheServer = uploadChecked;

			GM_setValue("rwl_userData", userSetting)
			// 刷新页面
			setTimeout(function () {
				window.location.reload()
			}, 300)
		} else {
			alert("Input as empty")
			// this.reset();
		}
		closeMenu()
	}
	// 复原菜单
	function rwlReset() {
		GM_deleteValue("rwl_userData")
		window.location.reload()
	}

	//关闭菜单
	function closeMenu() {
		var oldEditBox = document.querySelector("#rwl-setMenu")
		if (oldEditBox) {
			oldEditBox.parentNode.removeChild(oldEditBox)
			return
		}
	}

	// 增加拖拽事件 进行绑定
	function addDragEven() {
		setTimeout(function () {
			try {
				dragBtn()
			} catch (e) {
				console.error("Dragbtn function Report an error")
			}
		}, 1000)
		// dragBtn();  // 增加拖动事件
	}

	// 增加拖动事件 func
	function dragBtn() {
		var rwl_node = document.querySelector("#rwl-iqxin")
		rwl_node.addEventListener("mousedown", function (event) {
			rwl_node.style.transition = "null"
			var disX = event.clientX - rwl_node.offsetLeft
			var disY = event.clientY - rwl_node.offsetTop

			var move = function (event) {
				rwl_node.style.left = event.clientX - disX + "px"
				rwl_node.style.top = event.clientY - disY + "px"
			}

			document.addEventListener("mousemove", move)
			document.addEventListener("mouseup", function () {
				rwl_node.style.transition = "0.3s"
				document.removeEventListener("mousemove", move)
				// 此函数内所有的注释语句都是有用的
				// 开启后,可拖动到屏幕右侧,但尚未添加css
				// 在上面添加 rwl-active-iqxin 的地方加上判断左右,在加上相应的css即可
				// 懒 2018-04-18 21:51:32
				// var bodyWidth = document.body.clientWidth;
				var rwl_nodeWidth = rwl_node.offsetLeft + rwl_node.offsetWidth / 2
				// if(rwl_nodeWidth > bodyWidth/2){
				//     rwl_node.style.left = "auto";
				//     rwl_node.style.right = 0;
				//     rwl_userData.positionLeft = "auto";
				//     rwl_userData.positionRight = "0";
				// } else {
				rwl_node.style.right = rwl_userData.positionRight = "auto"
				rwl_node.style.left = rwl_userData.positionLeft = 0
				// }
				rwl_userData.positionTop = rwl_node.offsetTop
				GM_setValue("rwl_userData", rwl_userData)

			})
		})
	}

	// 初始化 init func  这里才是核心
	function init() {
		// 针对个别网站采取不同的策略
		rule = clear()
		// 设置 event 列表
		hook_eventNames = rule.hook_eventNames.split("|")
		// TODO Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|")
		eventNames = hook_eventNames.concat(unhook_eventNames)

		// 调用清理 DOM0 event 方法的循环
		if (rule.dom0) {
			setInterval(clearLoop, 10 * 1000)
			setTimeout(clearLoop, 1500)
			window.addEventListener('load', clearLoop, true)
			clearLoop()
		}

		// hook addEventListener //导致搜索跳转失效的原因
		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener
			document.addEventListener = addEventListener

			if (hasFrame) {
				for (let i = 0; i < hasFrame.length; i++) {
					hasFrame[i].contentWindow.document.addEventListener = addEventListener
				}
			}

		}

		// hook preventDefault
		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function () {
				if (hook_eventNames.indexOf(this.type) < 0) {
					Event_preventDefault.apply(this, arguments)
				}
			}

			if (hasFrame) {
				for (let i = 0; i < hasFrame.length; i++) {
					hasFrame[i].contentWindow.Event.prototype.preventDefault = function () {
						if (hook_eventNames.indexOf(this.type) < 0) {
							Event_preventDefault.apply(this, arguments)
						}
					}
				}
			}
		}

		// Hook set returnValue
		if (rule.hook_set_returnValue) {
			Event.prototype.__defineSetter__('returnValue', function () {
				if (this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
					this.returnValue = true
				}
			})
		}

		// 添加CSS     // console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);
		if (rule.add_css) {
			GM_addStyle('html, :not([class*="rwl-exempt"]) {-webkit-user-select:text!important; -moz-user-select:text!important;} :not([class*="rwl-exempt"]) ::selection {color:#fff; background:#3390FF!important;}')
		} //else {
		//GM_addStyle('html, :not([class*="rwl-exempt"]) {-webkit-user-select:text!important; -moz-user-select:text!important;}');
		//}
	}

	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener
		if (hook_eventNames.indexOf(type) >= 0) {
			_addEventListener.apply(this, [type, returnTrue, useCapture])
		} else if (unhook_eventNames.indexOf(type) >= 0) {
			var funcsName = storageName + type + (useCapture ? 't' : 'f')

			if (this[funcsName] === undefined) {
				this[funcsName] = []
				_addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture])
			}

			this[funcsName].push(func)
		} else {
			_addEventListener.apply(this, arguments)
		}
	}

	// 清理循环
	function clearLoop() {
		rule = clear() // 对于动态生成的节点,随时检测
		var elements = getElements()

		for (var i in elements) {
			for (var j in eventNames) {
				var name = 'on' + eventNames[j]

				// ;?未解决
				// 2018-04-02 elements中会有字符串出现,原版不会,问题不明,根本原因尚未解决
				// 相关反馈  https://greasyfork.org/zh-CN/forum/discussion/36014
				// 问题版本号  v3.0.7
				// 问题补充   之前可以使用,具体版本未测（2018-04-02 21:27:53）,原版可以使用
				if (Object.prototype.toString.call(elements[i]) == "[object String]") {
					continue
				}

				// console.log(elements[i])
				// if(typeof elements[i][name] === "object"){
				//     console.log(typeof elements[i][name])
				// }
				if (elements[i][name] !== null && elements[i][name] !== onxxx) {
					if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
						elements[i][storageName + name] = elements[i][name]
						elements[i][name] = onxxx
					} else {
						elements[i][name] = null
					}
				}
			}
		}

		document.onmousedown = function () { return true }
	}

	// 返回true的函数
	function returnTrue(e) {
		return true
	}
	function unhook_t(e) {
		return unhook(e, this, storageName + e.type + 't')
	}
	function unhook_f(e) {
		return unhook(e, this, storageName + e.type + 'f')
	}
	function unhook(e, self, funcsName) {
		var list = self[funcsName]
		for (var i in list) {
			list[i](e)
		}

		e.returnValue = true
		return true
	}
	function onxxx(e) {
		var name = storageName + 'on' + e.type
		this[name](e)

		e.returnValue = true
		return true
	}

	// 获取所有元素 包括document
	function getElements() {
		var elements = Array.prototype.slice.call(document.getElementsByTagName('*'))
		elements.push(document)

		// 循环所有 frame 窗口
		var frames = document.querySelectorAll("frame")
		if (frames) {
			hasFrame = frames
			var frames_element
			for (let i = 0; i < frames.length; i++) {
				frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"))
				elements.push(frames[i].contentWindow.document)
				elements = elements.concat(frames_element)
			}
		}
		return elements
	};

	// 获取黑名单网站 Func
	function get_black_list() {
		// 之前版本可能导致存储空的字符串
		// 2018-06-11 15:11:44 保留,当容错处理
		var data_temp = rwl_userData.data
		data_temp = data_temp.filter(function (item) {
			return item.length > 1
		})
		return data_temp
	}

	// 检查是否存在于黑名单中 返回位置 func
	function check_black_list(list, host) {
		for (let i = 0; i < list.length; i++) {
			if (~hostname.indexOf(list[i])) {
				return i + 1  //In case of matching to the first one, return 0
			}
		}
		return false
	}

	// After the mouse is clicked, the button Check whether it is blacklist
	function black_check(bool) {
		var list = GM_getValue("rwl_userData").data
		var check = check_black_list(list, hostname)

		if (bool && !check) {
			list = list.concat(hostname)
			// console.log("Select Not a blacklist, Increase",hostname,list);
			rwl_userData.waitUpload.push(hostname) //Prepare upload
			rwl_userData.currentURL = window.location.href
			// console.log("after: ",rwl_userData.waitUpload)

			saveData(list)
			init()

		} else if (!bool && check) {
			list.splice(check - 1, 1)
			saveData(list)
			// refresh page
			setTimeout(function () {
				window.location.reload(true)
				console.log("Refresh the page loading")
			}, 350)
		} else {
			return false
		}
	}

	// Save local data,And upload the data to the server
	function saveData(lists) {
		lists = lists.filter(function (item) {
			return item.length > 1
		})

		// update data
		rwl_userData.data = lists.sort()

		// Upload the local black list
		// if (rwl_userData.waitUpload.length > 0 && rwl_userData.connectToTheServer){
		//     // console.log("rwl : 上传...",rwl_userData.waitUpload);
		//     // console.log("rwl : 开始上传-----");
		//     GM_xmlhttpRequest({
		//       method: "POST",
		//       // url: "http://127.0.0.1:8000/tool/testajax/",
		//       url: "http://eemm.me/tool/rwl_upload/",
		//       data: JSON.stringify(rwl_userData),
		//       headers: {
		//         "Content-Type": "application/x-www-form-urlencoded"
		//       },
		//       onload: function(response) {
		//         // console.log("rwl : 上传成功----");
		//       }
		//     });
		//     rwl_userData.waitUpload = [];
		// }

		GM_setValue("rwl_userData", rwl_userData)
		return rwl_userData
	}

	// Array heavy
	function unique(arr) {
		var ret = []
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i]
			if (ret.indexOf(item) === -1) {
				ret.push(item)
			}
		}
		return ret
	}

	// Copy to the clipboard
	function setClipboard() {
		var text_obj = window.getSelection()
		var text = text_obj.toString()
		GM_setClipboard(text)

	}

	// hot key F1（ctrl+f1） copy
	function hotkey() {
		var a = window.event.keyCode
		// if ((a == 112) && (event.ctrlKey)) {
		if (a == 112 && userSetting.shortcut == 1) {
			event.preventDefault()
			setClipboard()
			event.keyCode = 0
			event.returnValue = false
			return false
		} else if (a == 112 && (event.ctrlKey) && userSetting.shortcut == 2) {
			setClipboard()
		} else if ((a == 67) && (event.ctrlKey) && userSetting.shortcut == 3) {
			setClipboard()
		} else {
			console.log("Turn off the shortcut key")
		}
	}
	document.onkeydown = hotkey //When onkeydown Call the hotKey function when the event occurs

	// Some websites use other anti -reproduction methods
	function clear() {
		// console.log("Enter Clear",hostname,rwl_userData.rules);
		switch (hostname) {
			case "chuangshi.qq.com": clear_chuangshi(); break
			case "votetw.com": clear_votetw(); break
			case "www.myhtebooks.com": clear_covers(".fullimg"); break
			case "www.z3z4.com": clear_covers(".moviedownaddiv"); break
			case "huayu.baidu.com": clear_covers("#jqContextMenu"); break
			case "www.myhtlmebook.com": clear_covers("img.fullimg"); break
			case "www.szxx.com.cn": clear_covers("img#adCover"); break
			case "zhihu.com":
			case "www.zhihu.com": return rwl_userData.rules.rule_zhihu; break
			case "t.bilibili.com": clear_link_bilibili(); break
			case "www.uslsoftware.com": clear_covers(".protect_contents-overlay"); clear_covers(".protect_alert"); return rwl_userData.rules.rule_plus; break
			case "www.longmabookcn.com": clear_covers(".fullimg"); return rwl_userData.rules.rule_plus; break
			case "boke112.com": return rwl_userData.rules.rule_plus; break
			case "www.shangc.net": return rwl_userData.rules.rule_plus; break
			// Remove the pop -up
			case "www.daodoc.com": clear_marks(".marks"); break
			case "www.wcqjyw.com": clear_marks(".marks"); break
			case "www.jianbiaoku.com": clear_marks(".layui-layer-shade"); break
		}
		return rwl_userData.rules.rule_def
	}
	// Remove the coverage layer
	function clear_covers(ele) {
		var odiv = document.querySelector(ele)
		if (odiv) {
			odiv.parentNode.removeChild(odiv)
		}
	}
	// Station B puts text in the link
	function clear_link_bilibili() {
		var odiv = document.querySelector(".description")
		if (odiv) {
			var tDiv = odiv.querySelector(".content-ellipsis")
			var aDiv = odiv.querySelector("a")
			odiv.appendChild(tDiv)
		}
	}
	// https://votetw.com/wiki/%E6%9E%97%E6%99%BA%E5%A0%85
	// Will create multiple no IDs,DIV without Class,Cover the upper layer of text
	function clear_votetw() {
		var odivs = document.querySelectorAll(".mw-parser-output>div")
		odivs.forEach(function (value) {
			value.setAttribute("style", "")
		})
	}

	// Remove the pop -up, After copying, there will be pop -up notes, But it has been replicated successfully
	function clear_marks(node) {
		GM_addStyle(`
            ${node} {
                display: none !important;
            }
        `)
	}

	// Creation Chinese website
	function clear_chuangshi() {
		console.log("Creation Chinese website Begin execution")

		// JS The transformation of Chinese characters and Unicode code
		// https://www.cnblogs.com/wwlhome/p/5650744.html
		function tounicode(data) {
			if (data == '') return '请输入汉字'
			var str = ''
			for (var i = 0; i < data.length; i++) {
				str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16)
			}
			return str
		}
		function tohanzi(data) {
			if (data == '') return 'Please enter hexadecimal UNICODE'
			data = data.split("\\u")
			var str = ''
			for (var i = 0; i < data.length; i++) {
				str += String.fromCharCode(parseInt(data[i], 16).toString(10))
			}
			return str
		}
		// The replace function in JavaScript replaces multiple string at the same time
		// https://bbs.csdn.net/topics/320097246
		Array.prototype.each = function (trans) {
			for (var i = 0; i < this.length; i++)
				this[i] = trans(this[i], i, this)
			return this
		}
		Array.prototype.map = function (trans) {
			return [].concat(this).each(trans)
		}
		RegExp.escape = function (str) {
			return new String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
		}
		function properties(obj) {
			var props = []
			for (var p in obj) props.push(p)
			return props
		}
		// ---------------------------------------------
		var bookreadercontent = document.querySelector(".bookreadercontent")
		if (bookreadercontent) {
			var str = bookreadercontent.innerText
			var strUnicode = tounicode(str)
			var replacements = { "e2af": "4e09", "e2af": "4e0b", "e2c9": "4e3b", "e2d6": "4e48", "e2b2": "4e4b", "e2a6": "4e5f", "e294": "4e8b", "e2e9": "4e8c", "e30a": "4e8e", "e292": "4e94", "e298": "4e9b", "e2a2": "4ee3", "e2f0": "4f46", "e30e": "4f4d", "e305": "4f53", "e296": "4f5c", "e2d3": "4f60", "e2db": "4f7f", "e29b": "516c", "e2b0": "5176", "e2ed": "51fa", "e2eb": "5206", "e2f1": "5229", "e307": "5230", "e2ce": "5236", "e2e6": "524d", "e2ea": "529b", "e2a8": "52a0", "e2a5": "5316", "e2bd": "5341", "e302": "539f", "e2df": "53bb", "e2c7": "53c8", "e303": "53cd", "e2ac": "53d1", "e2f8": "53ea", "e30b": "5404", "e29c": "5408", "e2d7": "540c", "e2d8": "540e", "e306": "5411", "e2c5": "547d", "e2b4": "56db", "e2f9": "56e0", "e2ca": "5730", "e2ef": "5916", "e2bc": "591a", "e301": "5929", "e29a": "597d", "e2b7": "5b50", "e2cc": "5b83", "e2ee": "5b9a", "e2ff": "5bb6", "e2e8": "5c0f", "e2d4": "5c31", "e2d5": "5c55", "e2a1": "5de5", "e2a0": "5e73", "e2fe": "5e74", "e2c4": "5e76", "e2c8": "5ea6", "e2ae": "5efa", "e304": "5f62", "e291": "5f88", "e2e2": "5f97", "e2f2": "5fc3", "e295": "6027", "e2d9": "60c5", "e2be": "60f3", "e2c3": "610f", "e30d": "6210", "e2ba": "6216", "e2fa": "6240", "e29e": "628a", "e2a7": "63d0", "e2d2": "653f", "e2ad": "6599", "e2cd": "65b0", "e2f3": "65b9" }
			var regex = new RegExp(properties(replacements).map(RegExp.escape).join("|"), "g")
			strUnicode = strUnicode.replace(regex, function ($0) { return replacements[$0] })

			// console.log(strUnicode)
			strUnicode = strUnicode.replace("u0", "")
			str = tohanzi(strUnicode)

			bookreadercontent.innerText = str
		}


	}

	// 3.x.x transition 4.x.x Version
	function version_up_3_to_4() {
		var old_version = GM_getValue("black_list")
		if (!old_version) { return };
		rwl_userData.data = unique(rwl_userData.data.concat(old_version.data))
		GM_setValue("rwl_userData", rwl_userData)

		GM_deleteValue("black_list")
		GM_deleteValue("rwl_userdata")
	}
})()