// general class to put reusable code

export class Helpers {

    // used to dispatch events
    dispatchEvent(element, eventName, eventModel) {
        let callbackEvent;

        if (window.CustomEvent) {
            callbackEvent = new CustomEvent(eventName, {
                detail: {
                    value: eventModel
                },
                bubbles: true
            });
        } else {
            callbackEvent = document.createEvent('CustomEvent');
            callbackEvent.initCustomEvent(eventName, true, true, {
                detail: {
                    value: eventModel
                }
            });
        }

        element.dispatchEvent(callbackEvent);
    }

    // returns true if empy object
    isEmptyObject(obj){
        return ((Object.keys(obj).length === 0 && obj.constructor === Object) ? true : false)
    }
}