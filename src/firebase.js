import firebase from 'firebase';
require('dotenv').config();

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'todo-list-app-17890.firebaseapp.com',
  databaseURL: 'https://todo-list-app-17890.firebaseio.com',
  projectId: 'todo-list-app-17890',
  storageBucket: 'todo-list-app-17890.appspot.com',
  messagingSenderId: '977279778354',
  appId: '1:977279778354:web:c9096f0ccc242ba49bc62b',
  measurementId: 'G-Z49GTD9H53',
});

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/todos',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

const auth = firebase.auth();

export { auth, uiConfig };
