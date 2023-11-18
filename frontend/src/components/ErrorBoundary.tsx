import { useEffect, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

const INITIAL_SECONDS_BEFORE_NAVIGATE = 4;

const Fallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const navigate = useNavigate();
  const [secondsBeforeNavigate, setSecondsBeforeNavigate] = useState(
    INITIAL_SECONDS_BEFORE_NAVIGATE,
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (secondsBeforeNavigate === 0) {
        resetErrorBoundary();
        return navigate('/');
      }
      setSecondsBeforeNavigate(secondsBeforeNavigate - 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (
    <div>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <p>Redirecting back to application in {secondsBeforeNavigate} seconds...</p>
    </div>
  );
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={Fallback}>{children}</ReactErrorBoundary>
);

export default ErrorBoundary;
