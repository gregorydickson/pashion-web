export class App {

	configureRouter(config, router) {
    this.router = router;
    config.title = 'PASHION';
    config.map([
      { route: ['', '/'],       name: 'index',       moduleId: 'index' },
      {	route: 'requestman',	name: 'requestman',  moduleId: 'requestman'},
      {	route: 'guestpage',	name: 'guestpage',  moduleId: 'guestpage'},
      {	route: 'adminpage',	name: 'adminpage',  moduleId: 'adminpage'}
      
    ]);
  }
  
}
