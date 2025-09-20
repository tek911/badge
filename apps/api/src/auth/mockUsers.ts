export interface MockUser {
  id: string;
  email: string;
  roles: string[];
  claims: Record<string, string>;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'demo.admin@example.com',
    roles: ['admin'],
    claims: { tenant: 'acme' },
  },
  {
    id: 'user-2',
    email: 'demo.viewer@example.com',
    roles: ['viewer'],
    claims: { tenant: 'acme' },
  },
];

export function findMockUser(token: string): MockUser | undefined {
  return mockUsers.find((user) => token.includes(user.email));
}
