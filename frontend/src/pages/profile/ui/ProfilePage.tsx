import { Link } from 'react-router-dom'

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">JD</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">John Doe</h1>
              <p className="text-neutral-600">john.doe@example.com</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                  <p className="text-neutral-900">John Doe</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <p className="text-neutral-900">john.doe@example.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                  <p className="text-neutral-900">Administrator</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Link
                to="/settings"
                className="bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition inline-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
