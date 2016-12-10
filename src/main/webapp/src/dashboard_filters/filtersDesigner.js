import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DOM} from 'aurelia-pal';
import 'fetch';


@inject(HttpClient, Element)
@customElement('filters-designer')

export class FiltersDesignerCustomElement {
  brands = [];
  
  @bindable brando = '';  

  constructor(http,element){
    this.http = http;
    this.element = element;
  }
  
  

  setBrand(event){
    this.brando = event.detail.value;
    console.log("set brand in Custom Element"+event.detail.value);
  }
  
  attached(){
    console.log("Designer Attached");
    return Promise.all([
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),

    ]);
  }


}

