class Player extends GameObject {
  public speed: number = 0.1;

  constructor(x: number, y: number, z: number) {
    super(
      Resources.getInstance().getFont('robotoItalic').geometry,
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
      new THREE.Vector3(x, y, z)
    );

    document.addEventListener('keydown', this._keydownHandler.bind(this));
    document.addEventListener('mousemove', this._mouseHandler.bind(this));
  }

  private _mouseHandler(event: MouseEvent) {
    console.log(event.clientY);
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

  public update() {
    this.position.x = this.position.x + this.speed;
  }
}
