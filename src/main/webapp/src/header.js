import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Router} from 'aurelia-router';
import {UserService} from './services/userService';
import {CreateDialogEditContact} from './contacts/dialogEditContact';
import {DialogService} from 'aurelia-dialog';

@inject(HttpClient,UserService,Router, DialogService)
export class Header {

	//user = {};
  currentRoute = '';

  constructor(http,userService,router, dialogService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.userService = userService;
    this.theRouter = router;
    this.dialogService = dialogService;
  }


	activate() {

      this.userService.getUser().then(user => this.user = user);
  }

  filterMode(event) {
        console.log("Filter Mode");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';
                    console.log("value:" + event.detail.value)
                }
                //console.log("Filter change called, Theme: " + this.selectedTheme);
    }




  userActions(){
  		//console.log("header action: " + this.selectval);
  		if (this.selectval=="logout") window.location.href = '/user/logout';
      if (this.selectval=="edit") {
        this.selectval = ""; // changes selectval back to name, not sure why As should be 2 way binding
        this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
          .then(response => {
            this.userService.getUser().then(user => this.user = user);
          });
      };

  }

    admin(){
      console.log("admin: " + this.selectval);
      if(this.selectval == "DASHBOARD") {
        this.userService.getUser().then(user => this.user = user);
      }
      this.currentRoute = this.theRouter.currentInstruction.config.name;
      if (this.currentRoute == 'index') this.theRouter.navigate("adminpage");
      if (this.currentRoute == 'requestman') this.theRouter.navigate("adminpage");
      if (this.currentRoute == 'adminpage') this.theRouter.navigate("/");
  }
    
}