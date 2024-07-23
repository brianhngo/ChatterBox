import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';
import { getStorage } from 'firebase/storage';

dotenv.config();

// ** NOTE** Normally I would put it in .env for keys but per Google Firebase Documentation

// "Usually, you need to fastidiously guard API keys (for example,
// by using a vault service or setting the keys as environment variables);
// however, API keys for Firebase services are ok to include in code or checked-in config files."
// - From Google Firebase Documentation itself

const firebaseConfig = {
  apiKey: 'AIzaSyAH_pE7dlzJY77EeUKwdHdaPv6qaKM8aA0',
  authDomain: 'assessment-4c0bb.firebaseapp.com',
  projectId: 'assessment-4c0bb',
  storageBucket: 'assessment-4c0bb.appspot.com',
  messagingSenderId: '387692955705',
  appId: '1:387692955705:web:fc53954af71ef25d9c65e8',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, storage };
