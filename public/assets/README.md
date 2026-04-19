# BAPS Assets

This folder contains all static assets for the BAPS Offline Shopping admin panel.

## Current Logo Setup

### logo.svg (Active - Your Perfect Logo)
Your imported BAPS logo - now used throughout the entire application!

**Current Usage:**
- ✅ Sidebar logo (top-left navigation) - 40x40px
- ✅ Dashboard header - 50x50px
- ✅ Login page logo - 60x60px
- ✅ Browser favicon (favicon.ico)
- ✅ Admin profile identification

**Integration Points:**
1. **Admin Sidebar** (`src/app/admin/layout.tsx`)
2. **Dashboard Header** (`src/app/admin/dashboard/page.tsx`)
3. **Login Page** (`src/app/login/page.tsx`)
4. **Browser Tab** (favicon.ico)

## Logo Guidelines

### For Admin Panel Use:
- ✅ Simple, clean design
- ✅ High contrast for readability
- ✅ Scalable (works at small sizes)
- ✅ Professional appearance
- ✅ Brand consistency

### Technical Specifications
- **Format:** SVG (recommended for scalability)
- **Fallback:** PNG supported
- **Optimization:** Next.js Image component handles optimization
- **Accessibility:** Proper alt text included
- **Responsive:** Works at all sizes (40px to 60px+)

## Adding Custom Logo

To replace with a different logo:

1. **Replace the file:**
   ```bash
   cp /path/to/your/new/logo.svg ./logo.svg
   ```

2. **Update favicon if needed:**
   ```bash
   cp logo.svg favicon.ico
   ```

That's it! The application automatically uses the new logo everywhere.

## File Types Supported
- SVG (recommended - scalable, small file size)
- PNG (supported - provide high-resolution version)
- JPEG (supported for photos/complex images)
- WebP (modern format, excellent compression)
