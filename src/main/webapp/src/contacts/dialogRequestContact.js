import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class DialogRequestContact {
  static inject = [DialogController];

  newEmail = '';
  flashMessage = '';


  constructor(http, controller, userService){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;

    this.userService = userService;
  }

  close(){
    this.controller.close();
  }
  
  requestConnection () {
    this.flashMessage = '';
    var parent = this;
    //console.log("new connection: " + this.newEmail);
    //test to see if valid user
    // call user service
    var returned = this.userService.checkValidUser(this.newEmail);
    returned.then(function(result) {
      console.log ("=> " + result); 
      if (result==-1) {
        parent.flashMessage = "Not a valid user";
      }
      if (result!=-1) {
        parent.userService.addContactRequest(result);
        parent.close();
      }

    });
    
    //consider adding outgoing request in contact list

  }


  }
