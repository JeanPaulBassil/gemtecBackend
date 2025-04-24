import * as admin from "firebase-admin";

// Disable Firebase Admin in development mode
if (process.env.NODE_ENV === "dev") {
  console.log("Firebase Admin disabled in development mode");
} else if (!admin.apps.length) {
  try {
    // Option 1: Use environment variable if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: "firebase-adminsdk-fbsvc@gemtec-e25e8.iam",
          privateKey:
            "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC39OyxAakGA/T0\n3jHgDhJd4h0a2aDNmd9c8PM/tSbySttpp1gS0HP6P22xW4/YW/cmet922qMQzCoe\nM9AssW5ARoy+rf75XDDtrR6mY2j2I5Ta+gSw3ZbjTg0oRFXeBaN4ORuwqTUABEM9\nKyV3GbgM319tTKFvqATORu3FMyyAzqynRHsOLCJQVB3XTiwhsoyHoXB6EM0f7eS6\ngpgOMatxrxUjUnbrg8MTqWhmO0YiucmqPeoahAJRWC/dIHQwxCXXSNp6eMT9N2+e\nuhLFFXsb6cEmrwmuR63KMmaXuP9HselAMzd2uZi5OKh+sFMTwjWtglYUqaROAtDy\npdE16/nJAgMBAAECggEAHvnHl2CzsPcemtMFa/iCoDtwcjJ+MNC9u105YJtk5Py0\n6JwMqRJfzR48HtbPqHuH6PtcwJs9RRlT6EUKQ1RXP8yBa6RJ4HxlIsh5dkQcCwJf\n0OWzv4J4o2rjrUmgeePSLG7VWlCLw6Z0Ggs3YlA63TQJ0hJKxs3wjTmFVSTyU/fv\nvR2hlvZ3YTUySku3z4oKlVwwMGXrDMfV3qvM0bypy3bOMeG5p8C8bb/QYEAqhgiw\nE+2czS29/AYWUYpLzmqOy82uwqvfVYyaS9GdLb0r9PsLfcb/ctuK7+pzd0P5zJRz\njOIs9IfuDgfDvOrwZCV9hidkelWA11Oq4NuEaiMipwKBgQDxRe7KorkLlu05bDCI\nICnVztUsh33peHQkDRir/79CxuDqGQkdM14xak7/zUbS7Z4rsRCG7IhZueRl1Ayn\n2B4SO1wRV6F+Kiq1GdO2SxVpYclsFXv0DKUntksKZQn97yD2LRzyZy1NoAHWCQJs\nT3fSmZVKKAyi9Ht+BPqwqESy5wKBgQDDL2GSwlMCgNUJJwStYjD8+pej0oMI5M1C\n7uiy2YKB502UJTWhpRGsMEob80Nf2B1F7FU2e3CPdk//oZPRti+H1WXsZnWo8QvH\n89iAJY1LFIo4NpJRbV7KbmO8/GzX7MWDSbN8RFBw3ZOeciM0sq+nQMT1JnsV//Ay\nW6bmGk0HzwKBgFcfSo/vXGR79mNi1s+A1bp3+nAe6O+SaFXQSNVq/zRsvjCqI6lg\nsCWl3qruBCIMXa4nPPGLndzQjFHc1UkSeCFbP+6fNxhov40vq0xLJossHWCjDWRd\n4JFLeSNiws3oOH3MYoSBj1FVcvRHwpE7zOfGP6tMdOuu3pztzVxXFp+HAoGBALn1\nX2n6eCnPYqiIox0pivDLM0QiYTNNAf6+LbeQIZXwMGpvlQw/f3nkvAarGsqq1SD0\nTC9PJeuY1hj/8RyBDgHFH4k+COV/WjETsnZM0LPyismJvJeVsxT8XUwF1xFVhMxT\noIxJbbZKdMUli0M+5rlbrQq/sc9A+7COv5FFB5TjAoGBAN96HJoSLshIz17KYaHG\nry35f2oe1DAC8j0mK2iTm5qahbGb3z6CQhP7gXa+WCliSdFj1lXDcAfTga10qZHO\nLeaIhxcfIfYOVNl8ihRkaXcvyN2BrrSWkjW6TOTguDqt5kXV01R6PoIGwXUlqizf\nYC4EziGCr205puhuek+8h5jR\n-----END PRIVATE KEY-----\n",
          projectId: "gemtec-e25e8",
        }),
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
