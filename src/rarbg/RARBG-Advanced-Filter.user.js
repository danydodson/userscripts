// ==UserScript==
// @name         RARBG: Advanced Filters
// @version      1.65
// @description  Additional quality of life filters: - Show or hide category icons; - Show or hide torrent thumbnails; - Show or hide movie and tv filters (Removes torrents with KORSUB and 720p); - Show or hide porn; - search for movies and tv shows by genre - Filter based on minimum IMDB rating;
// @author       Kxmode
// @license      MIT
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Advanced-Filter.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/rarbg/RARBG-Advanced-Filter.user.js
// @icon         https://rargb.to/favicon.ico
// @include      https://rarbg.how/*
// @include      https://rargb.to/*
// @include      https://www2.rarbggo.to/*
// @include      https://rarbg.proxyninja.org
// @include      https://www.rarbgproxy.to/*
// @include      https://rarbgproxy.to/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

// @--include      /(https?:)?\/\/(www\.)?(proxy|unblocked)?rarbg((2018|2019|2020|2021)?|access(ed)?|cdn|core|data|enter|get|go|index|mirror(ed)?|p2p|prox(ied|ies|y)|prx|to(r|rrents)?|unblock(ed)?|way|web)\.(to|com|org|is)\/((index\d{2}|torrents)\.php.*|torrent|catalog\/.*|s\/.*|tv\/.*|top10)/

/* jshint esversion: 6 */
/* eslint-disable */

const $ = (window).$

$(function () {

	// Define general variables
	let nonStandardUrlParams = (getParameterByName('category%5B%5D') !== null || getParameterByName('category[]') !== null) ? true : false,
		currentUrlParams = -1,
		showAdvancedOptions = false,
		showIcon,
		showTorrentThumbnail, // TODO: child of showIcon (=true)
		showPorn,
		genreFilter = '',
		currentUrlNormal,
		currentUrlAbnormal,
		i

	// Define Category specific filters
	let minRating,
		searchGenre,
		gameGroup,
		musicGenre,
		showKORSUB,
		show720p

	// Define array of known RARBG categories
	const MOVIES = ['movies', 14, 17, 42, 44, 45, 46, 47, 48, 50, 51, 52, 54].map(String),
		TV_SHOWS = [18, 41, 49].map(String),
		GAMES = [27, 28, 29, 30, 31, 32, 40].map(String),
		MUSIC = [23, 24, 25, 26].map(String),
		SOFTWARE = [33, 34, 43].map(String),
		NON_PORN = [14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].map(String)

	// Define booleans
	let isCategoryMovies,
		isCategoryTVShows,
		isCategoryGames,
		isCategoryMusic,
		isCategorySoftware,
		isCategoryNonPorn

	// This logic normalizes RARBG's inconsistent URL parameter types (e.g. category=movies, category%5B%5D=48, category=1;18;41;49;, and category[]=42)
	if (nonStandardUrlParams) {
		currentUrlNormal = new RegExp(/[\?&]category%5B%5D=([^]*)/).exec(window.location.href) // Grab all URL parameters %5B%5D
		currentUrlAbnormal = new RegExp(/[\\?&]category\[[^\[\]]*\]=([^]*)/).exec(window.location.href) // Grab all URL parameters []
		if (currentUrlNormal === null && currentUrlAbnormal === null) { // If neither unique parameter exists, then stop this logic, and return nothing
			return null
		} else { // Otherwise...
			if (currentUrlAbnormal !== null) // If URL parameters is [] (abnormal)
				currentUrlParams = String(currentUrlAbnormal).match(/(=)\w+/g).map(String) // Create an array of values separated by the equal sign
			else // Otherwise conclude URL parameters are normal (%5B%5D)
				currentUrlParams = String(currentUrlNormal).match(/(=)\w+/g).map(String) // Create an array of values separated by the equal sign

			for (i = 0; i < currentUrlParams.length; i++) { // Iterate through array look for equal signs
				currentUrlParams[i] = currentUrlParams[i].replace('=', '') // Remove the equal sign from the array
			}
		}
	}
	else if (getParameterByName('category') !== null) { // Otherwise this is a standard URL parameter
		currentUrlParams = getParameterByName('category').split(';').map(String) // Create an array of values separated by the semicolon
	}

	// Compares current url parameters with known RARBG categories. If the value is greater than -1 we have at least one match.
	// Navigate through each array to find and set the match to true. For now there can only be one match.
	if (getParameterByName('category') !== null || currentUrlParams.length > -1) {
		isCategoryMovies = MOVIES.some(item => currentUrlParams.includes(item))
		isCategoryTVShows = TV_SHOWS.some(item => currentUrlParams.includes(item))
		isCategoryGames = GAMES.some(item => currentUrlParams.includes(item))
		isCategoryMusic = MUSIC.some(item => currentUrlParams.includes(item))
		isCategorySoftware = SOFTWARE.some(item => currentUrlParams.includes(item))
		isCategoryNonPorn = NON_PORN.some(item => currentUrlParams.includes(item))
	}

	// Method to grab the Parameter name and value (Note: single use only. See line 60 for multiple URL parameters and if needed move to function.)
	function getParameterByName(name, url) {
		// credit: https://stackoverflow.com/a/901144 (Modified by Kxmode)
		// Used under StackOverflow's standard CC BY-SA 3.0 license
		if (!url) url = window.location.href
		name = name.replace(/[\[\]]/g, '\\$&')
		let regex = '[?&]' + name + '(=([^&#]*)|&|#|$|((%\d\D)*\D\d*))' // deepscan-disable-line BAD_ESCAPE_AT_REGEXP_CONSTRUCTOR
		regex = new RegExp(regex)
		let results = regex.exec(url)
		if (!results) return null
		if (!results[2]) return ''
		return decodeURIComponent(results[2].replace(/\+/g, ' '))
	}

	// Method to activate and deactive filters inside the Advanced Filter's HTML box
	function toggleFilter(target, data, bool, optional) {
		optional = (optional !== undefined) ? true : false
		let targetID = target.replace('#', '')
		if (bool) {
			if (!optional) {
				$(target).find('i').removeClass('fa-eye-slash').addClass('fa-eye')
				$(target).removeClass('disabled')
			}
			$(target).attr(data, 'true')
			window.localStorage.setItem(targetID, 'true')
		} else {
			if (!optional) {
				$(target).find('i').removeClass('fa-eye').addClass('fa-eye-slash')
				$(target).addClass('disabled')
			}
			$(target).attr(data, 'false')
			window.localStorage.setItem(targetID, 'false')
		}
	}

	// Method to show and hide the Advanced Filter's HTML box
	function toggleAdvancedFilters(bool, isClicked) {
		isClicked = (isClicked !== undefined) ? true : false
		let parentTarget = $('.new-search form')
		let target = $('.advanced-search')
		if (getParameterByName('category') !== null && isClicked === false) {
			if (bool) {
				window.localStorage.setItem('shadvbutton', 'true')
				parentTarget.removeAttr('style')
				parentTarget.removeClass('disabled')
				target.show()
				$('#shadvbutton').text('«')
			} else {
				parentTarget.attr('style', 'width: 100%; border-right: 1px solid #9faabc;')
				target.hide()
				$('#shadvbutton').text('»')
			}
		} else if (getParameterByName('category') === null && isClicked === false) {
			$('#shadvbutton').attr('data-shadvbutton', 'false')
			window.localStorage.setItem('shadvbutton', 'false')
			parentTarget.attr('style', 'width: 100%; border-right: 1px solid #9faabc;')
			target.hide()
			$('#shadvbutton').text('»')
		} else {
			if (bool) {
				if (typeof showhideadvsearch !== 'undefined') { showhideadvsearch('show') } // jshint ignore:line
				parentTarget.removeAttr('style')
				parentTarget.removeClass('disabled')
				target.show()
				$('#shadvbutton').text('«')
			} else {
				parentTarget.attr('style', 'width: 100%; border-right: 1px solid #9faabc;')
				target.hide()
				$('#shadvbutton').text('»')
			}
		}
	}

	$('#searchTorrent').parent().addClass('new-search')

	// Removes extra space between Recommended torrents and search bar
	$('#searchTorrent').parent().parent().find('div:nth-of-type(2)').remove()
	for (i = 1; i <= 4; i++) {
		$('#searchTorrent').parent().parent().find('br:nth-of-type(1)').remove()
	}

	// Fixes a bug in this script affecting the formatting of IMDB searches (?imdb=tt0448115) in darkred's 'RARBG - various tweaks';
	if ($('.new-search').next().attr('class') === undefined) {
		$('.new-search').next().find('table tr td:last-child').addClass('advanced-search-formatting-fix')
		$('<br>').insertBefore('.advanced-search-formatting-fix b:nth-of-type(-n+5)')
	}

	// Attaches FontAwesome script to display active and inactive 'eye' icons. fontawesome.io for more info.
	$('head').append('<script src="https://kit.fontawesome.com/515872dda2.js" crossorigin="anonymous"></script>')

	// Attaches CSS for the custom Advanced Filters HTML box.
	$("head").append(`<style>
                    .content-rounded .new-search,
                    .content-rounded div.new-search div    { margin-left: auto; }
                    .new-search                            { width: 1200px; display: flex; display: -webkit-flex; display: -moz-flex; margin: 30px auto; }
                    .new-search div                        { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }
                    .new-search div                        { border-radius: 0; -moz-border-radius: 0; -webkit-border-radius: 0; }
                    .new-search form                       { width: 70%; border-radius: 0; -moz-border-radius: 0; -webkit-border-radius: 0; }
                    .new-search form                       { border: 0; border-top: 1px solid #9faabc; border-bottom: 1px solid #9faabc; border-left: 1px solid #9faabc; }
                    .new-search .divadvscat                { width: 157px; display: inline-block; height: auto; padding: 7px; float: none; }
                    .new-search .divadvclearcats           { padding: 10px; }
                    .new-search .advanced-search           { width: 31%; background: #e7f3fb; font-size: 110%; padding: 5px; border: 1px solid #9faabc; float: left; }
                    .new-search .advanced-search           { border: 0; border-top: 1px solid #9faabc; border-bottom: 1px solid #9faabc; border-right: 1px solid #9faabc; }
                    .new-search .advanced-search h4        { padding: 0; margin: 0 0 10px 0; text-align: center; }
                    .advanced-search .section-wrapper      { border: 1px dotted #9faabc; padding: 10px; }
                    .advanced-search .section-wrapper:first-child { border-bottom: 0; }
                    .advanced-search .no-border            { border: 0; }
                    .advanced-search .divadvscat           { width: auto; border: 1px solid transparent; cursor: pointer; }
                    .advanced-search .divadvscat i         { padding-right: 2px; }
                    .advanced-search .disabled             { border: 1px solid #DDD; background-color: #f5f5f5; color: #999; }
                    .advanced-search .centered             { text-align: center; }
                    .section-wrapper .imdb-rating-search   { width: 155px; }
                    .section-wrapper .genre-search         { width: auto; }
                    .section-wrapper .gaming-group-search  { width: auto; }
                    .section-wrapper .imdb-rating-search input         { width: 30%; }
                    .section-wrapper .gaming-group-search input        { width: 50%; }
                    .section-wrapper input                 { border: 0; margin-left: 10px; border: 1px solid #9faabc; text-align: center; }
                    .clearfix:before, .clearfix:after      { display: table; content: ""; line-height: 0;}
                    .section-wrapper input.text-left       { text-align: left; }
                    td.header6:hover                       { background: #3860bb; cursor: default;; }
                    td.header6 span                        { text-decoration: underline; cursor: pointer; }
                    td.header6 span:hover                  { text-decoration: none; }
                    .resize                                { width: 65%; }
                    </style>`)

	// Creates the HTML for category specific filters
	if (getParameterByName("category") === null || isCategorySoftware)
		genreFilter = '<div class="section-wrapper no-border" style="border-top: 1px dotted #9faabc;">\n'
	else
		genreFilter = '<div class="section-wrapper">\n'

	// TODO: Handle for: if (GetParameterByName("category") !== null || arrayCurrentUrlParams.length > -1 || nonStandardUrlParams) ----------
	if (getParameterByName('category') !== null || nonStandardUrlParams) {
		if (isCategoryMovies || isCategoryTVShows) {
			genreFilter += `<div id="jQIMDB" class="divadvscat imdb-rating-search centered">Min Rating <input name="minprice" type="text" /></div>
                           <div id="jQKORSUB" class="divadvscat" title="Hides low-quality KORSUB torrents"><i class="fa fa-eye fa-1x"></i> KORSUB</div>
                           <div id="jQ720p" class="divadvscat" title="Hides 720p torrents"><i class="fa fa-eye fa-1x"></i> 720p</div>
                           <div id="jQgenre" class="divadvscat genre-search">Genre <input name="mediagenre" type="text" class="text-left" /></div>`
		} else if (isCategoryGames) {
			genreFilter += '<div id="jQGamingGroup" class="divadvscat gaming-group-search centered">Torrent Group <input name="gamegroup" class="text-left" type="text" /></div>\n'
		} else if (isCategoryMusic) {
			genreFilter += '<div id="jQMusicGenre" class="divadvscat music-group-genre centered">Genre <input name="musicgenre" class="text-left" type="text" /></div>\n'
		} else if (isCategorySoftware) {
			// genreFilter += '<div id="jQcategoryFilter" class="divadvscat centered">Software Filters Coming Soon</div>\n';    // Not enough to warrant this for now
		} else if (isCategoryNonPorn) {
			genreFilter += '<div id="jQcategoryFilter" class="divadvscat centered">Non Porn Filters Coming Soon</div>\n'
		}
	} else {
		// genreFilter += '<div id="jQcategoryFilter" class="divadvscat centered">All Filters Coming Soon</div>\n';            // Not enough to warrant this for now
	}
	genreFilter += '</div>\n'

	// Creates the Advanced Filter HTML box
	let AdvancedFiltersHTML = `<div class="advanced-search">
                                        <div class="section-wrapper">
                                                <div id="jQIcon" class="divadvscat"><i class="fa fa-eye fa-1x"></i> Category Icons</div>
                                                <div id="jQTorrentThumbnail" class="divadvscat"><i class="fa fa-eye fa-1x"></i> Torrent Images</div>
                                                <div id="jQShowPorn" class="divadvscat"><i class="fa fa-eye fa-1x"></i> Porn</div>
                                        </div>
                                        ${genreFilter}
                                        <div class="section-wrapper no-border">
                                                <span class="jQUpdateFilters btn btn-primary btn-mini">Update Page with Filters</span>
                                                <span class="jQResetFilters btn btn-mini">Reset Filters</span>
                                        </div>
                                        <div class="clearfix"></div>
                                </div>`

	// Attaches Advanced Filters HTML box to RARBG
	$('#searchTorrent').parent().append(AdvancedFiltersHTML)

	// TODO: Likely going to need to move the ToggleFilter and ToggleAdvancedFilters method calls into this gated logic
	if (nonStandardUrlParams) {
		toggleFilter('#shadvbutton', 'data-shadvbutton', showAdvancedOptions, true)
		toggleAdvancedFilters(true, true)
	} else {
		showAdvancedOptions = ((window.localStorage.getItem('shadvbutton') == 'true') ? true : false)
		toggleFilter('#shadvbutton', 'data-shadvbutton', showAdvancedOptions, true)
		toggleAdvancedFilters(showAdvancedOptions)
	}

	// Logic for HTML box icons
	showIcon = ((window.localStorage.getItem('jQIcon') == 'false') ? false : true)
	toggleFilter('#jQIcon', 'data-icon', showIcon)

	showTorrentThumbnail = ((window.localStorage.getItem('jQTorrentThumbnail') == 'false') ? false : true)
	toggleFilter('#jQTorrentThumbnail', 'data-torrent-thumbs', showTorrentThumbnail)

	showPorn = ((window.localStorage.getItem('jQShowPorn') == 'false') ? false : true)
	toggleFilter('#jQShowPorn', 'data-porn', showPorn)

	showKORSUB = ((window.localStorage.getItem('jQKORSUB') == 'false') ? false : true)
	toggleFilter('#jQKORSUB', 'data-korsub', showKORSUB)

	show720p = ((window.localStorage.getItem('jQ720p') == 'false') ? false : true)
	toggleFilter('#jQ720p', 'data-720p', show720p)

	$('#shadvbutton').on('click', function () {
		showAdvancedOptions = ($(this).attr('data-shadvbutton') == 'false') ? true : false
		toggleFilter('#shadvbutton', 'data-shadvbutton', showAdvancedOptions, true)
		toggleAdvancedFilters(showAdvancedOptions, true)
	})

	$('#jQIcon').on('click', function () {
		showIcon = ($(this).attr('data-icon') == 'false') ? true : false
		toggleFilter('#jQIcon', 'data-icon', showIcon)
	})
	$('#jQTorrentThumbnail').on('click', function () {
		showTorrentThumbnail = ($(this).attr('data-torrent-thumbs') == 'false') ? true : false
		toggleFilter('#jQTorrentThumbnail', 'data-torrent-thumbs', showTorrentThumbnail)
	})
	$('#jQShowPorn').on('click', function () {
		showPorn = ($(this).attr('data-porn') == 'false') ? true : false
		toggleFilter('#jQShowPorn', 'data-porn', showPorn)
	})
	$('#jQKORSUB').on('click', function () {
		showKORSUB = ($(this).attr('data-korsub') == 'false') ? true : false
		toggleFilter('#jQKORSUB', 'data-korsub', showKORSUB)
	})
	$('#jQ720p').on('click', function () {
		show720p = ($(this).attr('data-720p') == 'false') ? true : false
		toggleFilter('#jQ720p', 'data-720p', show720p)
	})

	// Movies and TV Shows only
	if (isCategoryMovies || isCategoryTVShows) {
		if (window.localStorage.getItem('minimum-rating') > 0) {
			let mr = window.localStorage.getItem('minimum-rating')
			$('#jQIMDB').find('input').attr('value', mr)
			minRating = mr
		} else {
			$('#jQIMDB').find('input').attr('value', 0)
		}

		if (window.localStorage.getItem('media-genre') !== null) {
			let gen = window.localStorage.getItem('media-genre')
			$('#jQgenre').find('input').attr('value', gen)
			searchGenre = gen.toLowerCase()
		}
	}

	// Games only
	if (isCategoryGames) {
		if (window.localStorage.getItem('game-group') !== undefined) {
			let gg = window.localStorage.getItem('game-group')
			$('#jQGamingGroup').find('input').attr('value', gg)
			gameGroup = gg
		} else {
			$('#jQGamingGroup').find('input').removeAttr('value')
		}
	}

	// Music only
	if (isCategoryMusic) {
		if (window.localStorage.getItem('music-genre') !== undefined) {
			let mg = window.localStorage.getItem('music-genre')
			$('#jQMusicGenre').find('input').attr('value', mg)
			musicGenre = mg
		} else {
			$('#jQMusicGenre').find('input').removeAttr('value')
		}
	}

	// Input click event
	/*
	document.querySelectorAll('#jQIMDB input, #jQGamingGroup input, #jQMusicGenre input, #jQgenre input').forEach( selector => {
			selector.addEventListener('blur', e => { console.log(e.key) });
	});
	*/
	$('#jQIMDB input, #jQGamingGroup input, #jQMusicGenre input, #jQgenre input').on('keydown', function () {
		if (event.which == 13 || event.keyCode == 13) $('.jQUpdateFilters').click()
	})

	// Events for the 'Update Filters' button
	$('.jQUpdateFilters').on('click', function () {
		if (isCategoryMovies || isCategoryTVShows) {
			let minRating = $('#jQIMDB').parent().find('input').val()
			window.localStorage.setItem('minimum-rating', minRating)

			let genre = $('#jQgenre').find('input').val()
			window.localStorage.setItem('media-genre', genre)
		}
		if (isCategoryGames) {
			let gameGroup = $('#jQGamingGroup').parent().find('input').val()
			window.localStorage.setItem('game-group', gameGroup)
		}
		if (isCategoryMusic) {
			let musicGenre = $('#jQMusicGenre').parent().find('input').val()
			window.localStorage.setItem('music-genre', musicGenre)
		}
		location.reload()
	})

	// Events for the 'Reset Filters' button
	$('.jQResetFilters').on('click', function () {
		window.localStorage.removeItem('jQIcon')
		window.localStorage.removeItem('jQTorrentThumbnail')
		window.localStorage.removeItem('jQKORSUB')
		window.localStorage.removeItem('jQ720p')
		window.localStorage.removeItem('jQShowPorn')
		window.localStorage.removeItem('media-genre')
		window.localStorage.removeItem('minimum-rating')
		window.localStorage.removeItem('game-group')
		window.localStorage.removeItem('music-genre')
		location.reload()
	})

	// Removes Movie filters after clicking the 'View all' link
	$('.tdlinkfull2').on('click', function () {
		if ($(this).text() === 'View all') {
			window.localStorage.removeItem('jQKORSUB')
			window.localStorage.removeItem('jQ720p')
			window.localStorage.removeItem('minimum-rating')
			window.localStorage.removeItem('game-group')
			window.localStorage.removeItem('music-genre')
			window.localStorage.removeItem('media-genre')
		}
	})

	// CATEGORY SPECIFIC =================================================================================================

	// Hides torrents with seeders equal to or lower than a number [TODO: make this a form input filter]
	// use inArray method from work (Configurator height normalizer)
	/*
	if (parseInt(title.indexOf('720p')) > 0)
	{
			$(this).parents('.lista2').remove();
	}
	*/

	// Logic to hide porn
	if (!showPorn) {
		$.each($('.tdlinkfull2'), function () {
			const TARGET_TEXT = $(this).text().toLowerCase()
			if (TARGET_TEXT == 'xxx') $(this).parent().parent().remove()
		})
		$.each($('.divadvscat a'), function () {
			const TARGET_TEXT = $(this).text().toLowerCase()
			if (TARGET_TEXT == 'xxx (18+)') $(this).parent().remove()
		})
	}

	// Loops through all torrents looking at each span tag
	$.each($('.lista span'), function (index, value) {
		const GENRE = $(this).text().toLowerCase()
		if (GENRE !== undefined)
			// Creates the logic for category specific filters
			if (getParameterByName('category') !== null || nonStandardUrlParams)
				if (isCategoryMovies || isCategoryTVShows)
					if (GENRE.search(searchGenre) == -1)
						$(this).parents('.lista2').remove()
	})

	// Loops through all torrents looking at each anchor tag
	$.each($('.lista a'), function (index, value) {
		let title = $(this).attr('title')
		let icon = $(this).find('img').attr('src')

		if (title !== undefined) {
			// Logic to hide KORSUB torrents
			if (!showKORSUB)
				if (parseInt(title.indexOf('KORSUB')) > 0)
					$(this).parents('.lista2').remove()

			// Logic to hide 720p torrents
			if (!show720p)
				if (parseInt(title.indexOf('720p')) > 0)
					$(this).parents('.lista2').remove()

			// Creates the logic for category specific filters
			if (getParameterByName('category') !== null || nonStandardUrlParams) {
				if (isCategoryMovies || isCategoryTVShows) {
					// IMDB Ratings
					$.each($('.lista:nth-child(2)'), function (index, value) {
						if ($(this).children('span').length) {
							const RATINGS = $(this).children('span').text()
							const IMDB = RATINGS.indexOf('IMDB: ') + 6
							const SCOPE_MIN_RATING = $('#jQIMDB').parent().find('input').val()
							if (SCOPE_MIN_RATING > 0) {
								if (RATINGS !== '' && IMDB !== -1) {
									minRating = parseFloat(minRating)
									const RATE_VALUE = parseFloat(RATINGS.substring(IMDB, RATINGS.length - 3))
									if (!isNaN(RATE_VALUE)) {
										if (RATE_VALUE <= minRating) $(this).parents('.lista2').remove()
									} else {
										$(this).parents('.lista2').remove()
									}
								}
							}
						}
					})
				}
				// Game Torrent Group
				else if (isCategoryGames) {
					$.each($('.lista2t a'), function (index, value) {
						if ($(this).attr('title') !== undefined) {
							const TORRENT_TITLE = $(this).attr('title')
							const SEARCH_VALUE = TORRENT_TITLE.toLowerCase().indexOf(gameGroup)
							if (SEARCH_VALUE === -1 && gameGroup !== null)
								$(this).parents('.lista2').remove()
						}
					})
				}
				else if (isCategoryMusic) {
					$.each($('.lista2t .lista span:last-child'), function (index, value) {
						const GENRE_TITLE = $(this).text()
						if (GENRE_TITLE !== undefined) {
							const SEARCH_VALUE = GENRE_TITLE.toLowerCase().indexOf(musicGenre)
							if (SEARCH_VALUE === -1 && musicGenre !== null)
								$(this).parents('.lista2').remove()
						}
					})
				}
				// Coming soon
				// else if (categorySoftwareArray) { }
				// else if (categoryNonPornArray) { }
			}
		}

		// Logic to hide porn
		if (!showPorn) {
			if (title !== undefined) {
				title = title.indexOf('XXX')
				if (title >= 0) $(this).parents('.lista2').remove()
			}
			if (icon !== undefined) {
				icon = icon.indexOf('cat_new4.gif')
				if (icon >= 0) $(this).parents('.lista2').remove()
			}
		}
	})

	// NON-CATEGORY SPECIFIC =================================================================================================

	// Logic to hide icons
	if (!showIcon) {
		$('.lista2t tr td:nth-of-type(1)').attr('style', 'display:none;')
	} else {
		// TODO: Make child of showIcon (=true)
		// Logic to show torrent thumbnails
		if (showTorrentThumbnail) {
			const LOCAL_STORAGE_SETTING = 'RARBG-Advanced-Filters-Large-Thumbnails'
			window.isLargeThumb = (window.localStorage.getItem(LOCAL_STORAGE_SETTING) == 'true') ? true : false

			if (window.isLargeThumb)
				$('.lista2t').find('tr:first-child td:first-child').html('Thumbnail (<span class="jQlargeThumbs"><i class="fas fa-compress-arrows-alt"></i></span>)')
			else
				$('.lista2t').find('tr:first-child td:first-child').html('Thumbnail (<span class="jQlargeThumbs"><i class="fas fa-expand-arrows-alt"></i></span>)')

			$.each($('.lista2t .lista2'), function () {
				const ANCHOR = $(this)
				$.each(ANCHOR.find('.lista'), function () {
					const IMAGE = $(this).find('a')
					const TARGET = ANCHOR.find(':nth-child(1) a')
					if (IMAGE.attr('onmouseover') !== undefined) {
						const HREF = IMAGE.attr('href')
						const SOURCE_THUMB = IMAGE.attr('onmouseover')
						let val1 = SOURCE_THUMB.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g).map(String)[0]
						val1 = SOURCE_THUMB.lastIndexOf(val1)
						const VAL2 = SOURCE_THUMB.indexOf("\' border=0>')") - 1
						let imageID = SOURCE_THUMB.substring(val1, VAL2)

						if (window.isLargeThumb) {
							if (imageID.includes('static/over')) {
								let pvid = imageID.substring(22, 23)
								imageID = imageID.replace('static/over', 'posters2/' + pvid)
							}

							if (imageID.includes('over_opt'))
								imageID = imageID.replace('over_opt', 'poster_opt')

							if (imageID.includes('_small'))
								imageID = imageID.replace('_small', '_banner_optimized')

						}

						let thumbnailImage = "<img class='thumbnail' src=\'//" + imageID + "' />"

						if (window.isLargeThumb)
							if (imageID.includes('posters2/') || imageID.includes('poster_opt') || imageID.includes('_banner_optimized'))
								$('.thumbnail').addClass('resize')

						IMAGE.removeAttr('onmouseover').removeAttr('onmouseout')
						TARGET.find('img').replaceWith(thumbnailImage)
						TARGET.attr('href', HREF)
						ANCHOR.find('td:nth-child(1)').attr('align', 'center')
					}
				})
			})

			$(document).on('click', '.jQlargeThumbs', function () {
				if (window.isLargeThumb)
					window.localStorage.setItem(LOCAL_STORAGE_SETTING, 'false')
				else
					window.localStorage.setItem(LOCAL_STORAGE_SETTING, 'true')
				window.location.href = window.location.href
			})
		}
	}

	// Is Grid active?
	const SHOW_GRID = ((window.localStorage.getItem('advanced-search-grid-view') == 'true') ? true : false)

	// Creates the Grid button toggle
	const GRID_ICON = SHOW_GRID ? '<i class=\'fas fa-list\'></i>' : '<i class=\'fas fa-th\'></i>'
	const TOOL_TIP = SHOW_GRID ? 'Show list view' : 'Show grid view'
	$('#searchTorrent table tbody tr').prepend('<td><span class=\'btn btn-primary jQGridButton\' title=\'' + TOOL_TIP + '\'>' + GRID_ICON + '</a></td>')

	// Grid button toggle logic
	$(document).on('click', '.jQGridButton', function () {
		if (SHOW_GRID)
			window.localStorage.setItem('advanced-search-grid-view', 'false')
		else
			window.localStorage.setItem('advanced-search-grid-view', 'true')
		location.reload()
	})

	if (SHOW_GRID) {

		let isTorrentMagnetLinksScriptActive = false

		// Determines if the torrent and magnet links script is installed
		$.each($('.lista2t tbody tr:first-child td'), function (index) {
			const CONTENT = $(this).html()
			switch (CONTENT) {
				case 'DL&nbsp;ML':
					isTorrentMagnetLinksScriptActive = true
					break
			}
		})

		// Creates the grid
		let gridTemplate = `#TorrentGrid .grid-lista2     { grid-template-areas: "thumb thumb"
                                                                "file file"
                                                                "added added"
                                                                "size size"
                                                                "seeders leechers"
                                                                "comments uploader"; }`
		if (isTorrentMagnetLinksScriptActive) {
			gridTemplate = `#TorrentGrid .grid-lista2     { grid-template-areas: "thumb thumb"
                                                                "file file"
                                                                "mldl mldl"
                                                                "added added"
                                                                "size size"
                                                                "seeders leechers"
                                                                "comments uploader"; }`
		}

		// Creates the CSS for the grid
		$('<div id="TorrentGrid"/>').insertBefore('.lista2t').prepend(`<style>
                                                                        ${gridTemplate}
                                                                        #TorrentGrid .grid-lista2 .thumb                   { grid-area: thumb; }
                                                                        #TorrentGrid .grid-lista2 .file                    { grid-area: file; }
                                                                        #TorrentGrid .grid-lista2 .mldl                    { grid-area: mldl; }
                                                                        #TorrentGrid .grid-lista2 .added                   { grid-area: added; }
                                                                        #TorrentGrid .grid-lista2 .size                    { grid-area: size; margin-bottom: 10px; }
                                                                        #TorrentGrid .grid-lista2 .seeders                 { grid-area: seeders; justify-self: right; margin-right: 5px; }
                                                                        #TorrentGrid .grid-lista2 .leechers                { grid-area: leechers; justify-self: left; margin-left: 5px; }
                                                                        #TorrentGrid .grid-lista2 .comments                { grid-area: comments; margin-top: 10px; }
                                                                        #TorrentGrid .grid-lista2 .uploader                { grid-area: uploader; margin-top: 10px; }
                                                                        #TorrentGrid .grid-lista2                          { display: grid; grid-template-rows: 220px 60px 45px 27px; }
                                                                        #TorrentGrid .grid-lista2                          { width: 20%; background-color: #e7f3fa; border: 10px solid #fff; margin: 0 !important; padding: 20px; text-align: center; float: left; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }
                                                                        #TorrentGrid .grid-lista2 .lista                   { margin: 0; }
                                                                        #TorrentGrid .alt-layout                           { display:block; min-height: 30px; }
                                                                        #TorrentGrid .grid-lista2 .alt-darker              { background: #222; font-weight: bold; color: #fff; padding: 5px; margin: 5px 0; }
                                                                        #TorrentGrid .grid-lista2 .alt-deco                { border-bottom: 1px solid #CCC; padding-bottom: 5px; margin-bottom: 5px; }
                                                                        #TorrentGrid .grid-lista2 .lista:first-child img   { width: 100%; height: 200px; }
                                                                        #TorrentGrid .grid-lista2 .alt-size                { font-weight: bold; }
                                                                        #TorrentGrid .grid-lista2 .badge                   { width: 75%; background-color: #17a2b8; color: #fff; display: inline-block; padding: .75em .4em; font-weight: 700; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25rem; }
                                                                        #TorrentGridControls                               { background: #d3dde7; text-align: center; margin: 0 14px 20px 14px; padding: 10px; border: 1px solid #9faabc; }
                                                                        #TorrentGridControls h3                            { margin: 0 0 10px 0; }
                                                                        #TorrentGridControls span                          { margin: 0 5px; }
                                                                        </style>`)

		$.each($('.lista2t .lista2'), function (index) {
			let parentIndex = index + 1
			$('#TorrentGrid').append('<div class="grid-lista2"/>')
			$.each($(this).find('td'), function (index) {
				let childIndex = index + 1
				let target = $(this).closest('table').prev().find('div.grid-lista2:nth-of-type(' + parentIndex + ')')
				target.append('<div class="lista"/>')
				let currentElement = target.find('.lista:nth-of-type(' + childIndex + ')').eq(0)
				let fileName
				currentElement.html($(this).html())
				if (isTorrentMagnetLinksScriptActive) {
					switch (childIndex) {
						case 1: // thumbnail TD
							currentElement.addClass('thumb')
							break
						case 2: // file TD
							currentElement.addClass('file')
							currentElement.find('a:first-child').addClass('alt-layout')
							currentElement = currentElement.find('a:first-child')
							fileName = currentElement.text().replace(/\./g, ' ')
							currentElement.text(fileName)
							break
						case 3: // DL ML TD - belongs to the torrent and magnet links script
							currentElement.addClass('mldl alt-darker')
							currentElement.prepend('DL ML: ')
							break
						case 4: // Added TD
							currentElement.addClass('added alt-deco')
							currentElement.prepend('Added: ')
							break
						case 5: // Size TD
							currentElement.addClass('size alt-size')
							currentElement.prepend('Size: ')
							break
						case 6: // Seed TD
							currentElement.addClass('seeders badge')
							currentElement.prepend('Seeds: ')
							currentElement.find('font').removeAttr('color')
							break
						case 7: // Leecher TD
							currentElement.addClass('leechers badge')
							currentElement.prepend('Leechers: ')
							currentElement.find('font').removeAttr('color')
							break
						case 8: // Comments TD
							currentElement.addClass('comments')
							currentElement.prepend('# Comments: ')
							break
						case 9: // Uploader TD
							currentElement.addClass('uploader')
							currentElement.prepend('# Uploader: ')
							break
					}
				} else {
					switch (childIndex) {
						case 1: // thumbnail TD
							currentElement.addClass('thumb')
							break
						case 2: // file TD
							currentElement.addClass('file')
							currentElement.find('a:first-child').addClass('alt-layout')
							currentElement = currentElement.find('a:first-child')
							fileName = currentElement.text().replace(/\./g, ' ')
							currentElement.text(fileName)
							break
						case 3: // Added TD
							currentElement.addClass('added alt-deco')
							currentElement.prepend('Added: ')
							break
						case 4: // Size TD
							currentElement.addClass('size alt-size')
							currentElement.prepend('Size: ')
							break
						case 5: // Seed TD
							currentElement.addClass('seeders badge')
							currentElement.prepend('Seeds: ')
							currentElement.find('font').removeAttr('color')
							break
						case 6: // Leecher TD
							currentElement.addClass('leechers badge')
							currentElement.prepend('Leechers: ')
							currentElement.find('font').removeAttr('color')
							break
						case 7: // Comments TD
							currentElement.addClass('comments')
							currentElement.prepend('# Comments: ')
							break
						case 8: // Uploader TD
							currentElement.addClass('uploader')
							currentElement.prepend('# Uploader: ')
							break
					}
				}
			})
		})

		// Sorting Buttons
		$('<div id="TorrentGridControls"/>').insertBefore('#TorrentGrid')
		$.each($('.lista2t tbody tr:first-child td'), function (index) {
			const CONTENT = $(this).html()
			if (CONTENT.match('tdlinkfull3')) {
				const HREF = $(this).find('.tdlinkfull3').attr('href')
				const BUTTON_ID = HREF.substring(HREF.lastIndexOf('order=') + 6, HREF.indexOf('&by='))
				let buttonName = BUTTON_ID.charAt(0).toUpperCase() + BUTTON_ID.substr(1).toLowerCase()
				if (buttonName === 'Data') buttonName = 'Added'
				$('#TorrentGridControls').append('<span href="' + HREF + '" class="btn btn-primary jQGridSort">Sort ' + buttonName + '</span>')
			}
		})

		// Sorting title logic
		const URL = window.location.href
		let sorting_by = URL.substring(URL.lastIndexOf('&by=') + 4, URL.indexOf('&page='))
		if (URL.indexOf('&page=') === -1) sorting_by = URL.substring(URL.lastIndexOf('&by=') + 4)
		const BUTTON_ID = URL.substring(URL.lastIndexOf('order=') + 6, URL.indexOf('&by='))
		if (BUTTON_ID === 'https') {
			$('#TorrentGridControls').prepend('<h3>Not Sorted</h3>')
		} else {
			let buttonName = BUTTON_ID.charAt(0).toUpperCase() + BUTTON_ID.substr(1).toLowerCase()
			if (buttonName === 'Data') buttonName = 'Added'
			$('#TorrentGridControls').prepend('<h3>' + sorting_by + ' Sorted by ' + buttonName + '</h3>')
		}

		// Event trigger for sorting buttons
		$(document).on('click', '.jQGridSort', function () {
			location.href = $(this).attr('href')
		})

		// Removes the list from the DOM
		$('.lista2t').remove()

	}

})
