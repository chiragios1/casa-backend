const { auth, db } = require('../config/firebase');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone: phone || '',
      createdAt: new Date().toISOString(),
      role: 'user',
      points: 0, // CASA coins/points for the loyalty program
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      error: error.message || 'Failed to register user',
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Generate a custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Store token in Firestore
    await db.collection('users').doc(userRecord.uid).update({
      token: customToken
    });

    res.json({
      message: 'Login successful',
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        ...userData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get current user data
exports.getCurrentUser = async (req, res) => {
  try {
    const { userId } = req;
    console.log('Getting user data for ID:', userId);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('User not found in Firestore');
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    console.log('User data from Firestore:', userData);

    // Get authentication details
    const userRecord = await auth.getUser(userId);
    console.log('User record from Auth:', userRecord);

    return res.status(200).json({
      user: {
        uid: userId,
        email: userRecord.email,
        name: userRecord.displayName,
        ...userData
      },
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return res.status(500).json({
      error: error.message || 'Failed to get user data',
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { name, phone, address } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    
    // Update Firestore document
    await db.collection('users').doc(userId).update(updates);
    
    // Update display name in Auth if provided
    if (name) {
      await auth.updateUser(userId, {
        displayName: name,
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      updates,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      error: error.message || 'Failed to update profile',
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Firebase client SDK normally handles this,
    // but we can implement server-side logic if needed
    
    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email);
    
    // In a real app, you would send this via email service
    console.log('Password reset link:', resetLink);
    
    return res.status(200).json({
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send password reset email',
    });
  }
}; 