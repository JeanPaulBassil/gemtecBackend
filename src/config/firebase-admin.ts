import * as admin from "firebase-admin";
// Instead of importing the JSON file directly, we'll use environment variables or parse it manually
if (!admin.apps.length) {
  try {
    // Option 1: Use environment variable if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized with environment variable");
    }
    // Option 2: Fall back to file import
    else {
      // Using require instead of import for dynamic loading
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require("./firebase-service-account.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized with service account file");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    // Initialize with a minimal configuration to prevent app crashes
    admin.initializeApp();
    console.warn(
      "Firebase Admin initialized without credentials - token operations will fail",
    );
  }
}

export { admin };
