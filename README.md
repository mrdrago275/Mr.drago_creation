# MR. DRAGO — Static Website (HTML / CSS / JS)

This repository contains a production-ready static website template for MR. DRAGO (premium AI wallpapers). It's built without frameworks and designed for GitHub Pages.

Folder structure (recommended):
- index.html
- wallpaper.html
- css/
  - styles.css
- js/
  - main.js
- assets/
  - images/
    - dragon-hero-1600.jpg
    - dragon-hero-1200.jpg
    - dragon-hero-800.jpg
    - thumb1.jpg
    - thumb1-full.jpg
    - thumb2.jpg
    - thumb2-full.jpg
    - thumb3.jpg
    - thumb3-full.jpg
    - collection-*.jpg
  - icons/
    - favicon.svg

Quick setup
1. Replace placeholder images in `assets/images/` with your actual artwork. Particularly replace:
   - `assets/images/dragon-hero-1600.jpg` (and 1200/800 variants) with the uploaded dragon artwork.
   - `thumb*-full.jpg` with full-resolution images for download.
2. Optionally host fonts locally for best performance.
3. Commit to your repo root and enable GitHub Pages (docs folder or main branch).
4. Test Lighthouse and tune images (serve appropriately sized WebP/AVIF variants for best score).

Performance tips
- Convert images to modern formats (AVIF / WebP) and provide srcset.
- Host fonts locally and preload critical fonts.
- Use a small service worker to cache images for repeat visits.
- Consider inlining critical CSS for the hero if you require the absolute highest Lighthouse score.

Accessibility & SEO
- Semantic tags used and proper aria attributes provided.
- Replace social links and site URL in JSON-LD for production.

License & next steps
- This is a template. When ready, I can:
  - Convert images to WebP/AVIF and generate srcset for each size.
  - Add a small build step (Node script) to create optimized images.
  - Push the site into your GitHub repo and create a GitHub Pages workflow.

Enjoy — tell me if you want this committed directly to a repo (I can push files once you confirm repo owner/name and permission).
