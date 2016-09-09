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
          this.row0 = [];
          this.row1 = [];
          this.row2 = [];
          this.row3 = [];
          this.row4 = [];
          this.row5 = [];
          this.row6 = [];
          this.monthname = "";
          this.year = "";
          this.offset = 0;
          this.date = new Date();

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          this.http = http;
        }

        RequestCalendar.prototype.activate = function activate() {
          var _this = this;

          var queryString = DateFormat.urlString(0);

          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this.row0 = calendar.rows[0];
            _this.row1 = calendar.rows[1];
            _this.row2 = calendar.rows[2];
            _this.row3 = calendar.rows[3];
            _this.row4 = calendar.rows[4];
            _this.row5 = calendar.rows[5];
            _this.row6 = calendar.rows[6];
            _this.monthname = calendar.start.month.name;
            _this.year = calendar.start.year;
          });
        };

        RequestCalendar.prototype.previous = function previous() {
          var _this2 = this;

          var queryString = DateFormat.urlString(--this.offset);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this2.row0 = calendar.rows[0];
            _this2.row1 = calendar.rows[1];
            _this2.row2 = calendar.rows[2];
            _this2.row3 = calendar.rows[3];
            _this2.row4 = calendar.rows[4];
            _this2.row5 = calendar.rows[5];
            _this2.row6 = calendar.rows[6];
            _this2.monthname = calendar.start.month.name;
            _this2.year = calendar.start.year;
          });
        };

        RequestCalendar.prototype.next = function next() {
          var _this3 = this;

          var queryString = DateFormat.urlString(++this.offset);
          return this.http.fetch('/calendar/index.json' + queryString).then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this3.row0 = calendar.rows[0];
            _this3.row1 = calendar.rows[1];
            _this3.row2 = calendar.rows[2];
            _this3.row3 = calendar.rows[3];
            _this3.row4 = calendar.rows[4];
            _this3.row5 = calendar.rows[5];
            _this3.row6 = calendar.rows[6];

            _this3.monthname = calendar.start.month.name;
            _this3.year = calendar.start.year;
          });
        };

        return RequestCalendar;
      }()) || _class));

      _export('RequestCalendar', RequestCalendar);
    }
  };
});
//# sourceMappingURL=requestCalendar.js.map
