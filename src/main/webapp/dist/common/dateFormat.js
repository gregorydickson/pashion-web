"use strict";

System.register([], function (_export, _context) {
	"use strict";

	var DateFormat;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [],
		execute: function () {
			_export("DateFormat", DateFormat = function () {
				function DateFormat() {
					_classCallCheck(this, DateFormat);
				}

				DateFormat.urlString = function urlString(offset, months) {
					var d = new Date();

					return "?year=" + d.getFullYear() + "&month=" + (d.getMonth() + 1) + "&day=" + d.getDate() + "&offset=" + offset + "&months=" + months;
				};

				return DateFormat;
			}());

			_export("DateFormat", DateFormat);
		}
	};
});
//# sourceMappingURL=dateFormat.js.map
