import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import {UserService} from 'services/userService';
import 'fetch';

@inject(HttpClient, UserService)
@singleton()
export class PRAgencyService {

    constructor(http, userService) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
    }

    activate() {}

    getPRAgency(id) {
        var promise = new Promise((resolve, reject) => {
            if (!this.agency) {
                console.log("Getting the pr agency from server");
                this.http.fetch('/agency/show/'+id)
                    .then(response =>
                        response.json()).then(agency => {
                        this.agency = agency;
                        resolve(this.agency);
                    }).catch(err => reject(err));
            } else {
                console.log("getting the pr agency from local");
                resolve(this.agency);
            }
        });
        return promise;
    }




    getPRAgencies() {
        var promise = new Promise((resolve, reject) => {
            if (!this.PRAgencies) {
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


    onlyShowMySampleRequests(id) {
        var promise = new Promise((resolve, reject) => {
                console.log("toggle onlyShowMySampleRequests");
                this.http.fetch('/PRAgency/toggleOnlyShowMySampleRequests/'+id+'.json')
                    .then(response =>
                        response.json()).then(brand => {
                        resolve(brand);
                    }).catch(err => reject(err));
            
        });
        return promise;
    }

    getOnlyShowMySampleRequests(id){
        var promise = new Promise((resolve, reject) => {
                this.http.fetch('/PRAgency/getOnlyShowMySampleRequests/'+id+'.json')
                    .then(response =>
                        response.json()).then(hd => {
                        resolve(hd);
                    }).catch(err => reject(err));
            
        });
        return promise;

    }

    restrictOutsideBooking(id) {
        var promise = new Promise((resolve, reject) => {
                console.log("toggle restrictOutsideBooking");
                this.http.fetch('/PRAgency/toggleRestrictOutsideBooking/'+id+'.json')
                    .then(response =>
                        response.json()).then(brand => {
                        resolve(brand);
                    }).catch(err => reject(err));
            
        });
        return promise;
    }

    // always returns false as switch disabled an set to false.
    getRestrictOutsideBooking(id){
       /* var promise = new Promise((resolve, reject) => {
                this.http.fetch('/PRAgency/getRestrictOutsideBooking/'+id+'.json')
                    .then(response =>
                        response.json()).then(hd => {
                        resolve(hd);
                    }).catch(err => reject(err));
            
        });
        return promise; */
        var promise = Promise.resolve(false);
        return promise
    }



    // change to be the first brand in the list
    getDefault(){
        //var promise = new Promise((resolve, reject) => {
          //  resolve (this.defaultBrand);
       // });
      //  return promise;
      return this.defaultBrand;
    }

    // Change to be specific list of brands supported by the Agency
    getBrands(agencyId) {
        var promise = new Promise((resolve, reject) => {
            if (!this.brands) {

                var PRAgencyId;
                this.userService.getUser().then(user => {
                    //console.log("Getting user brand: " + user);
                    if(agencyId){
                        PRAgencyId = agencyId;
                    } else{
                        PRAgencyId = user.companyId;
                    }

                }).then(result => {
                    //console.log("Getting PR brands pragencycontroll.groovy + id:" + PRAgencyId);
                    this.http.fetch('/PRAgency/brands/' + PRAgencyId)
                        .then(response =>
                            response.json()).then(brands => {
                            this.brands = brands;
                            this.defaultBrand = brands[0];
                            //console.log("PR brands fetched: " + brands);
                            console.log("PR default brand fetched: " + this.defaultBrand.id);
                            resolve(this.brands);
                        }).catch(err => reject(err));
                })
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
