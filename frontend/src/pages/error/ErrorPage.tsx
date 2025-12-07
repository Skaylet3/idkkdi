import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: number | string = 'Error'

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || error.data?.message || 'An error occurred'
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    errorMessage = 'Unknown error occurred'
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-primary mb-4">
              {errorStatus === 404 ? '404' : errorStatus}
            </h1>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {errorStatus === 404 ? 'Page Not Found' : 'Oops! Something went wrong'}
            </h2>
            <p className="text-neutral-600 text-lg">
              {errorMessage}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-neutral-500">
              {errorStatus === 404
                ? "The page you're looking for doesn't exist."
                : 'We apologize for the inconvenience.'}
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Link
                to="/"
                className="bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition"
              >
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="bg-neutral-200 text-neutral-900 px-6 py-3 rounded-md hover:bg-neutral-300 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
