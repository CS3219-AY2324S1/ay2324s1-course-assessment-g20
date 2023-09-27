import axios from 'axios';
import baseAxiosConfig from './baseAxiosConfig';

const unauthorizedAxios = axios.create(baseAxiosConfig);

export default unauthorizedAxios;
