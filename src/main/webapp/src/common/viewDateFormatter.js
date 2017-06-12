import moment from 'moment';

export class ViewDateFormatValueConverter {
  toView(value) {
    if(value) {
    	// doing by hand to get around timezone, as want absolute value of the date string, regardless of where it was booked and where you are now
    	// "2017-06-12"
    	var monthNames = [
    		"Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    	var year = value.substring(0,4);
    	var month = parseInt(value.substring(5,7)) - 1;
    	var day = value.substring(8,10);
    	var newString = day + "-" + monthNames[month] + "-" + year;
    	//console.log ("ViewDateFormatValueConverter value-in:" + value + " reformat abs date:" + newString + " old return:" + moment(value).format('DD-MMM-YYYY'));
    	return newString;
    	//return moment(value).format('DD-MMM-YYYY');
    }
  }
}