export class busy {
  active:number = 0;
  on() { this.active = -1; }
  off() { this.active = 0; }
}