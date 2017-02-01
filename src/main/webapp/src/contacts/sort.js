export class SortValueConverter {
  toView(array, propertyName, direction) {
    var factor = direction === 'ascending' ? 1 : -1;

    if (!typeof(array)) return array;
    if (array==undefined) return array;
    if (array=='') return array;

    try {
	    return array
	      .slice(0)
	      .sort(function (a, b) {return a[propertyName].localeCompare(b[propertyName]) * factor });
	     } catch (err) {
	     	// numeric 
	     	var outsideReturnVal = array
	      .slice(0)
	      .sort(function (a, b) {
	      	var returnVal = a[propertyName] - b[propertyName] * factor ;
	      	//console.log("a: " + a[propertyName] + " b: " + b[propertyName] + " > " + (a[propertyName] - b[propertyName])  + " return: " + returnVal);
	      	return returnVal });

	      //console.log("Return Val: " + outsideReturnVal );
	      return outsideReturnVal;
	     }

  }
}