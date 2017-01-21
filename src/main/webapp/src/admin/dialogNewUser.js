import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';

@inject(DialogController, UserService, BrandService ,PRAgencyService,PressHouseService)
export class CreateDialogNewUser {
  static inject = [DialogController];

  newUser = {};
  addresses = [];

  constructor(controller, userService, brandService, prAgencyService, pressHouseService){
    this.controller = controller;
    this.userService = userService;
    this.brandService = brandService;
    this.pressHouseService = pressHouseService;
    this.prAgencyService = prAgencyService;
  }

  attached(){
  	$("#userCheck").toggle();
  }
    activate() {
    	
        this.userService.getUser()
            .then(user => {
                this.userService.getUserDetails(user.id)
                    .then(currentContact => {
                        this.user = currentContact;
                        if (this.user.brand.id != null)
                            this.brandService.getBrandAddresses(this.user.brand.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.user.pressHouse.id != null)
                            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.user.prAgency.id != null)
                            this.prAgencyService.getPRAgencyAddresses(this.user.PRAgency.id)
                                .then(addresses=>this.addresses = addresses)

                     })
            })
        this.newUser.isInPashionNetwork = true;
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


