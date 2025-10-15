export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300/60">
      {/* Header Skeleton */}
      <div className="bg-base-100/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            
            {/* Search and Filter Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="h-12 bg-gray-200 rounded-lg flex-1 max-w-md animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-base-100/80 backdrop-blur rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden animate-pulse">
              <div className="relative aspect-[16/10] bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
