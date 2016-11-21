import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class SampleRequestService{


  	constructor(http) {
  	    http.configure(config => {
  	      config
  	        .useStandardConfiguration();
  	    });
  	    this.http = http;
    }

    	
  	getSampleRequest(id){
  		var promise = new Promise((resolve, reject) => {
  		this.http.fetch('/sampleRequest/show/'+id+'.json')
    			.then(response => response.json())
    			.then(sampleRequest => {
    				
            sampleRequest.searchableItems.forEach(function(item1) {
              item1.status = sampleRequest.searchableItemsStatus.find(function (item2) {
                return item2.itemId === item1.id;
              });
            });
            this.sampleRequest = sampleRequest;
    				resolve( this.sampleRequest);
    			}).catch(err=>reject(err));
    		});

    	return promise;
        	
  	
  	}

  	getSampleRequests(searchText, status){
  		console.log("getting sample requests");
  		var promise = new Promise((resolve, reject) => {
  			
			this.http.fetch('/sampleRequest.json?searchtext='+ encodeURI(searchText) + 
                                      '&status=' + status)
      			.then(response => response.json())
      			.then(sampleRequests => {
      				this.sampleRequests = sampleRequests;
      				resolve(this.sampleRequests);
      			}).catch(err=>reject(err));
	      	
		  });
		  return promise;
  	}

    updateSampleRequest(sr){
      this.http.fetch('/sampleRequest/updatejson', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(result => {
              resolve(result);
          });
    }

  	saveSampleRequest(sr){
  		this.http.fetch('/sampleRequest/savejson', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(result => {
              resolve(result);
          });
  	}

    // START BRAND ACTIONS
    denySampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/deny/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    shipSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/ship/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }

    sendSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/send/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    markPickedUpSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/markPickedUp/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    markReturnedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/markReturned/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    restockedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/restocked/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    deleteSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/markDeleted/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }

    //Start PRESS ACTIONS
    //Press Functions
    pressMarkReceivedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressMarkReceived/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    pressShipSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressShip/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    pressMarkPickedUpSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressMarkPickedUp/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }
    pressDeleteSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressDelete/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }

  

    

}

