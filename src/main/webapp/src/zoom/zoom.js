import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';


@inject(HttpClient, DialogController)
export class Zoom {
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
    this.http.fetch('/searchableItems/'+itemId+'.json')
         .then(response => response.json())
         .then(item => {
             this.currentItem = item;
           }
         );
  }

  close(){
    this.controller.close();
  }

  attached() {
 

    // Fit image to screen height
    var h = window.innerHeight;
    document.getElementById('imageZoom').style.height= h*0.8 +'px';     



  }
  
}