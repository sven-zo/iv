"use strict";
class Game {
    constructor() {
        this.rendererWidth = window.innerWidth - 10;
        this.rendererHeight = window.innerHeight - 10;
        this.initialised = false;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.rendererWidth, this.rendererHeight);
        document.body.appendChild(this.renderer.domElement);
        console.log('iv');
        this.gameLoop();
    }
    initialise() {
        console.log('Inititalising!');
        this.stage = new LoadingScreen();
        this.initialised = true;
        console.log('Done!');
    }
    gameLoop() {
        if (this.initialised) {
            this.renderer.render(this.scene, this.camera);
        }
        window.requestAnimationFrame(() => this.gameLoop());
    }
    static getInstance() {
        if (!Game.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }
}
window.addEventListener('load', () => {
    console.log('Window has loaded!');
    const g = Game.getInstance();
    g.initialise();
});
class LoadingScreen {
    constructor() {
        this.loadingText = document.getElementById('loading-text');
        this.loadingSubtitle = document.getElementById('loading-subtitle');
        this.loadingText.innerText = 'Still loading...';
        this.loadingSubtitle.innerText = 'Please wait!';
        this.game = Game.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        this.game.scene.background = new THREE.Color('white');
        this.audioLoader = new THREE.AudioLoader();
        this.loadingText.innerText = 'Loading tunes...';
        console.log('loading 500480_Press-Start.mp3');
        this.audioLoader.load('assets/music/500480_Press-Start.mp3', audioBuffer => {
            console.log('500480_Press-Start.mp3 done loading');
        }, xhr => {
            console.log(xhr.loaded / xhr.total * 100 + '% loaded');
            this.loadingText.innerText = `Loading tunes... (${Math.round(xhr.loaded / xhr.total * 100)}%)`;
            this.loadingSubtitle.innerText = 'Main menu tunes';
        }, error => {
            console.log('An error happened');
        });
    }
    update() { }
}
class Menu {
    constructor() {
        this.game = Game.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.game.scene.add(cube);
        this.game.camera.position.z = 5;
    }
}
//# sourceMappingURL=main.js.map