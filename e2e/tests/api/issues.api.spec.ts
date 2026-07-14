import { test, expect, APIRequestContext } from '@playwright/test';
import { users } from '../../fixtures/users';
import { issueData, uniqueTitle } from '../../fixtures/issueData';

async function loginToken(request: APIRequestContext, email: string, password: string): Promise<string> {
  const response = await request.post('/api/auth/login', { data: { email, password } });
  expect(response.ok(), `Login failed with status ${response.status()}`).toBeTruthy();
  return (await response.json()).token;
}

test.describe('Issues API (Playwright request)', () => {
  test('rejects access without a token', async ({ request }) => {
    const response = await request.get('/api/issues');
    expect(response.status()).toBe(401);
  });

  test('login returns a JWT token and role', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: users.admin.email, password: users.admin.password }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.role).toBe('Admin');
  });

  test('creates a new issue and returns 201 with the payload', async ({ request }) => {
    const token = await loginToken(request, users.admin.email, users.admin.password);
    const title = uniqueTitle('API');

    const response = await request.post('/api/issues', {
      headers: { Authorization: `Bearer ${token}` },
      data: { ...issueData.validIssue, title }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(title);
    expect(body.id).toBeGreaterThan(0);
  });

  test('rejects issue creation without a title (400)', async ({ request }) => {
    const token = await loginToken(request, users.tester.email, users.tester.password);

    const response = await request.post('/api/issues', {
      headers: { Authorization: `Bearer ${token}` },
      data: issueData.invalidIssue
    });

    expect(response.status()).toBe(400);
  });

  test('retrieves the issues list as an array (200)', async ({ request }) => {
    const token = await loginToken(request, users.tester.email, users.tester.password);

    const response = await request.get('/api/issues', {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBeTruthy();
  });

  test('supports a full create-read-delete lifecycle as admin', async ({ request }) => {
    const token = await loginToken(request, users.admin.email, users.admin.password);
    const headers = { Authorization: `Bearer ${token}` };

    const created = await request.post('/api/issues', {
      headers,
      data: { title: uniqueTitle('Lifecycle'), priority: 3 }
    });
    expect(created.status()).toBe(201);
    const id = (await created.json()).id;

    const read = await request.get(`/api/issues/${id}`, { headers });
    expect(read.status()).toBe(200);

    const deleted = await request.delete(`/api/issues/${id}`, { headers });
    expect(deleted.status()).toBe(204);

    const readAgain = await request.get(`/api/issues/${id}`, { headers });
    expect(readAgain.status()).toBe(404);
  });
});
