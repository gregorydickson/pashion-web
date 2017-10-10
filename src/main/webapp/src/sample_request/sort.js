export class SortValueConverter {
  toView(array, propertyName, direction) {
    var factor = direction === 'ascending' ? 1 : -1;
    if(array){
    	return array
      		.slice(0)
     		// .sort((a, b) => {
     		//   return (a[propertyName] - b[propertyName]) * factor
      		.sort(function (a, b) {return (a[propertyName] > b[propertyName]) * factor });
      		//});
    }else {
    	return array
    }
  }
}