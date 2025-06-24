const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Test user credentials
const testUser = {
  email: 'yash.shah@mailinator.com',
  password: 'password123'
};

async function testAPIs() {
  try {
    console.log('=== Starting API Tests ===\n');

    // 1. Test Login
    console.log('1. Testing Login API...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    console.log('Login Response:', loginResponse.data);
    authToken = loginResponse.data.token;
    console.log('✅ Login Test Passed\n');

    // 2. Test Get Profile
    console.log('2. Testing Get Profile API...');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Profile Response:', profileResponse.data);
    console.log('✅ Get Profile Test Passed\n');

    // 3. Test Update Profile
    console.log('3. Testing Update Profile API...');
    const updateData = {
      name: 'Yash Shah Updated',
      phone: '1234567890'
    };
    const updateResponse = await axios.put(`${API_URL}/auth/profile`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Update Profile Response:', updateResponse.data);
    console.log('✅ Update Profile Test Passed\n');

    console.log('=== All Tests Completed Successfully ===');

  } catch (error) {
    console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
  }
}

// Run the tests
testAPIs(); 