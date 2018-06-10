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

  constructor() {
    this._game = Game.getInstance();
    this._resources = Resources.getInstance();
    this._debugMode = this._game.debugMode;

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
        //box.light.remove();
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
          // TODO: minder kans bij meer difficult
          light = Math.random() < 0.04 ? true : false;
          if (light) {
            this._lightBlocksPerChunk--;
          }
        }
        let box = new BoxObject(b.x, b.y, b.z, this._ids, light, this);
        this._level.push(box);
      });
    }
    this._player.update();
    this._notifyLightBlocks(Math.random() * 20);
  }

  public subscribe(observer: Observer) {
    this._observers.push(observer);
  }

  public unsubscribe(observer: Observer) {
    this._observers = this._observers.filter(o => o !== observer);
  }
}
