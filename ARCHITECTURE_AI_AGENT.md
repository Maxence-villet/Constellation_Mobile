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
    │   ├── storage.ts          # Generic AsyncStorage helpers (user session)
    │   └── http.ts              # Centralized API client — ONLY file allowed to call fetch()
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
import { http } from "../utils/http";

export class [Action][ModelName]Action {
  async execute(dto: [Action][ModelName]DTO): Promise<[ModelName]> {
    // NEVER call fetch() directly here — always go through src/utils/http.ts
    const data = await http.post<[ModelName]Attributes>(dto, "[resource-path]", /* auth */ true);
    const result = new [ModelName](data);
    emitter.emit([Domain]Events.[EVENT_NAME], result);
    return result;
  }
}
```

**Rule:** `http.ts` already throws an `Error` on non-2xx responses (using the backend's `error.detail`, FastAPI convention). Do NOT wrap calls in extra try/catch inside the Action unless you need to transform the error message — let it propagate to the Controller.

---

### HTTP CLIENT — `src/utils/http.ts`

**When to use:** Every single network call to the backend, with no exception.

**Rules:**

- This is the ONLY file allowed to call `fetch()` directly in the entire codebase
- Exposes exactly four methods: `get`, `post`, `delete`, `postForm`
- `BASE_URL` is read once from `app.config.js` (`extra.apiUrl`, backed by `process.env.API_URL`) and already includes the scheme (`http://`/`https://`) and trailing slash — NEVER prepend `http://` again when building a path, and NEVER hardcode a host/IP inside an Action
- Each method takes an `auth` boolean (default varies per method) that, when `true`, injects an `Authorization` header built from `getAccessToken()` (from `src/utils/storage.ts`)
- On non-2xx response, every method throws `new Error(error.detail)` (FastAPI error convention) — Actions let this propagate, Controllers catch it if they need to surface it to the UI
- `postForm` exists specifically for FastAPI OAuth2 endpoints (e.g. `auth/login`) expecting `application/x-www-form-urlencoded` instead of JSON — use `post` for every other JSON endpoint
- NO React, NO state, NO business logic — this file is a thin transport layer only

**Template:**

```ts
// src/utils/http.ts
import Constants from "expo-constants";
import { getAccessToken } from "./storage";

const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl ?? "http://192.168.1.102:8000").replace(
    /\/$/,
    "",
  ) + "/";

async function getHeaders(auth = false): Promise<HeadersInit> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getAccessToken();
    if (token) headers["Authorization"] = token;
  }
  return headers;
}

export const http = {
  get: async <T>(path: string, auth = true): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: await getHeaders(auth),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },

  post: async <T>(body: unknown, path: string, auth = false): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: await getHeaders(auth),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },

  delete: async (path: string, auth = true): Promise<void> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: await getHeaders(auth),
    });
    if (!res.ok) throw new Error("Delete failed");
  },

  postForm: async <T>(
    body: Record<string, string>,
    path: string,
    auth = false,
  ): Promise<T> => {
    const formBody = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) =>
      formBody.append(key, value),
    );

    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: await getHeaders(auth),
      body: formBody.toString(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },
};
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

## AUTH FLOW — Reference pattern for backend connection

Authentication is the canonical example of an Action calling the backend through `http.ts`. Reuse this exact shape for any new feature requiring login-gated API access.

```
LoginScreen → useAuth().login(dto)
            → useAuthController.login()
            → new LoginUserAction().execute(dto)
                 → http.postForm({ username, password }, "auth/login")
                 → storeAccessToken(token)
                 → authEmitter.emit(AuthEvents.LOGIN_SUCCESS, { token })
            → useAuthController's useEffect listener catches LOGIN_SUCCESS
                 → new FetchCurrentUserAction().execute()
                 → storeUserData(user) + setUser(user)
            → AuthContext re-renders → app.routes.tsx switches AuthStack → AppStack
```

**Rules to follow:**

- An Action that authenticates (`LoginUserAction`) must NOT itself fetch the user profile. It only obtains/stores the token and emits an event. A separate Action (`FetchCurrentUserAction`) — triggered by the Controller's event listener — fetches the profile. This keeps each Action single-purpose and lets other Listeners react to `LOGIN_SUCCESS` independently.
- `LogoutUserAction.execute()` clears storage (`clearUserData`) and emits `AuthEvents.LOGOUT`; the Controller's listener resets `user` to `null`.
- Route protection lives in exactly one place: `routes/app.routes.tsx` reads `user`/`isLoading` from `useAuth()` and picks `AuthStack` vs `AppStack`. Never duplicate this guard logic in a Page or Component.
- Any DTO going to `http.postForm` (OAuth2 endpoints) must match the field names the backend expects (commonly `username`/`password` for FastAPI's `OAuth2PasswordRequestForm`) — do not assume the DTO's own field names (e.g. `email`) match the wire format; map explicitly inside the Action if they differ.

---

## CHECKLIST — Adding a new feature

When asked to implement a new feature (e.g. "add comments"):

1. **Model** — Create `src/Models/Comment.ts` with interface + class + `toJSON()`
2. **DTOs** — Create one DTO per operation: `CreateCommentDTO`, `DeleteCommentDTO`, etc.
3. **Events** — Add events to `src/Events/CommentEvents.ts` (or create the file)
4. **Actions** — Create one Action class per operation: `CreateCommentAction`, `DeleteCommentAction`, etc. For any Action calling the backend, use `http` from `src/utils/http.ts` — never `fetch()` directly
5. **Controller** — Create or update `src/Http/Controllers/useCommentController.ts`
6. **Listener** — Add relevant event subscriptions to the appropriate Listener (e.g. `LogListener`)
7. **Components** — Create UI components in `src/View/Components/`
8. **Page** — Create the screen in `app/` using the Controller
9. **Route** — Register the screen in `routes/app.routes.tsx`

---

## PROHIBITED PATTERNS

| Pattern                                                  | Reason                                              |
| --------------------------------------------------------- | ---------------------------------------------------- |
| Calling `fetch()` anywhere outside `src/utils/http.ts`   | All network calls must go through the http client  |
| Calling `fetch()` inside a Component or Controller       | API calls belong in Actions (via `http.ts`)         |
| Calling an Action inside a Component                     | Actions are called from Controllers only            |
| Using `useState` inside an Action                        | Actions are pure logic, no React                    |
| Creating a Model instance outside of an Action            | Model instantiation is Action responsibility        |
| Emitting an event outside of an Action                    | Events are emitted by Actions only                   |
| Having a Controller manage two unrelated domains          | One Controller per domain                            |
| Skipping the DTO and passing raw data to an Action        | Always type inputs with a DTO                        |
| Adding business logic inside a page (`app/`)              | Pages only assemble Components and Controllers       |
| Hardcoding a host/IP/URL inside an Action                 | Base URL is centralized in `app.config.js`/`http.ts` |
| Reading the token directly from AsyncStorage in an Action | Always go through `getAccessToken()` in `storage.ts` |

---

## NAMING CONVENTIONS SUMMARY

| Layer           | Pattern                    | Example                      |
| --------------- | -------------------------- | ---------------------------- |
| Model           | `[Name].ts`                | `Todo.ts`, `User.ts`         |
| Model interface | `[Name]Attributes`         | `TodoAttributes`             |
| DTO             | `[Verb][Name]DTO.ts`       | `CreateTodoDTO.ts`           |
| Action          | `[Verb][Name]Action.ts`    | `CreateTodoAction.ts`        |
| Http client     | `src/utils/http.ts` (singleton, no per-domain file) | `http.get(...)`, `http.postForm(...)` |
| Event file      | `[Domain]Events.ts`        | `TodoEvents.ts`              |
| Event emitter   | `[domain]Emitter`          | `todoEmitter`, `authEmitter` |
| Controller      | `use[Domain]Controller.ts` | `useTodoController.ts`       |
| Listener        | `[Name]Listener.ts`        | `LogListener.ts`             |
| Provider        | `[Name]ServiceProvider.ts` | `EventServiceProvider.ts`    |
| Context file    | `[Domain]Contexts.tsx`     | `AuthContexts.tsx`           |
| Context hook    | `use[Domain]()`            | `useAuth()`                  |
| Component       | `[Name].tsx` (PascalCase)  | `TodoItem.tsx`               |
| Page            | `[Name]Screen.tsx`         | `HomeScreen.tsx`             |
