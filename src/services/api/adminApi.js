export const getUsers = async () => Promise.resolve([
  { id: 1, email: 'admin@demo.com', role: 'admin' },
  { id: 2, email: 'user@demo.com', role: 'user' },
]);
export const getAdminStats = async () => Promise.resolve({ users: 2, active: 1 }); 