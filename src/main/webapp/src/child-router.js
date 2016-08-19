export class ChildRouter {
  heading = 'Child Router';

  configureRouter(config, router) {
    config.map([
      { route: ['', 'welcome'], name: 'welcome',       moduleId: 'welcome',       nav: true, title: 'Pashion' },
      { route: 'looks',         name: 'looks',         moduleId: 'looks',         nav: true, title: 'Looks for Collection' },
      { route: 'child-router',  name: 'child-router',  moduleId: 'child-router',  nav: true, title: 'another route' }
    ]);

    this.router = router;
  }
}
