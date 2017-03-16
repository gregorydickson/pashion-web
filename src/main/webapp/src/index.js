import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import 'fetch';
import { CreateSampleRequest } from './sample_request/createSampleRequest';
import { CreateSampleRequestBrand } from './sample_request/createSampleRequestBrand';
import { EditSampleRequest } from './sample_request/editSampleRequest';
import { EditSearchableItem } from './items/editSearchableItem';
import { CheckAvailability } from './items/checkAvailability';
import { SetAvailability } from './items/setAvailability';
import { Introduction } from './hello/introduction';
import { Zoom } from './zoom/zoom';
import { SampleRequestService } from './services/sampleRequestService';
import { UserService } from './services/userService';
import { BrandService } from './services/brandService';
import { AddFilesDialog } from './add_files/add_files';
import { ErrorDialogSample } from './error_dialog/error_dialog_sample';
import { CreateDialogAlert } from './common/dialogAlert';
import {busy} from './services/busy';


@inject(HttpClient, EventAggregator, DialogService, SampleRequestService, UserService, BrandService, busy)
export class Index {
    user = {};
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
    selectedTheme = ''; 
    maxR = 250;
    maxRReached = false;
    numberImages = 0;
    busy;
    ordering = 'bookingStartDate';
    filtering = 'ALL REQUESTS';


    filterFunc(searchExpression, value, filter, user){
        var searchVal = true;
        var filterVal = true;
        if (searchExpression == '' && filter == '') return true;
        var itemValue ='';
        if (value.pressHouse) itemValue = value.pressHouse.name;
        if (value.brand)  itemValue = itemValue + value.brand.name;
        if (value.prAgency) itemValue = itemValue + value.prAgency.name;
        // console.log("Filter value: " + itemValue);
        if(searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;    

        if (filter == 'MY REQUESTS') {
          filterVal = (value.requestingUser.id == user.id);
        }
        if (filter == 'OVERDUE REQUESTS') {
            if (user.type == "brand" || user.type == "prAgency") filterVal = (value.requestStatusBrand == 'Overdue');
            if (user.type == "press" )  filterVal = (value.requestStatusPress == 'Overdue');
        }
        if (filter == 'OPEN REQUESTS') {
            if (user.type == "brand" || user.type == "prAgency") filterVal = (value.requestStatusBrand != 'Closed');
            if (user.type == "press" ) filterVal = (value.requestStatusPress != 'Closed');
        }
        if (filter == 'CLOSED REQUESTS') {
            if (user.type == "brand" || user.type == "prAgency") filterVal = (value.requestStatusBrand == 'Closed');
            if (user.type == "press") filterVal = (value.requestStatusPress == 'Closed');
        }

        return (searchVal && filterVal); 

      }


  filterChange(event){
      console.log("changing filter: ");
          if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'ALL REQUESTS') this.filtering = '';
                    if (event.detail.value == 'MY REQUESTS') this.filtering = 'MY REQUESTS'; 
                    if (event.detail.value == 'OVERDUE REQUESTS') this.filtering = 'OVERDUE REQUESTS';  
                    if (event.detail.value == 'OPEN REQUESTS') this.filtering = 'OPEN REQUESTS'; 
                    if (event.detail.value == 'CLOSED REQUESTS') this.filtering = 'CLOSED REQUESTS'; 
                    console.log("value:" + event.detail.value + " filtering: " +this.filtering);
                } 
  }

    filterChangeSearch(event) {
        this.busy.on();
        console.log("Filter Change changing search: search value:" + this.searchText);
        // this.searchText = '';
       /* if (event)
            if (event.detail)
                if (event.detail.value) {
                    this.searchText = event.detail.value;
                    console.log("value:" + event.detail.value)
                }*/
                //console.log("Filter change called, SEARCH: " + this.searchText);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                // '&itemType=' + this.selectedItemType + 
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything =>  { setTimeout(function() { $("img.lazy").unveil(); }, 1000) ;
                              setTimeout(function() { $("img.lazy").unveil(); }, 10000) ; }) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }

    filterChangeBrand(event) {
        this.busy.on();
        console.log("Filter Change changing Brand");
        if (this.user.type === "brand") this.selectedBrand = this.user.companyId; 
        else this.selectedBrand = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    this.selectedBrand = event.detail.value;
                    console.log("value:" + event.detail.value)
                }
                //console.log("Filter change called, Brand: " + this.selectedBrand);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
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
        console.log("Filter Change changing Season");
        this.selectedSeason = '';
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    //RM change to seasons to be object
                    //using string here, could probably be better as id, but want to contain the changes 
                    this.selectedSeason = this.seasonNameFromId (event.detail.value);
                    console.log("value: " + event.detail.value + " selected: " + this.selectedSeason);
                }
                //console.log("Filter change called, Season: " + this.selectedSeason);
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }

    filterChangeTheme(event) {
        this.busy.on();
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
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }

    filterChangeColor(event) {
        this.busy.on();
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
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }

    filterChangeDates(event) {
        this.busy.on();
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
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }

    filterChangeCity(event) {
        this.busy.on();
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
                //console.log("Filter change called, Color: " + this.selectedColor);       
        this.numberImages = 0;
        this.maxRReached = false;
        this.http.fetch('/searchableItem/'+this.searchType+'?searchtext=' + encodeURI(this.searchText) +
                '&brand=' + this.selectedBrand +
                '&season=' + encodeURI(this.selectedSeason) +
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
            })

        .then(anything => setTimeout(function() { $("img.lazy").unveil(); }, 1000)) // initial unveil of first images on load
            .then(result => $('div.cards-list-wrap').animate({ scrollTop: $('div.cards-list-wrap').offset().top - 250 }, 'slow')) // scroll to top
        ;
    }
  
  orderChange(event) {
        console.log("Order changed ");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'BY DATE') this.ordering = 'bookingStartDate';
                    if ((this.user.type == "brand") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM ditto below
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM ditto below
                    if ((this.user.type == "press") && (event.detail.value == 'BY NUMBER')) this.ordering = 'look'; //RM changes needed here to properly order strings
                    if ((this.user.type == "brand") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; 
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; //RM double check this
                    if ((this.user.type == "press") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusPress';
                    console.log("value:" + event.detail.value)
                }          
    }

    constructor(http, eventAggregator, dialogService, sampleRequestService, userService, brandService, busy) {
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
        this.busy = busy;
        this.maxRReached = false;
        this.numberImages = 0;

    }

    //activate() is called before attached()
    activate() {


        return Promise.all([
            this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
            this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
            this.brandService.getBrands().then(brands => this.brands = brands),
            this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),

            this.user = this.userService.getUser().then(user => {
                this.user = user;
                if(this.user.type === "nosession") window.location.href = '/user/login';
                if(this.user.type === "brand") { this.searchType = 'brandSearch'; this.company = user.brand;}
                if(this.user.type === "press") { this.searchType = 'filterSearch'; this.company = user.pressHouse; }
                if(this.user.type === "prAgency") { this.searchType = 'filterSearch'; this.company = user.prAgency; }
            })

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
            this.dialogService.open({ viewModel: Introduction, model: "no-op" }).then(response => {
                this.userService.introShown();
            });
        }

        this.filterChangeBrand();
        var parent = this;

        // search box functionality
        // search logic here
        // this function will be executed on click of X (clear button) + enter

        $('#search-images').on('search', function() {
            console.log("x hit/search in search-images call filterChangeSearch");
            parent.filterChangeSearch(event)
        });
        $('#search-images2').on('search', function() {
            console.log("x hit/search in search-images2 call filterChangeSearch");
            parent.filterChangeSearch(event)
        });
        $('#search-contacts').on('search', function() {
            console.log("x hit/search in search-contacts -> does nothing")
        });
        $('#search-requests').on('search', function() {
            console.log("x hit/search in search-requests -> does nothing")
        });


        // Three dots Menu dropdown close when click outside
        $('body').click(function() {
            $(".look-menu-absolute").each(function() {
                $(this).removeClass("look-menu-show");
            });
        });

        //Select functionality for brand and agency users to toggle/show "search images"/"manage images" blocks
        // Show/hide on document ready
        $('.blockSearchImages').show();
        $('.blockManageImages').hide();

        //Show/hide on select  
        $('#imagesFunctionality').change(function() {
            if ($(this).val() == 'optionSearchImages') {
                $('.blockSearchImages').show();
                $('.blockManageImages').hide();
            } else if ($(this).val() == 'optionManageImages') {
                $('.blockSearchImages').hide();
                $('.blockManageImages').show();
            }
        });

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
        $(window).resize(function() {
            mainScrollWindowHeight();
        });
                    this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
    }


    detached() {
        window.removeEventListener('keypress', this.boundHandler);
    }

    handleKeyInput(event) {
        //console.log(event);
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
    }

    lookMenu(id) {
        var menu = document.getElementById("look-" + id);
        menu.classList.toggle("look-menu-show");
    }



    createSampleRequest(itemId) {
        // this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CreateSampleRequest, model: itemId })
            .then(response => {
                if (response.wasCancelled) {
                } else {
                    this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
                }
            });
    }

    createSampleRequestBrand(itemId) {
        // this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CreateSampleRequestBrand, model: itemId })
            .then(response => {
                if (response.wasCancelled) {
                } else {
                    this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
                }
            });
    }

    checkAvailabilitySearchableItem(itemId) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: CheckAvailability, model: itemId })
            .then(response => {});
    }

    setAvailabilitySearchableItem(item) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: SetAvailability, model: item })
            .then(response => {
            });
    }

    editSearchableItem(itemId) {
        //this.lookMenu(itemId);
        this.dialogService.open({ viewModel: EditSearchableItem, model: itemId })
            .then(response => {});
    }

    sampleRequestMenu(id) {
        var menu = document.getElementById("requestTest" + id);
        menu.classList.toggle("look-menu-show");

    }

    closeSampleRequestMenu(id) {
        //var menu = document.getElementById("requestTest" + id);
        //menu.classList.toggle("look-menu-show");
    }

    editSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.dialogService.open({ viewModel: EditSampleRequest, model: id })
            .then(response => {
                if (response.wasCancelled) {
                } else {
                    this.reloadBookings();
                }
                
            });
    }


    alertP (message){

        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Booking", message:message, timeout:5000} }).then(response => {});
    }

    //Brand Workflow Functions
    denySampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.denySampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    approveSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.approveSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    sendSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.sendSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    markPickedUpSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.markPickedUpSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    markReturnedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.markReturnedSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    restockedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.restockedSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    deleteSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.deleteSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }

    reloadBookings() {
        this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
    }

    //Press Workflow Functions
    pressMarkReceivedSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressMarkReceivedSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    pressShipSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressShipSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    pressMarkPickedUpSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }
    pressDeleteSampleRequest(id) {
        this.closeSampleRequestMenu(id);
        this.sampleRequestService.pressDeleteSampleRequest(id).then(message => {
            this.alertP(message.message);
            this.reloadBookings();
        });
    }



    createZoomDialog(item, rowNumber, itemNumber) {
        console.log("item number :" + itemNumber);
        console.log("item  :" + item);
        let menu = document.getElementById("card-" + item.id);

        menu.classList.toggle("blue-image");
        let zoomModel = {};
        zoomModel.item = item;
        zoomModel.rows = this.rows;
        zoomModel.itemNumber = itemNumber;
        zoomModel.rowNumber = rowNumber;
        this.dialogService.open({ viewModel: Zoom, model: zoomModel })
            .then(response => {
                menu.classList.toggle("blue-image");
            });
    }

    // Add files (Add images) dialog
    createAddfilesDialog() {
        this.dialogService.open({ viewModel: AddFilesDialog, model: null })
            .then(response => {});
    }

    // Create error dialog sample
    createErrorDialogSample() {
        this.dialogService.open({ viewModel: ErrorDialogSample, model: "no-op" })
            .then(response => {});
    }


}
