const fs = require("node:fs");
const { REST, Routes, Events } = require("discord.js");
const { Token } = require("../Json/config.json");
const rest = new REST({ version: '10' }).setToken(Token);
const stringlength2 = 69;

module.exports = (client) => {
  const commands = [];

  fs.readdirSync("./SlashCommands").forEach(folder => {
    const commandFiles = fs.readdirSync(`./SlashCommands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../SlashCommands/${folder}/${file}`);

      if (command.data?.name && command.data?.description) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
      }
    }
  });

  client.on(Events.ClientReady, async (c) => {
    try {
      let m = require('ansi-colors');

      console.log("\n")
      console.log(m.yellowBright(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
      console.log(m.yellowBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.yellowBright(`     ┃ ` + `Started Refreshing ${commands.length} Application (/) Commands.` + " ".repeat(-1+stringlength2-` ┃ `.length-`Started Refreshing ${commands.length} Application (/) Commands.`.length)+ "┃"))
      console.log(m.yellowBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.yellowBright(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
      const data = await rest.put(Routes.applicationCommands(c.user.id), {
        body: commands
      });
      //==Ready==//


      console.log("\n")
      // console.log(('yelloo'))
      console.log(m.greenBright(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
      console.log(m.greenBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.greenBright(`     ┃ ` + `${c.user.tag} Is Ready` + " ".repeat(-1+stringlength2-` ┃ `.length-`${c.user.tag} Is Ready`.length)+ "┃"))
      console.log(m.greenBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.greenBright(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`) )


      //==Ready==//
      console.log("\n")
      console.log(m.yellowBright(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
      console.log(m.yellowBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.yellowBright(`     ┃ ` + `Successfully Reloaded ${data.length} Application (/) Commands.` + " ".repeat(-1+stringlength2-` ┃ `.length-`Successfully Reloaded ${data.length} Application (/) Commands.`.length)+ "┃"))
      console.log(m.yellowBright(`     ┃ ` + " ".repeat(-1+stringlength2-` ┃ `.length)+ "┃"))
      console.log(m.yellowBright(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`) )
    } catch (err) {
      console.log(err)
    }
  })
}