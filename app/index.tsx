// app/index.tsx
import { AuthProvider } from "@/src/Contexts/AuthContexts";
import React, { useEffect } from "react";
import { AppRoutes } from "../routes/app.routes";
import { EventServiceProvider } from "../src/Providers/EventServiceProvider";

export default function App() {
  useEffect(() => {
    const provider = new EventServiceProvider();
    provider.boot();
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
