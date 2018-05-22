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
        console.log('[Game] Inititalising!');
        this.stage = new LoadingScreen();
        this.initialised = true;
        console.log('[Game] Done initialising!');
    }
    showMainMenu() {
        console.log('[Game] Main menu');
        this.stage = new Level();
    }
    gameLoop() {
        if (this.initialised) {
            this.renderer.render(this.scene, this.camera);
        }
        if (this.stage) {
            this.stage.update();
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
class Level {
    constructor() {
        this.game = Game.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.scene.background = new THREE.Color('white');
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        const axesHelper = new THREE.AxesHelper(5);
        this.game.scene.add(axesHelper);
        LevelGenerator.generate().then(level => {
            console.log(level);
            level.forEach(element => {
                const geometry = new THREE.BoxGeometry(4, 1, 1);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color('grey')
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.x = element.x;
                cube.position.y = element.y;
                cube.position.z = element.z;
                this.game.scene.add(cube);
                this.game.camera.position.z = 10;
            });
        });
    }
    update() { }
}
class LevelGenerator {
    static generate() {
        return new Promise((resolve, reject) => {
            const level = [];
            const levelLength = Math.random() * 500;
            for (let i = 0; i < levelLength; i++) {
                level.push({ x: i, y: i, z: 1 });
            }
            resolve(level);
        });
    }
}
class LoadingScreen {
    constructor() {
        this.lastProgress = 0;
        this.state = 'loading';
        this.frames = 0;
        this.loadingText = document.getElementById('loading-text');
        this.loadingSubtitle = document.getElementById('loading-subtitle');
        this.loadingBox = document.getElementById('loading-screen');
        this.game = Game.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        this.game.scene.background = new THREE.Color('white');
        this.isMusicPlaying = false;
        this.audioListener = new THREE.AudioListener();
        this.game.camera.add(this.audioListener);
        this.audio = new THREE.Audio(this.audioListener);
        this.audio.setLoop(true);
        this.game.scene.add(this.audio);
        this.activateLoadingScreen();
    }
    activateLoadingScreen() {
        this.resources = Resources.getInstance();
        this.resources.setLoadingScreen(this);
        this.resources.loadMain();
    }
    setProgressInformation(loaded, total) {
        const newProgress = Math.round(loaded / total * 100);
        if (newProgress >= this.lastProgress) {
            this.progress = newProgress;
        }
        this.lastProgress = newProgress;
    }
    update() {
        if (this.progress) {
            this.loadingText.innerText = `Loading... (${this.progress}%)`;
            this.loadingSubtitle.innerText = `${this.resources.musicEntities} of ${this.resources.totalResources} resources parsed`;
            if (this.progress === 100) {
                this.loadingText.innerText = 'Parsing resources...';
                if (this.resources.musicEntities === this.resources.totalResources) {
                    this.loadingText.innerText = 'Done!';
                    this.state = 'exiting';
                }
            }
        }
        else {
            this.loadingText.innerText = `Loading...`;
        }
        if (this.state === 'exiting') {
            if (this.frames < 50) {
                this.frames++;
                this.loadingBox.style.transform = `scale(${1 - this.frames / 50})`;
                this.loadingBox.style.opacity = `${1 - this.frames / 50}`;
                this.audio.setVolume(1 - this.frames / 50);
            }
            else {
                this.exit();
            }
        }
        if (this.resources.getMusic('loadingScreen') && !this.isMusicPlaying) {
            this.audio.setBuffer(this.resources.getMusic('loadingScreen').audio);
            this.audio.play();
            this.isMusicPlaying = true;
        }
    }
    exit() {
        this.loadingBox.style.display = 'none';
        this.game.showMainMenu();
    }
}
class MainMenu {
    constructor() {
        this.game = Game.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.scene.background = new THREE.Color('white');
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.game.scene.add(cube);
        this.game.camera.position.z = 5;
    }
    update() { }
}
class Music {
    constructor(audio, name) {
        this._audio = audio;
        this._name = name;
    }
    get audio() {
        return this._audio;
    }
    get name() {
        return this._name;
    }
}
class Progress {
    constructor(loaded, total) {
        this.loaded = loaded;
        this.total = total;
    }
}
class Resources {
    constructor() {
        this._music = [];
        this.totalResources = 2;
    }
    setLoadingScreen(loadingScreen) {
        this.loadingScreen = loadingScreen;
    }
    loadMain() {
        this.audioLoader = new THREE.AudioLoader();
        this.addToAudioLoader('assets/music/ElementarySD.mp3', 'loadingScreen');
        this.addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
    }
    addToAudioLoader(url, name) {
        this.audioLoader.load(url, (audioBuffer) => {
            console.log('[Audioloader] Done loading: ', name);
            this._music.push(new Music(audioBuffer, name));
        }, (progress) => this.setProgress(progress), (error) => {
            console.log('[Audioloader] An error happened', error);
        });
    }
    setProgress(progress) {
        this.loadingScreen.setProgressInformation(progress.loaded, progress.total);
    }
    get musicEntities() {
        return this._music.length;
    }
    getMusic(name) {
        return this._music.filter(track => track.name === name)[0];
    }
    static getInstance() {
        if (!Resources.instance) {
            this.instance = new Resources();
        }
        return this.instance;
    }
}
//# sourceMappingURL=main.js.map