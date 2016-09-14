'use strict';

System.register(['aurelia-framework', 'aurelia-fetch-client', 'common/dateFormat', 'fetch'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, DateFormat, _dec, _class, Calendar;

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
      _export('Calendar', Calendar = (_dec = inject(HttpClient), _dec(_class = function () {
        function Calendar(http) {
          _classCallCheck(this, Calendar);

          this.calendar = [];
          this.monthname = "";
          this.year = "";
          this.offset = 0;
          this.date = new Date();

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          this.http = http;
        }

        Calendar.prototype.activate = function activate() {
          var _this = this;

          var queryString = DateFormat.urlString(0, 1);

          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this.calendar = calendar;
            _this.monthname = calendar.calendarMonths[0].monthName;
            _this.year = calendar.calendarMonths[0].year;
          });
        };

        Calendar.prototype.previous = function previous() {
          var _this2 = this;

          var queryString = DateFormat.urlString(--this.offset, 1);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this2.calendar = calendar;
            _this2.monthname = calendar.calendarMonths[0].monthName;
            _this2.year = calendar.calendarMonths[0].year;
          });
        };

        Calendar.prototype.next = function next() {
          var _this3 = this;

          var queryString = DateFormat.urlString(++this.offset, 1);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this3.calendar = calendar;
            _this3.monthname = calendar.calendarMonths[0].monthName;
            _this3.year = calendar.calendarMonths[0].year;
          });
        };

        return Calendar;
      }()) || _class));

      _export('Calendar', Calendar);
    }
  };
});
//# sourceMappingURL=calendar.js.map
