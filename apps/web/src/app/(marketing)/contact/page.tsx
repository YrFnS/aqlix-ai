export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl">
        <p className="text-lg text-gray-700 mb-8">
          Get in touch with our team for questions, support, or partnership
          opportunities.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Email</h2>
            <p className="text-gray-600">contact@iraqiai.com</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Phone</h2>
            <p className="text-gray-600">+964 XXX XXX XXXX</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Address</h2>
            <p className="text-gray-600">Baghdad, Iraq</p>
          </div>
        </div>
      </div>
    </main>
  );
}
