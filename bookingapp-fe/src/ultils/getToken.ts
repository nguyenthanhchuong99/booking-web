import getCookie from '../Route/Cookie';
import { handleErrorShow } from './ultilsApi';

export const getTokenAsync = async () => {
  try {
    const token = await getCookie('token');

    if (token) {
      return token;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    handleErrorShow(error);
  }
};
