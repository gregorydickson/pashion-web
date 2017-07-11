export class FilterValueConverter {
  toView(array, searchTerm, filterFunc) {
	
	if (array == null) return null;
    return array.filter((item) => {
	
	  let matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm,item): true;
	  				
	  return matches;
    });
  }
}