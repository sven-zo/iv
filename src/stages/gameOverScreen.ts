class GameOverScreen implements Stage {
  private _game: Game;
  private _gameOverText: HTMLDivElement;
  private _audio: THREE.Audio;
  private _audioListener: THREE.AudioListener;

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

    this._audioListener = new THREE.AudioListener();
    this._audio = new THREE.Audio(this._audioListener);
    this._game.camera.add(this._audioListener);
    this._audio.setBuffer(Resources.getInstance().getMusic('death').audio);
    this._game.scene.add(this._audio);
    this._audio.play();

    this._gameOverText = document.getElementById(
      'gameover-text'
    ) as HTMLDivElement;
    const n = Math.floor(Math.random() * 3);
    switch (n) {
      case 0:
        this._gameOverText.innerText = 'Game over';
        break;
      case 1:
        this._gameOverText.innerText = 'Again!';
        break;
      case 2:
        this._gameOverText.innerText = 'DEAD';
        break;
    }

    this._restart();
  }

  private _restart() {
    setTimeout(() => {
      this._gameOverText.innerText = '';
      this._game.stage = new Level();
    }, 800);
  }

  update() {}
}
