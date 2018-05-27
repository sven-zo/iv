class LoadingScreen implements Stage {
  private loadingText: HTMLDivElement;
  private loadingSubtitle: HTMLDivElement;
  private loadingBox: HTMLDivElement;
  private game: Game;
  private audioListener: THREE.AudioListener;
  private audio: THREE.Audio;
  private progress: number;
  private resources: Resources;
  private isMusicPlaying: boolean;
  private lastProgress: number = 0;
  private state: string = 'loading';
  private frames: number = 0;

  constructor() {
    this.loadingText = document.getElementById(
      'loading-text'
    ) as HTMLDivElement;
    this.loadingSubtitle = document.getElementById(
      'loading-subtitle'
    ) as HTMLDivElement;
    this.loadingBox = document.getElementById(
      'loading-screen'
    ) as HTMLDivElement;
    this.game = Game.getInstance();
    this.game.scene = new THREE.Scene();
    this.game.camera = new THREE.PerspectiveCamera(
      75,
      this.game.rendererWidth / this.game.rendererHeight,
      0.1,
      1000
    );
    
    this.game.scene.background = new THREE.Color('white');
    this.isMusicPlaying = false;
    this.audioListener = new THREE.AudioListener();
    this.game.camera.add(this.audioListener);
    this.audio = new THREE.Audio(this.audioListener);
    this.audio.setLoop(true);
    this.game.scene.add(this.audio);
    this.activateLoadingScreen();
  }

  private activateLoadingScreen(): void {
    this.resources = Resources.getInstance();
    this.resources.setLoadingScreen(this);
    this.resources.loadMain();
  }

  public setProgressInformation(loaded: number, total: number) {
    const newProgress = Math.round(loaded / total * 100);
    if (newProgress >= this.lastProgress) {
      this.progress = newProgress;
    }
    this.lastProgress = newProgress;
  }

  public update() {
    if (this.progress) {
      this.loadingText.innerText = `Loading... (${this.progress}%)`;
      this.loadingSubtitle.innerText = `${this.resources.loadedResources} of ${
        this.resources.totalResources
      } resources parsed`;
      if (this.progress === 100) {
        this.loadingText.innerText = 'Parsing resources...';

        if (this.resources.loadedResources === this.resources.totalResources) {
          this.loadingText.innerText = 'Done!';
          this.state = 'exiting';
        }
      }
    } else {
      this.loadingText.innerText = `Loading...`;
    }

    if (this.state === 'exiting') {
      if (this.frames < 50) {
        this.frames++;
        this.loadingBox.style.transform = `scale(${1 - this.frames / 50})`;
        this.loadingBox.style.opacity = `${1 - this.frames / 50}`;
        this.audio.setVolume(1 - this.frames / 50);
      } else {
        this.exit();
      }
    }

    if (this.resources.getMusic('loadingScreen') && !this.isMusicPlaying) {
      this.audio.setBuffer(this.resources.getMusic('loadingScreen').audio);
      this.audio.play();
      this.isMusicPlaying = true;
    }
  }

  private exit() {
    this.loadingBox.style.display = 'none';
    this.game.showMainMenu();
  }
}
