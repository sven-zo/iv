/// <reference path="resources.ts" />

class Player {
    private _resourceLoader: Resources;
    private _geometry: THREE.TextGeometry;
    private _mesh: THREE.Mesh;

    public get mesh(): THREE.Mesh {
        return this._mesh;
    }

    constructor() {
        this._resourceLoader = Resources.getInstance();

        this._geometry = this._resourceLoader.getFont('robotoItalic').geometry;
        let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this._mesh = new THREE.Mesh( this._geometry, material );
    }

    public setToStartPosition() {
        this._mesh.position.x = -5; 
        this._mesh.position.y = -0.5;
        this._mesh.position.z = 1;
    }
}