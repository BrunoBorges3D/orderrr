const DecorativeFont = require("decorative-fonts.js");

module.exports = {
  name: 'font-1',
  run: async (client, message, args) => {
      if (message.author.bot) return;
      
      const inputText = args.join(' ');
      const convertedText = DecorativeFont.serif(inputText);
      
      if (convertedText.trim() !== '') {
          await message.reply(convertedText).catch((err) => {
            return
          })
      } else {
          await message.reply('Error: Converted text is empty.');
      }
  }
}
