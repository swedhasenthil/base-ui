importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
	apiKey: "AIzaSyAaRLFSEm5PpkjePhCEy57EPbMq8OAXutQ",
  authDomain: "esneks-dev.firebaseapp.com",
  projectId: "esneks-dev",
  messagingSenderId: "1008442334034",
  appId: "1:1008442334034:web:01f08d19e98078e58cf88b"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then(windowClients => {
    windowClients[0] && self.clients.get(windowClients[0].id).then(function(client) {
 
      client.postMessage(payload);
    });
  })
});