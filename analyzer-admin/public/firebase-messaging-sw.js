importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCUe-tja_qrfUgxdvOJs-Z7fpMt7d_EMtQ",
    authDomain: "carat-b4654.firebaseapp.com",
    projectId: "carat-b4654",
    storageBucket: "carat-b4654.appspot.com",
    messagingSenderId: "774391439124",
    appId: "1:774391439124:web:52799fbc6eec99ff6b2c01",
    measurementId: "G-5061FGNKYJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    self.registration.showNotification(payload.notification.title, payload.notification.body);
});
