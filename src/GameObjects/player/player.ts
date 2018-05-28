/// <reference path="../../resources.ts" />

class Player extends GameObject {
    private _behaviour: Behaviour;
    private _speed: number = 0.05;
    private _keydownCb = (e: KeyboardEvent) => { this.keydownHandler(e) }
    
    public get speed(): number {
        return this._speed; 
    }

    public get behaviour(): Behaviour {
        return this._behaviour;
    }

    public set behaviour(behaviour: Behaviour) {
        this._behaviour = behaviour; 
    }

    constructor(x: number, y: number, z: number) {
        super(
            Resources.getInstance().getFont('robotoItalic').geometry, 
            new THREE.MeshBasicMaterial( { color: 0xffff00 } ),
            new THREE.Vector3(x, y, z),
        ); 

        window.addEventListener('keydown', this._keydownCb);
        this._behaviour = new Run(this); 
    }

    private keydownHandler(e : KeyboardEvent) {
        if(e.key === ' ' && !(this._behaviour instanceof Jump)){
            this._behaviour = new Jump(this); 
        }
    }

    public remove() {
        super.remove(); 
        window.removeEventListener('keydown', this._keydownCb);
    }

    public update() {
        super.update(); 
        this._behaviour.update(); 
    }
}