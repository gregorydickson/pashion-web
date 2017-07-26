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

    

    

    

    
}