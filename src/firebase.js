import firebase from 'firebase';

const  firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyByxckxV6tXDCQXmpZPzR-aMRsHxDbaTGY",
    authDomain: "products-app-31e5a.firebaseapp.com",
    databaseURL: "https://products-app-31e5a.firebaseio.com",
    projectId: "products-app-31e5a",
    storageBucket: "products-app-31e5a.appspot.com",
    messagingSenderId: "278341215535",
    appId: "1:278341215535:web:04f9731bbe9b2d23a02dda"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider};

