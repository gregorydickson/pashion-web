import { inject, singleton } from 'aurelia-framework';
import { AddressService } from '../services/addressService';
import { UserDatastore } from './userDatastore';

@inject(AddressService, UserDatastore)
@singleton()
export class AddressDatastore {
    deliverTo = [];
    availableDeliverToItems = [];
    selectedDeliverToItems = [''];
    selectedDeliverToId = null;
    selectedAddress = {};

    constructor(AddressService, UserDatastore) {
        this.userDatastore = UserDatastore;
        this.addressService = AddressService;
    }

    activate() {
        return this.reloadData();
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
        this.availableDeliverToItems = [];

        this.deliverTo.forEach(item => {
            if (item.surname) {
                if (item.city) item.surname = item.surname + "  (" + item.city + " Office)"
                this.availableDeliverToItems.push({
                    id: item.id,
                    text: item.name + " " + item.surname
                });
            } else {
                this.availableDeliverToItems.push({
                    id: item.id,
                    text: item.name
                });
            }
        });

        return Promise.resolve();
    }

    // set the selectedAddress and
    // the selectedDeliverToItems
    selectNewsetDeliverTo(selectedAddress) {
        let newestDeliverTo = this.availableDeliverToItems.reduce(function (max, x) {
            return x.id > max.id ? x : max;
        });

        console.log('Newest deliver to:', newestDeliverTo);

        this.selectedAddress = selectedAddress;
        this.selectedDeliverToItems = [newestDeliverTo.id];
    }

    reset() {
        this.selectedDeliverToItems = [''];
        this.selectedDeliverToId = null;
        this.selectedAddress = {};
    }
}