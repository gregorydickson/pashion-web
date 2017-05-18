import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {PRAgencyService} from 'services/PRAgencyService';
import {Index} from 'index';


@inject(HttpClient, Element, PRAgencyService, Index)
@customElement('filters-designer-pr')

export class FiltersDesignerPrCustomElement {
  brands = [];
  
  @bindable brando = '';  

  constructor(http,element, prAgencyService, index){
    this.http = http;
    this.element = element;
    //this.brandService = brandService;
    this.index = index;
    this.prAgencyService = prAgencyService;
  }
  
  setBrand(event){
    this.brando = event.detail.value;
  }
  
  attached(){
    this.prAgencyService.getBrands().then (brands => this.brands = brands);
    this.brando = this.prAgencyService.getDefault();
    console.log("BRANDO:"+this.brando);
    /*
    return Promise.all([
      this.http.fetch('/brand/fastList').then(response => response.json()).then(brands => this.brands = brands),
    ]);*/

  }


}
