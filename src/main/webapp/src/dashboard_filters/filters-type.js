import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-type')

export class FiltersType {
  itemTypes = [];
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) type;

  constructor(http){
    this.http = http;
  }
  

  attached() {
      return Promise.all([
        this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes)
      ]);
  }


}

