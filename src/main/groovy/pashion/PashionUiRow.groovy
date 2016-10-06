package pashion

import pashion.SearchableItem
import groovy.transform.CompileStatic

@CompileStatic
class PashionUiRow{

	Integer numberImages
	SearchableItem item1
	SearchableItem item2
	SearchableItem item3
	SearchableItem item4
	SearchableItem item5

	public SearchableItem getItem1(){
		item1
	}
	public SearchableItem getItem2(){
		item2
	}
	public SearchableItem getItem3(){
		item3
	}
	public SearchableItem getItem4(){
		item4
	}
	public SearchableItem getItem5(){
		item5
	}
	public Integer getNumberImages(){
		numberImages
	}

	public void setItem1(SearchableItem item){
		item1 = item
	}
	public void setItem2(SearchableItem item){
		item2 = item
	}
	public void setItem3(SearchableItem item){
		item3 = item
	}
	public void setItem4(SearchableItem item){
		item4 = item
	}
	public void setItem5(SearchableItem item){
		item5 = item
	}
	public void setNumberImages(Integer number){
		numberImages = number
	}
	
	

}