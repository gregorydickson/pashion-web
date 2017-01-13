import {inject} from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
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
            if(sampleRequest.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            sampleRequest.searchableItemsProposed.forEach(function(item1) {
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
              if(sampleRequests.session == 'invalid'){
                window.location.href = '/user/login';
                return;
              }
      				this.sampleRequests = sampleRequests;
      				resolve(this.sampleRequests);
      			}).catch(err=>reject(err));
	      	
		  });
		  return promise;
  	}

    updateSampleRequest(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/updatejson', {
            method: 'post',
            body: json(sr)
        })
          .then(response => response.json())
          .then(result =>{
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }

  	saveSampleRequest(sr){
  		this.http.fetch('/sampleRequest/savejson', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(result => {
              if(result.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              resolve(result);
          });
  	}

    // START BRAND ACTIONS
    denySampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandDeny/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    approveSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandApprove/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    approveAndUpdateSampleRequest(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandApprove', {
            method: 'post',
            body: json(sr)
        })
          .then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    
    sendSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandSend/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    markPickedUpSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandMarkPickedUp/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    markReturnedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandMarkReturned/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    restockedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandRestocked/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    deleteSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/brandMarkDeleted/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }

    //Start PRESS ACTIONS
    //Press Functions
    pressMarkReceivedSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressMarkReceived/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    pressShipSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressShip/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    pressMarkPickedUpSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressMarkPickedUp/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }
    pressDeleteSampleRequest(id){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/pressDelete/'+id, {method: 'post'}).then(response => response.json())
          .then(result => {
            if(result.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            resolve(result);
          });
      });
      return promise;
    }

  

    

}

