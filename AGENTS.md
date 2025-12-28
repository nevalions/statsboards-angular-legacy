# AGENTS.md - Development Guidelines

## Build, Lint, and Test Commands

### Build Commands

```bash
npm run start          # Start development server (http://localhost:4200)
npm run build          # Production build
npm run watch          # Build with watch mode
```

### Test Commands

```bash
npm run test           # Run all tests
ng test                # Run tests in watch mode
ng test --karma-config karma.conf.js  # Run tests with explicit Karma config
ng test --code-coverage  # Run tests with coverage

# Run single test file
ng test --include '**/person.component.spec.ts'
ng test --include '**/person/**/*.spec.ts'  # Run all tests in person feature
```

**Important:**

- Tests must be run with **Firefox** browser
- Karma configuration is set to use `FirefoxHeadless` browser
- Test execution requires Firefox to be installed on the system
- Use `ng test --karma-config karma.conf.js` to explicitly specify the Karma configuration file

## Code Style Guidelines

### Editor Configuration (.editorconfig)

- 2 space indentation
- UTF-8 charset
- Insert final newline on save
- Trim trailing whitespace
- Single quotes for TypeScript files

### TypeScript Configuration

- Strict mode enabled: `strict: true`
- No implicit returns: `noImplicitReturns: true`
- No property access from index signature
- No fallthrough cases in switch
- Force consistent casing: `forceConsistentCasingInFileNames: true`

### Import Order

1. Angular core/common/framework imports
2. External library imports (RxJS, Taiga UI, etc.)
3. Internal application imports (services, types, components)
4. Relative imports

```typescript
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, catchError } from "rxjs";
import { ErrorHandlingService } from "../../services/error.service";
import { IPerson } from "../../type/person.type";
```

### Component Structure

All components are standalone with this pattern:

```typescript
@Component({
  selector: "app-feature-name", // kebab-case, app prefix
  standalone: true, // Always standalone
  imports: [
    /* dependencies */
  ], // All imports listed
  templateUrl: "./feature-name.component.html",
  styleUrl: "./feature-name.component.less",
})
export class FeatureNameComponent {
  // Component logic
}
```

### Service Patterns

Services extending BaseApiService for CRUD operations:

```typescript
@Injectable({
  providedIn: "root",
})
export class PersonService extends BaseApiService<IPerson> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super("persons", http, errorHandlingService);
  }
}
```

Facade services for state management:

```typescript
@Injectable({ providedIn: "root" })
export class Person {
  currentPerson$: Observable<IPerson | null>;
  allPersons$: Observable<IPerson[]>;

  constructor(private store: Store<AppState>) {
    this.currentPerson$ = store.select((state) => state.person.currentPerson);
  }

  loadAllPersons() {
    this.store.dispatch(personActions.getAll());
  }
}
```

### NgRx Patterns

#### Actions

Use `createActionGroup` for feature actions:

```typescript
export const personActions = crudActions<IPerson>();
```

Custom actions follow same pattern:

```typescript
export const personActions = createActionGroup({
  source: "person",
  events: {
    Load: emptyProps(),
    "Load success": props<{ items: IPerson[] }>(),
  },
});
```

#### Route-based State Injection

All state provided at route level:

```typescript
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

## Naming Conventions

### Files and Directories

- Components: `feature-name.component.ts`, `feature-name.component.html`, `feature-name.component.less`
- Services: `feature.service.ts`
- Types: `feature.type.ts`
- Store files: `actions.ts`, `reducers.ts`, `effects.ts`, `selectors.ts`
- All lowercase with hyphens (kebab-case)

### Code Naming

- Components: PascalCase (e.g., `PersonComponent`, `AllPersonsComponent`)
- Services: PascalCase with 'Service' suffix (e.g., `PersonService`)
- Facade services: PascalCase without suffix (e.g., `Person`)
- Interfaces: PascalCase with 'I' prefix (e.g., `IPerson`, `IMatch`)
- Observables: End with `$` suffix (e.g., `currentPerson$`, `allPersons$`)
- Methods: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`, `MAX_ITEMS`)

## Type Definitions

- All types defined in `src/app/type/` directory
- Interface naming: `I` prefix (e.g., `IPerson`, `ITeam`)
- Type naming: no prefix (e.g., `AgeStats`)
- Always mark optional properties with `?` (e.g., `id?: number | null`)

```typescript
export interface IPerson {
  id?: number | null;
  first_name: string;
  second_name: string;
  person_photo_url: string | null;
}

export type PaginationState = {
  currentPage: number;
  itemsPerPage: number;
};
```

## Error Handling

All API calls must use error handling service:

```typescript
import { catchError } from 'rxjs/operators';

someMethod() {
  return this.http.get(url).pipe(
    tap(data => console.log('Success:', data)),
    catchError(error => this.errorHandlingService.handleError(error))
  );
}
```

ErrorHandlingService automatically:

- Redirects 404 errors to `/error404`
- Logs errors to console
- Re-throws error for further handling

## Reactive Programming

### RxJS Operators

- Use `tap()` for side effects (logging, debugging)
- Use `map()` for data transformation
- Use `catchError()` for error handling
- Prefer `pipe()` over chaining

### Observable Patterns

```typescript
// Component uses observables with AsyncPipe
persons$ = this.person.allPersons$;

// Or subscribe in component (use takeUntilDestroyed when available)
ngOnInit() {
  this.person.allPersons$.subscribe(persons => {
    this.persons = persons;
  });
}
```

## HTML Templates

- Use AsyncPipe for observables
- No explicit subscriptions in templates
- Taiga UI components for UI elements
- Semantic HTML structure

```html
<tui-loader *ngIf="loading$ | async"></tui-loader>
<div *ngFor="let person of persons$ | async">{{ person.first_name }} {{ person.second_name }}</div>
```

## LESS Styling

- Component-scoped styling
- Use CSS variables for theming
- BEM-like naming convention optional
- Follow Taiga UI design patterns

```less
.feature-name {
  &__element {
    // styles
  }

  &--modifier {
    // styles
  }
}
```

## Adding New Features

1. Create component directory: `src/app/components/feature-name/`
2. Create component files: `*.component.ts`, `*.html`, `*.less`
3. Create type definition: `src/app/type/feature.type.ts`
4. Create service extending `BaseApiService`: `feature.service.ts`
5. Create NgRx store: `actions.ts`, `reducers.ts`, `effects.ts`, `selectors.ts`
6. Create facade service in component directory
7. Add route to `src/app/app.routes.ts` with state injection
8. Update `src/app/store/appstate.ts` with feature state interface

## API Configuration

All API endpoints use constants from `src/app/base/constants.ts`:

```typescript
import { urlWithProtocol } from "../../base/constants";
```

Never hardcode API URLs. Use environment variables via `constants.ts`.

## Console Logging

Current codebase uses console.log for debugging. When making changes:

- Keep existing console.log statements unless refactoring
- Add meaningful console.log for API calls (already in BaseApiService)
- Remove console.log before production builds if necessary

## Testing

- Tests use Jasmine with Karma
- Test files co-located with components: `*.component.spec.ts`
- Test naming: `should do something when ...`
- Mock services and dependencies
- Test observables with marbles or subscribe blocks

## Important Notes

- All components must be standalone (no NgModules)
- Always inject services in constructor
- Use dependency injection for all services
- Route-based state injection is mandatory for NgRx
- Extend BaseApiService for all API services
- Use ErrorHandlingService for all error handling
- TypeScript strict mode - no `any` types unless absolutely necessary
- Always use interfaces for data structures

**Note**: Do not add AGENTS.md to README.md - this file is for development reference only.
**Note**: all commits must be by linroot with email nevalions@gmail.com
