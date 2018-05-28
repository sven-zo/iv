class GameObject {
    protected _game: Game;
    protected _mesh: THREE.Mesh;
    protected _boundingBox: THREE.Box3;
    protected _upperFace: THREE.Vector3[];
    protected _bottomFace: THREE.Vector3[];
    
    public get mesh(): THREE.Mesh {
        return this._mesh;
    }

    public get boundingBox(): THREE.Box3 {
        return this._boundingBox; 
    }

    public get position(): THREE.Vector3 {
        return this._mesh.position; 
    }

    public get upperFace(): THREE.Vector3[] {
        return this._upperFace;
    }

    public get bottomFace(): THREE.Vector3[] {
        return this._bottomFace;
    }

    constructor(geometry: THREE.Geometry, material: THREE.Material, startPosition: THREE.Vector3) {
        this._game = Game.getInstance();
        this._mesh = new THREE.Mesh(geometry, material);
        this.toPosition(startPosition.x, startPosition.y, startPosition.z);
        this._mesh.geometry.computeBoundingBox();
        this._boundingBox = this._mesh.geometry.boundingBox.setFromObject(this._mesh);
        this._upperFace = this.computeHorizontalFace(true);
        this._bottomFace = this.computeHorizontalFace(false); 
        this._game.scene.add(this._mesh); 
    }

    protected toPosition(x: number, y: number, z: number) {
        this._mesh.position.x = x; 
        this._mesh.position.y = y;
        this._mesh.position.z = z;
    }

    protected computeHorizontalFace(upper: Boolean): THREE.Vector3[] {
        let minX = this._boundingBox.min.x; 
        let minY = this._boundingBox.min.y;
        let minZ = this._boundingBox.min.z; 
        let maxX = this._boundingBox.max.x; 
        let maxY = this._boundingBox.max.y;
        let maxZ = this._boundingBox.max.z; 
        let y = upper ? maxY : minY; 

        let face = [];
        face.push(
            new THREE.Vector3(minX, y, maxZ), 
            new THREE.Vector3(minX, y, minZ), 
            new THREE.Vector3(maxX, y, minZ), 
            new THREE.Vector3(maxX, y, maxZ), 
        )

        return face;
    }

    public update() {
        this._boundingBox.setFromObject(this._mesh); 
        this._upperFace = this.computeHorizontalFace(true);
        this._bottomFace = this.computeHorizontalFace(false); 
    }

    public remove() {
        this._game.scene.remove(this._mesh);
    }
}