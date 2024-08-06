// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDyulumEOYhmKG4-l9M1r2C_1RKDCtPZrs",
  authDomain: "barber-chat-a9cfb.firebaseapp.com",
  projectId: "barber-chat-a9cfb",
  storageBucket: "barber-chat-a9cfb.appspot.com",
  messagingSenderId: "947578991050",
  appId: "1:947578991050:web:1a1071c770afb366e89f33",
  measurementId: "G-M4ZBP9BX3Z"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias do Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
