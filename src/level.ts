class Level implements Stage {
  private game: Game;
  private level: any;
  private genetatedLevel: LevelCube[] = []; 
  private resourceLoader: Resources; 
  private player: Player;  
  private collisionChecker: CollisionChecker;

  constructor() {
    this.game = Game.getInstance();
    this.resourceLoader = Resources.getInstance(); 

    this.game.scene = new THREE.Scene();
    this.game.scene.background = new THREE.Color('white');
    this.game.camera = new THREE.PerspectiveCamera(
      75,
      this.game.rendererWidth / this.game.rendererHeight,
      0.1,
      1000
    );
    this.game.camera.position.z = 10;
    // LevelGenerator.generate().then(level => (this.level = level));
    const axesHelper = new THREE.AxesHelper(5);
    this.game.scene.add(axesHelper);

    LevelGenerator.generate().then(level => {
      console.log(level);
      level.forEach(element => {
        let cube = new LevelCube(element.x, element.y, element.z); 
        this.genetatedLevel.push(cube);
      }); 
        this.player = new Player(-5, -0.5, 1);
        this.collisionChecker = new CollisionChecker(this.player); 
    });
  }

  private syncCameraAndPlayerPosition(): void {
    this.game.camera.position.x = this.player.position.x; 
    this.game.camera.position.y = this.player.position.y; 
  }

  public update(): void {
    this.collisionChecker.checkPlayerCube(this.genetatedLevel); 
    this.syncCameraAndPlayerPosition(); 
    this.player.update();
  }
}
