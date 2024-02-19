// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", () => {
  // eslint-disable-next-line no-restricted-globals
  const urlParams = new URLSearchParams(location.search);
  // eslint-disable-next-line no-restricted-globals
  self.firebaseConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

if (typeof firebase !== "undefined") {
  // eslint-disable-next-line no-undef, no-restricted-globals
  firebase.initializeApp(self.firebaseConfig || defaultConfig);
  // eslint-disable-next-line no-undef
  if (firebase.messaging.isSupported()) {
    // eslint-disable-next-line no-undef
    const messaging = firebase.messaging();
    const channel = new BroadcastChannel("notifications");
    messaging.onBackgroundMessage(function (payload) {
      channel.postMessage(payload);
    });
  }
}
