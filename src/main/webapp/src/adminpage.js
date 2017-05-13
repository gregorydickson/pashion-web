import { inject, observable } from 'aurelia-framework';
import { UserService } from './services/userService';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogNewUser } from './admin/dialogNewUser';
import { CreateDialogImportUsers } from './admin/dialogImportUsers';
import { CreateDialogNewOffice } from './admin/dialogNewOffice';
import { BrandService } from 'services/brandService';
import { PressHouseService } from 'services/pressHouseService';
import { PRAgencyService } from 'services/PRAgencyService';
import { CreateDialogConfirmDelete } from './admin/dialogConfirmDelete';
import { AddressService } from 'services/addressService';
import { CityService } from 'services/cityService';
import { DS } from 'datastores/ds';

@inject(DialogService, UserService, BrandService, PRAgencyService, PressHouseService, AddressService, CityService, DS)
export class Adminpage {

    currentUser = {};
    users = [];
    addresses = [];
    currentAddress = {};
    @observable currentPassword = '';
    validPassword = false;

    @observable currentAddressId = '';
    company = {};
    cities = [];

    constructor(dialogService, userService, brandService, prAgencyService, pressHouseService, addressService, cityService, DS) {
        this.dialogService = dialogService;
        this.userService = userService;
        this.brandService = brandService;
        this.pressHouseService = pressHouseService;
        this.prAgencyService = prAgencyService;
        this.addressService = addressService;
        this.cityService = cityService;
        this.ds = DS;
    }

    currentAddressIdChanged(newValue, oldValue) {
        if (newValue && oldValue) {
            if (!this.currentUser.address)
                this.currentUser.address = {};

            this.currentUser.address.id = newValue;
            this.updateUser();
        }
    }

    currentPasswordChanged(newValue, oldValue) {
        if (newValue && this.currentUser) {
            // Check Password
            if (newValue.length < 8) {
                this.validPassword = false
                return ("too_short");
            } else if (newValue.length > 50) {
                this.validPassword = false
                return ("too_long");
            } else if (newValue.search(/\d/) == -1) {
                this.validPassword = false
                return ("no_num");
            } else if (newValue.search(/[a-zA-Z]/) == -1) {
                this.validPassword = false
                return ("no_letter");
            } else if (newValue.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
                this.validPassword = false
                return ("bad_char");
            }
            this.validPassword = true;
            this.currentUser.password = newValue;
            this.updateUser();
        }
    }

    activate() {
        this.user = this.ds.user.user;
        this.reloadData();
    }

    reloadData() {
        this.reloadUsers();

        this.reloadAddresses();

        this.reloadCities();
    }

    reloadUsers() {
        this.userService.getUsersByOrganization(true).then(users => {
            this.users = users;
            if (this.users.length) {
                this.reloadUserSelect();
                this.currentUser = this.users[0];
            }
        });
    }

    reloadCities() {
        this.cityService.getCities().then(cities => {
            this.cities = cities;
        });
    }

    reloadAddresses() {
        if (this.user.type === 'brand') {
            this.brandService.getBrandAddresses(this.user.brand.id)
                .then(addresses => {
                    this.addresses = addresses;
                    if (this.addresses.length)
                        this.currentAddress = this.addresses[0];
                });
            //console.log(JSON.stringify(this.user.brand));
            this.company = this.user.brand;
        } else if (this.user.type === 'press') {
            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                .then(addresses => {
                    this.addresses = addresses;
                    if (this.addresses.length)
                        this.currentAddress = this.addresses[0];
                });
            this.company = this.user.pressHouse;
        } else {
            this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                .then(addresses => {
                    this.addresses = addresses;
                    if (this.addresses.length)
                        this.currentAddress = this.addresses[0];
                });
            this.company = this.user.prAgency;
        }
    }

    reloadUserSelect() {
        if (this.userSelect)
            this.userSelect.reload();
    }

    attached() {
        $("#passwordCheck").toggle();
    }

    deleteOffice() {
        this.addressService.delete(this.currentAddress.id).then(response => {
            this.reloadAddresses();
        });
    }

    hideCalendar() { //RM switch returning a boolean not the brand
        console.log("hideCalendar: calendar: " + this.company.hideCalendar);
        this.brandService.hideCalendar(this.company.id).then(brand => this.company.hideCalendar = brand);
    }

    allowAllRequests() {
        console.log("Should be disabled for now");
    }

    allowAllRequests() {
        console.log("Should be disabled for now");
    }


    // Create dialog NEW USER

    CreateDialogNewUser() {
        console.log("cities:");
        console.log(JSON.stringify(this.cities));
        this.dialogService.open({
            viewModel: CreateDialogNewUser,
            model: this.cities,
            lock: true
        })
            .then(response => {
                if (response.wasCancelled) return false;

                console.log("user created:" + response);
                this.reloadUsers();
            });
    }

    // Create dialog IMPORT USERS

    CreateDialogImportUsers() {
        this.dialogService.open({
            viewModel: CreateDialogImportUsers,
            model: "no-op",
            lock: true
        })
            .then(response => {
                if (response.wasCancelled) return false;
            });
    }


    // Create dialog NEW OFFICE

    CreateDialogNewOffice(user) {
        this.dialogService.open({
            viewModel: CreateDialogNewOffice,
            model: this.user,
            lock: true
        })
            .then(response => {
                if (response.wasCancelled) return false;
                this.reloadAddresses();
            })
    }

    deleteUser(id, userName) {
        console.log("deleting:" + id);

        this.dialogService.open({
            viewModel: CreateDialogConfirmDelete,
            model: userName,
            lock: true
        })
            .then(response => {

                console.log("confirm dialog was cancelled: " + response.wasCancelled);
                if (response.wasCancelled) return false;
                this.userService.delete(id)
                    .then(response => {
                        console.log("response to delete:" + response);
                        this.reloadUsers();
                    });
            })

    }

    /* RM accordion expansion button */
    closeExpand(buttonNumber) {
        var buttonChoice = document.getElementById("button" + buttonNumber);
        var panelChoice = document.getElementById("panel" + buttonNumber);
        buttonChoice.classList.toggle("active");
        panelChoice.classList.toggle("show");
    }

    updateUser() {
        if (this.currentUser) {
            console.log("adminPage.updateUser");
            // fill out the rest of the details for the user (done in userService)
            this.userService.update(this.currentUser);
            this.reloadUserSelect();
        }
    }

    addressChange() {
        console.log("updating address");
        this.addressService.update(this.currentAddress);
    }


    togglePassword() {
        console.log("toggle password");
        var me = document.getElementById('password');
        var meType = me.getAttribute('type');
        if (meType == "password") {
            me.setAttribute('type', 'text');
            document.getElementById('password-toggle').innerHTML = "Hide";
        } else {
            me.setAttribute('type', 'password');
            document.getElementById('password-toggle').innerHTML = "Show";
        }
    }

}