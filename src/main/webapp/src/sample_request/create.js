import {DialogController} from 'aurelia-dialog';

export class Create {
  static inject = [DialogController];
  currentItem = {};

  constructor(controller){
    this.controller = controller;
  }
  activate(currentItem){
    this.currentItem = currentItem;
  }
}