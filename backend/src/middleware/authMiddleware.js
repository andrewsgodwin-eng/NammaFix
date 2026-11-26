import { firebaseAdmin, isFirebaseReady } from '../config/firebase.js';
import { User } from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let decodedToken = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      if (isFirebaseReady()) {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      }
    }

    // Support dev simulation header if token verification is in development mode
    const devEmail = req.headers['x-user-email'] || req.headers['x-user-id'] || 'karthik.s@example.com';
    const emailToLookup = decodedToken?.email || devEmail;

    let user = await User.findOne({ email: emailToLookup.toLowerCase() });

    if (!user) {
      // Auto-provision user record on first authenticated request
      user = await User.create({
        firebaseUid: decodedToken?.uid || `dev_${Date.now()}`,
        email: emailToLookup.toLowerCase(),
        name: decodedToken?.name || emailToLookup.split('@')[0],
        role: emailToLookup.includes('admin') ? 'admin' : 'citizen',
        language: 'en',
        location: 'Chennai, Tamil Nadu',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired authentication token',
    });
  }
};
