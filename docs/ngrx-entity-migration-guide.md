# NgRx Entity Migration Guide

## Overview

This guide documents the migration from manual array-based state management to NgRx Entity adapters for CRUD operations on entity collections.

## Why Migrate?

### Current Issues

- 20+ entity stores with identical CRUD reducer logic
- Manual array manipulation (filter, map, spread) in every reducer
- Manual sorting with `SortService` in reducers
- Array-based state structure leads to poor lookup performance (O(n))
- High boilerplate code repetition

### Benefits of NgRx Entity

- **Reduced Boilerplate**: 60-70% reduction in reducer code
- **Improved Performance**: Dictionary lookups O(1) vs array filter O(n)
- **Pre-built Selectors**: `selectAll`, `selectEntities`, `selectById`, `selectTotal`
- **Automatic Sorting**: Configure via `sortComparer`
- **Type Safety**: Strongly typed CRUD operations
- **Memoization**: Built-in selector memoization for performance

## Installation

```bash
npm install @ngrx/entity@latest --legacy-peer-deps
```

## Before/After Comparison

### Before (Array-based State)

**State Interface:**

```typescript
export interface PersonState {
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  allPersons: IPerson[];
  errors: any | null;
}
```

**Reducer with Manual CRUD:**

```typescript
// Create with manual sorting
on(personActions.createdSuccessfully, (state, action) => {
  const newList = [...state.allPersons, action.currentPerson];
  const sorted = SortService.sort(newList, 'second_name');
  return {
    ...state,
    personIsSubmitting: false,
    currentPerson: action.currentPerson,
    allPersons: sorted,
  };
}),

// Delete with manual filtering
on(personActions.deletedSuccessfully, (state, action): PersonState => ({
  ...state,
  personIsSubmitting: false,
  allPersons: state.allPersons.filter((item) => item.id !== action.personId),
  errors: null,
})),

// Update with manual mapping
on(personActions.updatedSuccessfully, (state, action): PersonState => ({
  ...state,
  personIsSubmitting: false,
  currentPerson: action.updatedPerson,
  allPersons: state.allPersons.map((item) =>
    item.id === action.updatedPerson.id ? action.updatedPerson : item,
  ),
  errors: null,
})),

// GetAll with manual sorting
on(personActions.getAllItemsSuccess, (state, action) => {
  const sorted = SortService.sort(action.persons, 'second_name');
  return {
    ...state,
    personIsLoading: false,
    allPersons: sorted,
  };
}),
```

**Manual Selectors:**

```typescript
export const selectAllPersons = createSelector(selectPersonState, (state) => state.allPersons);
```

### After (Entity-based State)

**State Interface:**

```typescript
import { EntityState } from "@ngrx/entity";

export interface PersonState extends EntityState<IPerson> {
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  errors: any | null;
}
```

**Reducer with Entity Adapter:**

```typescript
import { createEntityAdapter } from '@ngrx/entity';

const adapter = createEntityAdapter<IPerson>({
  sortComparer: (a, b) => a.second_name.localeCompare(b.second_name),
});

const initialState: PersonState = adapter.getInitialState({
  personIsLoading: false,
  personIsSubmitting: false,
  currentPersonId: null,
  currentPerson: null,
  errors: null,
});

// Create with auto-sorting
on(personActions.createdSuccessfully, (state, action) =>
  adapter.addOne(action.currentPerson, {
    ...state,
    personIsSubmitting: false,
    currentPerson: action.currentPerson,
  })
),

// Delete
on(personActions.deletedSuccessfully, (state, action) =>
  adapter.removeOne(action.personId, {
    ...state,
    personIsSubmitting: false,
    errors: null,
  })
),

// Update
on(personActions.updatedSuccessfully, (state, action) =>
  adapter.updateOne(
    { id: action.updatedPerson.id, changes: action.updatedPerson },
    {
      ...state,
      personIsSubmitting: false,
      currentPerson: action.updatedPerson,
      errors: null,
    }
  )
),

// GetAll
on(personActions.getAllItemsSuccess, (state, action) =>
  adapter.setAll(action.persons, {
    ...state,
    personIsLoading: false,
  })
),
```

**Entity Selectors:**

```typescript
const { selectAll, selectEntities, selectById, selectTotal } = adapter.getSelectors();

// Use in feature selector
export const selectAllPersons = createSelector(selectPersonState, selectAll);
```

## Migration Steps

### Step 1: Install @ngrx/entity

```bash
npm install @ngrx/entity@latest --legacy-peer-deps
```

### Step 2: Create Entity Adapter

```typescript
import { createEntityAdapter } from "@ngrx/entity";

const adapter = createEntityAdapter<IPerson>({
  // Optional: Custom ID selector if ID field is not 'id'
  selectId: (person) => person.id,

  // Optional: Sort function for automatic sorting
  sortComparer: (a, b) => a.second_name.localeCompare(b.second_name),
});
```

### Step 3: Update State Interface

```typescript
import { EntityState } from "@ngrx/entity";

// Before
export interface PersonState {
  allPersons: IPerson[]; // Remove this
  // ... other properties
}

// After
export interface PersonState extends EntityState<IPerson> {
  // Keep all other properties
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  errors: any | null;
}
```

### Step 4: Update Initial State

```typescript
// Before
const initialState: PersonState = {
  allPersons: [],
  // ... other properties
};

// After
const initialState: PersonState = adapter.getInitialState({
  personIsLoading: false,
  personIsSubmitting: false,
  currentPersonId: null,
  currentPerson: null,
  errors: null,
});
```

### Step 5: Replace CRUD Operations

#### Create Operation

```typescript
// Before
on(personActions.createdSuccessfully, (state, action) => {
  const newList = [...state.allPersons, action.currentPerson];
  const sorted = SortService.sort(newList, "second_name");
  return {
    ...state,
    personIsSubmitting: false,
    currentPerson: action.currentPerson,
    allPersons: sorted,
  };
});

// After
on(personActions.createdSuccessfully, (state, action) =>
  adapter.addOne(action.currentPerson, {
    ...state,
    personIsSubmitting: false,
    currentPerson: action.currentPerson,
  }),
);
```

#### Update Operation

```typescript
// Before
on(personActions.updatedSuccessfully, (state, action) => ({
  ...state,
  personIsSubmitting: false,
  currentPerson: action.updatedPerson,
  allPersons: state.allPersons.map((item) => (item.id === action.updatedPerson.id ? action.updatedPerson : item)),
  errors: null,
}));

// After
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
);
```

#### Delete Operation

```typescript
// Before
on(personActions.deletedSuccessfully, (state, action) => ({
  ...state,
  personIsSubmitting: false,
  allPersons: state.allPersons.filter((item) => item.id !== action.personId),
  errors: null,
}));

// After
on(personActions.deletedSuccessfully, (state, action) =>
  adapter.removeOne(action.personId, {
    ...state,
    personIsSubmitting: false,
    errors: null,
  }),
);
```

#### GetAll Operation

```typescript
// Before
on(personActions.getAllItemsSuccess, (state, action) => {
  const sorted = SortService.sort(action.persons, "second_name");
  return {
    ...state,
    personIsLoading: false,
    allPersons: sorted,
  };
});

// After
on(personActions.getAllItemsSuccess, (state, action) =>
  adapter.setAll(action.persons, {
    ...state,
    personIsLoading: false,
  }),
);
```

### Step 6: Update Selectors

```typescript
// Before
export const selectAllPersons = createSelector(selectPersonState, (state) => state.allPersons);

// After
const { selectAll } = adapter.getSelectors();
export const selectAllPersons = createSelector(selectPersonState, selectAll);
```

## Common Adapter Methods

### Single Entity Operations

- `addOne(entity, state)` - Add a single entity
- `updateOne(update, state)` - Update a single entity (partial update)
- `upsertOne(entity, state)` - Add or update if exists
- `removeOne(id, state)` - Remove by ID

### Multiple Entity Operations

- `addMany(entities, state)` - Add multiple entities
- `updateMany(updates, state)` - Update multiple entities
- `upsertMany(entities, state)` - Add or update multiple entities
- `removeMany(ids, state)` - Remove by IDs
- `removeAll(state)` - Remove all entities

### Collection Operations

- `setAll(entities, state)` - Replace all entities
- `setMany(entities, state)` - Add or replace multiple entities

## Built-in Selectors

```typescript
const {
  selectIds, // Get all entity IDs
  selectEntities, // Get entity dictionary
  selectAll, // Get all entities as array
  selectTotal, // Get entity count
} = adapter.getSelectors();
```

### Feature-level Selectors

```typescript
// Get selectors that work with feature state
const { selectAll } = adapter.getSelectors<PersonState>();

// Compose with feature selector
export const selectAllPersons = createSelector(selectPersonState, selectAll);
```

### Global-level Selectors

```typescript
// Get selectors that work with root state
const { selectAll } = adapter.getSelectors();

// Use directly in store
this.store.select(selectAll);
```

## Handling Custom Business Logic

### DO NOT Migrate: Custom Actions

Keep business-specific actions separate from entity CRUD:

```typescript
// Example: Team entity has custom actions
on(teamActions.getTeamsBySportId, (state): TeamState => ({
  ...state,
  isTeamLoading: true,
})),

on(teamActions.getTeamsBySportIDSuccess, (state, action) => {
  const sorted = SortService.sort(action.teams, 'title');
  return {
    ...state,
    isTeamLoading: false,
    allTeamsInSport: sorted,
  };
}),

// This is business logic - keep it separate!
```

### Convert Filtered Collections to Selectors

**Before (in reducer):**

```typescript
// Reducer maintains filtered collection
allTeamsInSport: ITeam[];

on(teamActions.getTeamsBySportIDSuccess, (state, action) => {
  const sorted = SortService.sort(action.teams, 'title');
  return {
    ...state,
    allTeamsInSport: sorted,
  };
}),
```

**After (as selectors):**

```typescript
// State has only main collection
export interface TeamState extends EntityState<ITeam> {
  // Remove: allTeamsInSport
  isTeamLoading: boolean;
  // ... other properties
}

// Create filtered selector
export const selectTeamsInSport = createSelector(selectAllTeams, (teams) => teams.filter((team) => team.sportId === selectedSportId));
```

### Preserve Non-Collection State

Keep single-value properties separate from entity collection:

```typescript
export interface TeamState extends EntityState<ITeam> {
  isTeamLoading: boolean;
  isTeamSubmitting: boolean;
  currentTeamId: number | null;
  currentTeam: ITeam | null;

  // These are NOT in the entity collection
  homeTeam: ITeam | null;
  awayTeam: ITeam | null;
  errors: any;
}
```

## Sorting Configuration

### String Sorting

```typescript
const adapter = createEntityAdapter<IPerson>({
  sortComparer: (a, b) => a.second_name.localeCompare(b.second_name),
});
```

### Number Sorting

```typescript
const adapter = createEntityAdapter<ITeam>({
  sortComparer: (a, b) => a.id - b.id,
});
```

### Date Sorting

```typescript
const adapter = createEntityAdapter<IMatch>({
  sortComparer: (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime(),
});
```

### Disable Sorting (Better Performance)

```typescript
const adapter = createEntityAdapter<IEntity>({
  sortComparer: false,
});
```

**Note:** Disabling sorting improves CRUD performance. Sort in selectors or components if needed.

## Custom ID Selector

Use when ID field is not named 'id':

```typescript
interface IPlayer {
  player_id: number; // Not 'id'
  name: string;
}

const adapter = createEntityAdapter<IPlayer>({
  selectId: (player) => player.player_id,
});
```

## Complex Update Patterns

### Partial Update

```typescript
on(personActions.updatedSuccessfully, (state, action) =>
  adapter.updateOne(
    {
      id: action.updatedPerson.id,
      changes: {
        // Only update specific fields
        first_name: action.updatedPerson.first_name,
      },
    },
    { ...state },
  ),
);
```

### Update Multiple Entities

```typescript
on(personActions.batchUpdate, (state, action) =>
  adapter.updateMany(
    [
      { id: 1, changes: { name: "John" } },
      { id: 2, changes: { name: "Jane" } },
    ],
    { ...state },
  ),
);
```

## Testing Checklist

After each entity migration, verify:

- [ ] Build passes: `npm run build`
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Lint passes: `npm run lint`
- [ ] Unit tests pass: `ng test --include '**/entity-name/**/*.spec.ts'`
- [ ] Manual testing:
  - [ ] Load all items
  - [ ] Create new item
  - [ ] Update existing item
  - [ ] Delete item
  - [ ] Sort order preserved
  - [ ] Error handling works

## Performance Considerations

### Dictionary vs Array Lookups

- **Before (Array)**: `O(n)` for filter, find, includes
- **After (Dictionary)**: `O(1)` for direct ID lookup

### Memoization

Entity selectors are automatically memoized. Re-computation only occurs when:

- Entity IDs change
- Entity data changes
- Selector input changes

### Disable Unnecessary Sorting

```typescript
// Better performance if sorting done in UI
const adapter = createEntityAdapter<IEntity>({
  sortComparer: false,
});
```

## Migration Order

1. **Setup** (STAF-17)
   - Install @ngrx/entity
   - Create utilities
   - Document patterns

2. **Pilot** (STAF-18)
   - Migrate Person entity
   - Validate approach
   - Document lessons

3. **Simple Entities** (STAF-19)
   - Sport, Position, Season
   - Minimal custom logic

4. **Medium Complexity** (STAF-20)
   - Player, Team, Tournament
   - Preserve business logic

5. **Complex Entities** (STAF-21)
   - Match, MatchEvent, Sponsor, Clock entities, etc.
   - Careful with derived state

6. **Cleanup** (STAF-22)
   - Remove obsolete code
   - Update documentation
   - Final verification

## Common Pitfalls

### ❌ Don't Automate Business Logic

```typescript
// WRONG: Don't migrate custom actions
on(teamActions.addTeamToTournament, (state, action) =>
  // This is business logic - keep it manual
)

// CORRECT: Only migrate CRUD
on(teamActions.createdSuccessfully, (state, action) =>
  adapter.addOne(action.currentTeam, { ...state })
)
```

### ❌ Don't Remove Custom State

```typescript
// WRONG: Remove all custom properties
export interface TeamState extends EntityState<ITeam> {}

// CORRECT: Keep UI state
export interface TeamState extends EntityState<ITeam> {
  isTeamLoading: boolean;
  currentTeamId: number | null;
  homeTeam: ITeam | null; // Business-specific
}
```

### ❌ Don't Use Filter in Reducer

```typescript
// WRONG: Maintain filtered collections in state
allTeamsInSport: ITeam[];
on(actions.getTeamsBySport, (state, action) => ({
  ...state,
  allTeamsInSport: state.allTeams.filter(t => t.sportId === action.sportId)
}))

// CORRECT: Use selectors for filtering
export const selectTeamsInSport = createSelector(
  selectAllTeams,
  (teams) => teams.filter(t => t.sportId === selectedSportId)
)
```

## Resources

- [Official NgRx Entity Documentation](https://ngrx.io/guide/entity)
- [NgRx Entity API Reference](https://ngrx.io/api/entity)
- [Entity Adapter Examples](https://ngrx.io/guide/entity/entity-adapter)
- [Entity State Patterns](https://ngrx.io/guide/entity/entity-state)
