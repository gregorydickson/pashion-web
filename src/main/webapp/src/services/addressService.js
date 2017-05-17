
//import { DS } from 'datastores/ds';
import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient
    //, DS
    )
@singleton()
export class AddressService {

    constructor(http
        //, DS
        ) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        //this.ds = DS;
    }

    attached() {
        //this.user = this.ds.user.user;
    }

    getAll(user) {
        var promise = new Promise((resolve, reject) => {
            let url = '/dashboard/deliverTo/';

            if (user.type === 'brand') {
                url = '/dashboard/deliverToBrand/' + user.companyId;
            }

            if (user.type === 'prAgency') {
                url = '/dashboard/deliverToPRAgency/' + user.companyId;
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
                .then(response => response.json())
                .then(response => {
                    console.log(JSON.stringify(response));
                    if(response.status === 'Not Found'){
                        resolve('Not Found'); 
                    } else if (response.status === 'deleted'){
                        resolve("deleted");
                    }
                })
                .catch(err => {

                    reject(err);
                });
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
        console.log("AddressService.create: updating address addressService: " + address);
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
        console.log("AddressService.createAdHoc: " + newAddress + " for " + this.user.type);
        if (this.user.type === "brand") {
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
        } else {
           var promise = new Promise((resolve, reject) => {
            this.http.fetch('/prAgency/AddAddress', {
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


}
