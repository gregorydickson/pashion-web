import {UserService} from './services/userService';
import {inject} from 'aurelia-framework';


@inject(UserService)
export class App {

	user = {};

	constructor(userService) {
	    this.userService = userService;

	  }

	configureRouter(config, router) {
    this.router = router;
    config.title = 'PASHION';
    config.map([
      { route: ['', '/'],       name: 'guestpage',       moduleId: 'guestpage' },
      {	route: 'requestman',	name: 'requestman',  moduleId: 'requestman'},
      {	route: 'guestpage',	name: 'guestpage',  moduleId: 'guestpage'},
      {	route: 'adminpage',	name: 'adminpage',  moduleId: 'adminpage'}
      
    ]);
  }

    activate() {
	    
	    return Promise.all([
	      this.user = this.userService.getUser().then(user => {
	        this.user = user;
	        
	      })

	    ]);
	  }
  
}
