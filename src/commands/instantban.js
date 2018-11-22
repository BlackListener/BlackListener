const Converter = require(__dirname + '/../converter.js')
const { Command } = require('../core')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: [
        '<User>',
      ],
      permission: 8,
    }
    super('instantban', opts)
  }

  run(msg, settings, lang, args) {
    if (!args[1]) return msg.channel.send(lang._invalid_args)
    const user = Converter.toUser(msg, args[1])
    msg.guild.ban(user)
    msg.channel.send(':ok_hand:')
  }

}
