import { DialogController,DialogService } from 'aurelia-dialog';
import {HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject, observable, BindingEngine } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { AddressService } from 'services/addressService'
import { Helpers } from 'common/helpers';
import { CreateDialogAlert } from 'common/dialogAlert';


@inject(BindingEngine, DialogController, AddressService, Helpers,DialogService)
export class EditAddress {
  
  constructor(BindingEngine, controller, addressService, Helpers,dialogService) {
    this.bindingEngine = BindingEngine;
    this.controller = controller;
    this.addressService = addressService;
    this.dialogService = dialogService;
    this.helpers = Helpers;

  }


  static inject = [DialogController];

  editMode = false;
  deleteMode = false;
  newAddressSubscriptions = [];



    bindNewAddress() {
        console.log("editAddress.bindNewAddress");
        this.disposeNewAddress();
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'name').subscribe(() => this.setButtonDisabled()));
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'contactPhone').subscribe(() => this.setButtonDisabled()));
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'address1').subscribe(() => this.setButtonDisabled()));
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'city').subscribe(() => this.setButtonDisabled()));
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'country').subscribe(() => this.setButtonDisabled()));
        this.newAddressSubscriptions.push(this.bindingEngine.propertyObserver(this.newAddress, 'postalCode').subscribe(() => this.setButtonDisabled()));
    }

    disposeNewAddress() {
        console.log("editAddress.disposeNewAddress");
        if (this.newAddressSubscriptions) 
            while (this.newAddressSubscriptions.length) {
                this.newAddressSubscriptions.pop().dispose();
        }
    }

    close() {
        this.controller.close();
    }


    activate(model) {
        this.editMode = !this.helpers.isEmptyObject(model.newAddress);
        this.deleteMode = model.deleteMode;
        this.newAddress = model.newAddress;

        this.bindNewAddress();

        if (this.editMode) {
            this.textMode = 1;
            this.buttonText = "Update";
        } else {
            this.textMode = 0;
            this.buttonText = "Add";
        }

        if (this.deleteMode) {
            this.textMode = 2;
            this.buttonText = "Delete";
        }
    }

    detached() {
        this.disposeNewAddress();
    }

    setButtonDisabled() {
        if (this.deleteMode) {
            this.buttonDisabled = false;
        } else {
            this.buttonDisabled = ((this.newAddress.name && this.newAddress.contactPhone &&
                this.newAddress.address1 && this.newAddress.city &&
                this.newAddress.country && this.newAddress.postalCode) ? false : true);
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
        console.log("editAddress.add");
        this.addressService.createAdHoc(this.newAddress)
            .then(response => {
                
                this.controller.ok(response);
            });
    }

    update() {
        console.log("editAddress.update");
        this.addressService.update(this.newAddress)
            .then(response => { 
                this.controller.ok(this.newAddress);
            });

    }

  

  delete() {
    console.log("editAddress. delete: " + JSON.stringify(this.newAddress));
    if(this.newAddress.type === 'user'){
      this.alertP('Cannot Delete User');
    } else{

      this.addressService.delete(this.newAddress.originalId)
        .then(response => {
          // I think we need to json the data then update the store.
          this.controller.ok(response);
        });
    }
  }

}