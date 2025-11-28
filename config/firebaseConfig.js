//Import Firebase Here


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db =  getFirestore(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)   
});



