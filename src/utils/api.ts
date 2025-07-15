import axios, { AxiosRequestConfig } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

// GET request
export const getData = async <T = any>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, config);
    return response.data;
  } catch (error: any) {
    console.error('GET request failed:', error);
    throw error.response?.data || error;
  }
};

// POST request
export const postData = async <T = any>(
  endpoint: string,
  data: any,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.post(`${apiUrl}${endpoint}`, data, config);
    return response.data;
  } catch (error: any) {
    console.error('POST request failed:', error);
    throw error.response?.data || error;
  }
};

// PUT request
export const putData = async <T = any>(
  endpoint: string,
  data: any,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.put(`${apiUrl}${endpoint}`, data, config);
    return response.data;
  } catch (error: any) {
    console.error('PUT request failed:', error);
    throw error.response?.data || error;
  }
};

// DELETE request
export const deleteData = async <T = any>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.delete(`${apiUrl}${endpoint}`, config);
    return response.data;
  } catch (error: any) {
    console.error('DELETE request failed:', error);
    throw error.response?.data || error;
  }
};
