/// <reference path="./boxObject.ts" />

class BoxObjectWithLight extends BoxObject implements Observer {
  constructor(x: number, y: number, z: number, id: number, level: Level) {
    super(x, y, z, id, true, level);
  }

  public notify(distance: number): void {
    this.light.distance = distance;
  }
}
