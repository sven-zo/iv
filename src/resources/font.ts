/// <reference path="resource.ts" />

class Font extends Resource {
    private _typeface: THREE.Font;
    private _geometry: THREE.TextGeometry; 
  
    public get typeface(): THREE.Font {
        return this._typeface;
    }

    public get geometry(): THREE.TextGeometry {
      return this._geometry; 
    }

    constructor(typeface: THREE.Font, geometry: THREE.TextGeometry, name: string) {
      super(name)
      this._typeface = typeface;
      this._geometry = geometry; 
    }
  }