export interface TestUser {
  email: string;
  password: string;
  role?: string;
}

export const users: Record<string, TestUser> = {
  admin: {
    email: 'admin@issuetracker.com',
    password: 'TestPassword123!',
    role: 'Admin'
  },
  tester: {
    email: 'tester@issuetracker.com',
    password: 'TestPassword123!',
    role: 'Tester'
  },
  developer: {
    email: 'developer@issuetracker.com',
    password: 'TestPassword123!',
    role: 'Developer'
  },
  invalid: {
    email: 'ghost@issuetracker.com',
    password: 'WrongPassword123!'
  }
};
