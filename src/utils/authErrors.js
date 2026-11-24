// Turns Firebase auth error codes into friendly messages.
const messages = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "Firebase API key is invalid. Update the VITE_FIREBASE_* values in client/.env.",
};

export function authErrorMessage(err) {
  return messages[err?.code] || err?.message || "Something went wrong.";
}
