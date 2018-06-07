class Player extends GameObject {
  public speed: number = 0.1;

  constructor(x: number, y: number, z: number) {
    super(
      Resources.getInstance().getFont('robotoItalic').geometry,
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
      new THREE.Vector3(x, y, z)
    );
  }

  public update() {
    this.position.x = this.position.x + this.speed;
  }
}
