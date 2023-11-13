export enum PEERPREP_EXCEPTION_TYPES {
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  METHOD_NOT_ALLOWED = 'Method Not Allowed',
  NOT_ACCEPTABLE = 'Not Acceptable',
  REQUEST_TIMEOUT = 'Request Timeout',
  CONFLICT = 'Conflict',
  GONE = 'Gone',
  PAYLOAD_TOO_LARGE = 'Payload Too Large',
  UNSUPPORTED_MEDIA_TYPE = 'Unsupported Media Type',
  I_AM_A_TEAPOT = "I'm a teapot",
  MISDIRECTED = 'Misdirected Request',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  FAILED_DEPENDENCY = 'Failed Dependency',
  PRECONDITION_REQUIRED = 'Precondition Required',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_IMPLEMENTED = 'Not Implemented',
  BAD_GATEWAY = 'Bad Gateway',
  SERVICE_UNAVAILABLE = 'Service Unavailable',
  GATEWAY_TIMEOUT = 'Gateway Timeout',
  HTTP_VERSION_NOT_SUPPORTED = 'HTTP Version Not Supported',
}

export enum MONGO_SERVER_ERROR_CODES {
  DUPLICATE_KEY = 11000,
}

export const GRPC_UNKNOWN_ERROR = '2 UNKNOWN: ';
