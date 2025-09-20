import { Card, Grid, Group, Pill, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { InventoryClient } from '@shared/sdk';

const client = new InventoryClient('/');

export function ApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => client.listApplications(),
  });

  return (
    <Stack>
      <Title order={2}>Applications</Title>
      <Grid>
        {isLoading && <Skeleton height={140} radius="md" />}
        {data?.data.map((app) => (
          <Grid.Col key={app.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={600}>{app.name}</Text>
                  <Pill>{app.criticality}</Pill>
                </Group>
                <Text size="sm" c="dimmed">
                  {app.description ?? 'No description provided.'}
                </Text>
                <Group gap="xs">
                  <Pill color="blue">{app.primaryCloud}</Pill>
                  {app.tags.map((tag, index) => (
                    <Pill key={`${app.id}-tag-${index}`} color="gray">
                      {Object.entries(tag)
                        .map(([key, value]) => `${key}:${value}`)
                        .join(' ')}
                    </Pill>
                  ))}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
