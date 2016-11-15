export class busy {
  active:number = 0;
  on() { this.active++; }
  off() { this.active--; }
}