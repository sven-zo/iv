class Die implements Behaviour {
    public player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    update() {
        this.player.remove(); 
        console.warn('not implemented, removed player');
    }
}