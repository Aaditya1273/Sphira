# 🚀 Sphira DeFi Platform - Netlify Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Files Created:**
- `netlify.toml` - Netlify configuration
- `.env.production` - Production environment template
- Updated `package.json` with build scripts

✅ **Security Check:**
- No API keys exposed in public files
- `.env.local` properly gitignored
- Environment variables ready for Netlify dashboard

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your Sphira repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `18`

### 3. Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

#### **Required Variables:**
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
GEMINI_API_KEY=your_gemini_api_key_here
```

#### **Recommended Variables:**
```
NODE_ENV=production
NEXT_PUBLIC_CHAIN_ID=2648
NEXT_PUBLIC_CHAIN_NAME=Somnia Testnet
NEXT_PUBLIC_CHAIN_SYMBOL=SOM
NEXT_PUBLIC_ENABLE_TESTNET=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_EMERGENCY_VAULT=true
NEXT_PUBLIC_ENABLE_YIELD_FARMING=true
```

#### **Optional Variables:**
```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
COINGECKO_API_KEY=your_coingecko_key
JWT_SECRET=your_jwt_secret
```

### 4. Get Required API Keys

#### **WalletConnect Project ID (Required):**
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add to Netlify environment variables

#### **Gemini AI API Key (Required for Chat):**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key
4. Add to Netlify environment variables

### 5. Deploy

1. Click "Deploy site" in Netlify
2. Wait for build to complete (usually 2-3 minutes)
3. Your site will be available at `https://random-name.netlify.app`

### 6. Custom Domain (Optional)

1. In Netlify Dashboard → Domain settings
2. Add custom domain: `sphira-defi.com` (or your domain)
3. Configure DNS settings as instructed
4. Enable HTTPS (automatic with Netlify)

## 🎯 Post-Deployment Configuration

### Update Environment URLs

After deployment, update these variables with your actual Netlify URL:

```
NEXT_PUBLIC_API_URL=https://your-site-name.netlify.app/api
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

### Test Your Deployment

1. **Wallet Connection:** Test connecting MetaMask/other wallets
2. **SIP Creation:** Create a test SIP
3. **Theme Toggle:** Test light/dark mode switching
4. **All Pages:** Navigate through all sections
5. **Chat Assistant:** Test AI chat functionality

## 🔍 Troubleshooting

### Build Errors

If build fails, check:
1. All dependencies are in `package.json`
2. No TypeScript errors: `npm run lint`
3. Environment variables are set correctly

### Runtime Errors

Common issues:
1. **Wallet not connecting:** Check WalletConnect Project ID
2. **Chat not working:** Verify Gemini API key
3. **API errors:** Check environment variable names

### Performance Optimization

1. Enable Netlify's **Asset Optimization**
2. Configure **Edge Functions** for API routes
3. Enable **Branch Deploys** for testing

## 📊 Monitoring

### Analytics Setup

1. Add Vercel Analytics ID to environment variables
2. Monitor performance in Netlify Analytics
3. Set up error tracking with Sentry (optional)

### Performance Metrics

Expected performance:
- **First Load:** < 3 seconds
- **Lighthouse Score:** > 90
- **Core Web Vitals:** All green

## 🚀 Launch Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Wallet connection tested
- [ ] All features working
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error monitoring setup
- [ ] Performance optimized
- [ ] Security headers configured

## 🎉 You're Live!

Your Sphira DeFi platform is now live on Netlify! 

**Next Steps:**
1. Share your deployment URL
2. Test with real users
3. Monitor analytics and performance
4. Deploy smart contracts to Somnia mainnet
5. Migrate from temporary storage to permanent database

---

**Need Help?** 
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Sphira Support: Check the README.md for contact information
