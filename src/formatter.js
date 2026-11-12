import Table from "cli-table3";
import chalk from "chalk";

/**
 * Builds and prints an ASCII table using cli-table3 and chalk.
 * @param {Array<object>} repos - Repositories returned by GitHub API
 */
export function renderTable(repos) {
  if (!repos.length) {
    console.log(
      chalk.yellow("\nNo repositories found matching the criteria.\n"),
    );
    return;
  }

  const table = new Table({
    head: [
      chalk.cyan.bold("Repository Name"),
      chalk.yellow.bold("Stars"),
      chalk.magenta.bold("Language"),
      chalk.green.bold("Description"),
    ],
    colWidths: [30, 12, 16, 50],
    wordWrap: true,
    style: {
      head: [],
      border: ["grey"],
    },
  });

  for (const repo of repos) {
    table.push([
      chalk.bold(repo.full_name || "N/A"),
      chalk.yellow((repo.stargazers_count ?? 0).toLocaleString()),
      chalk.magenta(repo.language || "N/A"),
      repo.description
        ? repo.description.trim()
        : chalk.dim("No description provided"),
    ]);
  }

  console.log("\n" + table.toString() + "\n");
}
