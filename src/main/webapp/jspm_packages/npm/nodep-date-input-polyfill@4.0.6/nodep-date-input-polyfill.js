/* */ 
"format cjs";
import './nodep-date-input-polyfill.scss';
import Picker from './picker.js';
import Input from './input.js';

// Run the above code on any <input type="date"> in the document, also on dynamically created ones.
// Check if type="date" is supported.
if(!Input.supportsDateInput()) {
  const init = ()=> {
    Picker.instance = new Picker();
    Input.addPickerToDateInputs();

    // This is also on mousedown event so it will capture new inputs that might
    // be added to the DOM dynamically.
    document.querySelector(`body`).addEventListener(`mousedown`, ()=> {
      Input.addPickerToDateInputs();
    });
  };

  let DOMContentLoaded = false;

  document.addEventListener(`DOMContentLoaded`, ()=> {
    DOMContentLoaded = true;

    init();
  });

  window.addEventListener(`load`, ()=> {
    if(!DOMContentLoaded) {
      init();
    }
  });
}
