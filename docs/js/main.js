"use strict";
class BoxData {
    constructor(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
}
class Game {
    constructor() {
        this.rendererWidth = window.innerWidth - 10;
        this.rendererHeight = window.innerHeight - 10;
        this.debugMode = false;
        this._initialised = false;
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(this.rendererWidth, this.rendererHeight);
        document.body.appendChild(this._renderer.domElement);
    }
    get scene() {
        return this._scene;
    }
    set scene(scene) {
        this._scene = scene;
    }
    get camera() {
        return this._camera;
    }
    set camera(camera) {
        this._camera = camera;
    }
    initialise() {
        console.log('[Game.initialise] Initialising!');
        this.stage = new LoadingScreen();
        this._initialised = true;
        console.log('[Game.initialise] Done initialising!');
        console.log('iv');
        this._gameLoop();
    }
    set stage(stage) {
        this._stage = stage;
    }
    _gameLoop() {
        if (this._initialised) {
            this._renderer.render(this._scene, this._camera);
        }
        if (this._stage) {
            this._stage.update();
        }
        window.requestAnimationFrame(() => this._gameLoop());
    }
    static getInstance() {
        if (!Game._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
}
window.addEventListener('load', () => {
    console.log('Window has loaded!');
    const g = Game.getInstance();
    g.initialise();
});
class LevelGenerator {
    static generateChunk(startingX) {
        const chunk = [];
        for (let i = 0 + startingX; i < this.chunkLength + startingX; i++) {
            chunk.push(new BoxData(i, -6, 1));
            chunk.push(new BoxData(i, 6, 1));
            chunk.push(new BoxData(i, Math.random() * 12 - 6, 1));
        }
        return chunk;
    }
}
LevelGenerator.chunkLength = 20;
class Progress {
    constructor(loaded, total) {
        this.loaded = loaded;
        this.total = total;
    }
}
class Resources {
    constructor() {
        this._audioLoader = new THREE.AudioLoader();
        this._fontLoader = new THREE.FontLoader();
        this._music = [];
        this._fonts = [];
        this._debugMode = false;
        this.totalResources = 3;
        this._game = Game.getInstance();
        this._debugMode = this._game.debugMode;
    }
    set loadingScreen(loadingScreen) {
        this._loadingScreen = loadingScreen;
    }
    loadMain() {
        if (this._debugMode) {
            console.warn('[Audio] Audio is disabled for quicker parsing! Turn this off in `resources.debugMode`.');
            this._addToAudioLoader('assets/music/debug/debug0.mp3', 'loadingScreen');
            this._addToAudioLoader('assets/music/debug/debug1.mp3', 'mainMenu');
        }
        else {
            this._addToAudioLoader('assets/music/ElementarySD.mp3', 'loadingScreen');
            this._addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
        }
        this._addToFontLoader('assets/fonts/Roboto_Italic.json', 'robotoItalic');
    }
    _addToAudioLoader(url, name) {
        this._audioLoader.load(url, (audioBuffer) => {
            console.log('[Audioloader] Done loading: ', name);
            this._music.push(new Music(audioBuffer, name));
        }, (progress) => this._setProgress(progress), (error) => {
            console.log('[Audioloader] An error happened', error);
        });
    }
    _addToFontLoader(url, name) {
        this._fontLoader.load(url, (font) => {
            console.log('[FontLoader] Done loading: ', name);
            let geometry = new THREE.TextGeometry('i', {
                font: font,
                size: 1,
                height: 0.25
            });
            this._fonts.push(new Font(font, geometry, name));
        }, (progress) => {
            this._setProgress(progress);
        }, (error) => {
            console.error('[FontLoader] An error occured', error);
        });
    }
    _setProgress(progress) {
        this._loadingScreen.setProgressInformation(progress.loaded, progress.total);
    }
    get loadedResources() {
        return this._music.length + this._fonts.length;
    }
    getMusic(name) {
        return this._music.filter(track => track.name === name)[0];
    }
    getFont(name) {
        return this._fonts.filter(font => font.name === name)[0];
    }
    static getInstance() {
        if (!Resources._instance) {
            this._instance = new Resources();
        }
        return this._instance;
    }
}
class GameObject {
    get mesh() {
        return this._mesh;
    }
    get boundingBox() {
        return this._boundingBox;
    }
    get position() {
        return this._mesh.position;
    }
    get upperFace() {
        return this._upperFace;
    }
    get bottomFace() {
        return this._bottomFace;
    }
    constructor(geometry, material, startPosition) {
        this._game = Game.getInstance();
        this._mesh = new THREE.Mesh(geometry, material);
        this.toPosition(startPosition.x, startPosition.y, startPosition.z);
        this._mesh.geometry.computeBoundingBox();
        this._boundingBox = this._mesh.geometry.boundingBox.setFromObject(this._mesh);
        this._upperFace = this.computeHorizontalFace(true);
        this._bottomFace = this.computeHorizontalFace(false);
        this._game.scene.add(this._mesh);
    }
    toPosition(x, y, z) {
        this._mesh.position.x = x;
        this._mesh.position.y = y;
        this._mesh.position.z = z;
    }
    computeHorizontalFace(upper) {
        let minX = this._boundingBox.min.x;
        let minY = this._boundingBox.min.y;
        let minZ = this._boundingBox.min.z;
        let maxX = this._boundingBox.max.x;
        let maxY = this._boundingBox.max.y;
        let maxZ = this._boundingBox.max.z;
        let y = upper ? maxY : minY;
        let face = [];
        face.push(new THREE.Vector3(minX, y, maxZ), new THREE.Vector3(minX, y, minZ), new THREE.Vector3(maxX, y, minZ), new THREE.Vector3(maxX, y, maxZ));
        return face;
    }
    update() {
        this._boundingBox.setFromObject(this._mesh);
        this._upperFace = this.computeHorizontalFace(true);
        this._bottomFace = this.computeHorizontalFace(false);
    }
    remove() {
        this._game.scene.remove(this._mesh);
    }
}
class BoxObject extends GameObject {
    constructor(x, y, z, id, light, level) {
        super(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: new THREE.Color('grey') }), new THREE.Vector3(x, y, z));
        if (light) {
            const n = Math.floor(Math.random() * 3);
            switch (n) {
                case 0:
                    this.light = new THREE.PointLight(0xff0000, 1, 30, 2);
                    break;
                case 1:
                    this.light = new THREE.PointLight(0x00ff00, 1, 30, 2);
                    break;
                case 2:
                    this.light = new THREE.PointLight(0x0000ff, 1, 30, 2);
                    break;
            }
            this.light.position.x = this.position.x;
            this.light.position.y = this.position.y;
            this.light.position.z = this.position.z + 2;
            level.subscribe(this);
            Game.getInstance().scene.add(this.light);
        }
        this.id = id;
    }
    notify(distance) {
        this.light.distance = distance;
    }
}
class Player extends GameObject {
    constructor(x, y, z) {
        super(Resources.getInstance().getFont('robotoItalic').geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }), new THREE.Vector3(x, y, z));
        this.speed = 0.1;
        document.addEventListener('keydown', this._keydownHandler.bind(this));
        document.addEventListener('mousemove', this._mouseHandler.bind(this));
        this._light = new THREE.PointLight(0xffffff, 1, 100, 2);
        Game.getInstance().scene.add(this._light);
    }
    _mouseHandler(event) {
        this.position.y = -(event.clientY / window.innerHeight) * 10 + 4.5;
    }
    _keydownHandler(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.position.y = this.position.y + this.speed * 2;
                break;
            case 'ArrowDown':
                this.position.y = this.position.y - this.speed * 2;
                break;
        }
    }
    get boundingBox() {
        return this._boundingBox;
    }
    update() {
        super.update();
        this.position.x = this.position.x + this.speed;
        this._light.position.x = this.position.x;
        this._light.position.y = this.position.y;
        this._light.position.z = this.position.z;
    }
}
class Resource {
    get name() {
        return this._name;
    }
    constructor(name) {
        this._name = name;
    }
}
class Font extends Resource {
    get typeface() {
        return this._typeface;
    }
    get geometry() {
        return this._geometry;
    }
    constructor(typeface, geometry, name) {
        super(name);
        this._typeface = typeface;
        this._geometry = geometry;
    }
}
class Music extends Resource {
    get audio() {
        return this._audio;
    }
    constructor(audio, name) {
        super(name);
        this._audio = audio;
    }
}
class GameOverScreen {
    constructor() {
        this._game = Game.getInstance();
        this._game.scene = new THREE.Scene();
        this._game.camera = new THREE.PerspectiveCamera(75, this._game.rendererWidth / this._game.rendererHeight, 0.1, 1000);
        this._game.scene.background = new THREE.Color('red');
        this._gameOverText = document.getElementById('gameover-text');
        const n = Math.floor(Math.random() * 3);
        switch (n) {
            case 0:
                this._gameOverText.innerText = 'Game over';
                break;
            case 1:
                this._gameOverText.innerText = 'Again!';
                break;
            case 2:
                this._gameOverText.innerText = 'DEAD';
                break;
        }
        this._restart();
    }
    _restart() {
        setTimeout(() => {
            this._gameOverText.innerText = '';
            this._game.stage = new Level();
        }, 500);
    }
    update() { }
}
class Level {
    constructor() {
        this._level = [];
        this._chunkDistance = 0;
        this._ids = 0;
        this._lightBlocksPerChunk = 0;
        this._observers = [];
        this._game = Game.getInstance();
        this._resources = Resources.getInstance();
        this._debugMode = this._game.debugMode;
        this._scoreElem = document.getElementById('score');
        this._setUpScene();
        this._setUpFirstChunk();
    }
    _setUpFirstChunk() {
        this._player = new Player(0, 0, 1);
        this._chunkDistance = 19;
        for (let i = -10; i < 21; i++) {
            this._ids++;
            this._level.push(new BoxObject(i, -6, 1, this._ids, false, this));
            this._ids++;
            this._level.push(new BoxObject(i, 6, 1, this._ids, false, this));
        }
        this._syncCameraAndPlayerPosition();
        console.log('Camera position:', this._game.camera.position);
        console.log('Game scene:', this._game.scene);
    }
    _setUpScene() {
        this._game.scene = new THREE.Scene();
        this._game.scene.background = new THREE.Color('black');
        this._game.camera = new THREE.PerspectiveCamera(75, this._game.rendererWidth / this._game.rendererHeight, 0.1, 1000);
        this._game.camera.position.z = 10;
        if (this._debugMode) {
            const axesHelper = new THREE.AxesHelper(5);
            this._game.scene.add(axesHelper);
        }
    }
    _syncCameraAndPlayerPosition() {
        this._game.camera.position.x = this._player.position.x;
        this._game.camera.position.y = 0;
    }
    _removeOldChunks() {
        this._level.filter(box => box.position.x < this._player.position.x + 20);
        this._level.forEach(box => {
            if (box.position.x < this._player.position.x - 20) {
                const boxRef = box.id;
                this.unsubscribe(box);
                this._game.scene.remove(box.light);
                box.remove();
                this._level = this._level.filter(b => b.id !== boxRef);
            }
        });
    }
    _notifyLightBlocks(distance) {
        this._observers.forEach(o => {
            o.notify(distance);
        });
    }
    _updateScore() {
        this._scoreElem.innerText = Math.floor(this._player.position.x).toString();
    }
    update() {
        this._syncCameraAndPlayerPosition();
        this._removeOldChunks();
        this._chunkDistance = this._chunkDistance + this._player.speed;
        if (this._chunkDistance > 20) {
            this._lightBlocksPerChunk = 5;
            this._chunkDistance = 0;
            const chunk = LevelGenerator.generateChunk(this._player.position.x + 20);
            chunk.forEach(b => {
                this._ids++;
                let light = false;
                if (this._lightBlocksPerChunk > 0) {
                    light = Math.random() < 0.04 ? true : false;
                    if (light) {
                        this._lightBlocksPerChunk--;
                    }
                }
                let box = new BoxObject(b.x, b.y, b.z, this._ids, light, this);
                this._level.push(box);
            });
        }
        this._player.update();
        this._collide();
        this._updateScore();
        this._notifyLightBlocks(30);
    }
    _gameOver() {
        this._game.stage = new GameOverScreen();
    }
    _collide() {
        const playerBoundingBox = this._player.boundingBox;
        this._level.forEach(box => {
            box.update();
            const boxBoundingBox = box.boundingBox;
            if (playerBoundingBox.intersectsBox(boxBoundingBox)) {
                this._gameOver();
            }
        });
    }
    subscribe(observer) {
        this._observers.push(observer);
    }
    unsubscribe(observer) {
        this._observers = this._observers.filter(o => o !== observer);
    }
}
class LoadingScreen {
    constructor() {
        this._isMusicPlaying = false;
        this._lastProgress = 0;
        this._state = 'loading';
        this._frames = 0;
        this._debugMode = false;
        this._loadingText = document.getElementById('loading-text');
        this._loadingSubtitle = document.getElementById('loading-subtitle');
        this._loadingBox = document.getElementById('loading-screen');
        this._game = Game.getInstance();
        this._debugMode = this._game.debugMode;
        this._setUpScene();
        this._activateLoadingScreen();
    }
    _setUpScene() {
        this._game.scene = new THREE.Scene();
        this._game.camera = new THREE.PerspectiveCamera(75, this._game.rendererWidth / this._game.rendererHeight, 0.1, 1000);
        this._game.scene.background = new THREE.Color('white');
        this._audioListener = new THREE.AudioListener();
        this._game.camera.add(this._audioListener);
        this._audio = new THREE.Audio(this._audioListener);
        this._audio.setLoop(true);
        this._game.scene.add(this._audio);
    }
    _activateLoadingScreen() {
        this._resources = Resources.getInstance();
        this._resources.loadingScreen = this;
        this._resources.loadMain();
    }
    setProgressInformation(loaded, total) {
        const newProgress = Math.round(loaded / total * 100);
        if (newProgress >= this._lastProgress) {
            this._progress = newProgress;
        }
        this._lastProgress = newProgress;
    }
    update() {
        if (this._progress) {
            this._loadingText.innerText = `Loading... (${this._progress}%)`;
            this._loadingSubtitle.innerText = `${this._resources.loadedResources} of ${this._resources.totalResources} resources parsed`;
            if (this._progress === 100) {
                this._loadingText.innerText = 'Parsing resources...';
                if (this._resources.loadedResources === this._resources.totalResources) {
                    this._loadingText.innerText = 'Done!';
                    this._state = 'exiting';
                }
            }
        }
        else {
            this._loadingText.innerText = `Loading...`;
        }
        if (!this._debugMode && this._state === 'exiting') {
            if (this._frames < 50) {
                this._frames++;
                this._loadingBox.style.transform = `scale(${1 - this._frames / 50})`;
                this._loadingBox.style.opacity = `${1 - this._frames / 50}`;
                this._audio.setVolume(1 - this._frames / 50);
            }
            else {
                this._exit();
            }
        }
        if (this._resources.getMusic('loadingScreen') && !this._isMusicPlaying) {
            this._audio.setBuffer(this._resources.getMusic('loadingScreen').audio);
            this._audio.play();
            this._isMusicPlaying = true;
        }
    }
    _exit() {
        this._loadingBox.style.display = 'none';
        this._game.stage = new Level();
    }
}
class MainMenu {
    constructor() {
        this._game = Game.getInstance();
        this._game.scene = new THREE.Scene();
        this._game.scene.background = new THREE.Color('white');
        this._game.camera = new THREE.PerspectiveCamera(75, this._game.rendererWidth / this._game.rendererHeight, 0.1, 1000);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this._game.scene.add(cube);
        this._game.camera.position.z = 5;
    }
    update() { }
}
//# sourceMappingURL=main.js.map