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
          this.seasons = [];
          this.brands = [];
          this.searchtext = '';

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          this.http = http;
        }

        Looks.prototype.activate = function activate() {
          var _this = this;

          return Promise.all([this.http.fetch('/collection/looks/1').then(function (response) {
            return response.json();
          }).then(function (collection) {
            return _this.looks = collection.looks;
          }), this.http.fetch('/collection/seasons').then(function (response) {
            return response.json();
          }).then(function (seasons) {
            return _this.seasons = seasons;
          }), this.http.fetch('/brand/index.json').then(function (response) {
            return response.json();
          }).then(function (brands) {
            return _this.brands = brands;
          })]);
        };

        Looks.prototype.submit = function submit() {};

        return Looks;
      }()) || _class));

      _export('Looks', Looks);
    }
  };
});
//# sourceMappingURL=looks.js.map
