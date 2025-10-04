import { Container } from "@/components/layout/container";
import { Grid } from "@/components/layout/grid";
import { Stack } from "@/components/layout/stack";

export default function Dashboard() {
  return (
    <Container>
      <Stack spacing="lg">
        <div>
          <h1 className="text-heading-2 mb-4">Dashboard</h1>
          <p className="text-body text-gray-600">
            Welcome to your Iraqi AI Chat System dashboard. Monitor your AI chat
            interactions, analytics, and system performance.
          </p>
        </div>

        <Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
          <div className="border rounded-lg p-6">
            <h2 className="text-heading-3 mb-2">Total Chats</h2>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-heading-3 mb-2">Active Users</h2>
            <p className="text-3xl font-bold text-green-600">567</p>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-heading-3 mb-2">Avg Response Time</h2>
            <p className="text-3xl font-bold text-purple-600">1.2s</p>
          </div>
        </Grid>
      </Stack>
    </Container>
  );
}
