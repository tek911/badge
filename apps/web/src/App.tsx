import { AppShell, Burger, Group, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconApps, IconHome2, IconServer, IconSettings, IconCloud } from '@tabler/icons-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { WorkloadsPage } from './pages/WorkloadsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';

const links = [
  { to: '/', label: 'Dashboard', icon: IconHome2 },
  { to: '/applications', label: 'Applications', icon: IconApps },
  { to: '/workloads', label: 'Workloads', icon: IconServer },
  { to: '/integrations', label: 'Integrations', icon: IconCloud },
  { to: '/settings', label: 'Settings', icon: IconSettings },
];

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700}>Service Inventory</Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Group gap="sm" grow>
          {links.map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(8),
                  padding: `${rem(8)} ${rem(12)}`,
                  borderRadius: rem(8),
                  textDecoration: 'none',
                  color: active ? 'var(--mantine-color-blue-5)' : 'inherit',
                  backgroundColor: active ? 'var(--mantine-color-blue-light)' : 'transparent',
                }}
              >
                <Icon size={18} />
                <Text>{link.label}</Text>
              </Link>
            );
          })}
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/workloads" element={<WorkloadsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
