# StatsBoards Frontend

A modern Angular 19 sports statistics and scoreboarding application frontend with real-time capabilities for managing football (soccer) tournaments, matches, teams, players, and live game data.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run start

# Open browser to http://localhost:4200
```

### Available Scripts
```bash
npm run start          # Start development server with hot reload
npm run build          # Build for production
npm run watch          # Build with watch mode for development
npm run test           # Run unit tests
```

## 🏗️ Architecture

### Technology Stack
- **Angular 19** - Modern web framework with standalone components
- **NgRx** - Reactive state management with feature-based organization
- **Taiga UI** - Comprehensive component library for modern interfaces
- **TypeScript** - Type-safe development experience
- **RxJS** - Reactive programming for handling async operations
- **LESS** - CSS preprocessor for styling

### Key Features
- **Match Management** - Sports matches with real-time scoreboard display
- **Person/Player Management** - Team rosters and player statistics
- **Tournament Management** - Competition organization and scheduling
- **Sponsor Management** - Advertisement and sponsorship functionality
- **Football Events** - Detailed game event tracking with complex statistics
- **Real-time Updates** - WebSocket integration for live data

## 📁 Project Structure

```
src/app/
├── components/           # Feature-based components
│   ├── match/           # Match management
│   ├── person/          # Person/player management
│   ├── team/            # Team management
│   ├── tournament/      # Tournament organization
│   ├── adv/             # Sponsor/advertisement management
│   ├── gameclock/       # Game clock controls
│   ├── playclock/       # Play clock controls
│   └── ...
├── store/               # Global NgRx store modules
│   ├── pagination/      # Pagination state
│   ├── search/          # Search functionality
│   ├── websocket/       # WebSocket connection management
│   └── ui/              # UI state management
├── base/                # Core services and utilities
├── environments/        # Environment configurations
└── app.routes.ts        # Route definitions with state injection
```

## 🏛️ Component Architecture

### Standalone Components
All components are standalone (no NgModules) following Angular 19 best practices:
- Dependencies imported directly in component `imports` array
- Services and effects provided at route level for better code splitting
- Feature-based organization with dedicated directories

### State Management with NgRx
- **Feature-based organization** - Each feature manages its own state slice
- **Route-based state injection** - States and effects provided at route level
- **Global modules** - Shared functionality (pagination, search, websocket, ui)
- **TypeScript integration** - Strongly typed selectors and actions

### Routing Configuration
```typescript
// Example route with state injection
{
  path: 'persons',
  component: AllPersonsComponent,
  providers: [
    provideState(personFeatureKey, personReducer),
    provideState(searchFeatureKey, searchReducer),
    provideEffects(PersonEffects, SearchEffects),
  ],
}
```

## 🎨 UI Components

### Taiga UI Integration
- Comprehensive component library for modern interfaces
- Custom webpack configuration for compatibility
- Material Design-inspired components
- Accessibility-focused components

### Styling
- LESS preprocessing for styles
- Component-scoped styling
- Responsive design patterns
- Theme support through Taiga UI

## 🔄 Real-time Features

### WebSocket Integration
- Real-time match data streaming
- Live scoreboard updates
- Connection management with automatic reconnection
- Event-driven state updates

### Real-time Endpoints
- Match data streaming for live updates
- Scoreboard synchronization
- Clock synchronization (game clock, play clock)

## 🧪 Testing

### Test Configuration
- **Jasmine with Karma** - Unit testing framework
- Test configuration in `karma.conf.js`
- Component tests alongside component files
- Coverage reporting available

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
ng test --code-coverage

# Run tests in watch mode
ng test --watch
```

## 🔧 Configuration

### Environment-based Configuration
```typescript
// Development
src/environments/environment.ts

// Production
src/environments/environment.prod.ts
```

### Constants and URLs
- URL construction handled in `src/app/base/constants.ts`
- Dynamic protocol/host/port configuration
- Environment-specific API endpoints

## 📦 Build Configuration

### Angular CLI with Vite
- Angular CLI 19.2.5 with Vite under the hood
- Custom webpack configuration for Taiga UI compatibility
- Optimized production builds
- Asset handling including Taiga UI icon integration

### Build Process
```bash
# Development build
npm run build

# Production build
ng build --configuration production

# Build with watch
npm run watch
```

## 🔌 API Integration

### Service Layer
Each feature includes dedicated services for API communication:
- Person/Player services
- Match and tournament services
- Team management services
- Real-time data services

### HTTP Client
Axios-based HTTP client with interceptors for:
- Authentication
- Error handling
- Request/response logging
- Rate limiting

## 🎯 Key Components

### Match Management
- Match scheduling and management
- Real-time scoreboard display
- Game clock and play clock integration
- Football event tracking

### Tournament Organization
- Tournament creation and management
- Season association
- Team registration
- Match scheduling

### Sponsor Management
- Advertisement management
- Sponsor line configuration
- Display integration
- Dynamic content loading

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Output in dist/ directory
```

### Environment Variables
Configure through environment files:
- API endpoints
- WebSocket URLs
- Feature flags
- Analytics configuration

## 📚 Development Guidelines

### Adding New Features
1. Create feature directory under `src/app/components/`
2. Implement standalone component with HTML and LESS
3. Create service for API communication
4. Add NgRx store with actions, reducers, effects, selectors
5. Configure routing with state injection

### Code Standards
- TypeScript strict mode enabled
- Standalone components only
- Feature-based organization
- Reactive programming patterns
- Consistent naming conventions

## 🛠️ Dependencies

### Core Dependencies
- Angular 19.2.4 (animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router)
- NgRx 19.0.1 (effects, router-store, store, store-devtools)
- Taiga UI 4.30.0 (core, kits, addons, icons, styles)
- RxJS 7.8.0
- TypeScript 5.8.2

### Development Dependencies
- Angular CLI 19.2.5
- Jasmine/Karma for testing
- ESLint and Prettier for code quality
- Webpack custom configuration
- Vite for build tooling

## 📄 License

Private project - All rights reserved.