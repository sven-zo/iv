"use strict";
class CollisionChecker {
    constructor(player) {
        this._player = player;
    }
    predictedCollisionPlayerCube(cube) {
        if (!(this._player.behaviour instanceof Jump)) {
            return;
        }
        const jump = this._player.behaviour;
        const cubeTop = cube.upperFace[0].y;
        const cubeXMax = cube.upperFace.reduce((previous, current) => { return previous.x > current.x ? previous : current; }).x;
        const cubeXMin = cube.upperFace.reduce((previous, current) => { return previous.x < current.x ? previous : current; }).x;
        const cubeZMax = cube.upperFace.reduce((previous, current) => { return previous.z > current.z ? previous : current; }).z;
        const cubeZMin = cube.upperFace.reduce((previous, current) => { return previous.z < current.z ? previous : current; }).z;
        const arcGeo = this._player.behaviour.arc.geometry;
        const moreSpecificPoints = arcGeo.vertices.map((point, index, array) => {
            if (index + 1 < array.length) {
                return new THREE.LineCurve3(array[index], array[index + 1]).getPoints();
            }
        });
        const points = moreSpecificPoints.reduce((previous, current, index, array) => {
            if (previous && current) {
                return previous.concat(current);
            }
            else if (previous && !current) {
                let skippedArray = array[0];
                return previous.concat(skippedArray);
            }
        });
        points.forEach((point) => {
            if (point.y <= cubeTop + 0.1 && point.y >= cubeTop - 0.1 &&
                point.x <= cubeXMax && point.x >= cubeXMin &&
                point.z <= cubeZMax && point.z >= cubeZMin) {
                jump.cancelPosition = point;
                this._lastPlayerCubeHit = cube;
            }
        });
    }
    checkPlayerCube(genetatedLevel) {
        const currentCheck = genetatedLevel.filter((cube) => {
            if (cube.position.x > this._player.position.x - 12 && cube.position.x < this._player.position.x + 12) {
                return cube;
            }
        });
        currentCheck.forEach((cube) => {
            this.predictedCollisionPlayerCube(cube);
            if (this._player.boundingBox.intersectsBox(cube.boundingBox) && cube != this._lastPlayerCubeHit) {
                return this._player.behaviour = new Die(this._player);
            }
        });
    }
}
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
        this.genetatedLevel = [];
        this.game = Game.getInstance();
        this.resourceLoader = Resources.getInstance();
        this.game.scene = new THREE.Scene();
        this.game.scene.background = new THREE.Color('white');
        this.game.camera = new THREE.PerspectiveCamera(75, this.game.rendererWidth / this.game.rendererHeight, 0.1, 1000);
        this.game.camera.position.z = 10;
        const axesHelper = new THREE.AxesHelper(5);
        this.game.scene.add(axesHelper);
        LevelGenerator.generate().then(level => {
            console.log(level);
            level.forEach(element => {
                let cube = new LevelCube(element.x, element.y, element.z);
                this.genetatedLevel.push(cube);
            });
            this.player = new Player(-5, -0.5, 1);
            this.collisionChecker = new CollisionChecker(this.player);
        });
    }
    syncCameraAndPlayerPosition() {
        this.game.camera.position.x = this.player.position.x;
        this.game.camera.position.y = this.player.position.y;
    }
    update() {
        this.collisionChecker.checkPlayerCube(this.genetatedLevel);
        this.syncCameraAndPlayerPosition();
        this.player.update();
    }
}
class LevelGenerator {
    static generate() {
        return new Promise((resolve, reject) => {
            const level = [];
            const levelLength = Math.random() * 500;
            for (let i = 0; i < levelLength; i += 1.5) {
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
            this.loadingSubtitle.innerText = `${this.resources.loadedResources} of ${this.resources.totalResources} resources parsed`;
            if (this.progress === 100) {
                this.loadingText.innerText = 'Parsing resources...';
                if (this.resources.loadedResources === this.resources.totalResources) {
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
class Progress {
    constructor(loaded, total) {
        this.loaded = loaded;
        this.total = total;
    }
}
class Resources {
    constructor() {
        this._music = [];
        this._fonts = [];
        this.totalResources = 3;
    }
    setLoadingScreen(loadingScreen) {
        this.loadingScreen = loadingScreen;
    }
    loadMain() {
        this.audioLoader = new THREE.AudioLoader();
        this.fontLoader = new THREE.FontLoader();
        this.addToAudioLoader('assets/music/ElementarySD.mp3', 'loadingScreen');
        this.addToAudioLoader('assets/music/500480_Press-Start.mp3', 'mainMenu');
        this.addToFontLoader('assets/fonts/Roboto_Italic.json', 'robotoItalic');
    }
    addToAudioLoader(url, name) {
        this.audioLoader.load(url, (audioBuffer) => {
            console.log('[Audioloader] Done loading: ', name);
            this._music.push(new Music(audioBuffer, name));
        }, (progress) => this.setProgress(progress), (error) => {
            console.log('[Audioloader] An error happened', error);
        });
    }
    addToFontLoader(url, name) {
        this.fontLoader.load(url, (font) => {
            console.log('[FontLoader] Done loading: ', name);
            let geometry = new THREE.TextGeometry('i', { font: font, size: 1, height: 0.25 });
            this._fonts.push(new Font(font, geometry, name));
        }, (progress) => {
            this.setProgress(progress);
        }, (error) => {
            console.error('[FontLoader] An error occured', error);
        });
    }
    setProgress(progress) {
        this.loadingScreen.setProgressInformation(progress.loaded, progress.total);
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
        if (!Resources.instance) {
            this.instance = new Resources();
        }
        return this.instance;
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
class LevelCube extends GameObject {
    constructor(x, y, z) {
        super(new THREE.BoxGeometry(4, 1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('grey') }), new THREE.Vector3(x, y, z));
    }
}
class Player extends GameObject {
    constructor(x, y, z) {
        super(Resources.getInstance().getFont('robotoItalic').geometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }), new THREE.Vector3(x, y, z));
        this._speed = 0.05;
        this._keydownCb = (e) => { this.keydownHandler(e); };
        window.addEventListener('keydown', this._keydownCb);
        this._behaviour = new Run(this);
    }
    get speed() {
        return this._speed;
    }
    get behaviour() {
        return this._behaviour;
    }
    set behaviour(behaviour) {
        this._behaviour = behaviour;
    }
    keydownHandler(e) {
        if (e.key === ' ' && !(this._behaviour instanceof Jump)) {
            this._behaviour = new Jump(this);
        }
    }
    remove() {
        super.remove();
        window.removeEventListener('keydown', this._keydownCb);
    }
    update() {
        super.update();
        this._behaviour.update();
    }
}
class Die {
    constructor(player) {
        this.player = player;
    }
    update() {
        this.player.remove();
        console.warn('not implemented, removed player');
    }
}
class Jump {
    constructor(player, visibleArc) {
        this._distance = 0;
        this._height = 0.2;
        this._canceled = false;
        this.player = player;
        this._arc = this.generateArc();
        if (visibleArc) {
            Game.getInstance().scene.add(this._arc);
        }
    }
    get arc() {
        return this._arc;
    }
    get cancelPosition() {
        return this._cancelPosition;
    }
    set cancelPosition(position) {
        this._cancelPosition = position;
    }
    calculateHeight(weight_distance, weight_height) {
        let a = 1 - weight_distance;
        let b = weight_height;
        let x = this._distance;
        return (-a * Math.pow(x, 2)) + (b * x);
    }
    generateArc() {
        const arc = new THREE.Path();
        arc.absellipse(this.player.position.x + 1, this.player.position.y, 0.6, 2.8, Math.PI, 2 * Math.PI, true, 0);
        const points2D = arc.getPoints();
        const points3D = points2D.map((point) => { return new THREE.Vector3(point.x, point.y, this.player.position.z); });
        const geometry = new THREE.Geometry().setFromPoints(points3D);
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        return new THREE.Line(geometry, material);
    }
    cancel() {
        if (!this._cancelPosition) {
            return;
        }
        if (this._cancelPosition.y + 0.15 >= this.player.position.y && this._cancelPosition.y - 0.15 <= this.player.position.y) {
            this._canceled = true;
            this.player.behaviour = new Run(this.player);
        }
    }
    update() {
        if (this._canceled) {
            return;
        }
        this.cancel();
        this.player.position.x += this.player.speed;
        this._distance += this.player.speed;
        this.player.position.y += this._height;
        this._height = this.calculateHeight(0.04, 0.9);
    }
}
class Run {
    constructor(player) {
        this.player = player;
    }
    update() {
        this.player.mesh.position.x += this.player.speed;
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
//# sourceMappingURL=main.js.map