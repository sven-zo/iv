/**
 * The loadingscreen to be displayed while loading the game.
 */
class LoadingScreen implements Stage {
  private _loadingText: HTMLDivElement;
  private _loadingSubtitle: HTMLDivElement;
  private _loadingBox: HTMLDivElement;

  private _game: Game;
  private _resources: Resources;

  private _audioListener: THREE.AudioListener;
  private _audio: THREE.Audio;

  private _progress: number;
  private _isMusicPlaying: boolean = false;
  private _lastProgress: number = 0;
  private _state: string = 'loading';
  private _frames: number = 0;
  private _debugMode: boolean = false;

  /**
   * Grabs elements from the HTML page and signals the class to set up the scene and activate the loading screen.
   * If debugMode is activated, certain animations will be sped up for faster development.
   */
  constructor() {
    this._loadingText = document.getElementById(
      'loading-text'
    ) as HTMLDivElement;
    this._loadingSubtitle = document.getElementById(
      'loading-subtitle'
    ) as HTMLDivElement;
    this._loadingBox = document.getElementById(
      'loading-screen'
    ) as HTMLDivElement;
    this._game = Game.getInstance();
    this._debugMode = this._game.debugMode;
    this._setUpScene();
    this._activateLoadingScreen();
  }

  /**
   * Sets up the scene for the loadingScreen.
   */
  private _setUpScene(): void {
    this._game.scene = new THREE.Scene();
    this._game.camera = new THREE.PerspectiveCamera(
      75,
      this._game.rendererWidth / this._game.rendererHeight,
      0.1,
      1000
    );
    this._game.scene.background = new THREE.Color('white');
    this._audioListener = new THREE.AudioListener();
    this._game.camera.add(this._audioListener);
    this._audio = new THREE.Audio(this._audioListener);
    this._audio.setLoop(true);
    this._game.scene.add(this._audio);
  }

  /**
   * Grabs a load instance and signals it to start loading.
   */
  private _activateLoadingScreen(): void {
    this._resources = Resources.getInstance();
    this._resources.loadingScreen = this;
    this._resources.loadMain();
  }

  /**
   * Sets the progress of the loadingScreen if the new value is higher than the last progress information given.
   * @param loaded The currently loaded resources.
   * @param total The total amount of resources.
   */
  public setProgressInformation(loaded: number, total: number): void {
    const newProgress = Math.round(loaded / total * 100);
    if (newProgress >= this._lastProgress) {
      this._progress = newProgress;
    }
    this._lastProgress = newProgress;
  }

  /**
   * This method updates the loading screen by setting the progress information, playing the exit animation, and starting the music.
   */
  public update(): void {
    if (this._progress) {
      this._loadingText.innerText = `Loading... (${this._progress}%)`;
      this._loadingSubtitle.innerText = `${
        this._resources.loadedResources
      } of ${this._resources.totalResources} resources parsed`;
      if (this._progress === 100) {
        this._loadingText.innerText = 'Parsing resources...';

        if (
          this._resources.loadedResources === this._resources.totalResources
        ) {
          this._loadingText.innerText = 'Done!';
          this._state = 'exiting';
        }
      }
    } else {
      this._loadingText.innerText = `Loading...`;
    }

    // Plays the exit animations if debugMode isn't activated.
    if (!this._debugMode && this._state === 'exiting') {
      if (this._frames < 50) {
        this._frames++;
        this._loadingBox.style.transform = `scale(${1 - this._frames / 50})`;
        this._loadingBox.style.opacity = `${1 - this._frames / 50}`;
        this._audio.setVolume(1 - this._frames / 50);
      } else {
        this._exit();
      }
    }

    // Starts the loading screen music if this resource is available.
    if (this._resources.getMusic('loadingScreen') && !this._isMusicPlaying) {
      this._audio.setBuffer(this._resources.getMusic('loadingScreen').audio);
      this._audio.play();
      this._isMusicPlaying = true;
    }
  }

  /**
   * Exits the loadingScreen by hiding the UI and showing the main menu.
   */
  private _exit(): void {
    this._loadingBox.style.display = 'none';
    //this._game.show('main-menu');
    this._game.stage = new Level();
  } // TODO: polymorphime op 1 meer plek
}
