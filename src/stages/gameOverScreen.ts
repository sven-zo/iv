class GameOverScreen implements Stage {
  private _game: Game;

  constructor() {
    this._game = Game.getInstance();
    this._game.scene = new THREE.Scene();
    this._game.camera = new THREE.PerspectiveCamera(
      75,
      this._game.rendererWidth / this._game.rendererHeight,
      0.1,
      1000
    );
    this._game.scene.background = new THREE.Color('red');
  }

  update() {}
}
