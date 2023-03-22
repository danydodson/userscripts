// ==UserScript==
// @name          Instagram: Media Scroll Wall
// @namespace     driver8.net
// @author        driver8
// @license       GNU AGPLv3
// @description   Creates a scrollable wall of full-size images from any user's instagram page, "tagged" page, or the instagram homepage. Just click the "Load Images" button at the top of the list of images/posts.
// @match         *://*.instagram.com/*
// @version       0.2.4.2
// @grant         none
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?domain=instagram.com
// ==/UserScript==

(function () {
    'use strict'

    console.log('hi insta scroll')
    // https://www.instagram.com/graphql/query/?query_hash=<hash>&variables={%22shortcode%22:%22<shortcode>%22}
    // https://i.instagram.com/api/v1/usertags/0000000000/feed/?count=12&max_id=0000000000000000000


    const IMAGES_PER_QUERY = 12
    const NTH_TO_LAST_IMAGE = 3
    const HEIGHT_PCT = .8
    const WIDTH_PCT = .49
    const VID_VOLUME = 0.02
    var MODE = 'profile'
    const win = window
    var userId = win.userId
    var notLoaded = true
    const tempDiv = document.createElement('div')

    if (win.trustedTypes && win.trustedTypes.createPolicy) { // Feature testing
        win.trustedTypes.createPolicy('default', {
            createHTML: (str) => str
        })
    }

    function pickMode() {
        console.log('picking mode')
        if (document.location.href.match(/https:\/\/(www\.)?instagram.com\/?(\?|$|#)/)) {
            MODE = 'home'
            getQueryHash()
        } else if (document.location.href.match(/\/tagged\//)) {
            MODE = 'tagged'
            getUserId()
        } else if (document.location.href.match(/\/explore\//)) {
            MODE = 'explore'
            console.log('"Explore" loading not implemented yet!')
            //getQueryHash();
        } else if (document.location.href.match(/https:\/\/(www\.)?instagram.com\/p\//)) {
            MODE = 'post'
        } else {
            MODE = 'profile'
            getUserId()
        }
        console.log('MODE', MODE)
    }

    function getUserId() {
        //console.log('getUserId');
        userId = userId || document.body.innerHTML.match(/profilePage_(\d+)/)?.[1]
        userId = userId || document.body.innerHTML.match(/<a author_id="(\d+)" class="heKAw"/)?.[1]
        if (userId) {
            console.log('userId', userId)
            getQueryHash()
        } else {
            let req = indexedDB.open('redux')
            req.onsuccess = function (evt) {
                console.log('req evt', evt)
                let db = req.result
                let os = db.transaction("paths")?.objectStore("paths")
                let req2 = db.transaction("paths")?.objectStore("paths")?.get('users.usernameToId')
                req2.onsuccess = function (evt) {
                    console.log('db evt', evt)
                    let result = req2?.result
                    let userName = document.location.href.match(/https:\/\/(?:www\.)?instagram.com\/([^\/]{3,})/)?.[1]
                    console.log('userName', userName)
                    userId = result?.[userName]
                    if (userId) {
                        getQueryHash()
                    } else {
                        requestUserId()
                        console.log("Couldn't find user ID!")
                        return
                    }
                }
            }
        }
    }

    function requestUserId() {
        let loc = document.location.href
        if (loc.match(/https:\/\/(?:www\.)?instagram.com\/([^\/]{3,})\/?$/)) {
            loc += '?__a=1'
            fetch(loc)
                .then(resp => {
                    return resp.json()
                })
                .then(json => {
                    console.log('userId json', json)
                    userId = json?.graphql?.user?.id
                    if (userId) {
                        getQueryHash()
                    } else {
                        console.log("Couldn't find user ID!")
                        return
                    }
                })
        } else {
            console.log("URL doesn't match a profile page")
            return
        }
    }

    function getQueryHash() {
        console.log('getQueryHash')
        let allScripts = Array.from(document.getElementsByTagName('script'))
        let PostPageContainer = allScripts.find(el => el.src && el.src.match(/ProfilePageContainer.js/))
        let ConsumerLibCommons = allScripts.find(el => el.src && el.src.match(/ConsumerLibCommons.js/))
        let Consumer = allScripts.find(el => el.src && el.src.match(/Consumer.js/))

        let y8 = ''//allScripts.find(el => el.src && el.src.match(/\/v3iNkn4\/|ODje2xQc3d4\.js|\/y8\//))?.src;

        var query_hash = false,
            query_id = false

        if (ConsumerLibCommons) {
            fetch(ConsumerLibCommons.src)
                .then(resp => {
                    console.log('resp 1', resp)
                    return resp.text()
                })
                .then(text => {
                    query_id = text.match(/profilePosts\.byUserId\.get.*?queryId:"([a-f0-9]+)"/)?.[1] //profilePosts.byUserId.get(n))||void 0===s?void 0:s.pagination},queryId:"e5555555555555555555555555555508"
                    let app_id = text.match(/instagramWebDesktopFBAppId='(\d+)'/)?.[1]
                    let asbd_id = text.match(/ASBD_ID='(\d+)'/)?.[1]
                    query_id && notLoaded && loadImages(query_id, query_hash, app_id, asbd_id)
                })
        }

        if (PostPageContainer) {
            fetch(PostPageContainer.src)
                .then(resp => {
                    console.log('resp 2', resp)
                    return resp.text()
                })
                .then(text => {
                    query_id = text.match(/profilePosts\.byUserId\.get.*?queryId:"([a-f0-9]+)"/)?.[1] //profilePosts.byUserId.get(n))||void 0===s?void 0:s.pagination},queryId:"e5555555555555555555555555555508"
                    let app_id = text.match(/instagramWebDesktopFBAppId='(\d+)'/)?.[1]
                    let asbd_id = text.match(/ASBD_ID='(\d+)'/)?.[1]
                    query_id && notLoaded && loadImages(query_id, query_hash, app_id, asbd_id)
                })
        }

        // l.pagination},queryId:"15b55555555555555555555555555551"
        if (Consumer) {
            fetch(Consumer.src)
                .then(resp => {
                    console.log('resp 3', resp)
                    return resp.text()
                })
                .then(text => {
                    query_id = text.match(/profilePosts\.byUserId\.get[^;]+queryId:\s*"([a-f0-9]+)"/)?.[1] //text.match(/l\.pagination\},queryId:"([a-f0-9]+)"/); //const s="05555555555555555555555555555554",E="
                    let app_id = text.match(/instagramWebDesktopFBAppId='(\d+)'/)?.[1]
                    let asbd_id = text.match(/ASBD_ID='(\d+)'/)?.[1]
                    query_id && notLoaded && loadImages(query_id, query_hash, app_id, asbd_id)
                })
        }

        //let fberror = win?.require?.('PolarisAPI')?.fetchFBInfo('foo');
        let fberror = null;
        (function checkError() {
            if (fberror?._state == 2) {
                //console.log(typeof fberror?._value, '_value', fberror?._value);
                console.log(fberror)
                y8 = fberror?._value?.fileName
                y8 = y8 || fberror?._value?.stack?.match(/\((https[^\)]+)\)/)?.[1]
                y8 = y8 || Object.values(Object.values(win.pldmp)?.[0]).find(o => o.refs.length === 4 && o.url.match(/rsrc\.php.*\/[a-z]{2,3}_[A-Z]{2,3}\/[^\/.]{9,15}\.js/))
                if (y8) {
                    console.log('y8', y8)
                    fetch(y8)
                        .then(resp => {
                            console.log('resp 1', resp)
                            return resp.text()
                        })
                        .then(text => {
                            query_id = text.match(/,"regeneratorRuntime"\],\(function\(a,b,c,d,e,f,g\)\{f=0;var h="([a-f0-9]+)"/)?.[1]
                            query_id = query_id || text.match(/,"regeneratorRuntime"\],\(function\(a,b,c,d,e,f,g\)\{"use strict";f=0;var h="([a-f0-9]+)"/)?.[1]
                            query_id = query_id || text.match(/,"regeneratorRuntime"\],\(function\(a,b,c,d,e,f,g\)\{"use strict";e=0;f="([a-f0-9]+)"/)?.[1]
                            //query_id = query_id || text.match(/([a-z]{1,2})="([a-f0-9]{32})".*queryId:\1/)?.[2];
                            if (query_id && notLoaded) {
                                loadImages(query_id)
                            } else if (notLoaded) {
                                loadImages(-1)
                            }
                        })
                }
            } else {
                //window.setTimeout(checkError, 20);
                if (notLoaded) {
                    loadImages(-1)
                }
            }
        })()
    }

    // https://www.instagram.com/graphql/query/?query_hash=<queryhash>&variables=%7B%22id%22%3A%22<profle_id>%22%2C%22first%22%3A12%2C%22after%22%3A%22<after_code>%3D%3D%22%7D
    function loadImages(query_id, query_hash = 0, app_id = 936619743392459, asbd_id = 198387, after = null) {
        notLoaded = false
        console.log('id', query_id, 'hash', query_hash)

        // let userId = document.querySelector('head > meta[property="instapp:owner_user_id"]')?.content;
        let imageListQueryUrl
        let init = { responseType: 'json', credentials: 'include', referrerPolicy: 'no-referrer' }
        // if (MODE == 'profile') {
        //     if (!userId) {
        //         console.log("Couldn't find user ID!", userId);
        //         return;
        //     }
        //     let queryVariables = {"id": userId, "first": IMAGES_PER_QUERY};
        //     if (after) queryVariables.after = after;
        //     let queryVariablesString = encodeURIComponent(JSON.stringify(queryVariables));
        //     imageListQueryUrl = `https://www.instagram.com/graphql/query/?query_hash=${query_id}&variables=${queryVariablesString}`;
        if (MODE == 'profile') {
            if (!userId) {
                console.log("Couldn't find user ID!", userId)
                return
            }
            let queryVariables = { "id": userId, "first": IMAGES_PER_QUERY }
            if (after) queryVariables.after = after
            let queryVariablesString = encodeURIComponent(JSON.stringify(queryVariables))
            //https://i.instagram.com/api/v1/feed/user/696969696/?count=12&max_id=0000000000000000000_696969696
            imageListQueryUrl = `https://i.instagram.com/api/v1/feed/user/${userId}/?count=12`
            if (after) {
                imageListQueryUrl += `&max_id=${after}`
            }

            init.headers = {
                'X-IG-App-ID': app_id,
                'X-ASBD-ID': asbd_id,
                'X-CSRFToken': win._sharedData?.config.csrf_token
            }
        }
        if (MODE == 'tagged') {
            if (!userId) {
                console.log("Couldn't find user ID!", userId)
                return
            }
            imageListQueryUrl = `https://i.instagram.com/api/v1/usertags/${userId}/feed/?count=${IMAGES_PER_QUERY}`
            if (after) {
                imageListQueryUrl += `&max_id=${after}`
            }
            init.headers = {
                'X-IG-App-ID': app_id,
                'X-ASBD-ID': asbd_id,
                'X-CSRFToken': win._sharedData?.config.csrf_token
            }
        }
        if (MODE == 'home') {
            imageListQueryUrl = 'https://i.instagram.com/api/v1/feed/timeline/'
            //let fd = new FormData();
            let fd = new URLSearchParams()
            fd.set('is_async_ads_rti', 0)
            fd.set('is_async_ads_double_request', 0)
            fd.set('rti_delivery_backend', 0)
            fd.set('is_async_ads_in_headload_enabled', 0)
            fd.set('devide_id', win._sharedData?.device_id)
            if (after) {
                fd.set('max_id', after)
            }
            init.body = fd
            init.method = 'POST'
            init.headers = {
                'X-IG-App-ID': app_id,
                'X-ASBD-ID': asbd_id,
                'X-CSRFToken': win._sharedData?.config.csrf_token
            }
        }

        fetch(imageListQueryUrl, init)
            .then(resp => {
                console.log('json resp', resp)
                return resp.json()
            })
            .then(json => {
                console.log('json', json)

                let timelineMedia, end_cursor, mediaList

                timelineMedia = json.data?.user.edge_owner_to_timeline_media
                end_cursor = timelineMedia?.page_info.end_cursor || json.next_max_id
                mediaList = timelineMedia?.edges.map(n => n.node) || json.items || json.feed_items?.map(n => n.media_or_ad).filter(n => n)
                console.log('end_cursor', end_cursor, 'media list', mediaList)

                let bigContainer = document.querySelector('#igBigContainer')
                // Create the main container if it doesn't exist
                if (!bigContainer) {
                    tempDiv.innerHTML = `<div id="igBigContainer" style="background-color: #112;width: 100%;height: 100%;z-index: 999;position: fixed;top: 0;left: 0;overflow: scroll;">
                    <div id="igAllImages" style="display:block; text-align:center;"></div></div>`
                    bigContainer = tempDiv.firstElementChild
                    let newBody = document.createElement('body')
                    document.body = newBody
                    document.body.appendChild(bigContainer)
                    XMLHttpRequest.prototype.send = (evt) => {
                        //console.log('No send!');
                    }


                    let imgStyle = document.createElement('style')
                    imgStyle.type = 'text/css'
                    setMaxSize(imgStyle)
                    document.body.appendChild(imgStyle)
                    window.addEventListener('resize', evt => setMaxSize(imgStyle))
                    styleIt()
                }
                let innerContainer = bigContainer.firstElementChild

                console.log(mediaList)
                for (let media of mediaList) {
                    addMedia(media, innerContainer)
                }

                if (end_cursor) {
                    //console.log('end_cursor', end_cursor);
                    let triggerImage = document.querySelector('#igAllImages a:nth-last-of-type(3)') || document.querySelector('#igAllImages a:last-of-type')
                    bigContainer.onscroll = (evt) => {
                        let vh = document.documentElement.clientHeight || window.innerHeight || 0
                        if (triggerImage.getBoundingClientRect().top - 800 < vh) {
                            bigContainer.onscroll = null
                            console.log('loading next set of images')
                            loadImages(query_id, query_hash, app_id, asbd_id, end_cursor)
                        }

                    }
                }
            })
    }

    function getBestImage(media) {
        let bestUrl = null
        let bestSize = 0
        let list = media?.display_resources || media?.image_versions2?.candidates;;
        for (let m of list) {
            let w = m?.width || m?.config_width || 0
            let h = m?.height || m?.config_height || 0
            let size = Math.max(w, h)
            //console.log('size', size, m);
            if (size > bestSize) {
                bestSize = size
                bestUrl = m?.url || m?.src
            }
        }
        //best = media?.display_resources?.reduce((a, b) => Math.max(a.width, a.height) > Math.max(b.width, b.height) ? a : b).src;
        return bestUrl
    }

    function addMedia(media, container) {
        //console.log('media', media);
        let shortcode = media?.shortcode || media?.code
        let medias = media?.edge_sidecar_to_children?.edges?.map(n => n.node) ||
            media?.carousel_media ||
            [media]

        for (let i = 0; i < medias.length; i++) {
            let m = medias[i]
            let a = document.createElement('a')
            a.href = `https://www.instagram.com/p/${shortcode}/`
            let un = media?.user?.username || media?.owner?.username
            let caption = media?.caption?.text || media?.edge_media_to_caption?.edges?.[0]?.node?.text
            a.title = `${media?.user?.full_name || ''} (${un}) ${caption} [${i + 1}]`
            //console.log('m', m);
            if (m?.is_video || m?.is_unified_video || m?.video_duration) {
                tempDiv.innerHTML = `<div class="vidDiv"></div>`
                let vidDiv = tempDiv.firstElementChild
                let vid = document.createElement('video')
                vid.src = m?.video_url || m?.video_versions?.reduce((a, b) => Math.max(a.width, a.height) > Math.max(b.width, b.height) ? a : b)?.url
                vid.controls = true
                vid.volume = VID_VOLUME
                a.textContent = 'Link'
                vidDiv.appendChild(vid)
                vidDiv.appendChild(a)
                container.appendChild(vidDiv)
            } else if (m?.ad_id || m?.label === 'Sponsored') {
                console.log('Skipping ad', m)
                return
            } else {
                a.innerHTML += `<img src="${getBestImage(m)}">`
                container.appendChild(a)
            }
        }
    }

    function setMaxSize(userStyle) {
        let vw = document.documentElement.clientWidth || window.innerWidth || 0
        let vh = document.documentElement.clientHeight || window.innerHeight || 0
        userStyle.innerHTML = `
#igAllImages img, #igAllImages video {
  max-height: ${vh * HEIGHT_PCT}px;
  max-width: ${vw * WIDTH_PCT}px;
}
`
    }

    function styleIt() {
        let userStyle = document.createElement('style')
        userStyle.type = 'text/css'
        userStyle.innerHTML = `
#igAllImages video {
  border: green solid 2px;
}
#igAllImages .vidDiv {
  display: inline-block;
}
#igAllImages .vidDiv a {
  display: block;
  text-decoration: none;
  margin-top: -5px;
}
/*#loadallbutton {
  padding-top: 40px;
}*/
`
        document.body.appendChild(userStyle)
        console.log('styled')
    }

    function startUp() {
        (function insertButton() {
            let loadButton = document.querySelector("#loadallbutton")
            let insAt = null
            if (!loadButton && !document.location.href.includes('instagram.com/p/')) {
                insAt = document.querySelector('div.fx7hk, div[role*=tablist]') //, .ENC4C, .ZcHy5, ._47KiJ');
                if (insAt) {
                    styleIt()
                    tempDiv.innerHTML = profileButton
                    loadButton = tempDiv.firstElementChild
                    loadButton.onclick = pickMode
                    insAt.appendChild(loadButton)
                } else {
                    //insAt = document.querySelector('article._8Rm4L, article[role="presentation"]')?.parentNode;
                    insAt = document.querySelector('._aac4._aac5._aac6._aac7, ._aac4._aac5._aac6')
                    insAt = document.querySelector('._aam1._aam2._aam5')
                    insAt = document.querySelector('._ab6o._ab6q')
                    insAt = document.querySelector('._aalv._aalx._aalz')
                    insAt = document.querySelector('._aak6')
                    insAt = insAt || document.querySelector('main > div.MxEZm')
                    if (insAt) {
                        styleIt()
                        tempDiv.innerHTML = homeButton
                        loadButton = tempDiv.firstElementChild

                        loadButton.onclick = pickMode
                        insAt.prepend(loadButton)
                        //insAt.before(loadButton);
                        //insAt.after(loadButton);
                        //insAt.appendChild(loadButton);
                    }
                }
            }
            if (!insAt) {
                window.setTimeout(insertButton, 50)
            }
        })()
    }

    const profileButton = `<a aria-selected="false" class="_9VEo1 oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl _aa-z _a6hd" role="tab" tabindex="0" id="loadallbutton"><span class="qzihg"><span class="_08DtY">Load Images</span></span></a>`
    const homeButton = `<article class="_ab6k _ab6l _ab6m _aatb _aatc _aate _aatf _aath _aati _8Rm4L bLWKA M9sTE _1gNme L_LMM SgTZ1 Tgarh ePUX4" role="presentation" tabindex="-1" style="cursor: pointer;" id="loadallbutton">
    <div class="_ab8w  _ab94 _ab99 _ab9h _ab9m _ab9p qF0y9 Igw0E IwRSH YBx95 _4EzTm" style="max-height: inherit; max-width: inherit;">
        <div class="_aasi _aasj UE9AK">
            <div class="_ab8w  _ab94 _ab97 _ab9i _ab9k _ab9p qF0y9 Igw0E rBNOH CcYR1 ybXk5 _4EzTm">
                <header class="_aaqw _aaqx Ppjfr">
                    <div class="_aap6 _aap7 _aapa Jv7Aj mArmR pZp3x">
                        <div class="_aarf _aarg _aaqq RR-M- mrq0Z" aria-disabled="true" role="button" tabindex="-1">
                            <svg aria-label="" class="_8-yf5" color="#262626" fill="#262626" role="img" width="22" height="22" viewBox="0 0 24 20">
                                <rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                            </svg>
                        </div>
                    </div>
                    <div class="_aaqy _aaq- o-MQd z8cbW">
                        <div class=" _aar1 RqtMr">
                            <div class="_aaqt e1e1d">
                                <div class="_aacl _aaco _aacw _aacx _aad6 _aade">
                                    <span class="_aap6 _aap7 _aap8 Jv7Aj mArmR MqpiF"><a class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl _acan _acao _acat _acaw _a6hd sqdOP yWX7d _8A5w5 ZIAjV" tabindex="0">Load Images</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    </div>
</article>
`
    startUp()

})()
