export type UserDTO = {
  usuarioKyId: string;
  username: string;
  fullName?: string;
  email?: string;
  role?: string;
  createdAt?: string;
};

const mockUsers: UserDTO[] = [
  { usuarioKyId: '1', username: 'jdoe', fullName: 'John Doe', email: 'jdoe@example.com', role: 'admin', createdAt: new Date().toISOString() },
  { usuarioKyId: '2', username: 'asmith', fullName: 'Alice Smith', email: 'asmith@example.com', role: 'user', createdAt: new Date().toISOString() },
  { usuarioKyId: '3', username: 'bgarcia', fullName: 'Bruno Garcia', email: 'bgarcia@example.com', role: 'user', createdAt: new Date().toISOString() },
];

function handleError<T>(err: unknown, fallback: T): T {
  // eslint-disable-next-line no-console
  console.warn('users-api fallback to mock', err);
  return fallback;
}

export async function listUsers(page = 1, perPage = 20, token?: string): Promise<{ usuarios: UserDTO[]; total?: number }> {
  try {
    const params = new URLSearchParams({ pagina: String(Math.max(0, page - 1)), cantidad: String(perPage) });
    const res = await fetch(`/api/users/v1/usuarios?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    return { usuarios: json || [], total: Array.isArray(json) ? json.length : undefined };
  } catch (err) {
    return handleError(err, { usuarios: mockUsers, total: mockUsers.length });
  }
}

export async function getUser(id: string, token?: string): Promise<UserDTO | null> {
  try {
    const res = await fetch(`/api/users/v1/usuarios/${encodeURIComponent(id)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    return json as UserDTO;
  } catch (err) {
    return handleError(err, mockUsers.find((u) => u.usuarioKyId === id) ?? null);
  }
}

export async function createUser(body: Partial<UserDTO>, token?: string): Promise<UserDTO> {
  try {
    const res = await fetch(`/api/users/v1/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    const newUser: UserDTO = { usuarioKyId: String(Date.now()), username: (body.username as string) ?? 'new', fullName: body.fullName, email: body.email, role: body.role ?? 'user', createdAt: new Date().toISOString() };
    return handleError(err, newUser);
  }
}

export async function updateUser(id: string, body: Partial<UserDTO>, token?: string): Promise<UserDTO | null> {
  try {
    const res = await fetch(`/api/users/v1/usuarios/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    const found = mockUsers.find((u) => u.usuarioKyId === id) ?? null;
    const merged = found ? { ...found, ...body } : null;
    return handleError(err, merged);
  }
}

export async function deleteUser(id: string, token?: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/v1/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    return res.ok;
  } catch (err) {
    return handleError(err, true);
  }
}
