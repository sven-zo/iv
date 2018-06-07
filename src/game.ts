/// <reference path="../node_modules/@types/three/index.d.ts" />

/**
 * The game class, it's responsible for switching the scene and the camera. It also performs the gameLoop and rendering.
 */
class Game {
  // Private
  private static _instance: Game;
  private _renderer: THREE.WebGLRenderer;
  private _initialised: boolean;
  private _stage: Stage;
  // Getters and setters
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  // Readonly
  public readonly rendererWidth: number = window.innerWidth - 10;
  public readonly rendererHeight: number = window.innerHeight - 10;
  public readonly debugMode: boolean = false;

  public get scene() {
    return this._scene;
  }
  public set scene(scene: THREE.Scene) {
    this._scene = scene;
  }

  public get camera() {
    return this._camera;
  }
  public set camera(camera: THREE.Camera) {
    this._camera = camera;
  }

  /**
   * The constructor sets up the renderer.
   */
  private constructor() {
    this._initialised = false;
    // Set-up renderer
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(this.rendererWidth, this.rendererHeight);
    document.body.appendChild(this._renderer.domElement);
  }

  /**
   * This method initialised the game by showing the loading screen and starting the gameloop.
   */
  public initialise(): void {
    console.log('[Game.initialise] Initialising!');
    this.stage = new LoadingScreen();
    this._initialised = true;
    console.log('[Game.initialise] Done initialising!');

    // Start the gameloop
    console.log('iv');
    this._gameLoop();
  }

  /**
   * Set the stage to the give stage.
   * @param stage The stage to be set.
   */
  public set stage(stage: Stage) {
    this._stage = stage;
  }

  /**
   * The gameloop renders the current scene, and updates the current stage.
   */
  private _gameLoop(): void {
    if (this._initialised) {
      this._renderer.render(this._scene, this._camera as THREE.Camera);
    }
    if (this._stage) {
      this._stage.update();
    }
    window.requestAnimationFrame(() => this._gameLoop());
  }

  /**
   * Returns an instance of the game if it already exists, and creates it otherwise.
   */
  public static getInstance(): Game {
    if (!Game._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }
}

window.addEventListener('load', () => {
  console.log('Window has loaded!');
  const g = Game.getInstance();
  g.initialise();
});
