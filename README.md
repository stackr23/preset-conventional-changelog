[![Build Status](https://travis-ci.com/stackr23/preset-conventional-changelog.svg?token=9j4kv11sMyqyMRAPNQXm&branch=master)](https://travis-ci.com/stackr23/preset-conventional-changelog) [![NPM Release](https://img.shields.io/npm/v/@stackr23/preset-conventional-changelog.svg?style=flat)](https://www.npmjs.com/package/%40stackr23%2Fpreset-conventional-changelog)
[![Conventional Commits](https://img.shields.io/badge/✔-Conventional%20Commits-blue.svg)](https://conventionalcommits.org)
[![Semantic Versioning][semantic-img]][semantic-url]

[semantic-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-blue.svg
[semantic-url]: https://semver.org/

## Stackr23's preset for conventional-changelog

### Type Definitions

| **TYPE**     | **TITLE**                             | **TARGET**                                                        |
| ------------ | ------------------------------------- | ----------------------------------------------------------------- |
| **feat**     | :sparkles: Features                   | **new Features**                                                  |
| **fix**      | :bug: Bug Fixes                       | **fixed Bugs**                                                    |
| **config**   | :wrench: Configs                      | **Config changes**<br />(_babel, webpack, travis, dotfiles, ..._) |
| **script**   | :hammer_and_wrench: Scripts and Tasks | **Development Scripts**<br/>(_Gulp/Grunt, npm scripts, MRM, ..._) |
| **style**    | :art: Styling                         | **Theme and UI changes**                                          |
| **deps**     | :package: Dependencies                | **Dependency changes**<br/>(_add, upgrade, remove, ..._)          |
| **refactor** | :building_construction: Refactoring   | **Structure Improvements**                                        |
| **test**     | :white_check_mark: Tests              | **changes in Tests**<br/>(_add, upgrade, remove, ..._)            |
| **docs**     | :memo: Documentations                 | **Documentation changes**<br/>(_README, WIKI, CHANGELOG, ..._)    |
| **revert**   | :rewind: Reverts                      | **Revert Commit**                                                 |