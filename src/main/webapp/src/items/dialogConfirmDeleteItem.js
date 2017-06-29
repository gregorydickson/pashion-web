import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';

@inject(HttpClient, DialogController)
export class CreateDialogConfirmDeleteItem  {
  static inject = [DialogController];

  lookForDeletion = '';

  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(look){
    this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);


   this.http.fetch('/searchableItem/fetchdeep/'+look.id+'.json')
      .then(response => response.json())
      .then(item => {
          this.lookForDeletion = item;
    });

  }

  close(){
    this.controller.close(false);
  }

  confirm() {
    this.controller.close(true);
  }
  
}