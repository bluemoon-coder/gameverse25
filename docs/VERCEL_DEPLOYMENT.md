# Vercel Deployment Guide

Deploy GameVerse '25 to Vercel in minutes.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- Your GameVerse '25 code in a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Select the repository containing GameVerse '25

### Step 2: Configure Project

Vercel will auto-detect Next.js settings. Verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (unless your code is in a subdirectory)
- **Build Command**: `next build`
- **Output Directory**: `.next`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

\`\`\`
JWT_SECRET=your-generated-secret-key
\`\`\`

**Generate a secure JWT secret:**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

**Optional** (for Google Sheets):
\`\`\`
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_API_KEY=your-api-key
\`\`\`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### Step 2: Login

\`\`\`bash
vercel login
\`\`\`

### Step 3: Deploy

\`\`\`bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? gameverse25 (or your choice)
# - Directory? ./
# - Override settings? No
\`\`\`

### Step 4: Add Environment Variables

\`\`\`bash
# Add JWT secret
vercel env add JWT_SECRET

# When prompted, paste your secret and select Production

# Optional: Add Google Sheets variables
vercel env add GOOGLE_SHEETS_SPREADSHEET_ID
vercel env add GOOGLE_SHEETS_API_KEY
\`\`\`

### Step 5: Redeploy with Environment Variables

\`\`\`bash
vercel --prod
\`\`\`

## Method 3: One-Click Deploy

Click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

You'll need to add environment variables after deployment.

## Post-Deployment Configuration

### 1. Set Up Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Configure Environment Variables

Go to **"Settings"** → **"Environment Variables"**:

**Production Environment:**
\`\`\`
JWT_SECRET=your-production-secret
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_API_KEY=your-api-key
\`\`\`

**Preview Environment** (optional):
- Add the same variables for preview deployments
- Or use different values for testing

### 3. Enable Analytics (Optional)

1. Go to **"Analytics"** tab
2. Enable Vercel Analytics
3. Track page views and performance

## Automatic Deployments

Vercel automatically deploys:

- **Production**: Every push to your main/master branch
- **Preview**: Every push to other branches and pull requests

### Configure Branch Deployments

1. Go to **"Settings"** → **"Git"**
2. Set **Production Branch** (usually `main` or `master`)
3. Enable/disable preview deployments

## Environment-Specific Settings

### Production

- Uses environment variables from Vercel
- Optimized builds with caching
- Automatic HTTPS

### Preview

- Each PR gets a unique URL
- Test changes before merging
- Same environment variables as production (or separate if configured)

## Monitoring and Logs

### View Deployment Logs

1. Go to **"Deployments"** tab
2. Click on any deployment
3. View build logs and runtime logs

### Real-Time Logs

\`\`\`bash
vercel logs your-project-url.vercel.app
\`\`\`

### Monitor Performance

- Check **"Analytics"** for page load times
- View **"Speed Insights"** for Core Web Vitals

## Troubleshooting

### Build Failures

**Error: Missing environment variables**
- Add required variables in Vercel Dashboard
- Redeploy after adding variables

**Error: Module not found**
\`\`\`bash
# Ensure package.json is committed
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
\`\`\`

### Runtime Errors

**500 Internal Server Error**
- Check runtime logs in Vercel Dashboard
- Verify environment variables are set correctly
- Check for server-side errors in logs

**Authentication Not Working**
- Verify `JWT_SECRET` is set in production
- Check that cookies are being set (HTTPS required)

### Performance Issues

**Slow Page Loads**
- Enable Edge Functions for faster response times
- Use Vercel's Image Optimization
- Check Analytics for bottlenecks

## Advanced Configuration

### Custom Build Settings

Create `vercel.json` in your project root:

\`\`\`json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
\`\`\`

### Edge Functions

For faster global performance, deploy to Edge:

\`\`\`typescript
// app/api/route.ts
export const runtime = 'edge'
\`\`\`

### Caching

Configure caching headers:

\`\`\`typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60' }
        ]
      }
    ]
  }
}
\`\`\`

## Updating Your Deployment

### Automatic Updates

Simply push to your Git repository:

\`\`\`bash
git add .
git commit -m "Update feature"
git push origin main
\`\`\`

Vercel automatically deploys the changes.

### Manual Redeploy

From Vercel Dashboard:
1. Go to **"Deployments"**
2. Click **"..."** on any deployment
3. Select **"Redeploy"**

Or via CLI:
\`\`\`bash
vercel --prod
\`\`\`

## Rollback

If something goes wrong:

1. Go to **"Deployments"**
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**

## Cost Considerations

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Preview deployments

### Pro Tier ($20/month):
- 1 TB bandwidth
- Advanced analytics
- Password protection
- Team collaboration

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for all sensitive data
3. **Rotate JWT secrets** periodically
4. **Enable HTTPS only** (automatic on Vercel)
5. **Review deployment logs** regularly

## Next Steps

- [Set up Google Sheets](./GOOGLE_SHEETS_SETUP.md) for data storage
- [Configure Admin Panel](./ADMIN_GUIDE.md)
- Add custom domain
- Enable analytics
- Set up monitoring alerts

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
