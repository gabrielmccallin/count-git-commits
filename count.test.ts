/* eslint-disable filename-rules/match */
import {
  addDays,
  convertMonthToSomethingReasonable,
  countLines,
  createCommandList,
  createDateArray,
  createGitLogCommand,
  createListOfLineCounts,
  executeAndTransformResults,
  executeCommands,
  mergeDatesAndLines,
} from "./count"

const shellOutput = `















`

const table = `2023-07-26: 16
2023-07-25: 15
2023-07-24: 13
2023-07-23: 1
`

const commonDate = "2023-07-26"

describe("transforming shell output", () => {
  it("should count the number of lines", () => {
    expect(countLines(shellOutput)).toEqual(16)
  })

  it("should create an array of lines from each command output", () => {
    const commandList = ['echo "😁"', 'echo "😁"', 'echo "😁"', 'echo "😁"']
    const results = executeCommands(commandList)

    const expected = [1, 1, 1, 1]
    expect(createListOfLineCounts(results)).toEqual(expected)
  })

  it("should return a table with date: counted lines", () => {
    const fixture = [16, 15, 13, 1]
    expect(mergeDatesAndLines(createDateArray(commonDate, 4), fixture)).toEqual(
      table
    )
  })

  it("should return an array of dates from a start date to a number of days in the past", () => {
    const expected = [commonDate, "2023-07-25", "2023-07-24", "2023-07-23"]
    expect(createDateArray(commonDate, 4)).toEqual(expected)
  })
})

describe("command list", () => {
  it("should execute every command in the list", () => {
    const commandList = ['echo "😁"', 'echo "😁"', 'echo "😁"', 'echo "😁"']
    expect(executeCommands(commandList)).toHaveLength(4)
  })
})

describe("exec formatting", () => {
  it("should concatenate exec string with correct date", () => {
    expect(createGitLogCommand("2023-08-26")).toBe(
      `git log --oneline --since="2023-08-25" --until="2023-08-26"`
    )
  })
})

describe("create command list", () => {
  it("should return an array of string shell commands with the right dates", () => {
    const expectedCommands = [
      createGitLogCommand(commonDate),
      createGitLogCommand("2023-07-25"),
      createGitLogCommand("2023-07-24"),
      createGitLogCommand("2023-07-23"),
    ]
    const commands = createCommandList(commonDate, 4)
    expect(commands).toEqual(expectedCommands)
  })
})

describe("add days", () => {
  it("should calculate the date of the following day and return it as a string e.g. 2023-07-27", () => {
    const nextDay = addDays(commonDate, 1)
    expect(nextDay).toBe("2023-07-27")
  })

  it("should calculate the date of the following day, change month, and return it as a string", () => {
    const nextDay = addDays("2023-07-31", 1)
    expect(nextDay).toBe("2023-08-01")
  })

  it("should calculate the date of the following day, change month to next year, and return it as a string", () => {
    const nextDay = addDays("2023-12-31", 1)
    expect(nextDay).toBe("2024-01-01")
  })

  it("should calculate the date in 10 days time, change month to next year, and return it as a string", () => {
    const nextDay = addDays("2023-07-27", 10)
    expect(nextDay).toBe("2023-08-06")
  })

  it("should calculate the date 10 days ago and return it as a string", () => {
    const nextDay = addDays("2023-07-27", -10)
    expect(nextDay).toBe("2023-07-17")
  })
})

describe("month transforms", () => {
  it("should convert a JS Date month to a 1-based index string", () => {
    const month = convertMonthToSomethingReasonable(new Date(commonDate))
    expect(month).toBe("07")
  })

  it("should convert a JS Date month to a 1-based index string with an input of 9", () => {
    const month = convertMonthToSomethingReasonable(new Date("2023-9-26"))
    expect(month).toBe("09")
  })

  it("should convert a JS Date month to a 1-based index string with an input of 10 or over", () => {
    const month = convertMonthToSomethingReasonable(new Date("2023-10-26"))
    expect(month).toBe("10")

    const november = convertMonthToSomethingReasonable(new Date("2023-11-26"))
    expect(november).toBe("11")
  })
})

describe("putting it altogether", () => {
  it("should return a list of date: lineCount", () => {
    const expected = `2023-07-26: 1
2023-07-25: 1
2023-07-24: 1
2023-07-23: 1
`
    const executor = () => ["😁\n", "😁\n", "😁\n", "😁\n"]
    const transformed = executeAndTransformResults(commonDate, 4, executor)
    expect(transformed).toBe(expected)
  })
})
