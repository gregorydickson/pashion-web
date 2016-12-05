import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class DialogRequestContact {
  static inject = [DialogController];

  newEmail = '';


  constructor(http, controller){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  close(){
    this.controller.close();
  }
  
  requestConnection () {
    console.log("new connection: " + this.newEmail);
    this.close();
  }


  }
