const logger = require('../logger').getLogger('commands:setnick', 'yellow')

module.exports = function(msg, settings, lang) {
  const client = msg.client
  const args = msg.content.replace(settings.prefix, '').split(' ')
  const cmd = args[0]
  if (cmd === 'resetnick') {
    if (/\s/gm.test(args[1]) || !args[1]) { msg.guild.me.setNickname(client.user.username); return msg.channel.send(':ok_hand:') }
    try {
      msg.guild.members.get(client.users.find('username', args[1]).id).setNickname(msg.mentions.members.first().user.username)
      return msg.channel.send(':ok_hand:')
    } catch (e) {
      try {
        msg.guild.members.get(args[1]).setNickname(msg.mentions.members.first().user.username)
        return msg.channel.send(':ok_hand:')
      } catch (e) {
        try {
          msg.mentions.members.first().setNickname(msg.mentions.members.first().user.username)
          return msg.channel.send(':ok_hand:')
        } catch (e) {
          logger.error(e)
          msg.channel.send(lang.invalid_args)
        }
      }
    }
  } else {
    if (/\s/gm.test(args[1]) || !args[1]) {
      msg.channel.send(lang.cannotspace)
    } else {
      if (args[2] != null) {
        try {
          msg.guild.members.get(client.users.find('username', args[2]).id).setNickname(args[1])
          return msg.channel.send(':ok_hand:')
        } catch(e) {
          try {
            msg.guild.members.get(args[2]).setNickname(args[1])
            return msg.channel.send(':ok_hand:')
          } catch (e) {
            try {
              msg.mentions.members.first().setNickname(args[1])
              return msg.channel.send(':ok_hand:')
            } catch (e) {
              logger.error(e)
              msg.channel.send(lang.invalid_args)
            }
          }
        }
      } else {
        msg.guild.me.setNickname(args[1])
        return msg.channel.send(':ok_hand:')
      }
    }
  }
}