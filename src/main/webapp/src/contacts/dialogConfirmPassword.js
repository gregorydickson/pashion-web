import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { UserService } from 'services/userService';

@inject(HttpClient, DialogController,UserService)
export class CreateDialogConfirmPassword  {
  static inject = [DialogController];

  checkPassword = '';
  flashMessage = '';
  triedPassword = '';

  constructor(http, controller, userService){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.userService = userService;
  }

  activate(user){
    this.user = user;

  }

  hide_un_hide_password_check() {
    var me = document.getElementById('password-check');
    var meType = me.getAttribute('type');
    if (meType == "password") {
            me.setAttribute('type', 'text');
            document.getElementById('password-word-check').innerHTML="Hide";
        }
    else {
            me.setAttribute('type', 'password');               
            document.getElementById('password-word-check').innerHTML="Show";
        }
  };

  cancel() {
    this.controller.close();
  }


  confirm() {
      /// call usercontroller to check password
      this.flashMessage = '';
      this.userService.checkPassword(this.user, this.checkPassword).then(response => {
          //console.log ("Check if this Password is valid: " + this.checkPassword + " response: " + response);

          if (response) {
            // if OK 
            this.controller.close(true); 
          }
          else {
            // if not OK
            // ERROR MESSAGE
            this.flashMessage = "Incorrect Password";
            this.checkPassword = '';  
          }
        });
    }
}