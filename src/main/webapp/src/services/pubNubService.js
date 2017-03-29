import { singleton } from 'aurelia-framework';


@singleton()
export class PubNubService {

    pubnub = null;
    
    constructor(){   
      this.pubnub = new PubNub({
          subscribeKey: "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe",
          publishKey: "pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73",
          ssl: true
      });


    }

    getPubNub() {
        return this.pubnub;
    }



}
