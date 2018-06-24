# iv
![New game, new logo](https://imgur.com/download/mEulzBQ)

Don't fail. Avoid the boxes. The sequel to _iii_. Now in three dimensions! :video_game:
[Click here to play](https://sven-zo.github.io/iv)

# How to install locally
1. *Clone or download* the game to your computer.
2. Run `npm i` or `yarn` to install the required dependencies.
3. Compile the `/src` folder using [TypeScript](https://www.typescriptlang.org/)
    - In [Visual Studio Code](https://code.visualstudio.com/) you can do this by opening the project and hitting `Cmd/Ctrl + Shift + B`
4. Host the `/docs` folder locally.
    - You can do this using [http-server](https://www.npmjs.com/package/http-server) or other software/CLI like XAMPP.
5. Open the hosted game in a browser.

# UML
[Click here to see the UML](https://drive.google.com/open?id=1HCWNaKqVOfY-K3LwaNsFza240T_ZfUFa)

# Peer review
https://github.com/Goef/PRGM8/issues/4

# Pull request
https://github.com/sven-zo/dodge
https://github.com/maniflames/dodge/pull/1

I added new wall animations using the strategy pattern. These improve the game by adding new walls to dodge.
I also added a score counter using the game using a normal class. This improves the game by providing a score, thus encouraging players to try and beat their last score.

# Singleton
Ik heb het singleton pattern toegepast op de `Game` en `Resources` classes omdat er maar 1 van elk nodig zijn. Er is maar één `Game` class nodig omdat er maar één game tegelijk draait, en is ook maar één kopie van alle references naar alle geladen resources nodig.

- [Voorbeeld van dit patroon in de Game class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/game.ts#L83)
- [Voorbeeld van dit patroon in de Resources class](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/resources.ts#L104)
```typescript
public static getInstance(): Resources {
    if (!Resources._instance) {
      this._instance = new Resources();
    }
    return this._instance;
  }
```

# Polymorfisme
Polymorfisme wordt toegepast met `GameObjects` en `BoxObject`.
Meerdere classes zijn een `GameObject` zodat alles wat te maken heeft met collision en beweging al ingebouwd is. Zo hoef je niet elke keer dezelfde code te schrijven voor objecten die zich in het level bevinden.
`BoxObjectWithLight` en `BoxObjectWithoutLight` zijn beide een `BoxObject`. Deze twee classes zijn om de boxen met lamp en de boxen zonder lamp te onderscheiden, en om de constructor te verkorten.

- [Player is een GameObject](https://github.com/sven-zo/iv/blob/master/src/gameObject/player/player.ts)
- [BoxObjectWithoutLight is een BoxObject](https://github.com/sven-zo/iv/blob/master/src/gameObject/boxObjectWithoutLight.ts)
```typescript
class BoxObjectWithoutLight extends BoxObject implements Observer {
  constructor(x: number, y: number, z: number, id: number, level: Level) {
    super(x, y, z, id, false, level);
  }

  public notify(distance: number): void {
    this.light.distance = distance;
  }
}
```

# Strategy
De `Stage`'s in de game zijn gemaakt volgens het strategy pattern. Dit is zodat er in runtime gewisseld kan worden tussen andere stages. Voorbeelden van stages zijn `Level` en `GameOverScreen`.

- [Voorbeeld van dit patroon in de Game class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/game.ts#L63)
```typescript
public set stage(stage: Stage) {
    this._stage = stage;
  }
```
- [Stages worden aangeroepen in de game loop](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/game.ts#L74)
```typescript
if (this._stage) {
      this._stage.update();
    }
 ```
- [Voorbeeld van dit patroon in de GameOverScreen class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/stages/gameOverScreen.ts#L1)
```typescript
class GameOverScreen implements Stage { ...
```
- [Voorbeeld van dit patroon in de Stage interface.](https://github.com/sven-zo/iv/blob/master/src/stage.ts)
```typescript
interface Stage {
  update(): void;
}
```

# Observer
Sommige boxen in de game zijn lampen. Naar mate de speler vordert in het spel zullen alle lampen dimmen. Dit is toegepast volgens het `Observer` pattern. `Level` is de subject, en `BoxObject` is de observer.

- [Observer interface](https://github.com/sven-zo/iv/blob/master/src/observer.ts)
```typescript
interface Observer {
  notify(distance: number): void;
}
```
- [Subject interface](https://github.com/sven-zo/iv/blob/master/src/subject.ts)
```typescript
interface Subject {
  _observers: Observer[];
  ...
```
- [Voorbeeld van dit patroon in de Level class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/stages/level.ts#L166)
```typescript
public unsubscribe(observer: Observer): void {
    this._observers = this._observers.filter(o => o !== observer);
  }
```
- [Het notify'en van boxes in de Level class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/stages/level.ts#L88)
```typescript
private _notifyLightBlocks(distance: number): void {
    this._observers.forEach(o => {
      o.notify(distance);
    });
  }
```
- [Voorbeeld van dit patroon in de BoxObject class.](https://github.com/sven-zo/iv/blob/78bfe572eda9fd9ffbce3dc8fce0890eb9c615d3/src/gameObject/boxObject.ts#L43)
```typescript
public notify(distance: number): void {
    this.light.distance = distance;
  }
```

# Gameplay componenten
### De game werkt met Canvas en/of WebGL in plaats van DOM elementen
Ik heb [Three.js](https://threejs.org/) gebruikt om de game in Canvas / WebGL te renderen.
Bepaalde UI-elementen zijn wel in de DOM gerenderd, maar de game zelf draait in Canvas / WebGL.

### De game gebruikt een externe library zoals hieronder genoemd
Ik heb [Three.js](https://threejs.org/) gebruikt om de game in Canvas / WebGL te renderen.

### De game heeft interactief geluid en muziek
Het loading screen heeft muziek die wegfade als het spel begint. Ook heb je muziek tijdens het spelen van de game. Als je doodgaat speelte er een interactief game over geluid.


### De game heeft levels met een oplopende moeilijkheidsgraad.
Het spel wordt moeilijker naarmate de speler verder komt.
Op dit moment heeft de game 3 levels.
- LEVEL 1: De normale difficulty.
- LEVEL 2: Vanaf een score van 300. De lichten gaan uit.
- LEVEL 3: Vanaf een score van 600. De speler gaat sneller bewegen waardoor het spel moeilijker wordt, maar je krijgt ook sneller score.

### De game ziet er visueel aantrekkelijk uit. Er is aandacht besteed aan een solide UI en aan een consistent grafisch ontwerp
De game is een opvolger van het minimalistische [iii](https://github.com/sven-zo/iii), maar dan met wat polishes. Zo zijn de kubussen van iii terug, maar ze zijn nu belicht met rood, blauw, en groen licht voor een arcade-gevoel. Licht en reflecties spelen ook een grote rol, want ze beïnvloeden je zichtbaarheid en dus ook de gameplay. Ook is de hoofdpersonage van iii terug maar dan in 3D. De game is gebaseerd op de kleuren zwart, wit, en grijs. Net als de vorige keer. Het loading screen is zwart-wit met een zwarte draaiende kubus. De speler is wit in de zwarte omgeving, met grijze blokjes die belicht worden. De speler zelf geeft wit licht af. Alle tekst elementen in de game zijn in de font Source Sans Pro in bold italics. De subtitels zijn niet italic of bold voor betere leesbaarheid. Ook staan alle tekstelementen in de game in het midden zodat de speler er sneller focus op legt. Het game over scherm is puur rood om een ontrustende vibe af te geven. Al met al heeft de hele game een grafisch ontwerp wat lijkt op de minimalistische voorganger, met toegevoegde arcade inspiraties en nieuwe 3D elementen. Alles valt onder 1 ontwerp.
Ik zou wel eeuwig kunnen doorgaan over hoe visueel aantrekkelijk het er uit ziet, [maar het is waarschijnlijk leuker om zelf even te kijken](https://sven-zo.github.io/iv/). :)
