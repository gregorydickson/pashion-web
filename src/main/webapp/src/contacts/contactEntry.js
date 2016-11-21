import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';

@inject(HttpClient, DialogController, DialogService)
export class ContactEntry {
	static inject = [DialogController];


  constructor(http, controller, dialogService){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;

  }

  // Three dots contact edit menu

  lookEditContact(id){
    var menu = document.getElementById("lookEditContact"+id);
    menu.classList.toggle("look-menu-show");
  }

  // Create dialog edit contact 

  createDialogEditContact(itemId) {
    var menu = document.getElementById("lookEditContact"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogEditContact, model: itemId })
      .then(response => {});
  }


  // Create dialog update photo

  CreateDialogUpdatePhoto(itemId) {
    var menu = document.getElementById("lookEditContact"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: itemId })
      .then(response => {});
  }


}