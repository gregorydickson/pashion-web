import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewUser} from './admin/dialogNewUser';
import {CreateDialogImportUsers} from './admin/dialogImportUsers';
import {CreateDialogNewOffice} from './admin/dialogNewOffice';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';

import {AddressService} from 'services/addressService';

@inject(DialogService, UserService, BrandService,PRAgencyService,PressHouseService, AddressService)
export class Adminpage{
	  

  currentUser = {};
  users = [];
  addresses = [];
  currentAddress = {};
  company = {};




  constructor(dialogService,userService, brandService,prAgencyService, pressHouseService,addressService) {
    
    this.dialogService = dialogService;
    this.userService = userService;
    this.brandService = brandService;
    this.pressHouseService = pressHouseService;
    this.prAgencyService = prAgencyService;
    this.addressService = addressService;
  }

	activate() {
      this.userService.getUsersByOrganization(true).then(users => this.users = users);
      this.userService.getUser()
            .then(user => {
                this.userService.getUserDetails(user.id)
                    .then(currentContact => {
                        this.user = currentContact;
                        if (this.user.brand.id != null){
                            this.brandService.getBrandAddresses(this.user.brand.id)
                                .then(addresses=>{this.addresses = addresses});
                            this.company = user.brand;
                        } else if(this.user.pressHouse.id != null){
                            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                                .then(addresses=>this.addresses = addresses)
                            this.company = user.pressHouse;
                        } else if(this.user.prAgency.id != null){
                            this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                                .then(addresses=>this.addresses = addresses)
                            this.company = user.prAgency;
                        }

                     })
            });
  }
  attached(){
    $("#passwordCheck").toggle();
  }

  deleteOffice(){
    this.addressService.delete(this.currentAddress.id).then(response =>{
      if (this.user.brand.id != null){
          this.brandService.getBrandAddresses(this.user.brand.id)
              .then(addresses=>{this.addresses = addresses})
      } else if(this.user.pressHouse.id != null){
          this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
              .then(addresses=>this.addresses = addresses)
      } else if(this.user.prAgency.id != null){
          this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
              .then(addresses=>this.addresses = addresses)
      }

    });
  }


  // Create dialog NEW USER

  CreateDialogNewUser() {
    this.dialogService.open({viewModel: CreateDialogNewUser, model: "no-op" })
      .then(response => {

        console.log("user created:"+response);
        this.userService.getUsersByOrganization(true).then(users => this.users = users)
      
      });
  }

    // Create dialog IMPORT USERS

  CreateDialogImportUsers() {
    this.dialogService.open({viewModel: CreateDialogImportUsers, model: "no-op" })
      .then(response => {});
  }


    // Create dialog NEW OFFICE

  CreateDialogNewOffice(user) {
    this.dialogService.open({viewModel: CreateDialogNewOffice, model: this.user })
      .then(response => {
        if (this.user.brand.id != null){
            this.brandService.getBrandAddresses(this.user.brand.id)
                .then(addresses=>{this.addresses = addresses})
        } else if(this.user.pressHouse.id != null){
            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                .then(addresses=>this.addresses = addresses)
        } else if(this.user.prAgency.id != null){
            this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                .then(addresses=>this.addresses = addresses)
        }
      })
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

  updateUser(){
    console.log("updating user");
    this.userService.update(this.currentUser);
  }

  addressChange(){
    console.log("updating address");
    console.log(JSON.stringify(this.currentAddress));
    this.addressService.update(this.currentAddress);
  }

  

  togglePassword() {
      console.log("toggle password");
        var me = document.getElementById('password');
        var meType = me.getAttribute('type');
        if (meType == "password") {
                me.setAttribute('type', 'text');
                document.getElementById('password-toggle').innerHTML="Hide";
        }
        else {
                me.setAttribute('type', 'password');               
                document.getElementById('password-toggle').innerHTML="Show";
        }
  }

  checkPassword(e) {
    console.log("checkPassword");
    var pw = document.getElementById("password");
    
    let str = pw.value;
    if (str.length < 8) {
        $("#passwordCheck").hide();
        return("too_short");
    } else if (str.length > 50) {
        $("#passwordCheck").hide();
        return("too_long");
    } else if (str.search(/\d/) == -1) {
        $("#passwordCheck").hide();
        return("no_num");
    } else if (str.search(/[a-zA-Z]/) == -1) {
        $("#passwordCheck").hide();
        return("no_letter");
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        $("#passwordCheck").hide();
        return("bad_char");
    }
    $("#passwordCheck").show();
    this.updateUser();
    
  }



}