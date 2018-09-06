const f = require('string-format')
const logger = require('./logger').getLogger('commands', 'yellow')
const commands = require('./commands')
const levenshtein = require('fast-levenshtein').get
const util = require('./util')
const config = require('./config.yml')

module.exports = async function(settings, msg, lang, guildSettings) {
  if (msg.content === `<@${msg.client.user.id}>` || msg.content === `<@!${msg.client.user.id}>`)
    return msg.channel.send(f(lang.prefixis, settings.prefix))
  if (msg.content.startsWith(settings.prefix)) {
    const [cmd] = msg.content.replace(settings.prefix, '').split(' ')
    if (settings.banned) return msg.channel.send(f(lang.error, lang.errors.server_banned))
    if (commands[cmd]) {
      if (!commands[cmd].isAllowed || commands[cmd].isAllowed(msg, config.owners)) {
        logger.info(f(lang.issuedcmd, msg.author.tag, msg.content))
        commands[cmd](msg, settings, lang, guildSettings)
      } else msg.channel.send(lang.udonthaveperm)
    } else if (util.exists(`./plugins/commands/${cmd}.js`)) {
      require(`./plugins/commands/${cmd}.js`).run(msg, settings, lang, guildSettings)
    } else {
      const commandList = Object.keys(commands).map(cmd => ({ cmd }))
      for (let i = 0; i < commandList.length; i++) {
        commandList[i].no = levenshtein(cmd, commandList[i].cmd)
      }
      commandList.sort((a, b) => {
        return a.no - b.no
      })
      const list = commandList.filter(item => item.no <= 2).map(item => `・\`${settings.prefix}${item.cmd}${item.args}\``)
      msg.channel.send(f(lang.no_command, `${settings.prefix}${cmd}`))
      if (list.length) {
        msg.channel.send(f(lang.didyoumean, `\n${list.join('\n')}`))
      }
    }
  }
}
