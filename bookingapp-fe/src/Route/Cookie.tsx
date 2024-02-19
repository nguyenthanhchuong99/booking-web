import Cookies from 'js-cookie';

const getCookie = (str: string) => {
  switch (str) {
    case 'roles':
      return JSON.parse(Cookies.get('roles') || '[]');
    case 'token':
      return Cookies.get('token');
    case 'name':
      return Cookies.get('name');
    default:
      throw new Error('Not Found Cookies');
  }
};

export default getCookie;
