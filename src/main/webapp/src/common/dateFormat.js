

export class DateFormat {
	static urlString(offset){
		var d = new Date();

    	return "?year=" + d.getFullYear() + 
        	"&month=" + (d.getMonth()+1) + "&day=" +
         	d.getDate() + "&offset=" + offset;
	}

	
}