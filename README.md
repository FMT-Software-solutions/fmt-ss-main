# FMT Software Solutions

A modern web application built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Shadcn UI components. This project showcases premium software solutions, free tools, and expert training services.

## 🚀 Features

- Modern UI with Shadcn UI components and Tailwind CSS
- Fully responsive design for all device sizes
- Dark/light mode support
- Fast performance with Next.js 15 and React 19
- Type-safe development with TypeScript
- Beautiful animations with Framer Motion

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/FMT-Software-solutions/fmt-ss-main
cd codecraft-solutions
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

> Note: We use `--legacy-peer-deps` flag to handle React 19 compatibility with some dependencies that haven't officially updated their peer dependencies yet.

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
├── app/                  # Next.js App Router
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── free-apps/        # Free applications page
│   ├── store/            # Store page
│   ├── training/         # Training page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # Shadcn UI components
│   ├── footer.tsx        # Footer component
│   ├── mode-toggle.tsx   # Dark/light mode toggle
│   ├── navigation.tsx    # Navigation component
│   └── theme-provider.tsx # Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── .eslintrc.json        # ESLint configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Configuration

### Next.js 15 Configuration

The project uses Next.js 15 with the following configuration in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  }
};

module.exports = nextConfig;
```

### Tailwind CSS Configuration

The project uses Tailwind CSS with a custom configuration in `tailwind.config.ts`, including:

- Custom container configuration
- Custom color scheme
- Custom animations
- Responsive design breakpoints

## 🚨 Known Issues and Workarounds

### React 19 Compatibility

Some dependencies haven't officially updated their peer dependencies to support React 19 yet. We use the following workarounds:

1. Using `--legacy-peer-deps` flag during installation
2. Adding overrides in `package.json` for specific packages:

```json
"overrides": {
  "react-is": "^19.0.0",
  "cmdk": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-remove-scroll": {
    "@types/react": "^19.0.0"
  },
  "react-remove-scroll-bar": {
    "@types/react": "^19.0.0"
  }
}
```

## 📚 Best Practices

### React and Next.js

1. **Use Server Components when possible**: Next.js 15 encourages the use of React Server Components for improved performance.

2. **Client Components**: Use the `"use client"` directive only when necessary (for components that need browser APIs or React hooks).

3. **Data Fetching**: Prefer using Next.js data fetching methods over client-side fetching when possible.

4. **Image Optimization**: Use Next.js `<Image>` component for optimized images.

5. **Code Splitting**: Leverage Next.js automatic code splitting for better performance.

### TypeScript

1. **Type Everything**: Always define proper types for props, state, and function returns.

2. **Avoid `any`**: Use specific types or `unknown` instead of `any`.

3. **Use Interfaces**: Prefer interfaces for object shapes to benefit from declaration merging.

### Styling with Tailwind CSS

1. **Mobile-First Approach**: Start with mobile designs and use responsive classes for larger screens.

2. **Use Tailwind's Utility Classes**: Leverage Tailwind's utility classes instead of writing custom CSS.

3. **Extract Components**: Create reusable components for repeated UI patterns.

4. **Use Container Class**: Use the `container` class for consistent content width and centering.

### Shadcn UI Components

1. **Customization**: Customize components by modifying their source code in the `components/ui` directory.

2. **Composition**: Compose complex UI by combining simpler components.

3. **Variants**: Use the `cva` function for component variants.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/) 