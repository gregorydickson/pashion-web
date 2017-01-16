import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class CreateDialogEditContact {
  static inject = [DialogController];

  user = {};
  userId = -1;

  constructor(http, controller, userService){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.userService = userService;

    parent = this;
    this.userService.getUser()
      .then(user => {
              parent.userId = user.id;
              parent.userService.getUserDetails(parent.userId)
                .then(currentContact => parent.user = currentContact) ;});

  }

  close(){
    this.controller.close();
  }
  


  }
