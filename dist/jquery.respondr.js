/*! respondr - v0.1.0 - 2014-11-14
* https://github.com/happycollision/respondr
* Copyright (c) 2014 Don Denton; Licensed MIT */
(function ($) {

  // Collection method.
  $.fn.respondr = function (mediaQuerySizes, includeSquares) {
    // object where flickr id is the index of the returned data
    // ie { "1239847239": {flickr data promise}, "90384752": {flickr data promise} }
    var flickrData = {};

    if ( typeof mediaQuerySizes !== 'string' || mediaQuerySizes.length < 1 ) {
      mediaQuerySizes = '100vw';
    }
    if (includeSquares !== true && includeSquares !== 'only') {
      includeSquares = false;
    }

    var createImgElementsFromFlickrResponse = function(response){
      if (response.stat !== 'ok'){
        // Handle the error
        return 'no images';
      }
      
      var output = '';
      var image = new Image();
      var srcset = [];
      $.each(response.sizes.size, function(i, size){
        var addSize = function(){
          srcset.push(size.source + ' ' + size.width + 'w');
        };
        var imgIsSquare = ( size.label.indexOf('Square') !== -1 );
        
        if ( includeSquares === true ){
          addSize();
          return;
        }
        if ( includeSquares === false && !imgIsSquare ) {
          addSize();
          return;
        }
        if ( includeSquares === 'only' && imgIsSquare ) {
          addSize();
        }
      });
      srcset = srcset.join(',');
      image.srcset = srcset;
      image.sizes = mediaQuerySizes;

      output = image;
      return output;
    };

    var getFlickrDataAndWrapShortcodes = function(element){
      var pattern = /\[ {0,1}respondr (.*?)\]/ig;
      var imgWrapper = $(element).html().replace(pattern, function(match, $1){
        flickrData[$1] = $.respondr($1);
        return '<span class="respondr-return" data-respondr-id="'+ $1 +'">' +
          'replacing image' + '</span>';
      });
      $(element).html(imgWrapper);
    };

    return this.each(function () {

      getFlickrDataAndWrapShortcodes(this);

      var $respondrSpans = $(".respondr-return"); // for speed later

      $.each(flickrData, function(i,promise){
        promise.done( function(response){
          var element = createImgElementsFromFlickrResponse(response);
          $respondrSpans.filter("[data-respondr-id='" + i + "']").html('').append(element);
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
