import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class DialogRequestContact {
    static inject = [DialogController];

    newEmail = '';
    flashMessage = '';


    constructor(http, controller, userService) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;

        this.userService = userService;
    }

    close() {
        this.controller.close();
    }

    requestConnection() {
        this.flashMessage = '';
        var parent = this;

        //test to see if valid user
        var returned = this.userService.checkValidUser(this.newEmail);
        returned.then(function(result) {
                console.log("=> " + result);
                if (result == -1) {
                    parent.flashMessage = "Not a valid user";
                }
                if (result == -2) {
                    parent.flashMessage = "Can't connect with yourself";
                }
                if ((result != -1) && (result != -2)) {
                    // test to see if connection already exists
                    var r2 = parent.userService.checkDuplicateConnection(result);
                   // r2.then(function(result) {
                        console.log("check dupe result => " + r2);
                        if (r2) {
                            parent.flashMessage = "You are already connected";
                        }
                        if (!r2) {
                            // call user service to create
                            parent.userService.addContactRequest(result);
                            parent.close();
                            $("#panel11").animate({ scrollTop: $("#panel11").prop("scrollHeight") }, 50);
                            $("#panel12").animate({ scrollTop: $("#panel12").prop("scrollHeight") }, 50);

                        }
                    };
            });
        }


    }
