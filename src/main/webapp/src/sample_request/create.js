import {DialogController} from 'aurelia-dialog';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';

@inject(HttpClient, DialogController)
export class Create {
  static inject = [DialogController];
  currentItem = {};

  constructor(http, controller){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }
  activate(itemId){
  	this.http.fetch('/searchableItems/' +itemId+ '.json')
      .then(response => response.json()).then(item => this.currentItem = item);
    
  }
}