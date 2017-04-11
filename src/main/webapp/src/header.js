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
  availableUserItems = [
      { id: 'logout', text: 'LOGOUT' },
      { id: 'edit', text: 'EDIT PROFILE' },
  ];

  availableNavItems = [
    { id: 'index', text: 'DASHBOARD' }, 
    { id: 'adminpage', text: 'ADMIN' }
  ];

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
      return this.userService.getUser().then(user => {        
        this.user = user;
        this.userActionsPlaceholder = user.name;        
      });     
  }

  attached() {
    switch (this.theRouter.currentInstruction.config.name) {
      case 'adminpage':
        this.selectedNavItems = ['adminpage'];
        break;
    }
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




  userActions(selected){
    if (selected) {
      this.selectval1 = selected;
    }
  		//console.log("header action: " + this.selectval);
  		if (this.selectval1=="logout") window.location.href = '/user/logout';
      if (this.selectval1=="edit") {
        this.selectval1 = ""; // changes selectval back to name, not sure why As should be 2 way binding
        // Remove the edit profile option while they're on it        
        this.availableUserItems = [];
        this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
          .then(response => {
            this.userService.getUser().then(user => {
              this.user = user;

              // Add back in the available options
              this.availableUserItems = [
                { id: 'logout', text: 'LOGOUT' },
                { id: 'edit', text: 'EDIT PROFILE' },
              ];
            });
          
            
          });          
      };

  }  

  onUserActionCallback(event) {   
      console.log('onUserActionCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);             
          this.userActions(selectedValue);       
      }
  }

  onNavOptionCallback(event) {   
      console.log('onNavOptionCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);    
          
          this.admin(selectedValue);
      }
  }

  admin(route){     
      this.theRouter.navigateToRoute(route);
      
      if (this.currentRoute == "adminpage") {
         console.log("admin, getUser()");
         this.userService.getUser().then(user => this.user = user);       
      }
  }

  /* NOTE: Leaving previous admin() method in the event some of 
           this extra logic is needed for some reason. 
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
  */

    // Create dialog update photo
  CreateDialogUpdatePhoto(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {
        if (!response.wasCancelled && response == 'delete') {
          console.log("avatar deleted")
        }
      });
  }

    // Create dialog update photo
  updatePhoto() {
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {});
  }
    
}