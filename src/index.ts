/*
  client.on('guildMemberAdd', () => member.roles.add(client.config.autoRole, 'Member Autorole'));
  client.on('ready', () => {
    console.log('The discord bot is up and running.');
    setInterval(() => require("./utils/check")(client), 30000);
  });
*/

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Intents, Collection } from "discord.js";
import { config } from "dotenv";
import { Command } from "./commands";

import fs from "fs";
import path from "path";
import Stripe from "stripe";

import * as Sentry from "@sentry/node";
import initDatabase from "./database/";
import Logger from "./utils/logger";
import Event from "./events";
import Task from "./tasks";
import { settings } from "./settings";

config();

export default class App {
  devMode = process.env.PRODUCTION !== "true";
  
  token = process.env.TOKEN;
  discordBot = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  });
  
  stripeApi = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: "2020-08-27",
  });
  privateRest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  commands: Collection<string, Command> = new Collection();
  events: Collection<string, Event> = new Collection();
  tasks: Collection<string, Task> = new Collection();
  
  constructor() {
    initDatabase();
    this.loadSentry();
    this.discordBot.login(this.token);
    this.discordBot.once("ready", () => {
      Logger.info("BOT", `Connected to discord user ${this.discordBot.user.tag}!`);
      this.loadCommands();
      this.loadEvents();
      this.loadTasks();
      this.loadSlashCommands();
    });
  }

  private loadSentry() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0
    });
  }

  private loadCommands(directory: string = path.join(__dirname, "commands")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) Logger.error("LOAD_COMMANDS", "The command directory is not available.");

    const commandFiles = fs.readdirSync(directory);
    for (const commandFile of commandFiles) {
      const commandPath = path.join(directory, commandFile);
      const commandFileStats = fs.statSync(commandPath);

      if (commandFileStats.isDirectory()) {
        this.loadCommands(commandPath);
        continue;
      } else if (
        !commandFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile) ||
        path.parse(commandPath).name == "index"
      ) continue;

      const tmpCommand = require(commandPath);
      const command =
        typeof tmpCommand !== "function" &&
        typeof tmpCommand.default == "function"
          ? tmpCommand.default
          : typeof tmpCommand == "function"
          ? tmpCommand
          : null;

      try {
        const commandObj: Command = new command(this);
        if (!commandObj?.slashCommand?.name) continue;
        if (this.commands.has(commandObj.slashCommand.name)) Logger.warn("STARTUP", `Duplicate command ${commandObj.slashCommand.name}.`);
        else this.commands.set(commandObj.slashCommand.name, commandObj);
      } catch (e) {}
    }
  }

  private loadEvents(directory: string = path.join(__dirname, "events")) {
    const directoryStats = fs.statSync(directory);
    if(!directoryStats) return Logger.error("LOAD_EVENTS", "The event directory is not available!");

    const eventFiles = fs.readdirSync(directory);
    for (const eventFile of eventFiles) {
      const eventPath = path.join(directory, eventFile);
      const eventFileStats = fs.statSync(eventPath);

      if (eventFileStats.isDirectory()) {
        this.loadEvents(eventPath);
        continue;
      } else if (
        !eventFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(eventFile) ||
        path.parse(eventPath).name == "index"
      ) continue;

      const tmpEvent = require(eventPath);
      const event =
        typeof tmpEvent !== "function" &&
        typeof tmpEvent.default === "function"
          ? tmpEvent.default
          : typeof tmpEvent === "function"
          ? tmpEvent
          : null;

      try {
        const eventObj: Event = new event(this);
        if (eventObj && eventObj.eventNames) {
          if (this.events.has(eventPath)) {
            throw `Duplicate event file path ${eventPath}`;
          } else {
            for (const eventName of eventObj.eventNames) {
              this.discordBot.addListener(eventName, async(...args) => eventObj.handle.bind(eventObj)(...args, eventName));
            }
            this.events.set(eventPath, eventObj);
          }
        }
      } catch (ignored) {}
    }
  }

  private loadTasks(directory = path.join(__dirname, "tasks")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return Logger.error("LOAD_TASKS", "The task directory is not available.");

    const tasksFiles = fs.readdirSync(directory);
    for (const taskFile of tasksFiles) {
      const taskPath = path.join(directory, taskFile);
      const taskFileStats = fs.statSync(taskPath);

      if (taskFileStats.isDirectory()) {
        this.loadTasks(taskPath);
        continue;
      } else if (
        !taskFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(taskFile) ||
        path.parse(taskPath).name == "index"
      ) continue;

      const tmpTask = require(taskPath);
      const task =
        typeof tmpTask !== "function" &&
        typeof tmpTask.default == "function"
          ? tmpTask.default
          : typeof tmpTask == "function"
          ? tmpTask
          : null;

      try {
        const taskObj: Task = new task(this);
        if (taskObj?.taskName) {
          if (this.tasks.has(taskObj.taskName)) {
            Logger.warn("STARTUP", `Duplicate task ${taskObj.taskName}.`);
          } else {
            this.tasks.set(taskObj.taskName, taskObj);
            setInterval(taskObj.execute.bind(taskObj), taskObj.interval);
          }
        }
      } catch (ignored) {}
    }
  }

  private async loadSlashCommands() {
    try {
      if(this.devMode) {
        await this.privateRest.put(
          Routes.applicationGuildCommands(this.discordBot.user.id, settings.guildID),
          { body: this.commands.map(x => x.slashCommand) },
        )
      } else {
        await this.privateRest.put(
          Routes.applicationCommands(this.discordBot.user.id),
          { body: this.commands.map(x => x.slashCommand) },
        );
      }

      Logger.info("BOT", `Slash commands loaded successfully`);
    } catch (err) {
      Logger.error("SLASH_COMMANDS", err);
    }
  }
}

new App();