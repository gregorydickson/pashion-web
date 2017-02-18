import {bindable, inject,bindingMode, customElement} from 'aurelia-framework';

// Import JSPM modules we installed earlier
import $ from 'jquery';
import 'select2';


@customElement('form-select') // Define the name of our custom element
@inject(Element) // Inject the instance of this element
export class CustomSelect {
    @bindable name = null;    // name/id of custom select
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler:'sampleChanged'})  selected = '';  // default selected values
    //@bindable({ defaultBindingMode: bindingMode.twoWay})  selected = '';  // default selected values
    //@bindable selected = '';
    @bindable options = {};   // array of options with id/name properties
    @bindable placeholder = "";
    @bindable allow_clear = false;

    constructor(element) {
        this.element = element;
    }

    sampleChanged(){
     console.log(this.name + " sampleChanged called: " + this.selected);
      
      if(this.selected 
         // && this.selected != "Select"
        ){
        var el = $(this.element).find('select');
        var sel = el.select2();
        sel.val(this.selected).trigger('change');
      }
    }

    // Once the Custom Element has its DOM instantiated and ready for binding
    // to happenings within the DOM itself
    attached() {
        var el = $(this.element).find('select');
        var sel = el.select2({minimumResultsForSearch: 15 // only allow terms up to n characters long
                        });

          //preload selected values
          console.log(this.name + " attached: " + this.selected);
          sel.val(this.selected).trigger('change');
        

        // on any change, propagate it to underlying select to trigger two-way bind
        sel.on('change', (event) => {
          console.log(this.name + " propagate event, original: " + event.originalEvent + " " + event.val);
          if (event.originalEvent) { return; }
          // this.selected = event.val;
          // don't propagate endlessly
          // see: http://stackoverflow.com/a/34121891/4354884
          
          // dispatch to raw select within the custom element
          // bubble it up to allow change handler on custom element
          //var notice = new Event('change', {bubbles: true});
          //$(el)[0].dispatchEvent(notice);
        });

        console.log( this.name + " select2 attached ***********************");
    }

    detached() {
        $(this.element).find('select').select2('destroy');
        console.log("select2 detached");
    }
}