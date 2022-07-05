import { Command } from "..";

export default abstract class GameCommands extends Command {
    async canRun() {
        return true;
    }
}