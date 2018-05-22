class MainMenu implements Stage {
  // private game: Game = Game.getInstance();
  private game: Game;

  constructor() {
    this.game = Game.getInstance();
    // this.game = Game.getInstance();
    this.game.scene = new THREE.Scene();
    this.game.scene.background = new THREE.Color('white');
    this.game.camera = new THREE.PerspectiveCamera(
      75,
      this.game.rendererWidth / this.game.rendererHeight,
      0.1,
      1000
    );
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.game.scene.add(cube);
    this.game.camera.position.z = 5;
  }

  update(): void {}
}
