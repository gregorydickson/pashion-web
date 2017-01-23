import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class AddressService{

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    delete(id){

        var promise = new Promise((resolve, reject) => {
            
            this.http.fetch('/address/archive/'+id)
                .then(response => {
                    if(response.ok) {
                        resolve(response);
                    } else {
                        console.log('Network response was not ok.');
                        reject("Not Deleted");
                    }
            })
            .catch(err => reject(err));
        });
        return promise;

    }


}
