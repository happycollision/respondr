/*
 * Respondr
 * 
 *
 * Copyright (c) 2014 Don Denton
 * Licensed under the MIT license.
 */

(function ($) {

  // Collection method.
  $.fn.respondr = function () {

    var flickrData = {}; // object where flickr id is the index of the returned data
    // ie { "1239847239": {flickr data promise}, "90384752": {flickr data promise} }

    var createHtmlFromFlickrResponse = function(response){
      var output = '';
      $.each(response.sizes.size, function(i, size){
        output += '<img src="'+ size.source +'">';
      });
      return output;
    };

    var getFlickrDataAndWrapShortcodes = function(element){
      var pattern = /\[ {0,1}respondr (.*?)\]/ig;
      newHtml = $(element).html().replace(pattern, function(match, $1){
        flickrData[$1] = $.respondr($1);
        return '<span class="respondr-return" data-respondr-id="'+ $1 +'">' +
          match + '</span>';
      });
      $(element).html(newHtml);
    }

    return this.each(function () {

      getFlickrDataAndWrapShortcodes(this);

      var $respondrSpans = $(".respondr-return"); // for speed later

      $.each(flickrData, function(i,promise){
        promise.done( function(response){
          var html = createHtmlFromFlickrResponse(response);
          $respondrSpans.filter("[data-respondr-id='" + i + "']").html(html);
        });
      });

    });
  };

  // Static method.
  $.respondr = function (options) {
    var method = 'flickr.photos.getSizes';
    var format = 'json';

    if (options === null || typeof options === "undefined") {
      // TODO: Throw an error
      return;
    }

    if (typeof options === "object") {
      // Assume it's actually an options hash
      // Override default options with passed-in options.
      $.extend($.respondr.options, options);
    
    } else if (typeof options === "string" || typeof options === "number"){
      // We make the call
      var photoId = options;

      return $.ajax({
        url: 'https://api.flickr.com/services/rest/',
        data: {
          method: method,
          format: format,
          api_key: $.respondr.options.apiKey,
          photo_id: photoId,
          nojsoncallback: 1
        }

      });
    
    } else {
      // TODO: Throw an error
      return;
    }


  };

  // Static method default options.
  $.respondr.options = {
    apiKey: ''
  };

}(jQuery));
