import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import {BrandService} from 'services/brandService';

@inject(HttpClient, DialogController, UserService, BrandService)
export class CreateDialogEditContact {
  static inject = [DialogController];

  user = {};
  userId = -1;
  brands = {};

  constructor(http, controller, userService, brandService){
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

    this.brandService.getBrands().then (brands => this.brands = brands);
    this.userService.getUser().then(user => {
              this.userId = user.id;
              this.userService.getUserDetails(this.userId)
                .then(currentContact => this.user = currentContact);});
  }

  close(){
    this.controller.close();
  }
  


  }
