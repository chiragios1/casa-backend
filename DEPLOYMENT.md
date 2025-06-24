# CASA Backend Deployment Guide

## 🚀 Deploy to Render.com (Recommended)

### Prerequisites
- GitHub account
- Render.com account (free tier available)
- Base64 encoded Firebase service account key

### Step 1: Prepare Environment Variables

Your Firebase service account key has been encoded to base64:
```
ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiY2FzYS01YmVlYSIsCiAgInByaXZhdGVfa2V5X2lkIjogImU4MjA1OGFhN2NmZmU2OTZmNTRjOGZiY2RhOGRhZmE4NDU1YmU0YWUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQzJzVUliMGxkYzh1bFVcbjQ5eDBkZnBHaWp2aDVRMy9WdDd1QUVaQkJwdUF5VGZYVHk5RlpObmMxaG1uSWd3dCtjWm9sTzI3bzFpY2tzWU9cbndkTkhVK3lPUlBTMmdRMFlXNk5IdjJKN3kzOTl6Yy9peDJvQTlIbGZVaU9wRVFIWHNJN1VHQS93eGMvbmlzdlpcbkZFNWVTREkrQ2NwVWhIRTJ0UFI2R3dycUQvRlRTTnFWQ2J6eGJwRGtFR3NSTUxrbGJjRm5WcG1VU3hYVDdROW1cblEyQk5FZGJTODd3NXZrZlhYNXMyc21sVFB2NVpSblBTaG8zWnRsSjJlRDZRTG5OR2ZiM2xSMVMyY0NNRTNIdURcbnlFMnBpTzZtNXVzSnMreVhsVk5iQ3E3NTVYK0QweUZFUjBSRTd6WVEyRVlTREQxdGMvOVlrMHhsVVBxb0FhZjFcbllWL3JEWC9kQWdNQkFBRUNnZ0VBQzJXUUY5emk5dmtacXpleVoxQW1JUmtRZ1VLMmE5T3gxb0VOTmozcm5NNGJcblUxZ3M1Nzc4aEVxVmtSZmpwZlByVFFJMVk3dUlsSms4dDhEMFVDMGhHRmhKalIrM0tiK0FZUmZFVkxBRGhRZm9cbnpGODA4cTJpNjFwY0ZTT1ZkNEliekRRRlorSVVoU280YXo0RURESk95QkNqbnVySzIrY2xTbjlvdFRueUM3TG9cblBZU0NKMGdHYjNXUzU5YlJDS0czT05Ba1R0c3RYZmQrVUFkQVJtNmdIZGtoYlE1dVV3MGlZQjRtbk04VFB0cjVcbjFpRThuZDBrSE5TZDhJbkFvdkY5SkJhYkRCWkFNa044dXFSUXc2ZXA0VzhDQms1Z1c1VTdJUENtc2VNN01mWGRcbjdoOTNlVW1ISDZ0K295cEMzUXZ2WCsrS2V1SnBZNy9qNVdvb1lIVCs0UUtCZ1FEMkMrTE9hVVNTVUd2czEyeEdcbnJsUHZNeGtTWVVEK1ZuOHJobTIxTjcxd2M4WEJ1Y0ZwaGJGcDJ2THJDVDRhbFZpSng1ZDR0YlV1N3UxTmFFc0dcbjhXQmFiU0NNam9aTTA2d09MS2RybEJkOC9vMWdSOUpzczgyUm5nWFM5b1dvNFk0cmQwMStCUlFpQnNsY1hGaWhcbmRmaEQ1b3RiOXJxZEpwdjFETTJid2lsV3RRS0JnUUMrRlVOc0hRa2pYWVVVQUVLcnBmNzNyYnlYZXQ5cUlybitcbmlaaW8vcnNwZjhST0pST1ljeWJrWFgwOWhrZ2FXZHpoZW5pd2QzMEVtUzBOTFlCZmFSK2pNc21aVm1ZQ2ZpKzNcbnlMdndqTmtsY2thL3dPcWUrS2hYVEowd0xiLytETUdvb3RTUU5KQk8rSGRCZFREODY2NmliWEhCMFhJaWJTemRcbldBaFBWeFJWaVFLQmdRQ0RkUkJGNWhwYjdobnJuYUZkRmpFRUlSSHBMd3J4bUxjelF3eUVnUFozQ1hRRU1FSDFcbkpoZ0hEWk15SG1zTyt2SW1FdnlMNHRHZDlNdld5cjBqUlgyTWNyZXNRVTNoNkVvSi9MT3FsNklCQjJQenFBdjJcblJnNjBHWERWS1I5NmZxQmQrc3p0WXJ0Qi9zeEF5NW9URWh1Rjg3eExjMFI3U0RDVk9iVDAza1VGN1FLQmdFZHNcbkUrNWVwcDFjT1hHL2UwMmx6THpoMGhnVStqZVdIczd1Z3FjVk45d3EvdWJoOVkvMXpLcElHcFB3amMwZzhPYmtcbkxzOFh4cWpncVZYblAvSVp2T0tFWmMydzhobURzb2hhNjR0Q1VTRko1QjJPN2xtWFV5R2lUdm5ZWnVpZGdITE5cbjVCTGZQVTMrL0Voak1Xb0hZSkgxajZYay9mN0RpUFVPYStqcjdsOEpBb0dCQUx5ZGZsTkU5eTl3S29hL0grejFcbjVCRnkyMmc5cnlGaGVmYjNXemVzWTBtNkJ3NGJHZWpFaC9wbEx3NVI2OXJWTEx3OGxvWkVTMVFiZ3Z5aFpOUWdcbmNQcmZ6LzIwOXppUEs4UGkzMjRDbFFuVDc5VXRtTkpSc1ZzekFQSmovNzg1Q0lUVHZ0ZXZzVDQ5cnFOVS9ZWTlcbm0xbHBJV1hIYmx4ZlRNVkI3bGN5UHhiOVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImZpcmViYXNlLWFkbWluc2RrLWZic3ZjQGNhc2EtNWJlZWEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTAwODQwNTY4NzI2MjU1OTg3OTAzIiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9maXJlYmFzZS1hZG1pbnNkay1mYnN2YyU0MGNhc2EtNWJlZWEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K
```

### Step 2: Create GitHub Repository

1. Go to GitHub and create a new repository named `casa-backend`
2. Push your local code:

```bash
# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/casa-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render.com

1. **Log in to Render.com**
2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository `casa-backend`

3. **Configure Service Settings**
   - **Name**: `casa-backend`
   - **Region**: Singapore (closest to India)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: (paste the base64 encoded key above)
   - `FIREBASE_DATABASE_URL`: `https://casa-49f11-default-rtdb.firebaseio.com/`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)

### Step 4: Test Your Live API

Once deployed, your API will be available at:
`https://casa-backend-XXXX.onrender.com`

Test endpoints:
- `GET /` - Welcome message
- `POST /api/auth/login` - User login
- `GET /api/reports` - Get reports
- `POST /api/reports` - Create report

## Alternative Deployment Options

### Option 2: Heroku
1. Install Heroku CLI
2. `heroku create casa-backend`
3. Set environment variables with `heroku config:set`
4. `git push heroku main`

### Option 3: Railway
1. Connect GitHub to Railway
2. Deploy with one click
3. Set environment variables in dashboard

### Option 4: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

## 📱 Update Frontend API URL

After successful deployment, update your React Native app's API client:

```javascript
// In CASA/src/services/api/apiClient.js
const BASE_URL = 'https://your-render-url.onrender.com/api';
```

## 🔧 Troubleshooting

1. **Build Fails**: Check logs in Render dashboard
2. **Environment Variables**: Ensure all required env vars are set
3. **Firebase Connection**: Verify base64 encoding is correct
4. **CORS Issues**: Check CORS configuration in backend

## 🚀 Success!

Your CASA backend is now live and ready to handle requests from your mobile app! 