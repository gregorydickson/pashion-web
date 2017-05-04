import { inject, bindable, customElement } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';

import { NewAddress } from './newAddress';
import { DS } from '../datastores/ds';
import { Helpers } from '../common/helpers';

@inject(Element, DialogController, DialogService, DS, Helpers)
@customElement('select-address')
export class SelectAddress {

    @bindable selectedAddress = {};
    @bindable css = 'grid-content shrink';

    @bindable hideName = false;
    @bindable hideContactPhone = false;
    @bindable hideCompany = false;
    @bindable hideAddress = false;
    @bindable hideCity = false;
    @bindable hideCountry = false;
    @bindable hidePostalCode = false;
    @bindable hideComment = false;
    

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

    addAdHoc() {
        console.log("ad hoc");
        let newAddressModel = { addresses: this.ds.address.deliverTo, newAddress: {} }
        this.dialogService.open({ viewModel: NewAddress, model: newAddressModel, lock: true })
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
