import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import { CityService } from 'services/cityService';

@inject(DialogController, CityService,UserService)
export class CreateDialogNewUser {
  static inject = [DialogController];

  newUser = {};
  addresses = [];
  cities = [];

  constructor(controller, cityService,userService){
    this.controller = controller;
    this.cityService = cityService;
    this.userService = userService;
  }

  attached(){
  	$("#userCheck").toggle();
    this.newUser.isInPashionNetwork = true;
  }
  activate(cities) {
    console.log("cities:");
    console.log(JSON.stringify(cities));
    this.cities = cities;
   
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
  	console.log("new user:"+this.newUser);
  	this.userService.createUser(this.newUser)
  		.then(response =>{
  			if(response.ok){
  				console.log("response ok, user created");
  				this.controller.close();
  			} else{
  				alert("error");
  			}
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


