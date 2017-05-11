import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';
import { CreateDialogConfirmPassword } from './dialogConfirmPassword';
import { DialogService } from 'aurelia-dialog';
import { DS } from 'datastores/ds';

@inject(HttpClient, DialogController, UserService, BrandService,  DialogService, PRAgencyService, PressHouseService, DS)
export class CreateDialogEditContact {
    static inject = [DialogController];

    lUser = {};
    availableLocationItems = [];
    selectedLocationItems = [];
    newPassword = '';

    flashMessage = '';

    constructor(http, controller, userService, brandService, dialogService, prAgencyService, pressHouseService, DS) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.userService = userService;
        this.dialogService = dialogService;
        this.brandService = brandService;
        this.pressHouseService = pressHouseService;
        this.prAgencyService = prAgencyService;
        this.ds = DS;
    }


    activate() {
        //this.lUser = user;
        this.lUser = clone(this.ds.user.user);

        if (!this.lUser.address) {
            this.lUser.address = { id: '' };
        }

        this.getAddresses().then(addresses => {
            console.log(addresses)
            addresses.forEach(item => {
                this.availableLocationItems.push({
                    id: item.id,
                    text: item.name
                });
            });

            this.selectedLocationItems = [`${this.lUser.address.id}`];
        });

    }

    getAddresses() {
        return new Promise((resolve) => {
            if (this.lUser.brand != null)
                return this.brandService.getBrandAddresses(this.lUser.brand.id)
                    .then(addresses => { this.addresses = addresses; resolve(addresses) })
            if (this.lUser.pressHouse != null)
                return this.pressHouseService.getPressHouseAddresses(this.lUser.pressHouse.id)
                    .then(addresses => { this.addresses = addresses; resolve(addresses) })
            if (this.lUser.prAgency != null)
                return this.prAgencyService.getPRAgencyAddresses(this.lUser.PRAgency.id)
                    .then(addresses => { this.addresses = addresses; resolve(addresses) })
        });
    }


    hide_un_hide_password_new() {
        var me = document.getElementById('password-new');
        var meType = me.getAttribute('type');
        if (meType == "password") {
                me.setAttribute('type', 'text');
                document.getElementById('password-word-new').innerHTML="Hide";
            }
        else {
                me.setAttribute('type', 'password');               
                document.getElementById('password-word-new').innerHTML="Show";
            }
      };



    save() {
        console.log("CreateDialogEditContact.save, updating user:" + this.lUser.id + " name: " + this.lUser.name)
        // new password check
        if (this.newPassword!='') {
            //console.log("perform password check");

            this.dialogService.open({
                viewModel: CreateDialogConfirmPassword,
                model: this.lUser,
                lock: true
              })
              .then(response => {
                //console.log("Confirm password return was cancelled: " + response.wasCancelled);
                if (response.wasCancelled) {
                    this.newPassword = '';
                    return false;
                }
          

                // else OK
                //console.log("Update user, with password");
                this.lUser.password = this.newPassword;
                //
                this.userService.update(this.lUser);
                //
                this.controller.close();
              });


        } else {
            // console.log("Update user, no password");
            this.userService.update(this.lUser);
            this.controller.close();
        }
    }

    close() {
        this.controller.close();
    }

    onLocationChangeCallback(event) {
        console.log('onLocationChangeCallback() called:', event.detail.value);

        if (event.detail) {
            let selectedValue = event.detail.value;
            console.log('Selected value:', selectedValue);

            //let selectedLocation = this.availableLocationItems.find(x => x.id == selectedValue);
            this.lUser.address.id = selectedValue;
        }
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
