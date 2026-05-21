// src/Providers/EventServiceProvider.ts
import { LogListener } from "../Listeners/LogListener";

export class EventServiceProvider {
  private static hasBooted = false;

  boot(): void {
    if (EventServiceProvider.hasBooted) {
      return;
    }
    EventServiceProvider.hasBooted = true;
    const logListener = new LogListener();
    logListener.register();
  }
}
