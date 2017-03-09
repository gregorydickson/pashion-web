import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {AddressService} from 'services/addressService'

@inject(DialogController,AddressService)
export class NewAddress {
  static inject = [DialogController];

  newAddress = {};
  addresses = [];

  constructor(controller,addressService){
    this.controller = controller;
    this.addressService = addressService;
  }

  close(){
    this.controller.close();
  }

  activate(addresses){
    this.addresses = addresses;
  }
  
  createAddress(){
    
    this.addressService.createAdHoc(this.newAddress)
      .then(response =>{
        this.addresses = response;
        this.controller.close();
      }); 
  }


}
