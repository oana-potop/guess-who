// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKXeKGH866Q0H3FwS_AYEiVL2M6cY51qM",
  authDomain: "guess-who-9fb15.firebaseapp.com",
  projectId: "guess-who-9fb15",
  storageBucket: "guess-who-9fb15.firebasestorage.app",
  messagingSenderId: "300901069",
  appId: "1:300901069:web:5c42e051b15efe5d827f84"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const addNewList = async (listName, items) => {
    try {
      const docRef = await addDoc(collection(db, "lists"), {
        name: listName,
        items: items,
      });
      console.log("List created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding new list:", error);
      throw error;
    }
  };
