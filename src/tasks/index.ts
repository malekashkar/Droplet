import App from "..";

export default abstract class Task {
  app: App;
  
  constructor(app: App) {
    this.app = app;
  }
  
  abstract taskName: string;
  abstract interval: number;
  abstract execute(...args: unknown[]): Promise<void>;
}