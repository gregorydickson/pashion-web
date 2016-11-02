import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';


@inject(DialogController)
export class Zoom {
  currentItem = {};
 

  constructor(controller){
    this.controller = controller;
    
  }
  
  close(){
    this.controller.close();
  }


}