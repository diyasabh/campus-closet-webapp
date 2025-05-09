export default function Loading() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Main Steps Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information Skeleton */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="h-6 w-1/2 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-1/3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Skeleton */}
        <div className="text-center">
          <div className="space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 