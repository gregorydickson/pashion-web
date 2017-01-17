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


    getBrandAddresses(brandId) {
        var promise = new Promise((resolve, reject) => 
                this.http.fetch('/brand/addresses/'+brandId)
                                        .then(response => response.json())
                                        .then(addresses => resolve(addresses)).catch(err => reject(err)));
        return promise;
    }
/*
    getBrandFromId (id) {
        var promise = new Promise ((resolve, reject) => {
        this.getBrands().then(brands => {
            var i;
            for (i=0;i<brands.length;i++){
                if (brands[i].id == id) {
                    console.log("getBrandsFromId: " + id + " is: "+ brands[i].name);
                    resolve(brands[i]);
                }
            }
            resolve(null);});})
            return promise;
    }
    */
}
