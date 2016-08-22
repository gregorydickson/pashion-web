import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Looks {
  heading = 'Looks for a Collection';
  looks = [];

  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });

    this.http = http;
  }

  activate() {
    return this.http.fetch('/collection/looks/1')
      .then(response => response.json())
      .then(collection => this.looks = collection.looks);
  }
}
