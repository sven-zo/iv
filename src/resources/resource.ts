class Resource {
    protected _name: string; 

    public get name(): string {
        return this._name;
    }  

    constructor(name: string) {
        this._name = name
    }
}