import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-city')

export class FiltersCity {
  cities = [];
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) city;

  constructor(http){
    this.http = http;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)
	    ]);
	}


}

