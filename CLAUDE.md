# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEDICAMA is a single-page hospital bed rental website targeting Mexican customers in Estado de México and CDMX. The site uses vanilla HTML/CSS/JavaScript with no frameworks, focusing on lead generation for hospital bed rentals.

## Architecture

**Single Page Application:**
- All content sections in `index.html` with JavaScript-based navigation
- Clean URL routing handled by `web.config` for IIS deployment
- Smooth scrolling between sections using Intersection Observer API

**Key Files:**
- `index.html` - Main SPA entry point with all sections
- `assets/js/main.js` - Core functionality, navigation, and animations
- `assets/js/form-handler.js` - EmailJS integration for lead generation
- `assets/js/maps.js` - Google Maps delivery zone visualization
- `assets/css/styles.css` - CSS variables and component styles
- `assets/css/responsive.css` - Mobile-first responsive design

**External Integrations:**
- EmailJS for form submissions to adiaz2@pttmexico.com
- Google Analytics (GA4) and Google Ads conversion tracking
- Google Maps for delivery zone mapping
- No external frameworks - pure vanilla JavaScript

## Development Commands

```bash
# Start development server with live reload
npm run dev
# or
npm start

# Both commands start live-server on port 3000
# Access at: http://localhost:3000

# Build for production (placeholder)
npm run build

# Deploy (placeholder - needs configuration)
npm run deploy
```

## Configuration

**EmailJS Setup:**
- Configure credentials in `form-handler.js` lines 596-598
- See `EMAILJS_SETUP.md` for detailed setup instructions

**Analytics:**
- Google Analytics and Ads tracking already configured
- Conversion tracking for form submissions and WhatsApp clicks

**SEO:**
- `sitemap.xml` and `video-sitemap.xml` for search engine indexing
- Meta tags and structured data already implemented

## Product Information

- Manual hospital bed: $980 MXN per month
- Target market: Estado de México and CDMX
- 24-hour delivery promise, no deposit required