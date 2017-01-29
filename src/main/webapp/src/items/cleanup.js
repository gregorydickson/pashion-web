export class CleanupValueConverter {
    toView(value) {
    	if (!value) return;
    	if (value==undefined) return;
    	if (value=='') return;
  		var uniqueList=value.split(' ').filter(function(item,i,allItems){
    		return i==allItems.indexOf(item);
			}).join(' ');

        return uniqueList;
    }
}