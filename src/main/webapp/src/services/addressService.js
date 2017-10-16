import { inject, singleton } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import {UserService} from './userService';
import 'fetch';

@inject(HttpClient,UserService)
@singleton()
export class AddressService {

    constructor(http,userService) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;

    }


    getAll() {
        let url = '/dashboard/deliverTo/';
        
        var promise = new Promise((resolve, reject) => {
            this.userService.getUser().then(user =>{
                if (user.type === 'brand') {
                    url = '/dashboard/deliverToBrand/' + user.companyId;
                } else if (user.type === 'prAgency') {
                    url = '/dashboard/deliverToPRAgency/' + user.companyId;
                }
                console.log("get addresses url:"+url);
                this.http.fetch(url)
                    .then(response => response.json())
                    .then(deliverTo => {
                        resolve(deliverTo);
                    })
                    .catch(err => reject(err));
            });

            
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
        console.log(address); 
        
        let addressId = '';
        if(address.originalId)
            addressId = address.originalId;
        else
            addressId = address.id;

        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/address/updatejson/' + addressId + ".json", {
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
        
        console.log("AddressService.createAdHoc: " + newAddress);
        let userService = this.userService;

        var promise = new Promise((resolve, reject) => {
            userService.getUser().then(user => {
                let url = '';
                if (user.type === "brand") {
                    url = '/brand/AddAddress';
                } else {
                    url = '/PRAgency/AddAddress';
                }

                this.http.fetch(url, {
                    method: 'post',
                    body: json(newAddress)
                })
                .then(response => response.json())
                .then(address => {
                    this.getAll().then(addresses => resolve(addresses));
                    
                });
            });


        });

            
        
        return promise; 
    }


}
