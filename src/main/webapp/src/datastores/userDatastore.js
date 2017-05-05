import { inject, singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserService } from '../services/userService';

@inject(EventAggregator, UserService)
@singleton()
export class UserDatastore {
    user = null

    constructor(EventAggregator, UserService) {
        this.eventAggregator = EventAggregator;
        this.userService = UserService;
    }

    activate() {
        this.eventAggregator.subscribe('UserService.GetUser', payload => {
            this.user = payload;
        });

        return this.reloadData();
    }

    reloadData() {
        return this.userService.getUser();
    }

}