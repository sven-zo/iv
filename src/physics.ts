class Physics {
  private _level: LevelCube[];
  private _player: Player;
  private _selectedLevel: LevelCube[];

  constructor(level: LevelCube[], player: Player) {
    this._level = level;
    this._player = player;
  }

  public calculate() {
    const ticksPerUpdate = 1;
    // for (let i = 0; i < ticksPerUpdate; i++) {
    //   this._player.position.x = this._player.position.x + 0.01;
    //   const raycaster = new THREE.Raycaster();
      //raycaster.set(this._player.position, new THREE.Vector3(this._player.position.x + 1, this._player.position.y, this._player.position.z))
      // const origin = this._player.position;
      // const direction = new THREE.Vector3(0, -1, 0)
      // raycaster.set(origin, direction)
      //Game.getInstance().scene.add( new THREE.ArrowHelper(direction, origin, 5, 0xFF0000));

      //console.log('raycast');
      //console.log('world', Game.getInstance().scene.children)
      //const intersects = raycaster.intersectObjects( Game.getInstance().scene.children );
      //const intersects = raycaster.intersectObjects( Game.getInstance().scene.children );
        // const intersects: THREE.Intersection[] = [];
        // raycaster.intersectObjects( Game.getInstance().scene.children, false, intersects );
        // console.log('Found:', intersects.length);
      //console.log(intersects[0]);
      // for ( let i = 0; i < intersects.length; i++ ) {
      //   console.log(intersects[i].object)
      // }
      // }
    // for (let i = 0; i < ticksPerUpdate; i++) {
    //   this._player.position.x = this._player.position.x + 0.01;
    //   this._selectedLevel = this._level.filter(
    //     cube => cube.position.x < this._player.position.x + 1
    //   );
    //   this._selectedLevel = this._level.filter(
    //     cube => cube.position.x > this._player.position.x - 1
    //   );
    //   this._selectedLevel.forEach(cube => //this._player.boundingBox.intersectsPlane(cube.plane.geometry))
    //   this._player.boundingBox.intersect(cube.plane)
    // }
    // const ticksPerUpdate = 1;
    // //const ticksPerUpdate = 16;
    // for (let i = 0; i < ticksPerUpdate; i++) {
    //   this._player.position.x = this._player.position.x + 0.01;
    //   // this._player.velocityY = this._player.velocityY - 0.5;
    //   this._player.position.y =
    //     this._player.position.y - this._player.velocityY;
    //   this._selectedLevel = this._level.filter(
    //     cube => cube.position.x < this._player.position.x + 1
    //   );
    //   this._selectedLevel = this._level.filter(
    //     cube => cube.position.x > this._player.position.x - 1
    //   );
    //   console.log('Selected physics chunk:', this._selectedLevel.length);
    //   console.log('Player velocityY', this._player.velocityY);
    //   // console.log(this._selectedLevel);
    //   this._selectedLevel.forEach(cube => {
    //     if (cube.boundingBox.max.y > this._player.position.y) {
    //       this._player.position.y = cube.boundingBox.max.y;
    //       this._player.velocityY = 0;
    //     } else {
    //       this._player.velocityY -= -0.01;
    //     }
    //   });
      //console.log('Box', this._level[0].boundingBox.max.y);
      //console.log('Player', this._player.position.y);
      // const selectedArea = ;
      // this._level.forEach(cube => {
      //   if (cube.boundingBox.max.y > this._player.position.y) {
      //     // --
      //   }
      // });
    }
  }
}
