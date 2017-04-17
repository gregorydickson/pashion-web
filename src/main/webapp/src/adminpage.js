import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewUser} from './admin/dialogNewUser';
import {CreateDialogImportUsers} from './admin/dialogImportUsers';
import {CreateDialogNewOffice} from './admin/dialogNewOffice';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';
import {CreateDialogConfirmDelete} from './admin/dialogConfirmDelete';
import {AddressService} from 'services/addressService';
import {CityService} from 'services/cityService';

@inject(DialogService, UserService, BrandService,PRAgencyService,PressHouseService, AddressService, CityService)
export class Adminpage{
	  

  //currentUser = {};
  users = [];
  addresses = [];
  //currentAddress = {};
  company = {};
  cities = [];




  constructor(dialogService,userService, brandService,prAgencyService, pressHouseService,addressService,cityService) {
    
    this.dialogService = dialogService;
    this.userService = userService;
    this.brandService = brandService;
    this.pressHouseService = pressHouseService;
    this.prAgencyService = prAgencyService;
    this.addressService = addressService;
    this.cityService = cityService;
  }

	activate() {
      this.userService.getUsersByOrganization(true).then(users => this.users = users);
      this.userService.getUser()
            .then(user => {
                this.user = user; 

                if (this.user.type === 'brand') {
                    this.brandService.getBrandAddresses(this.user.brand.id)
                        .then(addresses=>{this.addresses = addresses});
                    //console.log(JSON.stringify(this.user.brand));
                    this.company = this.user.brand;
                } else if (this.user.type === 'press') {
                    this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                        .then(addresses=>this.addresses = addresses)
                    this.company = this.user.pressHouse;
                } else {
                    this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                        .then(addresses=>this.addresses = addresses)
                    this.company = this.user.prAgency;
                }

             });
            this.cityService.getCities().then(cities=>this.cities = cities);
  }
  attached(){
    $("#passwordCheck").toggle();
  }

  deleteOffice(){
    this.addressService.delete(this.currentAddress.id).then(response =>{
      if (this.user.brand != null){
          this.brandService.getBrandAddresses(this.user.brand.id)
              .then(addresses=>{this.addresses = addresses})
      } else if(this.user.pressHouse != null){
          this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
              .then(addresses=>this.addresses = addresses)
      } else if(this.user.prAgency != null){
          this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
              .then(addresses=>this.addresses = addresses)
      }

    });
  }

  hideCalendar(){
    console.log("hideCalendar");
    this.brandService.hideCalendar(this.company.id).then(brand =>this.company=brand);
  }


  // Create dialog NEW USER

  CreateDialogNewUser() {
    console.log("cities:");
    console.log(JSON.stringify(this.cities));
    this.dialogService.open({viewModel: CreateDialogNewUser, model:this.cities, lock:true })
      .then(response => {

        console.log("user created:"+response);
        this.userService.getUsersByOrganization(true).then(users => this.users = users)
      
      });
  }

    // Create dialog IMPORT USERS

  CreateDialogImportUsers() {
    this.dialogService.open({viewModel: CreateDialogImportUsers, model: "no-op", lock:true })
      .then(response => {});
  }


    // Create dialog NEW OFFICE

  CreateDialogNewOffice(user) {
    this.dialogService.open({viewModel: CreateDialogNewOffice, model: this.user , lock:true})
      .then(response => {
        if (this.user.brand != null){
            this.brandService.getBrandAddresses(this.user.brand.id)
                .then(addresses=>{this.addresses = addresses})
        } else if(this.user.pressHouse != null){
            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                .then(addresses=>this.addresses = addresses)
        } else if(this.user.prAgency != null){
            this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                .then(addresses=>this.addresses = addresses)
        }
      })
  }

  deleteUser(id, userName){
    console.log("deleting:"+id);

      this.dialogService.open({viewModel: CreateDialogConfirmDelete, model: userName, lock:true })
                .then(response => {

                  console.log("confirm dialog was cancelled: " + response.wasCancelled);
                  if (response.wasCancelled) return false ;
                  this.userService.delete(id)
                    .then(response =>{
                      console.log("response to delete:"+response);
                      this.userService.getUsersByOrganization(true).then(users => this.users = users)
                    });
          })

  }

  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }

  updateUser(){
    console.log("adminPage.updateUser");
    // fill out the rest of the details for the user (done in userService)
    this.userService.update(this.currentUser);
  }

  addressChange(){
    console.log("updating address");
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