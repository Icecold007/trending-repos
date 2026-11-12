import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
/**
 * Queries GitHub Search API for repositories created after `startDate`.
 * @param {string} startDate - Date string formatted as YYYY-MM-DD
 * @param {number} limit - Number of items to retrieve (positive integer, max 100)
 * @returns {Promise<Array<object>>} List of repository data objects
 */
export async function fetchTrendingRepos(startDate, limit) {
  const queryParams = new URLSearchParams({
    q: `created:>${startDate}`,
    sort: "stars",
    order: "desc",
    per_page: String(limit),
  });

  const url = `${process.env.GITHUB_API_BASE}?${queryParams.toString()}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "trending-repos-cli-tool",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  let response;
  try {
    response = await fetch(url, { headers });
  } catch (networkError) {
    throw new Error(
      `Network failure: Unable to reach GitHub API (${networkError.message})`,
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || response.statusText;

    if (response.status === 403) {
      const resetHeader = response.headers.get("x-ratelimit-reset");
      let resetNotice = "";
      if (resetHeader) {
        const resetDate = new Date(
          parseInt(resetHeader, 10) * 1000,
        ).toLocaleTimeString();
        resetNotice = ` Limit resets at ${resetDate}.`;
      }
      throw new Error(
        `GitHub API rate limit exceeded (403).${resetNotice}\nTip: Export a GITHUB_TOKEN environment variable to raise limits.`,
      );
    }

    throw new Error(`GitHub API Error [${response.status}]: ${message}`);
  }

  const data = await response.json();
  return data.items || [];
}
