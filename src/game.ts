/// <reference path="../node_modules/@types/three/index.d.ts" />

class Game {
  private static instance: Game;
  private renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  private stage: Stage;
  public readonly rendererWidth: number = window.innerWidth - 10;
  public readonly rendererHeight: number = window.innerHeight - 10;
  private initialised: boolean;

  private constructor() {
    this.initialised = false;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    document.body.appendChild(this.renderer.domElement);
    console.log('iv');
    this.gameLoop();
  }

  // private timestamp() {
  //   return window.performance && window.performance.now
  //     ? window.performance.now()
  //     : new Date().getTime();
  // }

  public initialise() {
    console.log('Inititalising!');
    this.stage = new LoadingScreen();
    this.initialised = true;
    console.log('Done!');
  }

  private gameLoop() {
    if (this.initialised) {
      this.renderer.render(this.scene, this.camera as THREE.Camera);
    }
    window.requestAnimationFrame(() => this.gameLoop());
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      this.instance = new Game();
    }
    return this.instance;
  }
}

window.addEventListener('load', () => {
  console.log('Window has loaded!');
  const g = Game.getInstance();
  g.initialise();
});
