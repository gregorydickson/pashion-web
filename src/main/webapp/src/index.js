export class Index {

closeExpand(buttonNumber) {
  var buttonChoice = document.getElementById("button" + buttonNumber);
  var panelChoice = document.getElementById("panel" + buttonNumber);
  buttonChoice.classList.toggle("active");
  panelChoice.classList.toggle("show");
}

}