export type PeerprepBackendErrorDetails = {
  error: string;
  message: string;
  method: string;
  path: string;
  statusCode: number;
  timestamp: string;
};

export class PeerprepBackendError extends Error {
  details: PeerprepBackendErrorDetails;
  constructor(details: PeerprepBackendErrorDetails) {
    super(details.message);
    this.details = details;
  }
}

export const DEFAULT_PEERPREP_BACKEND_ERROR = {
  error: 'Internal Server Error',
  message: 'Something went wrong',
  method: '',
  path: '',
  statusCode: 500,
  timestamp: new Date().toISOString(),
};
