class Level implements Stage {
  private game: Game;
  private level: any;
  private _genetatedLevel: THREE.Mesh[] = []; 
  private _resourceLoader: Resources; 
  private _player: Player;  

  constructor() {
    this.game = Game.getInstance();
    this._resourceLoader = Resources.getInstance(); 

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
        const geometry = new THREE.BoxGeometry(4, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color('grey'),
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = element.x;
        cube.position.y = element.y;
        cube.position.z = element.z;
        cube.geometry.computeBoundingBox();
        cube.geometry.boundingBox.setFromObject(cube);
        this.game.scene.add(cube);
        this._genetatedLevel.push(cube);
      });

      console.log(this._genetatedLevel); //.geometry.vertices  
        this._player = new Player(); 
        this.game.scene.add(this._player.mesh); 
        this._player.setToStartPosition(); 
    });
  }

  //TODO: add collision
  //collision 
    //intersectsBox === true 
      // upperFaceCube === true
        //land / switch to run
      //die
    //do nothing 

  syncCameraAndPlayerPosition() {
    this.game.camera.position.x = this._player.mesh.position.x; 
    this.game.camera.position.y = this._player.mesh.position.y; 
  }

  update(): void {
    this.syncCameraAndPlayerPosition(); 
    this._player.update();
  }
}
