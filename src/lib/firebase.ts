import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config values provisioned dynamically in firebase-applet-config.json
const firebaseConfig = {
  apiKey: "api key goes here",
  authDomain: "gen-lang-client-0360636982.firebaseapp.com",
  projectId: "gen-lang-client-0360636982",
  storageBucket: "gen-lang-client-0360636982.firebasestorage.app",
  messagingSenderId: "848610563150",
  appId: "1:848610563150:web:36d0a2a19b0aba68f4df1f"
};

const app = initializeApp(firebaseConfig);

// Establish connection to the custom Firestore database ID
const db = getFirestore(app, "ai-studio-aistockresearcha-cd4b88e2-0ff1-4802-85e4-8be191ad4148");

export { db };
