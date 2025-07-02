// ==UserScript==
// @name         JSON: Formatter
// @namespace    https://egore.url.lol/userscripts
// @author       Gerald <i@gerald.top>
// @icon         https://cdn-icons-png.flaticon.com/512/136/136525.png
// @description  Format JSON data in a beautiful way.
// @version      2.0.9
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @match        *://*/*
// @match        file:///*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
	'use strict';
	
	var css_248z = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:initial;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:initial}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:initial}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:initial;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}fieldset,ol,ul{margin:0;padding:0}ol,ul{list-style:none}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#a0aec0}[role=button],button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}body{font-family:Menlo,Microsoft YaHei,Tahoma;background:#343434}#json-formatter{position:relative;height:100vh;display:flex;flex-direction:column;padding:.5rem;font-size:.875rem}#json-formatter>pre{flex:1 1 0%;min-height:0;overflow:auto;padding-left:1rem;padding-right:1rem;white-space:pre-wrap}#json-formatter>pre:not(.show-commas) .comma,#json-formatter>pre:not(.show-quotes) .quote{display:none}.quote{color:#878787}.color{display:inline-block;width:.75rem;height:.75rem;margin-left:.25rem;margin-right:.25rem;border-width:1px;--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity))}.item{cursor:pointer}.content{padding-left:1rem}.collapse>span>.content{padding-left:0;display:inline}.collapse>span>.content>*{display:none}.collapse>span>.content:before{content:\"...\"}.complex{position:relative}.complex:before{position:absolute;width:.25rem;border-left-width:1px;border-bottom-width:1px;--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity));content:\"\";top:1.5em;left:-.5em;bottom:.7em;margin-left:-1px}.complex.collapse:before{display:none}.folder{position:absolute;--text-opacity:1;color:#a0aec0;color:rgba(160,174,192,var(--text-opacity));top:0;width:.5rem;text-align:center;transition-property:transform;transition-duration:.3s;--transform-rotate:90deg;cursor:pointer;left:-1em}.collapse>.folder{--transform-rotate:0}.summary{margin-left:1rem;--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}:not(.collapse)>.summary{display:none}.tips{position:absolute;border-radius:.25rem;padding:.5rem;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);--bg-opacity:1;background-color:#4a5568;background-color:rgba(74,85,104,var(--bg-opacity));z-index:10;white-space:nowrap;--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity))}.tips-key{font-weight:600}.tips-val{--text-opacity:1;color:#d69e2e;color:rgba(214,158,46,var(--text-opacity))}.tips-link{--text-opacity:1;color:#f56565;color:rgba(245,101,101,var(--text-opacity));cursor:pointer}.tips-link:hover{--text-opacity:1;color:#fc8181;color:rgba(252,129,129,var(--text-opacity))}.menu{padding:.5rem;text-align:right;--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity));user-select:none}.menu>span{display:inline-block;padding:.25rem .5rem;margin-right:.25rem;border-radius:.25rem;border-width:1px;cursor:pointer}.menu>span.toggle.active,.menu>span:not(.toggle){--bg-opacity:1;background-color:#4a5568;background-color:rgba(74,85,104,var(--bg-opacity))}";
	
	var css_248z$1 = ".cm-s-material-darker.CodeMirror{background-color:#212121;color:#eff}.cm-s-material-darker .CodeMirror-gutters{background:#212121;color:#545454;border:none}.cm-s-material-darker .CodeMirror-guttermarker,.cm-s-material-darker .CodeMirror-guttermarker-subtle,.cm-s-material-darker .CodeMirror-linenumber{color:#545454}.cm-s-material-darker .CodeMirror-cursor{border-left:1px solid #fc0}.cm-s-material-darker.CodeMirror-focused div.CodeMirror-selected,.cm-s-material-darker div.CodeMirror-selected{background:rgba(97,97,97,.2)}.cm-s-material-darker .CodeMirror-line::selection,.cm-s-material-darker .CodeMirror-line>span::selection,.cm-s-material-darker .CodeMirror-line>span>span::selection{background:rgba(128,203,196,.2)}.cm-s-material-darker .CodeMirror-line::-moz-selection,.cm-s-material-darker .CodeMirror-line>span::-moz-selection,.cm-s-material-darker .CodeMirror-line>span>span::-moz-selection{background:rgba(128,203,196,.2)}.cm-s-material-darker .CodeMirror-activeline-background{background:rgba(0,0,0,.5)}.cm-s-material-darker .cm-keyword{color:#c792ea}.cm-s-material-darker .cm-operator{color:#89ddff}.cm-s-material-darker .cm-variable-2{color:#eff}.cm-s-material-darker .cm-type,.cm-s-material-darker .cm-variable-3{color:#f07178}.cm-s-material-darker .cm-builtin{color:#ffcb6b}.cm-s-material-darker .cm-atom{color:#f78c6c}.cm-s-material-darker .cm-number{color:#ff5370}.cm-s-material-darker .cm-def{color:#82aaff}.cm-s-material-darker .cm-string{color:#c3e88d}.cm-s-material-darker .cm-string-2{color:#f07178}.cm-s-material-darker .cm-comment{color:#545454}.cm-s-material-darker .cm-variable{color:#f07178}.cm-s-material-darker .cm-tag{color:#ff5370}.cm-s-material-darker .cm-meta{color:#ffcb6b}.cm-s-material-darker .cm-attribute,.cm-s-material-darker .cm-property{color:#c792ea}.cm-s-material-darker .cm-qualifier,.cm-s-material-darker .cm-type,.cm-s-material-darker .cm-variable-3{color:#decb6b}.cm-s-material-darker .cm-error{color:#fff;background-color:#ff5370}.cm-s-material-darker .CodeMirror-matchingbracket{text-decoration:underline;color:#fff!important}";
	
	const React = VM;
	const gap = 5;
	const formatter = {
		options: [{
			key: 'show-quotes',
			title: '"',
			def: true
		}, {
			key: 'show-commas',
			title: ',',
			def: true
		}]
	};
	const classMap = {
		boolean: 'cm-atom',
		null: 'cm-atom',
		number: 'cm-number',
		string: 'cm-string'
	};
	const config = { ...formatter.options.reduce((res, item) => {
			res[item.key] = item.def;
			return res;
		}, {}),
		...GM_getValue('config')
	};
	if (testRules([// text/javascript - file:///foo/bar.js
	/^(?:text|application)\/(?:.*?\+)?(?:plain|json|javascript)$/], document.contentType)) formatJSON();
	GM_registerMenuCommand('Toggle JSON format', formatJSON);
	
	function testRules(rules, contentType) {
		for (const rule of rules) {
			if (typeof rule === 'string') {
				if (rule === contentType) return true;
			} else if (typeof rule?.test === 'function') {
				if (rule.test(contentType)) return true;
			}
		}
	
		return false;
	}
	
	function createQuote() {
		return /*#__PURE__*/React.createElement("span", {
			className: "subtle quote"
		}, "\"");
	}
	
	function createComma() {
		return /*#__PURE__*/React.createElement("span", {
			className: "subtle comma"
		}, ",");
	}
	
	function isColor(str) {
		return /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str);
	}
	
	function tokenize(raw) {
		const skipWhitespace = index => {
			while (index < raw.length && ' \t\r\n'.includes(raw[index])) index += 1;
	
			return index;
		};
	
		const expectIndex = index => {
			if (index < raw.length) return index;
			throw new Error('Unexpected end of input');
		};
	
		const expectChar = (index, white, black) => {
			const ch = raw[index];
	
			if (white && !white.includes(ch) || black && black.includes(ch)) {
				throw new Error(`Unexpected token "${ch}" at ${index}`);
			}
	
			return ch;
		};
	
		const findWord = (index, words) => {
			for (const word of words) {
				if (raw.slice(index, index + word.length) === word) {
					return word;
				}
			}
		};
	
		const expectSpaceAndCharIndex = (index, white, black) => {
			const i = expectIndex(skipWhitespace(index));
			expectChar(i, white, black);
			return i;
		};
	
		const parseString = start => {
			let j;
	
			for (j = start + 1; true; j = expectIndex(j + 1)) {
				const ch = raw[j];
				if (ch === '"') break;
	
				if (ch === '\\') {
					j = expectIndex(j + 1);
					const ch2 = raw[j];
	
					if (ch2 === 'x') {
						j = expectIndex(j + 2);
					} else if (ch2 === 'u') {
						j = expectIndex(j + 4);
					}
				}
			}
	
			const source = raw.slice(start + 1, j);
			return {
				type: 'string',
				source,
				data: JSON.parse(raw.slice(start, j + 1)),
				color: isColor(source),
				start,
				end: j + 1
			};
		};
	
		const parseKeyword = start => {
			const nullWord = findWord(start, ['null']);
	
			if (nullWord) {
				return {
					type: 'null',
					source: 'null',
					data: null,
					start,
					end: start + 4
				};
			}
	
			const bool = findWord(start, ['true', 'false']);
	
			if (bool) {
				return {
					type: 'boolean',
					source: bool,
					data: bool === 'true',
					start,
					end: start + bool.length
				};
			}
	
			expectChar(start, '0');
		};
	
		const DIGITS = '0123456789';
	
		const findDecimal = (start, fractional) => {
			let i = start;
			if ('+-'.includes(raw[i])) i += 1;
			let j;
			let dot = -1;
	
			for (j = i; true; j = expectIndex(j + 1)) {
				const ch = expectChar(j, // there must be at least one digit
				// dot must not be the last character of a number, expecting a digit
				j === i || dot >= 0 && dot === j - 1 ? DIGITS : null, // there can be at most one dot
				!fractional || dot >= 0 ? '.' : null);
				if (ch === '.') dot = j;else if (!DIGITS.includes(ch)) break;
			}
	
			return j;
		};
	
		const parseNumber = start => {
			let i = findDecimal(start, true);
			const ch = raw[i];
	
			if (ch && ch.toLowerCase() === 'e') {
				i = findDecimal(i + 1);
			}
	
			const source = raw.slice(start, i);
			return {
				type: 'number',
				source,
				data: +source,
				start,
				end: i
			};
		};
	
		let parseItem;
	
		const parseArray = start => {
			const result = {
				type: 'array',
				data: [],
				start
			};
			let i = start + 1;
	
			while (true) {
				i = expectIndex(skipWhitespace(i));
				if (raw[i] === ']') break;
				if (result.data.length) i = expectSpaceAndCharIndex(i, ',') + 1;
				const item = parseItem(i);
				result.data.push(item);
				i = item.end;
			}
	
			result.end = i + 1;
			return result;
		};
	
		const parseObject = start => {
			const result = {
				type: 'object',
				data: [],
				start
			};
			let i = start + 1;
	
			while (true) {
				i = expectIndex(skipWhitespace(i));
				if (raw[i] === '}') break;
				if (result.data.length) i = expectSpaceAndCharIndex(i, ',') + 1;
				i = expectSpaceAndCharIndex(i, '"');
				const key = parseString(i);
				i = expectSpaceAndCharIndex(key.end, ':') + 1;
				const value = parseItem(i);
				result.data.push({
					key,
					value
				});
				i = value.end;
			}
	
			result.end = i + 1;
			return result;
		};
	
		parseItem = start => {
			const i = expectIndex(skipWhitespace(start));
			const ch = raw[i];
			if (ch === '"') return parseString(i);
			if (ch === '[') return parseArray(i);
			if (ch === '{') return parseObject(i);
			if ('-0123456789'.includes(ch)) return parseNumber(i);
			return parseKeyword(i);
		};
	
		const result = parseItem(0);
		const end = skipWhitespace(result.end);
		if (end < raw.length) expectChar(end, []);
		return result;
	}
	
	function loadJSON() {
		const raw = document.body.innerText;
	
		try {
			// JSON
			const content = tokenize(raw);
			return {
				raw,
				content
			};
		} catch (e) {
			// not JSON
			console.error('Not JSON', e);
		}
	
		try {
			// JSONP
			const parts = raw.match(/^(.*?\w\s*\()(.+)(\)[;\s]*)$/);
			const content = tokenize(parts[2]);
			return {
				raw,
				content,
				prefix: /*#__PURE__*/React.createElement("span", {
					className: "subtle"
				}, parts[1].trim()),
				suffix: /*#__PURE__*/React.createElement("span", {
					className: "subtle"
				}, parts[3].trim())
			};
		} catch (e) {
			// not JSONP
			console.error('Not JSONP', e);
		}
	}
	
	function formatJSON() {
		if (formatter.formatted) return;
		formatter.formatted = true;
		formatter.data = loadJSON();
		if (!formatter.data) return;
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		formatter.style = GM_addStyle(css_248z + css_248z$1);
		formatter.root = /*#__PURE__*/React.createElement("div", {
			id: "json-formatter"
		});
		document.body.append(formatter.root);
		initTips();
		initMenu();
		bindEvents();
		generateNodes(formatter.data, formatter.root);
	}
	
	function generateNodes(data, container) {
		const rootSpan = /*#__PURE__*/React.createElement("span", null);
		const root = /*#__PURE__*/React.createElement("div", null, rootSpan);
		const pre = /*#__PURE__*/React.createElement("pre", {
			className: "CodeMirror cm-s-material-darker"
		}, root);
		formatter.pre = pre;
		const queue = [{
			el: rootSpan,
			elBlock: root,
			...data
		}];
	
		while (queue.length) {
			const item = queue.shift();
			const {
				el,
				content,
				prefix,
				suffix
			} = item;
			if (prefix) el.append(prefix);
	
			if (content.type === 'array') {
				queue.push(...generateArray(item));
			} else if (content.type === 'object') {
				queue.push(...generateObject(item));
			} else {
				const {
					type,
					color
				} = content;
				const children = [];
				if (type === 'string') children.push(createQuote());
				if (color) children.push( /*#__PURE__*/React.createElement("span", {
					className: "color",
					style: `background-color: ${content.data}`
				}));
				children.push(toString(content));
				if (type === 'string') children.push(createQuote());
				const className = [classMap[type], 'item'].filter(Boolean).join(' ');
				el.append( /*#__PURE__*/React.createElement("span", {
					className: className,
					"data-type": type,
					"data-value": content.data
				}, children));
			}
	
			if (suffix) el.append(suffix);
		}
	
		container.append(pre);
		updateView();
	}
	
	function toString(content) {
		return `${content.source}`;
	}
	
	function setFolder(el, length) {
		if (length) {
			el.classList.add('complex');
			el.append( /*#__PURE__*/React.createElement("div", {
				className: "folder"
			}, '\u25b8'), /*#__PURE__*/React.createElement("span", {
				className: "summary"
			}, `// ${length} items`));
		}
	}
	
	function generateArray({
		el,
		elBlock,
		content
	}) {
		const elContent = content.data.length && /*#__PURE__*/React.createElement("div", {
			className: "content"
		});
		setFolder(elBlock, content.data.length);
		el.append( /*#__PURE__*/React.createElement("span", {
			className: "bracket"
		}, "["), elContent || ' ', /*#__PURE__*/React.createElement("span", {
			className: "bracket"
		}, "]"));
		return content.data.map((item, i) => {
			const elValue = /*#__PURE__*/React.createElement("span", null);
			const elChild = /*#__PURE__*/React.createElement("div", null, elValue);
			elContent.append(elChild);
			if (i < content.data.length - 1) elChild.append(createComma());
			return {
				el: elValue,
				elBlock: elChild,
				content: item
			};
		});
	}
	
	function generateObject({
		el,
		elBlock,
		content
	}) {
		const elContent = content.data.length && /*#__PURE__*/React.createElement("div", {
			className: "content"
		});
		setFolder(elBlock, content.data.length);
		el.append( /*#__PURE__*/React.createElement("span", {
			className: "bracket"
		}, '{'), elContent || ' ', /*#__PURE__*/React.createElement("span", {
			className: "bracket"
		}, '}'));
		return content.data.map(({
			key,
			value
		}, i) => {
			const elValue = /*#__PURE__*/React.createElement("span", null);
			const elChild = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
				className: "cm-property item",
				"data-type": key.type
			}, createQuote(), key.data, createQuote()), ': ', elValue);
			if (i < content.data.length - 1) elChild.append(createComma());
			elContent.append(elChild);
			return {
				el: elValue,
				content: value,
				elBlock: elChild
			};
		});
	}
	
	function updateView() {
		formatter.options.forEach(({
			key
		}) => {
			formatter.pre.classList[config[key] ? 'add' : 'remove'](key);
		});
	}
	
	function removeEl(el) {
		el.remove();
	}
	
	function initMenu() {
		const handleCopy = () => {
			GM_setClipboard(formatter.data.raw);
		};
	
		const handleMenuClick = e => {
			const el = e.target;
			const {
				key
			} = el.dataset;
	
			if (key) {
				config[key] = !config[key];
				GM_setValue('config', config);
				el.classList.toggle('active');
				updateView();
			}
		};
	
		formatter.root.append( /*#__PURE__*/React.createElement("div", {
			className: "menu",
			onClick: handleMenuClick
		}, /*#__PURE__*/React.createElement("span", {
			onClick: handleCopy
		}, "Copy"), formatter.options.map(item => /*#__PURE__*/React.createElement("span", {
			className: `toggle${config[item.key] ? ' active' : ''}`,
			dangerouslySetInnerHTML: {
				__html: item.title
			},
			"data-key": item.key
		}))));
	}
	
	function initTips() {
		const tips = /*#__PURE__*/React.createElement("div", {
			className: "tips",
			onClick: e => {
				e.stopPropagation();
			}
		});
	
		const hide = () => removeEl(tips);
	
		document.addEventListener('click', hide, false);
		formatter.tips = {
			node: tips,
			hide,
	
			show(range) {
				const {
					scrollTop
				} = document.body;
				const rects = range.getClientRects();
				let rect;
	
				if (rects[0].top < 100) {
					rect = rects[rects.length - 1];
					tips.style.top = `${rect.bottom + scrollTop + gap}px`;
					tips.style.bottom = '';
				} else {
					[rect] = rects;
					tips.style.top = '';
					tips.style.bottom = `${formatter.root.offsetHeight - rect.top - scrollTop + gap}px`;
				}
	
				tips.style.left = `${rect.left}px`;
				const {
					type,
					value
				} = range.startContainer.dataset;
				tips.innerHTML = '';
				tips.append( /*#__PURE__*/React.createElement("span", {
					className: "tips-key"
				}, "type"), ': ', /*#__PURE__*/React.createElement("span", {
					className: "tips-val",
					dangerouslySetInnerHTML: {
						__html: type
					}
				}));
	
				if (type === 'string') {
					const handleCopyParsed = () => {
						GM_setClipboard(value);
					};
	
					tips.append( /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
						className: "tips-link",
						onClick: handleCopyParsed
					}, "Copy parsed"));
	
					if (/^(https?|ftps?):\/\/\S+/.test(value)) {
						tips.append( /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
							className: "tips-link",
							href: value,
							target: "_blank",
							rel: "noopener noreferrer"
						}, "Open link"));
					}
				}
	
				formatter.root.append(tips);
			}
	
		};
	}
	
	function selectNode(node) {
		const selection = window.getSelection();
		selection.removeAllRanges();
		const range = document.createRange();
		range.setStartBefore(node.firstChild);
		range.setEndAfter(node.lastChild);
		selection.addRange(range);
		return range;
	}
	
	function bindEvents() {
		formatter.root.addEventListener('click', e => {
			e.stopPropagation();
			const {
				target
			} = e;
	
			if (target.classList.contains('item')) {
				formatter.tips.show(selectNode(target));
			} else {
				formatter.tips.hide();
			}
	
			if (target.classList.contains('folder')) {
				target.parentNode.classList.toggle('collapse');
			}
		}, false);
	}
	
	}());
	