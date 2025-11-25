# Deployment Guide - Healthy Gut AI Backend

## Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- API keys: Google Gemini, Groq, n8n

## Environment Variables Setup

Create a `.env` file:
```
# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/healthy-gut-ai

# LLM APIs
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

# n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/trigger
N8N_API_URL=https://your-n8n-instance.com/api/v1
N8N_API_KEY=your_n8n_key
```

## Deployment Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Deploy to Vercel
```bash
vercel deploy
```

Or to Heroku:
```bash
heroku create your-app-name
git push origin main
```

Or to Railway:
```bash
railway link
railway up
```

### 4. Verify Deployment
```bash
curl https://your-deployed-backend/api/health
```

## Production Checklist

- [ ] MongoDB URI uses connection pooling
- [ ] All API keys are in environment variables
- [ ] CORS is configured for your domain
- [ ] Error logging is enabled
- [ ] Database backups are scheduled
- [ ] Rate limiting is configured
- [ ] SSL certificate is valid
- [ ] n8n webhooks are properly configured
---

# Deployment Guide - Healthy Gut AI Frontend

## Prerequisites
- Node.js 18+
- npm or yarn
- Backend deployed and accessible

## Environment Variables Setup

Create a `.env.local` file:
```
VITE_API_URL=https://your-backend.com/api
VITE_APP_NAME=Healthy Gut AI
```

## Build & Deployment

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Deploy to Vercel
```bash
vercel deploy
```

### 4. Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### 5. Deploy to GitHub Pages
```bash
npm run build
# Commit dist folder
```

## Production Checklist

- [ ] Environment variables are set
- [ ] Backend URL is correct
- [ ] Dark mode works properly
- [ ] All routes are accessible
- [ ] API calls are working
- [ ] Theme persists across sessions
- [ ] Mobile responsiveness verified
---

## Screenshots

### Dashboard
![Dashboard](./Images/Dashboard.png)

### View Article
![View Article](./Images/View%20Article.png)

### Edit Article
![Edit Article](./Images/Edit%20Article.png)

### Publish Article
![Publish Article](./Images/Publish%20Article.png)

### Draft Article
![Draft Article](./Images/Publish%20Article.png)
