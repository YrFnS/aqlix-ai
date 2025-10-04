export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your Iraqi AI Chat System dashboard. Monitor your AI chat
        interactions, analytics, and system performance.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Chats</h2>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-green-600">567</p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Avg Response Time</h2>
          <p className="text-3xl font-bold text-purple-600">1.2s</p>
        </div>
      </div>
    </div>
  );
}
