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
        var result = this.userService.checkValidUser(this.newEmail);
        //returned.then(function(result) {
            //console.log("=> " + result);
            if (result == -1) {
                this.flashMessage = "That email isn't registered";
            }
            if (result == -2) {
                this.flashMessage = "You can't connect with yourself";
            }
            if ((result != -1) && (result != -2)) {
                // test to see if connection already exists
                var dupe = this.userService.checkDuplicateConnection(result);
                    //console.log("check dupe result => " + dupe);
                    if (dupe==-2) { parent.flashMessage = "There's already a pending connection request";
                    } else if (dupe==-1) { parent.flashMessage = "You're already connected";
                    } else {
                        // call user service to create
                        parent.userService.addContactRequest(result)
                            .then(response => {});
                        parent.close();
                    }
                };
            //});
        }


    }
