import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Welcome Home
        </h1>
        <p className="text-neutral-600 text-lg mb-6">
          This is the home page of your application.
        </p>
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/profile"
            className="bg-neutral-200 text-neutral-900 px-6 py-3 rounded-md hover:bg-neutral-300 transition"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
