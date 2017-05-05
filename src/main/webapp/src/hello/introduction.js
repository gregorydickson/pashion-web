import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { DS } from 'datastores/ds'

@inject(DialogController, DS)
export class Introduction {

  user = {};

  constructor(controller, DS) {
    this.controller = controller;
    this.ds = DS;
  }

  activate() {
    this.user = this.ds.user.user;
  }


  close() {

    this.controller.close();

  }


}