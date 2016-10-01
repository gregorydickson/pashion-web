/* */ 
var system = require('system'),
    fs = require('fs'),
    webpage = require('webpage');
(function(phantom) {
  var page = webpage.create();
  function debugPage() {
    console.log("Refresh a second debugger-port page and open a second webkit inspector for the target page.");
    console.log("Letting this page continue will then trigger a break in the target page.");
    debugger;
    page.open(system.args[1]);
    page.evaluateAsync(function() {
      debugger;
    });
  }
  debugPage();
}(phantom));
