# AGENTS.md - Development Guidelines

## Build, Lint, and Test Commands

### Build Commands

```bash
npm run start          # Start development server (http://localhost:4200)
npm run build          # Production build
npm run watch          # Build with watch mode
```

**Important:**

- Do not start parallel builds on different ports
- Always connect to the existing development server on http://localhost:4200

### Test Commands

```bash
npm run test           # Run all tests (jsdom mode - fastest)
npx vitest run        # Run tests in single-run mode
npx vitest            # Run tests in watch mode
npx vitest run --coverage  # Run tests with coverage

# Run tests in browser mode
npx vitest run --browser=chromiumHeadless  # Chromium headless for CI
npx vitest run --browser=chromium           # Chromium headed for debugging

# Run specific test files
npx vitest run **/person.component.spec.ts
npx vitest run **/person/**/*.spec.ts  # Run all tests in person feature

# Hybrid testing (recommended)
npx vitest run **/store/*.spec.ts              # Unit tests in jsdom
npx vitest run --browser=chromiumHeadless **/*.component.spec.ts  # Component tests in browser
```

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

#### Entity Adapter Patterns

**Use @ngrx/entity for CRUD operations on collections:**

```typescript
import { createEntityAdapter, EntityState } from "@ngrx/entity";

// State interface extends EntityState
export interface PersonState extends EntityState<IPerson> {
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  errors: any | null;
}

// Create adapter with optional sorting
const adapter = createEntityAdapter<IPerson>({
  sortComparer: (a, b) => a.second_name.localeCompare(b.second_name),
});

// Initial state from adapter
const initialState: PersonState = adapter.getInitialState({
  personIsLoading: false,
  personIsSubmitting: false,
  currentPersonId: null,
  currentPerson: null,
  errors: null,
});

// Use adapter methods in reducer
const personFeature = createFeature({
  name: "person",
  reducer: createReducer(
    initialState,
    on(personActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.currentPerson, {
        ...state,
        personIsSubmitting: false,
        currentPerson: action.currentPerson,
      }),
    ),
    on(personActions.updatedSuccessfully, (state, action) =>
      adapter.updateOne(
        { id: action.updatedPerson.id, changes: action.updatedPerson },
        {
          ...state,
          personIsSubmitting: false,
          currentPerson: action.updatedPerson,
          errors: null,
        },
      ),
    ),
    on(personActions.deletedSuccessfully, (state, action) =>
      adapter.removeOne(action.personId, {
        ...state,
        personIsSubmitting: false,
        errors: null,
      }),
    ),
    on(personActions.getAllItemsSuccess, (state, action) =>
      adapter.setAll(action.persons, {
        ...state,
        personIsLoading: false,
      }),
    ),
  ),
});

// Built-in selectors from adapter
const { selectAll, selectEntities, selectById, selectTotal } = adapter.getSelectors();
export const selectAllPersons = createSelector(selectPersonState, selectAll);
```

**Important Entity Adapter Rules:**

1. **DO use entity adapter for CRUD operations** - addOne, updateOne, removeOne, setAll
2. **DO preserve custom state properties** - isLoading, isSubmitting, currentItemId, errors
3. **DO preserve custom business logic** - don't migrate actions like getTeamsBySportId
4. **DO NOT maintain filtered collections in state** - use selectors instead
5. **DO NOT use SortService in reducers** - use sortComparer in adapter
6. **DO NOT manually manipulate arrays** - let adapter handle it

**See**: `docs/ngrx-entity-migration-guide.md` for complete migration guide

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

## MCP Tools for Angular Development

### Angular CLI MCP Tools

Use MCP (Model Context Protocol) tools for Angular-specific tasks:

```typescript
// List all Angular workspaces and projects
angular - cli_list_projects();

// Get Angular best practices (version-specific)
angular -
  cli_get_best_practices({
    workspacePath: "/path/to/angular.json",
  });

// Search Angular documentation
angular -
  cli_search_documentation({
    query: "standalone components",
    includeTopContent: true,
    version: 21,
  });

// Start Angular AI Tutor for guided learning
angular - cli_ai_tutor();

// Migrate to OnPush/Zoneless
angular -
  cli_onpush_zoneless_migration({
    fileOrDirPath: "/path/to/component",
  });
```

### ESLint MCP Tool

Use ESLint MCP for linting specific files:

```typescript
eslint_lint -
  files({
    filePaths: ["/path/to/file1.ts", "/path/to/file2.ts"],
  });
```

### NgRx MCP Tools

Available NgRx-related MCP capabilities through Angular CLI tools:

- Search NgRx documentation using `angular-cli_search_documentation`
- Get best practices for NgRx patterns
- Migrate to modern NgRx patterns (createFeature, createReducer, createActionGroup)

### When to Use MCP Tools

1. **Learning and Documentation**: Use `angular-cli_search_documentation` to find current Angular API usage
2. **Project Analysis**: Use `angular-cli_list_projects` to understand workspace structure
3. **Best Practices**: Use `angular-cli_get_best_practices` before writing new features
4. **Refactoring**: Use `angular-cli_onpush_zoneless_migration` for OnPush migration planning
5. **Code Quality**: Use `eslint_lint-files` to check specific files during development
6. **Tutorials**: Use `angular-cli_ai_tutor` for guided step-by-step learning

### MCP Tool Benefits

- **Version-Specific Guidance**: Get accurate information for your Angular version (21.x)
- **Official Documentation**: Access official Angular.dev documentation
- **Best Practices**: Ensure code follows current Angular conventions
- **Automated Refactoring**: Get iterative migration plans for complex changes
- **Targeted Linting**: Check specific files without full project lint
- **Guided Learning**: Interactive tutorials for Angular concepts

## Important Notes

- All components must be standalone (no NgModules)
- Always inject services in constructor
- Use dependency injection for all services
- Route-based state injection is mandatory for NgRx
- Extend BaseApiService for all API services
- Use ErrorHandlingService for all error handling
- TypeScript strict mode - no `any` types unless absolutely necessary
- Always use interfaces for data structures

## GitHub workflow (this repo)

- Default repo: <OWNER>/<REPO> (use this unless user specifies otherwise)
- Branch naming:
  - feature: feat/<linear-id>-<slug>
  - bugfix: fix/<linear-id>-<slug>
  - chore: chore/<linear-id>-<slug>
- Pull requests:
  - Always link the Linear issue (e.g. STAF-8 )
  - Include: summary, scope, testing, screenshots (frontend), migration notes (backend)
  - Ensure CI is green before requesting review
- Labels:
  - security findings → label `security`
  - refactor-only → label `refactor`
- Reviewers:
  - assign <TEAM/USERNAMES> if applicable

## Linear defaults

- Default Linear team is **StatsboardFront**.
- When creating/updating Linear issues, always use this team unless the user explicitly says otherwise.
- If a project is not specified, create the issue without assigning a project (do not guess).
- When making a plan, create:
  - 1 parent issue (epic)
  - child issues grouped by theme
- Always include: rule name(s), file paths, and a clear "Done when" checklist.

## Perplexity usage rules

- Use Perplexity MCP only for:
  - Current best practices
  - Standards, RFCs, security guidance
  - Tooling or framework updates
- Prefer local codebase and Context7 docs for implementation details.
- Summarize sources clearly when using Perplexity.

**Note**: Do not add AGENTS.md to README.md - this file is for development reference only.
**Note**: all commits must be by linroot with email nevalions@gmail.com
**Note**: When you need to search docs, use `context7` tools.
