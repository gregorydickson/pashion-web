import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Redirect} from 'aurelia-router';
import {UserService} from './services/userService';

@inject(HttpClient,UserService)
export class Header {

	user = {};

  constructor(http,userService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    
    this.http = http;
    this.userService = userService;
  }


	activate() {

      this.userService.getUser().then(user => this.user = user);
  }

  logout(){
  		console.log("logout");
  		window.location.href = '/user/login';
  }

    
}