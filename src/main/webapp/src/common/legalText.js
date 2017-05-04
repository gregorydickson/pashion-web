import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(DialogController)
export class LegalText {
  

  //hardWireSeason = "";


  constructor(controller){
    this.controller = controller;
  }

  activate(season){
    //this.hardWireSeason = season;
  }
  
  

  

  close(){

    this.controller.close();
    
  }


}