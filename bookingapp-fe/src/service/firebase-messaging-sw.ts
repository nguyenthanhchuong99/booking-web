import { handleError } from '../ultils/ultilsApi';
import { firebaseConfig } from '../constant/constant';
if ('serviceWorker' in navigator) {
  const firebaseConfigParams = new URLSearchParams(firebaseConfig).toString();
  navigator.serviceWorker
    .register(`../firebase-messaging-sw.js?${firebaseConfigParams}`)
    .catch(function (err) {
      handleError(err);
    });
}
