'use strict'

module.exports = {
  headerPattern:        /(\w*)(?:\((.*)\))?: (.*)$/,
  // adaption for emoji-commits
  // headerPattern:        /^(?::\w*:)\s(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))\s?(?<ticket>#\d*)?$/,
  headerCorrespondence: [ 'type', 'scope', 'subject', 'ticket' ],
  noteKeywords:         [ 'BREAKING CHANGE' ],
  revertPattern:        /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: [ 'header', 'hash' ],
}
