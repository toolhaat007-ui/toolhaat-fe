# ToolHaat Frontend — Vercel Deployment

## One-time setup

### 1. Import project on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → select `toolhaat-frontend`
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `.` (default)
5. Click **Deploy** — first deploy uses mock data (no env vars yet)

### 2. Add environment variables
Go to your project → **Settings → Environment Variables**. Add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.up.railway.app/api/v1` |
| `REVALIDATE_SECRET` | `25b980f687750ee633afd880c0560434863a9ec752e9b3f80b31079452ce74d8` |

Set both for **Production**, **Preview**, and **Development** environments.

### 3. Redeploy
After adding env vars → **Deployments** tab → click ⋯ on latest → **Redeploy**.

### 4. Custom domain
- Vercel Dashboard → **Settings → Domains**
- Add `toolhaat.com` and `www.toolhaat.com`
- Update DNS: add CNAME records as Vercel instructs

### 5. Update Railway backend
After getting your Vercel URL, update the backend env var:
```
FRONTEND_URL=https://toolhaat.com
```

### Auto-deploy
Every push to `main` triggers a new Vercel deploy ✅  
Pull request branches get a unique preview URL automatically ✅
