# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEDICAMA is a single-page hospital bed rental website targeting Mexican customers. The site provides quotes for different types of medical beds (manual, electric, UCI) with flexible rental periods and includes lead generation functionality.

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

## Architecture & Structure

### Core Architecture
- **Single Page Application (SPA)** - All content in `index.html`
- **Vanilla JavaScript** - No frameworks, modular approach
- **CSS Variables** - Centralized theming system
- **Mobile-first responsive design**

### File Structure
```
/assets/
  /css/
    styles.css      - Main styles with CSS variables
    responsive.css  - Media queries and responsive design
    animations.css  - Animation classes and keyframes
  /js/
    main.js         - Core functionality and UI interactions
    form-handler.js - Form validation, submission, and analytics
    animations.js   - Animation utilities and effects
  /images/          - Product images and assets
```

### Key Components

**Navigation System** (`main.js:27-69`)
- Sticky navbar with scroll effects
- Active section highlighting using Intersection Observer
- Mobile hamburger menu with overlay

**Form System** (`form-handler.js`)
- Multi-step validation with real-time feedback
- Price calculation based on bed type and duration
- Draft saving to localStorage
- Integration hooks for analytics (GA4, Facebook Pixel)
- Lead generation with WhatsApp integration

**Animation System**
- Scroll-triggered animations using Intersection Observer
- CSS transitions with `fade-in-up` classes
- Dynamic typing effects for hero section

### JavaScript Patterns

**Module Pattern**: Each JS file exports functions to global scope for cross-file communication
```javascript
window.MediCamaForm = {
    validateForm,
    calculatePrice,
    sendConversionEvent,
    showNotification
};
```

**Observer Pattern**: Heavy use of Intersection Observer for:
- Section highlighting in navigation
- Scroll animations
- Lazy loading preparation

**Form State Management**: Centralized form handling with:
- Real-time validation
- Price calculations
- Draft persistence
- Analytics tracking

## Development Guidelines

### CSS Approach
- Use CSS variables defined in `:root` for consistent theming
- Follow BEM-like naming for components
- Mobile-first responsive design
- Animations use `transform` and `opacity` for performance

### JavaScript Conventions
- Use vanilla JavaScript with modern ES6+ features
- Implement defensive programming with null checks
- Add comprehensive error handling and console logging
- Use debounce/throttle for performance optimization

### Form Integration
- Forms simulate submission (async/await pattern ready)
- Webhook and email service integration prepared
- Analytics tracking configured for GA4 and Facebook Pixel
- WhatsApp integration for direct contact

### Business Logic
- Mexican phone number formatting (10 digits)
- Peso (MXN) currency formatting
- Service area validation by postal code
- Business hours validation
- Pricing tiers: Manual ($150/day), Electric ($250/day), UCI ($400/day)
- Discounts: 5-20% based on rental duration

## Key Features to Maintain

1. **Price Calculator**: Dynamic pricing based on bed type and duration with discount tiers
2. **Lead Tracking**: Comprehensive analytics integration for conversion tracking  
3. **Mobile Experience**: Touch-friendly interface with smooth animations
4. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
5. **Performance**: Lazy loading, debounced inputs, optimized animations
6. **Localization**: Mexican Spanish text, peso currency, local phone formatting

## Integration Notes

The codebase is prepared for integration with:
- EmailJS or similar email services (`form-handler.js:584`)
- Webhook endpoints for CRM systems (`form-handler.js:557`)
- Google Analytics 4 and Facebook Pixel tracking
- Google Maps Places API for address autocomplete
- WhatsApp Business API for direct messaging

Contact form submissions currently simulate async processing but include complete error handling and user feedback patterns for real integration.

## Known Issues & Solutions

### Animation and Visibility Problems
- **Hero title visibility**: The hero title animations can sometimes cause text to become invisible due to conflicting CSS transforms and opacity settings
- **Solution**: When text becomes invisible, use inline styles with `!important` to override problematic CSS:
  ```html
  <h1 style="opacity: 1 !important; transform: none !important; visibility: visible !important;">
  ```
- **Root cause**: Conflicts between `initTypingEffect()` JavaScript animations and CSS classes like `drop-in-title` and `fade-in-up`

### Browser Cache Issues
- **Problem**: CSS and JS changes may not reflect due to browser caching
- **Solution**: Add version parameters to asset URLs:
  ```html
  <link rel="stylesheet" href="./assets/css/styles.css?v=timestamp">
  <script src="./assets/js/main.js?v=timestamp"></script>
  ```
- **Force refresh**: Use Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) for hard refresh

### CSS Class Conflicts
- Multiple animation classes (`drop-in-title`, `fade-in-up`) can conflict
- When debugging visibility issues, temporarily remove animation classes and use direct inline styles
- The `hero-highlight` class should apply `color: var(--primary-blue)` but may be overridden by animation styles

### Hero Image Sizing
- **Current configuration**: Hero container uses `grid-template-columns: 1fr 1.2fr` giving the image column 20% more space
- **Container max-width**: 1400px (increased from default 1200px)
- **Image max-width**: 1000px within its grid column
- **Responsive behavior**: Image scales down proportionally on smaller screens

## Debugging Tips

### Text Visibility Issues
1. Check browser developer tools → Elements tab
2. Look for inline styles with `opacity: 0` or `transform: translateY(-100px)`
3. Verify CSS variables are loading: `:root { --primary-blue: #2563eb }`
4. Test in incognito mode to rule out cache issues

### Animation Debugging
- The `initTypingEffect()` function in `main.js` manages hero title animations
- Animation states are set via inline styles, then CSS classes are added
- Use browser timeline/performance tools to debug animation conflicts