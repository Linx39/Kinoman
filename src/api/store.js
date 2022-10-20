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

  getItem(key) {
    return this.getItems()[key] || {};
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
      JSON.stringify({...store, [key]: value}),
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
    );
  }
}
