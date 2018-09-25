const f = require('string-format')
const isTravisBuild = process.argv.includes('--travis-build')
const s = require(`${__dirname}/../` + (isTravisBuild ? 'travis.yml' : 'secret.yml'))

module.exports.name = 'play'

module.exports.alias = ['music']

module.exports.run = async function(msg, settings, lang) {
  return msg.channel.send(f(lang.musicbotis, s.musicinvite))
}
