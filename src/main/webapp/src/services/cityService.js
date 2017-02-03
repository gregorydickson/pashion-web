import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class CityService {

    // THis version implements two records ("connectins") for each user to user connection,
    // one each with a user set to each participant, with the other user set in connectedIUserd
    cities = [];
    
    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}


    getCities() {
        
        var promise = new Promise((resolve, reject) => {
            if (this.cities.length == 0) { // local storage if already loaded
                this.http.fetch('/dashboard/citiesObjects')
                    .then(response => response.json())
                    .then(cities => {
                        this.cities = cities;
                        
                        resolve(cities);
                    }).catch(err => reject(err));
            } else {
                resolve(this.cities);
            }
        });
        return promise;

    }

    


}
