// ==UserScript==
// @name         H5Player Configs
// @namespace    https://github.com/xxxily/h5player
// @homepage     https://github.com/xxxily/h5player
// @version      0.0.1
// @description  HTML5 video player enhanced script custom configuration
// @author       ankvps
// @icon         https://cdn.jsdelivr.net/gh/xxxily/h5player@master/logo.png
// @match        *://*/*
// @exclude      *://yiyan.baidu.com/*
// @exclude      *://*.bing.com/search*
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL
// @downloadURL  https://update.greasyfork.org/scripts/455396/HTML5%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE.user.js
// @updateURL    https://update.greasyfork.org/scripts/455396/HTML5%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

/* Custom configuration */
const customConfiguration = {
  media: {
    autoPlay: false,
    playbackRate: 1,
    volume: 1,

    /* Whether to allow storage of playback progress */
    allowRestorePlayProgress: {

    },
    /* Video playback progress mapping table */
    progress: {}
  },
  hotkeys: [
    {
      desc: 'Web page full screen',
      key: 'shift+enter',
      command: 'setWebFullScreen',
      disabled: false
    },
    {
      desc: 'full screen',
      key: 'F',
      command: 'setFullScreen'
    },
    {
      desc: 'Switch to picture-in-picture mode',
      key: 'shift+p',
      command: 'togglePictureInPicture'
    },
    {
      desc: 'Video screenshot',
      key: 'shift+s',
      command: 'capture'
    },
    {
      desc: 'Enable or disable automatic playback progress recovery',
      key: 'shift+r',
      command: 'capture'
    },
    {
      desc: 'Vertical mirror flip',
      key: 'shift+m',
      command: 'setMirror',
      args: [true]
    },
    {
      desc: 'Horizontal mirror flip',
      key: 'm',
      command: 'setMirror'
    },
    {
      desc: 'Download audio and video files (experimental feature)',
      key: 'shift+d',
      command: 'mediaDownload'
    },
    {
      desc: 'Zoom out the video by -0.05',
      key: 'X',
      command: 'setScaleDown'
    },
    {
      desc: 'Zoom in the video +0.05',
      key: 'C',
      command: 'setScaleUp'
    },
    {
      desc: 'Restore video image',
      key: 'Z',
      command: 'resetTransform'
    },
    {
      desc: 'Move the screen 10px right',
      key: 'shift+l',
      command: 'setTranslateRight'
    },
    {
      desc: 'Move the screen 10px left',
      key: 'shift+h',
      command: 'setTranslateLeft'
    },
    {
      desc: 'Move the screen up 10px',
      key: 'shift+k',
      command: 'setTranslateUp'
    },
    {
      desc: 'Move the screen down 10px',
      key: 'shift+j',
      command: 'setTranslateDown'
    },
    {
      desc: 'Forward 5 seconds',
      key: 'arrowright',
      command: 'setCurrentTimeUp',
      disabled: true
    },
    {
      desc: 'Go back 5 seconds',
      key: 'arrowleft',
      command: 'setCurrentTimeDown',
      disabled: true
    },
    {
      desc: 'Forward 1 seconds',
      key: 'l',
      command: 'setCurrentTimeUp',
      args: [1]
    },
    {
      desc: 'Go back 1 seconds',
      key: 'h',
      command: 'setCurrentTimeDown',
      args: [-1]
    },
    {
      desc: 'Volume up 5%',
      key: 'arrowup',
      command: 'setVolumeUp',
      args: [0.05]
    },
    {
      desc: 'Volume down 5%',
      key: 'arrowdown',
      command: 'setVolumeDown',
      args: [-0.05]
    },
    {
      desc: 'Volume up 20%',
      key: 'ctrl+arrowup',
      command: 'setVolumeUp',
      args: [0.2]
    },
    {
      desc: 'Volume down 20%',
      key: 'ctrl+arrowdown',
      command: 'setVolumeDown',
      args: [-0.2]
    },
    {
      desc: 'Toggle pause/play',
      key: 'space',
      command: 'switchPlayStatus'
    },
    {
      desc: 'Slow down playback -0.1',
      key: 'x',
      command: 'setPlaybackRateDown',
      disabled: true,
    },
    {
      desc: 'Speed ​​up playback +0.1',
      key: 'c',
      command: 'setPlaybackRateUp',
      disabled: true,
    },
    {
      desc: 'Playback at normal speed',
      key: 'z',
      command: 'resetPlaybackRate',
      disabled: true,
    },
    {
      desc: 'Set playback speed to 1x',
      key: 'Digit1',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 1
    },
    {
      desc: 'Set playback speed to 1x',
      key: 'Numpad1',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 1
    },
    {
      desc: 'Set playback speed to 2x',
      key: 'Digit2',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 2
    },
    {
      desc: 'Set playback speed to 2x',
      key: 'Numpad2',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 2
    },
    {
      desc: 'Set playback speed to 3x',
      key: 'Digit3',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 3
    },
    {
      desc: 'Set playback speed to 3x',
      key: 'Numpad3',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 3
    },
    {
      desc: 'Set playback speed to 4x',
      key: 'Digit4',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 4
    },
    {
      desc: 'Set playback speed to 4x',
      key: 'Numpad4',
      command: 'setPlaybackRatePlus',
      disabled: true,
      args: 4
    },
    {
      desc: 'Next frame',
      key: 'F',
      command: 'freezeFrame',
      disabled: true,
      args: 1
    },
    {
      desc: 'previous frame',
      key: 'D',
      command: 'freezeFrame',
      disabled: true,
      args: -1
    },
    {
      desc: 'Increase brightness',
      key: 'E',
      command: 'setBrightnessUp'
    },
    {
      desc: 'Decrease brightness',
      key: 'W',
      command: 'setBrightnessDown'
    },
    {
      desc: 'Increase contrast',
      key: 'T',
      command: 'setContrastUp'
    },
    {
      desc: 'Decrease contrast',
      key: 'R',
      command: 'setContrastDown'
    },
    {
      desc: 'Increase saturation',
      key: 'U',
      command: 'setSaturationUp'
    },
    {
      desc: 'Decrease saturation',
      key: 'Y',
      command: 'setSaturationDown'
    },
    {
      desc: 'Increase hue',
      key: 'O',
      command: 'setHueUp'
    },
    {
      desc: 'Reduce hue',
      key: 'I',
      command: 'setHueDown'
    },
    {
      desc: 'Blur increased by 1 px',
      key: 'K',
      command: 'setBlurUp',
      disabled: true
    },
    {
      desc: 'Blur decreased by 1 px',
      key: 'J',
      command: 'setBlurDown',
      disabled: true
    },
    {
      desc: 'Image reset',
      key: 'Q',
      command: 'resetFilterAndTransform'
    },
    {
      desc: 'Rotate the image 90 degrees',
      key: 'S',
      command: 'setRotate'
    },
    {
      desc: 'Play next episode',
      key: 'N',
      command: 'setNextVideo'
    },
    {
      desc: 'Execute JS script',
      key: 'ctrl+j ctrl+s',
      command: () => {
        alert('Custom JS script - demo');
      },
      when: ''
    }
  ],
  enhance: {
    /**
     * If the default speed control logic is not disabled,
     * the speed will be easily reset when switching between multiple videos,
     * so this option is enabled by default
     */
    blockSetPlaybackRate: true,
    blockSetCurrentTime: false,
    blockSetVolume: false,
    allowExperimentFeatures: false
  },
  debug: false
};

/**
* Task Control Center
* Used to configure tasks that cannot be handled universally.
* For example, different websites have different full-screen methods, so you must use the website's
* own full-screen logic to ensure proper functioning of subtitles, bullet comments, etc.
*/
const customTaskControlCenter = {
  /**
  * Configuration Example
  * The parent key name corresponds to the first-level domain name.
  * The child key name corresponds to the function name. The key value corresponds to the click selector or function to be called for that function.
  * All child key values ​​support selector triggering or function call.
  * If a child is configured, the child configuration logic will be used for operation; otherwise, the default logic will be used.
  * Note: The include and exclude child keys are excluded; they are used for URL range matching.
  */
  'demo.demo': {
    fullScreen: '.fullscreen-btn',
    exitFullScreen: '.exit-fullscreen-btn',
    webFullScreen: function () { },
    exitWebFullScreen: '.exit-fullscreen-btn',
    autoPlay: '.player-start-btn',
    pause: '.player-pause',
    play: '.player-play',
    switchPlayStatus: '.player-play',
    playbackRate: function () { },
    currentTime: function () { },
    addCurrentTime: '.add-currenttime',
    subtractCurrentTime: '.subtract-currenttime',
    /**
     * How to execute custom shortcut keys.
     * If it is a key combination, it must be in the order of ctrl-->shift-->alt.
     * No keys can be omitted. The key names must be all lowercase.
     */
    shortcuts: {
      /* Register shortcut keys to execute custom callback operations */
      register: [
        'ctrl+shift+alt+c',
        'ctrl+shift+c',
        'ctrl+alt+c',
        'ctrl+c',
        'c'
      ],
      /* Custom shortcut key callback operation */
      callback: function (h5Player, taskConf, data) {
        const { event, player } = data;
        console.log(event, player);
      }
    },
    /**
     * The path information that needs to be included under the current domain name.
     * By default, all paths under the entire domain name are available. Must be a regular expression
     */
    include: /^.*/,
    /**
     * Path information to be excluded under the current domain name.
     * By default, no path is excluded. Must be a regular expression
     */
    exclude: /\t/
  },
  'netflix.com': {
    // Stop using all functions of the plugin under Netflix
    // disable: true,
    fullScreen: 'button.button-nfplayerFullscreen',
    addCurrentTime: 'button.button-nfplayerFastForward',
    subtractCurrentTime: 'button.button-nfplayerBackTen',
    /**
     * Use Netflix's own speed control, because the current plug-in cannot solve the service interruption problem caused by speed control
     * https://github.com/xxxily/h5player/issues/234
     * https://github.com/xxxily/h5player/issues/317
     * https://github.com/xxxily/h5player/issues/381
     * https://github.com/xxxily/h5player/issues/179
     * https://github.com/xxxily/h5player/issues/147
     */
    playbackRate: true,
    shortcuts: {
      /**
       * TODO
       * Some Netflix users prefer to use the F key to go full screen, so the F key's next frame function is disabled here.
       * Once custom configuration is enabled, users will be able to decide whether to disable this function.
       */
      register: [
        'f'
      ],
      callback: function (h5Player, taskConf, data) {
        return true;
      }
    }
  }
};

/* Register custom configuration information */
const pageWin = window.unsafeWindow;
if (pageWin) {
  const configuration = { customConfiguration, customTaskControlCenter };
  pageWin.__h5PlayerCustomConfiguration__ = configuration;
  pageWin.__setH5PlayerCustomConfiguration__ instanceof Function && pageWin.__setH5PlayerCustomConfiguration__(configuration, 'External');
}
