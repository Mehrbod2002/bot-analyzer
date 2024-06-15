import axios from 'axios';
import { toast } from 'react-toastify';

export const baseUrlServer = "https://newfeed.londonfinancial.com";

export const request = axios.create({
  baseURL: baseUrlServer,
  timeout: 10000,
  validateStatus: function (_status) {
    return true;
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiGet = async (
  url: string,
  headers?: any
): Promise<[boolean, any]> => {
  try {
    if (headers == undefined) {
      headers = [];
    }
    const response = await request.get(url, {
      headers: headers
    });
    if (response.data.success || response.status == 200) {
      return [true, response.data];
    }
    toast.error(response.data.message, { autoClose: 2000 });
    return [false, null];
  } catch (err) {
    toast.error('Invalid request', { autoClose: 2000 });
    return [false, null];
  }
};

const api = async (
  url: string,
  data: any,
  headers?: any
): Promise<[boolean, any]> => {
  try {
    if (headers == undefined) {
      headers = [];
    }
    const response = await request.post(url, data, {
      headers: headers
    });
    if (response.data.success || response.status == 200) {
      return [true, response.data];
    }
    toast.error(response.data.message, { autoClose: 2000 });
    return [false, response.data.message];
  } catch (err) {
    toast.error('Invalid request', { autoClose: 2000 });
    return [false, 'Invalid Request'];
  }
};

export const toQuery = (obj: any, parentKey = '') => {
  const keyValuePairs = [];

  const encodeKeyValuePair = (key: string, value: any) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        keyValuePairs.push(
          encodeURIComponent(`${key}[]`) + '=' + encodeURIComponent(item)
        );
      });
    } else if (typeof value === 'object' && value !== null) {
      for (const nestedKey in value) {
        if (value.hasOwnProperty(nestedKey)) {
          const nestedValue = value[nestedKey];
          encodeKeyValuePair(`${key}[${nestedKey}]`, nestedValue);
        }
      }
    } else {
      keyValuePairs.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(value)
      );
    }
  };

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      encodeKeyValuePair(fullKey, value);
    }
  }

  return keyValuePairs.join('&');
};

export const StoreNotification = (body: string) => {
  if (typeof window !== 'undefined') {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push({ body: body, timestamp: new Date() });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
};

export const GetAllNotifications = () => {
  if (typeof window !== 'undefined') {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    return notifications;
  }
};

export default api;
