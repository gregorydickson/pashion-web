import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewUser} from './admin/dialogNewUser';
import {CreateDialogImportUsers} from './admin/dialogImportUsers';
import {CreateDialogNewOffice} from './admin/dialogNewOffice';

@inject(DialogService, UserService)
export class Adminpage{
	  

  currentUser = {};
  users = [];



  constructor(dialogService,userService) {
    
    this.dialogService = dialogService;
    this.userService = userService;
  }

	activate() {
      this.userService.getUsersByOrganization(true).then(users => this.users = users);
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
      .then(response => {})
  }

  delete(id){
    console.log("deleting:"+id);
    this.userService.delete(id)
      .then(response =>{
        console.log("response to delete:"+response);
        this.userService.getUsersByOrganization(true).then(users => this.users = users)
      });

      

      

  }

  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }



}