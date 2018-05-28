class Jump implements Behaviour {
    public player: Player; 
    private _distance: number = 0;
    private _height: number = 0.2; 
    private _arc: THREE.Line;
    private _cancelPosition: THREE.Vector3; 
    private _canceled: Boolean = false;

    public get arc(): THREE.Line {
        return this._arc;
    }
    
    public get cancelPosition(): THREE.Vector3 {
        return this._cancelPosition;
    } 

    public set cancelPosition(position: THREE.Vector3) {
        this._cancelPosition = position; 
    }

    constructor(player: Player, visibleArc?: boolean) {
        this.player = player;
        this._arc = this.generateArc(); 
        if(visibleArc){
            Game.getInstance().scene.add(this._arc); 
        }     
    } 

    private calculateHeight(weight_distance: number, weight_height: number ): number {
        let a = 1 - weight_distance;
        let b = weight_height;
        let x = this._distance; 
 
        return (- a * Math.pow(x, 2)) + (b * x); 
    }

    //NOTE: this is hardcoded based on the values weight_distance = 0.04 & weight_height = 0.9
    private generateArc(): THREE.Line {
        const arc = new THREE.Path();
        arc.absellipse( 
            this.player.position.x + 1, this.player.position.y, 
            0.6, 2.8, 
            Math.PI, 2 * Math.PI, 
            true, 0
        );
        const points2D = arc.getPoints();
        const points3D = points2D.map((point) => { return new THREE.Vector3(point.x, point.y, this.player.position.z) })
      
        const geometry = new THREE.Geometry().setFromPoints( points3D );
        const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
      
        return new THREE.Line( geometry, material );
    }

    private cancel() {
        if(!this._cancelPosition){
            return
        }

        if(this._cancelPosition.y + 0.15 >= this.player.position.y && this._cancelPosition.y - 0.15 <= this.player.position.y) {
            this._canceled = true; 
            this.player.behaviour = new Run(this.player); 
        }
    }

    public update() { 
        if(this._canceled) {
            return; 
        }

        this.cancel();
        this.player.position.x += this.player.speed;
        this._distance += this.player.speed;
        this.player.position.y += this._height; 

        this._height = this.calculateHeight(0.04, 0.9); 
    }
}