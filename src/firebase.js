import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Tambahkan ini untuk storage

// Configurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBcJZeAt5_vIBn-RYyX-zQkLha7uVSmESE",
  authDomain: "cinta-terhalang.firebaseapp.com",
  databaseURL: "https://cinta-terhalang-default-rtdb.firebaseio.com", // HARUS DITAMBAHKAN
  projectId: "cinta-terhalang",
  storageBucket: "cinta-terhalang.appspot.com", // Diperbaiki dari .firebasestorage.app ke .appspot.com
  messagingSenderId: "661601632305",
  appId: "1:661601632305:web:6358ae53cf1dee3e709510",
  measurementId: "G-YZXPD0JWWL"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inisialisasi storage jika diperlukan

export { database, auth, storage };
