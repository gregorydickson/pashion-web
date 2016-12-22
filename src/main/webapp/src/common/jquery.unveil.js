/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 100,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      //console.log("unveil source1: " + source);
      source = source || this.getAttribute("data-src");

      //console.log("unveil source2: " + source);
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      //console.log("Unveil called w images: " + images.length);
      var inview = images.filter(function() {
        var $e = $(this);

        //console.log("unveil e: " + $e);
        //console.log ("unveil $e is hidden: " + ($e.is(':hidden') ));
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        //console.log("unveil invew, wt:"+ wt + " wb:" + wb +" et:" + et + " eb:" +eb);

        //console.log("unveil invew: " + (eb >= wt - th && et <= wb + th));
        return eb >= wt - th && et <= wb + th;
      });

      //console.log("images: " + images.length);
      loaded = inview.trigger("unveil");
      //console.log("loaded: " + loaded.length);
      images = images.not(loaded);
    }

    $(window).on("resize.unveil lookup.unveil", unveil);
    $("#mainScrollWindow").on("scroll.unveil resize.unveil lookup.unveil", unveil);

    //$("div.cards-list-wrap").scroll(function(){unveil();});
    //$w.scroll(function(){unveil();});

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
