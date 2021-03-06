import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {AddressService} from 'services/addressService'

@inject(HttpClient, DialogController,AddressService)
export class CreateDialogNewOffice {
  static inject = [DialogController];

  newAddress = {};
  user = {};

  constructor(http, controller,addressService){
    this.controller = controller;
    this.addressService = addressService;
  }

  close(){
    this.controller.close();
  }

  activate(user){
    this.user = user;
  }
  
  createAddress(){
      if (this.user.brand != null){
          this.newAddress.brand = this.user.brand;
      } else if(this.user.pressHouse != null){
          this.newAddress.pressHouse = this.user.pressHouse;
      } else if(this.user.prAgency != null){
          this.newAddress.prAgency = this.user.prAgency;
      }
    this.addressService.create(this.newAddress)
      .then(response =>{
        this.controller.ok();
      });
  }


}
