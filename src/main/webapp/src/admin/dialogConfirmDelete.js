import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';

@inject(HttpClient, DialogController)
export class CreateDialogConfirmDelete  {
  static inject = [DialogController];

  userForDeletion = '';

  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(userName){
   /* this.http.fetch('/searchableItems/'+itemId+'.json') 
         .then(response => response.json())
         .then(item => {}
         ); */
  this.userForDeletion = userName;

  }

  close(){
    this.controller.close(false);
  }

  confirm() {
    this.controller.close(true);
  }
  
}