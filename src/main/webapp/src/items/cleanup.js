export class CleanupValueConverter {
    toView(value) {
    	if (!value) return;
    	if (value==undefined) return;
    	if (value=='') return;
    	// remove ","
    	value = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        value = value.replace(/NEW/g, "");
        value = value.replace(/UNDEFINED/g, "");
        value = value.replace(/undefined/g, "");
    	// remve duplciates
  		var uniqueList=value.split(' ').filter(function(item,i,allItems){
    		return i==allItems.indexOf(item);
			}).join(' ');

        return uniqueList;
    }
}