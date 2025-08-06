import axios, { AxiosRequestConfig } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

// GET request
export const getData = async <T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await axios.get<T>(`${apiUrl}${endpoint}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST request
export const postData = async <T>(
  endpoint: string,
  data: unknown,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.post(`${apiUrl}${endpoint}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT request
export const putData = async <T>(
  endpoint: string,
  data: unknown,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.put(`${apiUrl}${endpoint}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const deleteData = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await axios.delete(`${apiUrl}${endpoint}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
