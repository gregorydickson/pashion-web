import { inject, bindable, observable, customElement } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { EditAddress } from './editAddress';
import { AddressService } from 'services/addressService';
import { Helpers } from '../common/helpers';

@inject(Element, DialogController, DialogService, AddressService, Helpers)
@customElement('select-address')
export class SelectAddress {

    @observable selectedAddress = {};
    @bindable css = 'grid-content shrink';
    @bindable showMenu = false;
    @bindable showAdd = false;
    @bindable title = 'Deliver To';
    @bindable placeholder = 'Select';
    @bindable width = 170;
    style = 'width: 170px';

    @observable deliverTo = [];
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

    selectedAddressChanged(newValue, oldValue) {
        this.editMode = !this.helpers.isEmptyObject(newValue);
    }


    reloadData() {
        console.log("reload data");
        this.addressService.getAll()
            .then(deliverTo => {
                console.log("new data");
                this.loadData(deliverTo);
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
        this.selectedAddress = this.deliverTo.find(item => item.id == this.selectedDeliverToId);
        console.log('Selected deliverTo:', this.selectedAddress);
        this.addressSelect.reset();
        // lets bubble this event with a generic event bubbler
        this.helpers.dispatchEvent(this.element, 'change', {
            selectedAddress: this.selectedAddress
        });
    }

    add() {
        console.log("SelectAddres.add ad hoc");
        let newAddressModel = {
            addresses: this.deliverTo,
            newAddress: {}
        }
        this.dialogService.open({
                viewModel: EditAddress,
                model: newAddressModel,
                lock: true
            })
            .then(response => {
                if (!response.wasCancelled) {
                    console.log('Accepted - ', newAddressModel);
                    
                    this.loadData(response.output);
                    this.selectNewsetDeliverTo(newAddressModel.newAddress);
                    // lets bubble this event with a generic event bubbler
                    this.helpers.dispatchEvent(this.element, 'change', {
                        selectedAddress: this.selectedAddress
                    });
                    this.reset();
                        
                        
                    
                    
                    

                } else {
                    console.log('Cancelled');
                }

            });
    }

    update() {
        if (!this.editMode)
            return;

        console.log("update address");
        let newAddressModel = {
            newAddress: this.selectedAddress
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
                    this.selectNewsetDeliverTo(newAddressModel.newAddress);
                } else {
                    console.log('bad');
                }

            });
    }

    
    selectNewsetDeliverTo(address) {
        console.log("finding:");
        console.log(JSON.stringify(address));
        this.deliverToChanged();
        let newestDeliverTo = this.deliverTo.find(function (item) {
            console.log(JSON.stringify(item));
            return ((item.address1 === address.address1) && 
                (item.name ===  address.name));
        });

        console.log('Newest deliver to:', newestDeliverTo);

        this.selectedAddress = newestDeliverTo;
        this.selectedDeliverToId = newestDeliverTo.id;
        this.selectedDeliverToItems = [this.selectedDeliverToId];
    }

    delete() {
        if (!this.editMode)
            return;

        console.log("delete address");
        let newAddressModel = {
            newAddress: this.selectedAddress,
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
                    this.reloadData();
                        
                    this.reset(true);
                    this.addressSelect.reset();
                    this.helpers.dispatchEvent(this.element, 'change', {
                        selectedAddress: {}
                    });
                        

                } else {
                    console.log('bad');
                }

            });
    }

    reset(hard) {
        this.selectedDeliverToItems = [''];
        this.selectedDeliverToId = null;
        if (hard)
            this.selectedAddress = {};
    }

    loadData(data) {
        this.deliverTo = data;
        this.deliverToChanged();
        
    }


}