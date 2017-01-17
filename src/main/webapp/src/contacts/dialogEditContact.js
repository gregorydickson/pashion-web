import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';
//import { PressService } from 'services/pressService';
//import { PrAgencyService } from 'services/PrAgencyService';

@inject(HttpClient, DialogController, UserService, BrandService 
  //,PrAgencyService
  //,PressService
  )
export class CreateDialogEditContact {
    static inject = [DialogController];

    constructor(http, controller, userService, brandService  
      //,prAgencyService
      //,pressService
      ) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
        this.brandService = brandService;
        //this.pressService = pressService;
        //this.prAgencyService = prAgencyService;

    }


    activate() {
      this.userService.getUser()
        .then(user => {
            this.user = user;
            this.userId = user.id;
            this.userService.getUserDetails(this.userId)
                .then(currentContact => {
                    this.user = currentContact;
                    if (this.user.brand) {
                        this.brandService.getBrandFromId(this.user.brand.id)
                        .then(brand => {
                              this.brand = brand;
                              this.http.fetch('/brand/addresses/'+this.brand.id)
                                .then(response => response.json())
                                .then(addresses => this.addresses = addresses);})
                    }
                   /* if (this.user.press) {
                        this.pressService.getPressFromId(this.user.press.id).then(press => this.press = press);
                    } */
                   /* if (this.user.prAgency) {
                        this.prAgencyService.getPrAgencyFromId(this.user.prAgency.id).then(prAgency => this.prAgency = prAgency);
                    }*/
                })
        });

        

        
    }


    close() {
        this.controller.close();
    }



}
