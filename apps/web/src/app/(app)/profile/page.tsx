export default function Profile() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <p className="text-gray-600 mb-8">
        Manage your profile information and account details.
      </p>
      <div className="max-w-2xl space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full border rounded-md px-3 py-2"
                placeholder="+964 XXX XXX XXXX"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
