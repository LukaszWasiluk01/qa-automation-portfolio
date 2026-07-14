export const issueData = {
  validIssue: {
    title: 'Automated API Test Issue',
    description: 'Created via Playwright request context',
    priority: 2
  },
  invalidIssue: {
    description: 'Issue missing a required title',
    priority: 1
  }
};

/**
 * Generates a unique title so parallel/repeated test runs never collide
 * on the shared in-memory database.
 */
export function uniqueTitle(prefix = 'Issue'): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
