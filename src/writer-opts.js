'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve

// TODO: export for release-config (commit-analizer)
// and try to combine with CZ
// https://github.com/commitizen/conventional-commit-types/blob/master/index.json
// https://github.com/commitizen/cz-conventional-changelog

// the actual order in the changelog...
const types = [
  // new features
  { type: 'feat', section: ':sparkles: Features', shouldBump: 'minor' },
  // bug fixes
  { type: 'fix', section: ':bug: Bug Fixes', shouldBump: 'patch' },
  // refactoring - structure improvements
  { type: 'refactor', section: ':recycle: Refactoring', shouldBump: false },
  // user scripts (npm-scripts, husky, bash, ...)
  { type: 'script', section: ':hammer_and_wrench: Tasks and Scripts', shouldBump: 'patch' },
  // build scripts for /dist (bash, babel, webpack, ...)
  { type: 'build', section: ':building_construction: Build System', shouldBump: 'patch' },
  // theme and UI changes
  { type: 'config', section: ':wrench: Configs', shouldBump: 'patch' },
  // theme and UI changes
  { type: 'style', section: ':art: Styling', shouldBump: 'patch' },
  // performance enhancements
  { type: 'perf', section: ':zap: Performance', shouldBump: false },
  // changes in tests - add, upgrade, remove, ...
  { type: 'test', section: ':white_check_mark: Tests', shouldBump: false },
  // changes in continuous integration - TravisCI / CircleCI
  { type: 'ci', section: ':construction_worker: Continuous Integration', shouldBump: false },
  // changes in documentations - README, WIKI, CHANGELOG, ...
  { type: 'docs', section: ':memo: Documentations', shouldBump: false },
  // changes in dependencies - add, upgrade, remove, ...
  { type: 'deps', section: ':package: Dependencies', shouldBump: 'patch' },

  // revert status - TODO: how to use
  { type: 'revert', section: ':rewind: Reverts', shouldBump: false },
]
// achieved throug orderMap
const sectionOrder = new Map(types.map((o, i) => o.section).map((s, i) => [ s, i ]))
// and custom sorting by map keys
function commitGroupsSort(groupA, groupB) {
  const rankA = sectionOrder.has(groupA.title) ? sectionOrder.get(groupA.title) : 1000
  const rankB = sectionOrder.has(groupB.title) ? sectionOrder.get(groupB.title) : 1000
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

module.exports.types = types

module.exports = Q.all([
  readFile(resolve(__dirname, '../templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, '../templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, '../templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, '../templates/footer.hbs'), 'utf-8'),
])
  .spread((template, header, commit, footer) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit
    writerOpts.footerPartial = footer

    return writerOpts
  })
