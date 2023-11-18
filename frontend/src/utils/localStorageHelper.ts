export function readLocalStorage<T>(key: string) {
  const localStorageValue = window.localStorage.getItem(key);
  return localStorageValue ? (JSON.parse(localStorageValue) as T) : null;
}

export function setLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
