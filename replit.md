# Overview

This is a personal portfolio website with an integrated blog system. The project showcases a developer's work, skills, and professional background while providing a platform for sharing technical content through blog posts. The site features a clean, modern design with a focus on user experience and accessibility.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static Site Structure**: Pure HTML/CSS/JavaScript implementation without frameworks
- **Responsive Design**: Mobile-first approach using CSS custom properties and flexible layouts
- **Component-Based CSS**: Modular styling with CSS custom properties for consistent theming
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features

## Navigation System
- **Single Page Application Feel**: Smooth scrolling navigation between sections
- **Mobile-Responsive Menu**: Hamburger menu for mobile devices with toggle functionality
- **Active State Management**: Dynamic highlighting of current section in navigation

## Blog System
- **Markdown-Based Content**: Blog posts stored as Markdown files in structured directories
- **Static Content Generation**: JavaScript-based markdown parser for client-side rendering
- **File-Based Organization**: Posts organized in individual directories with README.md files
- **Frontmatter Support**: YAML frontmatter for post metadata (title, date, category, tags, excerpt)

## Content Management
- **Hierarchical Structure**: Clear separation between portfolio and blog content
- **SEO Optimization**: Meta tags, semantic HTML, and structured data
- **Asset Organization**: Centralized CSS and JavaScript files in assets directory

## Styling Architecture
- **CSS Custom Properties**: Comprehensive design system with color tokens, typography scales, and spacing units
- **Mobile-First Responsive Design**: Breakpoint-based layout system
- **Modern CSS Features**: Grid and Flexbox for layout, custom properties for theming
- **Typography System**: Inter font family with defined size scales and weights

# External Dependencies

## Third-Party Services
- **Font Awesome**: Icon library (v6.4.0) loaded via CDN
- **Google Fonts**: Inter font family for typography
- **GitHub Pages**: Hosting platform (inferred from meta tags)

## Browser APIs
- **Local Storage**: For client-side data persistence in blog functionality
- **DOM API**: For dynamic content manipulation and interactive features
- **Intersection Observer**: Likely used for scroll-based animations and navigation highlighting

## Development Tools
- **Markdown Parser**: Custom JavaScript implementation for converting markdown to HTML
- **No Build Process**: Direct file serving without compilation or bundling
- **Version Control**: Git-based workflow (implied by GitHub Pages deployment)