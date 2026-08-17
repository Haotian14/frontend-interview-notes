import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { createTestRouter } from '../app/router';

test('renders the V2 handbook entry page', () => {
  render(<RouterProvider router={createTestRouter(['/'])} />);
  expect(screen.getByText('前端工程师系统复习手册')).toBeInTheDocument();
});
