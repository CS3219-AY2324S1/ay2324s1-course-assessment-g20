import { useCallback, useState } from 'react';

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
