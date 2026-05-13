/**
 * Global auth handler for handling 401 responses outside of React components.
 * This is set up by the AuthProvider and can be used by API clients.
 */
let globalUnauthorizedHandler: (() => void) | null = null;

export function setupGlobalAuthHandler(handler: () => void) {
  globalUnauthorizedHandler = handler;
}

export function getGlobalAuthHandler(): (() => void) | null {
  return globalUnauthorizedHandler;
}

export function triggerUnauthorizedRedirect() {
  if (globalUnauthorizedHandler) {
    globalUnauthorizedHandler();
  }
}
