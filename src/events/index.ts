import { ClientEvents } from "discord.js";
import App from "..";

export type EventNameType = keyof ClientEvents;

export default abstract class Event {
  app: App;
  disabled = false;
  abstract eventNames: EventNameType[];

  constructor(app: App) {
    this.app = app;
  }

  abstract handle(...args: unknown[]): Promise<void | Error>;
}