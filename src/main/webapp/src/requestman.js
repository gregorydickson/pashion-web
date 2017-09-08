import { inject, bindable, bindingMode, observable, BindingEngine } from 'aurelia-framework';
import { SampleRequestService } from './services/sampleRequestService';
import { PubNubService } from './services/pubNubService';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogNewContact } from './contacts/dialogNewContact';
import { CreateDialogImportContacts } from './contacts/dialogImportContacts';
import { EditSampleRequest } from './sample_request/editSampleRequest';
import { busy } from './services/busy';
import { CreateDialogAlert } from './common/dialogAlert';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PDFService } from './services/PDFService';
import { PRAgencyService } from './services/PRAgencyService';
import { BrandService } from './services/brandService';
import { UserService } from './services/userService';
import moment from 'moment'

@inject(BindingEngine, HttpClient, DialogService, PDFService, SampleRequestService, busy, EventAggregator, PubNubService, BrandService, PRAgencyService, UserService)
export class Requestman {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) bookings = [];
  // @observable bookingsImages = [];
  @observable bookingsImagesView = [];
  searchTest = "";
  status = [];
  selectedStatus = "";
  user = {};

  look = '';
  brand = '';
  samples = [];
  image = '';
  season = '';
  closed = true;
  searchTextReqMan = '';
  ordering = 'bookingStartDate';
  filtering = 'ACTIVE REQUESTS'; // IE all
  today = new Date(); // Do we have a problem with freshness of this variable, say login at 11:59PM?
  onlyShowMine = false;
  onlyShowMineCompany = '';
  cityFiltering = '';



  constructor(bindingEngine, http, dialogService, pDFService, sampleRequestService, busy, eventAggregator, pubNubService, brandService, PRAgencyService, userService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });

    this.http = http;
    this.dialogService = dialogService;
    this.sampleRequestService = sampleRequestService;
    this.busy = busy;
    this.ea = eventAggregator;
    this.pDFService = pDFService;
    this.pubNubService = pubNubService;
    this.brandService = brandService;
    this.userService = userService;
    this.prAgencyService = PRAgencyService;
    this.bindingEngine = bindingEngine;

    //this.bookingsImages = [];

  }

 /*
  listChanged(splices){
    console.log("bookingsImages changed");
  }
  */

  activate() {
    this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);

    //this.bookingsImages[6319] = '//dvch4zq3tq7l4.cloudfront.net/eudon-choi/2017/fall/ready-to-wear/0004.jpg';
    //this.bookingsImages = [];
    //this.bookingsImagesView[50000] = '';
    this.sampleRequestService.getSampleRequests()
      .then(bookings => {
        this.bookings = bookings;
        let i = 0;
        for (i;i < bookings.length ;i++) {
          let y = 0;
          for (y;y<bookings[i].searchableItems.length ;y++) {
            //this.bookingsImages[bookings[i].searchableItems[y].look.id] = 
            //this.computedImage (bookings[i].searchableItems[y].look);
            let lookId = bookings[i].searchableItems[y].look.id;
            this.http.fetch('/searchableItem/fetchSI/'+lookId+'.json')
              .then(response => response.json())
              .then(item => { 
                console.log ("image to show: " + item.image);
                //this.bookingsImagesView = [];
                //this.bookingsImages[lookId] = item.image;
                //this.bookingsImagesView = this.bookingsImages;
                this.bookingsImagesView[lookId] = item.image;
              })
            }
          }
      });

    this.userService.getUser().then(user=>{
      this.user = user;
      if(this.user.type === "brand") this.brandService.getOnlyShowMySampleRequests(this.user.brand.id).then ( result => { 
        this.onlyShowMine = result;
        console.log("onlyShowmine:" + this.onlyShowMine);
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
    });
  }

  /*
  computedImage(sampleLook) {
 
  }
  */

  attached() {
    // array observer

    // this.subscription = this.bindingEngine.collectionObserver(this.bookingsImages).subscribe(splices => { this.listChanged(splices);});
    // Three dots Menu dropdown close when click outside
    $('body').click(function () {
      $(".look-menu-absolute").each(function () {
        $(this).removeClass("look-menu-show");
      });
    });

    // intercept search to clear the image on the left
    var parent = this;
    $('#search-requests').on('keydown', function () {
      // console.log("x hit/search in search requests");
      //if (parent.closed) return;
      var buttonChoice = document.getElementById("button" + parent.opened);
      var panelChoice = document.getElementById("panel" + parent.opened);
      if (buttonChoice != null) {
        parent.closed = true;
        buttonChoice.classList.toggle("active");
      }
      if (panelChoice != null) {
        parent.closed = true;
        panelChoice.classList.toggle("show");
      }
      parent.brand = '';
      parent.image = '';
      parent.season = '';
      parent.look = '';
      parent.opened = '';
    });

    this.subscriber = this.ea.subscribe('datepicker', response => {
      console.log("datepicker event: " + response.elementId + " : " + response.elementValue);
      //this.closeExpanded (); //RM not do it here, push to filter change
      var fireChange = false;
      if (response.elementId === 'datepickersearchto') {
        this.searchTo = response.elementValue;
        if ((this.searchFrom) && (new Date(this.searchFrom).getTime() <= new Date(this.searchTo).getTime())) {
          this.fireChange = true;
        }
        else {
          document.getElementById('datepickersearchto').value = '';
          this.searchTo = '';
        }
      }
      if (response.elementId === 'datepickersearchfrom') {
        this.searchFrom = response.elementValue;
        this.fireChange = true;
        //  clear the to field as well
        this.searchTo = '';
        document.getElementById('datepickersearchto').value = ''
      }

      if (this.fireChange) this.filterChange();
      /*if ((this.availableTo && this.availableFrom) || (this.availableFrom))
          this.filterChangeDates(); */

    });

    this.listenForBookingsCacheInvalidation(this.pubNubService.getPubNub());

      ga('set', 'page', '/requestman.html');
      ga('send', 'pageview');
  }

  detached () {
    //this.subscription.dispose();
  }

  get imagesFetched () {
    return this.bookingsImagesView.length > 0;
  }

  get numberOfRequests() {
    return document.getElementsByClassName("indexReqRow").length;
  }

  /*    orderChange(event) {
          console.log("Order changed: ");
          this.closeExpanded ();
          if (event)
              if (event.detail)
                  if (event.detail.value) {
                      if (event.detail.value == 'BY START DATE') this.ordering = 'bookingStartDate';
                      if (event.detail.value == 'BY NUMBER') this.ordering = 'id'; 
                      if (event.detail.value == 'BY STATUS') this.ordering = 'requestStatusBrand';
                      console.log("value:" + event.detail.value + "ordering: " +this.ordering);
                  }          
      } */


  computedOverdue(booking, status) {
    var computedDate = new Date(booking);
    var overdue = this.today > computedDate;
    overdue = (overdue && (status == 'Pending'))
    //console.log("computedOverdue function, booking: " + booking + " today: " + this.today + " computed: " +  computedDate + " overdue: " + (this.today > computedDate));
    return overdue;
  }


/*
// VERY SLOW and clunky and kludge ? side effects on currentContact ??

  // requires ref
  computeCompany(id,company) {
    console.log(company);
    if (id == null || id == undefined || id == 'undefined' || id == '') return '';
    this.userService.getUserDetails(id).then ( details => { 
      if (details.brand) company.innerHTML = details.brand.name;
      else if (details.prAgency) company.innerHTML = details.prAgency.name;
      else company.innerHTML = details.pressHouse.name;
    })
  }
  */

  createPDFDialog() {
    //container = document.getElementsByClassName ('brandGridContent');
    var dates = '';
    var filter = '';
    if (this.filtering) filter = "Filter: " + this.filtering;
    var search = '';
    if (this.searchTextReqMan) search = "Search: '" + this.searchTextReqMan + "'";
    if (this.searchFrom) dates = "From: " + this.searchFrom;
    if (this.searchTo) dates = dates + " to " + this.searchTo;
    // var headerText = {};
    if (this.user.type == 'brand' || this.user.type == 'prAgency') var headerText = ['ID', 'LOOK', 'DUE DATE', 'COMPANY', 'REQUESTOR', 'END DATE', '#', 'STATUS'];
    if (this.user.type == 'press') var headerText = ['ID', 'LOOK', 'REQUESTED', 'BRAND', 'REQUESTOR', 'END DATE', '#', 'STATUS'];
    this.pDFService.generatePDF(this.user.name, this.user.surname, dates, search, filter, headerText);
    //console.log("container to text: " + container);
  }


  orderChange(event) {
    console.log("Order changed ");
    this.closeExpanded();
    if (event)
      if (event.detail)
        if (event.detail.value) {
          if (event.detail.value == 'BY START DATE') this.ordering = 'bookingStartDate';
          if ((this.user.type == "brand") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM ditto below
          if ((this.user.type == "prAgency") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM ditto below
          if ((this.user.type == "press") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM changes needed here to properly order strings
          if ((this.user.type == "brand") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand';
          if ((this.user.type == "prAgency") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; //RM double check this
          if ((this.user.type == "press") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusPress';
          console.log("value:" + event.detail.value + "ordering: " + this.ordering);
        }
  }


  filterChange(event) {
    console.log("changing filterChange (dates: " + this.searchFrom + " to " + this.searchTo);
    this.closeExpanded();
    if (event)
      if (event.detail)
        if (event.detail.value) {
          if (event.detail.value == 'ALL REQUESTS') this.filtering = '';
          if (event.detail.value == 'MY REQUESTS') this.filtering = 'MY REQUESTS';
          if (event.detail.value == 'OVERDUE REQUESTS') this.filtering = 'OVERDUE REQUESTS';
          if (event.detail.value == 'ACTIVE REQUESTS') this.filtering = 'ACTIVE REQUESTS';
          if (event.detail.value == 'INACTIVE REQUESTS') this.filtering = 'INACTIVE REQUESTS';
          //console.log("value:" + event.detail.value + " filtering: " +this.filtering);
        }
  }

  filterRangeFunc(startDate, searchStartDate, endDate, searchEndDate) {

    //console.log ('Incoming Dates: ' + startDate + "   " + searchStartDate + "   " + endDate + "   " + searchEndDate);
    // startDate : 2017-12-31
    // searchStartDate: 31-Jul-2017

    // strip timezone
    if (startDate) startDate = startDate.slice(0,10);
    if (endDate) endDate = endDate.slice(0,10);
    //console.log ('Converted Dates: ' + startDate + "   " + searchStartDate + "   " + endDate + "   " + searchEndDate);
    // local compare
    if (!searchStartDate) return true;
    //if (!searchEndDate) return true; 
    // convert to milliseconds using moment as coming in as two different formats
    var startDateMilli = moment(startDate, "YYYY-MM-DD");
    var endDateMilli = moment(endDate, "YYYY-MM-DD");
    var searchStartDateMilli = moment(searchStartDate, "DD-MMM-YYYY");
    var searchEndDateMilli = moment(searchEndDate, "DD-MMM-YYYY");
    //console.log ('DatesMilli: ' + startDateMilli + "   " + searchStartDateMilli + "   " + endDateMilli + "   " + searchEndDateMilli);
    // compare
    //if (searchStartDateMilli > searchEndDateMilli) return true

    // single ended case: SR date range 'includes' the From (searchStartdDate)
    if (!searchEndDate && ((searchStartDateMilli >= startDateMilli) && (searchStartDateMilli<=endDateMilli))) return true;
    else if (!searchEndDate) return false;

    // Double ended: SR range overlaps with the From - To Range
    if ( (searchStartDateMilli<startDateMilli) && (searchEndDateMilli<startDateMilli) ) return false;
    if ( (searchStartDateMilli>endDateMilli) && (searchEndDateMilli>endDateMilli) ) return false;


    return true; 
    /*
    return (((searchStartDateMilli >= startDateMilli) && (searchStartDateMilli <= endDateMilli)) ||
      ((searchEndDateMilli >= startDateMilli) && (searchEndDateMilli <= endDateMilli)))
    */

  }


  filterFunc(searchExpression, value, filter, user, seasons, city, onlyShowMine, onlyShowMineCompany) {
    // pressHouse

    var searchVal = true;
    var filterVal = true;
    var filterCityVal = true;

    //this.closeExpanded ();

    // filter on overall onlyShowOurRequests
    if (onlyShowMine) {
      if (value.approvingUserCompany) {
        //console.log("Filtering on onlyShowMine, this user company:" + onlyShowMineCompany + " approvingUser company: " + value.approvingUserCompany);
        if (value.approvingUserCompany !== onlyShowMineCompany) return false;
        // else console.log("Ok to continue filter checks");
      }
      // else console.log("Filtering on onlyShowMine, this user company:" + onlyShowMineCompany + " but not approved or no approvingUsercompany set, id:" + value.id);
      // OK to proceed for now as no approval given, still visible to PR and brand
    }
    // else console.log("NO filtering on onlyShowMine, onlyshowmine:" + onlyShowMine);

    // if no other filters then OK
    if (searchExpression == '' && filter == '' && city == '') return true;
    var itemValue = '';
    if (value.pressHouse) itemValue = value.pressHouse.name;
    if (value.brand) itemValue = itemValue + ' ' + value.brand.name;
    if (value.prAgency) itemValue = itemValue + ' ' + value.prAgency.name;
    if ((value.deliverTo) && value.deliverTo.pressHouse) itemValue = itemValue + ' ' + value.deliverTo.pressHouse.name;
    if ((value.deliverTo) && value.deliverTo.brand) itemValue = itemValue + ' ' + value.deliverTo.brand.name;
    if ((value.deliverTo) && value.deliverTo.prAgency) itemValue = itemValue + ' ' + value.deliverTo.prAgency.name;
    if (value.requestingUser) itemValue = itemValue + ' ' + value.requestingUser.name + ' ' + value.requestingUser.surname;
    if (value.returnToName) itemValue = itemValue + ' ' + value.returnToName;
    if (value.returnToSurname) itemValue = itemValue + ' ' + value.returnToSurname;
    if (value.addressDestination) itemValue = itemValue + ' ' + value.addressDestination.name;
    if (value.id) itemValue = itemValue + ' ' + value.id;
    // Get season abbreviation
    var i;
    var abbrev = '';
    for (i = 0; i < seasons.length; i++) {
      if (seasons[i].name == value.season) {
        abbrev = seasons[i].abbreviation;
      }
    }
    // Add <abbrev>.<look> to search list
    if (value.look && abbrev == '') itemValue = itemValue + ' ' + value.look;//RM check added to index small request man
    if (value.look && abbrev != '') itemValue = itemValue + ' ' + abbrev  + '.' + value.look;//RM check added to index small request man

    // Add clients sample id's to search list
    if (value.searchableItems) {
      var i;
      for (i = 0; i < value.searchableItems.length; i++)
        itemValue = itemValue + ' ' + value.searchableItems[i].clientID;
    }


    // filter on city
    if (city)
        if (city!="All" && city!="Select" && city!="ALL" && city!="SELECT") {
            console.log("City filtering on: " + city);
            // get city of request
            var requestCity = value.searchableItems[0].sampleCity.name; // user first ssample location
            console.log("city of request: " + requestCity);
            filterCityVal = (requestCity == city);
        }


    //console.log("Search value: " + itemValue);
    if (searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;

    if (filter == 'MY REQUESTS') {
      filterVal = (value.requestingUser.id == user.id);
    }
    if (filter == 'OVERDUE REQUESTS') {
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
    //console.log(" filterfunc return value: " +  searchVal + " " + filterVal + " :: " + (searchVal && filterVal));
    return (searchVal && filterVal && filterCityVal);
  }

  filterChangeCityRM(event) {
        this.closeExpanded();
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    this.cityFiltering = event.detail.value;
                    //console.log("filter value:" + event.detail.value + " city filtering: " + this.cityFiltering);
                }
    }

  closeExpanded() {
    if (this.closed) return;
    var buttonChoice = document.getElementById("button" + this.opened);
    var panelChoice = document.getElementById("panel" + this.opened);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");
    this.brand = '';
    this.image = '';
    this.season = '';
    this.look = '';
    this.closed = true;
    this.opened = '';
  }

  closeSampleRequestMenu() { }


  /* RM accordion expansion button */
  closeExpand(buttonNumber, sampleRequest) {
    console.log("Close Expand");
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");
    if (this.closed && sampleRequest) {
      this.brand = sampleRequest.brand.name;
      this.image = sampleRequest.image;
      this.season = sampleRequest.season;
      this.look = sampleRequest.look;
      this.closed = false;
      this.opened = buttonNumber; 
      panelChoice.scrollIntoViewIfNeeded();
    }
    else {
      if (this.opened != buttonNumber) {
        var buttonChoiceC = document.getElementById("button" + this.opened);
        var panelChoiceC = document.getElementById("panel" + this.opened);
        buttonChoiceC.classList.toggle("active");
        panelChoiceC.classList.toggle("show");
        this.brand = sampleRequest.brand.name;
        this.image = sampleRequest.image;
        this.season = sampleRequest.season;
        this.look = sampleRequest.look;
        this.closed = false;
        this.opened = buttonNumber;
        panelChoice.scrollIntoViewIfNeeded();
      }
      else {
        this.brand = '';
        this.image = '';
        this.season = '';
        this.look = '';
        this.closed = true;
        this.opened = '';
      }
    }
  }

  alertP(message) {
    this.dialogService.open({ viewModel: CreateDialogAlert, model: { title: "Booking", message: message, timeout: 5000 }, lock: false }).then(response => { });
  }

  /*
   *  Listen on channel for press or brand name
   *  for the current user, then reload bookings.
   * 
  */
  listenForBookingsCacheInvalidation(pubNub) {
    console.log("listen for bookings cache invalidate - requestman.js");

    let company = this.user.company;
    let channel = company + '_cacheInvalidate';
    console.log("listening on cache channel in requestman:" + channel);
    let bookingsToUpdate = this.bookings;
    let sampleRequestService = this.sampleRequestService;

    var requestmanListener = {
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
          toastr.options.preventDuplicates = false;
          toastr.options.closeButton = true;
          toastr.options.timeOut = 0;
          toastr.info('Request ' + message.message + " updated");
        }
      }
    }
    pubNub.addListener(requestmanListener);
    this.pubNubService.addRequestmanListener(requestmanListener);
    pubNub.subscribe({
      channels: [channel],
      withPresence: false
    })
  }

  unbind() {
    console.log("UNBIND requestman ******* ")
    this.pubNubService.removeRequestmanListener();
  }

  editSampleRequest(itemId) {
    this.closeSampleRequestMenu(itemId);
    this.dialogService.open({ viewModel: EditSampleRequest, model: itemId, lock: true })
      .then(response => {

      });
  }


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

  delete(id) {
    console.log("delete hack");
    var someNewArray = [];
    this.bookings;

    for (var i = 0, length = this.bookings.length; i < length; i++) {
      var abooking = this.bookings.pop();
      someNewArray.push(abooking);
    }
    for (var i = 0, len = someNewArray.length; i < len; i++) {
      var transfer = someNewArray.pop();
      if (transfer.id != id) {
        this.bookings.push(transfer);
      }
    }

  }

  deleteSampleRequest(index, id) {
    this.image = '';
    if (this.open)
      this.closeExpand(index, null);
    console.log("push/pop hacking delete");
    this.delete(id);

    this.sampleRequestService.deleteSampleRequest(id).then(message => {
    });
    this.closeExpanded();
  }


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


  lookEditMenu(id) {
    var menu = document.getElementById("requestManTest" + id);
    menu.classList.toggle("look-menu-show");
    //menu.scrollIntoView({block: "end", behavior: "smooth"});
    menu.scrollIntoViewIfNeeded();
  }


}