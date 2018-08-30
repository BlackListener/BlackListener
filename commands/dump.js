const Discord = require('discord.js')
const fs = require('fs').promises
const f = require('string-format')
const config = require('../config.yml')

module.exports = async function(msg, settings, lang) {
  const args = msg.content.replace(settings.prefix, '').split(' ')
  const url = config.dump_url
  const client = msg.client
  const sb = []
  let link = `${url}`
  let nowrite
  if (args[1] === 'users') {
    client.users.forEach((user) => {
      sb.push(`${user.tag} (${user.id})`)
    })
  } else if (args[1] === 'channels') {
    client.channels.forEach((channel) => {
      sb.push(`<${channel.guild.name}><${channel.guild.id}> ${channel.name} (${channel.id}) [${channel.type}]`)
    })
  } else if (args[1] === 'messages') {
    if (args[2] === 'size') {
      const {size} = await fs.stat(`./data/servers/${msg.guild.id}/messages.log`)
      msg.channel.send(f(lang.logsize, size / 1000000.0))
    } else if (args[2] === 'delete') {
      fs.writeFile(`./data/servers/${msg.guild.id}/messages.log`, `--- deleted messages by ${msg.author.tag} ---\n\n\n`, 'utf8')
    }
    nowrite = true
    if (config.data_baseurl == '' || !config.data_baseurl) {
      link = '利用不可'
    } else {
      link = `${config.data_baseurl}/servers/${msg.guild.id}/messages.log`
    }
  } else if (args[1] === 'emojis') {
    client.emojis.forEach((emoji) => {
      sb.push(`<${emoji.guild.name}><${emoji.guild.id}> ${emoji.name} (${emoji.id}) [isAnimated:${emoji.animated}] [ ${emoji.url} ]`)
    })
  } else if (!args[1] || args[1] === 'guilds') {
    client.guilds.forEach((guild) => {
      sb.push(`${guild.name} (${guild.id}) [ ${config.data_baseurl}/servers/${guild.id}/messages.log ]`)
    })
  }
  const image1 = 'https://img.rht0910.tk/upload/2191111432/72932264/bump.png'
  const image2 = 'https://img.rht0910.tk/upload/2191111432/710894583/dump2.png'
  let image
  if (!args[2]) {
    image = image1
  } else {
    image = image2
  }
  const embed = new Discord.RichEmbed().setImage(image)
    .setTitle(lang.dumpmessage)
    .setColor([140,190,210])
    .setDescription(f(lang.dumped, link))
  msg.channel.send(embed)
  if (!nowrite) {
    fs.writeFile('./dump.txt', sb.join('\n'), 'utf8')
  }
}