# Vehicle Management System - Wireframe Deployment

This is a **static wireframe/mockup** version of the Vehicle Management System that runs entirely in the browser without a backend.

## What's Included

- ✅ Full UI with all pages
- ✅ Mock data for demonstration
- ✅ Static HTML export (no server required)
- ✅ Works without MongoDB or any backend

## Quick Deploy

### Option 1: Vercel (Easiest)
```bash
cd frontend
npx vercel --prod dist
```

### Option 2: Netlify
```bash
cd frontend
npx netlify deploy --prod --dir=dist
```

### Option 3: Surge.sh
```bash
cd frontend
npx surge dist
```

### Option 4: GitHub Pages
1. Upload the `dist` folder contents to a `gh-pages` branch
2. Enable GitHub Pages in repository settings

### Option 5: Any Static Host
Simply upload the contents of the `dist` folder to any web server:
- Apache/Nginx
- AWS S3
- Cloudflare Pages
- Firebase Hosting
- etc.

## Building Locally

```bash
cd frontend
npm install
npm run build
```

The static files will be in the `dist` folder.

## Testing Locally

```bash
cd frontend/dist
npx serve
```

Then open http://localhost:3000

## Mock Data

The wireframe includes sample data for:
- Vehicles (3 sample vehicles)
- Drivers (3 sample drivers)
- Trips (3 sample trips)
- Inquiries (2 sample inquiries)
- Documents (3 sample documents)
- Fund Flow Projects (2 sample projects)
- Contractor Bills (2 sample bills)

Login with any credentials (mock auth accepts anything).

## Features Working in Wireframe

- ✅ Dashboard with stats
- ✅ Vehicle management UI
- ✅ Driver management UI
- ✅ Trip management UI
- ✅ Trip inquiries UI
- ✅ Document management UI
- ✅ Project Master (Fund Flow, Contractor Bills)
- ✅ Role-based navigation (all permissions enabled)

## Limitations

- Data is not persisted (reloads to defaults)
- File uploads are simulated
- No real-time updates
- Search/filter is client-side only
- No actual backend integration

## File Structure

```
frontend/
├── dist/                    # Static output (generated)
├── src/
│   ├── lib/
│   │   ├── mockApi.ts      # Mock API data
│   │   └── wireframeApi.ts # Mock API wrapper
│   └── app/                # Next.js pages
├── deploy-wireframe.sh     # Deployment script
└── WIREFRAME.md           # This file
```

## Switching to Real Backend

To connect to a real backend:

1. Restore the original API file:
   ```bash
   cp src/lib/api.ts.backup src/lib/api.ts
   ```

2. Update `next.config.js`:
   ```javascript
   const nextConfig = {
     images: {
       domains: ['res.cloudinary.com'],
     },
     // Remove: output: 'export'
   };
   ```

3. Update environment:
   ```
   NEXT_PUBLIC_API_URL=http://your-api.com/api
   ```

4. Rebuild with `npm run build`

## Support

For questions or issues with the wireframe deployment.
