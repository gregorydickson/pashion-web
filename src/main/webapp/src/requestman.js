import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {UserService} from './services/userService';
import {SampleRequestService} from './services/sampleRequestService';
import {bindable} from 'aurelia-framework';

@inject(HttpClient, UserService,SampleRequestService)
export class Requestman{
	  
  bookings = [];
  searchTest = "";
  status = [];
  selectedStatus = "";
  user = {};

  constructor(http,userService,sampleRequestService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    
    this.http = http;
    this.userService = userService;
    this.sampleRequestService = sampleRequestService;

  }

	activate() {
      this.user = this.userService.getUser().then(user => this.user = user);
      return this.bookings = this.sampleRequestService.getSampleRequests()
        .then(bookings => {
          this.bookings = bookings;
          console.log("bookings:");
          console.log(bookings.length);
        });
  }


	filterChange(event){
	    console.log("changing");
	}

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }
    

}