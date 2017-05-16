import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class PRAgencyService {

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}

    getPRAgencies() {
        var promise = new Promise((resolve, reject) => {
            if (!this.press) {
                console.log("Getting PRAgencies from JSON");
                this.http.fetch('/PRAgency/index.json')
                    .then(response =>
                        response.json()).then(PRAgencies => {
                        this.PRAgencies = PRAgencies;
                        resolve(this.PRAgencies);
                    }).catch(err => reject(err));
            } else {
                console.log("getting PRAgencies from local");
                resolve(this.PRAgencies);
            }
        });
        return promise;
    }

    // change to be the first brand in the list
    getDefault(){
        var promise = new Promise((resolve, reject) => {
            var brand = {name:'Miu Miu',id:45}
            resolve( brand);
        });
        return promise;
    }

    // Change to be specific list of brands supported by the Agency
    getBrands() {
        var promise = new Promise((resolve, reject) => {
            if (!this.brands) {
                console.log("Getting PR brands from JSON");
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

    getPRAgencyAddresses(PRAgencyId) {
        var promise = new Promise((resolve, reject) => 
                this.http.fetch('/PRAgency/addresses/'+PRAgencyId)
                                        .then(response => response.json())
                                        .then(addresses => resolve(addresses)).catch(err => reject(err)));
        return promise;
    }
}
