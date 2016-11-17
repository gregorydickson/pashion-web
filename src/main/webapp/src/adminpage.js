import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewUser} from './admin/dialogNewUser';
import {CreateDialogImportUsers} from './admin/dialogImportUsers';
import {CreateDialogNewOffice} from './admin/dialogNewOffice';

@inject(DialogService, UserService)
export class Adminpage{
	  

  user = {};



  constructor(dialogService,userService) {
    
    this.dialogService = dialogService;
    this.userService = userService;

  }

	activate() {
      this.user = this.userService.getUser().then(user => this.user = user);
  }


  // Create dialog NEW USER

  CreateDialogNewUser() {
    this.dialogService.open({viewModel: CreateDialogNewUser, model: "no-op" })
      .then(response => {});
  }

    // Create dialog IMPORT USERS

  CreateDialogImportUsers() {
    this.dialogService.open({viewModel: CreateDialogImportUsers, model: "no-op" })
      .then(response => {});
  }



    // Create dialog NEW OFFICE

  CreateDialogNewOffice() {
    this.dialogService.open({viewModel: CreateDialogNewOffice, model: "no-op" })
      .then(response => {});
  }




}