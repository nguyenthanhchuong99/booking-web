import Cookies from 'js-cookie';

export const setCookie = (key: string, value: any) => {
  Cookies.set(key, JSON.stringify(value));
};

export const getCookie = (str: string) => {
  switch (str) {
    case 'roles':
      return JSON.parse(Cookies.get('roles') || '[]');
    case 'token':
      return Cookies.get('token');
    case 'name':
      return Cookies.get('name');
    case 'id':
      return Cookies.get('id');
    default:
      throw new Error('Not Found Options');
  }
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
