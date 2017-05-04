import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import { Router } from 'aurelia-router';
import { DS } from './datastores/ds';
import { CreateDialogEditContact } from './contacts/dialogEditContact';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogUpdatePhoto } from './contacts/dialogUpdatePhoto';

@inject(HttpClient, DS, Router, DialogService)
export class Header {
    //user = {};
    currentRoute = '';

    navOptions = [{ value: "index", name: "DASHBOARD" }, { value: "adminpage", name: "ADMIN" }];

    constructor(http, DS, router, dialogService) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.ds = DS;
        this.theRouter = router;
        this.dialogService = dialogService;
    }

    activate() {
        this.user = this.ds.user.user;
        this.userActionsPlaceholder = this.ds.user.user.name;
    }

    attached() {
        this.wireMenus();
    }

    wireMenus() {
        // The DOM is already initialized because this is being called from
        // the attach() method, but, we need an instance of the document
        // so let's just use the jquery DOM ready wrapper     
        jQuery(document).ready(function (e) {
            function t(t) {
                e(t).bind('click', function (t) {
                    t.preventDefault();
                    e(this).parent().fadeOut();
                })
            }

            e('.dropdown-toggle').click(function () {
                let t = e(this).parents('.button-dropdown').children('.dropdown-menu').is(':hidden');
                e('.button-dropdown .dropdown-menu').hide();
                e('.button-dropdown .dropdown-toggle').removeClass('active');

                if (t) {
                    e(this).parents('.button-dropdown')
                        .children('.dropdown-menu')
                        .toggle()
                        .parents('.button-dropdown')
                        .children('.dropdown-toggle')
                        .addClass('active');
                }
            });

            e(document).find('.dropdown-menu a').click(function (event) {
                e('.button-dropdown .dropdown-menu').hide();
                e('.button-dropdown .dropdown-toggle').removeClass('active');
            });

            e(document).bind('click', function (t) {
                let n = e(t.target);

                if (!n.parents().hasClass('button-dropdown')) {
                    e('.button-dropdown .dropdown-menu').hide();
                }
            });

            e(document).bind('click', function (t) {
                let n = e(t.target);

                if (!n.parents().hasClass('button-dropdown')) {
                    e('.button-dropdown .dropdown-toggle').removeClass('active');
                }
            });
        });
    }

    filterMode(event) {
        console.log("Filter Mode");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';
                    console.log("value:" + event.detail.value)
                }
        //console.log("Filter change called, Theme: " + this.selectedTheme);
    }

    userActions(selected) {
        if (selected) {
            this.selectval1 = selected;
        }
        //console.log("header action: " + this.selectval);
        if (this.selectval1 == "logout") window.location.href = '/user/logout';
        if (this.selectval1 == "edit") {
            this.selectval1 = ""; // changes selectval back to name, not sure why As should be 2 way binding
            // Remove the edit profile option while they're on it        
            this.availableUserItems = [];
            this.dialogService.open({ viewModel: CreateDialogEditContact, model: 0 })
                .then(response => {
                    this.user = this.ds.user.user;
                    // Add back in the available options
                    this.availableUserItems = [
                        { id: 'logout', text: 'LOGOUT' },
                        { id: 'edit', text: 'EDIT PROFILE' },
                    ];

                });
        };

    }

    admin(route) {
        this.theRouter.navigateToRoute(route);

        if (this.currentRoute == "adminpage") {
            console.log("admin, getUser()");
            this.user = this.ds.user.user;
        }
    }

    /* NOTE: Leaving previous admin() method in the event some of 
             this extra logic is needed for some reason. 
    admin(){   
        this.currentRoute = this.theRouter.currentInstruction.config.name;
        console.log("admin, currentRoute: " + this.currentRoute);
        if (this.currentRoute == 'index') { this.theRouter.navigate("adminpage"); }
        if (this.currentRoute == 'requestman') { this.theRouter.navigate("adminpage"); }
        if (this.currentRoute == 'adminpage') { this.theRouter.navigate("/"); }
  
        if (this.currentRoute == "adminpage") {
          this.userService.getUser().then(user => this.user = user);
          console.log("admin, getUser()");
        }
    }
    */

    // Create dialog update photo
    CreateDialogUpdatePhoto(id) {
        var menu = document.getElementById(id);
        menu.classList.toggle("look-menu-show");
        this.dialogService.open({ viewModel: CreateDialogUpdatePhoto, model: 0 })
            .then(response => {
                if (!response.wasCancelled && response == 'delete') {
                    console.log("avatar deleted")
                }
            });
    }

    // Create dialog update photo
    updatePhoto() {
        this.dialogService.open({ viewModel: CreateDialogUpdatePhoto, model: 0 })
            .then(response => { });
    }
}