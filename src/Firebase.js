import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {};

const config = {
    apiKey: "AIzaSyCg-neRqo2KXgdqkJmXectoq5koP8le9fc",
    authDomain: "mexicocitymap.firebaseapp.com",
    databaseURL: "https://mexicocitymap.firebaseio.com",
    projectId: "mexicocitymap",
    storageBucket: "mexicocitymap.appspot.com",
    messagingSenderId: "1080231581194"
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;