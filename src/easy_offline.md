# One-click offline download

Add a button next to the magnetic link (magnet)\seed (torrent)\electric donkey (ed2k)\video\compression package or other download link, click to automatically download to the network disk offline

### Links are supported by default

- Magnetic links
- Electric Donkey Links
- Seedfile
- Compression package `rar 7z zip`
- Mirror file `iso`
- Video file `mp4 rmvb mkv avi`

### Usage

- Press **`F9`** to quickly disable or enable and log selections on the current site
- **`Alt + F9`** Custom download. If you select text, you will download the link corresponding to the text. If the mouse points to the link, you will download the link. If it is not selected, you will download the link by popping the box
- Hold down **`Ctrl + Shift`** and click on all the resources in the current page of Batch Offline (if I wrote the Batch Offline function for this network disk), it is actually useless. The network is busy
- Netdisk sorting function, set the page drag icon to sort
- Network disk setting function, click the icon to set whether the network disk is enabled
- Dial default download path settings
- The settings page fills in regular expressions to increase support links, setting whether to display icons only when the mouse passes
- **`Alt + x`** Batch copy page resources

### Example of custom settings

- Android installation package `\.apk$`
- A certain clothing extension `\. Outfit\d{4}\.txx$`
- ⁇ ftp `^ftp:\/\/user:pass@127\.0\.0\.1`
- A certain video with reference to mp4`mp4\? [ ^\/]+$`

###Customized example - Github mirror accelerates download, click import below
The configuration method is within the settings item, and there are other rules that are shared to [Feedback] (https://github.com/hoothin/UserScripts/issues)) with the `<pre>` tag (). You can also click Import. For example the download icon here: [Github](https://github.com/hoothin/imgCodeCheck/releases/tag/0.1)

<pre>
https://download.fastgit.org/${https?://[^/]+(.*)}@@Fastgit@@github\.com.*(releases\/download|archive\/refs\/)@@@@ffff9f
https://pd.zwc365.com/seturl/$url@@ZWC365@@github\.com.*(releases\/download|archive\/refs\/)@@@@0fffff
https://gh.api.99988866.xyz/$url@@99988866@@github\.com.*(releases\/download|archive\/refs\/)@@@@9fffff
https://ghproxy.com/$url@@Ghproxy@@github\.com.*(releases\/download|archive\/refs\/)@@@@ff0fff
https://github.rc1844.workers.dev${https?://[^/]+(.*)}@@RC1844@@github\.com.*(releases\/download|archive\/refs\/)@@@@ff9fff
https://ghproxy.fsou.cc/$url@@Fsou@@github\.com.*(releases\/download|archive\/refs\/)@@@@ffff0f
</pre>

### Custom Example 2 - Aria2 Download

Also click below to import

<pre>
http://aria.hoothin.com/#!/new/$base64@@Aria2@@@@data:image/png;base64,FACT 1>//DAY 141toeGr1pknfxf8nmLFox79Do5smkKOFNWrAkipgkevCSINBRMJ5CCmSK7ZTg47ZMMSqyHwt+fOOCbl8WOkRhp8
</pre>

\*The reason why Aria2 is customized is because everyone's Aria2UI URL is different. Using my server to manage the local Aria2 service requires allowing Chrome to access local resources, access chrome://flags/#block-insecure-private-network-requests and close it. If you don't want to close, just open the settings directly and replace the URL above with your own local, such as 127.0.0.1

### Custom Example 3 - Post Request RPC Remote Download

<pre>
p:http://192.168.32.1:6800/jsonrpc?id=$random&jsonrpc=2.0&method=aria2.addUri&params=["token:123456",["$url"]]@@Aria2RPC@@@@@@df2a00
</pre>

After importing, you need to modify the URL and token key yourself

### Custom Example 4 - Copy all links containing “22590-easy-offline” into markdown format

(Hold the Alt display icon and copy all with ctrl + shift)

<pre>
c:[$text "$title"]($url)@@Markdown@@22590-easy-offline@@@@df2a00@@
</pre>

### Customize Example 5 - Google Translate Selected Text

The default is to hold down the Alt key to select

<pre>
https://translate.google.com/?client=gtx&dj=1&q=$text&sl=auto&tl=zh-CN&hl=zh-CN&ie=UTF-8&oe=UTF-8&source=icon&dt=t&dt=bd@@Translate@@@@data:image/png;base64,ADBORw0KGgoAAANSUhEUgAAAEAABACAIAAAAlC+aJAAAACBIWXMAAAsTAAALEWEAmpwYAAAExklEQVRoge2Y+08UVxTH/dNmtYRHwNKHDW1/sK1QbFoSitXa9i642QI8TL/nPWRjasAABJRU5ErkJggg==@@4085f9
</pre>

### Custom Example 6 - Remove the expression kanji from the selected link and jump

The default is to hold down the Alt key to check, such as h❤ttps://patchbaidu.😀com

<pre>
$text{[^\w\-_\.~!\*' ();:@&=\+\$,\/\?#\[\]%]}@@GetLink@@@@@@f9ff9f
</pre>

### Custom Example 7 - Post Request OpenList (formerly AList) for remote download

<pre>
p:https://alist.domain.com/api/fs/add_offline_download?path=/115网盘/OpList离线下载&tool=115%20Cloud&delete_policy=delete_on_upload_succeed&urls=["$url"]$headers{"Content-Type": "application/json","Authorization": "alist-50a563b4-and-more-token-chars", "Accept": "*/*", "Host": "alist.domain.com", "Connection": "keep-alive"}@@OpenList@@@@@@df2a11
</pre>

### Update

- **`Alt + F9`** Custom download. If you select the text hyperlink, download the text hyperlink. If the mouse points to the link, download the link. If it is not selected, enter the link in a box and download it
- Hold down **`Ctrl + Shift`** and click on all the resources in the current page of Batch Offline (if I wrote the Batch Offline function for this network disk), it is actually useless. The network is busy
- Add the dial default download path settings
- Add a network disk setting function, click on the icon to set whether the network disk is enabled
- Add the network disk sorting function, set the page drag icon to sort
- Add a settings item, fill in a regular expression to add a support link, set whether to display the icon only when the mouse passes
- Press **`F9`** to quickly disable or enable and log selections on the current site
- Convert 32-bit magnetic links to 40-bit magnetic links when offline, making it easier for network disks to identify resources such as animation gardens
- Fix Baidu Netdisk Super vip problem, thanks to Psnowy

---

! [img1] (https://greasyfork.s3.us-east-2.amazonaws.com/s1beg1iderkn42jq7yl8ogg3z4pr)

### Support Services

- Baidu Netdisk http://pan.baidu.com
- 115 http://115.com
- Furk http://www.furk.net
- Seedr http://www.seedr.cc
- Thunder Offlinehttp://lixian.xunlei.com
- Pcloud http://www.pcloud.com
- Xiaomi Router http://miwifi.com
- Tencent Weiyun http://weiyun.com
- Nine seconds cloud broadcast http://apiv.ga
- Torrent.org http://torrent.org.cn
