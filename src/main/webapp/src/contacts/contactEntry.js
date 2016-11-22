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

  lookEditContact(){
    var menu = this.lookEditContactRef; //$( this ).find( '.lookEditContact' ) // $(".lookEditContact", this); //document.getElementById("lookEditContact"+id);
    menu.classList.toggle("look-menu-show");
  }

  // Create dialog edit contact 

  createDialogEditContact() {
    var menu = this.lookEditContactRef; //document.getElementById("lookEditContact"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
      .then(response => {});
  }


  // Create dialog update photo

  CreateDialogUpdatePhoto() {
    var menu = this.lookEditContactRef; //document.getElementById("lookEditContact"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {});
  }


}