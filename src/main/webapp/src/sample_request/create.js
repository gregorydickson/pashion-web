import {DialogController} from 'aurelia-dialog';

export class Create {
  static inject = [DialogController];
  look = {};
  
  constructor(controller){
    this.controller = controller;
  }
  activate(look){
    this.person = look;
  }
}