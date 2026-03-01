# Frontend Deployment Guide

## Docker Deployment

### Quick Start

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the site:**
   - Local: http://localhost:3000
   - Production: Configure your domain to point to port 3000

### Manual Docker Build

```bash
# Build the image
docker build -t blackie-networks-frontend .

# Run the container
docker run -d -p 3000:80 --name blackie-networks-frontend blackie-networks-frontend
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://api.blackie-networks.com
```

**Note:** Environment variables must start with `VITE_` to be accessible in the React app.

## Coolify Deployment

If using Coolify, the `docker-compose.yml` includes Coolify labels:

- Service will be automatically detected
- HTTP port is configured as 80 (mapped to host port 3000)
- Health check endpoint available at `/health`

## Production Build

The Dockerfile uses a multi-stage build:

1. **Builder stage:** Builds the Vite React app
2. **Production stage:** Serves the built app with nginx

### Features

- ✅ Optimized production build
- ✅ Nginx with gzip compression
- ✅ Security headers
- ✅ Static asset caching
- ✅ React Router support (SPA routing)
- ✅ Health check endpoint

## Nginx Configuration

The `nginx.conf` includes:

- SPA routing support (all routes serve `index.html`)
- Gzip compression
- Security headers
- Static asset caching (1 year)
- HTML files not cached

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs frontend`
- Verify port 3000 is not in use: `lsof -i :3000`

### API calls failing
- Verify `VITE_API_URL` is set correctly in `.env`
- Check CORS settings on the API server
- Ensure API server is accessible from the frontend container

### Build fails
- Ensure `package.json` and `package-lock.json` are present
- Check Node.js version (requires Node 20+)
- Clear Docker cache: `docker-compose build --no-cache`

## Health Check

The container includes a health check endpoint at `/health` that returns `200 OK` when healthy.
