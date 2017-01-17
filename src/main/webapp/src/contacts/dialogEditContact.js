import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';

@inject(HttpClient, DialogController, UserService, BrandService)
export class CreateDialogEditContact {
    static inject = [DialogController];

    user = {};
    userId = -1;
    brands = {};
    brand = {};

    constructor(http, controller, userService, brandService) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
        this.brandService = brandService;

    }

    activate() {
        this.brandService.getBrands().then(brands => this.brands = brands)
            .then(
                this.userService.getUser()
                .then(user => {
                    this.user = user;
                    this.userId = user.id;
                    this.userService.getUserDetails(this.userId)
                        .then(currentContact => {
                            this.user = currentContact;
                            if (this.user.brand) {
                                this.brandService.getBrandFromId(this.user.brand.id).then(brand => this.brand = brand);
                                //console.log("brandFromId returned: " + this.brand.name);
                            }
                        })
                }));
    }

    close() {
        this.controller.close();
    }



}
