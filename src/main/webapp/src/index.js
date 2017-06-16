// AURELIA
import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import 'fetch';
// DIALOGS
import { CreateSampleRequestPress } from './sample_request/createSampleRequestPress';
import { CreateSampleRequestBrand } from './sample_request/createSampleRequestBrand';
import { EditSampleRequest } from './sample_request/editSampleRequest';
import { EditSearchableItem } from './items/editSearchableItem';
import { CheckAvailability } from './items/checkAvailability';
import { SetAvailability } from './items/setAvailability';
import { Introduction } from './hello/introduction';
import { Zoom } from './zoom/zoom';
import { AddFilesDialog } from './add_files/add_files';
import { ErrorDialogSample } from './error_dialog/error_dialog_sample';
// SERVICES
import { SampleRequestService } from './services/sampleRequestService';
import { UserService } from './services/userService';
import { BrandService } from './services/brandService';
import { PRAgencyService } from './services/PRAgencyService';
import { PubNubService } from './services/pubNubService';
import { SearchableItemService } from './services/searchableItemService';
import { busy } from './services/busy';
import { CreateDialogAlert } from './common/dialogAlert';
import { DS } from './datastores/ds';


@inject(HttpClient, EventAggregator, DialogService, SampleRequestService, UserService, BrandService, PRAgencyService, busy, PubNubService, DS, SearchableItemService)
export class Index {
    //user = {};
    bookings = [];
    rows = [];
    //seasons = [];
    brands = [];
    itemTypes = [];
    colors = [];
    searchType = '';

    selectedBrand = '';
    season = '';
    selectedItemType = '';
    selectedColor = '';
    searchText = ''; //image search
    searchTextRequests = ''; // request search
    availableFrom = '';
    availableTo = '';
    selectedSeason = '';
    selectedCategory = '';
    selectedTheme = '';
    maxR = 250;
    maxRReached = false;
    numberImages = 0;
    busy;
    ordering = 'bookingStartDate';
    filtering = 'ALL REQUESTS';
    today = new Date(); // Do we have a problem with freshness of this variable, say login at 11:59PM?
    firstTime = true;
    onlyShowMine = false;
    onlyShowMineCompany = '';
    bLazy = null;



    constructor(http, eventAggregator, dialogService, sampleRequestService, userService, brandService, PRAgencyService, busy, pubNubService, DS,searchableItemService) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.ea = eventAggregator;
        this.http = http;
        this.boundHandler = this.handleKeyInput.bind(this);
        this.dialogService = dialogService;
        this.sampleRequestService = sampleRequestService;
        this.userService = userService;
        this.brandService = brandService;
        this.prAgencyService = PRAgencyService;
        this.pubNubService = pubNubService;
        this.busy = busy;
        this.maxRReached = false;
        this.numberImages = 0;
        this.imagePanelSize = 2; //  1 = small, 2 = mid, 3 = large
        this.ds = DS;
        this.searchableItemService = searchableItemService;
        
    }

    get numberOfRequests() {
        return document.getElementsByClassName("indexReqRow").length;
    }

    computedOverdue(booking, status) {
        var computedDate = new Date(booking);
        var overdue = this.today > computedDate;
        overdue = (overdue && (status == 'Pending'))
        //console.log("computedOverdue function, booking: " + booking + " today: " + this.today + " computed: " +  computedDate + " overdue: " + (this.today > computedDate));
        return overdue;
    }

    imageExpando() {
        if (this.imagePanelSize == 1) { this.imagePanelSize = 2; return } // no way to get here yet
        if (this.imagePanelSize == 2) { this.imagePanelSize = 3; return }
        if (this.imagePanelSize == 3) { this.imagePanelSize = 2; return }
    }

    filterFunc(searchExpression, value, filter, user, seasons, city, onlyShowMine, onlyShowMineCompany) {
        var searchVal = true;
        var filterVal = true;
        var filterCityVal = true;
        if (searchExpression == '' && filter == '' && city == '' ) return true;
        var itemValue = '';
        if (value.pressHouse) itemValue = value.pressHouse.name;
        if (value.brand) itemValue = itemValue + ' ' + value.brand.name;
        if (value.prAgency) itemValue = itemValue + ' ' + value.prAgency.name;
        if (value.id) itemValue = itemValue + ' ' + value.id;
        // Get season abbreviation
        var i;
        var abbrev = '';
        for (i = 0; i < seasons.length; i++) {
            if (seasons[i].name == value.season) {
                abbrev = seasons[i].abbreviation;
            }
        }

        // filter on overall onlyShowOurRequests
        if (onlyShowMine) {
          if (value.approvingUserCompany) {
            //console.log("Filtering on onlyShowMine, this user company:" + onlyShowMineCompany + " approvingUser company: " + value.approvingUserCompany);
            if (value.approvingUserCompany !== onlyShowMineCompany) return false;
            // else console.log("Ok to continue filter checks");
          }
          // else  console.log("Filtering on onlyShowMine, this user company:" + onlyShowMineCompany + " but not approved or no approvingUsercompany set");
          // OK to proceed for now as no approval given, still visible to PR and brand
        }
        //else  console.log("NO filtering on onlyShowMine, onlyshowmine:" + onlyShowMine);


        // filter on city
        if (city)
            if (city!="All" && city!="Select" && city!="ALL" && city!="SELECT") {
                //console.log("City filtering on: " + city);
                // get city of request
                var requestCity = value.searchableItems[0].sampleCity.name; // user first ssample location
                //console.log("city of request: " + requestCity);
                filterCityVal = (requestCity == city);
            }


        if (value.look && abbrev == '') itemValue = itemValue + ' ' + value.look;//RM check added to index small request man
        if (value.look && abbrev != '') itemValue = itemValue + ' ' + abbrev + value.look;//RM check added to index small request man
        // console.log("Filter value: " + itemValue);
        if (searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;

        if (filter == 'MY REQUESTS') {
            filterVal = (value.requestingUser.id == user.id);
        }
        if (filter == 'OVERDUE REQUESTS') {
            //console.log ("Overdue request: date: " + var computedDate =     new Date(booking););
            var computedDate = new Date(value.bookingStartDate);
            var today = new Date();
            if (user.type == "brand" || user.type == "prAgency") filterVal = ((today > computedDate) && (value.requestStatusBrand == 'Pending'));
            if (user.type == "press") filterVal = ((today > computedDate) && (value.requestStatusPress == 'Pending'));
        }
        if (filter == 'ACTIVE REQUESTS') {
            if (user.type == "brand" || user.type == "prAgency") filterVal = (
                (value.requestStatusBrand != 'Closed') &&
                (value.requestStatusBrand != 'Denied') &&
                (value.requestStatusBrand != 'Refused') &&
                (value.requestStatusBrand != 'Restocked') &&
                (value.requestStatusBrand != 'Withdrawn') &&
                (value.requestStatusBrand != 'Deleted')
            );
            if (user.type == "press") filterVal = (
                (value.requestStatusPress != 'Closed') &&
                (value.requestStatusPress != 'Denied') &&
                (value.requestStatusPress != 'Refused') &&
                (value.requestStatusPress != 'Returned') &&
                (value.requestStatusPress != 'Deleted') &&
                (value.requestStatusPress != 'Withdrawn')
            );
        }
        if (filter == 'INACTIVE REQUESTS') {
            if (user.type == "brand" || user.type == "prAgency") filterVal = (
                (value.requestStatusBrand == 'Closed') ||
                (value.requestStatusBrand == 'Denied') ||
                (value.requestStatusBrand == 'Refused') ||
                (value.requestStatusBrand == 'Restocked') ||
                (value.requestStatusBrand == 'Withdrawn') ||
                (value.requestStatusBrand == 'Deleted')

            );
            if (user.type == "press") filterVal = (
                (value.requestStatusPress == 'Closed') ||
                (value.requestStatusPress == 'Denied') ||
                (value.requestStatusPress == 'Refused') ||
                (value.requestStatusPress == 'Returned') ||
                (value.requestStatusPress == 'Deleted') ||
                (value.requestStatusPress == 'Withdrawn')
            );
        }

        return (searchVal && filterVal && filterCityVal);
    }


    filterChange(event) {
        this.closeAllOpenRequestRows();
        console.log("changing filter: ");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'ALL REQUESTS') this.filtering = '';
                    if (event.detail.value == 'MY REQUESTS') this.filtering = 'MY REQUESTS';
                    if (event.detail.value == 'OVERDUE REQUESTS') this.filtering = 'OVERDUE REQUESTS';
                    if (event.detail.value == 'ACTIVE REQUESTS') this.filtering = 'ACTIVE REQUESTS';
                    if (event.detail.value == 'INACTIVE REQUESTS') this.filtering = 'INACTIVE REQUESTS';
                    console.log("value:" + event.detail.value + " filtering: " + this.filtering);
                }
    }

    filterChangeCategory(event){
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
               
        this.selectedCategory = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == "All") this.selectedCategory = '';
                    else if (event.detail.value == "Select") this.selectedCategory = '';
                    else this.selectedCategory = event.detail.value;
                }
        //console.log("Filter change called, Season: " + this.selectedSeason);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +  
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeCityRM(event) {
        this.closeAllOpenRequestRows();
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    this.cityFiltering = event.detail.value;
                    //console.log("filter value:" + event.detail.value + " city filtering: " + this.cityFiltering);
                }
    }


    filterChangeSearch(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        
        
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&color=' + this.selectedColor +
            '&theme=' + this.selectedTheme +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                    }, 1000); 
                this.busy.off();
            })

        //.then(anything =>  { setTimeout(function() { $("img.lazy").unveil(); }, 1000) ; }) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeBrand(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = []; //RM can do this to prevent the loading over existing images, but have to deal with detritus 
        //had to reset rows as lazy loading was broken
        

        console.log("Filter Change changing Brand");

        if (this.user.type === "brand") {
            this.selectedBrand = this.user.companyId;
            //disable user city filtering
            //this.selectedCity = this.user.city.name;
        } else if (this.user.type === "prAgency") {
            this.selectedBrand = this.prAgencyService.getDefault().id;
            //disable user city filtering
            // if(this.user.city) this.selectedCity = this.user.city.name;
        } else if (this.user.type === "press") {
            this.selectedBrand = '';
        }

        if (event)
            if (event.detail)
                if (event.detail.value) {
                    this.selectedBrand = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
        //console.log("Filter change called, Brand: " + this.selectedBrand);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
            })
            .then(anything => {
                if (this.firstTime) {
                    console.log ("first time lazy load");
                    this.firstTime = false;

                    setTimeout(function () {
                        var msw = document.getElementById("mainScrollWindow");
                        if (msw) {
                            msw.style.visibility = "visible";
                            console.log("setting MSW visibility to visible");
                            if(window.myblazy){
                                window.myblazy.destroy();
                            }
                            let bLazy = new Blazy({ 
                                container: '#mainScrollWindow',
                                offset: 100 
                            });
                            window.myblazy = bLazy;
                        };
                    }, 1000); //wait to set visibile after hiding ugly loading detritus

                    window.addEventListener("focus", function(event) {
                        setTimeout(function () {
                            if(window.myblazy){
                                window.myblazy.destroy();
                            }
                            let blazy = new Blazy({ 
                                container: '#mainScrollWindow',
                                offset: 100 
                            });
                            window.myblazy = blazy;
                            console.log("window focus Blazy recreation");
                        }, 1000);
                    }, false);
                    
                }
                else {
                    console.log ("NOT first time unveil");
                    
                    setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                    }, 1000); 
                    
                }
                this.busy.off();
                
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
            
    }

    seasonNameFromId(id) {
        //RM change to seasons to be object
        //using string here, could probably be better as id, but want to contain the changes 
        var i;
        for (i = 0; i < this.seasons.length; i++) {
            if (this.seasons[i].id == id) {
                return this.seasons[i].name;
            }
        }
        return '';
    }

    seasonAbbreviationFromName(name) {
        //RM change to seasons to be object
        //using string here, could probably be better as id, but want to contain the changes 
        var i;
        for (i = 0; i < this.seasons.length; i++) {
            if (this.seasons[i].name == name) {
                return this.seasons[i].abbreviation;
            }
        }
        return '';
    }

    filterChangeSeason(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        console.log("Filter Change changing Season");
        this.selectedSeason = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    //RM change to seasons to be object
                    //using string here, could probably be better as id, but want to contain the changes 
                    this.selectedSeason = this.seasonNameFromId(event.detail.value);
                    console.log("value: " + event.detail.value + " selected: " + this.selectedSeason);
                }
        //console.log("Filter change called, Season: " + this.selectedSeason);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                            
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeTheme(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        console.log("Filter Change changing Theme");
        this.selectedTheme = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';

                    this.selectedTheme = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
        //console.log("Filter change called, Theme: " + this.selectedTheme);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                            
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeColor(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        console.log("Filter Change changing Color");
        this.selectedColor = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';

                    this.selectedColor = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
        //console.log("Filter change called, Color: " + this.selectedColor);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeDates(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        console.log("Filter Change changing Change Dates: from: " + this.availableFrom + " to: " + this.availableTo);
        //this.availableTo = '';
        /* if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';

                    this.availableTo = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
                //console.log("Filter change called, Color: " + this.selectedColor);
        */
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    filterChangeCity(event) {
        this.busy.on();
        if(window.myblazy){
            window.myblazy.destroy();
        }
        this.rows = [];
        console.log("Filter Change changing Change City: from: " + this.selectedCity);
        this.selectedCity = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') event.detail.value = '';
                    if (event.detail.value == 'Select') event.detail.value = '';

                    this.selectedCity = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
        console.log("Filter change called, City: " + this.selectedCity);       
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/' + this.searchType + '?searchtext=' + encodeURI(this.searchText) +
            '&brand=' + this.selectedBrand +
            '&season=' + encodeURI(this.selectedSeason) +
            '&category=' + this.selectedCategory +
            '&availableFrom=' + this.availableFrom +
            '&availableTo=' + this.availableTo +
            '&theme=' + this.selectedTheme +
            '&color=' + this.selectedColor +
            '&city=' + this.selectedCity +
            '&maxR=' + this.maxR)
            .then(response => response.json())
            .then(rows => {
                if (rows.session == 'invalid') {
                    window.location.href = '/user/login';
                    return;
                }
                this.rows = rows;
                this.busy.off();
                if (rows.length > 0) {
                    this.numberImages = (rows.length - 1) * rows[0].numberImagesThisRow;
                    this.numberImages += rows[rows.length - 1].numberImagesThisRow;
                    if (this.numberImages == this.maxR) this.maxRReached = true;
                }
                setTimeout(function () {
                        window.myblazy.destroy();
                        window.myblazy.revalidate();
                        console.log("subsequent loading Blazy recreation");
                }, 1000); 
                this.busy.off();
            })
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
            ;
    }

    orderChange(event) {
        this.closeAllOpenRequestRows();
        console.log("Order changed ");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'BY START DATE') this.ordering = 'bookingStartDate';
                    if ((this.user.type == "brand") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM ditto below
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM ditto below
                    if ((this.user.type == "press") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM changes needed here to properly order strings
                    if ((this.user.type == "brand") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand';
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; //RM double check this
                    if ((this.user.type == "press") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusPress';
                    console.log("value:" + event.detail.value)
                }
    }



    activate() {
        this.user = this.ds.user.user;
        if (this.user.type === "nosession") window.location.href = '/user/login';
        if (this.user.type === "brand") { this.searchType = 'brandSearch'; this.company = this.user.brand; }
        if (this.user.type === "press") { this.searchType = 'filterSearch'; this.company = this.user.pressHouse; }
        if (this.user.type === "prAgency") { this.searchType = 'brandSearch'; this.company = this.user.prAgency; }

        // filtering
        if(this.user.type === "brand") this.brandService.getOnlyShowMySampleRequests(this.user.brand.id).then ( result => { 
            this.onlyShowMine = result;
            console.log("onlyShowMine:" + this.onlyShowMine);
            if(this.onlyShowMine) {
                // move to company based interpretation of onlyShowMine this.cityFiltering = this.user.city.name;
                this.onlyShowMineCompany = this.user.brand.name;
            }
        });   

        if(this.user.type === "prAgency") this.prAgencyService.getOnlyShowMySampleRequests(this.user.prAgency.id).then ( result => { 
            this.onlyShowMine = result;
            console.log("onlyShowmine:" + this.onlyShowMine);
            if(this.onlyShowMine) {
                // move to company based interpretation of onlyShowMine this.cityFiltering = this.user.city.name;
                this.onlyShowMineCompany = this.user.prAgency.name;
            }
        }); 

        if (this.user.type === "prAgency")
            return Promise.all([
                this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
                this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
                this.brandService.getBrands().then(brands => this.brands = brands),
                this.prAgencyService.getBrands().then(brands => this.PRbrands = brands),
                this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
            ]);
        else
            return Promise.all([
                this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
                this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
                this.brandService.getBrands().then(brands => this.brands = brands),
                this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
            ]);



    }


    attached() {
        //RM upgrades here: 
        // - check for backwards dates
        // - don't fire search if no change to data
        // - don't fire search if it a clear on an empty date (should be covered by above)
        // - don't fire if dates are in the past
        // - have a special color for when selected date is today (blue background + black text? IE combine the two)
        
        this.subscriber = this.ea.subscribe('datepicker', response => {
            console.log("datepicker event: " + response.elementId + " : " + response.elementValue);
            var fireChange = false;
            if (response.elementId === 'datepickerto') {
                if (this.availableFrom) {
                    this.fireChange = true;
                    this.availableTo = response.elementValue;
                }
                else document.getElementById('datepickerto').value = '';
            }
            if (response.elementId === 'datepickerfrom') {
                this.availableFrom = response.elementValue;
                this.fireChange = true;
                //  clear the to field as well
                this.availableTo = '';
                document.getElementById('datepickerto').value = ''
            }

            if (this.fireChange) this.filterChangeDates();
            /*if ((this.availableTo && this.availableFrom) || (this.availableFrom))
                this.filterChangeDates(); */

        });
        let show = this.userService.show();
        if (show) {
            this.dialogService.open({ viewModel: Introduction, model: "no-op", lock: false }).then(response => {
                this.userService.introShown();
            });
        }

        // load initial iamges. NOTE special code in filterChangeBrand for first time loading - move this if change this line
        this.filterChangeBrand();
        var parent = this;

        // search box functionality
        // search logic here
        // this function will be executed on click of X (clear button) + enter

        $('#search-images').on('search', function () {
            console.log("x hit/search in search-images call filterChangeSearch");
            parent.filterChangeSearch(event)
        });
        $('#search-images2').on('search', function () {
            console.log("x hit/search in search-images2 call filterChangeSearch");
            parent.filterChangeSearch(event)
        });
        $('#search-contacts').on('search', function () {
            console.log("x hit/search in search-contacts -> does nothing")
        });
        $('#search-requests').on('search', function () {
            console.log("x hit/search in search-requests -> does nothing")
        });


        // Three dots Menu dropdown close when click outside
        $('body').click(function () {
            $(".look-menu-absolute").each(function () {
                $(this).removeClass("look-menu-show");
            });
        });

        /*
        //Select functionality for brand and agency users to toggle/show "search images"/"manage images" blocks
        // Show/hide on document ready
        $('.blockSearchImages').show();
        $('.blockManageImages').hide();

        //Show/hide on select  
        $('#imagesFunctionality').change(function () {
            if ($(this).val() == 'optionSearchImages') {
                $('.blockSearchImages').show();
                $('.blockManageImages').hide();
            } else if ($(this).val() == 'optionManageImages') {
                $('.blockSearchImages').hide();
                $('.blockManageImages').show();
            }
        });
        */

        //document.getElementById('search-images').addEventListener('keypress', this.boundHandler, false);

        //Set height of scrollable list of looks 
        function mainScrollWindowHeight() {
            if ($('.cards-list-wrap').offset()) {
                var emptySpace = 0;
                var setHeight = $(window).height() - $('.footer').outerHeight() - $('.cards-list-wrap').offset().top - emptySpace;
                $('.cards-list-wrap').css('height', setHeight);
            }
        }
        mainScrollWindowHeight();
        $(window).resize(function () {
            mainScrollWindowHeight();
        });
        console.time("SampleRequests");
        this.sampleRequestService.getSampleRequests().then(bookings => {
            bookings.forEach(item => {
                this.bookings.push(item);
                
            });
            console.timeEnd("SampleRequests");
        });

        this.listenForBookingsCacheInvalidation(this.pubNubService.getPubNub());

        ga('set', 'page', '/index.html');
        ga('send', 'pageview');
        ga('send', 'event', 'index', 'pageview', this.user.email);
    }


    detached() {
        window.removeEventListener('keypress', this.boundHandler);
    }

    handleKeyInput(event) {
        console.log(event);
        if (event.which == 13 && event.srcElement.id === 'search-images') {
            console.log("user hit enter");
            //this.filterChangeSearch(event);
        }
    }

    /* RM Sample Request - accordion expansion button */
    closeExpand(buttonNumber) {
        var buttonChoice = document.getElementById("button" + buttonNumber);
        var panelChoice = document.getElementById("panel" + buttonNumber);
        buttonChoice.classList.toggle("active");
        panelChoice.classList.toggle("show");
        //menu.scrollIntoView({block: "end", behavior: "smooth"});
        panelChoice.scrollIntoViewIfNeeded();
    }

    closeAllOpenRequestRows() {
        var activeList = document.getElementsByClassName("active requestButton");
        var showList = document.getElementsByClassName("show requestPanel");
        var numberElements = 0;
        if (activeList) numberElements = activeList.length; // needed as activeList is dynamically updated HTMLLiveCollection
        var i;
        if (numberElements > 0) {
            for (i = 0; i < numberElements; i++) {
                if (activeList) activeList[0].classList.toggle("active");
            }
        }
        if (showList) numberElements = showList.length;
        if (numberElements > 0) {
            for (i = 0; i < numberElements; i++) {
                if (showList) showList[0].classList.toggle("show");
            }
        }
    }

    lookMenu(id) {
        var menu = document.getElementById("look-" + id);
        menu.classList.toggle("look-menu-show");
        //menu.scrollIntoView({block: "end", behavior: "smooth"});
        menu.scrollIntoViewIfNeeded();
    }



    createSampleRequestPress(itemId) {
        // this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CreateSampleRequestPress, model: itemId, lock: true })
            .then(response => {

            });
    }

    createSampleRequestBrand(itemId) {
        // this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CreateSampleRequestBrand, model: itemId, lock: true })
            .then(response => {

            });
    }

    checkAvailabilitySearchableItem(itemId) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CheckAvailability, model: itemId, lock: false })
            .then(response => { });
    }

    setAvailabilitySearchableItem(item) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: SetAvailability, model: item, lock: true })
            .then(response => {
            });
    }

    editSearchableItem(itemId) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: EditSearchableItem, model: itemId, lock: true })
            .then(response => { });
    }

    sampleRequestMenu(id) {
        var menu = document.getElementById("requestTest" + id);
        menu.classList.toggle("look-menu-show");
        //menu.scrollIntoView({block: "end", behavior: "smooth"});
        menu.scrollIntoViewIfNeeded();

    }

    closeSampleRequestMenu(id) {
        //var menu = document.getElementById("requestTest" + id);
        //menu.classList.toggle("look-menu-show");
    }

    editSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.dialogService.open({ viewModel: EditSampleRequest, model: id, lock: true })
            .then(response => {

            });
    }


    alertP(message) {

        this.dialogService.open({ viewModel: CreateDialogAlert, model: { title: "Booking", message: message, timeout: 5000 }, lock: false }).then(response => { });
    }

    //Brand Workflow Functions
    denySampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.denySampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    approveSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.approveSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    sendSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.sendSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    markPickedUpSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.markPickedUpSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    markReturnedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.markReturnedSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    restockedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.restockedSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    deleteSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.deleteSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    /*
     *  Listen on channel for press or brand name
     *   then reload bookings.
     * 
    */
    listenForBookingsCacheInvalidation(pubNub) {
        console.log("listen for bookings cache invalidate - index.js");

        // changes to sample requests
        let company = this.user.company;
        let channel = company + '_cacheInvalidate';
        console.log("listening on channel:" + channel);
        let bookingsToUpdate = this.bookings;
        let sampleRequestService = this.sampleRequestService;

        var indexListener = {
            message: function updateBookingsIndex(message) {

                var channelName = message.channel;
                if (channelName === channel) {
                    sampleRequestService.getSampleRequests(true).then(newBookings => {
                        while (bookingsToUpdate.length > 0) {
                            bookingsToUpdate.pop();
                        }
                        newBookings.forEach(item => {
                            bookingsToUpdate.push(item);
                        });
                    });
                    toastr.options.preventDuplicates = true;
                    toastr.options.closeButton = false;
                    toastr.options.timeOut = 5000;
                    toastr.info('Request ' + message.message + " updated");
                }
            }
        }
        pubNub.addListener(indexListener);
        this.pubNubService.addIndexListener(indexListener);
        pubNub.subscribe({
            channels: [channel],
            withPresence: false
        })

        // bookings alarms
        channel = company + '_stuartOneHourNotification';
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes();
        console.log("listening on channel:" + channel + " message on display: " + 'message.messge ' + time);

        indexListener = {
            message: function alarmToast(message) {

                var channelName = message.channel;
                if (channelName === channel) {
                    toastr.options.preventDuplicates = false;
                    toastr.options.closeButton = true;
                    toastr.options.timeOut = 0;
                    toastr.info(message.message + ' (' + time + ')');
                }
            }
        }
        pubNub.addListener(indexListener);
        this.pubNubService.addIndexListener(indexListener);
        pubNub.subscribe({
            channels: [channel],
            withPresence: false
        })
    }

    unbind() {
        console.log("UNBIND INDEX ******* ")
        this.pubNubService.removeIndexListener();

    }

    reloadBookings() {
        console.log("*******  RELOADING BOOKINGS *************");
        this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
    }

    //Press Workflow Functions
    pressMarkReceivedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressMarkReceivedSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    pressShipSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressShipSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    pressMarkPickedUpSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }
    pressDeleteSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressDeleteSampleRequest(id).then(message => {
            this.alertP(message.message);

        });
    }



    createZoomDialog(item, rowNumber, itemNumber) {
        console.log("createZoomDialog item number :" + itemNumber);
        console.log("createZoomDialog item  :" + item);
        let menu = document.getElementById("card-" + item.id);

        menu.classList.toggle("blue-image");
        let zoomModel = {};
        zoomModel.item = item;
        zoomModel.rows = this.rows;
        zoomModel.itemNumber = itemNumber;
        zoomModel.rowNumber = rowNumber;
        this.dialogService.open({ viewModel: Zoom, model: zoomModel, lock: false })
            .then(response => {
                menu.classList.toggle("blue-image");
            });
    }

    // Add files (Add images) dialog
    createAddfilesDialog() {
        this.dialogService.open({ viewModel: AddFilesDialog, model: null, lock: true })
            .then(response => { });
    }

    // Create error dialog sample
    createErrorDialogSample() {
        this.dialogService.open({ viewModel: ErrorDialogSample, model: "no-op", lock: false })
            .then(response => { });
    }


}
