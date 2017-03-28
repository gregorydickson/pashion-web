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

    lUser = {};

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
                //this.lUser = user;

                
                this.lUser = clone(user);

                        if (this.lUser.brand != null)
                            this.brandService.getBrandAddresses(this.lUser.brand.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.lUser.pressHouse != null)
                            this.pressHouseService.getPressHouseAddresses(this.lUser.pressHouse.id)
                                .then(addresses=>this.addresses = addresses)
                        if (this.lUser.prAgency != null)
                            this.prAgencyService.getPRAgencyAddresses(this.lUser.PRAgency.id)
                                .then(addresses=>this.addresses = addresses)

                      })
        }

   save(){
    console.log("CreateDialogEditContact.save, updating user:"+this.lUser.id + " name: " + this.lUser.name)
    this.userService.update(this.lUser);
    this.controller.close();
   }

  close() {
    this.controller.close();
  }



}


function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
