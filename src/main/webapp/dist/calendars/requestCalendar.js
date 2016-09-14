'use strict';

System.register(['aurelia-framework', 'aurelia-fetch-client', 'common/dateFormat', 'fetch'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, DateFormat, _dec, _class, RequestCalendar;

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
    }, function (_commonDateFormat) {
      DateFormat = _commonDateFormat.DateFormat;
    }, function (_fetch) {}],
    execute: function () {
      _export('RequestCalendar', RequestCalendar = (_dec = inject(HttpClient), _dec(_class = function () {
        function RequestCalendar(http) {
          _classCallCheck(this, RequestCalendar);

          this.calendar = [];
          this.offset = 0;
          this.date = new Date();

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          this.http = http;
        }

        RequestCalendar.prototype.activate = function activate() {
          var _this = this;

          var queryString = DateFormat.urlString(0, 2);

          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this.calendar = calendar;
          });
        };

        RequestCalendar.prototype.previous = function previous() {
          var _this2 = this;

          var queryString = DateFormat.urlString(--this.offset, 2);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this2.calendar = calendar;
          });
        };

        RequestCalendar.prototype.next = function next() {
          var _this3 = this;

          var queryString = DateFormat.urlString(++this.offset, 2);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this3.calendar = calendar;
          });
        };

        return RequestCalendar;
      }()) || _class));

      _export('RequestCalendar', RequestCalendar);
    }
  };
});
//# sourceMappingURL=requestCalendar.js.map
