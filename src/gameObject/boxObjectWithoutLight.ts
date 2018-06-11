class BoxObjectWithoutLight extends BoxObject implements Observer {
  constructor(x: number, y: number, z: number, id: number, level: Level) {
    super(x, y, z, id, false, level);
  }

  public notify(distance: number): void {
    this.light.distance = distance;
  }
}
