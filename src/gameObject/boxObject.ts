/// <reference path="./gameObject.ts" />

class BoxObject extends GameObject implements Observer {
  public id: number;
  public light: THREE.PointLight;

  constructor(
    x: number,
    y: number,
    z: number,
    id: number,
    light: boolean,
    level: Level
  ) {
    super(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ color: new THREE.Color('grey') }),
      new THREE.Vector3(x, y, z)
    );
    if (light) {
      const n = Math.floor(Math.random() * 3);
      switch (n) {
        case 0:
          // TODO: minder distance bij meer difficult
          this.light = new THREE.PointLight(0xff0000, 1, 30, 2);
          break;
        case 1:
          this.light = new THREE.PointLight(0x00ff00, 1, 30, 2);
          break;
        case 2:
          this.light = new THREE.PointLight(0x0000ff, 1, 30, 2);
          break;
      }
      this.light.position.x = this.position.x;
      this.light.position.y = this.position.y;
      this.light.position.z = this.position.z + 2;
      level.subscribe(this);
      Game.getInstance().scene.add(this.light);
    }
    this.id = id;
  }

  public notify(distance: number): void {
    this.light.distance = distance;
  }
}
