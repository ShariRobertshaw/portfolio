# Shari Robertshaw - Portfolio Website

A responsive portfolio website showcasing skills and work, built for GitHub Pages hosting.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Animated Text**: Fade-in and upward motion animations on first load
- **Horizontal Scroll**: Work section with smooth horizontal scrolling
- **Interactive Buttons**: Flying particle effects on hover (color: #114D00)
- **Email Copy**: Click email address to copy to clipboard with confirmation
- **LinkedIn Integration**: Direct link to LinkedIn profile
- **Reusable Components**: Navigation and footer components for consistency


## Project Structure

```
.
├── index.html          # Main homepage
├── about.html          # About page (placeholder)
├── styles.css          # All styles
├── scripts.js          # JavaScript functionality
├── components.js       # Reusable nav and footer components
├── assets/             # Image assets (you'll need to add your images)
└── README.md          # This file
```

## Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Select the branch (usually `main`) and folder (`/` root)
4. Your site will be available at `https://[username].github.io/[repository-name]`

## Adding New Pages

1. Create a new HTML file (e.g., `about.html`)
2. Include the same structure with `nav-container` and `footer-container` divs
3. Include `components.js` and `scripts.js` scripts
4. The navigation and footer will automatically load

## Adding Images

Create an `assets` folder and add your images:
- `assets/hypa-logo.png` - HYPA logo for first work card
- `assets/hypa-screenshot.png` - HYPA app screenshot
- `assets/data-app-1.png` - First data app screenshot
- `assets/data-app-2.png` - Second data app screenshot

## Customization

### Colors
Edit CSS variables in `styles.css`:
- `--green-dark`: #114D00
- `--green-light`: #E0E7D8
- `--bg-color`: #fbfff6

### Adding Work Items
Add new `.work-item` divs inside `.work-gallery` in `index.html`

### Updating Content
Edit the HTML directly in `index.html` - the structure is straightforward and easy to update.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses Intersection Observer API for animations
- Uses Clipboard API for email copying (with fallback)

