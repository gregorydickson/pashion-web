import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {BrandService} from 'services/brandService';


@inject(HttpClient, Element, BrandService)
@customElement('filters-designer')

export class FiltersDesignerCustomElement {
  brands = [];
  
  @bindable brando = '';  

  constructor(http,element, brandService){
    this.http = http;
    this.element = element;
    this.brandService = brandService;
  }
  
  setBrand(event){
    this.brando = event.detail.value;
  }
  
  attached(){
    this.brandService.getBrands().then (brands => this.brands = brands);
    /*
    return Promise.all([
      this.http.fetch('/brand/fastList').then(response => response.json()).then(brands => this.brands = brands),
    ]);*/
  }


}

