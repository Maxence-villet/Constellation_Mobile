# Architecture React Native
> Cette architecture s'inspire de **Laravel** pour structurer une application React Native de manière cohérente et prévisible. L'objectif est de réduire la permissivité de React Native en imposant des conventions claires.

---

## Vue d'ensemble de la structure

```
projet/
├── app/                        # Pages / écrans de l'application
│   ├── index.tsx               # Point d'entrée (routing + providers)
│   ├── HomeScreen.tsx
│   └── Toto.tsx
├── routes/
│   └── app.routes.tsx          # Déclaration de toutes les routes
└── src/
    ├── Actions/                # Logique métier
    ├── Contexts/               # Contextes React (auth, etc.)
    ├── DTOs/                   # Data Transfer Objects
    ├── Events/                 # Système d'événements (mitt)
    ├── Http/
    │   └── Controllers/        # Hooks qui orchestrent les Actions
    ├── Listeners/              # Abonnés aux événements
    ├── Models/                 # Structures de données typées
    ├── Providers/              # Initialisation des services
    ├── Storage/                # Persistance locale par modèle
    ├── utils/
    │   ├── storage.ts          # Utilitaires AsyncStorage génériques
    │   └── http.ts             # Client API centralisé (fetch + auth + erreurs)
    └── View/
        └── Components/         # Composants UI réutilisables
```

---

## Les couches de l'architecture

### 1. Models — `src/Models/`

**Rôle :** Définir la structure et le comportement d'une entité métier.

Chaque modèle contient :

- Une **interface** `XxxAttributes` qui liste les champs et leurs types
- Une **classe** avec un constructeur, les propriétés publiques, et des méthodes métier
- Une méthode `toJSON()` pour la sérialisation

```ts
// src/Models/Todo.ts
export interface TodoAttributes {
  id: string;
  title: string;
  completed: boolean;
}

export class Todo {
  public id: string;
  public title: string;
  public completed: boolean;

  constructor(attributes: TodoAttributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.completed = attributes.completed;
  }

  toggle(): Todo {
    return new Todo({ ...this, completed: !this.completed });
  }

  toJSON(): TodoAttributes {
    return { id: this.id, title: this.title, completed: this.completed };
  }
}
```

**Règle :** La logique propre à l'entité (ex: `toggle()`) vit dans le modèle. La logique applicative, elle, va dans les Actions.

---

### 2. DTOs — `src/DTOs/`

**Rôle :** Définir la forme des données **entrantes** avant une action.

Un DTO (Data Transfer Object) est une simple interface TypeScript. Il sert à typer ce qu'on passe à une Action.

```ts
// src/DTOs/CreateTodoDTO.ts
export interface CreateTodoDTO {
  title: string;
}

// src/DTOs/LoginUserDTO.ts
export interface LoginUserDTO {
  email: string;
  password: string;
}
```

**Convention de nommage :** `[Action][Modèle]DTO`  
Exemples : `CreateTodoDTO`, `UpdateUserDTO`, `DeleteCommentDTO`

---

### 3. Actions — `src/Actions/`

**Rôle :** Contenir **toute** la logique métier. Une Action = une responsabilité unique.

Chaque Action est une classe avec une méthode `execute()`. Elle peut :

- Créer/modifier un modèle
- Appeler une API
- Émettre un événement

```ts
// src/Actions/CreateTodoAction.ts
export class CreateTodoAction {
  execute(dto: CreateTodoDTO): Todo {
    const newTodo = new Todo({
      id: String(++idCounter),
      title: dto.title.trim(),
      completed: false,
    });
    emitter.emit(TodoEvents.TODO_ADDED, newTodo);
    return newTodo;
  }
}
```

**Convention de nommage :** `[Action][Modèle]Action`  
Exemples : `CreateTodoAction`, `LoginUserAction`, `FetchTodoAction`

**Règle :** Les Actions ne touchent **jamais** au state React. C'est le rôle des Controllers.

---

### 4. Events — `src/Events/`

**Rôle :** Permettre la communication entre couches sans couplage direct, via le pattern **Event-Driven** (bibliothèque `mitt`).

```ts
// src/Events/TodoEvents.ts
import mitt from "mitt";
import { Todo } from "../Models/Todo";

type Events = {
  TODO_ADDED: Todo;
  TODO_TOGGLED: Todo;
  TODO_DELETED: Todo;
};

export const emitter = mitt<Events>();

export enum TodoEvents {
  TODO_ADDED = "TODO_ADDED",
  TODO_TOGGLED = "TODO_TOGGLED",
  TODO_DELETED = "TODO_DELETED",
}
```

Chaque domaine a son propre emitter (`emitter` pour les todos, `authEmitter` pour l'auth).

---

### 5. Http/Controllers — `src/Http/Controllers/`

**Rôle :** Faire le pont entre les Actions (logique métier) et React (state UI). Ce sont des **custom hooks**.

```ts
// src/Http/Controllers/useTodoController.ts
export function useTodoController() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const add = (dto: CreateTodoDTO) => {
    const action = new CreateTodoAction();
    const newTodo = action.execute(dto); // 1. Exécuter l'action
    setTodos((prev) => [...prev, newTodo]); // 2. Mettre à jour le state
  };

  return { todos, add, toggle, remove }; // 3. Exposer au composant
}
```

**Pattern systématique :**

1. Instancier l'Action
2. Appeler `action.execute(...)` avec un DTO ou un modèle
3. Mettre à jour le `useState` en conséquence
4. Retourner le state et les handlers

---

### 6. Listeners — `src/Listeners/`

**Rôle :** S'abonner aux événements pour déclencher des effets de bord (logs, analytics, notifications...).

```ts
// src/Listeners/LogListener.ts
export class LogListener {
  register(): void {
    emitter.on(TodoEvents.TODO_ADDED, (todo) => {
      console.log(`[LogListener] Todo added: ${todo.title}`);
    });
  }
}
```

Les Listeners sont enregistrés une seule fois au démarrage de l'app via les Providers.

---

### 7. Providers — `src/Providers/`

**Rôle :** Initialiser les services au démarrage de l'application (une seule fois).

```ts
// src/Providers/EventServiceProvider.ts
export class EventServiceProvider {
  private static hasBooted = false;

  boot(): void {
    if (EventServiceProvider.hasBooted) return;
    EventServiceProvider.hasBooted = true;

    new LogListener().register();
    // Ajouter d'autres listeners ici
  }
}
```

Le Provider est appelé dans le `useEffect` du composant racine `app/index.tsx`.

---

### 8. Contexts — `src/Contexts/`

**Rôle :** Fournir un state global accessible dans tout l'arbre React (ex: l'utilisateur connecté).

Le Context encapsule un Controller et expose ses valeurs via un hook `useXxx()`.

```ts
// src/Contexts/AuthContexts.tsx
export function AuthProvider({ children }) {
  const { user, isLoading, login, logout } = useAuthController();
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

### 9. View/Components — `src/View/Components/`

**Rôle :** Composants UI purs et réutilisables. Ils reçoivent des props et appellent des callbacks — ils ne contiennent **aucune logique métier**.

```ts
// src/View/Components/TodoItem.tsx
interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onRemove }: Props) {
  return (
    <View>
      <Text>{todo.title}</Text>
      <Button title="✓" onPress={() => onToggle(todo)} />
      <Button title="✕" onPress={() => onRemove(todo)} />
    </View>
  );
}
```

---

### 10. app/ — Pages

**Rôle :** Assembler les composants et brancher les Controllers. Une page = un écran.

```ts
// app/HomeScreen.tsx
export default function HomeScreen() {
  const { todos, add, toggle, remove } = useTodoController(); // Controller

  return (
    <View>
      <TodoInput onAdd={add} />                               // Composant
      <FlatList renderItem={({ item }) => (
        <TodoItem todo={item} onToggle={toggle} onRemove={remove} />
      )} />
    </View>
  );
}
```

---

### 11. routes/ — Routage

**Rôle :** Déclarer toutes les routes de l'application en un seul endroit.

```ts
// routes/app.routes.tsx
export type RootStackParamList = {
  Home: undefined;
  Toto: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Toto" component={Toto} />
    </Stack.Navigator>
  );
}
```

---

### 12. Storage — `src/Storage/` et `src/utils/`

**Rôle :** Gérer la persistance locale avec `AsyncStorage`.

- `src/Storage/XxxStorage.ts` — Classe dédiée à un modèle (ex: `TodoStorage`)
- `src/utils/storage.ts` — Fonctions utilitaires génériques (token d'accès, session utilisateur)

```ts
// src/utils/storage.ts
export async function storeAccessToken(token: string): Promise<void> { ... }
export async function getAccessToken(): Promise<string | null> { ... }
export async function storeUserData(user: User): Promise<void> { ... }
export async function getUserData(): Promise<User | null> { ... }
export async function clearUserData(): Promise<void> { ... }
```

**Règle :** Ce fichier ne contient que des accès AsyncStorage bruts. Aucun appel API, aucune logique métier — ça reste le rôle des Actions.

---

### 13. Http/utils — `src/utils/http.ts`

**Rôle :** Centraliser **tous** les appels réseau vers le backend (FastAPI) dans un client unique. C'est le seul endroit du projet qui appelle `fetch()` directement.

**Pourquoi :** Sans ce client, chaque Action réécrirait la gestion des headers, du token, du JSON et des erreurs HTTP — source d'incohérences. Avec `http.ts`, les Actions ne font qu'appeler `http.get/post/delete/postForm` et gérer le résultat.

```ts
// src/utils/http.ts
import Constants from "expo-constants";
import { getAccessToken } from "./storage";

// BASE_URL contient déjà le schéma (http:// ou https://) + un slash final
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

  // Endpoint spécifique OAuth2 (FastAPI) qui attend du x-www-form-urlencoded
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

**Règles :**

- Seules les **Actions** importent et appellent `http`. Jamais un Controller, jamais un Component.
- L'URL de base vient de `app.config.js` (`extra.apiUrl`), lui-même piloté par la variable d'environnement `API_URL`. Ne jamais hardcoder une IP/host dans une Action.
- Le paramètre `auth` indique si le header `Authorization` doit être injecté à partir du token stocké (`getAccessToken()`).
- En cas d'erreur HTTP (`!res.ok`), on lève une `Error` avec le message renvoyé par le backend (`error.detail`, convention FastAPI). C'est ce message qui remonte jusqu'au Controller / à l'UI.
- `postForm` existe spécifiquement pour les endpoints OAuth2 de FastAPI (ex: `auth/login`) qui attendent un body `application/x-www-form-urlencoded` plutôt que du JSON.

```ts
// app.config.js
export default {
  extra: {
    apiUrl: process.env.API_URL ?? "http://192.168.1.102:8000",
  },
};
```

---

## Connexion au backend — Flux d'authentification

L'authentification illustre comment toutes les couches s'articulent autour d'un appel API réel.

```
[LoginScreen]
     │  appelle login(dto) du Context
     ▼
[useAuth() → AuthContext]
     │  délègue à useAuthController
     ▼
[useAuthController]
     │  instancie LoginUserAction, appelle execute(dto)
     ▼
[LoginUserAction]
     │  http.postForm({ username, password }, "auth/login")
     │  stocke le token (storeAccessToken)
     │  émet AuthEvents.LOGIN_SUCCESS
     ▼
[authEmitter] ──► [useAuthController : handler LOGIN_SUCCESS]
                       │  FetchCurrentUserAction.execute()
                       │  storeUserData(user) + setUser(user)
                       ▼
                [AuthContext re-render] → app.routes.tsx bascule sur AppStack
```

**Points clés :**

- `LoginUserAction` ne récupère pas directement les infos utilisateur : il se contente d'obtenir un token et d'émettre `LOGIN_SUCCESS`. C'est le **Controller** (`useAuthController`), abonné à l'event, qui déclenche la récupération du profil via une seconde Action (`FetchCurrentUserAction`). Ce découplage permet à d'autres Listeners de réagir au login (analytics, etc.) sans toucher au Controller.
- `LogoutUserAction` vide le storage local (`clearUserData`) puis émet `AuthEvents.LOGOUT`, écouté par le même Controller pour réinitialiser le state `user`.
- `routes/app.routes.tsx` lit `user` et `isLoading` depuis `useAuth()` et choisit entre `AuthStack` (Welcome/Login/Register) et `AppStack` (écrans protégés). Aucune logique de garde d'accès n'est dupliquée ailleurs : **toute** la protection des routes passe par ce seul point.
- Le token est toujours lu via `getAccessToken()` (dans `http.ts`) — jamais stocké en mémoire dans un Context ou un state de Component.

---

## Flux de données complet

```
[Composant UI]
     │  appelle handler (ex: onAdd)
     ▼
[Controller / Hook]
     │  instancie et appelle action.execute(dto)
     ▼
[Action]
     │  crée/modifie le modèle + émet un événement
     ▼
[Event Emitter]  ──────────────────► [Listener]
     │                                    │  effet de bord (log, analytics...)
     │
     ◄ retourne le résultat au Controller
     │
[Controller]
     │  met à jour useState
     ▼
[Composant UI]  ←  re-render avec les nouvelles données
```

---

## Résumé des responsabilités

| Couche      | Responsabilité                        | Contient du state React ? |
| ----------- | ------------------------------------- | ------------------------- |
| Model       | Structure + comportement de la donnée | ❌                        |
| DTO         | Typage des données entrantes          | ❌                        |
| Action      | Logique métier pure                   | ❌                        |
| Http/utils  | Client API unique (fetch + erreurs)   | ❌                        |
| Event       | Communication inter-couches           | ❌                        |
| Controller  | Orchestration Action ↔ State React    | ✅                        |
| Listener    | Effets de bord sur événements         | ❌                        |
| Provider    | Initialisation des services           | ❌                        |
| Context     | State global React                    | ✅                        |
| Component   | Rendu UI                              | ❌ (props only)           |
| Page (app/) | Assemblage composants + controller    | ✅ via Controller         |
| Route       | Déclaration de la navigation          | ❌                        |
