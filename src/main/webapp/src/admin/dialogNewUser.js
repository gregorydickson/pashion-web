import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import { CityService } from 'services/cityService';
import { busy } from 'services/busy';

@inject(DialogController, CityService,UserService, busy)
export class CreateDialogNewUser {
  static inject = [DialogController];

  newUser = {};
  addresses = [];
  cities = [];

  //testing
  testSelected = [];
  testOptions = [];
  //end testing

  constructor(controller, cityService,userService,busy){
    this.controller = controller;
    this.cityService = cityService;
    this.userService = userService;
    this.busy = busy;
  }

  attached(){
  	$("#userCheck").toggle();
    this.newUser.isInPashionNetwork = true;
  }
  activate(cities) {
    console.log("cities:");
    console.log(JSON.stringify(cities));
    this.cities = cities;
    this.testSelected = ["2"];
   
  }

  close(){
    this.controller.close();
  }

  emailCheck(){
  	console.log("checking email");
  	let response = this.userService.checkValidUser(this.newUser.email);
  	console.log("response:"+response);
  	if(response == -1)
  		$("#userCheck").show();
  }
  
  create(){
    // no city , added a defaultin server side
    // should be a choice of which Office.
    document.getElementById("newUser").disabled = true;
    this.busy.on();
  	console.log("new user:"+this.newUser);
  	this.userService.createUser(this.newUser)
  		.then(response =>{
  			if(response.ok){
  				console.log("response ok, user created");
  				this.controller.ok();
  			} else{
  				alert("error");
  			}
        document.getElementById("newUser").disabled = false;
        this.busy.off();
  		});
  }
  togglePassword() {
    var me = document.getElementById('password');
    var meType = me.getAttribute('type');
    if (meType == "password") {
            me.setAttribute('type', 'text');
            document.getElementById('password-word').innerHTML="Hide";
    }
    else {
            me.setAttribute('type', 'password');               
            document.getElementById('password-word').innerHTML="Show";
    }
  }
  



}


