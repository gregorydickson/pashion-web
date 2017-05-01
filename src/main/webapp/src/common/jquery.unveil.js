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
      //console.log("Window in focus: " + !document.hidden);
      console.log("Unveil called wit h images: " + images.length);
      //console.log("Unveil called with lazies jquery: " + $("img.lazy").length);
      //console.log ("Unveil MSW visibility: "+ document.getElementById("mainScrollWindow").style.visibility);
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
      //console.log("loaded(IE inview): " + loaded.length);
      images = images.not(loaded);
      //console.log("iamges(IE not loaded): " + images.length);
    }

    $(window).on("resize.unveil", unveil);
    $("#mainScrollWindow").on("scroll.unveil", unveil);

    $(window).focus(function(){
      //console.log("focused :" + !document.hidden + " " + $("img.lazy").length);
      setTimeout (function() {$("img.lazy").unveil();}, 3000); //RM instantiate *if not already* on tab but wait to settle
    });

    //RM don't instantiate unveil if browser tab is not visible
    //if (!document.hidden) 
      unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
