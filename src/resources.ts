class Resources {
  private static instance: Resources;
  private audioLoader: THREE.AudioLoader;
  private _music: Music[] = [];
  private loadingScreen: LoadingScreen;
  public readonly totalResources: number = 2;

  public setLoadingScreen(loadingScreen: LoadingScreen) {
    this.loadingScreen = loadingScreen;
  }

  public loadMain() {
    this.audioLoader = new THREE.AudioLoader();
    this.addToAudioLoader('assets/music/ElementarySD.mp3', 'loadingScreen');
    this.addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
  }

  private addToAudioLoader(url: string, name: string) {
    this.audioLoader.load(
      url,
      (audioBuffer: THREE.AudioBuffer) => {
        console.log('[Audioloader] Done loading: ', name);
        this._music.push(new Music(audioBuffer, name));
      },
      (progress: Progress) => this.setProgress(progress),
      (error: Object) => {
        console.log('[Audioloader] An error happened', error);
      }
    );
  }

  private setProgress(progress: Progress) {
    this.loadingScreen.setProgressInformation(progress.loaded, progress.total);
  }

  public get musicEntities {
    return this._music.length;
  }

  public getMusic(name: String) {
    return this._music.filter(track => track.name === name)[0];
  }

  public static getInstance(): Resources {
    if (!Resources.instance) {
      this.instance = new Resources();
    }
    return this.instance;
  }
}
