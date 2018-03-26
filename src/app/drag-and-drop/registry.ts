/**
 * A wrapper around the JavaScript native `Map` object
 * that rejects the addition of a value if the key
 * already exists.
 */
export class Registry<T> {

  private items = new Map<string, T>();

  constructor() { }

  /**
   * Register a value for a given key. Returns `true` if the value was successfully
   * registered. Returns `false` if the key already exists.
   * @param key The key under which to register the value.
   * @param value The value to register.
   */
  register(key: string, value: T): boolean {
    if (this.has(key)) {
      return false;
    }
    this.items.set(key, value);
    return true;
  }

  /**
   * Unregisters a value from the registry.
   * @param value The value to unregister.
   */
  unregister(value: T): boolean {
    for (const [k, v] of Array.from(this.items)) {
      if (v === value) {
        return this.items.delete(k);
      }
    }
    return false;
  }

  /**
   * Returns the value for the given key.
   * Returns `undefined` if no value for the given key exists.
   * @param key The key for which to return the value.
   */
  get(key: string): T {
    return this.items.get(key);
  }

  /**
   * Returns `true` if a value for the given key exists.
   * Returns `false` otherwise.
   * @param key The key for which to check if a value exists.
   */
  has(key: string): boolean {
    return this.items.has(key);
  }
}
