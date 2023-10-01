import React, { useState } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

export function useAuth() {
  return React.useContext(AuthContext);
}

// Hook that rethrows async errors inside of React lifecycle
export const useThrowAsyncError = () => {
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
