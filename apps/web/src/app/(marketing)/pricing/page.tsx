export default function Pricing() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="text-3xl font-bold mb-4">1,000 IQD</p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Basic chat features</li>
            <li>✓ Limited AI responses</li>
            <li>✓ Iraqi dialect support</li>
          </ul>
        </div>
        <div className="border rounded-lg p-6 border-blue-600 bg-blue-50">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="text-3xl font-bold mb-4">10,000 IQD</p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Advanced chat features</li>
            <li>✓ Unlimited AI responses</li>
            <li>✓ Priority support</li>
          </ul>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
          <p className="text-3xl font-bold mb-4">Custom</p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Custom integration</li>
            <li>✓ Dedicated support</li>
            <li>✓ SLA guarantees</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
