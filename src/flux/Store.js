export class Store {
    constructor(dispatcher) {
        this._listeners = [];
        this._state = this.getInitialState();
        dispatcher.register(this._onDispatch.bind(this));
    }
    _onDispatch() {
        throw new Error("Subclasses must override _onDispatch method of a Flux Store");
    }
    getInitialState() {
        throw new Error("Subclasses must override getInitialState method of a Flux Store");
    }
    addListener(listener) {
        this._listeners.push(listener);
    }
    _emitChange() {
        this._listeners.forEach(listener => listener(this._state))
    }
}