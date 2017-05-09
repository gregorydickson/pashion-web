import {
    inject,
    bindable,
    observable,
    customElement
} from 'aurelia-framework';
import {
    DialogController,
    DialogService
} from 'aurelia-dialog';

import {
    EditAddress
} from './editAddress';
import {
    DS
} from '../datastores/ds';
import {
    Helpers
} from '../common/helpers';

@inject(Element, DialogController, DialogService, DS, Helpers)
@customElement('select-address')
export class SelectAddress {

    @bindable selectedAddress = {};
    @bindable css = 'grid-content shrink';
    @bindable showMenu = false;
    @bindable showAdd = false;
    @bindable title = 'Deliver To';
    @bindable placeholder = 'SELECT ONE';
    @bindable width = 170;
    style = 'width: 170px';

    selectedDeliverToId = null;

    constructor(Element, DialogController, DialogService, DS, Helpers) {
        this.element = Element;
        this.dialogController = DialogController;
        this.dialogService = DialogService;
        this.ds = DS;
        this.helpers = Helpers;
    }

    attached() {
        // lets clear out the previously selected address
        // remove this line to keep the last selected address as default
        this.ds.address.reset();
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
        this.ds.address.selectedAddress = this.ds.address.deliverTo.find(item => item.id == this.selectedDeliverToId);
        console.log('Selected deliverTo:', this.ds.address.selectedAddress);

        // lets bubble this event with a generic event bubbler
        this.helpers.dispatchEvent(this.element, 'change', {
            selectedAddress: this.ds.address.selectedAddress
        });
    }

    add() {
        console.log("ad hoc");
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
                    console.log('good - ', response.output, newAddressModel);

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
                    console.log('bad');
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
                    // this.addressSelect.reload();

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
                            this.ds.address.reset();
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

    onDeliverToChangeCallback(event) {
        event.stopPropagation();
        console.log('onDeliverToChangeCallback() called:', event.detail.value);

        // let's ensure we don't bubble out the same event twice
        if (event.detail.value && this.selectedDeliverToId !== event.detail.value) {
            this.selectedDeliverToId = event.detail.value;
            this.ds.address.selectedAddress = this.ds.address.deliverTo.find(item => item.id == this.selectedDeliverToId);
            console.log('Selected deliverTo:', this.ds.address.selectedAddress);

            // lets bubble this event with a generic event bubbler
            this.helpers.dispatchEvent(this.element, 'change', {
                selectedAddress: this.ds.address.selectedAddress
            });
        }
    }

}