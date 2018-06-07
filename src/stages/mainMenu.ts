class MainMenu implements Stage {
  private _game: Game;

  constructor() {
    this._game = Game.getInstance();
    this._game.scene = new THREE.Scene();
    this._game.scene.background = new THREE.Color('white');
    this._game.camera = new THREE.PerspectiveCamera(
      75,
      this._game.rendererWidth / this._game.rendererHeight,
      0.1,
      1000
    );
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this._game.scene.add(cube);
    this._game.camera.position.z = 5;
  }

  update(): void {}
}
