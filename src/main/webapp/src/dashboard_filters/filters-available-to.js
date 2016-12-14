import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-available-to')

export class filtersAvailableTo {
  availableTo = '';
  
  filterChange(event){
    console.log(this.availableTo);
    
    this.http.fetch('&availableTo=' + this.availableTo)
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
  }


  constructor(http, eventAggregator) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.ea = eventAggregator;
    this.http = http;
    

  }


  attached(){
    this.subscriber = this.ea.subscribe('datepicker', response => {
            if(response.elementId === 'datepickerto')
              this.availableTo = response.elementValue;
            if(response.elementId === 'datepickerfrom') 
              this.availableFrom = response.elementValue;
            this.filterChange();
            
    });
  }



}

