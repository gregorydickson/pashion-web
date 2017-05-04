import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {AddressService} from 'services/addressService'

@inject(DialogController, AddressService)
export class NewAddress {
  static inject = [DialogController];

  newAddress = {};
  addresses = [];

  constructor(controller, addressService) {
    this.controller = controller;
    this.addressService = addressService;
  }

  close() {
    this.controller.close();
  }

  activate(model) {
    this.addresses = model.addresses;
    this.newAddress = model.newAddress;
  }

  createAddress() {

    this.addressService.createAdHoc(this.newAddress)
      .then(response => {
        // This should probably return the new address and not the list of all 
        this.controller.ok(response);
      });
  }


}
