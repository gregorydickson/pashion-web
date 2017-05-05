import { inject } from 'aurelia-framework';
import { DS } from './datastores/ds'

@inject(DS)
export class App {

	user = {};

	constructor(DS) {
		this.ds = DS;
	}

	configureRouter(config, router) {
		this.router = router;
		config.title = 'PASHION';
		config.map([
			// { route: ['', '/'],       name: 'index',       moduleId: 'index' },
			{ route: ['', '/'], name: 'index', moduleId: 'index' },
			{ route: 'requestman', name: 'requestman', moduleId: 'requestman' },
			{ route: 'adminpage', name: 'adminpage', moduleId: 'adminpage' }

		]);
	}

	activate() {
		return Promise.all([
			this.ds.activate()
				.then(() => {
					this.user = this.ds.user.user;
				}),
		]);
	}

}
