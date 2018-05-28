class Resources {
  private static instance: Resources;
  private audioLoader: THREE.AudioLoader;
  private fontLoader: THREE.FontLoader; 
  private _music: Music[] = [];
  private _fonts: Font[] = []; 
  private loadingScreen: LoadingScreen;
  public readonly totalResources: number = 3;

  public setLoadingScreen(loadingScreen: LoadingScreen) {
    this.loadingScreen = loadingScreen;
  }

  public loadMain() {
    this.audioLoader = new THREE.AudioLoader();
    this.fontLoader = new THREE.FontLoader(); 
    this.addToAudioLoader('assets/music/ElementarySD.mp3', 'loadingScreen');
    this.addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
    this.addToFontLoader('assets/fonts/Roboto_Italic.json', 'robotoItalic'); 
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

  //NOTE: A font actually needs to be added into a scene. 
  //Since the only scene available right now is the loadingscreen.
  //The geometry for the i is generated immediately.  
  private addToFontLoader(url: string, name: string){
    this.fontLoader.load( 
      url,
      (font: THREE.Font) => {
        console.log('[FontLoader] Done loading: ', name);
        let geometry = new THREE.TextGeometry('i', {font: font, size: 1, height: 0.25});
        this._fonts.push(new Font(font, geometry, name)); 
      },
      (progress: Progress) => {
        this.setProgress(progress);
      },
      (error: Object) => {
        console.error('[FontLoader] An error occured', error);
      }
    );
  }

  private setProgress(progress: Progress) {
    this.loadingScreen.setProgressInformation(progress.loaded, progress.total);
  }

  public get loadedResources(): number {
    return this._music.length + this._fonts.length;
  }

  public getMusic(name: String) {
    return this._music.filter(track => track.name === name)[0];
  }

  public getFont(name: String): Font{
    return this._fonts.filter(font =>  font.name === name)[0]; 
  }

  public static getInstance(): Resources {
    if (!Resources.instance) {
      this.instance = new Resources();
    }
    return this.instance;
  }
}
