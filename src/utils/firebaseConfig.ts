import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnKKSzPugq2uS2FKPS1R5OipJeiD_bztc",
  authDomain: "mapmap-beaa7.firebaseapp.com",
  projectId: "mapmap-beaa7",
  storageBucket: "mapmap-beaa7.appspot.com",
  messagingSenderId: "1010603280545",
  appId: "1:1010603280545:web:b168195c33b7f43dea08e0",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
