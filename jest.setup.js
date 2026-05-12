import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch para simular respuesta del API de autenticación
// Token JWT mock con payload: { sub: '1', preferred_username: 'davichox', email: 'davichox@example.com', name: 'Davichox User' }
const mockAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGF2aWNob3giLCJlbWFpbCI6ImRhdmljaG94QGV4YW1wbGUuY29tIiwibmFtZSI6IkRhdmljaG94IFVzZXIifQ.mock_signature';

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('/v1/auth/login')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: mockAccessToken,
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        refresh_expires_in: 7200,
        token_type: 'Bearer',
      }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});
