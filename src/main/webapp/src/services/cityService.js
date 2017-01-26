import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class CityService {

    // THis version implements two records ("connectins") for each user to user connection,
    // one each with a user set to each participant, with the other user set in connectedIUserd

    
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
            if (!this.cities) { // local storage if already loaded
                console.log("getUsers() getting users from JSON");
                this.http.fetch('/dashboard/citiesObjects')
                    .then(response => response.json())
                    .then(cities => {
                        this.cities = cities;
                        // need to zero saved message count as about to re create it from pubnub
                        // do it in getAllMessages in messages
                        resolve(this.users);
                    }).catch(err => reject(err));
            } else {
                console.log("getCities() getting cities locally");
                resolve(this.cities);
            }
        });
        return promise;

    }

    


}
