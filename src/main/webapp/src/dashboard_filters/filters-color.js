import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-color')

export class Filterscolor {
  colors = [];
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) color;

  constructor(http){
    this.http = http;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors)
	    ]);
	}


}

