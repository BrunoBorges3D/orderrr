const DecorativeFont = require("decorative-fonts.js");

module.exports = {
  name: 'font-4',
  run: async (client, message, args) => {
      if (message.author.bot) return;
      
      const inputText = args.join(' ');
      const convertedText = DecorativeFont.Fraktur(inputText);
      
      if (convertedText.trim() !== '') {
          await message.reply(convertedText);
      } else {
          await message.reply('Error: Converted text is empty.');
      }
  }
}
