# StatsBoards Frontend

A modern Angular 20 sports statistics and scoreboarding application frontend with real-time capabilities for managing football (soccer) tournaments, matches, teams, players, and live game data.

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

- **Angular 20.2.14** - Modern web framework with standalone components
- **NgRx 20.0.0** - Reactive state management with feature-based organization
- **Taiga UI 4.66.0** - Comprehensive component library for modern interfaces
- **TypeScript 5.8.2** - Type-safe development experience
- **RxJS 7.8.0** - Reactive programming for handling async operations
- **LESS** - CSS preprocessor for styling

### Key Features

- **Match Management** - Sports matches with real-time scoreboard display
- **Person/Player Management** - Team rosters and player statistics
- **Tournament Management** - Competition organization and scheduling
- **Team Management** - Team organization and tournament registration
- **Player Statistics** - Detailed player tracking across matches and tournaments
- **Sponsor Management** - Advertisement and sponsorship functionality
- **Football Events** - Detailed game event tracking with complex statistics
- **Real-time Updates** - WebSocket integration for live data
- **Device Detection** - Responsive design with device-specific optimizations
- **QR Code Generation** - Quick access codes for matches and entities

## 📁 Project Structure

```
src/app/
├── components/           # Feature-based components
│   ├── match/           # Match management
│   ├── person/          # Person/player management
│   ├── player/          # Player statistics and management
│   ├── team/            # Team management
│   ├── tournament/      # Tournament organization
│   ├── player-match/    # Player match data
│   ├── player-team-tournament/  # Player-team-tournament relations
│   ├── position/        # Position definitions
│   ├── season/          # Season management
│   ├── sport/           # Sport configurations
│   ├── adv/             # Sponsor/advertisement management
│   ├── gameclock/       # Game clock controls
│   ├── playclock/       # Play clock controls
│   ├── match-event/     # Football event tracking
│   ├── match-scoreboard-admin/   # Admin scoreboard interface
│   ├── match-scoreboard-display/ # Display scoreboard interface
│   ├── scoreboard-data/  # Scoreboard data management
│   ├── header/          # Application header
│   ├── layout/          # Main layout component
│   └── home/            # Home dashboard
├── store/               # Global NgRx store modules
│   ├── pagination/      # Pagination state
│   ├── search/          # Search functionality
│   ├── websocket/       # WebSocket connection management
│   ├── ui/              # UI state management
│   ├── breadcrumbs/     # Breadcrumb navigation
│   ├── crud/            # Generic CRUD operations
│   └── file/            # File upload/download state
├── base/                # Core services and utilities
│   ├── constants.ts     # Application constants
│   ├── footballHelpers.ts # Football-specific utilities
│   ├── formHelpers.ts   # Form validation helpers
│   └── helpers.ts       # General utility functions
├── services/            # Shared services
│   ├── auth.service.ts  # Authentication handling
│   ├── base.api.service.ts  # Base API service
│   ├── web-socket.service.ts # WebSocket management
│   └── ...              # Other shared services
├── interceptors/        # HTTP interceptors
│   └── auth.interceptor.ts  # Authentication interceptor
├── pipes/               # Custom pipes
│   ├── add-sign.pipe.ts
│   ├── has-title.pipe.ts
│   ├── team-name.pipe.ts
│   └── ...              # Other utility pipes
├── shared/              # Shared components and utilities
│   ├── scoreboards/     # Reusable scoreboard components
│   ├── ui/              # Shared UI components
│   └── animations/      # Shared animations
├── type/                # TypeScript type definitions
│   ├── match.type.ts
│   ├── player.type.ts
│   └── ...              # Other type definitions
├── environments/        # Environment configurations
└── app.routes.ts        # Route definitions with state injection
```

## 🏛️ Component Architecture

### Standalone Components

All components are standalone (no NgModules) following Angular 20 best practices:

- Dependencies imported directly in component `imports` array
- Services and effects provided at route level for better code splitting
- Feature-based organization with dedicated directories

### State Management with NgRx

- **Feature-based organization** - Each feature manages its own state slice
- **Route-based state injection** - States and effects provided at route level
- **Global modules** - Shared functionality (pagination, search, websocket, ui, crud, file, breadcrumbs)
- **TypeScript integration** - Strongly typed selectors and actions
- **Effects** - Side effects handled through NgRx effects for API calls and async operations

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
- Mobile support via `@taiga-ui/addon-mobile`
- Table components via `@taiga-ui/addon-table`
- Legacy components via `@taiga-ui/legacy`
- Material Design-inspired components
- Accessibility-focused components
- i18n support via `@taiga-ui/i18n`

### Additional UI Libraries

- **Maskito** - Advanced input masking for phone numbers and other formats
- **NGX Device Detector** - Device and browser detection
- **NGX Ellipsis** - Text truncation with ellipsis
- **QRCode** - QR code generation
- **TextFit** - Dynamic text sizing for scoreboards

### Styling

- LESS preprocessing for styles
- Component-scoped styling
- Responsive design patterns
- Theme support through Taiga UI
- Custom fonts (Gunterz, IntegralCF, NotoSans)

## 🔄 Real-time Features

### WebSocket Integration

- Real-time match data streaming
- Live scoreboard updates
- Connection management with automatic reconnection
- Event-driven state updates through NgRx effects

### Real-time Endpoints

- Match data streaming for live updates
- Scoreboard synchronization
- Clock synchronization (game clock, play clock)
- Player statistics updates

## 🧪 Testing

### Test Configuration

- **Jasmine 5.1.0 with Karma 6.4.0** - Unit testing framework
- Test configuration in `karma.config.js`
- Component tests alongside component files
- Coverage reporting available
- LESS support in test builds

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
src / environments / environment.ts;

// Production
src / environments / environment.prod.ts;

// Production Backend
src / environments / environment.prod - back.ts;
```

### Constants and URLs

- URL construction handled in `src/app/base/constants.ts`
- Dynamic protocol/host/port configuration
- Environment-specific API endpoints

## 📦 Build Configuration

### Angular CLI with Vite

- Angular CLI 20.2.14 with Vite 6.2.3
- Custom build configuration for Taiga UI compatibility
- Webpack 5.97.1 for advanced customization
- ESBuild for fast builds
- Optimized production builds with budgets (2MB warning, 4MB error)
- Asset handling including Taiga UI icon integration

### Build Configurations

```bash
# Development build
npm run build

# Production build
ng build --configuration production

# Production backend build
ng build --configuration production-back

# Build with watch
npm run watch
```

### Budget Configuration

- Initial bundle: 2MB warning, 4MB error
- Component styles: 10KB warning, 20KB error

## 🔌 API Integration

### Service Layer

Each feature includes dedicated services for API communication:

- Person/Player services
- Match and tournament services
- Team management services
- Real-time data services
- Authentication service
- File upload/download services

### HTTP Client

Axios 1.11.1 with interceptors for:

- Authentication
- Error handling
- Request/response logging
- Rate limiting
- HTTP proxy middleware support

## 🎯 Key Components

### Match Management

- Match scheduling and management
- Real-time scoreboard display (admin and display interfaces)
- Game clock and play clock integration
- Football event tracking
- Match-with-full-data component for comprehensive data view

### Tournament Organization

- Tournament creation and management
- Season association with dropdown selection
- Team registration and team-tournament relations
- Match scheduling
- Island list visualization

### Player Management

- Player creation and editing
- Player-match statistics
- Player-team-tournament relationships
- Position assignments
- Detailed player tracking across all competitions

### Team Management

- Team creation and editing
- Team-to-tournament registration
- Team dropdown selection
- Player roster management

### Sponsor Management

- Advertisement management
- Sponsor line configuration
- Display integration
- Dynamic content loading

## 🚀 Deployment

### Production Build

```bash
# Build for production
ng build --configuration production

# Output in dist/statsboards-angular-legacy/ directory
```

### Build Options

- **Production** - Standard production build
- **Production Backend** - Backend-specific production build
- **Development** - Unoptimized build with source maps

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
3. Create service for API communication extending BaseApiService
4. Add NgRx store with actions, reducers, effects, selectors
5. Configure routing with state injection
6. Add TypeScript types in `src/app/type/`
7. Add shared pipes or services if needed

### Code Standards

- TypeScript strict mode enabled
- Standalone components only
- Feature-based organization
- Reactive programming patterns with RxJS
- Consistent naming conventions
- LESS for all styling
- NgRx for state management

## 🛠️ Dependencies

### Core Dependencies

- Angular 20.2.14 (animations, cdk, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router)
- NgRx 20.0.0 (effects, router-store, store, store-devtools)
- Taiga UI 4.66.0 (core, cdk, kits, icons, styles, i18n, polymorpheus, addon-mobile, addon-table, legacy, layout)
- RxJS 7.8.0
- TypeScript 5.8.2
- Axios 1.11.1

### UI Utilities

- Maskito 3.11.1 (core, kit, angular, phone)
- @ng-web-apis/\* 4.14.0 (common, platform, mutation-observer, intersection-observer, resize-observer, screen-orientation)
- libphonenumber-js 1.12.33
- ngx-device-detector 10.0.2
- ngx-ellipsis 5.0.4
- qrcode 1.5.3
- textfit 2.4.0

### Development Dependencies

- Angular CLI 20.2.14
- Angular DevKit Build Angular 20.2.14
- Jasmine 5.1.0 with Karma 6.4.0 for testing
- Vite 6.2.3 for build tooling
- Webpack 5.97.1 for advanced customization
- ESBuild for fast builds
- Prettier 3.2.4 for code formatting

## 📄 License

Private project - All rights reserved.
