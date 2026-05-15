# Vehicle Management System - Deployment Guide

This guide covers multiple deployment options for the Vehicle Management System.

## Quick Start (Docker - Recommended)

The fastest way to deploy the entire stack:

```bash
# 1. Clone and navigate to project
cd vehicle-management

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your production values
nano .env

# 4. Deploy with Docker Compose
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4001

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `FRONTEND_URL` | Your frontend domain | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## Deployment Options

### Option 1: VPS/Cloud Server (DigitalOcean, AWS EC2, etc.)

1. **Provision a server** with at least:
   - 2 GB RAM
   - 2 vCPUs
   - Ubuntu 22.04 LTS

2. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Clone and deploy:**
   ```bash
   git clone <your-repo>
   cd vehicle-management
   cp .env.example .env
   # Edit .env with your values
   docker-compose up -d
   ```

4. **Setup SSL with Nginx (recommended):**
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   ```

   Create `/etc/nginx/sites-available/vehicle-mgmt`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:4001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and get SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vehicle-mgmt /etc/nginx/sites-enabled/
   sudo certbot --nginx -d your-domain.com
   sudo systemctl restart nginx
   ```

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

**Deploy Frontend to Vercel:**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
5. Deploy

**Deploy Backend to Railway:**

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select your repo and set root directory to `backend`
4. Add environment variables from `.env.example`
5. Deploy

**Deploy Backend to Render:**

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Deploy

### Option 3: MongoDB Atlas + Vercel (Serverless)

For a fully serverless setup:

1. **Create MongoDB Atlas cluster:**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster
   - Get connection string

2. **Deploy backend as Vercel Functions:**
   - See `backend/vercel.json` for serverless configuration
   - Deploy to Vercel

3. **Deploy frontend to Vercel**

## Database Seeding

To create an initial admin user:

```bash
# Access backend container
docker-compose exec backend sh

# Run seed script (if available)
npm run seed

# Or create user manually via API
```

## Backup and Maintenance

**Backup MongoDB:**
```bash
docker-compose exec mongodb mongodump --out /data/backup/$(date +%Y%m%d)
```

**Update deployment:**
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml
ports:
  - "4002:4001"  # Use different host port
```

**MongoDB connection failed:**
- Check `MONGO_URI` in .env
- Ensure MongoDB container is healthy: `docker-compose ps`

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is accessible from frontend

## Production Checklist

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use strong MongoDB passwords
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS properly (set FRONTEND_URL)
- [ ] Set up regular backups
- [ ] Configure monitoring/alerting
- [ ] Review Cloudinary usage limits

## Support

For issues or questions, please check:
1. Container logs: `docker-compose logs`
2. MongoDB connection
3. Environment variables configuration
