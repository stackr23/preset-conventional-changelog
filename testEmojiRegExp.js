// TODO: filter emoji (IF PRESENT) from commit

var emojiRegex = require('emoji-regex/es2015/RGI_Emoji')

const regexEmojis = emojiRegex()
let match

let text = '🐛 fix(test): commit msg',
  textCleaned // TODO: change eslint var-spacing let/var -> 3

if ((match = regexEmojis.exec(text)) != null) {
  console.log('match :>> ', match)
  textCleaned = text.replace(match[0], '').substr(1)
}

// const emoji = match[0]

console.log(textCleaned)
