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