import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
@customElement('filters-color')

export class filtersColor {
	
	colors = [];

	selectedColor = '';

	
	activate() {
	    
	    return Promise.all([
	      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
	    ]);
	  }  

}

