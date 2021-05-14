'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve

module.exports = Q.all([
  readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
])
  .spread((template, header, commit, footer) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit
    writerOpts.footerPartial = footer

    return writerOpts
  })

function getWriterOpts () {
  return {
    transform: (commit, context) => {
      let discard = true
      const issues = []

      commit.notes.forEach(note => {
        note.title = 'BREAKING CHANGES'
        discard = false
      })
      
      // set section title
      const types = [
        { type: "feat", section: ":sparkles: Features"},
        { type: "fix", section: ":bug: Bug Fixes" },
        { type: "refactor", section: ":building_construction: Refactoring"},
        { type: "style", section: ":art: Styling" },
        { type: "docs", section: ":memo: Documentations" },
        { type: "perf", section: ":zap: Performance Enhancement" },
        { type: "revert", section: ":rewind: Reverts" },
        { type: "test", section: ":white_check_mark: Tests" },
        { type: "build", section: ":construction_worker: Continuous Integration" },
        { type: "ci", section: ":hammer_and_wrench: Build System" },
      ]
      
      const sectionsTitles = {}
      types.map((o, i) => { sectionsTitles[o.type] = o.section })
      
      console.log(sectionsTitles)
      
      let sectionOrder = new Map(
        types.map((o, i) => o.section)
          .map((s, i) => [s, i])
      )
      
      console.log(sectionOrder)
      
      function commitGroupsSort(groupA, groupB) {
        const rankA = sectionsOrder.has(groupA.title) ? sectionsOrder.get(groupA.title) : 1000;
        const rankB = sectionsOrder.has(groupB.title) ? sectionsOrder.get(groupB.title) : 1000;
      
        return rankA - rankB;
      }
      
      function compareStrings(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
      
        return 0;
      }
      
      function commitsSort(commitA, commitB) {
        const scopeRank = compareStrings(commitA.scope, commitB.scope);
      
        if (scopeRank === 0) return compareStrings(commitA.subject, commitB.subject);
        if (!commitA.scope) return 1;
        if (!commitB.scope) return -1;
      
        return scopeRank;
      }

      commit.type = sectionsTitles[commit.type]

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
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy: 'type',
    commitGroupsSort, // 'title'
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
