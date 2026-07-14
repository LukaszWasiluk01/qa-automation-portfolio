import { test, expect } from '@playwright/test';
import { issueData } from '../../fixtures/issueData';

test.describe('Issues API endpoints', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'admin@issuetracker.com',
        password: 'TestPassword123!'
      }
    });
    const responseBody = await response.json();
    token = responseBody.token;
  });

  test('Should create a new issue via API', async ({ request }) => {
    const response = await request.post('/api/issues', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: issueData.validIssue
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody.title).toBe(issueData.validIssue.title);
    expect(responseBody.status).toBe(0);
  });

  test('Should reject issue creation without title', async ({ request }) => {
    const response = await request.post('/api/issues', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: issueData.invalidIssue
    });

    expect(response.status()).toBe(400);
  });

  test('Should retrieve issues list', async ({ request }) => {
    const response = await request.get('/api/issues', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });
});