import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDOiBU9DSijWEZM8Se9PfGrjZFsmVBR6SY",
  authDomain: "smart-trash-iot-470f0.firebaseapp.com",
  databaseURL: "https://smart-trash-iot-470f0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-trash-iot-470f0",
  storageBucket: "smart-trash-iot-470f0.firebasestorage.app",
  messagingSenderId: "751466620890",
  appId: "1:751466620890:web:269062a408da0ed44e42e3",
  measurementId: "G-SJZ0R7L9QG"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
