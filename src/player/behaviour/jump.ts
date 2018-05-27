class Jump implements Behaviour {
    public player: Player; 
    private _distance: number = 0;
    private _height: number = 0.2; 

    constructor(player: Player) {
        this.player = player;
    } 

    private calculateHeight(weightDistance: number, weightHeight: number): number {
        let a = 1 - weightDistance;
        let b = weightHeight;
        let x = this._distance; 
 
        return (- a * Math.pow(x, 2)) + (b * x); 
    }

    update() {
        this.player.mesh.position.x += this.player.speed;
        this._distance += this.player.speed;
        this.player.mesh.position.y += this._height; 

        this._height = this.calculateHeight(0.04, 0.9); 

        if(this.player.mesh.position.y < -0.5){    
            this.player.behaviour = new Run(this.player); 
        }
    }
}