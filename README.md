[![Build Status](https://travis-ci.com/stackr23/conventional-changelog-config.svg?token=9j4kv11sMyqyMRAPNQXm&branch=master)](https://travis-ci.com/stackr23/conventional-changelog-config) [![NPM Release](https://img.shields.io/npm/v/@stackr23/conventional-changelog-config.svg?style=flat)](https://www.npmjs.com/package/%40stackr23%2Fconventional-changelog-config)
[![Conventional Commits](https://img.shields.io/badge/✔-Conventional%20Commits-blue.svg)](https://conventionalcommits.org)
[![Semantic Versioning][semantic-img]][semantic-url]

[semantic-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-blue.svg
[semantic-url]: https://semver.org/

**Issues with the convention itself should be reported on the Angular issue tracker.**

## StackR23 config - based on angular preset

Angular's [commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

### Type Additions

| **TYPE**     | **TITLE**                                    | **BUMP** |
| ------------ | -------------------------------------------- | :------: |
| **feat**     | :sparkles: Features                          |  minor   |
| **fix**      | :bug: Bug Fixes                              |  patch   |
| **build**    | :hammer_and_wrench: Build System             |  patch   |
| **style**    | :art: Styling                                |  patch   |
| **deps**     | :package: Dependencies                       |  patch   |
| **docs**     | :memo: Documentations                        |    -     |
| **test**     | :white_check_mark: Tests                     |    -     |
| **refactor** | :building_construction: Refactoring          |    -     |
| **ci**       | :construction_worker: Continuous Integration |    -     |
| **perf**     | :zap: Performance Enhancement                |    -     |
| **revert**   | :rewind: Reverts                             |    -     |

### Examples

Appears under "Features" header, pencil subheader:

```
feat(pencil): add 'graphiteWidth' option
```

Appears under "Bug Fixes" header, graphite subheader, with a link to issue #28:

```
fix(graphite): stop graphite breaking when width < 0.1

Closes #28
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reason.
```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Commit Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `build`, `ci`, `docs` ,`style`, `refactor`, and `test` for non-changelog related tasks.

Details regarding these types can be found in the official [Angular Contributing Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).

### Scope

The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document](#commit-message-format).
