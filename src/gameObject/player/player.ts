class Player extends GameObject {
  public velocityY: number = -0.01;

  constructor(x: number, y: number, z: number) {
    super(
      Resources.getInstance().getFont('robotoItalic').geometry,
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
      new THREE.Vector3(x, y, z)
    );
  }
}
