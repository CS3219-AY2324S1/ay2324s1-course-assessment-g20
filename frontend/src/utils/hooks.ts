import React from 'react';
import { AuthContext } from '../App';
import { readLocalStorage, setLocalStorage } from './localStorageHelper';

/**
 * This hook usage is similar to React.useState, the only difference
 * being that the state is also written to local storage at the specified key on state updates.
 *
 * When calling this hook, the value will take on the stored value in local storage (if any).
 * If this key-value does not exist in local storage yet, the default value will be used.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(readLocalStorage(key, defaultValue));

  React.useEffect(() => {
    setLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function useAuth() {
  return React.useContext(AuthContext);
}
