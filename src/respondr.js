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
      // Do something to each selected element.
      $(this).html('respondr' + i);
    });
  };

  // Static method.
  $.respondr = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.respondr.options, options);
    // Return the name of your plugin plus a punctuation character.
    return 'respondr' + options.punctuation;
  };

  // Static method default options.
  $.respondr.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].respondr = function (elem) {
    // Does this element contain the name of your plugin?
    return $(elem).text().indexOf('respondr') !== -1;
  };

}(jQuery));
