/// <reference path="resource.ts" />

class Music extends Resource {
  private _audio: THREE.AudioBuffer;

  public get audio(): THREE.AudioBuffer {
    return this._audio;
  }

  constructor(audio: THREE.AudioBuffer, name: string) {
    super(name);
    this._audio = audio;
  }
}
