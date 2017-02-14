import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
//import {UserService} from 'services/userService.js'

@inject(DialogController)
export class IntroductionGuest {
  

  hardWireSeason = "";


  constructor(controller,userService){
    this.controller = controller;
    // this.userService = userService;
  }

  activate(season){
    this.hardWireSeason = season;
  	// return this.user = this.userService.getUser().then(user => {this.user = user;})
  }
  
  

  

  close(){

    this.controller.close();
    
  }


}