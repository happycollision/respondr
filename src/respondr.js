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
    return this.each(function (i) {
      var that = this;
      // Do something to each selected element.
      $.respondr(2423496036).done( function(data){
        $(that).html('<img src="'+data.sizes.size[6].source+'">');
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

  // Custom selector.
  $.expr[':'].respondr = function (elem) {
    // Does this element contain the name of your plugin?
    return $(elem).text().indexOf('respondr') !== -1;
  };

}(jQuery));
