import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class PressHouseService {

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}

    getPressHouses() {
        var promise = new Promise((resolve, reject) => {
            if (!this.press) {
                console.log("Getting press from JSON");
                this.http.fetch('/pressHouse/index.json')
                    .then(response =>
                        response.json()).then(press => {
                        this.pressHouses = pressHouses;
                        // console.log ("user brands fetched: " + brands);
                        resolve(this.pressHouses);
                    }).catch(err => reject(err));
            } else {
                console.log("getting pressHouses from local");
                resolve(this.press);
            }
        });
        return promise;
    }


    getPressHouseAddresses(pressHouseId) {
        var promise = new Promise((resolve, reject) => 
                this.http.fetch('/pressHouse/addresses/'+pressHouseId)
                                        .then(response => response.json())
                                        .then(addresses => resolve(addresses)).catch(err => reject(err)));
        return promise;
    }
}
