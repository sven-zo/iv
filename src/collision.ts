class CollisionChecker {
    private _lastPlayerCubeHit: LevelCube | null;
    private _player: Player; 

    constructor(player: Player) {
      this._player = player; 
    }

    //Collision Check using an arc as a 'raycaster' to check if the player will hit the upperface of a LevelCube when it jumps
    private predictedCollisionPlayerCube(cube:LevelCube): void {
        if(!(this._player.behaviour instanceof Jump)){
          return
        }

        const jump = this._player.behaviour as Jump; 

        const cubeTop = cube.upperFace[0].y;
        const cubeXMax: number = cube.upperFace.reduce((previous, current) => { return previous.x > current.x ? previous : current}).x;
        const cubeXMin: number = cube.upperFace.reduce((previous, current) => { return previous.x < current.x ? previous : current}).x;
        const cubeZMax: number = cube.upperFace.reduce((previous, current) => { return previous.z > current.z ? previous : current}).z;
        const cubeZMin: number = cube.upperFace.reduce((previous, current) => { return previous.z < current.z ? previous : current}).z; 
    
        const arcGeo = this._player.behaviour.arc.geometry as THREE.Geometry;
          const moreSpecificPoints = arcGeo.vertices.map((point, index, array) => {
            if(index + 1 < array.length){
              return new THREE.LineCurve3(array[index], array[index + 1]).getPoints();
            }
          });

          //NOTE: for some reason reduce starts at index = 1 and not index = 0 :/
          const points = moreSpecificPoints.reduce((previous, current, index, array) => {
            if(previous && current){
              return previous.concat(current); 
            } else if(previous && !current) {
              let skippedArray = array[0] as THREE.Vector3[]; 
              return previous.concat(skippedArray); 
            } 
          }) as THREE.Vector3[];

          points.forEach((point) => {
            if( 
              point.y <= cubeTop + 0.1 && point.y >= cubeTop - 0.1 &&
              point.x <= cubeXMax && point.x >= cubeXMin &&
              point.z <= cubeZMax && point.z >= cubeZMin
            ) {
              jump.cancelPosition = point; 
              this._lastPlayerCubeHit = cube;
            }
          });
    }

    //Basic Collision Check
    public checkPlayerCube(genetatedLevel: LevelCube[]): void {
        const currentCheck = genetatedLevel.filter((cube) => {
          if(cube.position.x > this._player.position.x - 12 && cube.position.x < this._player.position.x + 12){
            return cube; 
          }
        });
    
        currentCheck.forEach((cube) => {
          this.predictedCollisionPlayerCube(cube);
    
          if(this._player.boundingBox.intersectsBox(cube.boundingBox) && cube != this._lastPlayerCubeHit) {
            return this._player.behaviour = new Die(this._player);         
          } 
        });
    }


}