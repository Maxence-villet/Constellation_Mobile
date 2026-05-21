// App.tsx
import { useEffect } from "react";
import { EventServiceProvider } from "./Providers/EventServiceProvider";

export default function App() {
  useEffect(() => {
    const eventProvider = new EventServiceProvider();
    eventProvider.boot();
  }, []);
}
