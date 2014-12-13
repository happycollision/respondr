# Respondr

jQuery + Flickr + Picturefill = Respondr

Well, not really Picturefill, specifically. But rather the HTML spec that gives us `<picture>` and `srcset` and `sizes`. But it's still a good idea to use [Picturefill](http://scottjehl.github.io/picturefill/) along with Respondr.

Currently, Respondr looks for WordPress-Shortcode-inspired strings in your HTML and replaces them with an image element that contains `srcset` and `sizes` that are pulled in from Flickr.

I created this plugin to scratch my own itch. Because I am building this to work with Jekyll, GitHub Pages, and Average People Who Know Nothing About Web Development, it needs to be client-side and simple for content authors. All the author needs to know is the Flickr ID of the images they want to include. Folks like you and I will take care of the rest through how we call Respndr and our CSS rules.

If you are not using _GitHub Pages_ to run a site _for a friend/client_, there are probably better options for getting responsive images into your site that won't bounce your content around while loading.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/happycollision/jquery-respondr/master/dist/jquery.respondr.min.js
[max]: https://raw.githubusercontent.com/happycollision/jquery-respondr/master/dist/jquery.respondr.js

For example, in your web page:

```html
<script src="jquery.js"></script>
<script src="respondr.min.js"></script>
<script>
jQuery(function($) {
  $.respondr({apiKey: '98q34fhfwq0wiodnv0383nf0hei'}) // (This key is fake, use your own)
  $('.elements-to-search').respondr('100vw');
});
</script>
```

## Documentation

### Setting your API Key

To use Respondr, you'll need to provide a Flickr API Key. After loading `respondr.js`, but before calling the collection method that actually does the replacing, add the following:

```javascript

$.respondr({apiKey: 'your key here'});

```

After that is done, you can start replacing strings with images.

### Other options

```javascript

// Static method default options.
$.respondr.options = {
  apiKey: '',
  usePicturefill: false,
  callback: function(jQueryObject){return;}
};

```

__apiKey__: (string, required) Sets the Flickr API key.
__usePicturefill__: (boolean) Calls `window.picturefill()` automatically after the replacement is done since the kind of DOM alteration does not trigger Picturefill natively.
__callback__: (function) Optionally define a callback that will be fired after the string has been replaced with the new DOM elements. The jQuery object passed in is the `<span>` that wraps the newly-created `<picture>` element.

### Strings for valid replacement

In your HTML, you'll need to include strings that Respondr knows to look out for. They will look like this:

```
[respondr 123984127]
```

That's it. The number is replaced with the Flickr ID of the image. As of now, there is no way to add `alt` text to the image, but that is coming.

### Call Respondr's collection method

At the bottom of your page, call the collection method like you would any other jQuery chainable method.

```javascript
$('.divs-that-might-contain-replacement-strings').respondr();
```

**Note:** Don't use `'body'` or `'html'` as the jQuery selector. I don't knwo why it doens't work right now, but it doesn't. If you truly want to search the _entire page_ (which I don't recommend), use `'body > *'` as the selector.

`respondr()` takes 2 optional arguements.

`respondr(mediaQueries, includeSquares)`

- __mediaQueries__: String. This is what will be placed in the `sizes` attribute of the `img` tag. Defaults to `'100vw'`.
- __includeSquares__: Boolean or String. Flickr image sizes include versions of an image cropped to be square. `false` will exclude those sizes from the `srcset` tag on the image. `true` will include those sizes. Setting the value to the string `'only'` will exclude all non-square images. Note: Flickr only labels two fairly small images as "Square", even if the dimensions of all images are, technically, square. Right now it looks like the biggest size you'll get is 150x150. Default is `false`.

## Examples
Check out the [examples page](examples/respondr-examples.html).

## Release History

0.2.0: Add options for a callback and to automatically call `picturefill()`.
0.1.0: Initial release with minimal feature set.
