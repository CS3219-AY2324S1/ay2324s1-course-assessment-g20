import React, { useCallback, useState } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

export function useAuth() {
  return React.useContext(AuthContext);
}

// Hook that rethrows async errors inside of React lifecycle
export const useThrowAsyncError = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, throwInReactLifecycle] = useState();
  const throwAsyncError = useCallback((error: Error | string) => {
    throwInReactLifecycle(() => {
      if (typeof error === 'string') {
        error = new Error(error);
      }
      throw error;
    });
  }, []);

  return throwAsyncError;
};
