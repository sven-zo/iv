class Level implements Stage {
  private _game: Game;
  private _level: LevelCube[] = [];
  private _resources: Resources;
  private _player: Player;
  private _debugMode: boolean;
  private _physics: Physics;

  constructor() {
    this._game = Game.getInstance();
    this._resources = Resources.getInstance();
    this._debugMode = this._game.debugMode;

    this._setUpScene();
    this._setUpFirstChunk();
  }

  private _setUpFirstChunk() {
    // Add LevelCubes based on the generated Chunk
    const chunk = LevelGenerator.generateChunk(1, 1);
    chunk.forEach(slice => {
      let cube = new LevelCube(slice.x * 4, slice.y, slice.z, slice.length);
      this._level.push(cube);
    });
    // Add the player above first cube
    let cube = chunk[0];

    this._player = new Player(cube.x + 4, cube.y + 1, 1);
    console.log(this._player);
    // Sync camera position
    this._syncCameraAndPlayerPosition();
    this._physics = new Physics(this._level, this._player);
    // TODO: remove this
    const direction = new THREE.Vector3(0, -1, 0);
    const origin = this._player.position;
    const raycast = new THREE.Raycaster(origin, direction);
    Game.getInstance().scene.add(
      new THREE.ArrowHelper(
        raycast.ray.direction,
        raycast.ray.origin,
        1,
        0xff0000
      )
    );
    console.log(chunk);
    console.log(Game.getInstance().scene.children);
    console.log(
      raycast.intersectObjects(Game.getInstance().scene.children, true)
    );
  }

  private _setUpScene() {
    this._game.scene = new THREE.Scene();
    this._game.scene.background = new THREE.Color('white');
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
    this._game.camera.position.y = this._player.position.y;
    // TODO: remove this
    //this._game.camera.position.y = this._player.position.y + 10;
    //this._game.camera.rotation.x = 1;
    // this._game.camera.position.z = 200;
  }

  public update(): void {
    this._physics.calculate();
    this._syncCameraAndPlayerPosition();
    if (this._player.position.x > this._level.length * 4 - 40) {
      console.log('Generating new chunk!');
      const chunk = LevelGenerator.generateChunk(
        this._level[this._level.length - 1].position.x / 4,
        this._level[this._level.length - 1].position.y
      );
      chunk.forEach(slice => {
        let cube = new LevelCube(slice.x * 4, slice.y, slice.z, slice.length);
        this._level.push(cube);
      });
    }
    // if (this._player.position > (this._level.length * 4))
    // this._collisionChecker.collide(this._level, this._player);
    // this._syncCameraAndPlayerPosition();
  }
}
