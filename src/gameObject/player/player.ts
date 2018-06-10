class Player extends GameObject {
  public speed: number = 0.1;
  private _light: THREE.PointLight;

  constructor(x: number, y: number, z: number) {
    super(
      Resources.getInstance().getFont('robotoItalic').geometry,
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      new THREE.Vector3(x, y, z)
    );

    document.addEventListener('keydown', this._keydownHandler.bind(this));
    document.addEventListener('mousemove', this._mouseHandler.bind(this));
    this._light = new THREE.PointLight(0xffffff, 1, 100, 2);
    Game.getInstance().scene.add(this._light);
  }

  private _mouseHandler(event: MouseEvent) {
    this.position.y = -(event.clientY / window.innerHeight) * 10 + 5;
  }

  private _keydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.position.y = this.position.y + this.speed * 2;
        break;
      case 'ArrowDown':
        this.position.y = this.position.y - this.speed * 2;
        break;
    }
  }

  public get boundingBox(): THREE.Box3 {
    return this._boundingBox;
  }

  public update() {
    super.update();
    this.position.x = this.position.x + this.speed;
    this._light.position.x = this.position.x;
    this._light.position.y = this.position.y;
    this._light.position.z = this.position.z;
  }
}
