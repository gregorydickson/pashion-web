import {bindable, inject,bindingMode, customElement} from 'aurelia-framework';

// Import JSPM modules we installed earlier
import $ from 'jquery';
import 'select2';


@customElement('form-select') // Define the name of our custom element
@inject(Element) // Inject the instance of this element
export class CustomSelect {
    @bindable name = null;    // name/id of custom select
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler:'sampleChanged'})  selected = '';  // default selected values
    @bindable options = {};   // array of options with id/name properties
    @bindable placeholder = "";
    @bindable allow_clear = false;

    constructor(element) {
        this.element = element;
    }

    sampleChanged(){
      console.log("sampleChanged");
      console.log(JSON.stringify(this.selected));
      if(this.selected){
        var el = $(this.element).find('select');
        var sel = el.select2();
        sel.val(this.selected).trigger('change');
      }
      console.log("selected");
    }

    // Once the Custom Element has its DOM instantiated and ready for binding
    // to happenings within the DOM itself
    attached() {
        var el = $(this.element).find('select');
        var sel = el.select2({minimumResultsForSearch: 15 // only allow terms up to n characters long
                        });

        // preload selected values
        sel.val(this.selected).trigger('change');

        // on any change, propagate it to underlying select to trigger two-way bind
        sel.on('change', (event) => {
          // don't propagate endlessly
          // see: http://stackoverflow.com/a/34121891/4354884
          if (event.originalEvent) { return; }
          // dispatch to raw select within the custom element
          // bubble it up to allow change handler on custom element
          var notice = new Event('change', {bubbles: true});
          $(el)[0].dispatchEvent(notice);
        });

        console.log("*****************   select2 attached ***********************");
    }

    detached() {
        $(this.element).find('select').select2('destroy');
        console.log("select2 detached");
    }
}