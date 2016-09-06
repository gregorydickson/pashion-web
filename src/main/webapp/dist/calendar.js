'use strict';

System.register(['aurelia-framework', 'aurelia-fetch-client', 'fetch'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, _dec, _class, Calendar;

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
      _export('Calendar', Calendar = (_dec = inject(HttpClient), _dec(_class = function () {
        function Calendar(http) {
          _classCallCheck(this, Calendar);

          this.calendar = [];
          this.row0 = [];
          this.row1 = [];
          this.row2 = [];
          this.row3 = [];
          this.row4 = [];
          this.row5 = [];

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          this.http = http;
        }

        Calendar.prototype.activate = function activate() {
          var _this = this;

          return this.http.fetch('/calendar/').then(function (response) {
            return response.json();
          }).then(function (calendar) {
            _this.row0 = calendar.rows[0];
            _this.row1 = calendar.rows[1];
            _this.row2 = calendar.rows[2];
            _this.row3 = calendar.rows[3];
            _this.row4 = calendar.rows[4];
            _this.row5 = calendar.rows[5];
          });
        };

        Calendar.prototype.submit = function submit() {};

        return Calendar;
      }()) || _class));

      _export('Calendar', Calendar);
    }
  };
});
//# sourceMappingURL=calendar.js.map
