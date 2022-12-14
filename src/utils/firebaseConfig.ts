import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "maphub-b1531.firebaseapp.com",
  projectId: "maphub-b1531",
  storageBucket: "maphub-b1531.appspot.com",
  messagingSenderId: "150673021987",
  appId: "1:150673021987:web:dad10a269041fb123e6596",
  measurementId: "G-1Q438SJ1WH",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
