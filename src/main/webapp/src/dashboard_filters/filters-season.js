import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-season')

export class FiltersSeason {
  seasons = [];
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) season;

  constructor(http){
    this.http = http;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons)
	    ]);
	}


}

