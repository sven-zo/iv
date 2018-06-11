class Resources {
  private static _instance: Resources;
  private _audioLoader: THREE.AudioLoader = new THREE.AudioLoader();
  private _fontLoader: THREE.FontLoader = new THREE.FontLoader();
  private _music: Music[] = [];
  private _fonts: Font[] = [];
  private _loadingScreen: LoadingScreen;
  private _debugMode: boolean = false;
  private _game: Game;
  public readonly totalResources: number = 4;

  constructor() {
    this._game = Game.getInstance();
    this._debugMode = this._game.debugMode;
  }

  public set loadingScreen(loadingScreen: LoadingScreen) {
    this._loadingScreen = loadingScreen;
  }

  private _loadMainAfterMusic() {
    if (this._music.length < 1) {
      setTimeout(() => {
        this._loadMainAfterMusic();
      }, 50);
    } else {
      console.log('[AudioLoader] Loading the rest of the music');
      this._addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
      this._addToAudioLoader(
        'assets/music/160907__raccoonanimator__cue-scratch.wav',
        'death'
      );
      this._addToFontLoader('assets/fonts/Roboto_Italic.json', 'robotoItalic');
    }
  }

  public loadMain() {
    if (this._debugMode) {
      console.warn(
        '[Audio] Audio is disabled for quicker parsing! Turn this off in `resources.debugMode`.'
      );
      this._addToAudioLoader('assets/music/debug/debug0.mp3', 'loadingScreen');
      this._addToAudioLoader('assets/music/debug/debug1.mp3', 'mainMenu');
    } else {
      this._addToAudioLoader('assets/music/ElementaryXSD.mp3', 'loadingScreen');
      this._loadMainAfterMusic();
    }
  }

  private _addToAudioLoader(url: string, name: string) {
    this._audioLoader.load(
      url,
      (audioBuffer: THREE.AudioBuffer) => {
        console.log('[Audioloader] Done loading: ', name);
        this._music.push(new Music(audioBuffer, name));
      },
      (progress: Progress) => this._setProgress(progress),
      (error: Object) => {
        console.log('[Audioloader] An error happened', error);
      }
    );
  }

  //NOTE: A font actually needs to be added into a scene.
  //Since the only scene available right now is the loadingscreen.
  //The geometry for the i is generated immediately.
  private _addToFontLoader(url: string, name: string) {
    this._fontLoader.load(
      url,
      (font: THREE.Font) => {
        console.log('[FontLoader] Done loading: ', name);
        let geometry = new THREE.TextGeometry('i', {
          font: font,
          size: 1,
          height: 0.25
        });
        this._fonts.push(new Font(font, geometry, name));
      },
      (progress: Progress) => {
        this._setProgress(progress);
      },
      (error: Object) => {
        console.error('[FontLoader] An error occured', error);
      }
    );
  }

  private _setProgress(progress: Progress) {
    this._loadingScreen.setProgressInformation(progress.loaded, progress.total);
  }

  public get loadedResources(): number {
    return this._music.length + this._fonts.length;
  }

  public getMusic(name: String): Music {
    return this._music.filter(track => track.name === name)[0];
  }

  public getFont(name: String): Font {
    return this._fonts.filter(font => font.name === name)[0];
  }

  public static getInstance(): Resources {
    if (!Resources._instance) {
      this._instance = new Resources();
    }
    return this._instance;
  }
}
