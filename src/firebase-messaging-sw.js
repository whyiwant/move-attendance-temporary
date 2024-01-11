importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyAIlN3oUnQV8Mh2RryOARBMFfYqrs2yOfo",
  authDomain: "test-5e504.firebaseapp.com",
  databaseURL: "https://test-5e504.firebaseio.com",
  projectId: "test-5e504",
  storageBucket: "test-5e504.appspot.com",
  messagingSenderId: "389442762899",
  appId: "1:389442762899:web:a714ee9ec4b6bcc1417566",
  measurementId: "G-DYK0Q0WYZZ",
});
const messaging = firebase.messaging();
