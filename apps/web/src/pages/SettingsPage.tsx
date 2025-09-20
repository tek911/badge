import { Card, Stack, Switch, Text, TextInput, Title } from '@mantine/core';

export function SettingsPage() {
  return (
    <Stack>
      <Title order={2}>Settings</Title>
      <Card withBorder>
        <Stack>
          <TextInput label="OIDC Issuer" placeholder="https://auth.example.com" defaultValue="https://auth.local" />
          <TextInput label="Audience" placeholder="inventory-api" defaultValue="inventory-api" />
          <Switch label="Enable demo mode" defaultChecked />
          <Text size="sm" c="dimmed">
            Settings are stored securely on the server. This UI demonstrates configurable options with RBAC enforcement.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
