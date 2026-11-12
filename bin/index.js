import { Command, InvalidArgumentError } from "commander";
import chalk from "chalk";
import { getStartDate } from "../src/date-helper.js";
import { fetchTrendingRepos } from "../src/api.js";
import { renderTable } from "../src/formatter.js";

/**
 * Validates and parses the limit argument as a positive integer.
 * @param {string} value
 * @returns {number}
 */
function parseLimit(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== value.trim()) {
    throw new InvalidArgumentError(
      "Must be a positive integer greater than 0.",
    );
  }
  if (parsed > 100) {
    throw new InvalidArgumentError(
      "Maximum allowable limit per page by GitHub API is 100.",
    );
  }
  return parsed;
}

/**
 * Validates the duration option against allowed values.
 * @param {string} value
 * @returns {string}
 */
function parseDuration(value) {
  const allowed = ["day", "week", "month", "year"];
  const normalized = value.toLowerCase();
  if (!allowed.includes(normalized)) {
    throw new InvalidArgumentError(
      `Allowed values are: ${allowed.join(", ")}.`,
    );
  }
  return normalized;
}

const program = new Command();

program
  .name("trending-repos")
  .description("Fetch and display trending GitHub repositories by stars.")
  .version("1.0.0")
  .option(
    "-d, --duration <duration>",
    "Time window: day, week, month, or year",
    parseDuration,
    "week",
  )
  .option(
    "-l, --limit <number>",
    "Number of repositories to fetch (1-100)",
    parseLimit,
    10,
  )
  .action(async (options) => {
    try {
      const startDate = getStartDate(options.duration);
      console.log(
        chalk.blue(
          `\nFetching top ${options.limit} repos created since ${startDate} (past ${options.duration})...`,
        ),
      );

      const repos = await fetchTrendingRepos(startDate, options.limit);
      renderTable(repos);
    } catch (err) {
      console.error(chalk.red(`\nError: ${err.message}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);
