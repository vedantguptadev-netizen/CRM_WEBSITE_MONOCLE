export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Your CRM
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Streamline your immigration services with our intuitive CRM platform.
          Manage enquiries, applications, and client relationships in one place.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-2 gap-6">
        <a
          href="/dashboard"
          className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            View Dashboard
          </h3>
          <p className="text-gray-600">
            Get an overview of your CRM activity and key metrics.
          </p>
        </a>

        <a
          href="/enquiries"
          className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Manage Enquiries
          </h3>
          <p className="text-gray-600">
            Track and manage all incoming client enquiries.
          </p>
        </a>

        <a
          href="/applications"
          className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            View Applications
          </h3>
          <p className="text-gray-600">
            Track immigration applications and their status.
          </p>
        </a>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Getting Started
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Use the sidebar navigation to access different sections of your CRM.
          Start by exploring the Dashboard to get an overview of your activity,
          then manage enquiries and applications as needed.
        </p>
      </div>
    </div>
  );
}
