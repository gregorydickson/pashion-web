import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class BrandService {

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}
    getDefault(){
        var promise = new Promise((resolve, reject) => {
            var brand = {name:'Miu Miu',id:45}
            resolve( brand);
        });
        return promise;
    }

    getBrands() {
        var promise = new Promise((resolve, reject) => {
            if (!this.brands) {
                console.log("Getting brands from JSON");
                this.http.fetch('/brand/fastList')
                    .then(response =>
                        response.json()).then(brands => {
                        this.brands = brands;
                        // console.log ("user brands fetched: " + brands);
                        resolve(this.brands);
                    }).catch(err => reject(err));
            } else {
                console.log("getting brands from local");
                resolve(this.brands);
            }
        });
        return promise;
    }

    getHideCalendar(id){
        var promise = new Promise((resolve, reject) => {

                //console.log("get hideCalendar");
                this.http.fetch('/brand/getCalendar/'+id+'.json')
                    .then(response =>
                        response.json()).then(hd => {
                        resolve(hd);
                    }).catch(err => reject(err));
            
        });
        return promise;

    }

    hideCalendar(id) {
        var promise = new Promise((resolve, reject) => {

                console.log("toggle hideCalendar");
                this.http.fetch('/brand/toggleCalendar/'+id+'.json')
                    .then(response =>
                        response.json()).then(brand => {
                        resolve(brand);
                    }).catch(err => reject(err));
            
        });
        return promise;
    }

    onlyShowMySampleRequests(id) {
        var promise = new Promise((resolve, reject) => {
                console.log("toggle onlyShowMySampleRequests");
                this.http.fetch('/brand/toggleOnlyShowMySampleRequests/'+id+'.json')
                    .then(response =>
                        response.json()).then(brand => {
                        resolve(brand);
                    }).catch(err => reject(err));
            
        });
        return promise;
    }

    getOnlyShowMySampleRequests(id){
        var promise = new Promise((resolve, reject) => {
                this.http.fetch('/brand/getOnlyShowMySampleRequests/'+id+'.json')
                    .then(response =>
                        response.json()).then(hd => {
                        resolve(hd);
                    }).catch(err => reject(err));
            
        });
        return promise;

    }

    // Currently disabled
    restrictOutsideBooking(id) {
        var promise = new Promise((resolve, reject) => {
                console.log("toggle restrictOutsideBooking");
                this.http.fetch('/brand/toggleRestrictOutsideBooking/'+id+'.json')
                    .then(response =>
                        response.json()).then(brand => {
                        resolve(brand);
                    }).catch(err => reject(err));
            
        });
        return promise;
    }

    // always returns false as switch disabled an set to false.
    getRestrictOutsideBooking(id){
        console.log("brandService.getRestrictOutsideBooking allows false as currently not implemented");
        /*
        var promise = new Promise((resolve, reject) => {
                this.http.fetch('/brand/getRestrictOutsideBooking/'+id+'.json')
                    .then(response =>
                        response.json()).then(hd => {
                        resolve(hd);
                    }).catch(err => reject(err));
            
        });
        return promise;
        */
        var promise = Promise.resolve(false);
        return promise

    }


    getBrand(brandId) {
        var promise = new Promise((resolve, reject) => 
                this.http.fetch('/brand/show/'+brandId+ '.json')
                                        .then(response => response.json())
                                        .then(brand => resolve(brand)).catch(err => reject(err)));
        return promise;
    }

    getBrandAddresses(brandId) {
        var promise = new Promise((resolve, reject) => {
                this.http.fetch('/brand/addresses/'+brandId)
                                        .then(response => response.json())
                                        .then(ad => resolve(ad))
                                        .catch(err => reject(err));
                                    });
        return promise;
    }
}
