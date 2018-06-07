/// <reference path="./gameObject.ts" />

class BoxObject extends GameObject {
  public id: number;

  constructor(x: number, y: number, z: number, id: number) {
    super(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('grey') }),
      new THREE.Vector3(x, y, z)
    );
    this.id = id;
  }
}
