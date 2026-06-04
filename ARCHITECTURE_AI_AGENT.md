# React Native Architecture — AI Agent Development Guide

## CONTEXT

This project uses a Laravel-inspired architecture for React Native + TypeScript. Every feature MUST follow the patterns described below. Deviating from these patterns is forbidden unless explicitly instructed.

---

## DIRECTORY STRUCTURE

```
projet/
├── app/                        # Screens only — no business logic
│   └── index.tsx               # Root: mounts EventServiceProvider + AuthProvider + AppRoutes
├── routes/
│   └── app.routes.tsx          # All navigation routes declared here
└── src/
    ├── Actions/                # Business logic — one class per operation
    ├── Contexts/               # React Contexts wrapping Controllers
    ├── DTOs/                   # Input shape interfaces
    ├── Events/                 # mitt emitters + enums
    ├── Http/
    │   └── Controllers/        # Custom hooks: Actions → React state bridge
    ├── Listeners/              # Side-effect subscribers to Events
    ├── Models/                 # Typed data structures with methods
    ├── Providers/              # One-time service initialization
    ├── Storage/                # AsyncStorage classes per model
    ├── utils/
    │   └── storage.ts          # Generic AsyncStorage helpers (user session)
    └── View/
        └── Components/         # Pure UI components (no business logic)
```

---

## LAYER RULES — STRICTLY ENFORCED

### MODEL — `src/Models/[ModelName].ts`

**When to create:** For every new data entity.

**Rules:**

- Export an interface `[ModelName]Attributes` with all fields and types
- Export a class `[ModelName]` with public properties, a constructor taking `[ModelName]Attributes`, and a `toJSON()` method
- Methods on the class must only concern the entity's own data transformation (e.g. `toggle()`, `fullName()`)
- NO API calls, NO AsyncStorage, NO React state

**Template:**

```ts
export interface [ModelName]Attributes {
  id: string;
  // ... fields
}

export class [ModelName] {
  public id: string;
  // ... public fields

  constructor(attributes: [ModelName]Attributes) {
    this.id = attributes.id;
    // ...
  }

  toJSON(): [ModelName]Attributes {
    return { id: this.id /* ... */ };
  }
}
```

---

### DTO — `src/DTOs/[Action][ModelName]DTO.ts`

**When to create:** For every Action that takes input data.

**Rules:**

- One interface per file
- Naming: `[Action][ModelName]DTO` — Action is a verb: `Create`, `Update`, `Delete`, `Toggle`, `Login`, `Fetch`, etc.
- Only contains the fields needed for that specific action (never the full model)

**Template:**

```ts
export interface [Action][ModelName]DTO {
  // only the fields required for this action
}
```

---

### ACTION — `src/Actions/[Action][ModelName]Action.ts`

**When to create:** For every distinct business operation.

**Rules:**

- One class per file, one public method: `execute()`
- `execute()` receives a DTO or a Model instance, never raw primitives
- `execute()` MUST emit an event after completing its operation
- NO `useState`, NO `useEffect`, NO React imports
- For async operations (API calls), `execute()` returns a Promise
- On API error, throw an `Error` with a message

**Template (sync):**

```ts
import { [Action][ModelName]DTO } from "../DTOs/[Action][ModelName]DTO";
import { emitter, [Domain]Events } from "../Events/[Domain]Events";
import { [ModelName] } from "../Models/[ModelName]";

export class [Action][ModelName]Action {
  execute(dto: [Action][ModelName]DTO): [ModelName] {
    // 1. Business logic
    const result = new [ModelName]({ ... });
    // 2. Emit event
    emitter.emit([Domain]Events.[EVENT_NAME], result);
    // 3. Return result
    return result;
  }
}
```

**Template (async — API call):**

```ts
export class [Action][ModelName]Action {
  async execute(dto: [Action][ModelName]DTO): Promise<[ModelName]> {
    const response = await fetch("...", { method: "POST", body: JSON.stringify(dto) });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }
    const data = await response.json();
    const result = new [ModelName](data);
    emitter.emit([Domain]Events.[EVENT_NAME], result);
    return result;
  }
}
```

---

### EVENT — `src/Events/[Domain]Events.ts`

**When to create:** One file per domain (e.g. `TodoEvents.ts`, `AuthEvents.ts`).

**Rules:**

- Create a `mitt` instance typed with all domain events
- Export the emitter as a named const (e.g. `emitter`, `authEmitter`)
- Export an enum with all event name constants

**Template:**

```ts
import mitt from "mitt";
import { [ModelName] } from "../Models/[ModelName]";

type [Domain]EventsMap = {
  [EVENT_NAME]: [ModelName];
  [OTHER_EVENT]: void; // for events with no payload
};

export const [domain]Emitter = mitt<[Domain]EventsMap>();

export enum [Domain]Events {
  [EVENT_NAME] = "[EVENT_NAME]",
}
```

---

### CONTROLLER — `src/Http/Controllers/use[Domain]Controller.ts`

**When to create:** One controller per domain (todos, auth, etc.).

**Rules:**

- Must be a custom React hook (name starts with `use`)
- Manages `useState` for the domain's data
- Each handler follows the exact pattern: instantiate Action → call `execute()` → update state
- Must return all state values and handlers as a flat object
- NO direct API calls (delegate to Actions)
- For auth-related state, subscribe to Events in `useEffect` (and unsubscribe on cleanup)

**Template:**

```ts
import { useState, useEffect } from "react";

export function use[Domain]Controller() {
  const [items, setItems] = useState<[ModelName][]>([]);

  // Load on mount (if needed)
  useEffect(() => {
    const load = async () => {
      const action = new Fetch[ModelName]Action();
      const fetched = await action.execute();
      setItems(fetched);
    };
    load();
  }, []);

  const create = (dto: Create[ModelName]DTO) => {
    const action = new Create[ModelName]Action();
    const result = action.execute(dto);
    setItems((prev) => [...prev, result]);
  };

  const remove = (item: [ModelName]) => {
    const action = new Delete[ModelName]Action();
    action.execute(item);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return { items, create, remove };
}
```

---

### LISTENER — `src/Listeners/[Name]Listener.ts`

**When to create:** For every cross-cutting concern triggered by events (logging, analytics, push notifications...).

**Rules:**

- One class with a `register()` method
- Subscribes to events from one or more emitters inside `register()`
- NO React, NO state, NO UI logic

**Template:**

```ts
export class [Name]Listener {
  register(): void {
    [domain]Emitter.on([Domain]Events.[EVENT], (payload) => {
      // side effect
    });
  }
}
```

---

### PROVIDER — `src/Providers/[Name]ServiceProvider.ts`

**When to create:** To initialize services once at app startup.

**Rules:**

- Use a static `hasBooted` guard to prevent double initialization
- Instantiate and register all relevant Listeners inside `boot()`
- `boot()` is called in a `useEffect` with empty deps `[]` in `app/index.tsx`

**Template:**

```ts
export class [Name]ServiceProvider {
  private static hasBooted = false;

  boot(): void {
    if ([Name]ServiceProvider.hasBooted) return;
    [Name]ServiceProvider.hasBooted = true;

    new [Name]Listener().register();
  }
}
```

---

### CONTEXT — `src/Contexts/[Domain]Contexts.tsx`

**When to create:** When a Controller's state needs to be accessible across the entire app tree.

**Rules:**

- Uses `createContext` + `useContext`
- The Provider component wraps the Controller hook and passes its values down
- Export a `use[Domain]()` hook that throws if used outside the Provider
- The Context itself is not exported (use the hook instead)

**Template:**

```ts
interface [Domain]ContextValue {
  // mirror what the controller returns
}

const [Domain]Context = createContext<[Domain]ContextValue | undefined>(undefined);

export function [Domain]Provider({ children }: { children: React.ReactNode }) {
  const controllerValues = use[Domain]Controller();
  return (
    <[Domain]Context.Provider value={controllerValues}>
      {children}
    </[Domain]Context.Provider>
  );
}

export function use[Domain]() {
  const context = useContext([Domain]Context);
  if (!context) throw new Error("use[Domain] must be used within [Domain]Provider");
  return context;
}
```

---

### COMPONENT — `src/View/Components/[ComponentName].tsx`

**When to create:** For every reusable UI element.

**Rules:**

- Receives data and callbacks via props — no direct Controller or Action calls
- Define a `Props` interface above the component
- NO business logic, NO API calls, NO state management beyond local UI state (e.g. input value)

**Template:**

```ts
interface Props {
  item: [ModelName];
  on[Action]: (item: [ModelName]) => void;
}

export default function [ComponentName]({ item, on[Action] }: Props) {
  return (
    // JSX only
  );
}
```

---

### PAGE — `app/[ScreenName].tsx`

**When to create:** For every screen in the app.

**Rules:**

- Imports and calls the relevant Controller hook
- Passes state and handlers down to Components as props
- NO direct Action calls
- NO business logic
- Must be registered in `routes/app.routes.tsx`

**Template:**

```ts
export default function [ScreenName]() {
  const { items, create, remove } = use[Domain]Controller();

  return (
    <View>
      <[InputComponent] onAdd={create} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <[ItemComponent] item={item} onRemove={remove} />
        )}
      />
    </View>
  );
}
```

---

### ROUTE — `routes/app.routes.tsx`

**Rules:**

- Declare ALL screens in `RootStackParamList`
- Every new screen added to `app/` must be registered here
- Use `createNativeStackNavigator`

```ts
export type RootStackParamList = {
  [ScreenName]: undefined; // no params
  [OtherScreen]: { id: string }; // with params
};
```

---

## CHECKLIST — Adding a new feature

When asked to implement a new feature (e.g. "add comments"):

1. **Model** — Create `src/Models/Comment.ts` with interface + class + `toJSON()`
2. **DTOs** — Create one DTO per operation: `CreateCommentDTO`, `DeleteCommentDTO`, etc.
3. **Events** — Add events to `src/Events/CommentEvents.ts` (or create the file)
4. **Actions** — Create one Action class per operation: `CreateCommentAction`, `DeleteCommentAction`, etc.
5. **Controller** — Create or update `src/Http/Controllers/useCommentController.ts`
6. **Listener** — Add relevant event subscriptions to the appropriate Listener (e.g. `LogListener`)
7. **Components** — Create UI components in `src/View/Components/`
8. **Page** — Create the screen in `app/` using the Controller
9. **Route** — Register the screen in `routes/app.routes.tsx`

---

## PROHIBITED PATTERNS

| Pattern                                            | Reason                                         |
| -------------------------------------------------- | ---------------------------------------------- |
| Calling `fetch()` inside a Component or Controller | API calls belong in Actions                    |
| Calling an Action inside a Component               | Actions are called from Controllers only       |
| Using `useState` inside an Action                  | Actions are pure logic, no React               |
| Creating a Model instance outside of an Action     | Model instantiation is Action responsibility   |
| Emitting an event outside of an Action             | Events are emitted by Actions only             |
| Having a Controller manage two unrelated domains   | One Controller per domain                      |
| Skipping the DTO and passing raw data to an Action | Always type inputs with a DTO                  |
| Adding business logic inside a page (`app/`)       | Pages only assemble Components and Controllers |

---

## NAMING CONVENTIONS SUMMARY

| Layer           | Pattern                    | Example                      |
| --------------- | -------------------------- | ---------------------------- |
| Model           | `[Name].ts`                | `Todo.ts`, `User.ts`         |
| Model interface | `[Name]Attributes`         | `TodoAttributes`             |
| DTO             | `[Verb][Name]DTO.ts`       | `CreateTodoDTO.ts`           |
| Action          | `[Verb][Name]Action.ts`    | `CreateTodoAction.ts`        |
| Event file      | `[Domain]Events.ts`        | `TodoEvents.ts`              |
| Event emitter   | `[domain]Emitter`          | `todoEmitter`, `authEmitter` |
| Controller      | `use[Domain]Controller.ts` | `useTodoController.ts`       |
| Listener        | `[Name]Listener.ts`        | `LogListener.ts`             |
| Provider        | `[Name]ServiceProvider.ts` | `EventServiceProvider.ts`    |
| Context file    | `[Domain]Contexts.tsx`     | `AuthContexts.tsx`           |
| Context hook    | `use[Domain]()`            | `useAuth()`                  |
| Component       | `[Name].tsx` (PascalCase)  | `TodoItem.tsx`               |
| Page            | `[Name]Screen.tsx`         | `HomeScreen.tsx`             |
