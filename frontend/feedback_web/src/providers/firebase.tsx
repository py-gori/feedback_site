import { initializeApp } from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_SENDER_ID,
};

// const jsonPath = '/feedback_front/firebase_account.json';
// const serviceAccount = JSON.parse(jsonPath);

// const config = {
//   apiKey: serviceAccount.apiKey,
//   authDomain: serviceAccount.authDomain,
//   projectId: serviceAccount.projectId,
//   storageBucket: serviceAccount.storageBucket,
//   messagingSenderId: serviceAccount.messagingSenderId,
//   appId: serviceAccount.appId,
// };

initializeApp(config);
// export const app = initializeApp(config)
