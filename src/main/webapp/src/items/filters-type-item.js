import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient, Element)
@customElement('filters-type-item')

export class FiltersTypeItemCustomElement {
  sampleTypes = [];
  
 // @bindable({ defaultBindingMode: bindingMode.twoWay }) type;
  //@bindable typeo = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }
  
  setType(event){
   // this.typeo = event.detail.value;
}

  attached() {
      return Promise.all([
        
    this.http.fetch('/dashboard/sampleTypes').then(response => response.json()).then(sampleTypes => this.sampleTypes = sampleTypes)
      ]);
  }


}

