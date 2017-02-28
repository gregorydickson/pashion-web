import moment from 'moment'
 
export class DateTimeFormatValueConverter{

  toView(value) {
  	console.warn('to', value);
    if(value)
    	return moment(value).format('M/D/YYYY h:mm:ss a');
  }
  
  
}