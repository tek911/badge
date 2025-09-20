import { Card, Grid, Pill, Stack, Text, Title } from '@mantine/core';

const connectors = [
  { name: 'GitHub', description: 'Discover repositories and manifests.', status: 'Connected' },
  { name: 'GitLab', description: 'Ingest pipelines and projects.', status: 'Demo' },
  { name: 'AWS', description: 'Map ECR images, ECS/EKS workloads.', status: 'Connected' },
  { name: 'Azure', description: 'Sync App Services and AKS.', status: 'Demo' },
  { name: 'GCP', description: 'Discover Cloud Run and GKE workloads.', status: 'Demo' },
  { name: 'Wiz', description: 'Pull CNAPP asset inventory and tags.', status: 'Mock' }
];

export function IntegrationsPage() {
  return (
    <Stack>
      <Title order={2}>Integrations</Title>
      <Grid>
        {connectors.map((connector) => (
          <Grid.Col key={connector.name} span={{ base: 12, md: 6 }}>
            <Card withBorder shadow="sm">
              <Stack gap="xs">
                <Text fw={600}>{connector.name}</Text>
                <Text size="sm" c="dimmed">
                  {connector.description}
                </Text>
                <Pill color="green">{connector.status}</Pill>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
