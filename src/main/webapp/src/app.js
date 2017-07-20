import { inject } from 'aurelia-framework';
import {UserService} from 'services/userService';

@inject(UserService)
export class App {

	

	constructor(UserService) {
		this.userService = UserService;
	}

	configureRouter(config, router) {
		this.router = router;
		config.title = 'PASHION';
		config.map([
			// { route: ['', '/'],       name: 'index',       moduleId: 'index' },
			{ route: ['', '/'], name: 'index', moduleId: 'index',title:'Dashboard' },
			{ route: 'requestman', name: 'requestman', moduleId: 'requestman',title:'Dashboard' },
			{ route: 'adminpage', name: 'adminpage', moduleId: 'adminpage',title:'Admin' }

		]);
	}

	activate() {
		return this.userService.getUser().then(user =>this.user = user);
	}

}
