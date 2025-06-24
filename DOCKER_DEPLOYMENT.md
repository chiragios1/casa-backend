# 🐳 CASA Backend Docker Deployment Guide

## Quick Start

आपका CASA backend Docker के साथ production deployment के लिए ready है!

### Prerequisites

- Docker & Docker Compose installed
- Your own server (VPS/Dedicated)
- SSH access to server

## 📦 Files Created

- `Dockerfile` - Production optimized container
- `docker-compose.yml` - Service orchestration  
- `.dockerignore` - Build optimization
- `deploy.sh` - One-click deployment script
- `.env.production` - Production environment variables

## 🚀 Deployment Options

### Option 1: Quick Deploy (Recommended)

```bash
# Make script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh production

# Deploy to staging
./deploy.sh staging
```

### Option 2: Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Option 3: Manual Docker Commands

```bash
# Build image
docker build -t casa-backend:production .

# Run container
docker run -d \
  --name casa-backend-production \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env.production \
  -v $(pwd)/uploads:/app/uploads \
  casa-backend:production
```

## 🖥️ Server Setup

### Step 1: Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again for group changes
```

### Step 2: Transfer Files

```bash
# From your local machine
scp -r CASA-backend/ user@your-server-ip:/home/user/

# Or clone from GitHub
ssh user@your-server-ip
git clone https://github.com/chiragios1/casa-backend.git
cd casa-backend
```

### Step 3: Deploy

```bash
# On your server
cd casa-backend
./deploy.sh production
```

## 🔧 Configuration

### Environment Variables

Edit `.env.production` for your server:

```env
NODE_ENV=production
PORT=5000
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_key
FIREBASE_DATABASE_URL=your_firebase_url
```

### Port Configuration

- **Production**: `5000`
- **Staging**: `5001`
- **Development**: `3000`

### SSL/HTTPS Setup

Use nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring & Management

### Container Management

```bash
# View running containers
docker ps

# View logs
docker logs -f casa-backend-production

# Stop container
docker stop casa-backend-production

# Restart container
docker restart casa-backend-production

# Remove container
docker rm casa-backend-production
```

### Health Check

```bash
# Check API health
curl http://localhost:5000/

# Expected response
{"message":"Welcome to CASA API"}
```

### Performance Monitoring

```bash
# View container stats
docker stats casa-backend-production

# View system resources
htop
df -h
free -h
```

## 🔄 Updates & Redeploy

```bash
# Pull latest code
git pull origin main

# Redeploy
./deploy.sh production
```

## 🔐 Security Best Practices

1. **Firewall Setup**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 5000  # Only allow through nginx
```

2. **Regular Updates**
```bash
# Update Docker images
docker system prune -a

# Update system packages
sudo apt update && sudo apt upgrade -y
```

3. **Environment Files**
   - Never commit `.env.production` to git
   - Use secure file permissions: `chmod 600 .env.production`
   - Backup environment files securely

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs casa-backend-production

# Check if port is occupied
sudo netstat -tulpn | grep 5000

# Check Docker daemon
sudo systemctl status docker
```

### API Not Responding

```bash
# Test internal connection
docker exec -it casa-backend-production wget -O- http://localhost:5000/

# Check container health
docker inspect casa-backend-production | grep Health -A 5
```

### Database Connection Issues

```bash
# Verify environment variables
docker exec -it casa-backend-production env | grep FIREBASE

# Test Firebase connection
docker exec -it casa-backend-production node -e "
const admin = require('firebase-admin');
console.log('Firebase Admin SDK version:', admin.SDK_VERSION);
"
```

## 📈 Production Checklist

- [ ] ✅ Docker installed on server
- [ ] ✅ Environment variables configured
- [ ] ✅ SSL certificate setup (Let's Encrypt)
- [ ] ✅ Nginx reverse proxy configured
- [ ] ✅ Firewall rules set
- [ ] ✅ Backup strategy planned
- [ ] ✅ Monitoring setup
- [ ] ✅ Domain DNS configured

## 🆘 Support Commands

```bash
# Emergency stop all
docker stop $(docker ps -q)

# Clean everything
docker system prune -a --volumes

# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Restore from backup
tar -xzf uploads-backup-YYYYMMDD.tar.gz
```

## 🎉 Success!

आपका CASA Backend अब production में live है!

**API URL**: `https://your-domain.com/api`

अब आप React Native app में API URL update कर सकते हैं। 