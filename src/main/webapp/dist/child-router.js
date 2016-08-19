'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var ChildRouter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('ChildRouter', ChildRouter = function () {
        function ChildRouter() {
          _classCallCheck(this, ChildRouter);

          this.heading = 'Child Router';
        }

        ChildRouter.prototype.configureRouter = function configureRouter(config, router) {
          config.map([{ route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Pashion' }, { route: 'looks', name: 'looks', moduleId: 'looks', nav: true, title: 'Looks for Collection' }, { route: 'child-router', name: 'child-router', moduleId: 'child-router', nav: true, title: 'another route' }]);

          this.router = router;
        };

        return ChildRouter;
      }());

      _export('ChildRouter', ChildRouter);
    }
  };
});
//# sourceMappingURL=child-router.js.map
