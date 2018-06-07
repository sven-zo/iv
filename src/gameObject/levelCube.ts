class LevelCube extends GameObject {
  private _debugPlane: THREE.Mesh;
  private _plane: THREE.PlaneGeometry;

  constructor(x: number, y: number, z: number, length: number) {
    super(
      new THREE.BoxGeometry(length, 1, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('grey') }),
      new THREE.Vector3(x, y, z)
    );

    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(length, 1);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff000,
      side: THREE.DoubleSide
    });
    this._debugPlane = new THREE.Mesh(geometry, material);
    this._debugPlane.position.x = x;
    this._debugPlane.position.y = y + 0.5;
    this._debugPlane.position.z = z;
    this._debugPlane.rotateX(Math.PI / 2);
    Game.getInstance().scene.add(this._debugPlane);
  }

  get plane {
    return this._debugPlane;
  }
}
