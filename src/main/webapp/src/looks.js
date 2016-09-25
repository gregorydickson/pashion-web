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
      this.http.fetch('/collection/looks/1').then(response => response.json()).then(collection => this.looks = collection.looks),
      this.http.fetch('/collection/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands)

    ]);
  }

  search(event) {
    var asearch = this.searchtext;
    console.log("searching");
    if(event.which == 13) {
      return this.http.fetch('/collection/search?'+ encodeURI(asearch))
          .then(response => response.json())
          .then(collection => {
              this.looks = collection.looks
              
          })
    }
      event.preventDefault();
    }
}
