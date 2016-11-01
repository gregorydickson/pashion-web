import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {UserService} from './services/userService';

@inject(HttpClient, UserService)
export class Requestman{
	  
  bookings = {};
  searchTest = "";
  status = [];
  selectedStatus = "";
  user = {};

  constructor(http,userService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    
    this.http = http;
    this.userService = userService;
  }

	activate() {

      this.http.fetch('/sampleRequest/filterSearch')
      	.then(response => response.json())
      	.then(bookings => this.bookings = bookings);

      this.user = this.userService.getUser().then(user => this.user = user);

  	}


	filterChange(event){
	    console.log("changing");

	    this.http.fetch('/sampleRequest/filterSearch?searchtext='+ encodeURI(this.searchText) + 
	                                      '&status=' + this.selectedStatus)
	          .then(response => response.json())
	          .then(rows => {this.bookings = bookings});
	}

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }
    

}