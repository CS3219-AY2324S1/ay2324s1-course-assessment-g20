import { MONGO_SERVER_ERROR_CODES } from '../constants';

export const isMongoServerError = (error) => error.name === 'MongoServerError';

export const mapMongoServerErrorToCustomMessage = (error) => {
  if (error.name === 'MongoServerError') {
    switch (error.code) {
      case MONGO_SERVER_ERROR_CODES.DUPLICATE_KEY:
        const dupKeyInfo = error.message.match(/dup key: { (.+?) }/);

        if (dupKeyInfo) {
          return `A record with the following key already exists: ${dupKeyInfo[1]}.`;
        }

        return 'This record already exists.';
      default:
        return 'A MongoDB error occurred.';
    }
  }
};
