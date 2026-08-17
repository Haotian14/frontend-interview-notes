import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the existing handbook before migration', () => {
  render(<App />);
  expect(screen.getByText('前端复习手册')).toBeInTheDocument();
});
