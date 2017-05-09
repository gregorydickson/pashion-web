import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class AddressService {

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    getAll(user) {
        var promise = new Promise((resolve, reject) => {
            let url = '/dashboard/deliverTo/';

            if (user.type === 'brand') {
                url = '/dashboard/deliverToBrand/' + user.companyId;
            }

            this.http.fetch(url)
                .then(response => response.json())
                .then(deliverTo => {
                    resolve(deliverTo);
                })
                .catch(err => reject(err));
        });
        return promise;
    }

    delete(id) {

        var promise = new Promise((resolve, reject) => {

            this.http.fetch(`/address/delete/${id}.json`)
                .then(response => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        console.log('Network response was not ok.');
                        reject("Not Deleted");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;

    }

    update(address) {
        // if we are updating the current login user then need to set local 
        // and add the extra stuff for the current user

        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/address/updatejson/' + address.id + ".json", {
                method: 'post',
                body: json(address)
            })
                .then(response => response.json())
                .then(result => { resolve(result) }).catch(err => reject(err));
        });
        return promise;

    }

    create(address) {
        // if we are updating the current login user then need to set local 
        // and add the extra stuff for the current user
        console.log("updating address addressService");
        console.log(JSON.stringify(address));
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/address/createjson.json', {
                method: 'post',
                body: json(address)
            })
                .then(response => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        console.log('Network response was not ok.');
                        reject("Not Created");
                    }
                })
                .catch(err => reject(err));
        });
        return promise;
    }

    createAdHoc(newAddress) {

        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/brand/AddAddress', {
                method: 'post',
                body: json(newAddress)
            })
                .then(response => response.json())
                .then(newList => {
                    resolve(newList)
                });
        });
        return promise;
    }


}
