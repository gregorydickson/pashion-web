import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { DS } from 'datastores/ds';

@inject(HttpClient, DialogController, UserService, DS)
export class DialogRequestContact {
    static inject = [DialogController];

    newEmail = '';
    flashMessage = '';
    invite = false;


    constructor(http, controller, userService, DS) {
        this.controller = controller;
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;

        this.userService = userService;
        this.boundHandlerComms = this.handleKeyInput.bind(this);
        this.ds = DS;
        
    }

    attached() {
        document.getElementById("emailInputReq").addEventListener('keydown', this.boundHandlerComms, false);
    }

    activate() {
        this.user = this.ds.user.user;
    }

    close() {
        this.controller.close();
    }

    detached() {
          window.removeEventListener('keypress', this.boundHandlerComms);
    }

    inviteToPashion() {
        this.http.fetch('/dashboard/sendGetAccessEmail', {
                method: 'post',
                body: json({requestingUser: this.user.email, newUser: this.newEmail})
            }
            ).then(response => {
                console.log ("Invite to Pashion status: " + response.status);
                return response.json();
                }).then(info => console.log("Invite to Pashion response: " + info.type)
            ).catch(err => 
                console.error("Invite to Pashion error: " + err));
        this.close();
    }

    requestConnection() {
        console.log("Request connection");
        this.flashMessage = '';
        var parent = this;

        //test to see if valid user
        var result = this.userService.checkValidUser(this.newEmail);
        //returned.then(function(result) {
            //console.log("=> " + result);
            if (result == -1) {
                this.flashMessage = "That email isn't registered";
                this.invite = true;
            }
            if (result == -2) {
                this.flashMessage = "You can't connect with yourself";
                this.invite = false;
            }
            if ((result != -1) && (result != -2)) {
                // test to see if connection already exists
                var dupe = this.userService.checkDuplicateConnection(result);
                    //console.log("check dupe result => " + dupe);
                    if (dupe==-2) { 
                        parent.flashMessage = "There's already a pending connection request";
                        this.invite = false;
                    } else if (dupe==-1) { 
                        this.invite = false;
                        parent.flashMessage = "You're already connected";
                    } else {
                        // call user service to create
                        parent.userService.addContactRequest(result)
                            .then(response => {});
                        parent.close();
                    }
                };
            //});
        }

handleKeyInput(event) {
    //console.log(event);

    if (event.which == 13 && event.srcElement.id === 'emailInputReq') {
      console.log("user hit enter in comms");
      if (!this.invite && this.flashMessage == '') this.requestConnection();
    } else {
        if (this.invite) this.invite = false;
        if (this.flashMessage) this.flashMessage = '';
    }
  }
}
