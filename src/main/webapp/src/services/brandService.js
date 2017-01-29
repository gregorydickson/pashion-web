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
