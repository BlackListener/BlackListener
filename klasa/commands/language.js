const Discord = require('discord.js')
const { Command } = require('klasa')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'language',
      subcommands: true,
      description: language => language.get('COMMAND_LANGUAGE_DESCRIPTION'),
      usage: '<set:default|help> (lang:language)',
      usageDelim: ' ',
      permissionLevel: 5,
    })
  }

  async set(msg, [lang]) {
    await msg.guild.settings.update('language', lang)
    msg.sendLocale('_setconfig', ['language'])
  }

  help(msg) {
    console.log(this.client.languages)
    const embed = new Discord.MessageEmbed()
      .setTitle(msg.language.get('COMMAND_LANGUAGE_AVAILABLELANG', msg.guild.settings.language))
      // .setDescription(validLanguages.join('\n'))
      .setColor([0,255,0])
    msg.channel.send(embed)
  }
}
