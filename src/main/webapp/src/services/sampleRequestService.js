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
    sampleRequest = null;
    sampleRequestStatus = 'none';

    

    getCurrentSampleRequest(){
      if(this.sampleRequest){
        return this.sampleRequest;
      } else {
        return this.startSampleRequest();
      }

    }

    stopPicking () {
      this.sampleRequest = null;
      this.sampleRequestStatus = 'none';
    }
    
    cancelCurrentSampleRequest(){
      if(this.sampleRequest.id){
        //TODO: delete on server
      }
      this.sampleRequest = null;
      this.sampleRequestStatus = 'none';
    }

    startSampleRequest(){
      this.sampleRequestStatus = 'created';
      this.sampleRequest = {};
      this.sampleRequest.searchableItemsProposed = [];
      this.sampleRequest.courierOut = "Pashion Courier";
      this.sampleRequest.courierReturn = "Pashion Courier";
      this.sampleRequest.returnBy = "Afternoon";
      this.sampleRequest.paymentOut = "50/50";
      this.sampleRequest.paymentReturn = "50/50";
      this.sampleRequest.requiredBy = "12:00";

      this.sampleRequest.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequest.startMonth = '';
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
      this.sampleRequest.startOffset = 0;
      this.sampleRequest.endOffset = 0;
      return this.sampleRequest;
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
            this.sampleRequest = this.collectStatus(sampleRequest);
    				resolve( this.sampleRequest);
    			}).catch(err=>reject(err));
    		});
    	return promise;
  	}

  	getSampleRequests(reload,searchText, status){
  		console.log("getting sample requests");
  		var promise = new Promise((resolve, reject) => {
    		if(reload || !(this.sampleRequests)){
    			this.http.fetch('/sampleRequest.json?searchtext='+ encodeURI(searchText) + '&status=' + status)
      			.then(response => response.json())
      			.then(sampleRequests => {
              if(sampleRequests.session == 'invalid'){
                window.location.href = '/user/login';
                return;
              }
              sampleRequests.forEach(function(sampleRequest){
                sampleRequest.searchableItems.forEach(function(item1) {
                  item1.status = sampleRequest.searchableItemsStatus.find(function (item2) {
                    return item2.itemId === item1.id;
                  });
                });
              });
      				this.sampleRequests = sampleRequests;
      				resolve(this.sampleRequests);
      			}).catch(err=>reject(err));
        } else { 
          resolve(this.sampleRequests);
        }
  		});
		  return promise;
  	}

    updateSampleRequest(sr){
      if(sr === null)
        sr = this.sampleRequest;
      console.log("update sample request:");
      console.log(JSON.stringify(sr));
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/updatejson', {
            method: 'post',
            body: json(sr)
        })
          .then(response => response.json())
          .then(response =>{
            if(response.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            
            resolve(response.message);
          });
      });
      return promise;
    }

    saveTrolley(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/saveTrolley.json', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(trolley => {
              if(trolley.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              resolve(trolley);
          });

      });
      return promise;
    }

    submitTrolley(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/submitTrolley.json', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(trolley => {
              if(trolley.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              this.sampleRequest = trolley;
              resolve(trolley);
          });

      });
      return promise;
    }

    finishPicking(id){
      this.sampleRequest = null;
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/finishPicking/'+id+'.json', {
            method: 'get'
          })
          .then(response => response.json())
          .then(trolley => {
              if(trolley.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              resolve(trolley);
          });

      });
      return promise;
    }

    updateTrolley(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/sampleRequest/updateTrolley.json', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(trolley => {
              if(trolley.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              this.sampleRequest = trolley;
              resolve(trolley);
          });

      });
      return promise;
    }

  	saveSampleRequest(sr){
      var promise = new Promise((resolve, reject) => {
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
              
              resolve(result.message);
          });

      });
      return promise;
  	}

    collectStatus(sampleRequest){
      sampleRequest.searchableItemsProposed.forEach(function(item1) {
        item1.status = sampleRequest.searchableItemsStatus.find(function (item2) {
          return item2.itemId === item1.id;
        });
      });
      return sampleRequest;
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

    bookOutSampleRequest(sr){
      console.log("book out sample request");
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/stuart/bookOut', {
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

    bookReturnSampleRequest(sr){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/stuart/bookReturn', {
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


}

