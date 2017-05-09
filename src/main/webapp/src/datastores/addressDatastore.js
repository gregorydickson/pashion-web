import {
    inject,
    singleton,
    observable
} from 'aurelia-framework';
import {
    AddressService
} from '../services/addressService';
import {
    UserDatastore
} from './userDatastore';
import {
    Helpers
} from '../common/helpers';

@inject(AddressService, UserDatastore, Helpers)
@singleton()
export class AddressDatastore {
    @observable deliverTo = [];
    availableDeliverToItems = [];
    selectedDeliverToItems = [''];
    selectedDeliverToId = null;
    @observable selectedAddress = {};
    editMode = false;

    constructor(AddressService, UserDatastore, Helpers) {
        this.userDatastore = UserDatastore;
        this.addressService = AddressService;
        this.helpers = Helpers;
    }

    activate() {
        return this.reloadData();
    }

    selectedAddressChanged(newValue, oldValue) {
        this.editMode = !this.helpers.isEmptyObject(newValue);
    }

    deliverToChanged() {
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

    // this will fetch addresses based on account.type 
    // which is why we pass in the user record.
    reloadData() {
        return this.addressService.getAll(this.userDatastore.user)
            .then(deliverTo => {
                return this.loadData(deliverTo);
            });
    }

    // since adding addresses delivers back a complete updated list
    // we will allow for reloading without hitting the service
    loadData(data) {
        this.deliverTo = data;
        this.deliverToChanged();
        return Promise.resolve();
    }

    // set the selectedAddress and
    // the selectedDeliverToItems
    selectNewsetDeliverTo(selectedAddress) {
        this.deliverToChanged();
        let newestDeliverTo = this.availableDeliverToItems.reduce(function (max, x) {
            return x.id > max.id ? x : max;
        });

        console.log('Newest deliver to:', newestDeliverTo);

        this.selectedAddress = this.deliverTo.find(item => item.id == newestDeliverTo.id);
        this.selectedDeliverToId = newestDeliverTo.id;
        this.selectedDeliverToItems = [this.selectedDeliverToId];
    }

    reset() {
        this.selectedDeliverToItems = [''];
        this.selectedDeliverToId = null;
        // this.selectedAddress = {};
    }
}