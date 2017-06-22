import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class OutReasonService {

    outReasons = [];
    
    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}


    getOutReasons() {
        
        var promise = new Promise((resolve, reject) => {
            if (this.outReasons.length == 0) { // local storage if already loaded
                this.http.fetch('/dashboard/outReasonObjects')
                    .then(response => response.json())
                    .then(outReasons => {
                        this.outReasons = outReasons;
                        
                        resolve(outReasons);
                    }).catch(err => reject(err));
            } else {
                resolve(this.outReasons);
            }
        });
        return promise;

    }

    


}