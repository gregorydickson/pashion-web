import moment from 'moment'
 
export class DateTimeFormatValueConverter{

  fromView(value) {
  	console.warn('to', value);
    if(value)
    	return moment(value).format('YYYY-MM-DD hh:mm');
  }
  
  
}