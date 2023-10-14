import axios, { AxiosRequestConfig } from 'axios';

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql/';

export const getLcEndpointRequestConfig = (data: any): AxiosRequestConfig => ({
  method: 'post',
  maxBodyLength: Infinity,
  url: LEETCODE_GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
});

export const sendHttpRequest = (requestConfig: AxiosRequestConfig) => {
  return axios.request(requestConfig);
};
