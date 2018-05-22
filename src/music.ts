class Music {
  private _name: string;
  private _audio: THREE.AudioBuffer;

  constructor(audio: THREE.AudioBuffer, name: string) {
    this._audio = audio;
    this._name = name;
  }

  public get audio(): THREE.AudioBuffer {
    return this._audio;
  }

  public get name(): string {
    return this._name;
  }
}
