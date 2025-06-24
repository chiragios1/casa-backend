const { db } = require('../config/firebase');

// Create a new donation pickup request
exports.createDonation = async (req, res) => {
  try {
    const { userId } = req;
    console.log('userId:', userId);
    console.log('body:', req.body);
    console.log('file:', req.file);
    // Multer से image file
    const imageFile = req.file;
    // बाकी fields
    const { location, address, quantity, donationAmount } = req.body;

    // Validate required fields
    if (!location || !address || !quantity || !imageFile) {
      return res.status(400).json({ error: 'Missing required donation information' });
    }

    // Image का path (local uploads folder में)
    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : '';

    // Create donation document
    const donationData = {
      userId,
      location,
      address,
      quantity,
      donationAmount: donationAmount || '',
      imageUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    const donationRef = await db.collection('donations').add(donationData);
    await donationRef.update({ id: donationRef.id });

    return res.status(201).json({
      message: 'Donation request created successfully',
      donationId: donationRef.id,
      donation: { id: donationRef.id, ...donationData },
    });
  } catch (error) {
    console.error('Error creating donation request:', error);
    return res.status(500).json({ error: error.message || 'Failed to create donation request' });
  }
};

// Get all donations for a user
exports.getUserDonations = async (req, res) => {
  try {
    const { userId } = req;
    
    // Query donations collection
    const donationsSnapshot = await db.collection('donations')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (donationsSnapshot.empty) {
      return res.status(200).json({ donations: [] });
    }
    
    // Extract donation data
    const donations = [];
    donationsSnapshot.forEach(doc => {
      donations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({ donations });
  } catch (error) {
    console.error('Error getting user donations:', error);
    return res.status(500).json({
      error: error.message || 'Failed to retrieve donations',
    });
  }
};

// Get donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    
    const donationDoc = await db.collection('donations').doc(donationId).get();
    
    if (!donationDoc.exists) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    const donation = {
      id: donationDoc.id,
      ...donationDoc.data()
    };
    
    return res.status(200).json({ donation });
  } catch (error) {
    console.error('Error getting donation:', error);
    return res.status(500).json({
      error: error.message || 'Failed to retrieve donation',
    });
  }
};

// Update donation status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const donationRef = db.collection('donations').doc(donationId);
    const donationDoc = await donationRef.get();
    
    if (!donationDoc.exists) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    // Update status
    await donationRef.update({
      status,
      updatedAt: new Date().toISOString()
    });
    
    return res.status(200).json({
      message: 'Donation status updated successfully',
      donationId,
      status
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    return res.status(500).json({
      error: error.message || 'Failed to update donation status',
    });
  }
};

// Helper function to calculate reward points based on flower type and quantity
function calculatePoints(flowerType, quantity) {
  // Basic point system (can be customized based on business logic)
  const basePoints = {
    'rose': 2,
    'marigold': 1,
    'lotus': 3,
    'mixed': 1.5,
    'other': 1
  };
  
  const pointPerUnit = basePoints[flowerType.toLowerCase()] || 1;
  return Math.floor(pointPerUnit * quantity);
} 