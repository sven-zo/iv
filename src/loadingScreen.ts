class LoadingScreen implements Stage {
  private loadingText: HTMLDivElement;
  private loadingSubtitle: HTMLDivElement;
  private game: Game;
  private audioLoader: THREE.AudioLoader;

  constructor() {
    this.loadingText = document.getElementById(
      'loading-text'
    ) as HTMLDivElement;
    this.loadingSubtitle = document.getElementById(
      'loading-subtitle'
    ) as HTMLDivElement;
    this.loadingText.innerText = 'Still loading...';
    this.loadingSubtitle.innerText = 'Please wait!';

    this.game = Game.getInstance();
    this.game.scene = new THREE.Scene();
    this.game.camera = new THREE.PerspectiveCamera(
      75,
      this.game.rendererWidth / this.game.rendererHeight,
      0.1,
      1000
    );

    this.game.scene.background = new THREE.Color('white');

    this.audioLoader = new THREE.AudioLoader();
    this.loadingText.innerText = 'Loading tunes...';
    console.log('loading 500480_Press-Start.mp3');
    this.audioLoader.load(
      'assets/music/500480_Press-Start.mp3',
      audioBuffer => {
        console.log('500480_Press-Start.mp3 done loading');
      },
      xhr => {
        console.log(xhr.loaded / xhr.total * 100 + '% loaded');
        this.loadingText.innerText = `Loading tunes... (${Math.round(
          xhr.loaded / xhr.total * 100
        )}%)`;
        this.loadingSubtitle.innerText = 'Main menu tunes';
      },
      error => {
        console.log('An error happened');
      }
    );
  }

  public update() {}
}
