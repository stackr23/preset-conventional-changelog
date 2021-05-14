'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve

// the actual order in the changelog...
const types = [
  { type: 'feat', section: ':sparkles: Features' },
  { type: 'fix', section: ':bug: Bug Fixes' },
  { type: 'refactor', section: ':building_construction: Refactoring' },
  { type: 'style', section: ':art: Styling' },

  { type: 'task', section: ':hammer_and_wrench: Tasks and Scripts' },
  { type: 'script', section: ':hammer_and_wrench: Tasks and Scripts' },

  { type: 'deps', section: ':package: Dependencies' },
  { type: 'docs', section: ':memo: Documentations' },
  { type: 'test', section: ':white_check_mark: Tests' },
  { type: 'build', section: ':construction_worker: Continuous Integration' },
  { type: 'perf', section: ':zap: Performance Enhancement' },
  { type: 'ci', section: ':hammer_and_wrench: Build System' },
  { type: 'revert', section: ':rewind: Reverts' },
]
// achieved throug orderMap
const sectionOrder = new Map(types.map((o, i) => o.type).map((s, i) => [ s, i ]))
// and custom sorting by map keys
function commitGroupsSort(groupA, groupB) {
  const rankA = sectionOrder.has(groupA.type) ? sectionOrder.get(groupA.type) : 1000
  const rankB = sectionOrder.has(groupB.type) ? sectionOrder.get(groupB.type) : 1000

  return rankA - rankB
}
// easy acces to titles
const sectionsTitles = {} // = _.indexBy(types, 'type')
types.map((o, i) => { sectionsTitles[o.type] = o.section })

function getWriterOpts() {
  return {
    types,
    transform: (commit, context) => {
      // let discard = true
      const issues = []

      commit.notes.forEach((note) => {
        note.title = 'BREAKING CHANGES'
        // discard = false
      })

      // set type group titles
      if (sectionsTitles[commit.type] == null) return
      commit.type = sectionsTitles[commit.type] || commit.type

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
          })
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy:        'type',
    commitGroupsSort,
    commitsSort:    [ 'scope', 'subject' ],
    noteGroupsSort: 'title',
    notesSort:      compareFunc,
  }
}

module.exports = Q.all([
  readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8'),
])
  .spread((template, header, commit, footer) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit
    writerOpts.footerPartial = footer

    return writerOpts
  })
