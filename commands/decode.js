module.exports = function(msg, settings) {
  const cmd = settings.prefix + 'decode '
  return msg.channel.send(new Buffer.from(msg.content.slice(cmd.length), 'base64').toString('ascii'))
}