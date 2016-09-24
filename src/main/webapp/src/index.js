export class Index {

closeExpand() {
  var buttonChoice = document.getElementById("button1");
  var panelChoice = document.getElementById("panel1");
  buttonChoice.classList.toggle("active");
  panelChoice.classList.toggle("show");
}

}