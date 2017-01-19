import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';

@inject(DialogController, UserService)
export class CreateDialogNewUser {
  static inject = [DialogController];


  constructor(controller, userService){
    this.controller = controller;
    this.userService = userService;
  }


  close(){
    this.controller.close();
  }
  




}
