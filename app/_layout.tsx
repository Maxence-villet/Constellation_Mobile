// app/_layout.tsx
import { Slot } from "expo-router";
import { useEffect } from "react";
import { EventServiceProvider } from "../src/Providers/EventServiceProvider";

export default function RootLayout() {
  useEffect(() => {
    const provider = new EventServiceProvider();
    provider.boot();
  }, []);

  return <Slot />;
}
