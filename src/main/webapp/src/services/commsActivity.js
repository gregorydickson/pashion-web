export class CommsActivity {
  active:boolean = false;
  activity() { this.active = true; }
  noActivity() { this.active = false; }
}