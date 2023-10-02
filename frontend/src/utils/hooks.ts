import React, { useState } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

export function useAuth() {
  return React.useContext(AuthContext);
}

// Hook that rethrows async errors inside of React lifecycle
export const useThrowAsyncError = () => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, throwInReactLifecycle] = useState();
  return (error: Error | string) => {
    throwInReactLifecycle(() => {
      if (typeof error === 'string') {
        error = new Error(error);
      }
      throw error;
    });
  };
};
