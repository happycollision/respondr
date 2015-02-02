/*! respondr - v0.2.1 - 2015-02-01
* https://github.com/happycollision/respondr
* Copyright (c) 2015 Don Denton; Licensed MIT */
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
        // TODO: display information to user to let them know there was a problem with Flickr. Or that there was a problem with their input.
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
          var $thisElement = $respondrSpans.filter("[data-respondr-id='" + i + "']");

          $thisElement.html('').append(element);

          if ($.respondr.options.usePicturefill) {
            if (typeof window.picturefill === 'function') { window.picturefill(); }
            else {
              window.console.log("Tried to call picturefill(), but it does not exist. Trying again in 2 seconds.");
              var tryPicturefillAgain = function(){
                if (typeof window.picturefill === 'function') { window.picturefill(); }
                else {window.console.log("Still no picturefill(). Giving up.");}
              };
              setTimeout(function() {tryPicturefillAgain();}, 2000);
            }
          }

          $.respondr.options.callback($thisElement);
        });
      });

    });
  };

  // Static method.
  $.respondr = function (options) {
    var method = 'flickr.photos.getSizes';
    var format = 'json';

    if (options === null || typeof options === "undefined") {
      throw("$.respondr() expects an argument. None given.");
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
      throw("$.respondr() was given an invalid argument.");
    }


  };

  // Static method default options.
  $.respondr.options = {
    apiKey: '',
    usePicturefill: false,
    callback: function(){return;}
  };

}(jQuery));
