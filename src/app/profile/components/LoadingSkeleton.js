const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Skeleton */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
            
            <nav className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:w-3/4">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Orders Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6 animate-pulse"></div>
            
            {[1, 2].map((order) => (
              <div key={order} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50">
                  <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
                  {[1, 2].map((item) => (
                    <div key={item} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;