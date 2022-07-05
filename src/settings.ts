import { ColorResolvable } from "discord.js";

export interface ICountry {
    name: string;
    shortened: string;
    children?: string[];
}

export interface ISettings {
    token: string;
    color: ColorResolvable;
    prefix: string;
    guildID: string;
    ticketChannel: string;
    autoRole: string;
    ticketParent: string;
    completeParent: string;
    openedVoice: string;
    customerRole: string;

    countrySelectorText: string;

    countries: ICountry[];
}

export const settings: ISettings = {
    token: "NzE5MjEwNzc3MzgyMjIzOTQz.Xt0HOw.Vc9U9lhTMg716TNw4jlTRotoPtU",
    color: "#add8e6",
    prefix: ".",
    guildID: "688851912728379531",
    ticketChannel: "704005477280907335",
    autoRole: "705181949160849458",
    ticketParent: "705179661851689066",
    completeParent: "705455563315609691",
    openedVoice: "705455504616325150",
    customerRole: "705181912540381234",

    countrySelectorText: "Please select which country you are playing from below!\nAccording to the Discord TOS, in order to lawfully gamble you must be from one of the allowing countries/states below.\nUnlawful gambling will result in the **deletion** of your Bitcomet account!",

    countries: [
        {
            name: "Canada",
            shortened: "CA",
        },
        {
            name: "The Czech Republic",
            shortened: "CR",
        },
        {
            name: "The United Kingdom",
            shortened: "UK",
        },
        {
            name: "The Netherlands",
            shortened: "NL",
        },
        {
            name: "Germany",
            shortened: "DE",
        },
        {
            name: "France",
            shortened: "FR",
        },
        {
            name: "Belgium",
            shortened: "BE",
        },
        {
            name: "Denmark",
            shortened: "DK",
        },
        {
            name: "Japan",
            shortened: "JP",
        },
        {
            name: "Indonesia",
            shortened: "IN",
        },
        {
            name: "The Philippines",
            shortened: "PH",
        },
        {
            name: "Australia",
            shortened: "AU",
        },
        {
            name: "Argentina",
            shortened: "AR",
        },
        {
            name: "Uruguay",
            shortened: "UY",
        },
        {
            name: "Paraguay",
            shortened: "PY",
        },
        {
            name: "Peru",
            shortened: "PE",
        },
        {
            name: "Chile",
            shortened: "CL",
        },
        {
            name: "United States",
            shortened: "US",
            children: ["Conneticut", "Delaware", "Michigan", "New Jersey", "Pennsylvania", "West Virginia"]
        },
    ]
}