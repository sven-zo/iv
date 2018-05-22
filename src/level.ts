class Level implements Stage {
  private game: Game;
  private level: any;

  constructor() {
    this.game = Game.getInstance();

    this.game.scene = new THREE.Scene();
    this.game.scene.background = new THREE.Color('white');
    this.game.camera = new THREE.PerspectiveCamera(
      75,
      this.game.rendererWidth / this.game.rendererHeight,
      0.1,
      1000
    );

    // LevelGenerator.generate().then(level => (this.level = level));
    const axesHelper = new THREE.AxesHelper(5);
    this.game.scene.add(axesHelper);

    LevelGenerator.generate().then(level => {
      console.log(level);
      level.forEach(element => {
        const geometry = new THREE.BoxGeometry(4, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color('grey')
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = element.x;
        cube.position.y = element.y;
        cube.position.z = element.z;
        this.game.scene.add(cube);
        this.game.camera.position.z = 10;
      });
    });
  }

  update(): void {}
}
