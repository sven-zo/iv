/// <reference path="../resources.ts" />

class Player {
    private _resourceLoader: Resources;
    private _game : Game;
    private _geometry: THREE.TextGeometry;
    private _mesh: THREE.Mesh; 
    private _boundingBox: THREE.Box3; 
    private _behaviour: Behaviour;
    private _speed: number = 0.05;
    
    public get mesh(): THREE.Mesh {
        return this._mesh;
    }

    public get speed(): number {
        return this._speed; 
    }

    public get behaviour(): Behaviour {
        return this._behaviour;
    }

    public set behaviour(behaviour: Behaviour) {
        this._behaviour = behaviour; 
    }

    constructor() {
        this._resourceLoader = Resources.getInstance();
        this._game = Game.getInstance();
        window.addEventListener('keydown', (e) => { this.keydownHandler(e) })

        this._geometry = this._resourceLoader.getFont('robotoItalic').geometry;
        let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this._mesh = new THREE.Mesh( this._geometry, material );
        this._boundingBox = new THREE.Box3; 

        this._behaviour = new Run(this); 
    }

    private keydownHandler(e : KeyboardEvent) {
        if(e.key === ' ' && !(this._behaviour instanceof Jump)){
            this._behaviour = new Jump(this); 
        }
    }

    public setToStartPosition() {
        this._mesh.position.x = -5; 
        this._mesh.position.y = -0.5;
    }

    public remove() {
        this._game.scene.remove(this.mesh);
    }

    public update() {
        this._boundingBox.setFromObject(this._mesh); 
        this._behaviour.update(); 
    }
}