const { auth, db } = require('../config/firebase');

// Middleware to verify token
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided in header');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Token received:', token);
    
    // Get user from Firestore where token matches
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('token', '==', token).get();
    
    if (snapshot.empty) {
      console.log('No user found with this token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get the first matching user
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    console.log('User found:', userData);
    
    req.userId = userDoc.id;
    next();
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const { userId } = req;
    
    // Get user data from Firestore
    const userSnapshot = await db.collection('users').doc(userId).get();
    
    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userSnapshot.data();
    
    // Check if user has admin role
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required' });
    }
    
    // User is an admin, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; 