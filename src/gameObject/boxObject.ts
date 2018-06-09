/// <reference path="./gameObject.ts" />

class BoxObject extends GameObject {
  public id: number;
  private _light: THREE.PointLight;

  constructor(x: number, y: number, z: number, id: number, light: boolean) {
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
          this._light = new THREE.PointLight(0xff0000, 1, 30, 2);
          break;
        case 1:
          this._light = new THREE.PointLight(0x00ff00, 1, 30, 2);
          break;
        case 2:
          this._light = new THREE.PointLight(0x0000ff, 1, 30, 2);
          break;
      }
      this._light.position.x = this.position.x;
      this._light.position.y = this.position.y;
      this._light.position.z = this.position.z + 2;
      Game.getInstance().scene.add(this._light);
      // TODO: delete old lamps
    }
    this.id = id;
  }
}
