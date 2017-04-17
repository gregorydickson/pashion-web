import {DialogService} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {LegalText} from './common/legalText';

@inject(DialogService)
export class Footer {

constructor(dialogService) {
    this.dialogService = dialogService;
  }

launchChat () {
	window.open("https://lc.chat/now/8474450/", "_blank", "toolbar=no,scrollbars=no,menubar=no,status=no,resizable=yes,top=500,left=500,width=300,height=300");
}

showLegal (){
	this.dialogService.open({viewModel: LegalText , lock:false})
}
    
}