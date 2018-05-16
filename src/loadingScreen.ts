class LoadingScreen implements Stage {
  private loadingText: HTMLDivElement;
  private loadingSubtitle: HTMLDivElement;
  private game: Game;
  private audioLoader: THREE.AudioLoader;
  private audioListener: THREE.AudioListener;
  private audio: THREE.Audio;

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
    this.audioListener = new THREE.AudioListener();
    this.game.camera.add(this.audioListener);
    this.audio = new THREE.Audio(this.audioListener);
    this.game.scene.add(this.audio);

    this.game.scene.background = new THREE.Color('white');

    //TODO: general loading thing en dan een lijst van dingen waar die mee bezig is in de subtitle (want hij laadt meerdere dingen tegelijk apparently)

    this.audioLoader = new THREE.AudioLoader();
    this.loadingText.innerText = 'Loading loading screen music...';
    this.loadingSubtitle.innerText = 'Ironic, I know...';
    console.log('loading ElementarySD');
    this.audioLoader.load(
      'assets/music/ElementarySD.mp3',
      audioBuffer => {
        console.log('ElementarySD.mp3 done loading');
        this.audio.setBuffer(audioBuffer);
        this.audio.play();
      },
      xhr => {
        this.loadingText.innerText = `Loading loading screen music... (${Math.round(
          xhr.loaded / xhr.total * 100
        )}%)`;
        this.loadingSubtitle.innerText = 'Ironic, I know...';
      },
      error => {
        console.log('An error happened');
      }
    );

    this.loadingText.innerText = 'Loading tunes...';
    console.log('loading 500480_Press-Start.mp3');
    this.audioLoader.load(
      'assets/music/500480_Press-Start.mp3',
      audioBuffer => {
        console.log('500480_Press-Start.mp3 done loading');
      },
      xhr => {
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
