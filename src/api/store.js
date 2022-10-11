export default class Store {
  constructor(storeKey, storage) {
    this._storage = storage;
    this._storeKey = storeKey;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
      this._storeKey,
      JSON.stringify(items),
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(key) {
    const store = this.getItems();
console.log (key);
    delete store[key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
    );
  }
}
