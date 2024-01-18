// ==UserScript==
// @name        Reddit: Plus
// @namespace   Nonce Scripts
// @description Additional little features for Reddit.
// @match     https://www.reddit.com*
// @version     1.2
// @copyright   2015 Armando Lüscher
// @author      Armando Lüscher
// @icon          https://www.google.com/s2/favicons?domain=reddit.com
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-1.11.3.min.js
// @homepageURL https://github.com/noplanman/Reddit-Plus
// @supportURL  https://github.com/noplanman/Reddit-Plus/issues
// ==/UserScript==

var RedditPlus = {};

/**
 * The MutationObserver to detect page changes.
 */
RedditPlus.Observer = {

  // The mutation observer object.
  observer : null,

  // The elements that we are observing.
  queryToObserve : '#siteTable',

  /**
   * Start observing for DOM changes.
   */
  init : function() {

    // Check if we can use the MutationObserver.
    if ('MutationObserver' in window) {
      var toObserve = document.querySelector(RedditPlus.Observer.queryToObserve);
      if (toObserve) {
        RedditPlus.Observer.observer = new MutationObserver(function() {
          RedditPlus.addCommentToggles();
        });

        // Observe child changes.
        RedditPlus.Observer.observer.observe(toObserve, {
          childList: true
        });
      }
    }
  }
};

/**
 * Fetch the comments and fill them into the appropriate div.
 * @param  {jQuery} $div DIV of the comment area.
 * @param  {string} url  URL of the entry to load the comments from.
 */
RedditPlus.loadComments = function($div, url) {
  // Let the user know that it's loading the comments.
  $div.html('loading...');

  // Get the comments page and extract the info we need.
  $.get(url, function(response) {
    // Get rid of all images first, no need to load those.
    var $post = $(response.replace(/<img[^>]*>/g, ''));

    // Also fetch the text telling us how many comments there are.
    var numOfCommentsText = $post.find('.flat-list .first .comments').html();
    $div.prevAll('.flat-list').find('.first .comments').html(numOfCommentsText);

    // Find the comments area.
    var $commentArea = $('.commentarea', $post);

    // Remove the title and comment filter menu.
    $commentArea.find('.panestack-title, .menuarea').remove();

    // Hide the input field to add a comment and add a button to show it.
    var $commentForm = $('.usertext.cloneable', $commentArea).hide();
    var $textArea = $('textarea', $commentForm);

    // Add a button at the top to add a new comment.
    $('<a/>', {
      class : 'rp-button',
      html  : '<button>add new comment</button><button style="display:none;">cancel</button>',
      click : function() {
        // Switch the "Add new comment" and "Cancel" buttons.
        $('button', this).toggle();

        // Show or Hide the comment form.
        $commentForm.toggle();

        // Set the focus on the comment input field.
        $textArea.focus();
      }
    }).prependTo($commentArea);

    $('button.save', $commentArea).click(function() { $textArea.focus(); });

    // Add a link at the bottom to close the comments.
    $('<a/>', {
      class : 'rp-link',
      html  : '<span>close comments [-]</span>',
      click : function() {
        // Scroll the window to the correct position.
        $(window).scrollTop($(window).scrollTop() - $div.height());

        // Hide the comments.
        RedditPlus.toggleComments($div, url);
      }
    }).appendTo($commentArea);


    // Add a button at the top to reload the comments.
    $('<a/>', {
      class : 'rp-button',
      html  : '<button>reload comments</button>',
      click : function() {
        // Reload all the comments.
        RedditPlus.loadComments($div, url);
      }
    }).prependTo($commentArea);

    // Add the freshly loaded comments to the DIV.
    $div.html($commentArea);
  });
};

/**
 * Toggle the comments area below the link.
 *
 * @param  {jQuery} $div DIV of the comment area.
 * @param  {string} url  URL of the entry to load the comments from.
 */
RedditPlus.toggleComments = function($div, url) {
  // Show / Hide the comments area div.
  $div.toggle();

  // Switch the "[+]" and "[-]" buttons.
  $div.closest('.entry').find('.rp-comments-toggle span').toggle();

  // If we aren't loading / haven't loaded the comments yet, do this now.
  if (!$div.attr('data-loading')) {
    $div.attr('data-loading', true);
    RedditPlus.loadComments($div, url);
  }
};

/**
 * Add the toggles next to the comment links.
 */
RedditPlus.addCommentToggles = function() {
  // Don't execute on comment pages.
  if ($('body.comments-page').length > 0) {
    return;
  }

  // Add toggles next to the comment links that haven't been handled yet.
  $('.comments').not('.rp-comments-toggle-added').each(function() {
    var $commentsLink = $(this);

    // Remember the url of the post page, cause that's where we load the comments from.
    var url = this.href;

    // The div that will contain the loaded comments.
    var $div = $('<div/>', {
      class : 'rp-comments-div',
      html  : 'loading...'
    })
    .hide()
    .appendTo($commentsLink.closest('.entry'));

    // Link to expand / reduce the comments.
    $('<a/>', {
      class : 'rp-comments-toggle',
      style : 'cursor: pointer;',
      html  : '<span title="show comments">[+]</span><span title="close comments" style="display:none">[-]</span>',
      click : function() {
        // Show or Hide the comments.
        RedditPlus.toggleComments($div, url);
      }
    }).insertAfter($commentsLink);

    // Add a class to remember which ones have already been added.
    $commentsLink.addClass('rp-comments-toggle-added');
  });
};

/**
 * Start the party.
 */
RedditPlus.init = function() {
  // Add the global CSS rules.
  GM_addStyle(
    '.rp-comments-div .rp-button { display: inline-block; margin: 4px; }' +
    '.rp-comments-div .rp-link { cursor: pointer; }'
  );

  // Start the observer.
  RedditPlus.Observer.init();

  // Initial load.
  RedditPlus.addCommentToggles();
};

// source: https://muffinresearch.co.uk/does-settimeout-solve-the-domcontentloaded-problem/
if (/(?!.*?compatible|.*?webkit)^mozilla|opera/i.test(navigator.userAgent)) { // Feeling dirty yet?
  document.addEventListener('DOMContentLoaded', RedditPlus.init, false);
} else {
  window.setTimeout(RedditPlus.init, 0);
}
