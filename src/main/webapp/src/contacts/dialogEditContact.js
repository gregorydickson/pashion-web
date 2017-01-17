import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
//import { PrAgencyService } from 'services/PrAgencyService';

@inject(HttpClient, DialogController, UserService, BrandService 
  //,PrAgencyService
  ,PressHouseService
  )
export class CreateDialogEditContact {
    static inject = [DialogController];

    constructor(http, controller, userService, brandService  
      //,prAgencyService
      ,pressHouseService
      ) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
        this.brandService = brandService;
        this.pressHouseService = pressHouseService;
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
                    if (this.user.brand.id != null)
                        this.brandService.getBrandAddresses(this.user.brand.id)
                            .then(addresses=>this.addresses = addresses)
                    if (this.user.pressHouse.id != null)
                        this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                            .then(addresses=>this.addresses = addresses)

                  })
            })
        }


 close() {
        this.controller.close();
    }



}
