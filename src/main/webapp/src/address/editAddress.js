import {
  DialogController
} from 'aurelia-dialog';
import {
  HttpClient,
  json
} from 'aurelia-fetch-client';
import 'fetch';
import {
  inject,
  observable
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
export class EditAddress {
  static inject = [DialogController];

  newAddress = {};
  editMode = false;
  deleteMode = false

  titleText = '';
  buttonText = '';

  textItems = [{
    titleText: 'NEW',
    buttonText: 'Add'
  }, {
    titleText: 'UPDATE',
    buttonText: 'Update'
  }, {
    titleText: 'DELETE',
    buttonText: 'Delete'
  }];

  @observable textMode;
  textModeChanged(newValue, oldValue) {
    this.titleText = this.textItems[newValue].titleText;
    this.buttonText = this.textItems[newValue].buttonText;
  }

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
    this.deleteMode = model.deleteMode;
    this.newAddress = model.newAddress;

    if (this.editMode) {
      this.textMode = 1;
    } else {
      this.textMode = 0;
    }

    if (this.deleteMode) {
      this.textMode = 2;
    }
  }

  manageAddress() {

    switch (this.textMode) {
      case 0: // Add Address
        this.add();
        break;
      case 1: // Update Address
        this.update();
        break;
      case 2: // Delete Address
        this.delete();
        break;
    }

  }

  add() {
    this.addressService.createAdHoc(this.newAddress)
      .then(response => {
        // This should probably return the new address and not the list of all 
        this.controller.ok(response);
      });
  }

  update() {
    this.addressService.update(this.newAddress)
      .then(response => {
        // I think we need to json the data then update the store.
        this.controller.ok(response);
      });
  }

  delete() {
    this.addressService.delete(this.newAddress.id)
      .then(response => {
        // I think we need to json the data then update the store.
        this.controller.ok(response);
      });
  }


}