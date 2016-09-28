import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Looks {
  heading = 'Looks for a Collection';
  looks = [];
  seasons = [];
  brands = [];
  searchText = '';


  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.boundHandler = this.handleKeyInput.bind(this);
  }

  activate() {
    window.addEventListener('keypress', this.boundHandler, false);
    return Promise.all([
      this.http.fetch('/brandCollection/looks/1').then(response => response.json()).then(collection => this.looks = collection.looks),
      this.http.fetch('/brandCollection/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands)

    ]);
  }

  deactivate() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === "search") {
      console.log("herow");
      this.http.fetch('/look/search?searchtext='+ encodeURI(event.srcElement.value))
          .then(response => response.json())
          .then(looks => {
              this.looks = looks        
          })

    }
  }
    
}
