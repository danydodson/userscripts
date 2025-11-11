// ==UserScript==
// @name         TikTok Enhancer Plus
// @namespace    https://greasyfork.org/en/users/123456-eliminater74
// @version      2.4
// @description  Enhance tiktok web to download videos, dark mode, auto scroll and more.
// @author       Eliminater74
// @license      MIT
// @match        https://www.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        GM_download
// @run-at       document-end
// @downloadURL  https://update.greasyfork.org/scripts/537994/TikTok%20Enhancer%20Plus.user.js
// @updateURL    https://update.greasyfork.org/scripts/537994/TikTok%20Enhancer%20Plus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS_KEY = 'tiktokEnhancerSettings';
  const UI_GEAR_KEY = 'tiktokEnhancer_ui_gear';
  const UI_MENU_KEY = 'tiktokEnhancer_ui_menu';

  const defaultSettings = {
    darkMode: false,
    autoMute: false,
    autoLoop: false,
    autoScroll: false,
    removeAds: true,
    wideMode: false,
    blobRecorder: false   // <-- new: enable Record/Stop button + "r" hotkey
  };

  const config = { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));

  // ----------------- utils -----------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const once = (id, nodeMaker) => {
    let el = document.getElementById(id);
    if (!el) {
      el = nodeMaker();
      el.id = id;
      (el.tagName === 'STYLE' ? document.head : document.body).appendChild(el);
    }
    return el;
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const safeTitle = (s) => (s || 'TikTok').replace(/[\\/:*?"<>|]+/g, '').slice(0, 80) || 'TikTok';

  // checkbox id map (fixes earlier toggle bugs)
  const settingToCheckboxId = {
    darkMode: 'toggle-dark',
    autoMute: 'toggle-mute',
    autoLoop: 'toggle-loop',
    autoScroll: 'toggle-scroll',
    removeAds: 'toggle-ads',
    wideMode: 'toggle-wide',
    blobRecorder: 'toggle-blobrec'
  };

  // -------------- draggable helper --------------
  function makeDraggable(el, storageKey, fallbackPos) {
    el.style.position = 'fixed';
    el.style.touchAction = 'none';

    // restore position
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        el.style.left = saved.x + 'px';
        el.style.top = saved.y + 'px';
      } else if (fallbackPos) {
        const { x, y } = fallbackPos();
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      }
    } catch { }

    let startX, startY, startLeft, startTop, moved = false;

    const onDown = (e) => {
      moved = false;
      const p = e.touches ? e.touches[0] : e;
      startX = p.clientX; startY = p.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    };

    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      if (e.cancelable) e.preventDefault();
      moved = true;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      const newX = clamp(startLeft + dx, 0, window.innerWidth - el.offsetWidth);
      const newY = clamp(startTop + dy, 0, window.innerHeight - el.offsetHeight);
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      const rect = el.getBoundingClientRect();
      localStorage.setItem(storageKey, JSON.stringify({ x: rect.left, y: rect.top }));
      if (moved) {
        el.dataset.justDragged = '1';
        setTimeout(() => delete el.dataset.justDragged, 150);
      }
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
  }

  // ---------------- UI: menu + gear ----------------
  function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'tiktok-enhancer-menu';
    menu.style.cssText = `
      position: fixed;
      background: #222;
      color: white;
      padding: 10px;
      border-radius: 10px;
      z-index: 999999;
      font-family: sans-serif;
      box-shadow: 0 0 10px #000;
      display: none;
      line-height: 1.8;
      user-select: none;
      width: 230px;
    `;
    menu.innerHTML = /*html*/`
      <div style="cursor:move; font-weight:600; margin-bottom:6px;">TikTok Enhancer • Menu</div>
      <label><input type="checkbox" id="toggle-dark"> Dark Mode</label><br>
      <label><input type="checkbox" id="toggle-mute"> Auto Mute</label><br>
      <label><input type="checkbox" id="toggle-loop"> Auto Loop</label><br>
      <label><input type="checkbox" id="toggle-scroll"> Auto Scroll</label><br>
      <label><input type="checkbox" id="toggle-ads"> Remove Ads</label><br>
      <label><input type="checkbox" id="toggle-wide"> Wide Mode</label><br>
      <label><input type="checkbox" id="toggle-blobrec"> Blob Recorder (WebM)</label><br>
      <hr style="border-color:#444">
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button id="save-settings">💾 Backup</button>
        <button id="load-settings">📂 Restore</button>
        <button id="export-settings">⬇ Export JSON</button>
        <button id="import-settings">⬆ Import JSON</button>
        <input id="import-file" type="file" accept="application/json" style="display:none">
      </div>
    `;
    document.body.appendChild(menu);

    makeDraggable(menu, UI_MENU_KEY, () => ({
      x: window.innerWidth - 260,
      y: window.innerHeight - 260
    }));

    const gear = document.createElement('div');
    gear.textContent = '⚙️';
    gear.style.cssText = `
      position: fixed;
      font-size: 24px;
      z-index: 999998;
      cursor: pointer;
      background: #333;
      color: white;
      padding: 5px 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px #000;
    `;
    document.body.appendChild(gear);
    makeDraggable(gear, UI_GEAR_KEY, () => ({
      x: window.innerWidth - 70,
      y: window.innerHeight - 70
    }));

    gear.addEventListener('click', () => {
      if (gear.dataset.justDragged) return;
      menu.style.display = (menu.style.display === 'none' || !menu.style.display) ? 'block' : 'none';
    });

    // bind checkboxes
    Object.entries(settingToCheckboxId).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = !!config[key];
        el.addEventListener('change', () => {
          config[key] = el.checked;
          saveSettings();
          applySettings();
        });
      }
    });

    // backup / restore
    $('#save-settings').onclick = () => {
      localStorage.setItem(SETTINGS_KEY + '_backup', JSON.stringify(config));
      alert('Settings backed up locally.');
    };
    $('#load-settings').onclick = () => {
      const backup = JSON.parse(localStorage.getItem(SETTINGS_KEY + '_backup') || '{}');
      Object.assign(config, backup);
      saveSettings();
      Object.entries(settingToCheckboxId).forEach(([k, id]) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!config[k];
      });
      applySettings();
    };

    // export / import JSON
    $('#export-settings').onclick = () => {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `tiktok-enhancer-settings-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    const importFile = $('#import-file');
    $('#import-settings').onclick = () => importFile.click();
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const incoming = JSON.parse(text);
        Object.keys(defaultSettings).forEach(k => {
          if (typeof incoming[k] === 'boolean') config[k] = incoming[k];
        });
        saveSettings();
        Object.entries(settingToCheckboxId).forEach(([k, id]) => {
          const el = document.getElementById(id);
          if (el) el.checked = !!config[k];
        });
        applySettings();
        alert('Settings imported.');
      } catch (err) {
        alert('Failed to import settings: ' + err);
      } finally {
        importFile.value = '';
      }
    });
  }

  // -------------- applySettings (styles + timers) --------------
  let adSweepTimer = null;

  function applySettings() {
    // Dark mode via invert
    document.documentElement.style.filter = config.darkMode ? 'invert(1) hue-rotate(180deg)' : '';
    $$('img, video, canvas').forEach(el => {
      el.style.filter = config.darkMode ? 'invert(1) hue-rotate(180deg)' : '';
    });

    // Remove Ads (single managed timer)
    if (config.removeAds) {
      if (!adSweepTimer) {
        adSweepTimer = setInterval(() => {
          const adSelectors = [
            '[data-e2e*="sponsored"]',
            '[data-e2e="search-hot"]',
            '[data-e2e="trending"]',
            '[data-testid*="trending"]',
            'a[href*="/sponsor"]',
            'a[href*="utm_source="]',
            '.tiktok-1soki6-DivAdWrapper', '.ad-wrapper', '[class*="ad-"]'
          ];
          adSelectors.forEach(sel => $$(sel).forEach(n => n.remove()));
        }, 1200);
      }
    } else if (adSweepTimer) {
      clearInterval(adSweepTimer);
      adSweepTimer = null;
    }

    // Wide mode – single style node
    const style = once('tiktok-enhancer-wide-style', () => document.createElement('style'));
    style.textContent = config.wideMode ? `
      #app, main, body, html { max-width: 100% !important; width: 100% !important; }
      main > div, #app > div { max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
      [data-e2e="feed-list"], [data-e2e="search-video"], [data-e2e="recommend-list"], [class*="feed"]
      { max-width: 100vw !important; width: 100vw !important; }
    ` : '';
  }

  // ---------------- Blob Recorder (WebM) ----------------
  let activeRecorder = null;
  let recordedChunks = [];

  function startRecordingFromVideo(video, filenameBase = 'TikTok_Record') {
    if (!window.MediaRecorder) { alert('MediaRecorder not supported in this browser.'); return; }
    if (!video) { alert('No video element found.'); return; }
    if (activeRecorder) { alert('Already recording.'); return; }

    try {
      const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream?.();
      if (!stream) throw new Error('Unable to capture stream from the video element.');

      // ensure playback (muting the element also mutes the capture, so unmute if needed)
      if (video.muted) video.muted = false;

      recordedChunks = [];
      const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      mr.ondataavailable = (e) => { if (e.data && e.data.size) recordedChunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `${filenameBase}_${ts}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        activeRecorder = null;
        recordedChunks = [];
      };
      mr.start(1000);
      activeRecorder = mr;
      video.play().catch(() => { });
    } catch (err) {
      console.error(err);
      alert('Failed to start recording: ' + err.message);
    }
  }

  function stopRecording() {
    if (activeRecorder) activeRecorder.stop();
    else alert('Not recording.');
  }

  // ---------------- video wiring ----------------
  function injectDownload(video) {
    if (!video || video.dataset.enhanced) return;
    video.dataset.enhanced = 'true';

    if (config.autoMute) video.muted = true;
    if (config.autoScroll) {
      video.addEventListener('ended', () => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }), { once: true });
    }
    if (config.autoLoop) {
      video.addEventListener('ended', () => { video.currentTime = 0; video.play().catch(() => { }); });
    }

    const btnId = 'tiktok-download-btn';
    const placeButtons = () => {
      const src = video.currentSrc || video.src;
      if (!src) return;

      const existing = document.getElementById(btnId);
      if (existing) existing.remove();

      const wrap = document.createElement('div');
      wrap.id = btnId;
      wrap.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        z-index: 999999;
      `;

      // Download button (direct URLs only)
      const dl = document.createElement('button');
      dl.textContent = '⬇ Download';
      dl.onclick = () => {
        const url = video.currentSrc || video.src;
        if (!url) return;
        if (url.startsWith('blob:')) {
          alert('Blob stream detected. Use Record to capture as WebM.');
        } else {
          GM_download(url, `TikTok_${Date.now()}.mp4`);
        }
      };
      dl.style.cssText = `background:#e11; color:white; padding:6px 12px; border:none; border-radius:6px; cursor:pointer; margin-right:5px;`;

      // Audio-only (placeholder)
      const audioBtn = document.createElement('button');
      audioBtn.textContent = '🎵 Audio';
      audioBtn.onclick = () => alert('Audio-only download not yet implemented. Coming soon!');
      audioBtn.style.cssText = `background:#333;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;`;

      wrap.append(dl, audioBtn);

      // Record/Stop (if enabled)
      if (config.blobRecorder) {
        const recBtn = document.createElement('button');
        recBtn.textContent = '⏺ Record';
        recBtn.style.cssText = `background:#0a0; color:white; padding:6px 12px; border:none; border-radius:6px; cursor:pointer; margin-left:5px;`;
        let recording = false;
        recBtn.onclick = () => {
          if (!recording) {
            recording = true;
            recBtn.textContent = '⏹ Stop';
            startRecordingFromVideo(video, safeTitle(document.title));
          } else {
            recording = false;
            recBtn.textContent = '⏺ Record';
            stopRecording();
          }
        };
        wrap.appendChild(recBtn);
      }

      document.body.appendChild(wrap);
    };

    if (video.readyState >= 2) placeButtons();
    else {
      const onCanPlay = () => { placeButtons(); video.removeEventListener('canplay', onCanPlay); };
      video.addEventListener('canplay', onCanPlay);
    }
  }

  function monitorVideos() {
    $$('video').forEach(injectDownload);
    const observer = new MutationObserver(() => {
      $$('video').forEach(injectDownload);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ---------------- hotkeys ----------------
  function keyShortcuts() {
    document.addEventListener('keydown', e => {
      const vid = $('video');
      if (!vid) return;
      if (e.key === 'd') {
        const url = vid.currentSrc || vid.src;
        if (url && !url.startsWith('blob:')) GM_download(url, `TikTok_${Date.now()}.mp4`);
        else alert('Blob stream — use Record (WebM).');
      }
      if (e.key === 'm') vid.muted = !vid.muted;
      if (e.key === 't') {
        config.darkMode = !config.darkMode; saveSettings(); applySettings();
      }
      if (e.key === 'r' && config.blobRecorder) {
        if (!activeRecorder) startRecordingFromVideo(vid, safeTitle(document.title));
        else stopRecording();
      }
    });
  }

  // ---------------- init ----------------
  createMenu();
  applySettings();
  // monitorVideos();
  keyShortcuts();
})();
