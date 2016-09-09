export class App {

	configureRouter(config, router) {
    this.router = router;
    config.title = 'Pashion';
    config.map([
      { route: ['', '/'],       name: 'index',       moduleId: 'index' },
      {	route: 'requestman',	name: 'requestman',  moduleId: 'requestman'}
      
    ]);
  }
  
}
