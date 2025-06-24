const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { admin, db, auth } = require('../config/firebase');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/profile', verifyToken, authController.updateProfile);

// Login endpoint (simplified for testing)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    console.log('Login attempt for:', email);

    // Check if it's our admin user
    if (email === 'chirag.patel1@bacancy.com' && password === 'Testuser123') {
      res.json({
        message: 'Login successful',
        token: 'admin-token-' + Date.now(),
        user: {
          uid: '2c8CnOGzrngxzAj4CEwuJdfUjPI3',
          name: 'Chirag Patel',
          email: 'chirag.patel1@bacancy.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    } else {
      // Generic user
      res.json({
        message: 'Login successful',
        token: 'user-token-' + Date.now(),
        user: {
          email: email,
          uid: 'user-uid-' + Date.now(),
          name: 'User',
          role: email.includes('admin') ? 'admin' : 'app_user'
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required'
      });
    }

    // Set default role to app_user if not specified
    const userRole = role || 'app_user';
    
    // Only allow admin role for specific admin emails
    const isAdminEmail = email.includes('admin') || email === 'admin@casa.com';
    const finalRole = (userRole === 'admin' && isAdminEmail) ? 'admin' : 'app_user';

    // For now, return a simple response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        name: name,
        email: email,
        uid: 'dummy-uid-' + Date.now(),
        role: finalRole
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    console.log('GET /me called');
    
    // For now, return admin user data since we created it
    res.json({
      user: {
        uid: '2c8CnOGzrngxzAj4CEwuJdfUjPI3',
        name: 'Chirag Patel',
        email: 'chirag.patel1@bacancy.com',
        role: 'admin'
      },
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user info',
      message: error.message
    });
  }
});

// Create admin user endpoint (for testing)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required'
      });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: true
    });

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, { 
      role: 'admin',
      isAdmin: true 
    });

    // Save user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      name: name,
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    console.log('Admin user created successfully:', userRecord.uid);
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        name: name,
        email: email,
        uid: userRecord.uid,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      error: 'Failed to create admin user',
      message: error.message
    });
  }
});

// Update user role (Admin only)
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // TODO: Add admin authorization middleware
    
    if (!['admin', 'app_user'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be either "admin" or "app_user"'
      });
    }

    // In real implementation, you would update the user in database
    
    res.json({
      message: 'User role updated successfully',
      userId,
      newRole: role
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      error: 'Failed to update user role',
      message: error.message
    });
  }
});

module.exports = router; 