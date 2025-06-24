const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');

// Get all reports (Admin only)
router.get('/', async (req, res) => {
  try {
    // TODO: Add admin authorization middleware
    
    const reportsSnapshot = await db.collection('reports').orderBy('createdAt', 'desc').get();
    
    const reports = [];
    reportsSnapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reportDoc = await db.collection('reports').doc(id).get();
    
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({
      id: reportDoc.id,
      ...reportDoc.data()
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create new report
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      images,
      location,
      userId,
      category
    } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    // Get user info from userId or fallback to anonymous
    let reportUserId = userId || req.user?.uid || 'anonymous';
    let userEmail = req.user?.email || '';
    let userName = req.user?.displayName || 'Anonymous User';
    
    // If userId is provided, try to get user information from Firestore
    if (userId && userId !== 'anonymous') {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userName = userData.name || userData.displayName || userEmail || 'Anonymous User';
          userEmail = userData.email || userEmail;
        }
        
        // Also try to get from Firebase Auth
        try {
          const userRecord = await admin.auth().getUser(userId);
          userName = userRecord.displayName || userName;
          userEmail = userRecord.email || userEmail;
        } catch (authError) {
          console.log('Could not fetch user from Auth:', authError.message);
        }
      } catch (firestoreError) {
        console.log('Could not fetch user from Firestore:', firestoreError.message);
      }
    }
    
    const reportData = {
      title,
      description,
      type: type || category || 'general',
      status: 'PENDING',
      createdBy: reportUserId,
      createdByName: userName,
      createdByEmail: userEmail,
      images: images || [],
      location: location || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const reportRef = await db.collection('reports').add(reportData);
    
    res.status(201).json({
      id: reportRef.id,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report', message: error.message });
  }
});

// Update report status (Admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    // TODO: Add admin authorization middleware
    
    const { id } = req.params;
    const { 
      status, 
      reviewNotes, 
      rejectionReason, 
      pickupNotes, 
      actualWeight, 
      ecoCoinsEarned, 
      pickupDate,
      pickupTime,
      scheduledDateTime
    } = req.body;
    
    const updateData = {
      status,
      reviewNotes: reviewNotes || '',
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedBy: req.user?.uid || 'admin', // TODO: Get from auth
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Add optional fields if provided
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (pickupNotes) updateData.pickupNotes = pickupNotes;
    if (actualWeight !== undefined) updateData.actualWeight = actualWeight;
    if (ecoCoinsEarned !== undefined) updateData.ecoCoinsEarned = ecoCoinsEarned;
    if (pickupDate) updateData.pickupDate = pickupDate;
    if (pickupTime) updateData.pickupTime = pickupTime;
    if (scheduledDateTime) updateData.scheduledDateTime = scheduledDateTime;
    
    await db.collection('reports').doc(id).update(updateData);
    
    res.json({
      message: 'Report status updated successfully',
      id,
      status,
      updateData
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

// Get reports by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reportsSnapshot = await db
      .collection('reports')
      .where('createdBy', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const reports = [];
    reportsSnapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(reports);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ error: 'Failed to fetch user reports' });
  }
});

// Delete report (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // TODO: Add admin authorization middleware
    
    const { id } = req.params;
    
    await db.collection('reports').doc(id).delete();
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router; 