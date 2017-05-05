import {
  DialogController
} from 'aurelia-dialog';
import {
  HttpClient,
  json
} from 'aurelia-fetch-client';
import 'fetch';
import {
  inject
} from 'aurelia-framework';
import {
  DateFormat
} from 'common/dateFormat';
import {
  AddressService
} from 'services/addressService'
import {
  Helpers
} from 'common/helpers';

@inject(DialogController, AddressService, Helpers)
export class NewAddress {
  static inject = [DialogController];

  newAddress = {};
  editMode = false;

  constructor(controller, addressService, Helpers) {
    this.controller = controller;
    this.addressService = addressService;
    this.helpers = Helpers;
  }

  close() {
    this.controller.close();
  }

  activate(model) {
    this.editMode = !this.helpers.isEmptyObject(model.newAddress);
    this.newAddress = model.newAddress;
  }

  createAddress() {

    this.addressService.createAdHoc(this.newAddress)
      .then(response => {
        // This should probably return the new address and not the list of all 
        this.controller.ok(response);
      });
  }

  updateAddress() {
    this.addressService.update(this.newAddress)
      .then(response => {
        // I think we need to json the data then update the store.
        this.controller.ok(response);
      });
  }


}