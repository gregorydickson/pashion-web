import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {Zoom} from './zoom/zoom';
import {UserService} from './services/userService';
import {busy} from './services/busy';
import {IntroductionGuest} from './hello/introductionGuest';
import {NagGuest} from './hello/nagGuest';


@inject(HttpClient,  DialogService, busy, UserService)
export class Guestpage {
 
  rows = [];
  results = 0;
  
  selectedBrand = 'All';
  selectedSeason = '';
  selectedTheme = '';
  searchText = '';
  maxR = 250;
  busy;
  
  

// kinda the master filter change, as the others theme and season require different semantics
// on all and selected
  filterChangeBrand(){
    if (event)if (event.detail)if(event.detail.value)if(event.detail.value==this.selectedBrand)return
    this.busy.on();
    console.log("Filter Change changing Brand");
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedBrand = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Brand: " + this.selectedBrand);
    this.results = 0;
    this.http.fetch('/searchableItem/browseSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme +
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            this.rows = rows;
            this.busy.off();
            if (rows.length >0) {
              this.results = (rows.length -1) * rows[0].numberImagesThisRow;
              this.results += rows[rows.length-1].numberImagesThisRow;
            }
          })

         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top
          ;
  }

  filterChangeSeason(){
    if (event)if (event.detail)if(event.detail.value)if(event.detail.value==this.selectedSeason)return
    this.busy.on();
    console.log("Filter Change changing Season");
    this.selectedSeason = '';
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedSeason = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Season: " + this.selectedSeason);
    this.results = 0;
    this.http.fetch('/searchableItem/browseSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                     '&season=' + encodeURI(this.selectedSeason) + 
                                     // '&season=' + this.selectedSeason + 
                                      '&theme='+ this.selectedTheme + 
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            this.rows = rows;
            this.busy.off();
            if (rows.length >0) {
              this.results = (rows.length -1) * rows[0].numberImagesThisRow;
              this.results += rows[rows.length-1].numberImagesThisRow;
            }
          })

         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top
          ;
  }

    filterChangeTheme(){
    if (event)if (event.detail)if(event.detail.value)if(event.detail.value==this.selectedTheme)return
    this.busy.on();
    console.log("Filter Change changing Theme");
    this.selectedTheme = '';
    if(event)
      if(event.detail)
        if(event.detail.value){
          if(event.detail.value=='All') event.detail.value = '';
          if(event.detail.value=='Select') event.detail.value = '';

          this.selectedTheme = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Theme: " + this.selectedTheme);
    this.results = 0;
    this.http.fetch('/searchableItem/browseSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                     '&season=' + encodeURI(this.selectedSeason) + 
                                     // '&season=' + this.selectedSeason + 
                                      '&theme='+ this.selectedTheme +
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            this.rows = rows;
            this.busy.off();
            if (rows.length >0) {
              this.results = (rows.length -1) * rows[0].numberImagesThisRow;
              this.results += rows[rows.length-1].numberImagesThisRow;
            }
          })

         .then (result => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top
          ;
  }


  constructor(http,dialogService,busy, userService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    this.busy = busy;
    this.userService = userService;

  }


  attached(){
    this.filterChangeBrand();

    var parent = this;
    $('input[type=search]').on('search', function () {
    // search logic here
    // this function will be executed on click of X (clear button)
      parent.filterChangeBrand(event)
    });


    let show = this.userService.show();
    if(show){
      // this.dialogService.open({viewModel: IntroductionGuest, model: "no-op" }).then(response => {
      this.dialogService.open({viewModel: NagGuest, model: "no-op" }).then(response => {
        this.userService.introShown();
      });
    }

  }

  detached() {
  }

  submitSearch () {
    //console.log("submitSearch");
    this.filterChangeBrand(event);
  }

  createZoomDialog(item,rowNumber,itemNumber) {
    console.log("item number :"+itemNumber);
    console.log("item  :"+item);
    let menu = document.getElementById("card-"+item.id);
    
    menu.classList.toggle("blue-image");
    let zoomModel = {};
    zoomModel.item = item;
    zoomModel.rows = this.rows;
    zoomModel.itemNumber = itemNumber;
    zoomModel.rowNumber = rowNumber;
    this.dialogService.open({viewModel: Zoom, model: zoomModel })
      .then(response => {
        menu.classList.toggle("blue-image");
      });
  }

}


