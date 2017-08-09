import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Looks {
  heading = 'Looks for a Collection';
  looks = [];
  seasons = [];
  brands = [];
  searchtext = '';


  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate() {
    return Promise.all([
      this.http.fetch('/brandCollection/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands)
    ]);
  }

  submit() {
    //send search params
  }
}
