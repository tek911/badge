import { Card, Grid, Group, Skeleton, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { InventoryClient } from '@shared/sdk';

const client = new InventoryClient('/');

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => client.listApplications(),
  });

  const totalApplications = data?.data.length ?? 0;
  const highCriticality = data?.data.filter((app) => app.criticality === 'HIGH').length ?? 0;

  return (
    <div>
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder>
            <Text fw={600}>Applications</Text>
            {isLoading ? <Skeleton height={32} mt="sm" /> : <Text size="xl">{totalApplications}</Text>}
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder>
            <Text fw={600}>High Criticality</Text>
            {isLoading ? <Skeleton height={32} mt="sm" /> : <Text size="xl">{highCriticality}</Text>}
          </Card>
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        <Text c="dimmed">Coverage metrics update automatically based on ingestion jobs.</Text>
      </Group>
    </div>
  );
}
