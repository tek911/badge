import { Card, Stack, Text, Title } from '@mantine/core';

export function WorkloadsPage() {
  return (
    <Stack>
      <Title order={2}>Workloads Explorer</Title>
      <Card withBorder>
        <Text size="sm">
          Workload inventory is synchronised via cloud and Kubernetes connectors. Configure integrations to view mapped
          workloads and confidence scores.
        </Text>
      </Card>
    </Stack>
  );
}
