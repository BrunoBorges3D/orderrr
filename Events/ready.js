const { colors, backcolor } = require('console-log.js')
const { Events } = require("discord.js");
const client = require("../index");
 const { table } = require('table');
const allevents = [];
const Developer = "KaDev™"
const c = require('ansi-colors')

client.on(Events.ClientReady, async (c) => {
  console.log(`${c.user.tag} Is Ready`)
  //ستاتس
  client.user.setActivity("/help")
  /////ستاتس
  ////table


  // Log bot info table



  ////table
  console.log("\n")
});