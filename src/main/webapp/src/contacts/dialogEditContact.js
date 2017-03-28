import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';

@inject(HttpClient, DialogController, UserService, BrandService ,PRAgencyService,PressHouseService)
export class CreateDialogEditContact {
    static inject = [DialogController];

    constructor(http, controller, userService, brandService, prAgencyService, pressHouseService) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
        this.brandService = brandService;
        this.pressHouseService = pressHouseService;
        this.prAgencyService = prAgencyService;

    }


    activate() {
        this.userService.getUser()
            .then(user => {
                this.userService.getUserDetails(user.id)
                    .then(currentContact => {
                        this.user = currentContact;
                        if (this.user.brand != null)
                            this.brandService.getBrandAddresses(this.user.brand.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.user.pressHouse != null)
                            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.user.prAgency != null)
                            this.prAgencyService.getPRAgencyAddresses(this.user.PRAgency.id)
                                .then(addresses=>this.addresses = addresses)

                      })
                })
        }

   save(){
    console.log("CreateDialogEditContact.save, updating user:"+this.user.id + " name: " + this.user.name)
    this.userService.update(this.user);
    this.controller.close();
   }

  close() {
    this.controller.close();
  }



}
