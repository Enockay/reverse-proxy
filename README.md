# WireGuard VPN Management Frontend

Modern React frontend for managing WireGuard VPN and MikroTik routers.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Features

- ✅ User authentication (Signup/Login)
- ✅ Email verification flow
- ✅ Dashboard with statistics
- ✅ MikroTik router management
- ✅ Billing and subscription overview
- ✅ Responsive design (mobile-friendly)
- ✅ Modern UI with Tailwind CSS

## Getting Started

### Install Dependencies

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:5000
```

For production, set this to your API server URL:
```bash
VITE_API_URL=https://vpn.blackie-networks.com
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Routers.jsx
│   │   └── Billing.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

The frontend connects to the WireGuard API backend. Make sure:

1. Backend is running on port 5000 (or update `VITE_API_URL`)
2. CORS is configured in the backend to allow requests from the frontend
3. API endpoints match the backend routes

## Features Overview

### Authentication
- User signup with email verification
- Login with JWT tokens
- Protected routes
- Automatic token refresh

### Dashboard
- Overview statistics
- Recent routers list
- Quick access to main features

### Router Management
- Create new routers
- View router details
- Delete routers
- View access ports (Winbox, SSH, API)
- Copy connection details

### Billing
- View subscription summary
- Monthly cost overview
- Trial period tracking
- Next billing dates

## Deployment

### Build and Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting:
   - Vercel
   - Netlify
   - Coolify
   - Any static hosting service

### Coolify Deployment

1. Create a new static site in Coolify
2. Point to the `dist` folder
3. Set environment variable: `VITE_API_URL=https://your-api-url.com`
4. Deploy!

## Development Notes

- The frontend uses Vite's proxy for development (see `vite.config.js`)
- API calls are handled through the `api.js` service
- Authentication state is managed via React Context
- All routes except `/login` and `/signup` are protected
