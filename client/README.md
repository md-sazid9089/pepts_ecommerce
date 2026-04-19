# PEPTS E-Commerce Platform

A premium, high-end e-commerce platform built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

## 🎨 Design System

This project uses a **white-based design system** emphasizing premium aesthetics, generous whitespace, and sophisticated micro-interactions.

### Quick Start with Design System
- 🚀 [Design System Summary](./DESIGN_SYSTEM_SUMMARY.md) - Overview & what's included
- 📖 [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Code examples & patterns
- 🎯 [Design Reference](./DESIGN_REFERENCE.md) - Quick color/spacing lookup
- ✅ [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md) - Step-by-step guide
- 🎨 [Visual Guide](./VISUAL_GUIDE.md) - Visual cheat sheet
- 📋 [Full Specification](./WHITESPACE_DESIGN_SYSTEM.md) - Complete design spec

## 🏗️ Project Structure

```
pepts_ecommerce/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Global styles & CSS variables
│   │   └── (store)/         # Store routes
│   ├── components/          # Reusable components
│   ├── context/             # React context (Auth, Cart, Wishlist)
│   ├── data/                # Static data & fixtures
│   └── utils/               # Utility functions & helpers
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System Quick Reference

### Colors
- **Primary**: Pure White (#FFFFFF)
- **Secondary**: Ghost White (#F9FAFB)
- **Text**: Deep Charcoal (#111827)
- **Accent**: Midnight Cobalt (#1E293B)

### Fonts
- **Body**: Inter (300-800)
- **Headings**: Plus Jakarta Sans (500-800)

### Spacing Scale
All from 4px to 80px using variables: `var(--spacing-xs)` to `var(--spacing-8xl)`

## 📦 Component Classes

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>

<!-- Cards -->
<div class="card card-elevated">Content</div>

<!-- Inputs -->
<input class="input" type="text" />

<!-- Badges -->
<span class="badge badge-primary">Badge</span>
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | CSS variables & component classes |
| `tailwind.config.ts` | Tailwind configuration |
| `package.json` | Dependencies |

## 📝 Documentation

All design documentation is in the root directory:
- **DESIGN_SYSTEM_SUMMARY.md** - Complete overview
- **WHITESPACE_DESIGN_SYSTEM.md** - Full specification
- **IMPLEMENTATION_GUIDE.md** - Code examples
- **DESIGN_REFERENCE.md** - Quick lookup
- **VISUAL_GUIDE.md** - Cheat sheet

## 🔧 Technology Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility CSS
- **React Icons 5.6** - Icon library

## 📞 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)

---

**Last Updated**: April 2026  
**Design System Version**: 1.0.0 (White-Based)  
**Status**: Production Ready
