import { token } from "../constant/constant";

export const getHeaders = async () => {
   const headers = await {
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': true,
  };

  return headers;
};
