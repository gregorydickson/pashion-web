import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Router} from 'aurelia-router';
import {UserService} from './services/userService';
import {CreateDialogEditContact} from './contacts/dialogEditContact';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogUpdatePhoto} from './contacts/dialogUpdatePhoto';

@inject(HttpClient,UserService,Router, DialogService)
export class Header {

	//user = {};
  currentRoute = '';

  navOptions = [ {value: "index", name: "DASHBOARD"}, {value: "adminpage", name: "ADMIN"}];

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
  		if (this.selectval1=="logout") window.location.href = '/user/logout';
      if (this.selectval1=="edit") {
        this.selectval1 = ""; // changes selectval back to name, not sure why As should be 2 way binding
        this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
          .then(response => {
            this.userService.getUser().then(user => this.user = user);
          });
      };

  }

    admin(){   
      this.currentRoute = this.theRouter.currentInstruction.config.name;
      console.log("admin, currentRoute: " + this.currentRoute);
      if (this.currentRoute == 'index') { this.theRouter.navigate("adminpage"); }
      if (this.currentRoute == 'requestman') { this.theRouter.navigate("adminpage"); }
      if (this.currentRoute == 'adminpage') { this.theRouter.navigate("/"); }

      if (this.currentRoute == "adminpage") {
        this.userService.getUser().then(user => this.user = user);
        console.log("admin, getUser()");
      }
  }

    // Create dialog update photo
  CreateDialogUpdatePhoto(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {});
  }

    // Create dialog update photo
  updatePhoto() {
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {});
  }
    
}