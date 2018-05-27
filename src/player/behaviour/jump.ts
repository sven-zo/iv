class Jump implements Behaviour {
    public player: Player; 
    private distance: number = 0;
    private height: number = 0.2; 

    constructor(player: Player) {
        this.player = player;
    }

    update() {
        this.player.mesh.position.x += this.player.speed;
        this.distance += this.player.speed;
        this.player.mesh.position.y += this.height; 
        this.height = (-0.96 * Math.pow(this.distance, 2)) + (0.9 * this.distance);

        if(this.player.mesh.position.y <= -0.5){
            this.player.behaviour = new Run(this.player); 
        }
    }
}