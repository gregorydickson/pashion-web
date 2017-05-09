export class SeasonAbbreviationIdValueConverter {
  toView(value, seasons) {

        var i;
        if(seasons){
	        for (i = 0; i < seasons.length; i++) {
	            if (seasons[i].id == value) {
	                return seasons[i].abbreviation;
	            }
	        }
        	return '';
        }else {
        	return '';
        }
  }
}