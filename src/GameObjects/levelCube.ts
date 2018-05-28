class LevelCube extends GameObject {
    constructor(x: number, y: number, z: number){
        super(
            new THREE.BoxGeometry(4, 1, 1), 
            new THREE.MeshBasicMaterial({ color: new THREE.Color('grey')}),
            new THREE.Vector3(x, y, z),
        ); 
    }
}