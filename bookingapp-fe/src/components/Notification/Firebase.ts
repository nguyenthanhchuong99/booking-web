import firebase from 'firebase/app';
import 'firebase/messaging';
import { firebaseConfig } from '../../constant/constant';
import { handleError } from '../../ultils/ultilsApi';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

let messaging: firebase.messaging.Messaging | undefined;

if (typeof window !== 'undefined') {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}

export const getMessagingToken = async () => {
  let currentToken = '';
  if (!messaging) return;
  try {
    messaging
      .getToken({
        vapidKey:
          'BKO45vptwLYl1MujSXJ9UqdhmLJ7XWk66MgQgx_B-ojzqvE-XAl9FbftZmAN8abfPSDQ2Gndod4S0Lp4JlFZwRE',
      })
      .then(token => {
        currentToken = token;
      })
      .catch(e => {
        handleError(e);
      });
    currentToken = await messaging.getToken({
      vapidKey:
        'BKO45vptwLYl1MujSXJ9UqdhmLJ7XWk66MgQgx_B-ojzqvE-XAl9FbftZmAN8abfPSDQ2Gndod4S0Lp4JlFZwRE',
    });
  } catch (error) {
    handleError(error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise(resolve => {
    messaging?.onMessage(payload => {
      resolve(payload);
    });
  });
