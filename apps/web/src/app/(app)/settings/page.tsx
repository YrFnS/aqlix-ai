export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600 mb-8">
        Configure your Iraqi AI Chat System preferences and account settings.
      </p>
      <div className="space-y-6 max-w-2xl">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Language Preferences</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>Enable Iraqi dialect support</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>Enable Arabic RTL layout</span>
            </label>
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>SMS notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
