import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { DashboardPage } from '../DashboardPage';

describe('DashboardPage', () => {
  it('renders title', () => {
    const queryClient = new QueryClient();
    const { getByText } = render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <DashboardPage />
        </QueryClientProvider>
      </MantineProvider>,
    );

    expect(getByText('Dashboard')).toBeDefined();
  });
});
