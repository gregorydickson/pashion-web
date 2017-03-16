import moment from 'moment'

//RM I think this is decprecated. can't find anywhere it is used. Format is out of date. Should be DD-MMM-YYYY
 
export class DateTimeFormatValueConverter{

  fromView(value) {
  	console.warn('to', value);
    if(value)
    	return moment(value).format('YYYY-MM-DD hh:mm');
  }
  
  
}