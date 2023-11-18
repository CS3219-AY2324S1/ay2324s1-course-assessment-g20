import { CreateAxiosDefaults } from 'axios';
import { getBackendPath } from '../../utils/api';

const baseAxiosConfig: CreateAxiosDefaults = {
  baseURL: getBackendPath(),
  headers: {
    'Content-Type': 'application/json',
  },
};

export default baseAxiosConfig;
