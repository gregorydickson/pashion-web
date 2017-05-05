import { inject, singleton } from 'aurelia-framework';
import { UserDatastore } from './userDatastore';
import { AddressDatastore } from './addressDatastore';

@inject(UserDatastore, AddressDatastore)
@singleton()
export class DS {

    constructor(UserDatastore, AddressDatastore) {
        this.user = UserDatastore;
        this.address = AddressDatastore;
    }

    // we will activate the user datastore first
    // then we will activate all other datastores
    activate() {
        return this.user.activate()
            .then(() => {
                return Promise.all([
                    this.address.activate()
                ]);
            });
    }

}