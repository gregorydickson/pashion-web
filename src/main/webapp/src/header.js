import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Router} from 'aurelia-router';
import {UserService} from './services/userService';

@inject(HttpClient,UserService,Router)
export class Header {

	user = {};

  constructor(http,userService,router) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    
    this.http = http;
    this.userService = userService;

    this.theRouter = router;
  }


	activate() {

      this.userService.getUser().then(user => this.user = user);
  }

  logout(){
  		console.log("logout: " + this.selectval);
  		if (this.selectval=="logout") window.location.href = '/user/logout';
      if (this.selectval=="guest") this.theRouter.navigate("guestpage");
  }

    admin(){
      console.log("admin: " + this.selectval);
      var currentRoute = this.theRouter.currentInstruction.config.name;
      if (currentRoute == 'index') this.theRouter.navigate("adminpage");
      if (currentRoute == 'requestman') this.theRouter.navigate("adminpage");
      if (currentRoute == 'adminpage') this.theRouter.navigate("/");
  }
    
}