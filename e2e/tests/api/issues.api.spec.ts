import { test, expect } from '@playwright/test';
import { issueData } from '../../fixtures/issueData';

test.describe('Issues API endpoints', () => {
  let token: string;
  let createdIssueId: number;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'admin@issuetracker.com',
        password: 'TestPassword123!'
      }
    });

    expect(response.ok(), `Login failed with status: ${response.status()}`).toBeTruthy();

    const responseBody = await response.json();
    token = responseBody.token;
  });

  test('Should reject access without token', async ({ request }) => {
    const response = await request.get('/api/issues');
    expect(response.status()).toBe(401);
  });

  test('Should create a new issue via API', async ({ request }) => {
    const response = await request.post('/api/issues', {
      headers: { Authorization: `Bearer ${token}` },
      data: issueData.validIssue
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.title).toBe(issueData.validIssue.title);

    createdIssueId = responseBody.id;
  });

  test('Should reject issue creation without title', async ({ request }) => {
    const response = await request.post('/api/issues', {
      headers: { Authorization: `Bearer ${token}` },
      data: issueData.invalidIssue
    });
    expect(response.status()).toBe(400);
  });

  test('Should retrieve issues list', async ({ request }) => {
    const response = await request.get('/api/issues', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('Should delete the created issue', async ({ request }) => {
    test.skip(!createdIssueId, 'Issue was not created');

    const response = await request.delete(`/api/issues/${createdIssueId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect([200, 204]).toContain(response.status());
  });
});