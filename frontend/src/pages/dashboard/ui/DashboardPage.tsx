export function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">1,234</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">$45,678</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-neutral-900">89</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Recent Activity</h2>
          <p className="text-neutral-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )
}
