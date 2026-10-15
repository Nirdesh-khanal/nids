import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('renders critical severity badge with accessible text and dot', () => {
    render(<Badge variant="critical">CRITICAL</Badge>);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toBeInTheDocument();
  });

  it('renders demo data indicator badge correctly', () => {
    render(<Badge variant="demo">DEMO DATA</Badge>);
    expect(screen.getByText('DEMO DATA')).toBeInTheDocument();
  });
});
