import moment from 'moment';

export class ViewDateFormatValueConverter {
  toView(value) {
    if(value) {
        // two methods here 
        // (1) for abs dates, coming in with 2017-05-24T00:00:00Z format
        // (2) coming in with 27-Jun-2017 format (date picker)

        if (value.length == 20) {
            // (1) 2017-05-24T00:00:00Z
        	// doing by hand to get around timezone, as want absolute value of the date string, regardless of where it was booked and where you are now
        	// "2017-06-12"
        	var monthNames = [
        		"Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        	var year = value.substring(0,4);
        	var month = parseInt(value.substring(5,7)) - 1;
        	var day = value.substring(8,10);
        	var newString = day + "-" + monthNames[month] + "-" + year;
        	console.log ("ViewDateFormatValueConverter value-in:" + value + " reformat abs date:" + newString + " old return:" + moment(value).format('DD-MMM-YYYY'));
        	return newString;
        }
        // (2) coming in with 27-Jun-2017 format (date picker)
        else return moment(value).format('DD-MMM-YYYY');
    }
  }
}