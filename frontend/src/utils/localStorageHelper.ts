export function readLocalStorage<T>(key: string, defaultValue: T) {
  const localStorageValue = window.localStorage.getItem(key);
  return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
}

export function setLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
