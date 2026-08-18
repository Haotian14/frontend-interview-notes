import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import { createRoutes } from './routes';

export const appRouter = createBrowserRouter(createRoutes());

export function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(createRoutes(), { initialEntries });
}
