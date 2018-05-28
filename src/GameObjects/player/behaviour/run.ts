class Run implements Behaviour {
    public player : Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    public update() {
        this.player.mesh.position.x += this.player.speed;
    }
}