// ==UserScript==
// @name         ChatGPT: Shortcut Anywhere
// @name:zh-CN   ChatGPT Shortcut Anywhere
// @name:ja      どこでもChatGPTショートカット
// @name:pt      Atalho ChatGPT Em Qualquer Lugar
// @namespace    https://egore.url.lol/userscripts
// @version      0.0.4
// @description  Toggle AiShort sidebar on the page
// @author       BensonLi
// @description:zh-CN ChatGPT Shortcut 扩展的增强版，任意网站都能打开 AiShort 侧边栏
// @description:ja ChatGPT Shortcut 拡張の強化版、任意のウェブサイトで AiShort サイドバーを開くことができます
// @description:pt Versão aprimorada da extensão ChatGPT Shortcut, abre a barra lateral AiShort em qualquer site
// @match        *://chat.openai.com/*
// @match        *://claude.ai/*
// @match        *://bard.google.com/*
// @match        *://yiyan.baidu.com/*
// @match        *://chatglm.cn/*
// @exclude      *://www.aishort.top/*
// @icon         https://raw.githubusercontent.com/madkarmaa/automatic-chatgpt-dan/master/images/icon.png
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        // Check for existing extension to prevent duplicate rendering
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].src.includes('www.aishort.top')) {
                return;
            }
        }

        // You can directly set your preferred language by editing this variable.
        // For example, replace 'null' with 'zh' for Chinese, 'en' for English, 'ja' for Japanese, etc.
        // Supported language codes include: 'en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', and 'bn'.
        // If set to 'null', the script will automatically use the browser's default language.
        const userSelectedLanguage = null; // Example: const userSelectedLanguage = 'zh';

        // Array of available languages
        const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

        // Function to get the user-selected language or the browser's default language
        function getLanguage() {
            if (AVAILABLE_LANGUAGES.includes(userSelectedLanguage)) {
                return userSelectedLanguage;
            }
            const browserLanguage = navigator.language.split('-')[0];
            return AVAILABLE_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
        }

        // Determine the language to use
        const userLanguage = getLanguage();
        // Set the URL for the iframe based on the selected language
        const iframeUrl = userLanguage === 'zh' ? 'https://www.aishort.top/' : `https://www.aishort.top/${userLanguage}/`;

        // svg toggleIcon
        const toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        toggleIcon.setAttribute('viewBox', '0 0 1024 1024');
        toggleIcon.setAttribute('width', '30');
        toggleIcon.setAttribute('height', '30');
        toggleIcon.innerHTML = '<path d="M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z" fill="#5cac7c"></path><path d="M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z" fill="#5cac7c" opacity=".5"></path>';

        toggleIcon.style.position = 'fixed';
        toggleIcon.style.bottom = '60px';
        toggleIcon.style.right = '15px';
        toggleIcon.style.zIndex = '1000';
        toggleIcon.style.cursor = 'pointer';
        document.body.appendChild(toggleIcon);

        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

        if ((window.location.host === 'chat.openai.com') || (isChrome && window.location.host === 'bard.google.com')) {
            // Separate Window model
            toggleIcon.addEventListener('click', function() {
                window.open(iframeUrl, '_blank', 'width=500,height=700');
            });
        } else {
            // iframe model
            const iframe = document.createElement('iframe');
            iframe.style.width = '400px';
            iframe.style.height = '100%';
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.top = '0';
            iframe.style.zIndex = '999';
            iframe.style.border = 'none';
            iframe.style.display = 'none';
            iframe.src = iframeUrl;
            document.body.appendChild(iframe);

            toggleIcon.addEventListener('click', function() {
                // Toggle the display of the iframe
                iframe.style.display = (iframe.style.display === 'none') ? 'block' : 'none';
            });
        }};
})();