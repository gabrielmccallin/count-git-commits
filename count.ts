import { execSync } from "child_process"

export const createGitLogCommand = (dateString: string) => {
  const since = addDays(dateString, 1)
  return `git log --oneline --since="${dateString}T00:00:00-00:00" --until="${since}T00:00:00-00:00"`
}

// wowowowowo
export const addDays = (dateString: string, days: number) => {
  const date = new Date(dateString)
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + days)
  const dateNumber = nextDay.getDate()
  const dateConverted = dateNumber < 10 ? `0${dateNumber}` : dateNumber
  return `${nextDay.getFullYear()}-${convertMonthToSomethingReasonable(
    nextDay
  )}-${dateConverted}`
}

export const convertMonthToSomethingReasonable = (date: Date) => {
  const month = date.getMonth()
  const monthReindex = month + 1
  return monthReindex < 10 ? `0${monthReindex}` : monthReindex.toString()
}

export const countLines = (lines: string) => {
  return lines.split(/\r|\r\n|\n/g).length - 1
}

export const createDateArray = (date: string, days: number) => {
  return Array.from({ length: days }, (_x, i) => addDays(date, -i))
}

export const createCommandList = (date: string, days: number) => {
  const dates = createDateArray(date, days)
  return dates.map(createGitLogCommand)
}

export const executeCommands = (commands: string[]) => {
  return commands.map((command) => {
    return execSync(command).toString()
  })
}

export const mergeDatesAndLines = (dates: string[], lines: number[]) => {
  return dates.reduce(
    (acc, day, index) => `${acc}${day}: ${lines[index]}\n`,
    ""
  )
}

export const createListOfLineCounts = (results: string[]) => {
  return results.map((result) => countLines(result))
}

export const executeAndTransformResults = (
  date: string,
  days: number,
  executor: (commands: string[]) => string[]
) => {
  const commands = createCommandList(date, days)
  const results = executor(commands)
  const lines = createListOfLineCounts(results)
  return mergeDatesAndLines(createDateArray(date, days), lines)
}

console.log(
  executeAndTransformResults(
    process.argv[2],
    Number(process.argv[3]),
    executeCommands
  )
)
