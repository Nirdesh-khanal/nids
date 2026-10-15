import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders button with label and responds to click', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Mitigate Threat</Button>);

    const button = screen.getByRole('button', { name: /mitigate threat/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders in disabled and loading states', () => {
    render(<Button isLoading>Inspect Flow</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
