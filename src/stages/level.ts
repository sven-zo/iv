class Level implements Stage, Subject {
  private _game: Game;
  private _level: BoxObject[] = [];
  private _resources: Resources;
  private _player: Player;
  private _debugMode: boolean;
  private _chunkDistance: number = 0;
  private _ids: number = 0;
  private _lightBlocksPerChunk: number = 0;
  private _observers: Observer[] = [];
  private _scoreElem: HTMLDivElement;
  private _scoreSubElem: HTMLDivElement;
  private _audioListener: THREE.AudioListener;
  private _audio: THREE.Audio;
  private _lightStrength: number = 1;

  constructor() {
    this._game = Game.getInstance();
    this._resources = Resources.getInstance();
    this._debugMode = this._game.debugMode;

    this._scoreElem = document.getElementById('score-score') as HTMLDivElement;
    this._scoreSubElem = document.getElementById('score-sub') as HTMLDivElement;

    this._setUpScene();
    this._setUpFirstChunk();
  }

  private _setUpFirstChunk() {
    this._player = new Player(0, 0, 1);
    this._chunkDistance = 19;

    for (let i = -10; i < 21; i++) {
      this._ids++;
      this._level.push(new BoxObject(i, -6, 1, this._ids, false, this));
      this._ids++;
      this._level.push(new BoxObject(i, 6, 1, this._ids, false, this));
    }

    // Sync camera position
    this._syncCameraAndPlayerPosition();
    console.log('Camera position:', this._game.camera.position);
    console.log('Game scene:', this._game.scene);
  }

  private _setUpScene() {
    this._game.scene = new THREE.Scene();
    this._game.scene.background = new THREE.Color('black');
    this._game.camera = new THREE.PerspectiveCamera(
      75,
      this._game.rendererWidth / this._game.rendererHeight,
      0.1,
      1000
    );
    this._game.camera.position.z = 10;
    this._audioListener = new THREE.AudioListener();
    this._game.camera.add(this._audioListener);
    this._audio = new THREE.Audio(this._audioListener);
    this._audio.setLoop(true);
    this._audio.setBuffer(this._resources.getMusic('mainMenu').audio);
    this._game.scene.add(this._audio);
    this._audio.play();

    if (this._debugMode) {
      const axesHelper = new THREE.AxesHelper(5);
      this._game.scene.add(axesHelper);
    }
  }

  private _syncCameraAndPlayerPosition(): void {
    this._game.camera.position.x = this._player.position.x;
    this._game.camera.position.y = 0;
  }

  private _removeOldChunks() {
    this._level.filter(box => box.position.x < this._player.position.x + 20);
    this._level.forEach(box => {
      if (box.position.x < this._player.position.x - 20) {
        const boxRef = box.id;
        this.unsubscribe(box);
        this._game.scene.remove(box.light);
        box.remove();
        this._level = this._level.filter(b => b.id !== boxRef);
      }
    });
  }

  private _notifyLightBlocks(distance: number) {
    this._observers.forEach(o => {
      o.notify(distance);
    });
  }

  private _updateScoreAndDifficulty() {
    this._scoreElem.innerText = Math.floor(this._player.position.x).toString();
    this._scoreSubElem.innerText = '';
    if (this._player.position.x > 0 && this._player.position.x < 15) {
      this._scoreSubElem.innerText = "Don't fail.";
    }
    if (this._player.position.x > 300 && this._player.position.x < 315) {
      this._scoreSubElem.innerText = 'Lights out.';
    }
    if (this._player.position.x > 600 && this._player.position.x < 615) {
      this._scoreSubElem.innerText = "Let's go faster.";
      this._player.speed = 0.13;
      // TODO: laat score even snel optellen als eerst
      // waarschijnlijk door te delen door 1/0.13
    }
  }

  public update(): void {
    this._syncCameraAndPlayerPosition();
    this._removeOldChunks();
    this._chunkDistance = this._chunkDistance + this._player.speed;
    if (this._chunkDistance > 20) {
      // TODO: minder lichten bij meer difficult
      this._lightBlocksPerChunk = 5;
      this._chunkDistance = 0;
      const chunk = LevelGenerator.generateChunk(this._player.position.x + 20);
      chunk.forEach(b => {
        this._ids++;
        let light = false;
        if (this._lightBlocksPerChunk > 0) {
          light = Math.random() < 0.04 ? true : false;
          if (light) {
            this._lightBlocksPerChunk--;
          }
        }
        let box: BoxObject;
        if (light) {
          box = new BoxObjectWithLight(b.x, b.y, b.z, this._ids, this);
        } else {
          box = new BoxObjectWithoutLight(b.x, b.y, b.z, this._ids, this);
        }
        this._level.push(box);
      });
    }
    this._player.update();
    this._collide();
    this._updateScoreAndDifficulty();
    if (this._lightStrength < 0.05) {
      this._lightStrength = -1;
      this._notifyLightBlocks(0.1);
    } else {
      this._lightStrength = 40 - this._player.position.x / 9;
      this._notifyLightBlocks(this._lightStrength);
    }
  }

  private _gameOver() {
    this._audio.pause();
    this._game.stage = new GameOverScreen();
  }

  private _collide() {
    const playerBoundingBox = this._player.boundingBox;
    this._level.forEach(box => {
      box.update();
      const boxBoundingBox = box.boundingBox;
      if (playerBoundingBox.intersectsBox(boxBoundingBox)) {
        this._gameOver();
      }
    });
  }

  public subscribe(observer: Observer) {
    this._observers.push(observer);
  }

  public unsubscribe(observer: Observer) {
    this._observers = this._observers.filter(o => o !== observer);
  }
}
