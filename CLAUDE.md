# Claude Code Configuration for vue-TIL

## Project Overview
This is a VuePress v1 documentation site containing technical learning notes (Today I Learned) covering various topics including Swift, iOS development, algorithms, web technologies, and computer science concepts.

## Project Structure
- **docs/**: Main content directory containing markdown files organized by topic
- **docs/.vuepress/config.js**: VuePress configuration file
- **package.json**: Node.js dependencies and scripts
- **docs/deploy.sh**: GitHub Pages deployment script

## Available Commands

### Development
```bash
# Start development server
npm run dev
# or with legacy OpenSSL support
npm run docs:dev

# Start development server (alternative)
yarn dev
```

### Build
```bash
# Build for production
npm run build
# or with legacy OpenSSL support
npm run docs:build

# Build for production (alternative)
yarn build
```

### Deployment
```bash
# Deploy to GitHub Pages
cd docs && ./deploy.sh
```

## Content Categories
- **Swift**: iOS development with Swift language
- **SwiftUI**: Modern iOS UI framework
- **RxSwift**: Reactive programming in Swift
- **Algorithm**: Data structures and algorithms
- **Computer Science**: Networking and OS concepts
- **React/React Native**: Frontend development
- **VuePress**: Documentation site setup
- **Git**: Version control
- **Python**: Python programming
- **JavaScript/TypeScript**: Web development

## Key Features
- KaTeX math rendering support
- Code syntax highlighting with copy functionality
- Google Analytics integration (GA: G-QP5LL1SE8Q)
- PWA support with service worker
- Responsive design with smooth scrolling
- Search functionality
- Reading progress indicator

## Development Notes
- Uses VuePress v1.9.5
- Requires Node.js with legacy OpenSSL provider for newer Node versions
- Deployed to GitHub Pages at: https://parkjju.github.io/vue-TIL/
- Korean language support (ko-KR)

## Testing & Quality
No automated tests are configured. Content is primarily documentation and learning notes.

## Plugins Used
- @vuepress/plugin-back-to-top
- @vuepress/plugin-google-analytics
- @vuepress/plugin-medium-zoom
- @vuepress/plugin-pwa
- vuepress-plugin-code-copy
- vuepress-plugin-reading-progress
- vuepress-plugin-sitemap
- vuepress-plugin-smooth-scroll