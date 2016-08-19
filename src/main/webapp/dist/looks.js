'use strict';

System.register(['aurelia-framework', 'aurelia-fetch-client', 'fetch'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, _dec, _class, Looks;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_fetch) {}],
    execute: function () {
      _export('Looks', Looks = (_dec = inject(HttpClient), _dec(_class = function () {
        function Looks(http) {
          _classCallCheck(this, Looks);

          this.heading = 'Looks for a Collection';
          this.looks = [];

          http.configure(function (config) {
            config.useStandardConfiguration().withBaseUrl('http://localhost:8080');
          });

          this.http = http;
        }

        Looks.prototype.activate = function activate() {
          var _this = this;

          return this.http.fetch('/collection/looks/1').then(function (response) {
            return response.json();
          }).then(function (collection) {
            return _this.looks = collection.looks;
          });
        };

        return Looks;
      }()) || _class));

      _export('Looks', Looks);
    }
  };
});
//# sourceMappingURL=looks.js.map
