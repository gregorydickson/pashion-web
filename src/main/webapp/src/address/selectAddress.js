import { inject, bindable, observable, customElement } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { EditAddress } from './editAddress';
import { AddressService } from 'services/addressService';
import { Helpers } from '../common/helpers';

@inject(Element, DialogController, DialogService, AddressService, Helpers)
@customElement('select-address')
export class SelectAddress {

    @bindable selectedAddress = {};
    @bindable css = 'grid-content shrink';
    @bindable showMenu = false;
    @bindable showAdd = false;
    @bindable title = 'Deliver To';
    @bindable placeholder = 'Select';
    @bindable width = 170;
    style = 'width: 170px';

    @bindable deliverTo = [];
    availableDeliverToItems = [];
    selectedDeliverToItems = [''];
    selectedDeliverToId = null;

    selectedDeliverToId = null;
    editMode = false;

    constructor(Element, DialogController, DialogService, AddressService, Helpers) {
        this.element = Element;
        this.dialogController = DialogController;
        this.dialogService = DialogService;
        this.addressService = AddressService;
        this.helpers = Helpers;
    }

    attached() {
        this.addressService.getAll()
            .then(deliverTo => {
                this.deliverTo = deliverTo;
                console.log("set deliver to");
            });
    }
    deliverToChanged() {
        console.log("deliver to changed");
        this.availableDeliverToItems = [];

        this.deliverTo.forEach(item => {
            if (item.surname) {
                let text = `${item.name} ${item.surname}`;
                if (item.city) text = text + `  (${item.city} Office)`;

                this.availableDeliverToItems.push({
                    id: item.id,
                    text: text
                });
            } else {
                this.availableDeliverToItems.push({
                    id: item.id,
                    text: item.name
                });
            }
        });
    }

    widthChanged(newValue, oldValue) {
        if (newValue) {
            this.style = `width: ${newValue}px`;
        }
    }

    onActionSelectChanged(event) {
        let newValue = event.detail.value;
        if (newValue) {
            switch (newValue) {
                case 'AddNew':
                    this.add();
                    break;
                case 'Update':
                    this.update();
                    break;
                case 'Delete':
                    this.delete();
                    break;
            }
        }
        this.actionSelect.reset();
    }

    onAddressSelectChanged(event) {
        // lets bubble this event with a generic event bubbler
        this.selectedDeliverToId = event.detail.value;
        this.selectedAddress = this.ds.address.deliverTo.find(item => item.id == this.selectedDeliverToId);
        console.log('Selected deliverTo:', this.ds.address.selectedAddress);
        this.addressSelect.reset();
        // lets bubble this event with a generic event bubbler
        this.helpers.dispatchEvent(this.element, 'change', {
            selectedAddress: this.ds.address.selectedAddress
        });
    }

    add() {
        console.log("SelectAddres.add ad hoc");
        let newAddressModel = {
            addresses: this.ds.address.deliverTo,
            newAddress: {}
        }
        this.dialogService.open({
                viewModel: EditAddress,
                model: newAddressModel,
                lock: true
            })
            .then(response => {
                if (!response.wasCancelled) {
                    console.log('Accepted - ', response.output, newAddressModel);

                    // lets update the datastore
                    // this still assumes we get the whole list of addressess back
                    // and should be changed if we switch to only return the new record
                    // with an insert method on the datastore
                    this.ds.address.loadData(response.output)
                        .then(() => {
                            this.ds.address.selectNewsetDeliverTo(newAddressModel.newAddress);
                            // lets bubble this event with a generic event bubbler
                            this.helpers.dispatchEvent(this.element, 'change', {
                                selectedAddress: this.ds.address.selectedAddress
                            });
                            this.ds.address.reset();
                        });

                } else {
                    console.log('Cancelled');
                }

            });
    }

    update() {
        if (!this.ds.address.editMode)
            return;

        console.log("update address");
        let newAddressModel = {
            newAddress: this.ds.address.selectedAddress
        }

        this.dialogService.open({
                viewModel: EditAddress,
                model: newAddressModel,
                lock: true
            })
            .then(response => {
                if (!response.wasCancelled) {
                    console.log('good - ', response.output, newAddressModel);

                    this.addressSelect.reset();
                    this.ds.address.selectNewsetDeliverTo(newAddressModel.newAddress);
                } else {
                    console.log('bad');
                }

            });
    }

    delete() {
        if (!this.ds.address.editMode)
            return;

        console.log("delete address");
        let newAddressModel = {
            newAddress: this.ds.address.selectedAddress,
            deleteMode: true
        }

        this.dialogService.open({
                viewModel: EditAddress,
                model: newAddressModel,
                lock: true
            })
            .then(response => {
                if (!response.wasCancelled) {
                    console.log('good - ', response.output, newAddressModel);

                    // lets update the datastore
                    // this still assumes we get the whole list of addressess back
                    // and should be changed if we switch to only return the new record
                    // with an insert method on the datastore
                    this.ds.address.reloadData()
                        .then(() => {
                            this.ds.address.reset(true);
                            this.addressSelect.reset();
                            this.helpers.dispatchEvent(this.element, 'change', {
                                selectedAddress: {}
                            });
                        });

                } else {
                    console.log('bad');
                }

            });
    }


}